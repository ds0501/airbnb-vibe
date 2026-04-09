"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRange, type RangeKeyDict } from "react-date-range";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import qs from "query-string";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import Modal from "./Modal";
import CountrySelect from "@/components/inputs/CountrySelect";
import Counter from "@/components/inputs/Counter";
import useSearchModal from "@/hooks/useSearchModal";
import type { CountrySelectValue } from "@/types";

enum STEPS {
  LOCATION = 0,
  DATE     = 1,
  INFO     = 2,
}

const stepTitle = ["어디로 가시나요?", "언제 가시나요?", "게스트 수를 알려주세요"];

export default function SearchModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchModal = useSearchModal();

  const [step, setStep] = useState(STEPS.LOCATION);
  const [country, setCountry] = useState<CountrySelectValue | undefined>();
  const [guestCount, setGuestCount] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const onBack = useCallback(() => {
    if (step === STEPS.LOCATION) {
      searchModal.onClose();
    } else {
      setStep((s) => s - 1);
    }
  }, [step, searchModal]);

  const onNext = useCallback(() => {
    if (step !== STEPS.INFO) {
      setStep((s) => s + 1);
      return;
    }

    // 마지막 스텝: URL 파라미터 구성 후 이동
    const current = qs.parse(searchParams.toString());

    const query: Record<string, string | number | undefined> = {};
    // qs.parse 결과(null/배열 포함)에서 string 값만 복사
    for (const [k, v] of Object.entries(current)) {
      if (typeof v === "string") query[k] = v;
    }

    if (country) query.country = country.label;
    if (guestCount > 1) query.guests = guestCount;

    const start = dateRange.startDate;
    const end = dateRange.endDate;
    // 날짜를 실제로 선택했을 때만 포함 (시작/종료가 다를 때)
    if (start.toDateString() !== end.toDateString()) {
      query.startDate = start.toISOString();
      query.endDate = end.toISOString();
    }

    // 선택 안 한 값은 제거
    if (!country) delete query.country;

    const url = qs.stringifyUrl(
      { url: "/", query },
      { skipNull: true, skipEmptyString: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [step, searchModal, country, guestCount, dateRange, searchParams, router]);

  const handleDateSelect = useCallback((ranges: RangeKeyDict) => {
    const sel = ranges.selection;
    setDateRange({
      startDate: sel.startDate ?? new Date(),
      endDate: sel.endDate ?? new Date(),
      key: "selection",
    });
  }, []);

  // 검색바에 표시할 요약 텍스트
  const locationLabel = useMemo(
    () => (country ? `${country.flag} ${country.label}` : "어디든지"),
    [country]
  );
  const dateLabel = useMemo(() => {
    const start = dateRange.startDate;
    const end = dateRange.endDate;
    if (start.toDateString() === end.toDateString()) return "언제든지";
    return `${format(start, "M/d")} - ${format(end, "M/d")}`;
  }, [dateRange]);

  // ── 스텝별 Body ────────────────────────────────────────────
  let body: React.ReactNode;

  if (step === STEPS.LOCATION) {
    body = (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-semibold">{stepTitle[STEPS.LOCATION]}</h3>
          <p className="text-neutral-500 font-light mt-1 text-sm">목적지를 선택해주세요.</p>
        </div>
        <CountrySelect value={country} onChange={setCountry} />
      </div>
    );
  }

  if (step === STEPS.DATE) {
    body = (
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold">{stepTitle[STEPS.DATE]}</h3>
          <p className="text-neutral-500 font-light mt-1 text-sm">체크인/체크아웃 날짜를 선택하세요.</p>
        </div>
        <DateRange
          rangeColors={["#f43f5e"]}
          ranges={[dateRange]}
          date={new Date()}
          onChange={handleDateSelect}
          direction="vertical"
          showDateDisplay={false}
          minDate={new Date()}
          locale={ko}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    body = (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-semibold">{stepTitle[STEPS.INFO]}</h3>
          <p className="text-neutral-500 font-light mt-1 text-sm">몇 명이 여행하나요?</p>
        </div>
        <Counter
          title="게스트"
          subtitle="몇 명의 게스트가 오나요?"
          value={guestCount}
          onChange={setGuestCount}
        />
        {/* 선택 요약 */}
        <div className="flex flex-col gap-2 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-600">
          <div className="flex justify-between">
            <span className="font-medium">목적지</span>
            <span>{locationLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">날짜</span>
            <span>{dateLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">게스트</span>
            <span>{guestCount}명</span>
          </div>
        </div>
      </div>
    );
  }

  const actionLabel = step === STEPS.INFO ? "검색" : "다음";
  const secondaryActionLabel = step === STEPS.LOCATION ? "취소" : "이전";

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={() => {
        searchModal.onClose();
        setStep(STEPS.LOCATION);
      }}
      onSubmit={onNext}
      title={stepTitle[step]}
      body={body}
      actionLabel={actionLabel}
      secondaryAction={onBack}
      secondaryActionLabel={secondaryActionLabel}
    />
  );
}
