/* 소식 목록 (/story, /story?cat=story|news|promo) — 검색 엔진이 읽을 수 있게 서버에서 완성해 내보냄 */
import { ensureReady } from '@/lib/boot';
import { liveStories, listPage, html, CATS } from '@/lib/story';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const cat = new URL(req.url).searchParams.get('cat') || '';
  let items: Awaited<ReturnType<typeof liveStories>> = [];
  try {
    await ensureReady();
    items = await liveStories();
  } catch (e) {
    console.error('story list', e);   // DB가 잠깐 안 되어도 빈 목록으로 화면은 보여 줌
  }
  if (cat && CATS[cat]) items = items.filter((s) => s.cat === cat);
  return html(listPage(items, CATS[cat] ? cat : ''));
}
