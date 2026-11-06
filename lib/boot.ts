/* 첫 요청 때 테이블을 만들고, 비어 있으면 기본 설정과 관리자 계정을 넣습니다. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import bcrypt from 'bcryptjs';
import { q, tx, ensureSchema } from './db';
import { writeState, loadState, State } from './state';

let ready: Promise<void> | null = null;
const g = globalThis as any;

/* public/admin/js/data.js 의 시안 데이터 (단가표·지역·설정 기본값, 데모 데이터) */
export function seedData(): State {
  const src = fs.readFileSync(path.join(process.cwd(), 'public', 'admin', 'js', 'data.js'), 'utf8');
  const ctx: any = {};
  vm.runInNewContext(src + '\n;this.IUX_SEED = IUX_SEED;', ctx);
  return JSON.parse(JSON.stringify(ctx.IUX_SEED));
}

export async function initData(opts: { demo?: boolean; log?: (m: string) => void } = {}) {
  const log = opts.log || (() => {});
  await ensureSchema();
  const has = await q<{ n: number }>(`select count(*)::int as n from docs where coll = 'meta' and id = 'settings'`);
  /* 처음 실행이면 기본값을 넣고, SEED_DEMO=1 이면 시안 데모 데이터로 시작 */
  if (!has[0]?.n && process.env.SEED_DEMO === '1') opts = { ...opts, demo: true };
  if (!has[0]?.n || opts.demo) {
    const seed = seedData();
    const base: State = opts.demo ? seed : { ...seed, artists: [], jobs: [], quotes: [], posts: [], reviews: [], logs: [], paid: {}, reports: {} };
    await tx(async (t) => {
      const cur = await loadState(t);
      if (opts.demo) {
        await t.q(`delete from docs where coll <> 'meta'`);
        await t.q(`delete from users where role = 'artist'`);
      }
      base.rev = cur.rev;
      await writeState(t, base);
    });
    log(opts.demo ? '데모 데이터를 넣었어요.' : '기본 단가표·지역·운영 설정을 넣었어요.');
    if (opts.demo) {
      const hash = await bcrypt.hash(process.env.DEMO_ARTIST_PASSWORD || 'artist1234', 10);
      for (const a of seed.artists) {
        await q(`insert into users (login, phone, pw_hash, role, artist_id) values ($1,$2,$3,'artist',$4) on conflict (login) do nothing`, [String(a.email).toLowerCase(), String(a.phone || '').replace(/\D/g, ''), hash, a.id]);
      }
      log(`데모 작가 ${seed.artists.length}명 로그인: 각 작가 이메일 / ${process.env.DEMO_ARTIST_PASSWORD ? '(DEMO_ARTIST_PASSWORD)' : 'artist1234'}`);
    }
  }
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const pw = process.env.ADMIN_PASSWORD || '';
  if (email && pw) {
    const ex = await q(`select id from users where login = $1`, [email]);
    if (!ex.length) {
      await q(`insert into users (login, pw_hash, role) values ($1,$2,'admin')`, [email, await bcrypt.hash(pw, 10)]);
      log(`관리자 계정을 만들었어요: ${email}`);
    }
  }
}

export function ensureReady() {
  if (g.__iuxReady) return g.__iuxReady as Promise<void>;
  ready = initData().catch((e) => { g.__iuxReady = null; throw e; });
  g.__iuxReady = ready;
  return ready;
}
