/* 관리자: 소식 글 목록 · 저장 · 삭제 */
import { handler, json, body, fail } from '@/lib/http';
import { saveDataUrl } from '@/lib/storage';
import { allStories, getStory, putStory, deleteStory, CATS, Story } from '@/lib/story';
import { connected } from '@/lib/share';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export const GET = handler('admin', async () => json({ stories: await allStories(), connected: connected(), now: new Date().toISOString() }));

const text = (v: any, max: number) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max);

export const POST = handler('admin', async (req) => {
  const b = await body(req);
  const list: any[] = Array.isArray(b.stories) ? b.stories : [b.story || b];
  if (!list.length || list.length > 14) return fail('한 번에 14편까지 저장할 수 있어요.');
  const saved: Story[] = [];
  for (const inp of list) {
    const title = text(inp.title, 120);
    if (!title) return fail('제목을 적어 주세요.');
    const now = new Date().toISOString();
    const old = inp.id ? await getStory(String(inp.id)) : null;
    const at = new Date(inp.at || now);
    if (isNaN(at.getTime())) return fail('게시 시각이 올바르지 않아요.');
    let image = text(inp.image, 2000);
    if (image.startsWith('data:')) image = await saveDataUrl(image, 'stories');
    const s: Story = {
      id: old?.id || 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      cat: CATS[inp.cat] ? inp.cat : 'story',
      title,
      summary: text(inp.summary, 300),
      body: text(inp.body, 20000),
      image,
      tags: (Array.isArray(inp.tags) ? inp.tags : String(inp.tags || '').split(/[\s,#]+/)).map((t: any) => text(t, 30)).filter(Boolean).slice(0, 30),
      state: inp.state === 'pub' ? 'pub' : 'draft',
      at: at.toISOString(),
      created: old?.created || now,
      updated: now,
      auto: { fb: !!inp.auto?.fb, insta: !!inp.auto?.insta },
      shared: old?.shared || {},
      manual: inp.manual && typeof inp.manual === 'object' ? Object.fromEntries(Object.entries(inp.manual).filter(([, v]) => typeof v === 'string').slice(0, 10)) as Record<string, string> : old?.manual || {},
    };
    await putStory(s);
    saved.push(s);
  }
  return json({ saved, stories: await allStories() });
});

export const DELETE = handler('admin', async (req) => {
  const id = new URL(req.url).searchParams.get('id') || '';
  if (!id) return fail('지울 글을 골라 주세요.');
  await deleteStory(id);
  return json({ ok: true, stories: await allStories() });
});
