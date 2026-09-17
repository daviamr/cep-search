export type StatementMovementType = "addition" | "removal" | "refund"

export type StatementRecord = {
  id: string
  description: string
  type: StatementMovementType
  amount: number
  balanceAfter: number
  createdAt: Date
}

export const STATEMENT_TYPE_LABELS: Record<StatementMovementType, string> = {
  addition: "Adição",
  removal: "Remoção",
  refund: "Reembolso",
}
