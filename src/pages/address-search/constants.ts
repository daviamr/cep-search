export type AddressSearchType = "cpf" | "cep"

export const ADDRESS_SEARCH_SERVICES = {
  cpf: "BuscaEnderecosCPF",
  cep: "BuscaEnderecosCEP",
} as const satisfies Record<AddressSearchType, string>

export const ADDRESS_SEARCH_INPUT_FIELDS = {
  cpf: "CPF",
  cep: "CEP",
} as const satisfies Record<AddressSearchType, string>

export const ADDRESS_SEARCH_CEP_OPTIONAL_INPUT_FIELDS = {
  numero: "NUMERO",
  complemento: "COMPLEMENTO",
} as const

export const ADDRESS_SEARCH_CEP_INPUT_COLUMNS = {
  cep: "cep",
  numero: "numero",
  complemento: "complemento",
} as const

export type AddressEnrichmentColumnMapping = {
  document: string
  numero?: string | null
  complemento?: string | null
}

export const ADDRESS_SEARCH_OUTPUT_TABLE = "enderecos"

export const ADDRESS_SEARCH_OUTPUT_COLUMNS = [
  "cep",
  "numero",
  "complemento",
  "estado",
  "uf",
] as const

export const ADDRESS_SEARCH_CEP_OUTPUT_COLUMNS = [
  "cep",
  "numero",
  "complemento",
  "estado",
  "uf",
  "origem",
] as const
