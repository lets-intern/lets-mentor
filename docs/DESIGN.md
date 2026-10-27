# 멘토 모집 랜딩 페이지 설계

## 1. 개요

- 목적: 취업준비생 멘토 모집. 지원자가 콘텐츠 확인 → 신청서 제출 → 신청 현황 조회
- 스택: Next.js (App Router, TypeScript) + Tailwind CSS + Supabase (Postgres, Storage)
- 배포: Vercel → 회사 서브도메인 연결 (예: `mentor.company.com`)
- 어드민: 별도 툴에서 같은 Supabase 프로젝트를 읽고 상태를 변경 (이 저장소 범위 밖)

## 2. 페이지 구성

| 경로 | 내용 |
| --- | --- |
| `/` | 랜딩. 콘텐츠 섹션은 자리만 잡아두고 비워둠. "신청하기", "신청 현황 조회" CTA |
| `/apply` | 신청서 작성 |
| `/apply/complete` | 제출 완료 안내 + 현황 조회 방법 안내 |
| `/status` | 이름 + 전화번호로 신청 현황 조회 |

## 3. 신청서 항목

| 구분 | 항목 | 형식 | 필수 |
| --- | --- | --- | --- |
| 기본 | 성함 | text | O |
| 기본 | 소속 | text | O |
| 기본 | 직무 | text | O |
| 기본 | 연차 | number | O |
| 기본 | 연락처 | tel (숫자만 저장, `01012345678`) | O |
| 기본 | 이메일 | email | O |
| 기본 | 선호 연락 수단 | checkbox 복수 선택 (연락처 / 이메일) | O |
| 분야 | 멘토링 가능 직무 분야 | 복수 선택 | O |
| 분야 | 가능한 멘토링 형태 | 복수 선택 (서류 첨삭 / 모의 면접 / 커리어 상담 / 직무 Q&A) | O |
| 서술 | 이력 소개 | textarea (최대 1,000자) | X |
| 서술 | 전하고 싶은 말씀 | textarea (최대 1,000자) | X |
| 첨부 | 이력서/포트폴리오 | PDF, 최대 10MB, 1개 | X |
| 첨부 | 링크 | URL 최대 3개 (LinkedIn, 포트폴리오 등) | X |
| 동의 | 개인정보 수집·이용 동의 | checkbox | O |

> 직무 분야 선택지와 개인정보 동의 문구는 확정 필요 (§8).

## 4. 데이터 모델 (Supabase)

실제 SQL은 `supabase/migrations/20261027000000_mentor_applications.sql`. 기존 프로젝트와 타입 이름이 충돌하지 않도록 `status`는 enum 대신 `text + check`로 구현. 아래는 개요.

```sql
-- status 화면 표시: received=접수 완료, reviewing=검토중, replied=회신완료

create table mentor_applications (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  status             application_status not null default 'received',

  name               text not null,
  phone              text not null unique,   -- 숫자만, 중복 신청 차단 기준
  email              text not null,
  preferred_contact_methods text[] not null default '{}',  -- 연락처 / 이메일 (20261027200000 마이그레이션)
  company            text not null,
  job_title          text not null,
  years_of_experience int  not null check (years_of_experience >= 0),

  job_fields         text[] not null,
  mentoring_types    text[] not null,
  introduction       text not null,
  motivation         text not null,

  attachment_path    text,                   -- Storage 경로 (private bucket)
  links              text[] not null default '{}',

  privacy_agreed_at  timestamptz not null,
  admin_memo         text                    -- 어드민 툴 전용
);

alter table mentor_applications enable row level security;
-- anon/authenticated 정책 없음 → 클라이언트 직접 접근 전부 차단
-- 랜딩은 서버에서 service role 키로만 접근
```

- Storage: `mentor-attachments` private bucket. 어드민 툴은 signed URL로 열람
- 어드민 툴 연결: 같은 Supabase 프로젝트 사용. `status`, `admin_memo` 수정 권한만 주면 됨
- `received` → `reviewing` 자동 변경: 평일 08~19시 접수는 3시간 뒤, 평일 0~8시 접수는 당일 14시, 평일 19시 이후는 다음 날 10시(금요일이면 월요일), 주말은 월요일 10시(한국 시간, 공휴일은 평일 취급). pg_cron 이 5분마다 실행. SQL은 `supabase/migrations/20261027100000_mentor_applications_auto_reviewing.sql`

## 5. 서버 API

모든 DB 접근은 서버(Route Handler)에서만. `SUPABASE_SERVICE_ROLE_KEY`는 클라이언트에 절대 노출하지 않음.

| API | 동작 |
| --- | --- |
| `POST /api/uploads` | 첨부파일용 signed upload URL 발급 → 브라우저가 Storage로 직접 업로드 (Vercel 함수 요청 본문 4.5MB 제한 회피) |
| `POST /api/applications` | 입력값 검증(zod) → 전화번호 정규화 → insert. 전화번호 중복 시 409 "이미 신청된 정보입니다" |
| `POST /api/status` | 이름 + 전화번호 일치 시 `{ status, created_at }`만 반환. 불일치 시 "조회된 신청 내역이 없습니다" |

### 현황 조회 보안 (이름 + 전화번호 방식의 보완)

- 응답은 상태와 신청일만. 이메일·회사·서술 내용 등은 반환하지 않음
- 이름 불일치/전화번호 불일치를 구분하지 않고 같은 메시지로 응답
- GET 쿼리스트링 대신 POST body 사용 (로그·히스토리에 전화번호 노출 방지)
- Vercel Firewall rate limit 규칙을 `/api/status`에 적용 권장

## 6. 중복·수정 정책

- 같은 전화번호로 재신청 불가 → 현황 조회 페이지로 안내
- 제출 후 수정 불가. 수정은 운영자 문의 (문의 채널 안내 문구 필요)

## 7. 배포·도메인

- 환경 변수: `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- 서브도메인 연결: Vercel 프로젝트 → Domains에 `mentor.company.com` 추가 → 회사 개발자가 DNS에 `CNAME → cname.vercel-dns.com` 등록
  - 회사 개발자에게 전달할 때 "리다이렉트"가 아니라 "CNAME 연결"임을 명시. 리다이렉트로 설정하면 주소창에 vercel.app이 노출됨
- basePath 불필요

## 8. 확정이 필요한 항목

- [x] Supabase 프로젝트 → 어드민 툴의 기존 프로젝트에 테이블·bucket 추가 (기존 테이블명·스키마와 충돌 없는지 확인 필요)
- [ ] 직무 분야 선택지 목록
- [x] 첨부파일 용도 → 이력서/포트폴리오 PDF, 선택 항목
- [ ] 개인정보 수집·이용 동의 문구 (수집 항목, 목적, 보유 기간)
- [ ] 수정·문의 채널 (이메일, 카카오톡 채널 등)
- [ ] 랜딩 콘텐츠 (현재는 공란)

## 9. 구현 순서

1. Next.js 프로젝트 생성, Tailwind 설정, Supabase 클라이언트(서버 전용)
2. DB 마이그레이션 SQL + Storage bucket
3. `/apply` 신청서 폼 + 검증 + `POST /api/applications` + 첨부 업로드
4. `/apply/complete`
5. `/status` 조회 + `POST /api/status`
6. `/` 랜딩 뼈대 (빈 섹션 + CTA)
7. Vercel 배포, 환경 변수, 도메인 안내 문서
