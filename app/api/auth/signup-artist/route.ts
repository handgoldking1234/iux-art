/* 작가 등록: 계정 + 승인 대기 작가 + 포트폴리오 사진 → 운영자에게 메일 */
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { handler, fail, body } from '@/lib/http';
import { q, tx } from '@/lib/db';
import { loadState, writeState } from '@/lib/state';
import { uploadAll } from '@/lib/storage';
import { COOKIE, cookieOpts, signSession } from '@/lib/auth';
import { layout, sendMail } from '@/lib/mail';
import { token } from '@/lib/crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export const POST = handler(null, async (req) => {
  const b = await body(req);
  const a = b.artist || {};
  const email = String(a.email || '').trim().toLowerCase();
  const phone = String(a.phone || '').replace(/\D/g, '');
  const pw = String(b.password || '');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail('이메일 주소를 확인해 주세요.');
  if (!/^01\d{8,9}$/.test(phone)) return fail('휴대폰 번호를 확인해 주세요.');
  if (pw.length < 8) return fail('비밀번호는 8자 이상으로 정해 주세요.');
  if (!String(a.name || '').trim()) return fail('이름을 적어 주세요.');
  const dup = await q('select 1 from users where login = $1 or phone = $2', [email, phone]);
  if (dup.length) return fail('이미 등록된 이메일 또는 휴대폰 번호예요. 로그인해 주세요.', 409);

  const id = 'a' + token(8);
  const portfolio = await uploadAll((b.portfolio || []).filter((x: any) => typeof x === 'string' && x.startsWith('data:')), `portfolio/${id}`, 10);
  const str = (v: any, n: number) => String(v ?? '').slice(0, n);
  const acc = String(b.account || '').replace(/\D/g, '');
  const artist = {
    id, name: str(a.name, 30).trim(), birth: str(a.birth, 10), phone: phone.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3'), email,
    regions: (a.regions || []).map((r: any) => str(r, 20)).slice(0, 12), skills: (a.skills || []).slice(0, 15).map((k: any) => ({ k: str(k.k, 30), since: Number(k.since) || new Date().getFullYear() })),
    status: 'pending', rating: 0, tax: a.tax === 'business' ? 'business' : 'freelancer', bank: str(a.bank, 30), account: acc ? '****-**-' + acc.slice(-4) : '',
    kakao: !!a.kakao, mail: a.mail !== false, joined: new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10), bio: str(a.bio, 300) || '자기소개를 아직 쓰지 않았어요.', portfolio,
  };
  const hash = await bcrypt.hash(pw, 10);
  const uid = await tx(async (t) => {
    const s = await loadState(t);
    s.artists.push(artist);
    await writeState(t, s);
    const r = await t.q<{ id: string }>(`insert into users (login, phone, pw_hash, role, artist_id) values ($1,$2,$3,'artist',$4) returning id`, [email, phone, hash, id]);
    return String(r[0].id);
  });
  if (process.env.ADMIN_EMAIL) {
    const site = (process.env.SITE_URL || '').replace(/\/$/, '');
    await sendMail(process.env.ADMIN_EMAIL, `[IUX ART] 새 작가 등록 신청 · ${artist.name}`, layout('새 작가 등록 신청이 들어왔어요', [`${artist.name} · ${artist.phone} · ${email}`, `활동 지역: ${artist.regions.join(', ')}`, `포트폴리오 ${portfolio.length}장`], { href: `${site}/admin/artists.html`, label: '승인하러 가기' })).catch(() => {});
  }
  const res = NextResponse.json({ ok: true, id });
  res.cookies.set(COOKIE, await signSession({ uid, role: 'artist', artistId: id, email }, 14), cookieOpts(14));
  return res;
});
