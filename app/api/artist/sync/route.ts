/* 작가 저장: 참석 신청·취소, 내 프로필, 내 현장 후기 */
import { handler, json, body } from '@/lib/http';
import { syncArtist } from '@/lib/state';
import { q } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export const POST = handler('artist', async (req, { session }) => {
  const b = await body(req);
  const view = await syncArtist(session!.artistId!, b.state || {});
  const me = view.artists.find((a: any) => a.id === session!.artistId);
  if (me?.phone) await q('update users set phone = $1 where artist_id = $2', [String(me.phone).replace(/\D/g, ''), me.id]);
  return json(view);
});
