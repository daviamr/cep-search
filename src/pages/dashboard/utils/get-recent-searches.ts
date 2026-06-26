import { getFilesCEP, type CEPBulkFile } from "@/lib/api/cep"
import { getFilesCPF, type CpfBulkFile } from "@/lib/api/cpf"
import { getFilesCNPJ, type CnpjBulkFile } from "@/lib/api/cnpj"

import type { DashboardStats, RecentSearchFile, SearchType } from "../types"

type BulkFile = CpfBulkFile | CEPBulkFile | CnpjBulkFile

function mapBulkFile(
  file: BulkFile,
  type: SearchType,
  viewPathPrefix: string
): RecentSearchFile {
  return {
    id: file.id,
    type,
    fileName: file.original_name,
    consultas: file.row_count,
    status: file.status,
    createdAt: file.created_at,
    viewPath: `${viewPathPrefix}/${file.id}`,
  }
}

function getTimestamp(value: string) {
  return new Date(value).getTime()
}

export async function getRecentSearches(): Promise<RecentSearchFile[]> {
  const [cpfFiles, cnpjFiles, cepFiles] = await Promise.all([
    getFilesCPF(),
    getFilesCNPJ(),
    getFilesCEP(),
  ])

  const searches = [
    ...cpfFiles.map((file) => mapBulkFile(file, "CPF", "/cpf")),
    ...cnpjFiles.map((file) => mapBulkFile(file, "CNPJ", "/cnpj")),
    ...cepFiles.map((file) => mapBulkFile(file, "CEP", "/cep")),
  ]

  return searches.sort(
    (a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
  )
}

export function buildDashboardStats(searches: RecentSearchFile[]): DashboardStats {
  return {
    totalConsultas: searches.reduce((total, file) => total + file.consultas, 0),
    arquivosProcessados: searches.length,
    consultasCpf: searches
      .filter((file) => file.type === "CPF")
      .reduce((total, file) => total + file.consultas, 0),
    consultasCnpj: searches
      .filter((file) => file.type === "CNPJ")
      .reduce((total, file) => total + file.consultas, 0),
    consultasCep: searches
      .filter((file) => file.type === "CEP")
      .reduce((total, file) => total + file.consultas, 0),
  }
}
