# IUX ART — 작업 안내서

## 한 줄 요약
캐리커처·페이스페인팅·캘리그라피 등 출장 행사회사 IUX ART의 홈페이지 + 관리자·작가 포털 + 소속 작가 개인 사이트.

- 주소: https://art.iux.kr (작가 사이트: `/eunseo/`, `/dalhae/`, `/opal/`)
- 관리: studio.iux.kr 관리자(IUX Cloud)와 연결 (`js/iux-config.js`)

## 브랜치 구조 (중요)
| 브랜치 | 내용 |
|---|---|
| `main` | 퍼블리싱 정적 사이트 (HTML·CSS·JS, 빌드 없음). 관리자·작가 화면은 브라우저 저장소로 동작하는 시안 |
| `nextjs` | 실제 운영 시스템: `public/`에 같은 HTML + Next.js API(로그인·DB·사진·메일). Supabase + Resend. 설명은 그 브랜치의 README·`docs/ACCOUNTS.md`·`docs/MOVE-DB.md` |
- 화면을 고치면 **두 브랜치를 같이 맞춘다** (nextjs의 `public/`이 main과 같아야 함). 어느 브랜치가 art.iux.kr에 배포되는지는 Vercel 프로젝트의 Production Branch에서 확인.

## 확정된 결정
| 항목 | 결정 |
|---|---|
| 디자인 | 스포티파이 디자인 시스템 + 노란색 주색, 매쓰플랫풍 애니메이션, Lucide 아이콘 |
| 구성 | 원페이지가 아닌 서브페이지까지 있는 홈페이지 |
| 운영 구조 | 회사가 업체와 작가 사이를 중개. 로그인·등록은 작가만, 업체와 작가가 직접 연결되지 않게 |
| 알림 | 메일 먼저(Resend), 카카오 알림톡은 키가 있을 때 |
| DB | 새 Supabase 프로젝트 대신 iux-studio의 Supabase를 함께 씀 |
| 하단 | 사업자 정보 전체 공개(광고 심사용) |
| 검색 | 네이버 서치어드바이저·구글 서치콘솔 등록됨 → `sitemap.xml`, `rss.xml` 유지 |

## 파일 (main)
```
index.html, about.html, artists.html, event*.html(프로그램별), custom.html, product.html,
edu*.html, review.html, donation.html, quote.html(견적), faq.html, news*.html, login.html, report.html
css/common.css, js/common.js         공통
js/iux-config.js                     ★ 연결 설정 (주소·studio Supabase anon 키·siteId). 비밀 키 금지
js/cloud.js                          studio(IUX Cloud) 연동
admin/                               관리자 (공고·작가·알림·정산·통계·설정) — js/admin.js, data.js, core.js
artist/                              작가 등록·포털
eunseo/, dalhae/, opal/              소속 작가 개인 사이트 (각각 다른 컨셉)
mail/                                이메일 전단지
images/                              현장·작품 사진
```

## 자주 하는 수정
- **프로그램 추가:** `event-<이름>.html` 복사 → `event.html` 목록·메뉴·`sitemap.xml`에 추가 → quote.html 선택지
- **연락처·주소 변경:** `js/iux-config.js`와 각 페이지 하단(footer) 문구
- 개인정보(작가 실명·연락처·계좌)는 화면 데이터에 원문으로 넣지 않는다 (nextjs에서 암호화 저장)

---

## 공통 작업 원칙 (IUX 프로젝트 전체)
- **언어:** 화면 문구·문서·커밋 메시지는 한국어. 쉬운 말, 기술 용어 최소화.
- **퍼블리싱 시안:** 순수 HTML/CSS + 간단한 스크립트만 넣는다. 서버·DB 연동 코드는 개발 단계에서 따로 붙인다.
- **아이콘:** Lucide. 디자인 시스템을 따로 정하지 않았으면 스포티파이 스타일(다크/화이트 + 포인트 컬러)을 기본으로 쓴다.
- **배포:** GitHub `main` → Vercel 자동 배포. 도메인은 가비아 `iux.kr`의 서브도메인(`*.iux.kr` CNAME → Vercel)을 쓴다.
- **DB:** Supabase 무료 플랜은 활성 프로젝트 2개까지라, 새 프로젝트를 만들지 말고 기존 `iux-cloud`(studio) 프로젝트에 테이블을 얹는 것을 먼저 검토한다.
- **비밀값:** 공개 저장소다. 서비스 키·AI 키·비밀번호는 절대 커밋하지 않는다. 키는 Vercel 환경 변수나 Supabase secrets에 둔다. Supabase anon(public) 키만 코드에 넣을 수 있다.
- **확인:** 고친 뒤에는 브라우저 콘솔 오류 0개, 모바일(390px)과 PC 화면을 눈으로 확인하고 나서 완료라고 한다.
- **브랜치:** `main`은 배포 중인 상태. 큰 작업이나 검증 전 작업은 브랜치(`wip/…`, `claude/…`)에 올리고, `main`을 강제 푸시(-f)로 덮어쓰지 않는다.
- **전체 프로젝트 목록:** https://github.com/handgoldking1234/iux-app/blob/main/docs/PROJECTS.md
