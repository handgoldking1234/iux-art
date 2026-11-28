/* 관리자: 글 한 편을 페이스북·인스타그램에 지금 올리기 */
import { handler, json, body, fail } from '@/lib/http';
import { shareStory } from '@/lib/share';
import { allStories } from '@/lib/story';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export const POST = handler('admin', async (req) => {
  const b = await body(req);
  if (!b.id) return fail('올릴 글을 골라 주세요.');
  const channels = (Array.isArray(b.channels) ? b.channels : []).filter((c: any) => c === 'fb' || c === 'insta');
  if (!channels.length) return fail('올릴 곳을 골라 주세요.');
  const result = await shareStory(String(b.id), channels, { force: !!b.force });
  return json({ result, stories: await allStories() });
});
