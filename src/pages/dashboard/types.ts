export type SearchType = "CPF" | "CNPJ" | "CEP"

export type RecentSearchFile = {
  id: string
  type: SearchType
  fileName: string
  consultas: number
  status: string
  createdAt: string
  viewPath: string
}

export type DashboardStats = {
  totalConsultas: number
  arquivosProcessados: number
  consultasCpf: number
  consultasCnpj: number
  consultasCep: number
}
