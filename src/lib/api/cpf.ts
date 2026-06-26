import { api } from "./axios"

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

export type CpfBulkFile = {
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

export async function simpleSearchCPF(cpf: string): Promise<CpfAddressRecord[] | null> {
  try {
    const response = await api.get<CpfAddressRecord[]>(`/enderecos/${cpf}`)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function bulkSearchCPF(file: File): Promise<boolean> {
  const formData = new FormData()
  const spec = {
    inputs: [
      { field: "CPF", column: "cpf" },
    ],
    outputs: [
      { table: "enderecos", columns: ["id", "cpf", "cep", "numero", "complemento", "estado", "uf", "base", "origem"] },
    ],
  }
  formData.append("file", file)
  formData.append("spec", JSON.stringify(spec))
  formData.append("service", "BuscaEnderecosCPF")

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

export async function getFilesCPF(): Promise<CpfBulkFile[]> {
  try {
    const response = await api.get<CpfBulkFile[]>("/files?service=BuscaEnderecosCPF")
    return response.data ?? []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getFileCPFById(id: string): Promise<CpfBulkFile | null> {
  const files = await getFilesCPF()
  return files.find((file) => file.id === id) ?? null
}

export async function downloadFileCPF(id: string, fallbackFileName?: string) {
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
