import { api } from "./axios"

export type CEPAddressRecord = {
  ID: number
  cpf: string
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

export type CEPBulkFile = {
  id: string
  filename: string
  original_name: string
  extension?: string
  status: string
  service?: string
  spec?: string
  row_count: number
  file_size: number
  created_at: string
  downloaded_at?: string
}

type SimpleSearchCEPOptions = {
  numero?: string
  complemento?: string
}

export async function simpleSearchCEP(
  CEP: string,
  options?: SimpleSearchCEPOptions
): Promise<CEPAddressRecord[] | null> {
  try {
    const params: Record<string, string> = {}

    if (options?.numero?.trim()) {
      params.numero = options.numero.trim()
    }

    if (options?.complemento?.trim()) {
      params.complemento = options.complemento.trim()
    }

    const response = await api.get<CEPAddressRecord[]>(`/enderecos/${CEP}`, {
      params,
    })
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function bulkSearchCEP(file: File): Promise<boolean> {
  const formData = new FormData()
  const spec = {
    inputs: [
      { field: "CEP", column: "cep" },
    ],
    outputs: [
      { table: "enderecos", columns: ["id", "CEP", "cep", "numero", "complemento", "estado", "uf", "base", "origem"] },
    ],
  }
  formData.append("file", file)
  formData.append("spec", JSON.stringify(spec))
  formData.append("service", "BuscaEnderecosCEP")

  try {
    await api.post("/enrichment", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getFilesCEP(): Promise<CEPBulkFile[]> {
  try {
    const response = await api.get<CEPBulkFile[]>("/files?service=BuscaEnderecosCEP")
    return response.data ?? []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getFileCEPById(id: string): Promise<CEPBulkFile | null> {
  const files = await getFilesCEP()
  return files.find((file) => file.id === id) ?? null
}

export async function downloadFileCEP(id: string, fallbackFileName?: string) {
  const response = await api.get<Blob>(`/files/${id}/download`, {
    responseType: "blob",
  })

  const contentDisposition = response.headers["content-disposition"] as string | undefined
  const fileName =
    getFileNameFromContentDisposition(contentDisposition) ??
    fallbackFileName ??
    `arquivo-${id}.csv`

  return {
    blob: response.data,
    fileName,
  }
}

function getFileNameFromContentDisposition(header?: string) {
  if (!header) return null

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

  return null
}
