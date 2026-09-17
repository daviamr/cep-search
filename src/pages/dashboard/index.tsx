import {
  BookOpen,
  Building2,
  Coins,
  FileStack,
  IdCard,
  LayoutDashboard,
  Loader2,
  Map,
} from "lucide-react"

import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { useCreditsController } from "@/pages/credits/controller"
import { formatNumber } from "@/utils/format-number.util"
import { moneyFormat } from "@/utils/money.util"

import { QuickAccessCard } from "./components/quick-access-card"
import { RecentConsultations } from "./components/recent-consultations"
import { StatCard } from "./components/stat-card"
import { useDashboardController } from "./controller"

const quickAccessItems = [
  {
    title: "Buscar por CPF",
    description: "Consulte endereços vinculados a CPFs, um a um ou em massa.",
    href: "/cpf",
    icon: IdCard,
  },
  {
    title: "Buscar por CEP",
    description: "Encontre endereços e CPFs a partir de um CEP.",
    href: "/cep",
    icon: Map,
  },
  {
    title: "Buscar por CNPJ",
    description: "Consulte endereços a partir de CNPJs.",
    href: "/cnpj",
    icon: Building2,
    disabled: true,
  },
  {
    title: "Histórico API",
    description: "Acompanhe as consultas realizadas pela API.",
    href: "/api/historico",
    icon: BookOpen,
  },
] as const

export function DashboardPage() {
  const { credits, isLoadingCredits } = useCreditsController()
  const { consultations, stats, isLoadingFiles, isErrorFiles } = useDashboardController()
  const balance = Number(credits.credits)

  return (
    <div className="container mx-auto space-y-8 p-6">
      <PageBreadcrumb items={[{ label: "Dashboard", icon: LayoutDashboard }]} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Créditos disponíveis"
          value={
            isLoadingCredits ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
              moneyFormat(balance)
            )
          }
          icon={Coins}
        />
        <StatCard
          title="Arquivos processados"
          value={
            isLoadingFiles ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
              formatNumber(stats.files)
            )
          }
          icon={FileStack}
        />
        <StatCard
          title="Consultas CPF"
          value={
            isLoadingFiles ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
              formatNumber(stats.consultasCpf)
            )
          }
          icon={IdCard}
        />
        <StatCard
          title="Consultas CEP"
          value={
            isLoadingFiles ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
              formatNumber(stats.consultasCep)
            )
          }
          icon={Map}
        />
      </div>

      <section className="space-y-4">
        <h2 className="text-md font-semibold tracking-tight text-foreground">
          Acesso rápido
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickAccessItems.map((item) => (
            <QuickAccessCard key={item.href} {...item} />
          ))}
        </div>
      </section>

      <RecentConsultations
        consultations={consultations}
        isLoading={isLoadingFiles}
        isError={isErrorFiles}
      />
    </div>
  )
}
