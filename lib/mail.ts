/* 메일 발송: RESEND_API_KEY가 있으면 Resend로 보내고, 없으면 기록만 남깁니다. */
import { q } from './db';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

export function layout(title: string, lines: string[], link?: { href: string; label: string }) {
  return `<!doctype html><html><body style="margin:0;background:#F6F3F0;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#121212">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
<p style="font-weight:900;font-size:18px;margin:0 0 20px">IUX ART</p>
<div style="background:#fff;border-radius:14px;padding:28px">
<h1 style="font-size:20px;margin:0 0 14px">${esc(title)}</h1>
${lines.map((l) => `<p style="font-size:15px;line-height:1.7;margin:0 0 8px;color:#333">${esc(l)}</p>`).join('')}
${link ? `<p style="margin:22px 0 0"><a href="${link.href}" style="display:inline-block;background:#FFC800;color:#121212;font-weight:800;text-decoration:none;padding:12px 22px;border-radius:999px">${esc(link.label)}</a></p>` : ''}
</div>
<p style="font-size:12px;color:#8A8A8A;margin:18px 0 0">IUX ART · 문의 010-8388-1668</p>
</div></body></html>`;
}

export async function sendMail(to: string, subject: string, html: string) {
  if (!to || !/@/.test(to)) return { ok: false, error: 'no-address' };
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || 'IUX ART <onboarding@resend.dev>';
  let status = 'logged', error: string | null = null;
  if (key) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: [to], subject, html }),
      });
      status = r.ok ? 'sent' : 'failed';
      if (!r.ok) error = (await r.text()).slice(0, 500);
    } catch (e: any) { status = 'failed'; error = String(e?.message || e).slice(0, 500); }
  }
  await q('insert into mail_outbox (to_addr, subject, body, status, error) values ($1,$2,$3,$4,$5)', [to, subject, html, status, error]);
  return { ok: status !== 'failed', status, error };
}
