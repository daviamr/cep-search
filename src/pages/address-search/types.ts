import type { AddressSearchType } from "./constants"

export type AddressFile = {
  id: string
  fileName: string
  documentType: AddressSearchType
  sizeMb: number
  registros: number
  resultados: number
  status: string
  progress: number
  errorText?: string | null
  createdAt: Date
}

export type EnrichedAddress = {
  id: string
  cpf: string
  nome?: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  uf: string
  origem: string
}

export const ADDRESS_RESULTS_VIEW_PAGE_SIZES = [50, 100, 200, 500, 1000] as const
