import { api } from "./axios"
import {
  listAddressEnrichmentFiles,
  submitAddressEnrichment,
  type AddressEnrichmentFileApi,
} from "./enrichment"

export type CpfAddressRecord = {
  ID: number
  CPF: string
  CEP: string
  Numero: string
  Complemento: string
  Estado: string
  UF: string
  Base: string
  Origem: string
  DataUp: string
  CreatedAt: string
  UpdatedAt: string
}

export type CpfBulkFile = AddressEnrichmentFileApi

export async function simpleSearchCPF(cpf: string): Promise<CpfAddressRecord[]> {
  const { data } = await api.get<CpfAddressRecord[]>(`/api/enderecos/${cpf}`)
  return data ?? []
}

export async function bulkSearchCPF(file: File, column = "cpf") {
  await submitAddressEnrichment({
    file,
    mapping: { document: column },
    documentType: "cpf",
  })
  return true
}

export async function getFilesCPF() {
  return listAddressEnrichmentFiles("cpf")
}
