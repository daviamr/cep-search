export type ConsultationType = "cpf" | "cep"

export type ConsultationStatus = "completed" | "processing" | "error"

export type RecentConsultation = {
  id: string
  type: ConsultationType
  fileName: string
  status: ConsultationStatus
  createdAt: Date
  canView: boolean
}

export type DashboardFileStats = {
  files: number
  consultasCpf: number
  consultasCep: number
  totalConsultas: number
}

export function mapConsultationStatus(status: string): ConsultationStatus {
  const normalized = status.trim().toLowerCase()

  if (
    normalized === "aguardando" ||
    normalized === "processando" ||
    normalized === "processing" ||
    normalized === "pending"
  ) {
    return "processing"
  }

  if (
    normalized === "erro" ||
    normalized === "falhou" ||
    normalized === "error" ||
    normalized === "failed"
  ) {
    return "error"
  }

  return "completed"
}
