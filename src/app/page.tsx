import Link from "next/link";
import Image from "next/image";

// 랜딩 콘텐츠는 확정 전이라 섹션 자리만 잡아둔다.
const SECTIONS = [
  { id: "about", label: "멘토링 소개" },
  { id: "role", label: "멘토 역할" },
  { id: "benefits", label: "멘토 혜택" },
  { id: "process", label: "선발 절차" },
  { id: "faq", label: "자주 묻는 질문" },
];

export default function Home() {
  return (
    <>
      <section className="px-4 pt-4 sm:px-8 sm:pt-8 lg:px-[52px]">
        <div className="relative isolate flex min-h-[480px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-neut-95 px-5 py-16 sm:h-[600px] sm:px-10">
          {/* 하단 중앙에서 번지는 보라색 글로우 */}
          <div
            aria-hidden
            className="absolute top-1/3 left-1/2 -z-10 size-[800px] -translate-x-1/2 rounded-full bg-linear-to-b from-[#90a1ff]/20 to-[#9e86ff]/20 blur-[150px]"
          />
          <div className="flex w-full max-w-[1000px] flex-col items-center gap-10 sm:gap-16">
            <Image
              src="/logo-hero.svg"
              alt="렛츠커리어"
              width={220}
              height={35}
              priority
              unoptimized
              className="h-auto w-[180px] sm:w-[220px]"
            />
            <div className="flex flex-col gap-4 text-center sm:gap-6">
              <h1 className="text-[28px] leading-[1.4] font-extrabold tracking-[0.01em] sm:text-[40px] lg:text-[52px]">
                <span className="text-accent-purple">빠르게 합류하고 수익화까지</span>
                <br />
                렛츠커리어 현직자 멘토로 <br className="sm:hidden" />
                함께하세요
              </h1>
              <p className="text-base leading-[1.4] text-neut-40 sm:text-xl lg:text-2xl">
                모두가 자신만의 커리어를 설계하고 지속할 수 있도록
                <br />
                그 과정에 렛츠커리어와 함께 해주세요.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/apply"
                className="w-[136px] rounded-md bg-primary-90 px-5 py-3 text-center text-lg leading-[1.5] font-medium text-white hover:bg-brand-600 sm:w-[150px] sm:text-xl"
              >
                멘토 신청하기
              </Link>
              <a
                href="https://open.kakao.com/me/Letscareerwinter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[136px] rounded-md bg-neut-0 px-5 py-3 text-center text-lg leading-[1.5] font-medium text-white hover:bg-zinc-700 sm:w-[150px] sm:text-xl"
              >
                문의하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="border-b border-zinc-100">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight">{s.label}</h2>
            <div className="mt-6 rounded-xl border border-dashed border-zinc-200 p-10 text-center text-sm text-zinc-400">
              콘텐츠 준비 중
            </div>
          </div>
        </section>
      ))}

      <section className="mx-auto w-full max-w-5xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">지금 멘토로 지원하세요</h2>
        <Link
          href="/apply"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-8 py-3 font-semibold text-white hover:bg-brand-700"
        >
          멘토 신청하기
        </Link>
      </section>
    </>
  );
}
