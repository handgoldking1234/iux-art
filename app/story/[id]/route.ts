/* 소식 글 한 편 (/story/글번호) — 글마다 주소가 따로 있어 검색에 한 편씩 올라감 */
import { ensureReady } from '@/lib/boot';
import { liveStories, viewPage, notFoundPage, html } from '@/lib/story';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await ensureReady();
    const items = await liveStories();          // 최신순
    const i = items.findIndex((s) => s.id === params.id);
    if (i < 0) return html(notFoundPage(), 404);
    return html(viewPage(items[i], items[i + 1] || null, items[i - 1] || null));
  } catch (e) {
    console.error('story view', e);
    return html(notFoundPage(), 503);
  }
}
