import type { User, Home, Reservation, Favorite } from "@prisma/client";

export type { User, Home, Reservation, Favorite };

export type CountrySelectValue = {
  flag: string;
  label: string;
  latlng: number[];
  region: string;
  value: string;
};

// Date 필드를 string으로 직렬화한 Safe 타입들
export type SafeUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeListing = Omit<Home, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "updatedAt" | "startDate" | "endDate"
> & {
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
};
