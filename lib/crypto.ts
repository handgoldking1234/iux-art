/* 주민등록번호·계좌번호 같은 민감 정보 암호화 (AES-256-GCM) */
import crypto from 'node:crypto';

function key() {
  const k = process.env.DATA_KEY || '';
  if (!/^[0-9a-f]{64}$/i.test(k)) {
    if (process.env.NODE_ENV === 'production') throw new Error('DATA_KEY(64자리 hex)를 설정하세요.');
    return crypto.createHash('sha256').update('dev-only-data-key').digest();
  }
  return Buffer.from(k, 'hex');
}
export function seal(obj: unknown): string {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([c.update(JSON.stringify(obj), 'utf8'), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString('base64')).join('.');
}
export function open<T = any>(s?: string | null): T | null {
  if (!s) return null;
  const [iv, tag, enc] = s.split('.').map((x) => Buffer.from(x, 'base64'));
  const d = crypto.createDecipheriv('aes-256-gcm', key(), iv);
  d.setAuthTag(tag);
  return JSON.parse(Buffer.concat([d.update(enc), d.final()]).toString('utf8'));
}
export const token = (n = 10) => crypto.randomBytes(n).toString('base64url').replace(/[-_]/g, '').slice(0, n).toLowerCase();
