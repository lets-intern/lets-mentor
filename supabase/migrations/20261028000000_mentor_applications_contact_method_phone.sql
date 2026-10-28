-- 선호 연락 수단의 '연락처' 항목을 '전화번호'로 변경
-- Supabase 대시보드 → SQL Editor에서 한 번 실행. 다시 실행해도 같은 상태가 된다.
-- 기존 신청서에 저장된 '연락처' 값을 '전화번호'로 바꾼다.

update public.mentor_applications
  set preferred_contact_methods = array_replace(preferred_contact_methods, '연락처', '전화번호')
  where '연락처' = any(preferred_contact_methods);
