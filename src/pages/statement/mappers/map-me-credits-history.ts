import type { MeCreditsHistoryApi } from "@/lib/api/users"

import type { StatementMovementType, StatementRecord } from "../types"

function mapMovementType(type: string): StatementMovementType {
  const normalized = type.trim().toLowerCase()

  if (normalized === "add" || normalized === "addition") {
    return "addition"
  }

  if (normalized === "refund" || normalized === "reembolso") {
    return "refund"
  }

  return "removal"
}

export function mapMeCreditsHistory(items: MeCreditsHistoryApi[]): StatementRecord[] {
  return items
    .map((item) => {
      const type = mapMovementType(item.type)
      const amount = Number(item.amount)
      const absoluteAmount = Number.isFinite(amount) ? Math.abs(amount) : 0
      const signedAmount = type === "removal" ? -absoluteAmount : absoluteAmount
      const balanceAfter = Number(item.new_balance)

      return {
        id: String(item.id),
        description: item.description?.trim() || item.reason || "—",
        type,
        amount: signedAmount,
        balanceAfter: Number.isFinite(balanceAfter) ? balanceAfter : 0,
        createdAt: new Date(item.created_at),
      }
    })
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
}
