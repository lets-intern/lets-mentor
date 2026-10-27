import Link from "next/link";

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
      <section className="bg-brand-50">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-semibold text-brand-600">현직자 멘토 모집</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            취업을 준비하는 후배들의
            <br />
            멘토가 되어주세요
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/apply"
              className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
            >
              멘토 신청하기
            </Link>
            <Link
              href="/status"
              className="rounded-lg border border-zinc-200 bg-white px-6 py-3 font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              신청 현황 조회
            </Link>
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
