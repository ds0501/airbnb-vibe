import { Suspense } from "react";
import Categories from "./Categories";

export default function CategoriesWrapper() {
  return (
    <Suspense fallback={<div className="h-[72px]" />}>
      <Categories />
    </Suspense>
  );
}
