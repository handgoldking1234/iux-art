/* 운영 데이터: DB 문서 ↔ 화면용 상태(IUX_SEED와 같은 모양) */
import { q, tx, Tx } from './db';
import { uploadAll } from './storage';

export const VERSION = 9;
const LISTS = ['artists', 'jobs', 'quotes', 'posts', 'reviews'] as const;
const MAX_LOGS = 1000;

export type State = Record<string, any>;
export class Conflict extends Error { status = 409; }
export class Bad extends Error { status = 400; }

const reviewId = (r: any) => `${r.job}:${r.a}`;
const idOf = (coll: string, x: any) => (coll === 'reviews' ? reviewId(x) : String(x.id));

export async function loadState(t?: Tx): Promise<State> {
  const run: Tx['q'] = t ? (s, p) => t.q(s, p) : q;
  const rows = await run<{ coll: string; id: string; data: any }>('select coll, id, data from iuxart.docs');
  const s: State = { version: VERSION, skills: [], regions: [], settings: {}, artists: [], jobs: [], quotes: [], posts: [], reviews: [], logs: [], paid: {}, reports: {}, rev: 0 };
  const ord: Record<string, Map<any, number>> = {};
  for (const r of rows) {
    const d = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
    if (r.coll === 'meta') { s[r.id] = d; continue; }
    if (r.coll === 'paid') { s.paid[r.id] = d.d; continue; }
    if (r.coll === 'reports') { s.reports[r.id] = d; continue; }
    if ((LISTS as readonly string[]).includes(r.coll)) {
      const { _o, ...item } = d;
      s[r.coll].push(item);
      (ord[r.coll] ||= new Map()).set(item, typeof _o === 'number' ? _o : 1e9);
    }
  }
  for (const c of LISTS) s[c].sort((a: any, b: any) => (ord[c]?.get(a) ?? 0) - (ord[c]?.get(b) ?? 0));
  s.rev = Number(s.rev) || 0;
  return s;
}

async function put(t: Tx, coll: string, id: string, data: any) {
  await t.q(
    `insert into iuxart.docs (coll, id, data, updated_at) values ($1,$2,$3::jsonb, now())
     on conflict (coll, id) do update set data = excluded.data, updated_at = now() where docs.data is distinct from excluded.data`,
    [coll, id, JSON.stringify(data)]
  );
}

/* 상태 전체를 저장 (관리자 저장·작가 동기화 공통). keepArtists: 화면에서 빠진 작가도 지우지 않음 */
export async function writeState(t: Tx, s: State, opts: { keepArtists?: boolean } = {}) {
  for (const k of ['skills', 'regions', 'settings']) if (s[k] !== undefined) await put(t, 'meta', k, s[k]);
  await put(t, 'meta', 'logs', (s.logs || []).slice(0, MAX_LOGS));
  for (const c of LISTS) {
    const items: any[] = s[c] || [];
    const ids = items.map((x) => idOf(c, x));
    for (let i = 0; i < items.length; i++) await put(t, c, ids[i], { ...items[i], _o: i });
    if (!(c === 'artists' && opts.keepArtists)) await t.q('delete from iuxart.docs where coll = $1 and not (id = any($2::text[]))', [c, ids]);
  }
  const paidIds = Object.keys(s.paid || {});
  for (const k of paidIds) await put(t, 'paid', k, { d: s.paid[k] });
  await t.q(`delete from iuxart.docs where coll = 'paid' and not (id = any($1::text[]))`, [paidIds]);
  const repIds = Object.keys(s.reports || {});
  for (const k of repIds) await put(t, 'reports', k, s.reports[k]);
  await t.q(`delete from iuxart.docs where coll = 'reports' and not (id = any($1::text[]))`, [repIds]);
  const rev = (Number(s.rev) || 0) + 1;
  await put(t, 'meta', 'rev', rev);
  return rev;
}

/* 화면에서 새로 올린 사진(data: URL)을 저장소로 옮기고 주소로 바꿈 */
export async function moveUploads(s: State) {
  for (const p of s.posts || []) if (Array.isArray(p.photos)) p.photos = await uploadAll(p.photos, `posts/${p.job}`, 12);
  for (const a of s.artists || []) if (Array.isArray(a.portfolio)) a.portfolio = await uploadAll(a.portfolio, `portfolio/${a.id}`, 10);
}

const logKey = (l: any) => [l.at, l.ch, l.type, l.jid, (l.to || []).join(',')].join('|');
export function newLogs(before: any[], after: any[]) {
  const seen = new Set((before || []).map(logKey));
  return (after || []).filter((l) => !seen.has(logKey(l)));
}

/* 관리자 저장: rev가 맞을 때만 */
export async function saveAdmin(incoming: State, rev: number) {
  if (!incoming || !Array.isArray(incoming.jobs) || !Array.isArray(incoming.artists)) throw new Bad('저장할 데이터 형식이 올바르지 않아요.');
  await moveUploads(incoming);
  return tx(async (t) => {
    const cur = await loadState(t);
    if (Number(rev) !== cur.rev) throw new Conflict('다른 곳에서 먼저 저장된 내용이 있어요. 새로고침 후 다시 해 주세요.');
    const added = newLogs(cur.logs, incoming.logs);
    incoming.rev = cur.rev;
    const nrev = await writeState(t, incoming, { keepArtists: true });
    return { rev: nrev, added, state: incoming };
  });
}

/* ---------- 작가 화면 ---------- */
const PUBLIC_ARTIST = ['id', 'name', 'status', 'skills', 'regions', 'rating', 'joined'];
const pick = (o: any, keys: string[]) => Object.fromEntries(keys.filter((k) => k in o).map((k) => [k, o[k]]));
const stripJob = ({ clientEmail, clientTel, clientName, memo, ...j }: any) => j;

export function artistView(s: State, me: string): State {
  return {
    version: VERSION, rev: s.rev, skills: s.skills, regions: s.regions, settings: s.settings,
    artists: s.artists.map((a: any) => (a.id === me ? a : { ...pick(a, PUBLIC_ARTIST), kakao: false, mail: false, bio: '', portfolio: [] })),
    jobs: s.jobs.filter((j: any) => !j.hidden || j.apps?.some((p: any) => p.a === me)).map(stripJob),
    logs: (s.logs || []).filter((l: any) => (l.to || []).includes(me)),
    paid: Object.fromEntries(Object.entries(s.paid || {}).filter(([k]) => k.endsWith(':' + me))),
    posts: (s.posts || []).filter((p: any) => p.a === me),
    reviews: [], reports: {}, quotes: [],
  };
}

const today = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10); // 한국 시간
const MASK_ACC = /^\*{4}-\*{2}-\d{0,6}$/;

function cleanTaxInfo(t: any) {
  if (!t || typeof t !== 'object') return undefined;
  if (t.kind === 'biz') return { kind: 'biz', bizNo: String(t.bizNo || '').replace(/^(\d{3}-\d{2}-).*/, '$1*****'), bizName: String(t.bizName || '').slice(0, 60), invoiceMail: String(t.invoiceMail || '').slice(0, 120), holder: String(t.holder || '').slice(0, 40), at: String(t.at || '').slice(0, 10) };
  if (t.kind === 'rrn') return { kind: 'rrn', masked: String(t.masked || '').replace(/^(\d{6}-\d).*/, '$1******'), foreign: !!t.foreign, visa: String(t.visa || '').slice(0, 20), holder: String(t.holder || '').slice(0, 40), at: String(t.at || '').slice(0, 10) };
  return undefined;
}

/* 작가 저장: 서버 최신 상태에 본인이 바꿀 수 있는 것만 반영 */
export async function syncArtist(me: string, incoming: State) {
  const inArt = (incoming.artists || []).find((a: any) => a.id === me) || {};
  const inPosts = (incoming.posts || []).filter((p: any) => p.a === me);
  for (const p of inPosts) if (Array.isArray(p.photos)) p.photos = await uploadAll(p.photos, `posts/${p.job}`, 12);
  if (Array.isArray(inArt.portfolio)) inArt.portfolio = await uploadAll(inArt.portfolio, `portfolio/${me}`, 10);

  return tx(async (t) => {
    const s = await loadState(t);
    const a = s.artists.find((x: any) => x.id === me);
    if (!a) throw new Bad('작가 정보를 찾을 수 없어요.');

    /* 1) 참석 신청·취소: 모집 중 공고, 활동 중 작가만 */
    const inJobs = new Map((incoming.jobs || []).map((j: any) => [j.id, j]));
    for (const j of s.jobs) {
      const ij: any = inJobs.get(j.id); if (!ij) continue;
      const mine = (j.apps ||= []).find((p: any) => p.a === me);
      const want = (ij.apps || []).find((p: any) => p.a === me);
      if (j.status !== 'open') continue;
      if (want && !mine && a.status === 'active' && a.skills?.some((k: any) => k.k === j.skill)) j.apps.push({ a: me, at: String(want.at || '').slice(0, 16), s: 'applied' });
      if (!want && mine && mine.s === 'applied') j.apps = j.apps.filter((p: any) => p.a !== me);
    }

    /* 2) 내 프로필·정산 정보 (허용 항목만) */
    const str = (v: any, n: number) => String(v ?? '').slice(0, n);
    if (inArt.phone !== undefined) a.phone = str(inArt.phone, 20);
    if (inArt.email !== undefined) a.email = str(inArt.email, 120);
    if (typeof inArt.bio === 'string') a.bio = str(inArt.bio, 300);
    if (Array.isArray(inArt.skills) && inArt.skills.length) a.skills = inArt.skills.slice(0, 20).map((k: any) => ({ k: str(k.k, 30), since: Number(k.since) || new Date().getFullYear() }));
    if (Array.isArray(inArt.regions) && inArt.regions.length) a.regions = inArt.regions.filter((r: any) => s.regions.includes(r));
    if (Array.isArray(inArt.portfolio)) a.portfolio = inArt.portfolio.filter((x: any) => typeof x === 'string' && !x.startsWith('data:')).slice(0, 10);
    if (typeof inArt.kakao === 'boolean') a.kakao = inArt.kakao;
    if (typeof inArt.mail === 'boolean') a.mail = inArt.mail;
    if (inArt.bank !== undefined) a.bank = str(inArt.bank, 30);
    if (typeof inArt.account === 'string' && MASK_ACC.test(inArt.account)) a.account = inArt.account;
    if (inArt.tax === 'freelancer' || inArt.tax === 'business') a.tax = inArt.tax;
    const ti = cleanTaxInfo(inArt.taxInfo); if (ti) a.taxInfo = ti;

    /* 3) 내 현장 후기: 선정된 행사, 행사일부터. 상태는 서버가 정함 */
    const mineBefore = (s.posts || []).filter((p: any) => p.a === me);
    const others = (s.posts || []).filter((p: any) => p.a !== me);
    const keep: any[] = [];
    for (const p of inPosts) {
      const j = s.jobs.find((x: any) => x.id === p.job);
      if (!j || !j.apps?.some((x: any) => x.a === me && x.s === 'selected') || j.start > today()) continue;
      const old = mineBefore.find((x: any) => x.id === p.id || x.job === p.job);
      const row = {
        id: old?.id || str(p.id, 30), job: j.id, a: me, at: str(p.at, 16), subj: true,
        title: str(p.title, 80), mood: str(p.mood, 1000), tags: (p.tags || []).slice(0, 4).map((x: any) => str(x, 20)),
        count: Math.max(0, Math.min(100000, Number(p.count) || 0)), guests: str(p.guests, 20),
        photos: (p.photos || []).filter((x: any) => typeof x === 'string' && !x.startsWith('data:')).slice(0, 12),
        state: j.photoOk ? 'pending' : 'private',
      };
      const same = old && ['title', 'mood', 'count'].every((k) => (old as any)[k] === (row as any)[k]) && JSON.stringify(old.photos) === JSON.stringify(row.photos) && JSON.stringify(old.tags) === JSON.stringify(row.tags);
      keep.push(same ? old : row);
    }
    s.posts = [...others, ...keep];
    const rev = await writeState(t, s);
    s.rev = rev;
    return artistView(s, me);
  });
}

/* ---------- 공개 화면 ---------- */
/* 행사 후기 '현장 스케치': 게시된 후기 + 사진 동의 행사만, 업체·작가 실명 없이 */
export function publicView(s: State): State {
  const jobs = new Map(s.jobs.map((j: any) => [j.id, j]));
  const posts = (s.posts || []).filter((p: any) => p.state === 'published' && (jobs.get(p.job) as any)?.photoOk);
  const jids = new Set(posts.map((p: any) => p.job));
  const aids = new Set(posts.map((p: any) => p.a));
  return {
    version: VERSION, skills: s.skills, regions: s.regions, settings: {},
    jobs: s.jobs.filter((j: any) => jids.has(j.id)).map((j: any) => ({ id: j.id, skill: j.skill, region: j.region, start: j.start, end: j.end, hours: j.hours, photoOk: true, apps: [] })),
    artists: s.artists.filter((a: any) => aids.has(a.id)).map((a: any) => ({ id: a.id, skills: a.skills })),
    posts: posts.map(({ id, job, a, at, state, count, title, guests, tags, mood, photos }: any) => ({ id, job, a, at, state, count, title, guests, tags, mood, photos })),
    logs: [], paid: {}, reviews: [], reports: {}, quotes: [],
  };
}

/* 고객 결과 리포트: 토큰에 해당하는 행사 하나만 */
export function reportView(s: State, token: string, admin = false): State | null {
  const jid = token ? Object.keys(s.reports || {}).find((k) => s.reports[k].token === token) : undefined;
  if (!jid) return null;
  const r = s.reports[jid];
  if (!admin && r.state !== 'sent') return null;
  if (!admin && r.sentAt) { const exp = new Date(r.sentAt.slice(0, 10)); exp.setDate(exp.getDate() + 90); if (exp < new Date()) return null; }
  const j = s.jobs.find((x: any) => x.id === jid);
  if (!j) return null;
  const sel = new Set((j.apps || []).filter((p: any) => p.s === 'selected').map((p: any) => p.a));
  return {
    version: VERSION, skills: s.skills, regions: s.regions, settings: {},
    jobs: [stripJob(j)],
    artists: s.artists.filter((a: any) => sel.has(a.id)).map((a: any) => ({ id: a.id, name: '', skills: a.skills, status: a.status, regions: [] })),
    posts: (s.posts || []).filter((p: any) => p.job === jid && p.state !== 'hidden'),
    reports: { [jid]: { ...r, email: undefined } },
    logs: [], paid: {}, reviews: [], quotes: [],
  };
}
