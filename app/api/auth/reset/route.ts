/* 비밀번호 재설정: 링크 토큰 확인 → 새 비밀번호 저장 → 바로 로그인 */
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { handler, fail, body } from '@/lib/http';
import { q, tx } from '@/lib/db';
import { COOKIE, cookieOpts, signSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = handler(null, async (req) => {
  const b = await body(req, 5_000);
  const t = String(b.token || ''), pw = String(b.password || '');
  if (pw.length < 8) return fail('비밀번호는 8자 이상으로 정해 주세요.');
  const hash = await bcrypt.hash(pw, 10);
  const u = await tx(async (x) => {
    const r = (await x.q<any>(`select r.user_id, u.login, u.role, u.artist_id from pw_resets r join users u on u.id = r.user_id
      where r.token = $1 and r.used_at is null and r.expires_at > now() for update`, [t]))[0];
    if (!r) return null;
    await x.q('update pw_resets set used_at = now() where token = $1', [t]);
    await x.q('update users set pw_hash = $1 where id = $2', [hash, r.user_id]);
    return r;
  });
  if (!u) return fail('링크가 만료됐거나 이미 사용됐어요. 비밀번호 찾기를 다시 해 주세요.', 410);
  await q(`delete from pw_resets where expires_at < now() - interval '1 day'`);
  const res = NextResponse.json({ ok: true, role: u.role });
  res.cookies.set(COOKIE, await signSession({ uid: String(u.user_id), role: u.role, artistId: u.artist_id || undefined, email: u.login }, 1), cookieOpts(1));
  return res;
});
