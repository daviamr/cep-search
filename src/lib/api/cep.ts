import { api } from "./axios"
import {
  listAddressEnrichmentFiles,
  submitAddressEnrichment,
  type AddressEnrichmentFileApi,
} from "./enrichment"

export type CEPAddressRecord = {
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

export type CEPBulkFile = AddressEnrichmentFileApi

type SimpleSearchCEPOptions = {
  numero?: string
  complemento?: string
}

export async function simpleSearchCEP(
  cep: string,
  options?: SimpleSearchCEPOptions
): Promise<CEPAddressRecord[]> {
  const params: Record<string, string> = { cep }

  if (options?.numero?.trim()) {
    params.numero = options.numero.trim()
  }

  if (options?.complemento?.trim()) {
    params.complemento = options.complemento.trim()
  }

  const { data } = await api.get<CEPAddressRecord[]>("/api/enderecos", {
    params,
  })

  return data ?? []
}

export async function bulkSearchCEP(file: File, column = "cep") {
  await submitAddressEnrichment({
    file,
    mapping: { document: column },
    documentType: "cep",
  })
  return true
}

export async function getFilesCEP() {
  return listAddressEnrichmentFiles("cep")
}
