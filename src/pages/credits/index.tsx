import { CreditCard } from "lucide-react"

import { PageBreadcrumb } from "@/components/page-breadcrumb"

import { CreditsBalanceCard } from "./components/credits-balance-card"
import { CreditsHistoryCard } from "./components/credits-history-card"

export function CreditsPage() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      <PageBreadcrumb items={[{ label: "Créditos", icon: CreditCard }]} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <CreditsBalanceCard />
        <CreditsHistoryCard />
      </div>
    </div>
  )
}
