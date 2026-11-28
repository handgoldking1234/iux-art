/* 소식 글 RSS — 네이버 서치어드바이저에 한 번 제출해 두면 새 글을 알아서 가져감 */
import { ensureReady } from '@/lib/boot';
import { liveStories, storyUrl, xml, SITE, esc, CATS } from '@/lib/story';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  let items: Awaited<ReturnType<typeof liveStories>> = [];
  try { await ensureReady(); items = await liveStories(); } catch (e) { console.error('story rss', e); }
  const body = items.slice(0, 50).map((s) => {
    const text = s.summary || s.body.replace(/\s+/g, ' ').slice(0, 200);
    return `<item><title>${esc(s.title)}</title><link>${esc(storyUrl(s))}</link><guid isPermaLink="true">${esc(storyUrl(s))}</guid><category>${esc(CATS[s.cat] || '소식')}</category><pubDate>${new Date(s.at).toUTCString()}</pubDate><description>${esc(text)}</description></item>`;
  }).join('\n');
  return xml(
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>IUX ART 소식</title><link>${SITE}/story</link><description>IUX ART의 현장 이야기, 새 프로그램과 행사 소식</description><language>ko</language>\n${body}\n</channel></rss>\n`,
    'application/rss+xml'
  );
}
