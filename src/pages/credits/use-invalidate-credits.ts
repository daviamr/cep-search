import { useQueryClient } from "@tanstack/react-query"

import { creditsQueryKeys } from "./query-keys"

export function useInvalidateCredits() {
  const queryClient = useQueryClient()

  return async () => {
    await queryClient.invalidateQueries({ queryKey: creditsQueryKeys.me() })
  }
}
