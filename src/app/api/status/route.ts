import { STATUS_LABELS, statusLookupSchema, type ApplicationStatus } from "@/lib/application";
import { createServerSupabase } from "@/lib/supabase-server";

const NOT_FOUND = "일치하는 신청 내역이 없습니다. 성함과 연락처를 다시 확인해주세요.";

// 이름+전화번호가 모두 일치할 때만 상태와 신청일을 반환.
// 어느 쪽이 틀렸는지는 구분하지 않는다.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = statusLookupSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: NOT_FOUND }, { status: 404 });
  }

  const { name, phone } = parsed.data;
  const { data, error } = await createServerSupabase()
    .from("mentor_applications")
    .select("name, status, created_at")
    .eq("phone", phone)
    .maybeSingle();

  if (error) {
    console.error("[status] lookup failed", error);
    return Response.json({ error: "조회 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }

  if (!data || data.name !== name) {
    return Response.json({ error: NOT_FOUND }, { status: 404 });
  }

  const status = data.status as ApplicationStatus;
  return Response.json({
    status,
    statusLabel: STATUS_LABELS[status],
    createdAt: data.created_at,
  });
}
