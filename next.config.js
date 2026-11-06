/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // 기존 정적 페이지(public/*.html)를 그대로 쓰고, 폴더 경로는 index.html로 연결
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/index.html' },
        { source: '/admin', destination: '/admin/index.html' },
        { source: '/artist', destination: '/artist/index.html' },
      ],
    };
  },
  experimental: {
    // 단가표·지역 기본값을 public/admin/js/data.js 에서 읽음
    outputFileTracingIncludes: { '/api/**/*': ['./public/admin/js/data.js'] },
    serverComponentsExternalPackages: ['@electric-sql/pglite', 'postgres', 'bcryptjs'] },
};
