import { z } from "zod";

// 임시 목록 — 직무 분야 확정 시 교체 (docs/DESIGN.md §8)
export const JOB_FIELDS = [
  "경영기획·전략",
  "마케팅·브랜딩",
  "영업·영업관리",
  "인사·HR",
  "재무·회계",
  "개발·IT",
  "데이터·AI",
  "서비스기획·PM",
  "디자인",
  "생산·품질",
  "연구개발(R&D)",
  "기타",
] as const;

export const MENTORING_TYPES = [
  "서류 첨삭",
  "모의 면접",
  "커리어 상담",
  "직무 Q&A",
] as const;

export const STATUS_LABELS = {
  received: "접수 완료",
  reviewing: "검토중",
  replied: "회신완료",
} as const;

export type ApplicationStatus = keyof typeof STATUS_LABELS;

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const TEXT_MAX = 1000;

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

const phone = z
  .string()
  .transform(normalizePhone)
  .refine((v) => /^01[0-9]{8,9}$/.test(v), "휴대폰 번호를 정확히 입력해주세요.");

const name = z
  .string()
  .transform(normalizeName)
  .pipe(z.string().min(1, "이름을 입력해주세요.").max(50));

const requiredText = (label: string, max = 100) =>
  z.string().trim().min(1, `${label}을(를) 입력해주세요.`).max(max, `${max}자 이내로 입력해주세요.`);

export const applicationSchema = z.object({
  name,
  phone,
  email: z.string().trim().email("이메일 형식이 올바르지 않습니다."),
  company: requiredText("재직 회사"),
  jobTitle: requiredText("직무"),
  // 빈 문자열은 coerce 시 0이 되므로 미입력으로 처리
  yearsOfExperience: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.coerce
      .number({ message: "연차를 입력해주세요." })
      .int("연차는 정수로 입력해주세요.")
      .min(0, "0 이상 입력해주세요.")
      .max(60, "60 이하로 입력해주세요."),
  ),
  jobFields: z.array(z.enum(JOB_FIELDS)).min(1, "하나 이상 선택해주세요."),
  mentoringTypes: z.array(z.enum(MENTORING_TYPES)).min(1, "하나 이상 선택해주세요."),
  introduction: requiredText("자기소개", TEXT_MAX),
  motivation: requiredText("지원 동기", TEXT_MAX),
  attachmentPath: z
    .string()
    .regex(/^resumes\/[0-9a-f-]{36}\.pdf$/, "첨부파일 정보가 올바르지 않습니다.")
    .nullable(),
  links: z
    .array(z.string().trim().url("올바른 URL을 입력해주세요. (https://로 시작)"))
    .max(3, "링크는 최대 3개까지 입력할 수 있습니다."),
  privacyAgreed: z.literal(true, { message: "개인정보 수집·이용에 동의해주세요." }),
});

export type ApplicationInput = z.input<typeof applicationSchema>;

export const statusLookupSchema = z.object({ name, phone });

export const uploadRequestSchema = z.object({
  contentType: z.literal("application/pdf", { message: "PDF 파일만 첨부할 수 있습니다." }),
  size: z
    .number()
    .int()
    .positive()
    .max(MAX_ATTACHMENT_BYTES, "파일은 10MB 이하만 첨부할 수 있습니다."),
});

export type FieldErrors = Partial<Record<string, string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
