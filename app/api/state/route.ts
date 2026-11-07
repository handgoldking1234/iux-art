/* 화면 데이터: mode=admin | artist | public | report(&r=토큰) */
import { handler, json, fail } from '@/lib/http';
import { loadState, artistView, publicView, reportView } from '@/lib/state';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = handler(null, async (req, { session }) => {
  const u = new URL(req.url), mode = u.searchParams.get('mode');
  const s = await loadState();
  if (mode === 'admin') {
    if (session?.role !== 'admin') return fail('로그인이 필요해요.', 401);
    return json({ ...s, me: null });
  }
  if (mode === 'artist') {
    if (session?.role !== 'artist' || !session.artistId) return fail('로그인이 필요해요.', 401);
    return json({ ...artistView(s, session.artistId), me: session.artistId });
  }
  if (mode === 'public') return json(publicView(s));
  if (mode === 'report') {
    const v = reportView(s, String(u.searchParams.get('r') || ''), session?.role === 'admin');
    return v ? json(v) : fail('리포트를 찾을 수 없어요.', 404);
  }
  return fail('mode를 확인해 주세요.');
});
