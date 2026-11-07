#!/usr/bin/env node
/* IUX ART DB 이사 스크립트 — iuxart 스키마(운영 데이터)와 사진을 다른 Supabase 프로젝트로 복사합니다.
   자세한 순서는 docs/MOVE-DB.md 를 보세요.

   필요한 값 (터미널에서 앞에 붙여 실행하거나 .env.move 파일에 적기)
     OLD_DATABASE_URL   옮기기 전 DB 주소 (지금 Vercel 의 DATABASE_URL)
     NEW_DATABASE_URL   옮길 곳 DB 주소 (새 Supabase 의 Transaction pooler 주소)
     OLD_SUPABASE_URL, OLD_SERVICE_KEY   (선택) 사진도 옮길 때 — 옛 프로젝트 주소와 service_role 키
     NEW_SUPABASE_URL, NEW_SERVICE_KEY   (선택) 사진도 옮길 때 — 새 프로젝트 주소와 service_role 키
     BUCKET             사진 버킷 이름 (기본 iuxart)

   실행:  npm run move-db            (복사만 함 — 옛 DB는 그대로 남음)
          npm run move-db -- --force  (새 DB에 이미 IUX ART 데이터가 있어도 지우고 다시 복사)
   주소 앞에 pglite: 를 붙이면 내장 DB 폴더를 씁니다 (테스트용). 예) OLD_DATABASE_URL=pglite:.data/pg */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
for (const f of ['.env.move', '.env.local']) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const env = process.env, FORCE = process.argv.includes('--force');
const BUCKET = env.BUCKET || 'iuxart';
const TABLES = ['users', 'docs', 'artist_secrets', 'inquiries', 'mail_outbox', 'pw_resets']; // 순서 중요 (pw_resets → users 참조)
const SERIAL = ['users', 'inquiries', 'mail_outbox'];
const say = (...a) => console.log('·', ...a);
const die = (m) => { console.error('\n✖ ' + m + '\n'); process.exit(1); };

async function connect(url, label) {
  if (!url) die(`${label}_DATABASE_URL 이 없어요. docs/MOVE-DB.md 의 1단계를 보세요.`);
  if (url.startsWith('pglite:')) {
    const { PGlite } = await import('@electric-sql/pglite');
    const pg = new PGlite(url.slice(7)); await pg.waitReady;
    return { q: async (s, p = []) => (await pg.query(s, p)).rows, exec: (s) => pg.exec(s), end: () => pg.close() };
  }
  const postgres = (await import('postgres')).default;
  const sql = postgres(url, { prepare: false, max: 1, ssl: 'require' });
  return { q: (s, p = []) => sql.unsafe(s, p), exec: (s) => sql.unsafe(s), end: () => sql.end() };
}

async function main() {
  console.log('\nIUX ART DB 이사\n');
  if (env.OLD_DATABASE_URL === env.NEW_DATABASE_URL) die('옛 주소와 새 주소가 같아요.');
  const A = await connect(env.OLD_DATABASE_URL, 'OLD'), B = await connect(env.NEW_DATABASE_URL, 'NEW');

  // 1) 새 DB에 표 만들기 (db/schema.sql)
  const ddl = fs.readFileSync(path.join(ROOT, 'db', 'schema.sql'), 'utf8');
  for (const st of ddl.split(/;\s*\n/).map((s) => s.replace(/--.*$/gm, '').trim()).filter(Boolean)) await B.q(st);
  say('새 DB에 iuxart 표를 준비했어요.');

  const have = Number((await B.q('select count(*)::int as n from iuxart.docs'))[0].n);
  if (have && !FORCE) die(`새 DB에 이미 IUX ART 데이터(${have}건)가 있어요. 덮어쓰려면 --force 를 붙여 다시 실행하세요.`);
  if (have) { for (const t of [...TABLES].reverse()) await B.q(`delete from iuxart.${t}`); say('새 DB의 기존 데이터를 지웠어요 (--force).'); }

  // 2) 표 복사 — 같은 구조로 그대로
  const counts = {};
  for (const t of TABLES) {
    const rows = await A.q(`select * from iuxart.${t}`);
    counts[t] = rows.length;
    for (let i = 0; i < rows.length; i += 500) {
      const chunk = rows.slice(i, i + 500);
      await B.q(`insert into iuxart.${t} select * from json_populate_recordset(null::iuxart.${t}, $1::json)`, [JSON.stringify(chunk)]);
    }
    say(`${t}: ${rows.length}건 복사`);
  }
  for (const t of SERIAL) await B.q(`select setval(pg_get_serial_sequence('iuxart.${t}', 'id'), coalesce((select max(id) from iuxart.${t}), 1))`);

  // 3) 사진 (선택)
  if (env.OLD_SUPABASE_URL && env.NEW_SUPABASE_URL && env.OLD_SERVICE_KEY && env.NEW_SERVICE_KEY && env.OLD_SUPABASE_URL !== env.NEW_SUPABASE_URL) {
    const n = await copyPhotos();
    const from = `${env.OLD_SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET}/`;
    const to = `${env.NEW_SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET}/`;
    const r = await B.q(`update iuxart.docs set data = replace(data::text, $1, $2)::jsonb where data::text like '%' || $1 || '%' returning id`, [from, to]);
    say(`사진 ${n}장 복사, 사진 주소 ${r.length}곳을 새 주소로 바꿨어요.`);
  } else say('사진은 옮기지 않았어요 (옛 사진 주소가 그대로 계속 보입니다).');

  // 4) 확인
  let ok = true;
  for (const t of TABLES) {
    const n = Number((await B.q(`select count(*)::int as n from iuxart.${t}`))[0].n);
    if (n !== counts[t]) { ok = false; console.error(`✖ ${t}: 옛 ${counts[t]}건 / 새 ${n}건`); }
  }
  await A.end(); await B.end();
  if (!ok) die('건수가 맞지 않아요. 새 DB를 쓰지 말고 다시 실행해 보세요 (--force).');
  console.log('\n✔ 복사 완료. 이제 Vercel 환경 변수를 새 값으로 바꾸고 다시 배포하세요 (docs/MOVE-DB.md 4단계).\n');
}

async function copyPhotos() {
  const O = env.OLD_SUPABASE_URL.replace(/\/$/, ''), N = env.NEW_SUPABASE_URL.replace(/\/$/, '');
  const oh = { Authorization: `Bearer ${env.OLD_SERVICE_KEY}`, apikey: env.OLD_SERVICE_KEY };
  const nh = { Authorization: `Bearer ${env.NEW_SERVICE_KEY}`, apikey: env.NEW_SERVICE_KEY };
  await fetch(`${N}/storage/v1/bucket`, { method: 'POST', headers: { ...nh, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }) });
  const files = [];
  async function walk(prefix) {
    for (let offset = 0; ; offset += 1000) {
      const r = await fetch(`${O}/storage/v1/object/list/${BUCKET}`, { method: 'POST', headers: { ...oh, 'Content-Type': 'application/json' }, body: JSON.stringify({ prefix, limit: 1000, offset }) });
      if (!r.ok) die('옛 사진 목록을 읽지 못했어요: ' + (await r.text()).slice(0, 200));
      const list = await r.json();
      for (const it of list) { const p = prefix ? `${prefix}/${it.name}` : it.name; if (it.id) files.push(p); else await walk(p); }
      if (list.length < 1000) break;
    }
  }
  await walk('');
  let n = 0;
  for (const f of files) {
    const g = await fetch(`${O}/storage/v1/object/${BUCKET}/${f}`, { headers: oh });
    if (!g.ok) { console.error('  건너뜀', f); continue; }
    const buf = Buffer.from(await g.arrayBuffer());
    const p = await fetch(`${N}/storage/v1/object/${BUCKET}/${f}`, { method: 'POST', headers: { ...nh, 'Content-Type': g.headers.get('content-type') || 'image/jpeg', 'x-upsert': 'true' }, body: buf });
    if (p.ok) n++; else console.error('  실패', f, (await p.text()).slice(0, 120));
  }
  return n;
}

main().catch((e) => die(e.message || String(e)));
