import { uploadRequestSchema } from "@/lib/application";
import { ATTACHMENT_BUCKET, createServerSupabase } from "@/lib/supabase-server";

// 브라우저가 Storage로 직접 올릴 수 있는 1회용 업로드 URL 발급
// (Vercel 함수 요청 본문 4.5MB 제한을 피하기 위함)
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = uploadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const path = `resumes/${crypto.randomUUID()}.pdf`;
  const { data, error } = await createServerSupabase()
    .storage.from(ATTACHMENT_BUCKET)
    .createSignedUploadUrl(path);

  if (error) {
    console.error("[uploads] createSignedUploadUrl failed", error);
    return Response.json({ error: "파일 업로드를 준비하지 못했습니다." }, { status: 500 });
  }

  return Response.json({ path, signedUrl: data.signedUrl });
}
