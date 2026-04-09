"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { categories } from "@/lib/categories";

interface CategoryBoxProps {
  label: string;
  icon: React.ElementType;
  selected: boolean;
  onClick: (label: string) => void;
}

function CategoryBox({ label, icon: Icon, selected, onClick }: CategoryBoxProps) {
  return (
    <div
      onClick={() => onClick(label)}
      className={`
        flex flex-col items-center justify-center gap-2
        pb-4 pt-1 px-3 border-b-2 cursor-pointer
        hover:text-neutral-800 hover:border-neutral-800 transition
        min-w-fit whitespace-nowrap
        ${selected
          ? "border-neutral-800 text-neutral-800"
          : "border-transparent text-neutral-500"}
      `}
    >
      <Icon size={22} strokeWidth={1.8} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

export default function Categories() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = searchParams.get("categoryName");

  const handleClick = useCallback(
    (label: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("categoryName") === label) {
        params.delete("categoryName");
      } else {
        params.set("categoryName", label);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  if (pathname !== "/") return null;

  return (
    <div className="flex flex-row items-center gap-1 overflow-x-auto scrollbar-hide px-4">
      {categories.map((cat) => (
        <CategoryBox
          key={cat.label}
          label={cat.label}
          icon={cat.icon}
          selected={currentCategory === cat.label}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}
