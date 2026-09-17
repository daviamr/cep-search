import type { EnrichedAddress } from "@/pages/address-search/types"

export type CpfSimpleSearchSocio = {
  cpf: string
  nome: string
}

export type CpfSimpleSearchCompany = {
  id: string
  cnpj: string
  razaoSocial: string
  qualificacao: string
  uf: string
  cidade: string
}

export type CpfSimpleSearchResult = {
  socio: CpfSimpleSearchSocio
  companies: CpfSimpleSearchCompany[]
  addresses: EnrichedAddress[]
}
