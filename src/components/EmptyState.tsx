"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Home, Search } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  showHome?: boolean;
}

export default function EmptyState({
  title = "정확한 결과가 없습니다",
  subtitle = "일부 필터를 변경하거나 제거해 보세요.",
  showReset,
  showHome,
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="h-[60vh] flex flex-col gap-3 justify-center items-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 mb-2">
        {showHome ? (
          <Home size={36} className="text-neutral-400" />
        ) : (
          <Search size={36} className="text-neutral-400" />
        )}
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="font-light text-neutral-500 text-center max-w-xs">{subtitle}</p>
      <div className="flex gap-3 mt-2">
        {showReset && (
          <Button variant="outline" onClick={() => router.push("/")}>
            필터 초기화
          </Button>
        )}
        {showHome && (
          <Button
            className="bg-rose-500 hover:bg-rose-600 text-white"
            onClick={() => router.push("/")}
          >
            홈으로 돌아가기
          </Button>
        )}
      </div>
    </div>
  );
}
