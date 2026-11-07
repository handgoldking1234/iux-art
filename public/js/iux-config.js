/* ===========================================================
   IUX ART 연결 설정 — 계정·주소가 바뀌면 이 파일만 고치면 됩니다.
   (공개 값만 넣는 곳: 비밀 키는 절대 넣지 마세요. 비밀 키는 Vercel 환경 변수에)
   이 파일을 읽는 곳: js/cloud.js(홈페이지), admin/login.html, 서버(lib/config.ts)
   바꾼 뒤 확인할 것: docs/ACCOUNTS.md
   =========================================================== */
window.IUX_CONFIG = {
  // 이 홈페이지 주소
  site: 'https://art.iux.kr',

  // studio.iux.kr (IUX Cloud) — 방문 통계 · 문의함 · 운영 앱 로그인
  studio: {
    admin: 'https://studio.iux.kr/admin/',                       // studio 관리자 주소
    script: 'https://studio.iux.kr/js/iux-cloud.js',             // 공용 스크립트
    supabaseUrl: 'https://flrdiplgoeyuvffwxvhq.supabase.co',     // studio Supabase 주소 (Project Settings > API)
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZscmRpcGxnb2V5dXZmZnd4dmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NTgzNTgsImV4cCI6MjEwODMzNDM1OH0.yNLMwIgvr-f-TwU3fAHuSEC5QjvPp9K3I2T1jkC5UQk', // anon public 키 (공개용)
    siteId: 'iux-art'                                            // studio 사이트 관리에 등록된 ID
  }
};
