import { useQuery } from "@tanstack/react-query"

import { getMeCredits, type MeCreditsApi } from "@/lib/api/credits"

import { creditsQueryKeys } from "./query-keys"

export function useCreditsController() {
  const creditsQuery = useQuery({
    queryKey: creditsQueryKeys.me(),
    queryFn: getMeCredits,
  })

  return {
    credits: creditsQuery.data ?? ({ credits: "0", active_bonuses: [] } as MeCreditsApi),
    isLoadingCredits: creditsQuery.isLoading,
    isErrorCredits: creditsQuery.isError,
  }
}
