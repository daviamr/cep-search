import { isAxiosError } from "axios"

import { sociosApi } from "@/lib/api/axios"
import {
  extractRawSearchResults,
  getSearchResponseErrorMessage,
  isSearchResponseSuccessful,
} from "@/lib/api/search-results/extract-api-results"
import { normalizeSearchResults } from "@/lib/api/search-results/normalize-search-result"
import { removeCaracteres } from "@/utils/remove-caracteres.util"

export type SearchCpfSocioApi = {
  id: number
  nome: string
  qualificacao: string
  tipo: number
  cpf_cnpj: string
  cpf_completo: string
  data_entrada: string
  faixa_etaria: number
  representante_legal?: string
}

export type SearchCpfEstabelecimentoApi = {
  bairro?: string
  cep?: string
  cnpj?: string
  cnpj_base?: string
  complemento?: string
  logradouro?: string
  municipio?: string | { name?: string }
  numero?: string
  situacao_cadastral?: string | number
  cnae_principal?: number
  cnae_descricao?: string
  optante_mei?: boolean
  tipo_logradouro?: string
  uf?: string
}

export type SearchCpfEmpresaApi = {
  bairro?: string
  cnae_descricao?: string
  cnae_principal?: number
  cnpj: string
  cnpj_base?: string
  capital?: number
  capital_social?: number
  cep?: string
  faturamento?: string
  logradouro?: string
  municipio?: string
  name?: string
  natureza_juridica?: number
  natureza_juridica_descricao?: string
  numero?: string
  optante_mei?: boolean
  razao_social: string
  porte?: string
  situacao_cadastral?: number | string
  tipo_estabelecimento?: number
  tipo_logradouro?: string
  uf?: string
}

export type SearchCpfResultApi = {
  cnae_descricao?: string
  cnae_principal?: number
  cnpj: string
  cnpj_base?: string
  capital_social?: number | null
  faturamento?: string | null
  municipio?: string
  optante_mei?: boolean
  situacao_cadastral?: number
  uf?: string
  empresa: SearchCpfEmpresaApi
  socio: SearchCpfSocioApi
}

export type SearchCpfRawResultApi = {
  cnpj?: string
  cnpj_base?: string
  uf?: string
  municipio?: string | { name?: string }
  situacao_cadastral?: string | number
  cnae_principal?: number
  cnae_descricao?: string
  optante_mei?: boolean
  capital_social?: number
  faturamento?: string
  empresa?: Partial<SearchCpfEmpresaApi>
  estabelecimento?: SearchCpfEstabelecimentoApi
  socio?: Partial<SearchCpfSocioApi>
}

export type SearchCpfApiResponse = {
  sucesso?: boolean
  success?: boolean
  mensagem?: string
  message?: string
  codigo?: string
  dados?: {
    pagina: number
    tamanho: number
    total: number
    resultados: SearchCpfResultApi[]
  } | null
  data?: {
    pagina: number
    tamanho: number
    total: number
    resultados: SearchCpfResultApi[]
  } | null
  erros?: Array<{ campo: string; mensagem: string }>
  request_id?: string
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20

type SearchRequestOptions = {
  pagina?: number
  tamanho?: number
}

function shouldTryLegacySearch(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false
  }

  const status = error.response?.status

  return status === 404 || status === 405 || status === 501
}

async function searchCPFViaPost(
  cpf: string,
  options?: SearchRequestOptions
): Promise<SearchCpfResultApi[] | null> {
  const pagina = options?.pagina ?? DEFAULT_PAGE
  const tamanho = options?.tamanho ?? DEFAULT_PAGE_SIZE
  const digits = removeCaracteres(cpf)

  const { data } = await sociosApi.post<SearchCpfApiResponse>("/api/consultas/socios", {
    cpf: digits,
    pagina,
    tamanho,
  })

  if (!isSearchResponseSuccessful(data)) {
    throw new Error(getSearchResponseErrorMessage(data))
  }

  const rawResults = extractRawSearchResults(data)
  const resultados = normalizeSearchResults(rawResults)

  return resultados.length > 0 ? resultados : null
}

async function searchCPFViaLegacyGet(cpf: string): Promise<SearchCpfResultApi[] | null> {
  const digits = removeCaracteres(cpf)
  const { data } = await sociosApi.get<SearchCpfApiResponse>(`/api/v1/socios/cpf/${digits}`)

  if (!isSearchResponseSuccessful(data)) {
    throw new Error(getSearchResponseErrorMessage(data))
  }

  const rawResults = extractRawSearchResults(data)
  const resultados = normalizeSearchResults(rawResults)

  return resultados.length > 0 ? resultados : null
}

export async function searchCPF(
  cpf: string,
  options?: SearchRequestOptions
): Promise<SearchCpfResultApi[] | null> {
  const digits = removeCaracteres(cpf)

  if (digits.length !== 11) {
    throw new Error("Informe um CPF válido com 11 dígitos.")
  }

  try {
    return await searchCPFViaPost(cpf, options)
  } catch (error) {
    if (!shouldTryLegacySearch(error)) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.mensagem ?? error.response?.data?.message

        if (typeof message === "string" && message.trim()) {
          throw new Error(message, { cause: error })
        }
      }

      throw error
    }
  }

  try {
    return await searchCPFViaLegacyGet(cpf)
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.mensagem ?? error.response?.data?.message

      if (typeof message === "string" && message.trim()) {
        throw new Error(message, { cause: error })
      }
    }

    throw error
  }
}
