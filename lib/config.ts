/* 공개 연결 설정 — public/js/iux-config.js 하나를 홈페이지와 서버가 같이 씁니다.
   (계정·주소가 바뀌면 그 파일만 고치면 됨. 비밀 키는 Vercel 환경 변수에) */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

type Config = { site: string; studio: { admin: string; script: string; supabaseUrl: string; anonKey: string; siteId: string } };
let cache: Config | null = null;

export function config(): Config {
  if (cache) return cache;
  const src = fs.readFileSync(path.join(process.cwd(), 'public', 'js', 'iux-config.js'), 'utf8');
  const ctx: any = { window: {} };
  vm.runInNewContext(src, ctx);
  const c = ctx.window.IUX_CONFIG as Config;
  // 환경 변수가 있으면 그 값이 우선 (급하게 바꿔야 할 때 코드 수정 없이)
  if (process.env.STUDIO_SUPABASE_URL) c.studio.supabaseUrl = process.env.STUDIO_SUPABASE_URL;
  if (process.env.STUDIO_ANON_KEY) c.studio.anonKey = process.env.STUDIO_ANON_KEY;
  return (cache = c);
}
