import { applicationSchema, toFieldErrors } from "@/lib/application";
import { ATTACHMENT_BUCKET, createServerSupabase } from "@/lib/supabase-server";

const UNIQUE_VIOLATION = "23505";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "입력값을 확인해주세요.", fieldErrors: toFieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const supabase = createServerSupabase();

  if (input.attachmentPath) {
    const { data: exists } = await supabase.storage
      .from(ATTACHMENT_BUCKET)
      .exists(input.attachmentPath);
    if (!exists) {
      return Response.json(
        { error: "첨부파일을 찾을 수 없습니다. 다시 첨부해주세요.", fieldErrors: { attachment: "첨부파일을 다시 올려주세요." } },
        { status: 400 },
      );
    }
  }

  const { error } = await supabase.from("mentor_applications").insert({
    name: input.name,
    phone: input.phone,
    email: input.email,
    preferred_contact_methods: input.preferredContactMethods,
    company: input.company,
    job_title: input.jobTitle,
    years_of_experience: input.yearsOfExperience,
    job_fields: input.jobFields,
    mentoring_types: input.mentoringTypes,
    introduction: input.introduction,
    motivation: input.motivation,
    attachment_path: input.attachmentPath,
    sns_links: input.snsLinks,
    privacy_agreed_at: new Date().toISOString(),
  });

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return Response.json(
        { error: "이미 이 전화번호로 신청된 내역이 있습니다. 신청 현황 조회에서 확인해주세요.", duplicate: true },
        { status: 409 },
      );
    }
    console.error("[applications] insert failed", error);
    return Response.json({ error: "신청서를 저장하지 못했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
