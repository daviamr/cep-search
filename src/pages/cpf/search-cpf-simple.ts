import { simpleSearchCPF } from "@/lib/api/cpf"
import { searchCPF } from "@/lib/api/socios"
import { removeCaracteres } from "@/utils/remove-caracteres.util"

import { mapSocioResultsToSearchResult } from "./mappers/map-socio-results-to-search-result.mapper"
import type { CpfSimpleSearchResult } from "./simple-search-types"
import { enrichCpfAddresses } from "./utils/enrich-addresses"

export async function searchCpfSimple(cpf: string): Promise<CpfSimpleSearchResult | null> {
  const digits = removeCaracteres(cpf)

  const [socioResults, addresses] = await Promise.all([
    searchCPF(digits),
    simpleSearchCPF(digits).then(enrichCpfAddresses),
  ])

  const mapped = mapSocioResultsToSearchResult(socioResults ?? [])

  if (!mapped) {
    return null
  }

  return {
    ...mapped,
    addresses,
  }
}
