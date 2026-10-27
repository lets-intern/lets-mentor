"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import {
  CONTACT_METHODS,
  JOB_FIELDS,
  MAX_ATTACHMENT_BYTES,
  MENTORING_TYPES,
  TEXT_MAX,
  applicationSchema,
  toFieldErrors,
  type FieldErrors,
} from "@/lib/application";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-[15px] outline-none placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 aria-invalid:border-red-400";

function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
}

export function ApplyForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<ReactNode>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [introLen, setIntroLen] = useState(0);
  const [motivationLen, setMotivationLen] = useState(0);
  // 같은 파일로 재시도할 때 다시 올리지 않도록 기억
  const uploaded = useRef<{ file: File; path: string } | null>(null);

  async function uploadAttachment(file: File) {
    if (uploaded.current?.file === file) return uploaded.current.path;

    const res = await fetch("/api/uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: file.type, size: file.size }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    const put = await fetch(data.signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type, "x-upsert": "false" },
      body: file,
    });
    if (!put.ok) throw new Error("파일 업로드에 실패했습니다. 다시 시도해주세요.");

    uploaded.current = { file, path: data.path };
    return data.path as string;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const fd = new FormData(e.currentTarget);
    const file = fd.get("attachment");
    const attachment = file instanceof File && file.size > 0 ? file : null;

    const values = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      preferredContactMethods: fd.getAll("preferredContactMethods").map(String),
      company: String(fd.get("company") ?? ""),
      jobTitle: String(fd.get("jobTitle") ?? ""),
      yearsOfExperience: String(fd.get("yearsOfExperience") ?? ""),
      jobFields: fd.getAll("jobFields").map(String),
      mentoringTypes: fd.getAll("mentoringTypes").map(String),
      introduction: String(fd.get("introduction") ?? ""),
      motivation: String(fd.get("motivation") ?? ""),
      attachmentPath: null as string | null,
      links: fd.getAll("links").map(String).map((s) => s.trim()).filter(Boolean),
      privacyAgreed: fd.get("privacyAgreed") === "on",
    };

    const nextErrors: FieldErrors = {};
    const parsed = applicationSchema.safeParse(values);
    if (!parsed.success) Object.assign(nextErrors, toFieldErrors(parsed.error));
    if (attachment && attachment.type !== "application/pdf") nextErrors.attachment = "PDF 파일만 첨부할 수 있습니다.";
    if (attachment && attachment.size > MAX_ATTACHMENT_BYTES) nextErrors.attachment = "파일은 10MB 이하만 첨부할 수 있습니다.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0];
      document.querySelector<HTMLElement>(`[data-field="${first}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      if (attachment) values.attachmentPath = await uploadAttachment(attachment);

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok) {
        router.push("/apply/complete");
        return;
      }
      if (data.fieldErrors) setErrors(data.fieldErrors);
      setFormError(
        data.duplicate ? (
          <>
            {data.error}{" "}
            <Link href="/status" className="font-semibold underline">
              현황 조회하기
            </Link>
          </>
        ) : (
          data.error
        ),
      );
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "제출 중 문제가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-12">
      <Fieldset title="기본 정보">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="name" label="성함" required error={errors.name}>
            <input id="name" name="name" autoComplete="name" className={inputClass} aria-invalid={!!errors.name} />
          </Field>
          <Field name="company" label="소속" required error={errors.company}>
            <input id="company" name="company" autoComplete="organization" className={inputClass} aria-invalid={!!errors.company} />
          </Field>
          <Field name="jobTitle" label="직무" required error={errors.jobTitle}>
            <input id="jobTitle" name="jobTitle" placeholder="예: 백엔드 개발, 브랜드 마케팅" className={inputClass} aria-invalid={!!errors.jobTitle} />
          </Field>
          <Field name="yearsOfExperience" label="연차" required error={errors.yearsOfExperience}>
            <div className="relative">
              <input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                inputMode="numeric"
                min={0}
                max={60}
                className={`${inputClass} pr-10`}
                aria-invalid={!!errors.yearsOfExperience}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-zinc-500">년</span>
            </div>
          </Field>
          <Field name="phone" label="연락처" required error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              className={inputClass}
              aria-invalid={!!errors.phone}
            />
          </Field>
          <Field name="email" label="이메일" required error={errors.email}>
            <input id="email" name="email" type="email" autoComplete="email" className={inputClass} aria-invalid={!!errors.email} />
          </Field>
          <Field
            name="preferredContactMethods"
            label="선호 연락 수단"
            required
            error={errors.preferredContactMethods}
            hint="복수 선택 가능"
            className="sm:col-span-2"
          >
            <ChipGroup name="preferredContactMethods" options={CONTACT_METHODS} />
          </Field>
        </div>
      </Fieldset>

      <Fieldset title="멘토링 분야">
        <Field name="jobFields" label="멘토링 가능 직무 분야" required error={errors.jobFields} hint="복수 선택 가능">
          <ChipGroup name="jobFields" options={JOB_FIELDS} />
        </Field>
        <Field name="mentoringTypes" label="가능한 멘토링 형태" required error={errors.mentoringTypes} hint="복수 선택 가능">
          <ChipGroup name="mentoringTypes" options={MENTORING_TYPES} />
        </Field>
      </Fieldset>

      <Fieldset
        title="추가 정보 (선택)"
        description="멘토님께 맞는 활동을 제안드릴 때 참고할게요. 편하게 적어주세요."
      >
        <Field name="introduction" label="이력 소개" error={errors.introduction} counter={`${introLen}/${TEXT_MAX}`}>
          <textarea
            id="introduction"
            name="introduction"
            rows={6}
            maxLength={TEXT_MAX}
            placeholder="멘토님의 이력을 간단하게 소개해주세요."
            onChange={(e) => setIntroLen(e.target.value.length)}
            className={inputClass}
            aria-invalid={!!errors.introduction}
          />
        </Field>
        <Field name="motivation" label="전하고 싶은 말씀" error={errors.motivation} counter={`${motivationLen}/${TEXT_MAX}`}>
          <textarea
            id="motivation"
            name="motivation"
            rows={6}
            maxLength={TEXT_MAX}
            placeholder="렛츠커리어에 대해 궁금하신 점, 함께해보고 싶은 활동 등 편하게 이야기해주세요."
            onChange={(e) => setMotivationLen(e.target.value.length)}
            className={inputClass}
            aria-invalid={!!errors.motivation}
          />
        </Field>
      </Fieldset>

      <Fieldset title="첨부 (선택)">
        <Field name="attachment" label="이력서 / 포트폴리오" error={errors.attachment} hint="PDF, 10MB 이하">
          <input
            id="attachment"
            name="attachment"
            type="file"
            accept="application/pdf"
            className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-700 hover:file:bg-zinc-200"
          />
        </Field>
        <Field name="links" label="링크" error={errors.links} hint="LinkedIn, 포트폴리오 등 최대 3개">
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <input key={i} name="links" type="url" placeholder="https://" className={inputClass} aria-label={`링크 ${i + 1}`} />
            ))}
          </div>
        </Field>
      </Fieldset>

      <Fieldset title="개인정보 수집·이용 동의">
        <div data-field="privacyAgreed" className="space-y-3">
          {/* 임시 문구 — 법무 검토된 문구로 교체 (docs/DESIGN.md §8) */}
          <div className="rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600">
            <p>· 수집 항목: 성함, 소속, 직무, 연차, 연락처, 이메일, 이력 소개, 전하고 싶은 말씀, 첨부파일·링크</p>
            <p>· 수집 목적: 멘토 선발 및 선발 결과 안내</p>
            <p>· 보유 기간: 모집 종료 후 1년 (요청 시 즉시 파기)</p>
            <p className="mt-2 text-zinc-500">동의를 거부할 수 있으나, 거부 시 멘토 신청이 제한됩니다.</p>
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-[15px]">
            <input type="checkbox" name="privacyAgreed" className="size-5 accent-brand-600" />
            <span>
              개인정보 수집·이용에 동의합니다. <span className="text-red-500">(필수)</span>
            </span>
          </label>
          {errors.privacyAgreed && <p className="text-sm text-red-500">{errors.privacyAgreed}</p>}
        </div>
      </Fieldset>

      <div className="space-y-3">
        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </p>
        )}
        <p className="text-sm text-zinc-500">제출 후에는 수정할 수 없습니다. 내용을 다시 한번 확인해주세요.</p>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-600 py-3.5 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "제출 중…" : "신청서 제출하기"}
        </button>
      </div>
    </form>
  );
}

function Fieldset({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-5 w-full border-b border-zinc-200 pb-3 text-lg font-bold">
        {title}
        {description && <span className="mt-1.5 block text-[15px] font-normal text-zinc-600">{description}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  name,
  label,
  required,
  hint,
  counter,
  error,
  className,
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  counter?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-field={name} className={`space-y-2 ${className ?? ""}`}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={name} className="text-[15px] font-semibold">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
          {hint && <span className="ml-2 text-sm font-normal text-zinc-500">{hint}</span>}
        </label>
        {counter && <span className="text-xs text-zinc-400">{counter}</span>}
      </div>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function ChipGroup({ name, options }: { name: string; options: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label key={opt} className="cursor-pointer">
          <input type="checkbox" name={name} value={opt} className="peer sr-only" />
          <span className="inline-block rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-checked:font-semibold peer-checked:text-brand-700 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-100 hover:border-zinc-400">
            {opt}
          </span>
        </label>
      ))}
    </div>
  );
}
