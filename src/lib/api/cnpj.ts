import { api } from "./axios"

export type CnpjBulkFile = {
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

export async function simpleSearchCNPJ(cnpj: string) {
  try {
    const response = await api.get(`/enderecos/${cnpj}`)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function bulkSearchCNPJ(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  try {
    await api.post("/enderecos/bulk", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getFilesCNPJ(): Promise<CnpjBulkFile[]> {
  try {
    const response = await api.get<CnpjBulkFile[]>("/files?service=BuscaEnderecosCNPJ")
    return response.data ?? []
  } catch (error) {
    console.error(error)
    return []
  }
}
