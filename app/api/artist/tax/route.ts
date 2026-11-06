/* 정산 정보 원문(주민등록번호·사업자번호·계좌번호)은 암호화해 따로 보관 — 화면 데이터에는 가린 값만 */
import { handler, json, body, fail } from '@/lib/http';
import { q } from '@/lib/db';
import { seal } from '@/lib/crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = handler('artist', async (req, { session }) => {
  const b = await body(req, 10_000);
  const d = (v: any) => String(v ?? '').replace(/\D/g, '');
  const rec: any = { kind: b.kind, bank: String(b.bank || '').slice(0, 30), account: d(b.account).slice(0, 20), holder: String(b.holder || '').slice(0, 40), at: new Date().toISOString() };
  if (b.kind === 'rrn') { rec.rrn = d(b.rrn); if (rec.rrn.length !== 13) return fail('주민등록번호 13자리를 확인해 주세요.'); }
  else if (b.kind === 'biz') { rec.bizNo = d(b.bizNo); if (rec.bizNo.length !== 10) return fail('사업자등록번호 10자리를 확인해 주세요.'); }
  else return fail('정산 유형을 확인해 주세요.');
  const old = await q<{ data: string }>('select data from artist_secrets where artist_id = $1', [session!.artistId]);
  if (!rec.account && old[0]) { const { open } = await import('@/lib/crypto'); rec.account = open<any>(old[0].data)?.account || ''; }
  await q(`insert into artist_secrets (artist_id, data, updated_at) values ($1,$2,now()) on conflict (artist_id) do update set data = excluded.data, updated_at = now()`, [session!.artistId, seal(rec)]);
  return json({ ok: true });
});
