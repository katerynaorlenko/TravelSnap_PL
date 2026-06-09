import { useQuery } from "@tanstack/react-query";

import { UNSPLASH_ACCESS_KEY, UNSPLASH_BASE_URL } from "@/constants/api";
import type { UnsplashResponse } from "@/types/unsplash";

import { useNetworkStatus } from "./useNetworkStatus";

export function useUnsplashQuery(searchTerm: string) {
  const { isConnected } = useNetworkStatus();

  return useQuery<UnsplashResponse>({
    queryKey: ["unsplash", searchTerm],
    queryFn: async () => {
      const response = await fetch(
        `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(
          searchTerm,
        )}&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Unsplash error: ${response.status}`);
      }

      return response.json();
    },
    enabled: isConnected && searchTerm.trim().length > 0,
    staleTime: 1000 * 60 * 30,
  });
}
