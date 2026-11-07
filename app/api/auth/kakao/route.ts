/* 카카오 로그인 시작: mode=login(로그인) | link(로그인한 작가가 계정 연결) */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { authorizeUrl, kakaoReady, site } from '@/lib/kakao';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const u = new URL(req.url), mode = u.searchParams.get('mode') === 'link' ? 'link' : 'login';
  if (!kakaoReady()) return NextResponse.redirect(`${site(req)}/login.html?kakao=off`);
  const next = u.searchParams.get('next') || '';
  if (mode === 'link') {
    const s = await getSession();
    if (s?.role !== 'artist') return NextResponse.redirect(`${site(req)}/login.html?next=${encodeURIComponent('/artist/index.html')}`);
    return NextResponse.redirect(await authorizeUrl(req, { mode, uid: s.uid }));
  }
  return NextResponse.redirect(await authorizeUrl(req, { mode, next: /^\/artist\//.test(next) ? next : '' }));
}
