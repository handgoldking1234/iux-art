# IUX ART

캐리커처·페이스페인팅·캘리그라피·타로카드·요술풍선 삐에로·헤나·혁필화·손마사지&네일아트·비즈공예 출장 행사회사 **IUX ART(아이유엑스 아트)** 홈페이지 퍼블리싱 파일입니다.

순수 HTML·CSS와 간단한 스크립트로만 구성된 정적 사이트라 빌드 과정 없이 바로 배포할 수 있습니다.

## 구성

| 구분 | 파일 |
| --- | --- |
| 메인 | `index.html` |
| 회사소개 | `about.html`, `artists.html`, `news.html`, `news-view.html` |
| 출장 이벤트 | `event.html`(전체 프로그램), `event-caricature.html`, `event-facepainting.html`, `event-calligraphy.html`, `event-tarot.html`, `event-balloon.html`, `event-henna.html`, `event-hyukpil.html`, `event-handcare.html`, `event-beads.html` |
| 주문제작 | `custom.html`, `product.html` |
| 교육센터 | `edu.html`, `edu-apply.html`, `edu-qna.html` |
| 기타 | `review.html`, `donation.html`, `quote.html`, `faq.html`, `login.html` |
| 공통 | `css/common.css`, `js/common.js`, `images/` |

## 관리자·작가 (시안)

| 구분 | 경로 | 내용 |
| --- | --- | --- |
| 관리자 | `admin/index.html` | 대시보드 · 처리할 일 · 월별 매출/지급 |
| | `admin/jobs.html` | 견적 문의 → 공고 등록, 신청 작가 선착순/직접 선정, 확정 시 알림톡·메일 |
| | `admin/artists.html` | 작가 승인·중지, 기술 연차(자동), 나이(자동), 참여·연속 횟수, 휴식 대상 |
| | `admin/notify.html` | 알림 템플릿 미리보기, 전송 기록, 직접 보내기 |
| | `admin/settlement.html` | 작가료·교통비·3.3% 원천징수 계산, 지급 완료 처리 |
| | `admin/stats.html` | 프로그램·지역별 행사, 작가 참여 순위, 월별 마진 |
| | `admin/settings.html` | 연속 참여 휴식 규칙, 선정 방식, 채널, 단가·세율 |
| 작가 | `artist/register.html` | 작가 등록 (기술·시작 연도·지역·생년월일·포트폴리오·정산 정보) |
| | `artist/index.html` | 모집 공고 참석 신청, 내 일정, 정산 내역, 프로필 |

예시 데이터는 `admin/js/data.js`에 있고, 화면에서 바꾼 내용은 브라우저 localStorage에만 저장됩니다. 개발 단계에서 DB·인증·카카오 알림톡·메일·이체 API로 교체합니다.

## 외부 리소스

- 글꼴: Google Fonts (Figtree, Noto Sans KR, Nanum Pen Script)
- 아이콘: Lucide (`unpkg.com/lucide@0.460.0`)

## 개발 단계에서 연결할 부분

- 견적 문의·출장 강의 신청·재능기부·교육 문의 폼 전송 (현재는 화면 안내 메시지만 표시)
- 로그인·회원가입, 장바구니·주문
- 게시판(새소식·교육 문의) 목록·검색·페이지 이동
- 요금, 작가 정보, 후기, 사업자 정보는 시안용 예시 값입니다.

## 배포

Vercel에서 이 저장소를 Import 하면 설정 없이 정적 사이트로 배포됩니다. 서브도메인(예: `art.iux.kr`)은 가비아 DNS에 CNAME 레코드로 연결합니다.

## 이어서 작업하기
결정사항·코드 지도·수정 방법은 [CLAUDE.md](CLAUDE.md), 전체 프로젝트 목록은 [IUX 프로젝트 목록](https://github.com/handgoldking1234/iux-app/blob/main/docs/PROJECTS.md)에 있습니다.
