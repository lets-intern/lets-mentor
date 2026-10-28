import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Faq } from "@/components/faq";
import { KAKAO_CHAT_URL } from "@/lib/links";

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

const VALUES = [
  {
    name: "Reliable",
    summary: "믿고 커리어 고민을 함께해요",
    lines: ["앞으로의 커리어 방향을", "고민하고 결정하는데 있어", "신뢰할 수 있는 정보와 경험"],
  },
  {
    name: "Motivating",
    summary: "해내고 싶다는 마음이 들게 해요",
    lines: ["챌린지를 기반으로 한 미션을 통해", "취업 준비생이 포기하지 않고", "목표를 달성할 수 있도록 동기부여"],
  },
  {
    name: "Supportive",
    summary: "불안감과 위화감을 조성하지 않아요",
    lines: ["심리적 압박과 스트레스를 지양하며", "오로지 목표에만 집중할 수 있도록", "취업 준비생을 격려하고 기여"],
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
  labelClassName = "text-[#4a76ff]",
  descriptionClassName = "text-[#707fab]",
}: {
  label: string;
  labelClassName?: string;
  title: ReactNode[];
  description?: string[];
  dark?: boolean;
  descriptionClassName?: string;
}) {
  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-5 text-center sm:gap-[30px]">
      <div className="flex flex-col gap-3">
        <p className={`text-lg leading-[1.17] font-bold sm:text-2xl ${labelClassName}`}>{label}</p>
        <h2
          className={`text-[26px] leading-[1.3] font-bold sm:text-[36px] lg:text-[44px] ${dark ? "text-white" : "text-black"}`}
        >
          <Lines lines={title} />
        </h2>
      </div>
      {description && (
        <p className={`text-base leading-[1.4] sm:text-xl lg:text-2xl ${descriptionClassName}`}>
          <Lines lines={description} />
        </p>
      )}
    </div>
  );
}

// 시안의 과녁 아이콘을 단순화한 버전: 겹친 동심원 + 오른쪽 위 빛
function ValueIcon({ tilt = false }: { tilt?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={`size-16 ${tilt ? "-rotate-15" : ""}`}>
      <defs>
        <linearGradient id="value-icon-shine" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d55f5" stopOpacity="0.4" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31.5" fill="#4d55f5" fillOpacity="0.44" />
      <circle cx="32" cy="32" r="24.5" fill="#4d55f5" fillOpacity="0.44" />
      <circle cx="32" cy="32" r="17.5" fill="#4d55f5" fillOpacity="0.44" />
      <path d="M32 0.5A31.5 31.5 0 0 1 63.5 32H32Z" fill="url(#value-icon-shine)" />
    </svg>
  );
}

function Lines({ lines }: { lines: ReactNode[] }) {
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ));
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
                href={KAKAO_CHAT_URL}
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
              <ul className="flex flex-col gap-4 sm:pl-[120px]">
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

      <section className="flex flex-col items-center gap-14 bg-[#f0f4ff] px-4 pt-20 pb-28 sm:gap-20 sm:px-8 sm:pt-[120px] sm:pb-[160px]">
        <div className="flex w-full flex-col items-center gap-12 sm:gap-14">
          <SectionHeading
            label="렛츠커리어 소개"
            title={[
              "커리어의 첫 걸음",
              <>
                <span className="text-[#6b63ff]">렛츠커리어</span>는 막막함에 주목했어요
              </>,
            ]}
            description={["대한민국의 많은 청년들은 취업 준비를 앞두고 여러 어려움을 느끼고 있어요."]}
            descriptionClassName="text-[#4c4f56]"
          />
          {/* 데스크톱은 시안 좌표대로 겹쳐 놓고, 좁은 화면에서는 세로로 쌓는다 */}
          <div className="relative flex w-full max-w-[1000px] flex-col items-center gap-5 lg:block lg:h-[233px]">
            <p className="order-2 rounded-xl bg-white px-6 py-5 text-center text-[17px] leading-[1.5] font-bold text-neut-0 shadow-[0_2px_8px_rgba(166,170,255,0.5)] sm:text-xl lg:absolute lg:top-[133px] lg:left-[349px] lg:px-10 lg:py-8 lg:text-2xl lg:whitespace-nowrap">
              경쟁의 굴레 속에서 점점 떨어져가는 자신감
            </p>
            <p className="order-1 -rotate-3 rounded-xl bg-white p-5 text-center text-[17px] leading-[1.5] font-bold text-neut-0 shadow-[0_2px_8px_rgba(77,85,245,0.5)] sm:text-xl lg:absolute lg:top-[80px] lg:left-[171px] lg:origin-top-left lg:-rotate-7 lg:p-8 lg:text-2xl lg:whitespace-nowrap">
              나의 상황과는 무관하게 쏟아지는 각종 취업 정보
            </p>
          </div>
        </div>
        <div aria-hidden className="flex flex-col gap-[18px]">
          <span className="size-2 rounded-full bg-[#caccfc]" />
          <span className="size-2 rounded-full bg-[#8288f8]" />
          <span className="size-2 rounded-full bg-brand-600" />
        </div>
        <p className="max-w-[866px] text-center text-2xl leading-[1.5] font-semibold text-[#5c5f66] sm:text-[36px] lg:text-[44px]">
          국내 유일의 서류 작성 교육으로
          <br />
          커리어의 첫 시작을 함께하고자 해요
        </p>
      </section>

      <section className="relative isolate flex flex-col items-center overflow-hidden bg-[#f0f4ff] px-4 pt-20 pb-28 sm:px-8 sm:pt-[120px] sm:pb-[160px]">
        {/* 섹션 위쪽을 감싸는 큰 반원 빛과 카드 아래쪽 은은한 빛 */}
        {/* 타원이 이미지 가로 중앙에 있어 화면 가로 중앙에 맞춘다 */}
        <Image
          src="/mission-background.png"
          alt=""
          width={1993}
          height={1302}
          unoptimized
          className="absolute top-[45px] left-1/2 -z-10 h-[1302px] w-[1993px] max-w-none -translate-x-1/2"
        />
        <div
          aria-hidden
          className="absolute top-[892px] left-1/2 -z-10 h-[423px] w-[1046px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(199,178,255,0.25),rgba(240,244,255,0.25))]"
        />

        <SectionHeading
          label="Mission"
          labelClassName="text-[#969aff]"
          title={[
            "취업 준비생과 함께하는",
            "지속가능한 커리어",
            <>
              <span className="text-[#6b63ff]">‘선순환 커뮤니티’</span>를 만듭니다
            </>,
          ]}
        />

        <div className="mt-14 flex w-full max-w-[1000px] flex-col gap-6 sm:mt-[100px] sm:gap-10">
          <p className="flex flex-col items-center justify-center gap-1 rounded-[10px] bg-white px-5 py-5 text-center shadow-[0_1px_10px_rgba(77,85,245,0.25)] sm:flex-row sm:gap-6 sm:py-7">
            <span className="text-xl leading-[1.4] font-bold text-brand-600 sm:text-[26px]">Vision</span>
            <span className="text-base leading-[1.4] font-medium text-[#3e4148] sm:text-2xl">
              모두의 ‘커리어 시작’ 경험의 퀄리티를 높입니다
            </span>
          </p>
          <ul className="grid gap-4 lg:grid-cols-3 lg:gap-[26px]">
            {VALUES.map((v, i) => (
              <li
                key={v.name}
                className="flex flex-col items-center justify-end gap-5 rounded-xl bg-white px-5 pt-6 pb-8 text-center shadow-[0_0_10px_rgba(77,85,245,0.25)] lg:h-[330px] lg:pb-10"
              >
                <ValueIcon tilt={i === 1} />
                <div className="flex flex-col gap-1">
                  <p className="text-xl leading-[1.4] font-bold text-neut-0 sm:text-2xl">{v.name}</p>
                  <p className="text-base leading-[1.4] font-semibold text-neut-0 sm:text-lg">{v.summary}</p>
                </div>
                <p className="text-[15px] leading-[1.5] font-medium text-neut-40 sm:text-lg">
                  <Lines lines={v.lines} />
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-24 text-center text-2xl leading-[1.4] font-bold tracking-[0.02em] text-neut-0 sm:mt-[180px] sm:text-[36px] lg:text-[44px]">
          모두가 자신만의 커리어를 설계하고
          <br />
          지속할 수 있도록 <span className="text-brand-600">그 과정에 함께 해주세요</span>
        </p>
      </section>

      <section id="faq" className="flex flex-col items-center gap-12 bg-white px-4 pt-20 pb-24 sm:gap-20 sm:px-8 sm:pt-[120px] sm:pb-[120px]">
        <SectionHeading label="FAQ" title={["궁금한 점이 있으신가요?"]} />
        <Faq />
      </section>

      <section className="relative isolate flex flex-col items-center gap-10 overflow-hidden bg-linear-135 from-[#09042a] to-[#5144b6] px-4 py-16 sm:gap-14 sm:py-24">
        {/* 시안 기준 1440px 화면에서 left 70px 위치 = 중앙에서 18px 오른쪽 */}
        <Image
          src="/cta-background.svg"
          alt=""
          width={1336}
          height={1336}
          unoptimized
          className="absolute top-[-253px] left-[calc(50%-650px)] -z-10 size-[1336px] max-w-none"
        />
        <Image
          src="/logo-hero-white.svg"
          alt="렛츠커리어"
          width={220}
          height={35}
          unoptimized
          className="h-auto w-[180px] sm:w-[220px]"
        />
        <h2 className="max-w-[866px] text-center text-[28px] leading-[1.4] font-bold sm:text-[40px] lg:text-[52px]">
          <span className="box-decoration-clone bg-linear-to-b from-[#c4a3ff] to-[#5b54ff] to-70% bg-clip-text text-transparent">
            빠르게 경험하고 수익화까지
          </span>
          <br />
          <span className="text-[#edeefe]">
            렛츠커리어 멘토링으로 <br className="sm:hidden" />
            시도해보세요
          </span>
        </h2>
        <Link
          href="/apply"
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(272deg,#9762f5_1.88%,#544cff_98.12%)] px-7 py-4 text-xl leading-none font-semibold text-white hover:brightness-110 sm:h-16 sm:px-10 sm:py-6 sm:text-2xl"
        >
          3분만에 멘토 신청하기
        </Link>
      </section>

      {/* 플로팅 바가 페이지 끝(푸터)을 가리지 않도록 높이만큼 비워둔다 */}
      <div aria-hidden className="h-24 sm:h-28" />
      <div className="fixed inset-x-0 bottom-4 z-20 px-4 sm:bottom-6">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3 rounded-lg bg-neut-0/64 px-4 py-3 backdrop-blur-[10px] sm:px-5 sm:py-4">
          <p className="hidden text-xl leading-[1.4] font-semibold text-[#fafafa] md:block">
            취업 멘토링의 시작은 렛츠커리어
          </p>
          <div className="flex flex-1 items-center gap-3 md:flex-none">
            <a
              href={KAKAO_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-md bg-white px-5 py-3 text-center text-base leading-normal font-medium text-brand-600 hover:bg-brand-50 md:flex-none"
            >
              문의하기
            </a>
            <Link
              href="/apply"
              className="flex-[2] rounded-md bg-brand-600 px-5 py-3 text-center text-base leading-normal font-medium whitespace-nowrap text-white hover:bg-brand-700 md:flex-none"
            >
              3분만에 멘토 신청하기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
