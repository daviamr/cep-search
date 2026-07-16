import { useEffect, useState } from "react"

import { DefaultLayout } from "@/components/layout/default-layout/DefaultLayout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

import { DashboardKpiCards } from "./components/dashboard-kpi-cards"
import { RecentSearchesTable } from "./components/recent-searches-table"
import type { DashboardStats, RecentSearchFile } from "./types"
import {
  buildDashboardStats,
  getRecentSearches,
} from "./utils/get-recent-searches"

const emptyStats: DashboardStats = {
  totalConsultas: 0,
  arquivosProcessados: 0,
  consultasCpf: 0,
  consultasCnpj: 0,
  consultasCep: 0,
}

export function DashboardPage() {
  const [recentSearches, setRecentSearches] = useState<RecentSearchFile[]>([])
  const [stats, setStats] = useState<DashboardStats>(emptyStats)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true)
      try {
        const searches = await getRecentSearches()
        setRecentSearches(searches)
        setStats(buildDashboardStats(searches))
      } finally {
        setIsLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  return (
    <DefaultLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Visão geral das consultas por CNPJ, CPF e CEP.
        </p>
      </div>

      <DashboardKpiCards stats={isLoading ? emptyStats : stats} />

      <RecentSearchesTable files={recentSearches} isLoading={isLoading} />
    </DefaultLayout>
  )
}
