/* 카카오 로그인 돌아오는 곳: 연결된 작가면 로그인, link 모드면 현재 작가에 연결 */
import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { ensureReady } from '@/lib/boot';
import { COOKIE, cookieOpts, signSession } from '@/lib/auth';
import { kakaoUserId, readState, site } from '@/lib/kakao';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const u = new URL(req.url), base = site(req);
  const st = await readState(u.searchParams.get('state'));
  const code = u.searchParams.get('code');
  if (!st || !code) return NextResponse.redirect(`${base}/login.html?kakao=err`);
  try {
    await ensureReady();
    const kid = await kakaoUserId(req, code);
    if (st.mode === 'link' && st.uid) {
      const other = await q<any>('select id from iuxart.users where kakao_id = $1 and id <> $2', [kid, st.uid]);
      if (other.length) return NextResponse.redirect(`${base}/artist/index.html?kakao=taken`);
      await q('update iuxart.users set kakao_id = $1 where id = $2', [kid, st.uid]);
      return NextResponse.redirect(`${base}/artist/index.html?kakao=linked`);
    }
    const user = (await q<any>(`select id, login, role, artist_id from iuxart.users where kakao_id = $1 and role = 'artist'`, [kid]))[0];
    if (!user) return NextResponse.redirect(`${base}/login.html?kakao=none`);
    const res = NextResponse.redirect(base + (st.next || '/artist/index.html'));
    res.cookies.set(COOKIE, await signSession({ uid: String(user.id), role: 'artist', artistId: user.artist_id, email: user.login }, 30), cookieOpts(30));
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(`${base}/${st.mode === 'link' ? 'artist/index.html' : 'login.html'}?kakao=err`);
  }
}
