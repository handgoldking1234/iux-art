/* 사진 저장: Supabase Storage(운영) 또는 public/uploads(로컬) — data: URL을 받아 공개 URL을 돌려줍니다. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const MAX = 6 * 1024 * 1024;

export async function saveDataUrl(dataUrl: string, folder: string): Promise<string> {
  const m = /^data:(image\/(jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || '');
  if (!m) throw new Error('이미지 형식이 올바르지 않아요.');
  const buf = Buffer.from(m[3], 'base64');
  if (buf.length > MAX) throw new Error('이미지가 너무 커요.');
  const ext = m[2] === 'jpeg' ? 'jpg' : m[2];
  const name = `${folder.replace(/[^a-z0-9/_-]/gi, '')}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY, bucket = process.env.SUPABASE_BUCKET || 'iuxart';
  if (url && key) {
    const put = () => fetch(`${url}/storage/v1/object/${bucket}/${name}`, {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, apikey: key, 'Content-Type': m[1], 'x-upsert': 'false' }, body: buf,
    });
    let r = await put();
    if (!r.ok && /bucket not found/i.test(await r.clone().text())) {
      // 처음 한 번: 공개 버킷 만들기 (studio의 media 버킷과 분리)
      await fetch(`${url}/storage/v1/bucket`, { method: 'POST', headers: { Authorization: `Bearer ${key}`, apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: bucket, name: bucket, public: true, file_size_limit: MAX, allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp'] }) });
      r = await put();
    }
    if (!r.ok) throw new Error('사진 업로드에 실패했어요: ' + (await r.text()).slice(0, 200));
    return `${url}/storage/v1/object/public/${bucket}/${name}`;
  }
  const out = path.join(process.cwd(), 'public', 'uploads', name);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buf);
  return `/uploads/${name}`;
}

/* 배열 안의 data: URL만 올리고 나머지는 그대로 */
export async function uploadAll(list: string[] = [], folder: string, max = 10) {
  const out: string[] = [];
  for (const s of list.slice(0, max)) out.push(typeof s === 'string' && s.startsWith('data:') ? await saveDataUrl(s, folder) : s);
  return out;
}
