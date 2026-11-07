/* 카카오 로그인 (REST API) — KAKAO_REST_KEY, (선택) KAKAO_CLIENT_SECRET */
import { SignJWT, jwtVerify } from 'jose';

export const kakaoReady = () => !!process.env.KAKAO_REST_KEY;
const secret = () => new TextEncoder().encode((process.env.SESSION_SECRET || 'dev-only-session-secret-change-me-please-0000') + ':kakao');
export const site = (req: Request) => (process.env.SITE_URL || new URL(req.url).origin).replace(/\/$/, '');
const redirectUri = (req: Request) => `${site(req)}/api/auth/kakao/callback`;

export type KState = { mode: 'login' | 'link'; uid?: string; next?: string };

export async function authorizeUrl(req: Request, st: KState) {
  const state = await new SignJWT(st as any).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('10m').sign(secret());
  const u = new URL('https://kauth.kakao.com/oauth/authorize');
  u.searchParams.set('client_id', process.env.KAKAO_REST_KEY!);
  u.searchParams.set('redirect_uri', redirectUri(req));
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('state', state);
  return u.toString();
}

export async function readState(s: string | null): Promise<KState | null> {
  if (!s) return null;
  try { return (await jwtVerify(s, secret())).payload as any; } catch { return null; }
}

/* 인가 코드 → 카카오 회원번호 */
export async function kakaoUserId(req: Request, code: string): Promise<string> {
  const form = new URLSearchParams({ grant_type: 'authorization_code', client_id: process.env.KAKAO_REST_KEY!, redirect_uri: redirectUri(req), code });
  if (process.env.KAKAO_CLIENT_SECRET) form.set('client_secret', process.env.KAKAO_CLIENT_SECRET);
  const t = await fetch('https://kauth.kakao.com/oauth/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: form });
  if (!t.ok) throw new Error('kakao token ' + (await t.text()).slice(0, 200));
  const { access_token } = await t.json();
  const me = await fetch('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: `Bearer ${access_token}` } });
  if (!me.ok) throw new Error('kakao me ' + (await me.text()).slice(0, 200));
  const j = await me.json();
  return String(j.id);
}
