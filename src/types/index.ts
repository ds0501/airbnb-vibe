import type { User, Home, Reservation, Favorite } from "@prisma/client";

export type { User, Home, Reservation, Favorite };

export type CountrySelectValue = {
  flag: string;
  label: string;
  latlng: number[];
  region: string;
  value: string;
};
