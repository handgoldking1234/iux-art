/* db/schema.sql 과 같은 내용 (서버리스 배포에서 파일을 읽지 않도록 코드에 포함) */
export const SCHEMA = `
-- IUX ART 운영 DB (Supabase Postgres)
-- 화면 데이터는 컬렉션별 JSON 문서로 저장합니다 (관리자 화면과 같은 모양이라 화면 코드를 그대로 씁니다).

create table if not exists docs (
  coll        text not null,          -- artists · jobs · quotes · posts · reviews · reports · paid · meta
  id          text not null,
  data        jsonb not null,
  updated_at  timestamptz not null default now(),
  primary key (coll, id)
);

create table if not exists users (    -- 로그인 계정
  id          bigserial primary key,
  login       text unique not null,   -- 이메일 (소문자)
  phone       text,
  pw_hash     text not null,
  role        text not null check (role in ('admin', 'artist')),
  artist_id   text,
  created_at  timestamptz not null default now()
);

create table if not exists artist_secrets (  -- 주민등록번호·계좌번호 원문 (AES-256-GCM 암호문)
  artist_id   text primary key,
  data        text not null,
  updated_at  timestamptz not null default now()
);

create table if not exists inquiries (  -- 홈페이지 문의 원문 (견적·교육·상품 주문)
  id          bigserial primary key,
  kind        text not null,
  data        jsonb not null,
  created_at  timestamptz not null default now()
);

create table if not exists mail_outbox (
  id          bigserial primary key,
  to_addr     text not null,
  subject     text not null,
  body        text not null,
  status      text not null,          -- sent · failed · logged(키 없음)
  error       text,
  created_at  timestamptz not null default now()
);

-- 서버(DATABASE_URL)로만 접근하므로 Supabase 공개 API로는 읽을 수 없게 막아 둡니다.
alter table docs enable row level security;
alter table users enable row level security;
alter table artist_secrets enable row level security;
alter table inquiries enable row level security;
alter table mail_outbox enable row level security;
`;
