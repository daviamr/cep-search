import { Building2, FileSpreadsheet, IdCard, Map, Search } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { formatNumber } from "@/lib/format"

import type { DashboardStats } from "../types"

type DashboardKpiCardsProps = {
  stats: DashboardStats
}

type KpiCardProps = {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
}

function KpiCard({ title, value, description, icon }: KpiCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardAction>
          <span className="text-muted-foreground">{icon}</span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardKpiCards({ stats }: DashboardKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      <KpiCard
        title="Total de consultas"
        value={formatNumber(stats.totalConsultas)}
        description="Registros enviados em planilhas"
        icon={<Search className="size-4" />}
      />
      <KpiCard
        title="Arquivos processados"
        value={formatNumber(stats.arquivosProcessados)}
        description="Planilhas enviadas ao sistema"
        icon={<FileSpreadsheet className="size-4" />}
      />
      <KpiCard
        title="Consultas CPF"
        value={formatNumber(stats.consultasCpf)}
        description="Registros em buscas por CPF"
        icon={<IdCard className="size-4" />}
      />
      <KpiCard
        title="Consultas CNPJ"
        value={formatNumber(stats.consultasCnpj)}
        description="Registros em buscas por CNPJ"
        icon={<Building2 className="size-4" />}
      />
      <KpiCard
        title="Consultas CEP"
        value={formatNumber(stats.consultasCep)}
        description="Registros em buscas por CEP"
        icon={<Map className="size-4" />}
      />
    </div>
  )
}
