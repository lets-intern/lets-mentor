"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 신청서 작성 중에는 다른 페이지로 빠져나가지 않도록 숨긴다
export function HeaderActions() {
  if (usePathname() === "/apply") return null;

  return (
    <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm">
      <Link href="/status" className="rounded-md px-2.5 py-2 sm:px-3 text-zinc-600 hover:bg-zinc-100">
        신청 현황 조회
      </Link>
      <Link
        href="/apply"
        className="rounded-md bg-brand-600 px-2.5 py-2 sm:px-3 font-semibold text-white hover:bg-brand-700"
      >
        신청하기
      </Link>
    </div>
  );
}
