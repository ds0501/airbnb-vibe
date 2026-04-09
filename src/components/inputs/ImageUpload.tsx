"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { uploadImage } from "@/lib/supabase";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("이미지 파일만 업로드할 수 있습니다.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      setIsLoading(true);
      try {
        const url = await uploadImage(file);
        onChange(url);
        toast.success("이미지가 업로드되었습니다.");
      } catch {
        toast.error("이미지 업로드에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [onChange]
  );

  return (
    <div className="w-full">
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image src={value} alt="업로드된 사진" fill className="object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:opacity-80 transition"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          className={`
            flex flex-col items-center justify-center gap-4
            w-full aspect-video border-2 border-dashed border-neutral-300
            rounded-xl cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition
            ${isLoading ? "opacity-60 pointer-events-none" : ""}
          `}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <ImagePlus size={40} className="text-neutral-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-600">
              {isLoading ? "업로드 중..." : "클릭하여 사진 추가"}
            </p>
            <p className="text-xs text-neutral-400 mt-1">PNG, JPG, WEBP (최대 5MB)</p>
          </div>
        </label>
      )}
    </div>
  );
}
