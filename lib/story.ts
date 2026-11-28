/* 소식 글(스토리·뉴스·홍보): 저장·불러오기와 공개 페이지 만들기.
   글은 iuxart.docs 의 coll='stories' 에 한 건씩 저장합니다.
   공개 페이지는 public/news-view.html 을 틀로 써서 서버에서 완성된 HTML로 내보냅니다.
   (글마다 주소가 따로 있고 내용이 HTML에 들어 있어야 네이버·구글이 검색에 올립니다) */
import fs from 'node:fs';
import path from 'node:path';
import { q } from './db';

export const SITE = 'https://art.iux.kr';
export const CATS: Record<string, string> = { story: '스토리', news: '뉴스', promo: '홍보' };

export type ShareResult = { ok: boolean; at: string; link?: string; error?: string };
export type Story = {
  id: string;
  cat: string;              // story · news · promo
  title: string;
  summary: string;          // 검색 결과와 SNS 미리보기에 쓰는 한두 문장
  body: string;             // 본문 (빈 줄로 문단 구분, '## '는 소제목, '- '는 목록)
  image: string;            // 대표 이미지 주소
  tags: string[];
  state: 'draft' | 'pub';
  at: string;               // 게시 시각 (ISO). 미래면 그 시각부터 보임 = 예약
  created: string;
  updated: string;
  auto: { fb?: boolean; insta?: boolean };          // 게시 시각이 되면 자동으로 올릴 곳
  shared: Record<string, ShareResult>;              // 자동 채널에 올린 결과
  manual: Record<string, string>;                   // 수동 채널에 올렸다고 표시한 시각
};

const parse = (d: any): Story => (typeof d === 'string' ? JSON.parse(d) : d);

export async function allStories(): Promise<Story[]> {
  const rows = await q<{ data: any }>(`select data from iuxart.docs where coll = 'stories'`);
  return rows.map((r) => parse(r.data)).sort((a, b) => (a.at < b.at ? 1 : -1));
}
export async function getStory(id: string): Promise<Story | null> {
  const rows = await q<{ data: any }>(`select data from iuxart.docs where coll = 'stories' and id = $1`, [id]);
  return rows.length ? parse(rows[0].data) : null;
}
export async function putStory(s: Story) {
  await q(
    `insert into iuxart.docs (coll, id, data, updated_at) values ('stories', $1, $2::jsonb, now())
     on conflict (coll, id) do update set data = excluded.data, updated_at = now()`,
    [s.id, JSON.stringify(s)]
  );
}
export async function deleteStory(id: string) {
  await q(`delete from iuxart.docs where coll = 'stories' and id = $1`, [id]);
}

/* 지금 홈페이지에 보이는 글인가 (게시 상태이고 게시 시각이 지남) */
export const isLive = (s: Story, now = Date.now()) => s.state === 'pub' && new Date(s.at).getTime() <= now;
export async function liveStories(): Promise<Story[]> {
  const now = Date.now();
  return (await allStories()).filter((s) => isLive(s, now));
}

export const storyUrl = (s: { id: string }) => `${SITE}/story/${encodeURIComponent(s.id)}`;
export const absUrl = (u: string) => (!u ? '' : /^https?:\/\//i.test(u) ? u : SITE + (u.startsWith('/') ? u : '/' + u));

export function esc(v: any): string {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
export function kDate(iso: string): string {
  // 한국 시간 기준 날짜 (2026.11.28)
  const d = new Date(new Date(iso).getTime() + 9 * 3600 * 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}.${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())}`;
}

/* 본문 글을 HTML로: 빈 줄 = 문단, '## ' = 소제목, '- ' = 목록, 주소는 링크로 */
export function bodyHtml(text: string): string {
  const link = (t: string) => t.replace(/https?:\/\/[^\s<]+/g, (u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
  const out: string[] = [];
  for (const block of String(text || '').replace(/\r/g, '').split(/\n{2,}/)) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines[0].startsWith('## ')) {
      out.push(`<h3>${esc(lines[0].slice(3))}</h3>`);
      lines.shift();
      if (!lines.length) continue;
    }
    if (lines.every((l) => l.startsWith('- '))) out.push('<ul>' + lines.map((l) => `<li>${link(esc(l.slice(2)))}</li>`).join('') + '</ul>');
    else out.push('<p>' + lines.map((l) => link(esc(l))).join('<br>') + '</p>');
  }
  return out.join('\n    ');
}

/* ── 공개 페이지 틀 ─────────────────────────────── */
let tpl: string | null = null;
function template(): string {
  if (tpl) return tpl;
  return (tpl = fs.readFileSync(path.join(process.cwd(), 'public', 'news-view.html'), 'utf8'));
}

export function page(o: { title: string; desc: string; url: string; image?: string; type?: string; main: string; head?: string }): string {
  const title = esc(o.title + ' | IUX ART');
  const desc = esc(o.desc);
  const url = esc(o.url);
  const image = esc(o.image || SITE + '/images/og.jpg');
  let h = template();
  const sub = (re: RegExp, to: string) => { h = h.replace(re, () => to); };
  sub(/<head>/, '<head>\n<base href="/">');
  sub(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  sub(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`);
  sub(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  sub(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="${o.type || 'website'}">`);
  sub(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`);
  sub(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${desc}">`);
  sub(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  sub(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${image}">`);
  sub(/<meta property="og:image:width"[^>]*><meta property="og:image:height"[^>]*>/, '');
  sub(/<\/head>/, `<link rel="alternate" type="application/rss+xml" title="IUX ART 소식" href="${SITE}/story/rss.xml">\n${o.head || ''}</head>`);
  sub(/<main>[\s\S]*<\/main>/, `<main>\n${o.main}\n</main>`);
  return h;
}

export const html = (body: string, status = 200) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': status >= 400 ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=300' } });
export const xml = (body: string, type = 'application/xml') =>
  new Response(body, { headers: { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });

const hero = (crumb: string) => `<section class="subhero center ">
  <div class="wrap rv">
    <nav class="crumb" aria-label="현재 위치"><a href="index.html">홈</a><i data-lucide="chevron-right"></i>${crumb}</nav>
    <span class="eyebrow">Story</span>
    <h1>소식</h1>
    <p class="lead" style="margin-inline:auto">IUX ART의 현장 이야기와 새 소식, 행사 안내를 전합니다.</p>
  </div>
</section>`;

export function listPage(items: Story[], cat: string): string {
  const tab = (k: string, label: string) =>
    `<a class="btn btn-sm ${k === cat ? 'btn-dark' : 'btn-ghost'}" href="/story${k ? '?cat=' + k : ''}"${k === cat ? ' aria-current="page"' : ''}>${label}</a>`;
  const rows = items.length
    ? items.map((s) => `<tr><td class="hm"><span class="st">${esc(CATS[s.cat] || '소식')}</span></td><td class="t"><a href="/story/${encodeURIComponent(s.id)}">${esc(s.title)}</a></td><td class="hm">${kDate(s.at)}</td></tr>`).join('\n')
    : '<tr><td colspan="3" style="padding:48px 10px">아직 올라온 글이 없습니다.</td></tr>';
  const main = `${hero('<span>소식</span>')}
<section class="sec-sm"><div class="wrap">
  <div class="toolbar"><span class="count">전체 <b>${items.length}</b>건</span>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${tab('', '전체')}${Object.keys(CATS).map((k) => tab(k, CATS[k])).join('')}</div>
  </div>
  <div class="board-wrap"><table class="board">
    <thead><tr><th class="hm" style="width:100px">분류</th><th>제목</th><th class="hm" style="width:120px">작성일</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
</div></section>`;
  const name = cat && CATS[cat] ? CATS[cat] : '소식';
  return page({
    title: name,
    desc: 'IUX ART의 현장 이야기, 새 프로그램과 행사 소식, 이벤트 안내를 전합니다.',
    url: `${SITE}/story${cat && CATS[cat] ? '?cat=' + cat : ''}`,
    main,
  });
}

export function viewPage(s: Story, prev: Story | null, next: Story | null): string {
  const img = absUrl(s.image);
  const nav = [prev ? `<a href="/story/${encodeURIComponent(prev.id)}"><span>이전 글</span><b>${esc(prev.title)}</b></a>` : '', next ? `<a href="/story/${encodeURIComponent(next.id)}"><span>다음 글</span><b>${esc(next.title)}</b></a>` : ''].join('');
  const tags = s.tags?.length ? `<p style="margin-top:28px;color:var(--ink-3);font-size:14px">${s.tags.map((t) => '#' + esc(t)).join(' ')}</p>` : '';
  const main = `${hero('<a href="/story">소식</a><i data-lucide="chevron-right"></i><span>' + esc(CATS[s.cat] || '소식') + '</span>')}
<section class="sec-sm"><div class="wrap"><article class="article">
  <header class="article-head"><span class="st">${esc(CATS[s.cat] || '소식')}</span><h1>${esc(s.title)}</h1>
    <div class="meta"><span>IUX ART</span><time datetime="${esc(s.at)}">${kDate(s.at)}</time></div></header>
  <div class="article-body">
    ${img ? `<figure style="margin:0 0 28px"><img src="${esc(img)}" alt="${esc(s.title)}" style="width:100%;height:auto;border-radius:12px;display:block"></figure>` : ''}
    ${bodyHtml(s.body)}
    ${tags}
  </div>
  ${nav ? `<nav class="article-nav">${nav}</nav>` : ''}
  <div class="board-foot"><a href="/story" class="btn btn-ghost btn-sm">목록으로</a></div>
</article></div></section>`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: s.title,
    description: s.summary,
    datePublished: s.at,
    dateModified: s.updated || s.at,
    mainEntityOfPage: storyUrl(s),
    ...(img ? { image: [img] } : {}),
    author: { '@type': 'Organization', name: 'IUX ART', url: SITE },
    publisher: { '@type': 'Organization', name: 'IUX ART', url: SITE },
  };
  return page({
    title: s.title,
    desc: s.summary || s.body.replace(/\s+/g, ' ').slice(0, 120),
    url: storyUrl(s),
    image: img || undefined,
    type: 'article',
    main,
    head: `<meta property="article:published_time" content="${esc(s.at)}">\n<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n`,
  });
}

export function notFoundPage(): string {
  const main = `${hero('<a href="/story">소식</a>')}
<section class="sec-sm"><div class="wrap" style="text-align:center;padding:60px 0">
  <p style="margin-bottom:20px">글을 찾을 수 없습니다. 지워졌거나 아직 게시 전인 글입니다.</p>
  <a href="/story" class="btn btn-dark btn-sm">소식 목록으로</a>
</div></section>`;
  return page({ title: '글을 찾을 수 없습니다', desc: 'IUX ART 소식', url: `${SITE}/story`, main, head: '<meta name="robots" content="noindex">\n' });
}
