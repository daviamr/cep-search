import { isAxiosError } from "axios"

import { api } from "@/lib/api/axios"
import {
  ADDRESS_SEARCH_CEP_OPTIONAL_INPUT_FIELDS,
  ADDRESS_SEARCH_CEP_OUTPUT_COLUMNS,
  ADDRESS_SEARCH_INPUT_FIELDS,
  ADDRESS_SEARCH_OUTPUT_COLUMNS,
  ADDRESS_SEARCH_OUTPUT_TABLE,
  ADDRESS_SEARCH_SERVICES,
  type AddressEnrichmentColumnMapping,
  type AddressSearchType,
} from "@/pages/address-search/constants"
import { downloadSpreadsheetBlob } from "@/utils/spreadsheet-download.util"
import type { SpreadsheetDownloadFormat } from "@/utils/spreadsheet-download.util"

export type AddressEnrichmentSpec = {
  inputs: Array<{ field: string; column: string }>
  outputs: Array<{ table: string; columns: string[] }>
}

export type SubmitAddressEnrichmentResponse = {
  id: string
  status: string
}

export type AddressEnrichmentFileApi = {
  id: string
  filename: string
  original_name: string
  extension: string
  status: string
  service: string
  spec: string
  row_count: number
  file_size: number
  error_text?: string | null
  progress: number
  created_at: string
  downloaded_at?: string | null
  input_stats?: Record<string, number> | null
  output_stats?: Record<string, number> | null
  total_input_rows?: number | null
  total_output_rows?: number | null
}

type ErrorEnvelope = {
  error?: string
  mensagem?: string
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ErrorEnvelope | undefined
    const message = data?.error ?? data?.mensagem

    if (typeof message === "string" && message.trim()) {
      return message
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallback
}

function getFilenameFromContentDisposition(header?: string) {
  if (!header) return undefined

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }

  const quotedMatch = header.match(/filename="([^"]+)"/i)
  if (quotedMatch?.[1]) {
    return quotedMatch[1]
  }

  const plainMatch = header.match(/filename=([^;]+)/i)
  if (plainMatch?.[1]) {
    return plainMatch[1].trim()
  }

  return undefined
}

export function buildAddressEnrichmentSpec(
  documentType: AddressSearchType,
  mapping: AddressEnrichmentColumnMapping
): AddressEnrichmentSpec {
  const inputs: AddressEnrichmentSpec["inputs"] = [
    { field: ADDRESS_SEARCH_INPUT_FIELDS[documentType], column: mapping.document },
  ]

  if (documentType === "cep" && mapping.numero) {
    inputs.push({
      field: ADDRESS_SEARCH_CEP_OPTIONAL_INPUT_FIELDS.numero,
      column: mapping.numero,
    })

    if (mapping.complemento) {
      inputs.push({
        field: ADDRESS_SEARCH_CEP_OPTIONAL_INPUT_FIELDS.complemento,
        column: mapping.complemento,
      })
    }
  }

  if (documentType === "cep") {
    return {
      inputs,
      outputs: [
        {
          table: ADDRESS_SEARCH_OUTPUT_TABLE,
          columns: [...ADDRESS_SEARCH_CEP_OUTPUT_COLUMNS],
        },
      ],
    }
  }

  return {
    inputs,
    outputs: [
      { table: "pessoas", columns: ["nome"] },
      {
        table: ADDRESS_SEARCH_OUTPUT_TABLE,
        columns: [...ADDRESS_SEARCH_OUTPUT_COLUMNS],
      },
    ],
  }
}

export async function submitAddressEnrichment({
  file,
  mapping,
  documentType,
}: {
  file: File
  mapping: AddressEnrichmentColumnMapping
  documentType: AddressSearchType
}): Promise<SubmitAddressEnrichmentResponse> {
  const formData = new FormData()

  formData.append("file", file)
  formData.append("spec", JSON.stringify(buildAddressEnrichmentSpec(documentType, mapping)))
  formData.append("service", ADDRESS_SEARCH_SERVICES[documentType])

  try {
    const { data } = await api.post<SubmitAddressEnrichmentResponse>("/api/enrichment", formData)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, "Não foi possível enviar o arquivo."), { cause: error })
  }
}

export async function listAddressEnrichmentFiles(
  documentType: AddressSearchType
): Promise<AddressEnrichmentFileApi[]> {
  try {
    const { data } = await api.get<AddressEnrichmentFileApi[] | null>("/api/files", {
      params: { service: ADDRESS_SEARCH_SERVICES[documentType] },
    })

    return data ?? []
  } catch (error) {
    throw new Error(getErrorMessage(error, "Não foi possível carregar os arquivos."), {
      cause: error,
    })
  }
}

export type AddressEnrichmentDownload = {
  blob: Blob
  fileName?: string
}

async function parseBlobError(blob: Blob): Promise<string | null> {
  if (!blob.type.includes("json")) {
    return null
  }

  try {
    const parsed = JSON.parse(await blob.text()) as ErrorEnvelope
    return parsed.error ?? parsed.mensagem ?? null
  } catch {
    return null
  }
}

export async function fetchAddressEnrichmentFileBlob(
  id: string
): Promise<AddressEnrichmentDownload> {
  try {
    const response = await api.get<Blob>(`/api/files/${id}/download`, {
      responseType: "blob",
    })

    return {
      blob: response.data,
      fileName: getFilenameFromContentDisposition(
        (response.headers["content-disposition"] as string | undefined) ??
          (response.headers["Content-Disposition"] as string | undefined)
      ),
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.data instanceof Blob) {
      const message = await parseBlobError(error.response.data)

      if (message) {
        throw new Error(message, { cause: error })
      }
    }

    throw new Error(getErrorMessage(error, "Não foi possível baixar o arquivo."), {
      cause: error,
    })
  }
}

export async function downloadAddressEnrichmentFile(
  id: string,
  fileName?: string,
  format: SpreadsheetDownloadFormat = "xlsx"
) {
  const { blob, fileName: headerFileName } = await fetchAddressEnrichmentFileBlob(id)

  await downloadSpreadsheetBlob(blob, headerFileName ?? fileName ?? `consulta-${id}`, format)
}

export async function deleteAddressEnrichmentFile(id: string): Promise<void> {
  try {
    await api.delete(`/api/files/${id}`)
  } catch (error) {
    throw new Error(getErrorMessage(error, "Não foi possível excluir o arquivo."), {
      cause: error,
    })
  }
}
