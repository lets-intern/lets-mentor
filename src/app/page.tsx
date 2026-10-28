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

// 아래로 갈수록 진해지는 말풍선. 마지막 흰 말풍선이 캐릭터의 대답
const MOTIVATIONS = [
  {
    lines: ["사람이 좋아요!", "고민을 듣고 성장하는 과정을 지켜보고 싶어요"],
    row: "items-start sm:pr-[100px]",
    bubble: "bg-[#edeefe]/50 text-neut-0",
  },
  {
    lines: ["힘들었던 취업 준비 시절,", "선배님들께 받았던 도움을 후배들에게 돌려주고 싶어요"],
    row: "items-end",
    bubble: "bg-[#edeefe]/70 text-neut-0",
  },
  {
    lines: ["쌓아온 여러 성공 경험을 토대로", "나만의 커리어 브랜드와 영향력을 만들고 싶어요"],
    row: "items-start sm:pr-[100px]",
    bubble: "bg-[#edeefe] text-neut-0",
  },
  {
    lines: ["퇴근 후 가능한 시간에 부업을 하고 싶어요"],
    row: "items-end sm:pr-5",
    bubble: "bg-[#95b3ff] text-black",
  },
  {
    lines: ["멘토 활동을 통해 직무에 대한 나의 지식과 경험을", "후배들에게 나누고 함께 성장하고 싶어요!"],
    row: "items-center",
    bubble: "bg-white text-black sm:py-8",
  },
];

const CONCERNS = [
  {
    title: "현직자 멘토 활동, 관심은 있는데 내가 무얼 할 수 있는지 잘 모르겠어요",
    details: [
      "어떤 지식과 경험을 공유해야 할지 잘 모르겠어요",
      "알려주고 싶은 정보는 있지만 어떻게 전달해야 할지 모르겠어요",
    ],
  },
  {
    title: "업무 일정과 개인 일정은 꼭! 보장받고 싶어요",
    details: ["업무 일정과 개인 일정이 유동적이라 걱정이에요", "오프라인 멘토링은 참여하기 어렵고 부담스러워요"],
  },
  {
    title: "멘토링만 하면 되는 줄 알았는데...이것 저것 복잡하고 헷갈려요",
    details: [
      "합류 프로세스, 활동 심사, 중간 평가 등 내부 절차가 많아요",
      "기업 보고용 멘토링 일지 작성까지 과정이 복잡해요",
    ],
  },
  {
    title: "개인정보가 노출될 수 있다는 점이 부담스러워요",
    details: ["이름, 얼굴 등의 개인정보를 밝히는 것은 아직 부담스러워요"],
  },
];

// 섹션 공통 머리말: 파란 라벨 + 큰 제목 + 회색 설명
function SectionHeading({
  label,
  title,
  description,
  dark = false,
}: {
  label: string;
  title: string[];
  description: string[];
  dark?: boolean;
}) {
  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-5 text-center sm:gap-[30px]">
      <div className="flex flex-col gap-3">
        <p className="text-lg leading-[1.17] font-bold text-[#4a76ff] sm:text-2xl">{label}</p>
        <h2
          className={`text-[26px] leading-[1.3] font-bold sm:text-[36px] lg:text-[44px] ${dark ? "text-white" : "text-black"}`}
        >
          {title[0]}
          <br />
          {title[1]}
        </h2>
      </div>
      <p className="text-base leading-[1.4] text-[#707fab] sm:text-xl lg:text-2xl">
        {description[0]}
        <br />
        {description[1]}
      </p>
    </div>
  );
}

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
                <span className="box-decoration-clone bg-linear-to-b from-accent-purple to-[#6963f6] to-70% bg-clip-text text-transparent">
                  빠르게 합류하고 수익화까지
                </span>
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

      <section className="flex flex-col items-center gap-12 overflow-x-clip bg-linear-to-b from-white to-[#a9c1ff] px-4 pt-24 sm:gap-20 sm:px-8 sm:pt-[140px]">
        <SectionHeading
          label="멘토 활동 계기"
          title={["현직자 멘토 활동에", "관심을 가지게 되신 계기가 있나요?"]}
          description={[
            "렛츠커리어와 합류한 많은 멘토님들은",
            "아래 계기들을 토대로 현직자 멘토 활동에 관심을 가지셨다고 해요!",
          ]}
        />

        <div className="relative isolate flex w-full max-w-[800px] flex-col items-center gap-[18px]">
          {/* 위쪽 말풍선들을 덮어 흐리게 만드는 막 */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-5 left-1/2 z-10 h-[415px] w-screen -translate-x-1/2 bg-linear-to-b from-[#e3ebff] to-[#e3ebff]/0"
          />
          <div className="flex w-full flex-col items-center">
            <ul className="flex w-full flex-col gap-4 sm:gap-6">
              {MOTIVATIONS.map((m) => (
                <li key={m.lines[0]} className={`flex flex-col ${m.row}`}>
                  <p
                    className={`rounded-[9px] px-5 py-4 text-center text-[15px] leading-[1.4] font-medium sm:px-14 sm:py-6 sm:text-xl lg:text-2xl ${m.bubble}`}
                  >
                    {m.lines.map((line, i) => (
                      <span key={line}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
            {/* 흰 말풍선 꼬리 */}
            <div
              aria-hidden
              className="h-6 w-[22px] bg-white [clip-path:polygon(0_0,100%_0,50%_100%)] sm:h-[37px] sm:w-[34px]"
            />
          </div>
          <Image
            src="/mentor-character.svg"
            alt=""
            width={170}
            height={204}
            unoptimized
            className="h-auto w-[130px] sm:w-[170px]"
          />
        </div>
      </section>

      <section className="flex flex-col items-center gap-16 bg-neut-0 px-4 pt-20 pb-24 sm:gap-[120px] sm:px-8 sm:pt-[120px] sm:pb-[140px]">
        <SectionHeading
          dark
          label="현직자 멘토 활동의 어려움"
          title={["그러나 멘토 활동을 고민하게 만드는", "4가지 걸림돌이 있어요"]}
          description={["많은 멘토님들이 아래 4가지 문제에 대해", "고민하고 계신다는 점에 동감했어요."]}
        />

        <ol className="flex w-full max-w-[760px] flex-col gap-14 sm:gap-20">
          {CONCERNS.map((c, i) => (
            <li key={c.title} className="flex flex-col gap-8 sm:gap-10">
              <div className="relative rounded-xl bg-white px-5 pt-9 pb-6 text-center sm:p-10">
                <p className="text-[17px] leading-[1.5] font-bold text-neut-0 sm:text-2xl">{c.title}</p>
                <span className="absolute top-[-14px] left-3 origin-top-left -rotate-10 rounded-xl bg-brand-600 px-3 py-0.5 text-base leading-[1.4] font-bold text-white sm:top-[-18px] sm:left-[17px] sm:px-4 sm:py-1 sm:text-[22px]">
                  고민 {i + 1}
                </span>
              </div>
              <ul className="flex flex-col gap-4 sm:px-[120px]">
                {c.details.map((d) => (
                  <li key={d} className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#404052] sm:size-8">
                      <svg aria-hidden viewBox="0 0 14 12" className="w-[13px] text-brand-600">
                        <path
                          d="M2 6.5 5.5 10 12 2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[15px] leading-[1.4] font-medium text-[#d8d8d8] sm:text-xl">{d}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
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
