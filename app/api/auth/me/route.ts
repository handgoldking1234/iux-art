import { getSession } from '@/lib/auth';
import { json } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSession();
  return json(s ? { role: s.role, artistId: s.artistId || null, email: s.email } : { role: null });
}
