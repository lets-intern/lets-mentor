-- 링크를 SNS 링크(최대 3개)로 변경
-- Supabase 대시보드 → SQL Editor에서 한 번 실행. 다시 실행해도 같은 상태가 된다.
-- 새 컬럼이 없으면 신청서 저장이 실패하므로 코드 배포 전에 실행한다.
-- 기존 links 컬럼은 값과 함께 삭제한다. (되돌릴 수 없음)

alter table public.mentor_applications
  add column if not exists sns_links text[] not null default '{}';

alter table public.mentor_applications
  drop column if exists links;
