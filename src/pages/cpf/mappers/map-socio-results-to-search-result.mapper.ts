import type { SearchCpfResultApi } from "@/lib/api/socios"
import { removeCaracteres } from "@/utils/remove-caracteres.util"

import type { CpfSimpleSearchCompany, CpfSimpleSearchSocio } from "../simple-search-types"

function resolveCnpj(result: SearchCpfResultApi): string {
  return removeCaracteres(result.cnpj || result.empresa.cnpj || result.empresa.cnpj_base || "")
}

function mapResultToCompany(result: SearchCpfResultApi, index: number): CpfSimpleSearchCompany {
  const cnpj = resolveCnpj(result)

  return {
    id: `${cnpj || index}-${index}`,
    cnpj,
    razaoSocial: result.empresa.razao_social?.trim() || "—",
    qualificacao: result.socio.qualificacao?.trim() || "—",
    uf: (result.uf || result.empresa.uf || "—").toString().trim() || "—",
    cidade: (result.municipio || result.empresa.municipio || "—").toString().trim() || "—",
  }
}

export function mapSocioResultsToSearchResult(socioResults: SearchCpfResultApi[]): {
  socio: CpfSimpleSearchSocio
  companies: CpfSimpleSearchCompany[]
} | null {
  const first = socioResults[0]

  if (!first) {
    return null
  }

  const socio: CpfSimpleSearchSocio = {
    cpf: removeCaracteres(first.socio.cpf_completo || first.socio.cpf_cnpj || ""),
    nome: first.socio.nome?.trim() || "—",
  }

  return {
    socio,
    companies: socioResults.map(mapResultToCompany),
  }
}
