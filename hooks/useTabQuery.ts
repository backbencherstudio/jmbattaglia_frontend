"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useTabQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = (key: string, defaultValue: string = "") => {
    return searchParams.get(key) || defaultValue;
  };

  const updateQueryParams = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const setParam = (key: string, value: string | null) => {
    updateQueryParams({ [key]: value });
  };

  return {
    searchParams,
    getParam,
    setParam,
    updateQueryParams,
  };
}
