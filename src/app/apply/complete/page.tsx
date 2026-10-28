import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "렛츠커리어 | 인턴/신입, 커리어의 첫 걸음을 함께 해요" };

export default function ApplyCompletePage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="size-7" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">신청서가 제출되었습니다</h1>
      <p className="mt-3 leading-relaxed text-zinc-600">
        귀한 시간 내주시어 감사합니다.
        <br />
        5영업일 내로 선택해주신 연락 수단을 통해 회신드리겠습니다.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/status" className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">
          신청 현황 조회
        </Link>
        <Link href="/" className="rounded-lg border border-zinc-200 px-6 py-3 font-semibold text-zinc-700 hover:bg-zinc-50">
          홈으로
        </Link>
      </div>
    </div>
  );
}
