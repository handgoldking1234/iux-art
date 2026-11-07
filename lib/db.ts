/* DB 연결: 운영은 DATABASE_URL(Supabase Postgres), 로컬·테스트는 DB_DRIVER=pglite (내장 Postgres) */
import fs from 'node:fs';
import path from 'node:path';

type Row = Record<string, any>;
export interface Tx { q<T = Row>(sql: string, params?: any[]): Promise<T[]>; }

type Impl = { q: Tx['q']; tx: <T>(fn: (t: Tx) => Promise<T>) => Promise<T> };
let impl: Impl | null = null;
const g = globalThis as any;

async function init(): Promise<Impl> {
  if (impl) return impl;
  if (g.__iuxdb) return (impl = g.__iuxdb);
  /* Vercel 등 서버리스에서는 내장 DB를 쓸 수 없음 → DATABASE_URL 이 없으면 '준비 중' 응답 */
  if (!process.env.DATABASE_URL && process.env.DB_DRIVER !== 'pglite' && (process.env.VERCEL || process.env.NODE_ENV === 'production' && !process.env.ALLOW_PGLITE)) {
    throw Object.assign(new Error('서버 DB가 아직 연결되지 않았어요. 관리자에게 문의해 주세요.'), { status: 503 });
  }
  if (process.env.DB_DRIVER === 'pglite' || !process.env.DATABASE_URL) {
    const { PGlite } = await import('@electric-sql/pglite');
    const dir = process.env.PGLITE_DIR || path.join(process.cwd(), '.data', 'pg');
    fs.mkdirSync(dir, { recursive: true });
    const pg: any = new PGlite(dir);
    await pg.waitReady;
    let chain: Promise<any> = Promise.resolve();
    const q = async (sql: string, params: any[] = []) => (await pg.query(sql, params)).rows;
    impl = {
      q,
      // pglite는 연결이 하나라 트랜잭션을 순서대로 실행
      tx: (fn) => {
        const run = chain.then(() => pg.transaction((t: any) => fn({ q: async (s: string, p: any[] = []) => (await t.query(s, p)).rows })));
        chain = run.catch(() => {}); // 실패한 트랜잭션이 다음 요청을 막지 않게
        return run;
      },
    };
  } else {
    const postgres = (await import('postgres')).default;
    const sql = postgres(process.env.DATABASE_URL!, { prepare: false, max: 3, idle_timeout: 20, ssl: 'require' });
    impl = {
      q: (s, p = []) => sql.unsafe(s, p) as any,
      tx: (fn) => sql.begin((t: any) => fn({ q: (s: string, p: any[] = []) => t.unsafe(s, p) })) as any,
    };
  }
  g.__iuxdb = impl;
  return impl;
}

export async function q<T = Row>(sql: string, params: any[] = []): Promise<T[]> { return (await init()).q<T>(sql, params); }
export async function tx<T>(fn: (t: Tx) => Promise<T>): Promise<T> { return (await init()).tx(fn); }

export async function ensureSchema() {
  const { SCHEMA: ddl } = await import('./schema');
  const db = await init();
  for (const stmt of ddl.split(/;\s*\n/).map((s) => s.replace(/--.*$/gm, '').trim()).filter(Boolean)) await db.q(stmt);
}
