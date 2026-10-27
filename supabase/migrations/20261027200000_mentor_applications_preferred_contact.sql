-- 선호 연락 수단 (연락처 / 이메일, 복수 선택)
-- Supabase 대시보드 → SQL Editor에서 한 번 실행. 다시 실행해도 같은 상태가 된다.
-- 이 컬럼이 없으면 신청서 저장이 실패하므로 코드 배포 전에 실행한다.
-- 기존 신청서는 빈 배열로 채워진다.

alter table public.mentor_applications
  add column if not exists preferred_contact_methods text[] not null default '{}';
