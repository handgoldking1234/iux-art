/* 카카오 알림톡 (솔라피) — 관리자 화면에서 '카카오 알림톡' 채널로 보낸 알림을 실제로 발송
   필요한 값: SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_PFID(카카오 채널 연동 ID), SOLAPI_SENDER(등록된 발신번호),
            SOLAPI_TEMPLATES = {"선정 안내":"KA01TP...","공고 알림":"KA01TP...", ...}  (심사 통과한 템플릿 ID)
   값이 없거나 해당 종류의 템플릿이 없으면 보내지 않고 기록만 남깁니다. */
import crypto from 'node:crypto';
import { q } from './db';
import { State } from './state';

const site = () => (process.env.SITE_URL || '').replace(/\/$/, '');
const templates = (): Record<string, string> => { try { return JSON.parse(process.env.SOLAPI_TEMPLATES || '{}'); } catch { return {}; } };
export const alimtalkReady = () => !!(process.env.SOLAPI_API_KEY && process.env.SOLAPI_API_SECRET && process.env.SOLAPI_PFID && process.env.SOLAPI_SENDER);

function auth() {
  const date = new Date().toISOString(), salt = crypto.randomBytes(16).toString('hex');
  const sig = crypto.createHmac('sha256', process.env.SOLAPI_API_SECRET!).update(date + salt).digest('hex');
  return `HMAC-SHA256 apiKey=${process.env.SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${sig}`;
}

/* 템플릿 변수 — README의 템플릿 문안과 이름이 같아야 합니다 */
function vars(a: any, j: any, note: string) {
  return {
    '#{작가명}': a?.name || '작가',
    '#{행사명}': j?.title || note || '-',
    '#{일정}': j ? `${j.start}${j.end && j.end !== j.start ? ' ~ ' + j.end : ''} ${j.time || ''}`.trim() : '-',
    '#{장소}': j ? (j.place || j.region || '-') : '-',
    '#{내용}': note || '-',
    '#{링크}': `${site()}/artist/index.html`,
  };
}

export async function alimtalkForLogs(logs: any[], s: State) {
  const tpl = templates();
  const msgs: any[] = [];
  for (const l of logs) {
    if (l.ch !== 'kakao') continue;
    const j = s.jobs.find((x: any) => x.id === l.jid);
    for (const aid of l.to || []) {
      const a = s.artists.find((x: any) => x.id === aid);
      const to = String(a?.phone || '').replace(/\D/g, '');
      if (!a || a.kakao === false || !/^01\d{8,9}$/.test(to)) continue;
      msgs.push({ type: l.type, to, templateId: tpl[l.type], variables: vars(a, j, l.note || '') });
    }
  }
  if (!msgs.length) return [];
  const sendable = alimtalkReady() ? msgs.filter((m) => m.templateId) : [];
  let status = 'logged', error: string | null = null;
  if (sendable.length) {
    try {
      const r = await fetch('https://api.solapi.com/messages/v4/send-many/detail', {
        method: 'POST', headers: { Authorization: auth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: sendable.map((m) => ({ to: m.to, from: process.env.SOLAPI_SENDER, kakaoOptions: { pfId: process.env.SOLAPI_PFID, templateId: m.templateId, variables: m.variables, disableSms: true } })) }),
      });
      status = r.ok ? 'sent' : 'failed';
      if (!r.ok) error = (await r.text()).slice(0, 500);
    } catch (e: any) { status = 'failed'; error = String(e?.message || e).slice(0, 500); }
  }
  for (const m of msgs) {
    const st = sendable.includes(m) ? status : alimtalkReady() ? 'no-template' : 'logged';
    await q('insert into iuxart.mail_outbox (to_addr, subject, body, status, error) values ($1,$2,$3,$4,$5)', [m.to, `[알림톡] ${m.type}`, JSON.stringify(m.variables), st, st === 'failed' ? error : null]);
  }
  return msgs;
}
