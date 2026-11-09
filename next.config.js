/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // 기존 정적 페이지(public/*.html)를 그대로 쓰고, 폴더 경로는 index.html로 연결
  // 폴더 주소(/admin, /artist)는 index.html로 보내야 상대 경로(css/…)가 맞음
  async redirects() {
    return [
      { source: '/admin', destination: '/admin/index.html', permanent: false },
      { source: '/artist', destination: '/artist/index.html', permanent: false },
      // 작가 개별 사이트(public/opal, eunseo, dalhae): 폴더 주소를 index.html로 보내 사진 경로(img/…)가 맞게
      { source: '/:site(opal|eunseo|dalhae)', destination: '/:site/index.html', permanent: false },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/index.html' },
      ],
    };
  },
  experimental: {
    // 단가표·지역 기본값을 public/admin/js/data.js 에서 읽음
    outputFileTracingIncludes: { '/api/**/*': ['./public/admin/js/data.js', './public/js/iux-config.js'] },
    serverComponentsExternalPackages: ['@electric-sql/pglite', 'postgres', 'bcryptjs'] },
};
