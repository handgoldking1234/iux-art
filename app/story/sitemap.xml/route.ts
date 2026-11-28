/* 소식 글 사이트맵 — 글을 올리면 자동으로 늘어남 (robots.txt 에 등록) */
import { ensureReady } from '@/lib/boot';
import { liveStories, storyUrl, xml, SITE, esc } from '@/lib/story';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  let items: Awaited<ReturnType<typeof liveStories>> = [];
  try { await ensureReady(); items = await liveStories(); } catch (e) { console.error('story sitemap', e); }
  const day = (iso: string) => new Date(iso).toISOString().slice(0, 10);
  const urls = [`  <url><loc>${SITE}/story</loc>${items[0] ? `<lastmod>${day(items[0].at)}</lastmod>` : ''}<priority>0.7</priority></url>`]
    .concat(items.map((s) => `  <url><loc>${esc(storyUrl(s))}</loc><lastmod>${day(s.updated || s.at)}</lastmod><priority>0.6</priority></url>`));
  return xml(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
}
