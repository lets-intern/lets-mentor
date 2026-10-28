"use client";

import { useState } from "react";
import type { ApplicationStatus } from "@/lib/application";

const STEPS: { key: ApplicationStatus; label: string }[] = [
  { key: "received", label: "접수 완료" },
  { key: "reviewing", label: "검토중" },
  { key: "replied", label: "회신완료" },
];

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-[15px] outline-none placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

type Result = { status: ApplicationStatus; statusLabel: string; createdAt: string };

const REPLY_BUSINESS_DAYS = 5;

// 신청일(KST)로부터 주말을 제외한 영업일을 더한 날짜. 공휴일은 반영하지 않음.
function expectedReplyDate(createdAt: string) {
  const kst = new Date(new Date(createdAt).getTime() + 9 * 60 * 60 * 1000);
  const date = new Date(Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()));
  let added = 0;
  while (added < REPLY_BUSINESS_DAYS) {
    date.setUTCDate(date.getUTCDate() + 1);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) added++;
  }
  return date.toLocaleDateString("ko-KR", { timeZone: "UTC", month: "long", day: "numeric", weekday: "short" });
}

export function StatusLookup() {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fd.get("name"), phone: fd.get("phone") }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error);
    } catch {
      setError("조회 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  const currentIndex = result ? STEPS.findIndex((s) => s.key === result.status) : -1;

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-[15px] font-semibold">성함</label>
          <input id="name" name="name" required autoComplete="name" className={inputClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-[15px] font-semibold">연락처</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            required
            autoComplete="tel"
            placeholder="010-0000-0000"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 py-3.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "조회 중…" : "조회하기"}
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-lg bg-zinc-50 px-4 py-4 text-center text-sm text-zinc-600">
          {error}
        </p>
      )}

      {result && (
        <div className="rounded-xl border border-zinc-200 p-6" aria-live="polite">
          <p className="text-sm text-zinc-500">
            신청일 {new Date(result.createdAt).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-xl font-bold text-brand-600">{result.statusLabel}</p>
            {result.status !== "replied" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700">
                예상 회신일
                <span className="font-semibold">{expectedReplyDate(result.createdAt)}</span>
              </span>
            )}
          </div>
          <ol className="mt-6 flex items-center">
            {STEPS.map((step, i) => {
              const done = i <= currentIndex;
              return (
                <li key={step.key} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                        done ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-400"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className={`whitespace-nowrap text-xs ${done ? "font-semibold text-zinc-900" : "text-zinc-400"}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`mx-2 mb-6 h-0.5 flex-1 ${i < currentIndex ? "bg-brand-600" : "bg-zinc-200"}`} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
