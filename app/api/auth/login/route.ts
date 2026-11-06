import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { handler, fail, body } from '@/lib/http';
import { q } from '@/lib/db';
import { COOKIE, cookieOpts, signSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/* 아주 단순한 로그인 시도 제한 (서버 인스턴스별) */
const tries = new Map<string, { n: number; t: number }>();

export const POST = handler(null, async (req) => {
  const b = await body(req, 10_000);
  const id = String(b.login || '').trim().toLowerCase(), digits = id.replace(/\D/g, '');
  const key = id + '|' + (req.headers.get('x-forwarded-for') || '');
  const t = tries.get(key);
  if (t && t.n >= 8 && Date.now() - t.t < 10 * 60e3) return fail('로그인 시도가 너무 많아요. 10분 뒤 다시 해 주세요.', 429);
  const rows = await q<any>(
    `select id, login, pw_hash, role, artist_id from users where login = $1 or ($2 <> '' and phone = $2) limit 1`,
    [id, /^01\d{8,9}$/.test(digits) ? digits : '']
  );
  const u = rows[0];
  if (!u || !(await bcrypt.compare(String(b.password || ''), u.pw_hash)) || (b.role && b.role !== u.role)) {
    tries.set(key, { n: (t?.n || 0) + 1, t: Date.now() });
    return fail('아이디 또는 비밀번호가 맞지 않아요.', 401);
  }
  tries.delete(key);
  const days = u.role === 'admin' ? 1 : b.keep ? 30 : 1;
  const res = NextResponse.json({ ok: true, role: u.role });
  res.cookies.set(COOKIE, await signSession({ uid: String(u.id), role: u.role, artistId: u.artist_id || undefined, email: u.login }, days), cookieOpts(days));
  return res;
});
