/* 고객 결과 리포트: 열람 기록 · 만족도 */
import { handler, json, body, fail } from '@/lib/http';
import { tx } from '@/lib/db';
import { loadState, writeState } from '@/lib/state';
import { layout, sendMail } from '@/lib/mail';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const kst = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 16).replace('T', ' ');

export const POST = handler(null, async (req, { params }) => {
  const b = await body(req, 10_000);
  const tok = String(params?.token || '');
  const res = await tx(async (t) => {
    const s = await loadState(t);
    const jid = Object.keys(s.reports || {}).find((k) => s.reports[k].token === tok);
    const r = jid && s.reports[jid];
    if (!r || r.state !== 'sent') return null;
    let rated = false;
    if (!r.openedAt) r.openedAt = kst();
    if (!r.rating && Number(b.rating) >= 1 && Number(b.rating) <= 5) {
      r.rating = Math.round(Number(b.rating)); r.review = String(b.review || '').slice(0, 300); r.publish = !!b.publish; r.ratedAt = kst(); rated = true;
    }
    await writeState(t, s);
    return { r, job: s.jobs.find((j: any) => j.id === jid), rated };
  });
  if (!res) return fail('리포트를 찾을 수 없어요.', 404);
  if (res.rated && process.env.ADMIN_EMAIL) {
    const site = (process.env.SITE_URL || '').replace(/\/$/, '');
    await sendMail(process.env.ADMIN_EMAIL, `[IUX ART] 고객 만족도 ${'★'.repeat(res.r.rating)} · ${res.job?.client || ''}`, layout('고객이 행사 만족도를 남겼어요', [`${res.job?.title || ''} · ${res.job?.client || ''}`, `${'★'.repeat(res.r.rating)}${'☆'.repeat(5 - res.r.rating)}`, res.r.review || '(후기 없음)', res.r.publish ? '홈페이지 소개 동의함' : ''], { href: `${site}/admin/reports.html`, label: '리포트 관리' })).catch(() => {});
  }
  return json({ ok: true });
});
