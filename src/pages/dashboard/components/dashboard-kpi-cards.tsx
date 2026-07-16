import { Building2, FileSpreadsheet, IdCard, Map, Search } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

import type { DashboardStats } from "../types"

type DashboardKpiCardsProps = {
  stats: DashboardStats
}

type StatCardProps = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  iconClassName?: string
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-lg bg-muted",
            iconClassName
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardKpiCards({ stats }: DashboardKpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        title="Total de consultas"
        value={formatNumber(stats.totalConsultas)}
        description="Registros enviados em planilhas"
        icon={Search}
        iconClassName="text-primary"
      />
      <StatCard
        title="Arquivos processados"
        value={formatNumber(stats.arquivosProcessados)}
        description="Planilhas enviadas ao sistema"
        icon={FileSpreadsheet}
      />
      <StatCard
        title="Consultas CPF"
        value={formatNumber(stats.consultasCpf)}
        description="Registros em buscas por CPF"
        icon={IdCard}
        iconClassName="text-primary"
      />
      <StatCard
        title="Consultas CNPJ"
        value={formatNumber(stats.consultasCnpj)}
        description="Registros em buscas por CNPJ"
        icon={Building2}
        iconClassName="text-primary"
      />
      <StatCard
        title="Consultas CEP"
        value={formatNumber(stats.consultasCep)}
        description="Registros em buscas por CEP"
        icon={Map}
        iconClassName="text-primary"
      />
    </div>
  )
}
