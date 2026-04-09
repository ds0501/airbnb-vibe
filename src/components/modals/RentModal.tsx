"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { categories } from "@/lib/categories";
import type { CountrySelectValue } from "@/types";
import Modal from "./Modal";
import Counter from "@/components/inputs/Counter";
import CountrySelect from "@/components/inputs/CountrySelect";
import ImageUpload from "@/components/inputs/ImageUpload";
import useRentModal from "@/hooks/useRentModal";

// ── 스텝 정의 ──────────────────────────────────────────────
enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO     = 2,
  IMAGES   = 3,
}

interface FormData {
  categoryName: string;
  country: CountrySelectValue | null;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  title: string;
  description: string;
  price: string;
  photo: string;
}

const defaultForm: FormData = {
  categoryName: "",
  country: null,
  guests: 1,
  bedrooms: 1,
  bathrooms: 1,
  title: "",
  description: "",
  price: "",
  photo: "",
};

// ── 스텝별 타이틀 ──────────────────────────────────────────
const stepTitle = ["숙소 카테고리", "숙소 위치", "숙소 정보", "숙소 사진"];

export default function RentModal() {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormData>(defaultForm);

  const setField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  const onBack = useCallback(() => {
    if (step === STEPS.CATEGORY) {
      rentModal.onClose();
      setStep(STEPS.CATEGORY);
      setForm(defaultForm);
    } else {
      setStep((s) => s - 1);
    }
  }, [step, rentModal]);

  const onNext = useCallback(async () => {
    // 유효성 검사
    if (step === STEPS.CATEGORY && !form.categoryName) {
      toast.error("카테고리를 선택해주세요.");
      return;
    }
    if (step === STEPS.LOCATION && !form.country) {
      toast.error("국가를 선택해주세요.");
      return;
    }
    if (step === STEPS.INFO) {
      if (!form.title.trim()) { toast.error("제목을 입력해주세요."); return; }
      if (!form.description.trim()) { toast.error("설명을 입력해주세요."); return; }
      if (!form.price || Number(form.price) < 1) { toast.error("가격을 입력해주세요."); return; }
    }
    if (step === STEPS.IMAGES) {
      if (!form.photo) { toast.error("사진을 업로드해주세요."); return; }

      // 마지막 스텝 → 제출
      setIsLoading(true);
      try {
        const res = await fetch("/api/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryName: form.categoryName,
            country: form.country!.label,
            guests: form.guests,
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            title: form.title,
            description: form.description,
            price: Number(form.price),
            photo: form.photo,
          }),
        });

        if (res.status === 401) {
          router.push("/api/auth/login");
          return;
        }
        if (!res.ok) throw new Error();

        toast.success("숙소가 등록되었습니다!");
        rentModal.onClose();
        setStep(STEPS.CATEGORY);
        setForm(defaultForm);
        router.refresh();
      } catch {
        toast.error("숙소 등록에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setStep((s) => s + 1);
  }, [step, form, rentModal, router]);

  // ── 스텝별 Body ────────────────────────────────────────
  let body: React.ReactNode;

  if (step === STEPS.CATEGORY) {
    body = (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-semibold">어떤 유형의 숙소인가요?</h3>
          <p className="text-neutral-500 font-light mt-1 text-sm">카테고리를 선택해주세요.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const selected = form.categoryName === cat.label;
            return (
              <div
                key={cat.label}
                onClick={() => setField("categoryName", cat.label)}
                className={`
                  flex flex-col gap-3 p-4 rounded-xl border-2 cursor-pointer
                  hover:border-neutral-800 transition
                  ${selected ? "border-neutral-800 bg-neutral-50" : "border-neutral-200"}
                `}
              >
                <Icon size={26} strokeWidth={1.6} />
                <span className="text-sm font-semibold">{cat.label}</span>
                <span className="text-xs text-neutral-400 font-light">{cat.description}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === STEPS.LOCATION) {
    body = (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-semibold">숙소는 어디에 위치하나요?</h3>
          <p className="text-neutral-500 font-light mt-1 text-sm">게스트가 찾을 수 있도록 도와주세요!</p>
        </div>
        <CountrySelect
          value={form.country ?? undefined}
          onChange={(v) => setField("country", v)}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    body = (
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-xl font-semibold">숙소 정보를 알려주세요</h3>
          <p className="text-neutral-500 font-light mt-1 text-sm">어떤 편의시설을 제공하나요?</p>
        </div>

        <div className="flex flex-col gap-4">
          <Counter
            title="게스트"
            subtitle="몇 명의 게스트를 허용하나요?"
            value={form.guests}
            onChange={(v) => setField("guests", v)}
          />
          <hr />
          <Counter
            title="침실"
            subtitle="침실이 몇 개인가요?"
            value={form.bedrooms}
            onChange={(v) => setField("bedrooms", v)}
          />
          <hr />
          <Counter
            title="욕실"
            subtitle="욕실이 몇 개인가요?"
            value={form.bathrooms}
            onChange={(v) => setField("bathrooms", v)}
          />
        </div>

        <hr />

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">제목</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="숙소 제목을 입력하세요"
              className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-neutral-800 transition"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">설명</label>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="숙소에 대해 설명해주세요"
              rows={3}
              className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-neutral-800 transition resize-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">1박 가격 (₩)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="0"
              min={1}
              className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-neutral-800 transition"
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    body = (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-semibold">숙소 사진을 추가해주세요</h3>
          <p className="text-neutral-500 font-light mt-1 text-sm">게스트에게 숙소를 보여주세요!</p>
        </div>
        <ImageUpload
          value={form.photo}
          onChange={(v) => setField("photo", v)}
        />
      </div>
    );
  }

  const actionLabel = step === STEPS.IMAGES ? "등록 완료" : "다음";
  const secondaryActionLabel = step === STEPS.CATEGORY ? "취소" : "이전";

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={() => {
        rentModal.onClose();
        setStep(STEPS.CATEGORY);
        setForm(defaultForm);
      }}
      onSubmit={onNext}
      title={stepTitle[step]}
      body={body}
      actionLabel={actionLabel}
      secondaryAction={onBack}
      secondaryActionLabel={secondaryActionLabel}
      disabled={isLoading}
    />
  );
}
