/* 소식 글을 페이스북 페이지·인스타그램에 올립니다 (메타 공식 API).
   필요한 환경 변수: META_PAGE_ID, META_PAGE_TOKEN (페이지 액세스 토큰), IG_USER_ID (인스타그램 프로페셔널 계정 ID)
   키가 없으면 '연결 전'으로 답하고 아무것도 올리지 않습니다. 준비 방법은 docs/STORY.md */
import { Story, ShareResult, storyUrl, absUrl, getStory, putStory, allStories, isLive } from './story';

const base = () => 'https://graph.facebook.com' + (process.env.META_GRAPH_VERSION ? '/' + process.env.META_GRAPH_VERSION : '');

export function connected() {
  const fb = !!(process.env.META_PAGE_ID && process.env.META_PAGE_TOKEN);
  return { fb, insta: fb && !!process.env.IG_USER_ID };
}

const tagsOf = (s: Story, max?: number) => (max ? s.tags.slice(0, max) : s.tags).map((t) => '#' + t).join(' ');
const join = (parts: string[]) => parts.filter((p) => p && p.trim()).join('\n\n');

async function call(pathname: string, params: Record<string, string>): Promise<any> {
  const r = await fetch(base() + pathname, { method: 'POST', body: new URLSearchParams({ ...params, access_token: process.env.META_PAGE_TOKEN! }) });
  const j: any = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error?.message || `메타 응답 오류 (${r.status})`);
  return j;
}

async function toFacebook(s: Story): Promise<string> {
  const message = join([s.title, s.summary, storyUrl(s), tagsOf(s, 3)]);
  const img = absUrl(s.image);
  const j = img
    ? await call(`/${process.env.META_PAGE_ID}/photos`, { url: img, caption: message })
    : await call(`/${process.env.META_PAGE_ID}/feed`, { message, link: storyUrl(s) });
  return 'https://www.facebook.com/' + (j.post_id || j.id);
}

async function toInstagram(s: Story): Promise<string> {
  const img = absUrl(s.image);
  if (!img) throw new Error('인스타그램은 이미지가 있어야 올릴 수 있어요.');
  const caption = join([s.title, s.summary || s.body, tagsOf(s)]).slice(0, 2200);
  const box = await call(`/${process.env.IG_USER_ID}/media`, { image_url: img, caption });
  await call(`/${process.env.IG_USER_ID}/media_publish`, { creation_id: box.id });
  return 'https://www.instagram.com/';
}

/* 한 글을 고른 채널에 올리고 결과를 글에 기록 */
export async function shareStory(id: string, channels: string[], opts: { force?: boolean } = {}): Promise<Record<string, ShareResult>> {
  const s = await getStory(id);
  if (!s) throw Object.assign(new Error('글을 찾을 수 없어요.'), { status: 404 });
  if (!isLive(s)) throw Object.assign(new Error('홈페이지에 게시된 뒤에 올릴 수 있어요. (예약 글은 게시 시각 이후)'), { status: 400 });
  const on = connected();
  const out: Record<string, ShareResult> = {};
  for (const ch of channels) {
    if (ch !== 'fb' && ch !== 'insta') continue;
    const at = new Date().toISOString();
    if (!on[ch]) { out[ch] = { ok: false, at, error: '아직 계정이 연결되지 않았어요.' }; continue; }
    if (s.shared?.[ch]?.ok && !opts.force) { out[ch] = s.shared[ch]; continue; }   // 같은 글을 두 번 올리지 않음
    try {
      const link = ch === 'fb' ? await toFacebook(s) : await toInstagram(s);
      out[ch] = { ok: true, at, link };
    } catch (e: any) {
      out[ch] = { ok: false, at, error: String(e?.message || e).slice(0, 300) };
    }
  }
  const fresh = (await getStory(id)) || s;
  fresh.shared = { ...(fresh.shared || {}), ...out };
  await putStory(fresh);
  return out;
}

/* 예약 실행: 게시 시각이 지났고 자동 채널에 아직 안 올라간 글을 올림 (하루 한 번 호출) */
export async function shareDue(): Promise<{ id: string; title: string; result: Record<string, ShareResult> }[]> {
  const on = connected();
  const done: { id: string; title: string; result: Record<string, ShareResult> }[] = [];
  if (!on.fb && !on.insta) return done;
  const weekAgo = Date.now() - 7 * 86400 * 1000;   // 오래된 글을 뒤늦게 한꺼번에 올리지 않도록
  for (const s of await allStories()) {
    if (!isLive(s) || new Date(s.at).getTime() < weekAgo) continue;
    const todo = (['fb', 'insta'] as const).filter((ch) => s.auto?.[ch] && on[ch] && !s.shared?.[ch]);
    if (!todo.length) continue;
    done.push({ id: s.id, title: s.title, result: await shareStory(s.id, todo) });
  }
  return done;
}
