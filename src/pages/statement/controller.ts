import { useQuery } from "@tanstack/react-query"

import { listMeCreditsHistory } from "@/lib/api/users"

import { mapMeCreditsHistory } from "./mappers/map-me-credits-history"
import { statementQueryKeys } from "./query-keys"
import type { StatementRecord } from "./types"

export function useStatementController() {
  const statementQuery = useQuery({
    queryKey: statementQueryKeys.list(),
    queryFn: async () => mapMeCreditsHistory(await listMeCreditsHistory()),
  })

  return {
    records: statementQuery.data ?? ([] as StatementRecord[]),
    isLoading: statementQuery.isLoading,
    isError: statementQuery.isError,
  }
}
