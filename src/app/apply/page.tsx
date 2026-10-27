import type { Metadata } from "next";
import { ApplyForm } from "@/components/apply-form";

export const metadata: Metadata = { title: "멘토 신청 | 멘토 모집" };

export default function ApplyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight">멘토 신청서</h1>
      <div className="mt-10">
        <ApplyForm />
      </div>
    </div>
  );
}
