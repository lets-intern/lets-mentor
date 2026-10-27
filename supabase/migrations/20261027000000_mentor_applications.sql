-- 멘토 신청서 테이블 + 첨부파일 bucket
-- Supabase 대시보드 → SQL Editor에서 한 번 실행

create table if not exists public.mentor_applications (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  -- received: 접수 완료, reviewing: 검토중, replied: 회신완료 (어드민 툴에서 변경, received → reviewing 은 20261027100000 마이그레이션이 자동 변경)
  status              text not null default 'received'
                      check (status in ('received', 'reviewing', 'replied')),

  name                text not null,
  phone               text not null unique check (phone ~ '^01[0-9]{8,9}$'),
  email               text not null,
  company             text not null,
  job_title           text not null,
  years_of_experience int  not null check (years_of_experience between 0 and 60),

  job_fields          text[] not null,
  mentoring_types     text[] not null,
  introduction        text not null,
  motivation          text not null,

  attachment_path     text,
  links               text[] not null default '{}',

  privacy_agreed_at   timestamptz not null,
  admin_memo          text
);

create index if not exists mentor_applications_created_at_idx
  on public.mentor_applications (created_at desc);

create or replace function public.mentor_applications_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists mentor_applications_updated_at on public.mentor_applications;
create trigger mentor_applications_updated_at
  before update on public.mentor_applications
  for each row execute function public.mentor_applications_set_updated_at();

-- 정책을 만들지 않으므로 anon/authenticated 키로는 접근 불가.
-- 랜딩 페이지 서버와 어드민 툴은 service role(secret) 키로 접근.
alter table public.mentor_applications enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mentor-attachments', 'mentor-attachments', false, 10485760, array['application/pdf'])
on conflict (id) do nothing;
