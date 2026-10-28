"use client";

import { useState } from "react";
import { KAKAO_CHAT_URL } from "@/lib/links";

type FaqItem = { question: string; answer: string };

// 임시 내용 — 탭별 질문 확정 시 교체
const FAQ_TABS: { label: string; items: FaqItem[] }[] = [
  {
    label: "참여 전",
    items: [
      {
        question: "온라인 참여는 어떻게 하나요?",
        answer:
          "신청을 완료하신 후에, 카카오톡 알림톡을 통해 zoom 링크를 전송드릴 예정입니다. 혹시나 링크를 받아보지 못하셨다면, 채팅문의를 통해 문의주세요.",
      },
    ],
  },
  { label: "참여 중", items: [] },
  { label: "참여 후", items: [] },
  { label: "기타", items: [] },
];

export function Faq() {
  const [active, setActive] = useState(0);
  const { items } = FAQ_TABS[active];

  return (
    <div className="flex w-full max-w-[800px] flex-col gap-16 sm:gap-[100px]">
      <div className="flex flex-col items-center gap-10 sm:gap-20">
        <div role="tablist" className="flex w-full max-w-[652px] gap-2 sm:gap-[23px]">
          {FAQ_TABS.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`flex-1 rounded-full border px-2 py-2.5 text-[15px] leading-[1.4] font-semibold sm:px-5 sm:py-3.5 sm:text-xl ${
                i === active
                  ? "border-[#4a76ff] bg-[#f1f4ff] text-[#4a76ff]"
                  : "border-[#cfcfcf] bg-white text-[#989ba2] hover:bg-zinc-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="flex w-full flex-col gap-3">
          {items.length === 0 && (
            <p className="py-10 text-center text-base text-[#989ba2]">등록된 질문이 없어요.</p>
          )}
          {items.map((item) => (
            // 탭을 바꾸면 펼침 상태도 처음(열림)으로 돌아간다
            <details key={`${active}-${item.question}`} open className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm border border-[#e7e7e7] bg-[#fafafa] px-4 py-3.5 group-open:rounded-b-none sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
                <span className="text-[17px] leading-[1.4] font-semibold text-neut-0 sm:text-[22px]">
                  {item.question}
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="size-6 shrink-0 text-neut-40 transition-transform group-open:rotate-180"
                >
                  <path
                    d="M6 9.5 12 15l6-5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <p className="rounded-b-sm border border-t-0 border-[#e7e7e7] bg-white p-4 text-[15px] leading-[1.45] text-[#5c5f66] sm:p-5 sm:text-lg">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 rounded-xl bg-neut-95 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-[30px]">
        <p className="text-lg leading-[1.4] font-semibold text-[#5c5f66] sm:text-xl">
          아직 궁금증이 풀리지 않았다면?
        </p>
        <a
          href={KAKAO_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center rounded-lg border border-[#cfcfcf] bg-white px-6 text-base leading-[1.45] font-medium text-[#3e4148] hover:bg-zinc-50 sm:h-14 sm:text-lg"
        >
          1:1 채팅 문의하기
        </a>
      </div>
    </div>
  );
}
