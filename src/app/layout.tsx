import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "멘토 모집",
  description: "취업준비생과 함께할 현직자 멘토를 모집합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="font-bold tracking-tight">
              멘토 모집
            </Link>
            <div className="flex items-center gap-1 text-sm">
              <Link href="/status" className="rounded-md px-3 py-2 text-zinc-600 hover:bg-zinc-100">
                신청 현황 조회
              </Link>
              <Link
                href="/apply"
                className="rounded-md bg-brand-600 px-3 py-2 font-semibold text-white hover:bg-brand-700"
              >
                신청하기
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-zinc-100 py-8 text-center text-xs text-zinc-400">
          {/* 임시 문구 — 회사명·문의 채널 확정 시 교체 */}
          문의: contact@example.com
        </footer>
      </body>
    </html>
  );
}
