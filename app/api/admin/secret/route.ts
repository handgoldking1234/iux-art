/* 관리자: 작가 정산 정보 원문 열람 (열람 기록을 남김) */
import { handler, json, fail } from '@/lib/http';
import { q } from '@/lib/db';
import { open } from '@/lib/crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = handler('admin', async (req, { session }) => {
  const id = new URL(req.url).searchParams.get('artist') || '';
  const r = await q<{ data: string }>('select data from iuxart.artist_secrets where artist_id = $1', [id]);
  if (!r[0]) return fail('작가가 아직 정산 정보를 등록하지 않았어요.', 404);
  await q('insert into iuxart.inquiries (kind, data) values ($1, $2::jsonb)', ['정산 정보 열람', JSON.stringify({ artist: id, by: session!.email, at: new Date().toISOString() })]);
  return json(open(r[0].data));
});
