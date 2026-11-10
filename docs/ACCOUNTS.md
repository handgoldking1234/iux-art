# 계정·주소가 바뀔 때 고칠 곳

IUX ART와 studio.iux.kr이 쓰는 외부 계정을 모두 적어 둔 표입니다.
어떤 계정이 바뀌어도 **"고칠 곳"** 칸만 따라 하면 됩니다.

- **공개 값**(주소·공개 키): 코드의 설정 파일 한 곳
- **비밀 값**(비밀번호·service_role 키·API 키): Vercel 환경 변수

---

## 한눈에 보기

| 계정 | 쓰는 곳 | 바뀌면 고칠 곳 |
| --- | --- | --- |
| **GitHub** `handgoldking1234` | 코드 저장 (iux-art, iux-studio) | Vercel → 프로젝트 → Settings → Git에서 저장소를 다시 연결 |
| **Vercel** | art.iux.kr, studio.iux.kr 호스팅 | 새 계정에 프로젝트를 다시 만들고 환경 변수를 옮긴 뒤 **가비아 DNS**의 `@` A 레코드 값을 새 값으로 (`*` CNAME은 `cname.vercel-dns.com.` 그대로) |
| **Supabase** (프로젝트 `flrdiplgoeyuvffwxvhq`) | studio 전체 + IUX ART DB(`iuxart` 스키마)·사진 | 아래 "Supabase가 바뀔 때" |
| **Resend** | 자동 메일 발송 (noreply@iux.kr) | 새 키를 Vercel `RESEND_API_KEY`와 Supabase Edge Function Secrets `RESEND_API_KEY`에 넣기. 도메인 인증 DNS를 가비아에 다시 넣기 |
| **ImprovMX** | art@ · help@ · hello@iux.kr 받기 → 지메일 | ImprovMX에서 받을 주소만 바꾸면 됨 (코드 수정 없음) |
| **가비아** | iux.kr 도메인·DNS | 도메인을 다른 등록기관으로 옮기면 DNS 레코드 전체를 그대로 다시 입력 (아래 "DNS 기록") |
| **카카오 개발자** (선택) | 카카오 로그인 | Vercel `KAKAO_REST_KEY`, Redirect URI 다시 등록 |
| **솔라피** (선택) | 알림톡 | Vercel `SOLAPI_*` |
| **네이버 서치어드바이저 · 구글 서치콘솔** | 검색 등록 | 새 확인 코드를 `tools/site-gen/seo.py`의 `VERIFY`에 넣고 사이트 다시 생성 |
| **Claude 계정** | 작업 도구 | 코드·데이터와 무관. 새 계정에서 같은 GitHub를 연결하면 이어서 작업 가능 |

---

## Supabase가 바뀔 때

### A. 같은 프로젝트를 다른 계정(조직)으로 넘길 때 — 가장 쉬움

- Supabase 대시보드의 **Settings → General → Transfer project**로 프로젝트를 통째로 넘깁니다.
- 데이터, studio의 여러 사이트, IUX ART가 전부 그대로 갑니다. 코드는 고칠 필요가 없습니다.
- 넘긴 뒤 프로젝트 주소나 키가 바뀌었는지만 확인합니다. 바뀌었다면 B의 "고칠 곳"을 따릅니다.
- 조건
  - 옛 조직의 소유자여야 합니다.
  - GitHub 연동과 로그 드레인은 끈 상태여야 합니다.
  - 무료 플랜은 조직당 프로젝트 2개까지입니다.

### B. 새 프로젝트로 옮길 때

- **IUX ART만** 새 프로젝트로 옮길 때는 [MOVE-DB.md](MOVE-DB.md)를 따라 `npm run move-db`를 실행합니다.
  - studio의 다른 사이트는 건드리지 않습니다. IUX ART 데이터는 `iuxart` 스키마에만 있어서 그것만 복사됩니다.
- **studio(IUX Cloud) 전체**를 옮길 때는 Supabase 공식 백업·복원(`pg_dump` 전체)으로 옮깁니다.
  - 여러 사이트의 문의·게시판·통계가 함께 들어 있으니 스키마를 나누지 말고 통째로 옮깁니다.
  - iux-studio의 `docs/SETUP.md`로 Edge Function과 Secrets를 다시 설정합니다.

### 고칠 곳 (주소·키가 바뀐 경우)

| 파일 / 설정 | 값 |
| --- | --- |
| iux-art `public/js/iux-config.js` (main 브랜치는 `js/iux-config.js`) | `studio.supabaseUrl`, `studio.anonKey` — 홈페이지·서버가 모두 여기서 읽음 |
| Vercel (iux-art) | `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| iux-studio `admin/config.js` | `supabaseUrl`, `anonKey` |
| iux-studio `js/content.js` | `cloud.url`, `cloud.anonKey` |
| iux-studio `.github/workflows/supabase-keepalive.yml` | `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| Supabase → Authentication → URL Configuration | Site URL `https://studio.iux.kr/admin/` |

**절대 바꾸지 말 것:** Vercel의 `DATA_KEY`(작가 주민번호 암호화 키)와 `SESSION_SECRET`. 계정을 옮겨도 같은 값을 그대로 가져갑니다.

---

## studio에 등록된 IUX ART 정보

| 항목 | 값 |
| --- | --- |
| 사이트 ID | `iux-art` (바꾸면 `iux-config.js`의 `studio.siteId`도 같이) |
| 문의 알림 메일 | art@iux.kr (studio 관리자 → IUX ART → 사이트 설정) |
| 허용 도메인 | https://art.iux.kr, https://iux-art.vercel.app |
| 운영 앱 주소 | `sites.ops.appAdmin` = https://art.iux.kr |

홈페이지 주소가 바뀌면 이 셋도 같이 바꿉니다.
- `iux-config.js`의 `site`
- Vercel `SITE_URL`
- studio의 허용 도메인과 운영 앱 주소

---

## DNS 기록 (가비아, iux.kr)

| 타입 | 호스트 | 값 | 용도 |
| --- | --- | --- | --- |
| A | @ | 216.198.79.1 | Vercel |
| CNAME | * | cname.vercel-dns.com. | art · studio 등 서브도메인 → Vercel |
| MX | @ | mx1.improvmx.com. (10) | 메일 받기 |
| MX | @ | mx2.improvmx.com. (20) | 메일 받기 |
| TXT | @ | v=spf1 include:spf.improvmx.com include:_spf.google.com ~all | 메일 보내기 허용 |
| (Resend) | send, resend._domainkey | Resend 화면 값 | 자동 메일 발송 인증 |

---

## 연락처·이메일 문구가 바뀔 때

전화번호와 이메일은 홈페이지 여러 페이지에 들어 있습니다. 사이트 생성 원본에서 한 번에 바꿉니다.

- `tools/site-gen/common.py`: 하단 고객센터 번호·이메일
- `tools/site-gen/seo.py`: `PHONE`, `EMAIL`
- 메일 전단지: `mail/2026-winter.html`

지금 값은 010-9033-1491, art@iux.kr입니다.
