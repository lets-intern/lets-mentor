import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeaderActions } from "@/components/header-actions";
import "./globals.css";

// Vercel에서는 프로젝트에 연결된 Production 도메인을 자동으로 쓴다
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
          <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
            <Link href="/" className="flex min-w-0 items-center">
              {/* 좁은 화면에서는 우측 버튼 자리를 남기고 비율대로 줄어든다 (최대 높이 24px) */}
              <Image
                src="/logo.svg"
                alt="렛츠커리어"
                width={234}
                height={26}
                priority
                unoptimized
                className="h-auto w-full max-w-[216px]"
              />
            </Link>
            <HeaderActions />
          </nav>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-zinc-100 py-8 text-center text-xs text-zinc-400">
          {/* 회사명 확정 시 추가 */}
          문의:{" "}
          <a href="mailto:official@letscareer.co.kr" className="hover:text-zinc-600 hover:underline">
            official@letscareer.co.kr
          </a>
        </footer>
      </body>
    </html>
  );
}
