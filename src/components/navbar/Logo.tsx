"use client";

import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      className="hidden md:flex items-center gap-1 cursor-pointer select-none"
    >
      {/* Airbnb 베루 아이콘 (Bélo) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8 fill-rose-500"
        aria-hidden="true"
      >
        <path d="M16 1C10.93 1 6.64 5.52 6.64 11.13c0 3.3 1.63 6.72 4.86 10.17 2.28 2.44 4.77 4.38 4.87 4.46l.63.49.63-.49c.1-.08 2.59-2.02 4.87-4.46 3.23-3.45 4.86-6.87 4.86-10.17C26.36 5.52 22.07 1 16 1zm0 2c4.06 0 8.36 3.54 8.36 8.13 0 2.87-1.47 5.96-4.38 9.07A34.1 34.1 0 0 1 16 23.7a34.1 34.1 0 0 1-3.98-3.5C9.11 17.09 7.64 14 7.64 11.13 7.64 6.54 11.94 3 16 3zm0 4.5a3.63 3.63 0 1 0 0 7.26 3.63 3.63 0 0 0 0-7.26zm0 2a1.63 1.63 0 1 1 0 3.26 1.63 1.63 0 0 1 0-3.26zM11.5 25.5c-3.2 0-5.5 1.54-5.5 3.5H26c0-1.96-2.3-3.5-5.5-3.5-.97 0-1.9.18-2.7.49A5.34 5.34 0 0 1 16 29.8a5.34 5.34 0 0 1-1.8-.31c-.8-.31-1.73-.49-2.7-.49z" />
      </svg>
      <span className="text-rose-500 font-bold text-xl tracking-tight">airbnb</span>
    </div>
  );
}
