"use client";

import { Suspense } from "react";
import SearchModal from "./SearchModal";

export default function SearchModalWrapper() {
  return (
    <Suspense fallback={null}>
      <SearchModal />
    </Suspense>
  );
}
