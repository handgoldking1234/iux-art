# IUX ART — 홈페이지 · 관리자 · 작가 포털

캐리커처·페이스페인팅·캘리그라피 등 출장 행사회사 **IUX ART** 운영 시스템입니다.

- **화면:** 퍼블리싱한 HTML을 그대로 씁니다 (`public/`).
- **서버:** Next.js API가 로그인, DB, 사진 저장, 메일을 맡습니다.
- **배포:** Vercel(호스팅)과 Supabase(DB·사진)를 씁니다. 메일은 Resend로 보냅니다.

## 무엇이 실제로 동작하나요

| 화면 | 동작 |
| --- | --- |
| 행사 견적 문의 (`quote.html`) | DB에 저장됩니다. 관리자 공고 화면의 **견적 문의**에 바로 뜨고, 운영자에게 메일이 갑니다. |
| 교육 신청·문의, 상품 주문 | 문의 원문이 DB(`inquiries`)에 저장되고 운영자에게 메일이 갑니다. |
| 작가 등록 (`artist/register.html`) | 계정(이메일·비밀번호)이 만들어지고 포트폴리오 사진이 업로드됩니다. 작가는 승인 대기 상태로 저장되고, 운영자에게 메일이 갑니다. |
| 작가 로그인 (`login.html`) | 이메일 또는 휴대폰 번호와 비밀번호로 로그인합니다. |
| 작가 포털 (`artist/`) | 본인 정보만 받습니다. 다른 작가의 연락처·계좌는 내려가지 않습니다. 참석 신청·취소, 프로필 수정, 현장 후기와 사진 업로드가 됩니다. 정산 정보는 암호화해 저장합니다. |
| 관리자 (`admin/`) | 로그인한 관리자만 들어옵니다. 모든 저장은 DB에 기록되고, 동시에 두 곳에서 고치면 나중 저장이 막힌 뒤 새로고침됩니다. |
| 관리자 알림 | **메일** 채널은 실제로 발송됩니다. 대상은 작가 메일과 결과 리포트 담당자 메일입니다. 알림톡은 기록만 남깁니다(다음 단계). |
| 결과 리포트 (`report.html?r=…`) | 발송된 리포트만 열립니다(발송 후 90일). 열람 시각과 고객 만족도가 저장되고, 만족도가 들어오면 운영자에게 메일이 갑니다. |
| 행사 후기 · 현장 스케치 | 게시된 후기 중 사진 홍보에 동의한 행사만 보입니다. 업체명과 작가 실명은 나오지 않습니다. |

### 서버가 정하는 것

작가 화면에서 값을 바꿔 보내도 서버는 아래 규칙대로만 반영합니다.

- 참석 신청은 모집 중인 공고에만 됩니다. 활동 중이면서 해당 기술이 있는 작가만 신청할 수 있습니다.
- 작가는 선정 여부, 등급, 다른 작가 정보를 바꿀 수 없습니다.
- 현장 후기는 선정된 행사에 행사 당일부터 쓸 수 있습니다. 상태는 서버가 정합니다(검수 대기, 또는 홍보 미동의 행사는 내부 보관).

### 정산 정보

- 주민등록번호, 사업자등록번호, 계좌번호 원문은 `artist_secrets` 표에 AES-256-GCM으로 암호화해 저장합니다.
- 화면 데이터에는 가린 값만 들어갑니다.
- 관리자 작가 상세의 **전체 번호 보기**로 열람할 수 있고, 열람할 때마다 기록이 남습니다.

## 구조

```
public/            퍼블리싱 HTML·CSS·JS·이미지 (그대로 서비스)
  js/boot.js       페이지가 열릴 때 DB 상태를 받아 오고, 저장을 API로 보냄
app/api/           서버 API
  state            화면 데이터 (mode=admin | artist | public | report)
  admin/state      관리자 저장 (+ 메일 발송)
  admin/secret     정산 정보 원문 열람
  artist/sync      작가 저장 (신청·프로필·현장 후기)
  artist/tax       정산 정보 암호화 저장
  auth/*           로그인 · 로그아웃 · 작가 등록
  inquiry          홈페이지 문의 접수
  report/[token]   리포트 열람·만족도
lib/               DB · 인증 · 암호화 · 메일 · 사진 저장
middleware.ts      /admin, /artist 는 로그인해야 열림
db/schema.sql      테이블 정의 (첫 실행 때 자동 생성)
```

정적 미리보기(서버 없이 HTML만 열기)에서는 `boot.js`가 아무것도 하지 않습니다. 이때는 예전처럼 브라우저 저장소로 동작합니다.

## 처음 배포하기

### 1) Supabase (DB · 사진)

1. [supabase.com](https://supabase.com)에서 새 프로젝트를 만듭니다. 지역은 Northeast Asia (Seoul)를 고릅니다.
2. **Project Settings → Database → Connection string**에서 **Transaction pooler**(포트 6543) 주소를 복사합니다. 이 값이 `DATABASE_URL`입니다.
3. **Storage**에서 `uploads` 버킷을 만들고 **Public**으로 둡니다.
4. **Project Settings → API**에서 `Project URL`과 `service_role` 키를 복사합니다. 각각 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`입니다.

테이블은 첫 접속 때 자동으로 만들어집니다. SQL Editor에 `db/schema.sql`을 붙여 넣어 미리 만들어도 됩니다.

### 2) Resend (메일)

1. [resend.com](https://resend.com)에 가입하고 API 키를 만듭니다. 이 값이 `RESEND_API_KEY`입니다.
2. **Domains**에서 `iuxart.co.kr`처럼 보낼 도메인을 인증합니다. DNS에 레코드 몇 줄을 추가하면 됩니다.
   - 인증 전에는 가입한 본인 메일로만 보낼 수 있습니다.

### 3) Vercel

1. 프로젝트 **Settings → Environment Variables**에 `.env.example`의 값을 넣습니다.
2. 키 두 개는 터미널에서 `openssl rand -hex 32`로 만듭니다.
   - `SESSION_SECRET`
   - `DATA_KEY` — 한 번 정하면 바꾸지 마세요. 바꾸면 저장된 주민등록번호를 풀 수 없습니다.
3. 이 브랜치를 배포하고 `/admin`에 접속합니다. `ADMIN_EMAIL`과 `ADMIN_PASSWORD`로 로그인하면 됩니다.

> 체험용으로 시안 데이터가 필요하면 첫 배포 전에 `SEED_DEMO=1`을 넣으세요.
> - 데모 작가 로그인: 각 작가 이메일(예: `haneul@example.com`) / `artist1234`
> - 실제 운영 전에는 DB를 비우고 이 값을 빼 주세요.

## 로컬에서 돌려 보기

```bash
npm install
cp .env.example .env.local   # DATABASE_URL 을 비워 두면 내장 Postgres(.data/)로 동작
npm run dev                  # http://localhost:3000
```

## 다음 단계

- **카카오 알림톡:** 비즈 채널과 템플릿 심사가 끝나면 `lib/notify.ts`에 발송사 API를 붙입니다(솔라피·NHN 등). 지금은 메일만 실제로 발송합니다.
- **카카오 로그인:** 카카오 개발자 앱을 등록한 뒤 연결합니다.
- **비밀번호 찾기:** 휴대폰 인증으로 연결합니다.
- **정산 자동 이체:** 은행 펌뱅킹 계약이 필요합니다. 지금은 관리자가 지급 완료를 처리합니다.
