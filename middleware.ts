/* 관리자·작가 화면은 로그인한 사람만 (HTML 자체를 막아 데이터가 잠깐도 보이지 않게) */
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const key = () => new TextEncoder().encode(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32 ? process.env.SESSION_SECRET : 'dev-only-session-secret-change-me-please-0000');

export async function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const admin = (p === '/admin' || p.startsWith('/admin/')) && p.endsWith('.html') || p === '/admin' || p === '/admin/';
  const artist = p === '/artist' || p === '/artist/' || p === '/artist/index.html';
  if (!admin && !artist) return NextResponse.next();
  if (p === '/admin/login.html') return NextResponse.next();
  let role = '';
  const t = req.cookies.get('iux_session')?.value;
  if (t) try { role = String((await jwtVerify(t, key())).payload.role || ''); } catch {}
  if ((admin && role === 'admin') || (artist && role === 'artist')) return NextResponse.next();
  const u = req.nextUrl.clone();
  u.pathname = admin ? '/admin/login.html' : '/login.html';
  u.search = '?next=' + encodeURIComponent(p + req.nextUrl.search);
  return NextResponse.redirect(u);
}

export const config = { matcher: ['/admin', '/admin/:path*', '/artist', '/artist/:path*'] };
