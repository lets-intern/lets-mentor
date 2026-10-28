import type { Metadata } from "next";
import { StatusLookup } from "@/components/status-lookup";

export const metadata: Metadata = { title: "렛츠커리어 | 인턴/신입, 커리어의 첫 걸음을 함께 해요" };

export default function StatusPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight">신청 현황 조회</h1>
      <p className="mt-2 text-zinc-600">신청 시 입력한 성함과 연락처를 입력해주세요.</p>
      <div className="mt-10">
        <StatusLookup />
      </div>
    </div>
  );
}
