import { useCallback, useEffect, useState } from "react"

import { getFilesCEP } from "@/lib/api/cep"
import { getFilesCPF } from "@/lib/api/cpf"
import {
  canAccessProcessamentoResults,
  isProcessamentoPending,
} from "@/utils/format-processamento-status.util"

import {
  mapConsultationStatus,
  type DashboardFileStats,
  type RecentConsultation,
} from "./types"

const emptyStats: DashboardFileStats = {
  files: 0,
  consultasCpf: 0,
  consultasCep: 0,
  totalConsultas: 0,
}

function mapFile(
  file: { id: string; original_name: string; status: string; created_at: string; row_count: number },
  type: RecentConsultation["type"]
): RecentConsultation & { consultas: number } {
  return {
    id: file.id,
    type,
    fileName: file.original_name,
    status: mapConsultationStatus(file.status),
    createdAt: new Date(file.created_at),
    canView: canAccessProcessamentoResults(file.status),
    consultas: file.row_count,
  }
}

export function useDashboardController() {
  const [consultations, setConsultations] = useState<RecentConsultation[]>([])
  const [stats, setStats] = useState<DashboardFileStats>(emptyStats)
  const [isLoadingFiles, setIsLoadingFiles] = useState(true)
  const [isErrorFiles, setIsErrorFiles] = useState(false)
  const [hasPendingFiles, setHasPendingFiles] = useState(false)

  const loadDashboard = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoadingFiles(true)
    }

    try {
      const [cpfFiles, cepFiles] = await Promise.all([getFilesCPF(), getFilesCEP()])
      const mappedCpf = cpfFiles.map((file) => mapFile(file, "cpf"))
      const mappedCep = cepFiles.map((file) => mapFile(file, "cep"))
      const all = [...mappedCpf, ...mappedCep].sort(
        (left, right) => right.createdAt.getTime() - left.createdAt.getTime()
      )

      setConsultations(
        all.map(({ consultas: _consultas, ...consultation }) => consultation)
      )
      setStats({
        files: all.length,
        consultasCpf: mappedCpf.reduce((total, file) => total + file.consultas, 0),
        consultasCep: mappedCep.reduce((total, file) => total + file.consultas, 0),
        totalConsultas: all.reduce((total, file) => total + file.consultas, 0),
      })
      setHasPendingFiles(
        [...cpfFiles, ...cepFiles].some((file) => isProcessamentoPending(file.status))
      )
      setIsErrorFiles(false)
    } catch {
      setIsErrorFiles(true)
    } finally {
      if (!silent) {
        setIsLoadingFiles(false)
      }
    }
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    if (!hasPendingFiles) {
      return
    }

    const id = window.setInterval(() => {
      void loadDashboard(true)
    }, 3000)

    return () => window.clearInterval(id)
  }, [hasPendingFiles, loadDashboard])

  return {
    consultations,
    stats,
    isLoadingFiles,
    isErrorFiles,
  }
}
