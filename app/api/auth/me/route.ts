import { getSession } from '@/lib/auth';
import { json } from '@/lib/http';
import { q } from '@/lib/db';
import { kakaoReady } from '@/lib/kakao';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const s = await getSession();
  let kakao = false;
  if (s) try { kakao = !!(await q<any>('select kakao_id from users where id = $1', [s.uid]))[0]?.kakao_id; } catch {}
  return json(s ? { role: s.role, artistId: s.artistId || null, email: s.email, kakao, kakaoReady: kakaoReady() } : { role: null, kakaoReady: kakaoReady() });
}
