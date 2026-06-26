import type { CpfAddressRecord } from "@/lib/api/cpf"

function getCell(row: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    const value = row[key]?.trim()
    if (value) {
      return value
    }
  }

  return ""
}

function isEmptyRow(row: Record<string, string>) {
  return Object.values(row).every((value) => !value.trim())
}

function mapRowToRecord(
  row: Record<string, string>,
  index: number
): CpfAddressRecord | null {
  if (isEmptyRow(row)) {
    return null
  }

  const cpf = getCell(row, ["cpf"])
  const cep = getCell(row, ["cep"])

  if (!cpf && !cep) {
    return null
  }

  const parsedId = Number(getCell(row, ["id"]))

  return {
    ID: Number.isFinite(parsedId) ? parsedId : index + 1,
    CPF: cpf,
    CEP: cep,
    Numero: getCell(row, ["numero"]),
    Complemento: getCell(row, ["complemento"]),
    Estado: getCell(row, ["estado"]),
    UF: getCell(row, ["uf"]),
    Base: getCell(row, ["base"]),
    Origem: getCell(row, ["origem"]),
    DataUp: getCell(row, ["data_up", "dataup"]),
    CreatedAt: getCell(row, ["created_at", "createdat"]),
    UpdatedAt: getCell(row, ["updated_at", "updatedat"]),
  }
}

export function mapSpreadsheetRowsToCpfAddressRecords(
  rows: Record<string, string>[]
): CpfAddressRecord[] {
  return rows
    .map((row, index) => mapRowToRecord(row, index))
    .filter((record): record is CpfAddressRecord => record !== null)
}
