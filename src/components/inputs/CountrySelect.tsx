"use client";

import { useState, useRef, useEffect } from "react";
import useCountries from "@/hooks/useCountries";
import type { CountrySelectValue } from "@/types";
import { ChevronDown } from "lucide-react";

interface CountrySelectProps {
  value?: CountrySelectValue;
  onChange: (value: CountrySelectValue) => void;
}

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
  const { getAll } = useCountries();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const countries = getAll();
  const filtered = countries.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border border-neutral-300 rounded-lg px-4 py-3 cursor-pointer hover:border-neutral-400 transition"
      >
        {value ? (
          <span className="flex items-center gap-2 text-sm">
            <span>{value.flag}</span>
            <span>{value.label}</span>
          </span>
        ) : (
          <span className="text-sm text-neutral-400">국가를 선택하세요</span>
        )}
        <ChevronDown size={16} className="text-neutral-500" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b">
            <input
              autoFocus
              type="text"
              placeholder="국가 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm outline-none px-2 py-1"
            />
          </div>
          <ul className="overflow-y-auto max-h-48">
            {filtered.map((country) => (
              <li
                key={country.value}
                onClick={() => {
                  onChange(country);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-neutral-100 transition ${
                  value?.value === country.value ? "bg-neutral-100 font-medium" : ""
                }`}
              >
                <span>{country.flag}</span>
                <span>{country.label}</span>
                <span className="ml-auto text-xs text-neutral-400">{country.region}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
