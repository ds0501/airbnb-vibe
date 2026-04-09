import countries from "world-countries";
import type { CountrySelectValue } from "@/types";

const formattedCountries: CountrySelectValue[] = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

const useCountries = () => {
  const getAll = () => formattedCountries;

  // 국가 코드(cca2)로 조회
  const getByValue = (value: string) =>
    formattedCountries.find((item) => item.value === value);

  // 국가명(label)으로 조회 — DB에 label로 저장하므로 상세 페이지에서 사용
  const getByLabel = (label: string) =>
    formattedCountries.find((item) => item.label === label);

  return { getAll, getByValue, getByLabel };
};

export default useCountries;
