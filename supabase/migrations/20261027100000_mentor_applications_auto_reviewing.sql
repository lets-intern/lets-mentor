-- 접수 완료(received) 신청서를 정해진 시각에 검토중(reviewing)으로 자동 변경
-- Supabase 대시보드 → SQL Editor에서 한 번 실행. 다시 실행해도 같은 상태가 된다.
--
-- 변경 시각 (한국 시간 기준, 공휴일은 평일로 본다)
--   평일 08:00 ~ 18:59 접수 → 접수 3시간 뒤
--   평일 00:00 ~ 07:59 접수 → 당일 14:00
--   평일 19:00 ~ 23:59 접수 → 다음 날 10:00 (금요일이면 월요일 10:00)
--   토·일 접수            → 월요일 10:00
--
-- pg_cron 이 5분마다 돌아 시각이 지난 received 를 바꾼다. 최대 5분 늦을 수 있다.
-- received 일 때만 바꾸므로 운영자가 먼저 검토중·회신완료로 바꾼 신청서는 건드리지 않는다.
-- 반대로 시각이 지난 신청서를 운영자가 received 로 되돌리면 다음 실행 때 다시 검토중이 된다.

create or replace function public.mentor_application_review_due_at(applied_at timestamptz)
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select (
    case
      -- isodow: 월 1 ~ 일 7. 토요일은 2일, 일요일은 1일 뒤가 월요일
      when extract(isodow from local) in (6, 7)
        then date_trunc('day', local) + (8 - extract(isodow from local)::int) * interval '1 day' + interval '10 hours'
      when local::time < time '08:00'
        then date_trunc('day', local) + interval '14 hours'
      when local::time < time '19:00'
        then local + interval '3 hours'
      when extract(isodow from local) = 5
        then date_trunc('day', local) + interval '3 days 10 hours'
      else date_trunc('day', local) + interval '1 day 10 hours'
    end
  ) at time zone 'Asia/Seoul'
  from (select applied_at at time zone 'Asia/Seoul' as local) as k
$$;

create or replace function public.promote_due_mentor_applications()
returns integer
language plpgsql
set search_path = ''
as $$
declare
  promoted integer;
begin
  update public.mentor_applications
     set status = 'reviewing'
   where status = 'received'
     and public.mentor_application_review_due_at(created_at) <= now();
  get diagnostics promoted = row_count;
  return promoted;
end;
$$;

-- 함수는 기본으로 누구나 실행할 수 있어 anon 키로 /rpc 호출이 된다. 막아 둔다.
revoke execute on function public.mentor_application_review_due_at(timestamptz) from public, anon, authenticated;
revoke execute on function public.promote_due_mentor_applications() from public, anon, authenticated;

create extension if not exists pg_cron;

-- 같은 이름이면 덮어쓴다
select cron.schedule(
  'mentor-applications-auto-reviewing',
  '*/5 * * * *',
  $$select public.promote_due_mentor_applications()$$
);
