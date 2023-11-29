import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createUrl(
  url: string,
  query?: Record<string, any>,
  extraOptions?: { skipEmptyString?: boolean; skipNull?: boolean }
) {
  return qs.stringifyUrl({
    url,
    query,
  });
}
