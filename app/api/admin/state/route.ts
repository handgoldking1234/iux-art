/* 관리자 저장 (전체 상태 + rev 잠금) → 새 메일 알림 발송 */
import { handler, json, body } from '@/lib/http';
import { saveAdmin } from '@/lib/state';
import { mailForLogs } from '@/lib/notify';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export const PUT = handler('admin', async (req) => {
  const b = await body(req);
  const before = JSON.stringify([b.state?.posts?.map((p: any) => p.photos), b.state?.artists?.map((a: any) => a.portfolio)]);
  const r = await saveAdmin(b.state, b.rev);
  const moved = JSON.stringify([r.state.posts?.map((p: any) => p.photos), r.state.artists?.map((a: any) => a.portfolio)]) !== before;
  const mails = r.added.length ? await mailForLogs(r.added, r.state) : [];
  return json({ rev: r.rev, mails: mails.length, state: moved ? { posts: r.state.posts, artists: r.state.artists } : null });
});
