export function moneyFormat(value: number, hideAcronym?: boolean) {
  return value.toLocaleString("pt-br", {
    style: hideAcronym ? "decimal" : "currency",
    currency: "BRL",
  })
}
