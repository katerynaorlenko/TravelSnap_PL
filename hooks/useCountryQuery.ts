import { useQuery } from "@tanstack/react-query";

import { RESTCOUNTRIES_BASE_URL } from "@/constants/api";
import type { Country } from "@/types/country";

import { useNetworkStatus } from "./useNetworkStatus";

export function useCountryQuery(countryName: string) {
  const { isConnected } = useNetworkStatus();

  return useQuery<Country[]>({
    queryKey: ["country", countryName],
    queryFn: async () => {
      const response = await fetch(
        `${RESTCOUNTRIES_BASE_URL}/name/${encodeURIComponent(countryName)}`,
      );

      if (!response.ok) {
        throw new Error(`Country error: ${response.status}`);
      }

      return response.json();
    },
    enabled: isConnected && countryName.trim().length > 0,
    staleTime: 1000 * 60 * 60,
  });
}
