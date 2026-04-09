"use client";

import { useCallback } from "react";
import { Minus, Plus } from "lucide-react";

interface CounterProps {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
}

export default function Counter({ title, subtitle, value, onChange }: CounterProps) {
  const onAdd = useCallback(() => onChange(value + 1), [value, onChange]);
  const onReduce = useCallback(() => {
    if (value === 1) return;
    onChange(value - 1);
  }, [value, onChange]);

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <div className="font-medium">{title}</div>
        <div className="font-light text-sm text-neutral-500">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <button
          onClick={onReduce}
          className="w-10 h-10 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition disabled:opacity-40"
          disabled={value === 1}
        >
          <Minus size={16} />
        </button>
        <span className="font-light text-xl text-neutral-600 w-6 text-center">{value}</span>
        <button
          onClick={onAdd}
          className="w-10 h-10 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
