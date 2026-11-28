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
      // 예전 새소식(시안) 주소는 실제 소식 게시판(/story)으로 보냄. news-view.html 파일은 소식 페이지의 틀로 계속 씀
      { source: '/news.html', destination: '/story', permanent: false },
      { source: '/news-view.html', destination: '/story', permanent: false },
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
    outputFileTracingIncludes: {
      '/api/**/*': ['./public/admin/js/data.js', './public/js/iux-config.js'],
      // 소식 페이지(/story)는 news-view.html 을 틀로 읽어 서버에서 완성함
      '/story/**/*': ['./public/news-view.html', './public/admin/js/data.js', './public/js/iux-config.js'],
      '/story': ['./public/news-view.html', './public/admin/js/data.js', './public/js/iux-config.js'],
    },
    serverComponentsExternalPackages: ['@electric-sql/pglite', 'postgres', 'bcryptjs'] },
};
