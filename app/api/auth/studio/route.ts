/* studio.iux.kr 관리자 로그인으로 IUX ART 관리자 들어가기
   studio 관리자 화면이 Supabase 로그인 토큰을 넘겨주면, 같은 Supabase에서 사용자를 확인하고
   IUX Cloud 운영자(public.admins)일 때만 IUX ART 관리자 세션을 만듭니다. */
import { NextResponse } from 'next/server';
import { handler, fail, body } from '@/lib/http';
import { q } from '@/lib/db';
import { COOKIE, cookieOpts, signSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = handler(null, async (req) => {
  const { token } = await body<{ token?: string }>(req, 10_000);
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return fail('studio 연결 설정이 아직 없어요. (SUPABASE_URL)', 503);
  if (!token || token.length > 4000) return fail('studio에서 다시 열어 주세요.', 401);
  const r = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${token}` } });
  if (!r.ok) return fail('studio 로그인이 만료됐어요. studio에서 다시 열어 주세요.', 401);
  const u = await r.json();
  let ok = false;
  try { ok = (await q('select 1 from public.admins where user_id = $1', [u.id])).length > 0; } catch { ok = false; }
  if (!ok) return fail('studio 운영자 계정만 IUX ART 관리자에 들어올 수 있어요.', 403);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await signSession({ uid: 'studio:' + u.id, role: 'admin', email: String(u.email || '') }, 1), cookieOpts(1));
  return res;
});
