import { handler, json } from '@/lib/http';
import { q } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = handler('artist', async (_req, { session }) => {
  await q('update users set kakao_id = null where id = $1', [session!.uid]);
  return json({ ok: true });
});
