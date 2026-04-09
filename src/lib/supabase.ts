import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BUCKET = "images";

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("[uploadImage] Supabase error:", error.message, error);
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }

  // getPublicUrl은 에러를 던지지 않으므로 URL 확인만 함
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  if (!urlData?.publicUrl) {
    throw new Error("퍼블릭 URL을 가져올 수 없습니다. 버킷이 Public으로 설정되어 있는지 확인하세요.");
  }

  return urlData.publicUrl;
}
