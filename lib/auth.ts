/* 로그인 세션: 서명된 JWT 쿠키 (HttpOnly) */
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const COOKIE = 'iux_session';
export type Session = { uid: string; role: 'admin' | 'artist'; artistId?: string; email: string };

const key = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET(32자 이상)를 설정하세요.');
    return new TextEncoder().encode('dev-only-session-secret-change-me-please-0000');
  }
  return new TextEncoder().encode(s);
};

export async function signSession(s: Session, days = 14) {
  return new SignJWT(s as any).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(`${days}d`).sign(key());
}
export async function readToken(token?: string): Promise<Session | null> {
  if (!token) return null;
  try { return (await jwtVerify(token, key())).payload as any; } catch { return null; }
}
export async function getSession(): Promise<Session | null> { return readToken(cookies().get(COOKIE)?.value); }

export function cookieOpts(days = 14) {
  return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: days * 86400 };
}
