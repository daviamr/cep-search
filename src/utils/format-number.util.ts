export function formatNumber(value: number | string | null | undefined): string {
  const numeric = Number(value)

  if (!Number.isFinite(numeric)) {
    return '0'
  }

  return numeric.toLocaleString('pt-BR', {
    maximumFractionDigits: 0,
  })
}
