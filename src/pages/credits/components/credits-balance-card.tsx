import { Coins, Gift, Loader2, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-provider"
import { isAdminRole } from "@/enums/user-role.enum"
import { formatDateAndHours } from "@/utils/date-and-hours.util"
import { moneyFormat } from "@/utils/money.util"

import { useCreditsController } from "../controller"

function getActiveBonusesTotal(
  bonuses: { remaining_amount: string; is_available: boolean }[]
) {
  return bonuses
    .filter((bonus) => bonus.is_available)
    .reduce((total, bonus) => total + Number(bonus.remaining_amount || 0), 0)
}

export function CreditsBalanceCard() {
  const { user } = useAuth()
  const { credits, isLoadingCredits, isErrorCredits } = useCreditsController()
  const balance = Number(credits.credits)
  const bonuses = credits.active_bonuses ?? []
  const bonusesTotal = getActiveBonusesTotal(bonuses)
  const hasAvailableCredits = balance > 0 || bonusesTotal > 0
  const canAddCredits = isAdminRole(user?.role)

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="size-4 text-yellow-500" aria-hidden="true" />
            <span className="text-sm">Saldo disponível</span>
          </div>
          <Badge
            variant="outline"
            className={
              hasAvailableCredits
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-muted-foreground/30 bg-muted text-muted-foreground"
            }
          >
            {isErrorCredits ? "Indisponível" : hasAvailableCredits ? "Ativo" : "Sem saldo"}
          </Badge>
        </div>

        <div className="space-y-1">
          {isLoadingCredits ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              <span className="text-sm">Carregando saldo...</span>
            </div>
          ) : isErrorCredits ? (
            <p className="text-sm text-destructive">Não foi possível carregar os créditos.</p>
          ) : (
            <>
              <p className="text-5xl font-semibold tracking-tight tabular-nums text-foreground">
                {moneyFormat(balance)}
              </p>
              <p className="text-sm text-muted-foreground">créditos</p>
            </>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Gift className="size-3.5 text-primary" aria-hidden="true" />
              <span className="text-xs">Bônus ativos</span>
            </div>
            {!isLoadingCredits && !isErrorCredits ? (
              <span className="text-sm font-medium tabular-nums text-foreground">
                {bonuses.length ? moneyFormat(bonusesTotal) : "—"}
              </span>
            ) : null}
          </div>

          {!isLoadingCredits && !isErrorCredits && bonuses.length > 0 ? (
            <ul className="space-y-2">
              {bonuses.map((bonus) => (
                <li
                  key={bonus.id}
                  className="flex items-start justify-between gap-3 rounded-md border border-border/80 bg-muted/30 px-3 py-2"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate text-sm font-medium text-foreground">
                      {bonus.reason || "Bônus"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expira em {formatDateAndHours(bonus.expires_at)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                    {moneyFormat(Number(bonus.remaining_amount))}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {canAddCredits ? (
          <Button className="mt-auto w-full" type="button">
            <Plus className="size-4" aria-hidden="true" />
            Adicionar créditos
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
