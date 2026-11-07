/* 비밀번호 찾기: 가입한 이메일로 재설정 링크(1시간) 발송 — 가입 여부는 알려 주지 않음 */
import { handler, json, body } from '@/lib/http';
import { q } from '@/lib/db';
import { token } from '@/lib/crypto';
import { layout, sendMail } from '@/lib/mail';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const recent = new Map<string, number>();

export const POST = handler(null, async (req) => {
  const b = await body(req, 5_000);
  const id = String(b.login || '').trim().toLowerCase(), digits = id.replace(/\D/g, '');
  const ok = json({ ok: true, message: '가입된 계정이라면 메일로 재설정 링크를 보냈어요. 메일함(스팸함 포함)을 확인해 주세요.' });
  if (!id) return ok;
  if (Date.now() - (recent.get(id) || 0) < 60_000) return ok; // 1분에 한 번
  recent.set(id, Date.now());
  const u = (await q<any>(`select id, login, role from users where login = $1 or ($2 <> '' and phone = $2) limit 1`, [id, /^01\d{8,9}$/.test(digits) ? digits : '']))[0];
  if (!u) return ok;
  const t = token(24);
  await q(`insert into pw_resets (token, user_id, expires_at) values ($1, $2, now() + interval '1 hour')`, [t, u.id]);
  const site = (process.env.SITE_URL || new URL(req.url).origin).replace(/\/$/, '');
  await sendMail(u.login, '[IUX ART] 비밀번호 재설정 안내', layout('비밀번호를 다시 정해 주세요', [
    '아래 버튼을 눌러 새 비밀번호를 정하면 바로 로그인할 수 있어요.',
    '링크는 1시간 동안 한 번만 쓸 수 있어요. 요청하신 적이 없다면 이 메일은 무시해 주세요.',
  ], { href: `${site}/reset.html?t=${t}`, label: '새 비밀번호 정하기' }));
  return ok;
});
