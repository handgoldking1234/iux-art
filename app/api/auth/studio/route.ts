/* studio.iux.kr 관리자 로그인으로 IUX ART 관리자 들어가기
   studio 관리자 화면이 넘겨준 로그인 토큰을 studio(IUX Cloud)에 직접 물어서 확인합니다.
   → IUX ART DB가 studio와 다른 Supabase로 옮겨 가도 그대로 동작합니다. (DB를 보지 않음)
   studio 주소·공개 키는 public/js/iux-config.js 에서 읽습니다. */
import { NextResponse } from 'next/server';
import { handler, fail, body } from '@/lib/http';
import { COOKIE, cookieOpts, signSession } from '@/lib/auth';
import { config } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


export const POST = handler(null, async (req) => {
  const { token } = await body<{ token?: string }>(req, 10_000);
  if (!token || token.length > 4000) return fail('studio에서 다시 열어 주세요.', 401);
  const { supabaseUrl: STUDIO_URL, anonKey } = config().studio;
  const h = { apikey: anonKey, Authorization: `Bearer ${token}` };
  // 1) 누구인지
  const r = await fetch(`${STUDIO_URL}/auth/v1/user`, { headers: h });
  if (!r.ok) return fail('studio 로그인이 만료됐어요. studio에서 다시 열어 주세요.', 401);
  const u = await r.json();
  // 2) studio 운영자인지 — studio DB의 is_admin() 함수를 그 사람의 권한으로 호출
  const a = await fetch(`${STUDIO_URL}/rest/v1/rpc/is_admin`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: '{}' });
  const ok = a.ok && (await a.json()) === true;
  if (!ok) return fail('studio 운영자 계정만 IUX ART 관리자에 들어올 수 있어요.', 403);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await signSession({ uid: 'studio:' + u.id, role: 'admin', email: String(u.email || '') }, 1), cookieOpts(1));
  return res;
});
