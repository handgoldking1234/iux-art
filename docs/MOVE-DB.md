# IUX ART DB 옮기기 안내

IUX ART 운영 데이터(작가·공고·정산·후기·리포트·로그인 계정)를 다른 Supabase 프로젝트로 옮길 때 보는 문서입니다.
이 문서와 `scripts/move-db.mjs`만 있으면, 예전 작업 기록이 없어도 옮길 수 있습니다.

---

## 0. 지금 구성 (2026-11 기준)

| 항목 | 값 / 위치 |
| --- | --- |
| 홈페이지 | https://art.iux.kr (Vercel 프로젝트 `iux-art`, GitHub `handgoldking1234/iux-art`) |
| DB | studio.iux.kr과 같은 Supabase 프로젝트 `flrdiplgoeyuvffwxvhq` |
| IUX ART 데이터 위치 | 그 DB 안의 **`iuxart` 스키마** (표 6개: users, docs, artist_secrets, inquiries, mail_outbox, pw_resets) |
| 사진 | 같은 프로젝트 Storage의 **`iuxart` 버킷** |
| studio 쪽에 남는 것 | 방문 통계·문의함·새소식 게시판 (`public` 스키마, site_id `iux-art`) — 옮기지 않아도 계속 studio에 쌓임 |
| 연결 설정 | Vercel → iux-art → Settings → Environment Variables |

studio 로그인 연결(운영 앱)은 studio에 직접 물어서 확인합니다. 그래서 IUX ART DB를 옮겨도 그대로 동작합니다.

> studio(IUX Cloud) 프로젝트에는 여러 사이트가 함께 들어 있습니다. 이 스크립트는 **`iuxart` 스키마만** 복사하고 옛 DB는 읽기만 해서, 다른 사이트에는 아무 영향이 없습니다.
> 프로젝트를 통째로 다른 계정으로 넘기는 경우는 [ACCOUNTS.md](ACCOUNTS.md)의 "Supabase가 바뀔 때 A"를 보세요. 그때는 이 스크립트가 필요 없습니다.

---

## 1. 값 모으기

| 이름 | 어디서 |
| --- | --- |
| `OLD_DATABASE_URL` | Vercel 환경 변수의 지금 `DATABASE_URL` |
| `NEW_DATABASE_URL` | 새 Supabase → **Connect** → Transaction pooler 주소. `[YOUR-PASSWORD]`에 새 DB 비밀번호를 넣습니다 |
| `OLD_SUPABASE_URL` / `OLD_SERVICE_KEY` | (사진도 옮길 때) 지금 Vercel의 `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` |
| `NEW_SUPABASE_URL` / `NEW_SERVICE_KEY` | (사진도 옮길 때) 새 Supabase → Project Settings → API Keys의 Project URL / service_role |

> ⚠️ **`DATA_KEY`와 `SESSION_SECRET`은 절대 바꾸지 마세요.**
> 작가 주민등록번호·계좌번호는 `DATA_KEY`로 암호화돼 있어서, 키가 바뀌면 옮긴 뒤 열 수 없습니다.
> 지금 Vercel에 있는 값을 그대로 둡니다.

## 2. 스크립트 실행 (PC에서 한 번)

```bash
git clone https://github.com/handgoldking1234/iux-art && cd iux-art
git checkout main          # (nextjs 브랜치를 합치기 전이면 nextjs)
npm install
```

저장소 폴더에 `.env.move` 파일을 만들고 1단계 값을 적습니다. 이 파일은 Git에 올라가지 않습니다.

```
OLD_DATABASE_URL=postgresql://...
NEW_DATABASE_URL=postgresql://...
OLD_SUPABASE_URL=https://flrdiplgoeyuvffwxvhq.supabase.co
OLD_SERVICE_KEY=...
NEW_SUPABASE_URL=https://새프로젝트.supabase.co
NEW_SERVICE_KEY=...
```

```bash
npm run move-db
```

- 표마다 몇 건을 복사했는지 나오고, 마지막에 건수를 다시 맞춰 봅니다.
- 사진 값 4개를 적었다면 사진도 복사하고, 데이터 안의 사진 주소를 새 주소로 바꿉니다. 안 적으면 사진은 옛 프로젝트에서 계속 보입니다.
- 옛 DB는 읽기만 하므로 그대로 남습니다.
- 새 DB에 이미 데이터가 있으면 멈춥니다. 다시 하려면 `npm run move-db -- --force`로 실행합니다.

## 3. 옮기는 동안

운영자와 작가에게 10분 정도 저장을 멈춰 달라고 알립니다. 스크립트를 실행한 뒤 바꾼 내용은 새 DB에 들어가지 않습니다.

## 4. 전환

1. Vercel → iux-art → Settings → Environment Variables에서 아래 값을 새 값으로 바꿉니다. **Production·Preview 둘 다** 바꿉니다.
   - `DATABASE_URL`
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (사진을 옮겼다면)
2. Deployments → 최신 배포 → **Redeploy**
3. 확인
   - https://art.iux.kr/admin 로그인 후 공고·작가가 보이는지
   - 작가 상세 → **전체 번호 보기**가 열리는지 (`DATA_KEY` 확인)
   - 작가 포털 로그인, 사진이 보이는지
   - studio.iux.kr → IUX ART → 운영 앱 → 관리자 열기

## 5. 되돌리기

문제가 생기면 Vercel의 `DATABASE_URL` 등을 옛 값으로 되돌리고 Redeploy하면 됩니다. 옛 DB는 지우지 않았으니 바로 원래대로 돌아갑니다.
한두 주 문제없이 운영된 뒤, 옛 프로젝트의 `iuxart` 스키마와 버킷을 지웁니다.

```sql
drop schema iuxart cascade;   -- 옛 프로젝트 SQL Editor, 충분히 확인한 뒤에만
```
