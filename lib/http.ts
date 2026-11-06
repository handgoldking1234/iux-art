import { NextResponse } from 'next/server';
import { getSession, Session } from './auth';
import { ensureReady } from './boot';

export const json = (data: any, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export const fail = (msg: string, status = 400) => json({ error: msg }, status);

/* 라우트 공통: DB 준비 + 권한 확인 + 오류를 사람이 읽을 수 있는 메시지로 */
export function handler(role: 'admin' | 'artist' | 'any' | null, fn: (req: Request, ctx: { session: Session | null; params: any }) => Promise<Response>) {
  return async (req: Request, { params }: any = {}) => {
    try {
      await ensureReady();
      const session = await getSession();
      if (role && (!session || (role !== 'any' && session.role !== role))) return fail('로그인이 필요해요.', 401);
      return await fn(req, { session, params });
    } catch (e: any) {
      if (e?.status) return fail(e.message, e.status);
      console.error(e);
      return fail('서버에서 문제가 생겼어요. 잠시 뒤 다시 시도해 주세요.', 500);
    }
  };
}

export async function body<T = any>(req: Request, max = 25 * 1024 * 1024): Promise<T> {
  const len = Number(req.headers.get('content-length') || 0);
  if (len > max) throw Object.assign(new Error('보낸 내용이 너무 커요. 사진 수를 줄여 주세요.'), { status: 413 });
  try { return await req.json(); } catch { throw Object.assign(new Error('요청 형식이 올바르지 않아요.'), { status: 400 }); }
}
