import { ArrowDownRight, ArrowUpRight, Clock, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { format, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { moneyFormat } from "@/utils/money.util"
import { useStatementController } from "@/pages/statement/controller"
import type { StatementRecord } from "@/pages/statement/types"

const PREVIEW_LIMIT = 5

function formatHistoryDate(date: Date) {
  if (isToday(date)) {
    return `Hoje, ${format(date, "HH:mm")}`
  }

  return format(date, "dd MMM, HH:mm", { locale: ptBR })
}

function HistoryRow({ record }: { record: StatementRecord }) {
  const isCredit = record.type !== "removal"
  const Icon = isCredit ? ArrowDownRight : ArrowUpRight

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          isCredit
            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            : "bg-destructive/15 text-destructive"
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{record.description}</p>
        <p className="text-xs text-muted-foreground">{formatHistoryDate(record.createdAt)}</p>
      </div>

      <span
        className={cn(
          "shrink-0 text-sm font-medium tabular-nums",
          isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
        )}
      >
        {moneyFormat(record.amount)}
      </span>
    </div>
  )
}

export function CreditsHistoryCard() {
  const { records, isLoading, isError } = useStatementController()
  const preview = records.slice(0, PREVIEW_LIMIT)

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-sm font-medium text-foreground">Histórico</h2>
          </div>
          <Button variant="link" size="sm" className="h-auto px-0 text-primary" asChild>
            <Link to="/statement">Ver tudo</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center gap-2 py-6 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            <span className="text-sm">Carregando histórico...</span>
          </div>
        ) : isError ? (
          <p className="py-6 text-sm text-destructive">Não foi possível carregar o extrato.</p>
        ) : preview.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">Nenhuma movimentação encontrada.</p>
        ) : (
          <div className="divide-y divide-border">
            {preview.map((record) => (
              <HistoryRow key={record.id} record={record} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
