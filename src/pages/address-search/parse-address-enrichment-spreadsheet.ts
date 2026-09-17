import * as XLSX from "xlsx"

import { formatCep, formatCpf } from "@/lib/format"
import { removeCaracteres } from "@/utils/remove-caracteres.util"

import { ADDRESS_SEARCH_OUTPUT_TABLE } from "./constants"
import type { EnrichedAddress } from "./types"

type SheetRecord = Record<string, unknown>

function displayValue(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : "—"
}

function readSheet(workbook: XLSX.WorkBook, sheetName: string): SheetRecord[] {
  const match = workbook.SheetNames.find(
    (name) => name.trim().toLowerCase() === sheetName.trim().toLowerCase()
  )
  const sheet = match ? workbook.Sheets[match] : undefined

  if (!sheet) {
    return []
  }

  return XLSX.utils.sheet_to_json<SheetRecord>(sheet, { defval: "", raw: false })
}

function getCell(row: SheetRecord, ...keys: string[]): string {
  const normalizedKeys = new Set(keys.map((key) => key.trim().toLowerCase()))

  for (const [header, value] of Object.entries(row)) {
    if (!normalizedKeys.has(header.trim().toLowerCase())) {
      continue
    }

    if (value === null || value === undefined) {
      continue
    }

    const text = String(value).trim()

    if (text) {
      return text
    }
  }

  return ""
}

function hasAddress(row: SheetRecord): boolean {
  return ["cep", "numero", "complemento", "estado", "uf", "origem"].some(
    (key) => getCell(row, key).length > 0
  )
}

function getAddressRows(workbook: XLSX.WorkBook): SheetRecord[] {
  const enderecos = readSheet(workbook, ADDRESS_SEARCH_OUTPUT_TABLE)

  if (enderecos.length > 0) {
    return enderecos
  }

  const firstSheetName = workbook.SheetNames.find(
    (name) => name.trim().toLowerCase() !== "pessoas"
  )

  if (!firstSheetName) {
    return []
  }

  return readSheet(workbook, firstSheetName)
}

export async function parseAddressEnrichmentSpreadsheet(blob: Blob): Promise<EnrichedAddress[]> {
  const buffer = await blob.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array" })
  const nameByCpf = new Map<string, string>()

  for (const row of readSheet(workbook, "pessoas")) {
    const cpf = removeCaracteres(getCell(row, "cpf"))
    const nome = getCell(row, "nome")

    if (cpf && nome) {
      nameByCpf.set(cpf, nome)
    }
  }

  return getAddressRows(workbook).flatMap((row, index) => {
    if (!hasAddress(row)) {
      return []
    }

    const cpfDigits = removeCaracteres(getCell(row, "cpf"))

    return [
      {
        id: `${cpfDigits || "linha"}-${index + 1}`,
        cpf: displayValue(formatCpf(getCell(row, "cpf"))),
        nome: displayValue(nameByCpf.get(cpfDigits) || getCell(row, "nome")),
        cep: displayValue(formatCep(getCell(row, "cep"))),
        logradouro: displayValue(getCell(row, "logradouro")),
        numero: displayValue(getCell(row, "numero")),
        complemento: displayValue(getCell(row, "complemento")),
        bairro: displayValue(getCell(row, "bairro")),
        cidade: displayValue(getCell(row, "cidade", "municipio", "localidade")),
        estado: displayValue(getCell(row, "estado")),
        uf: displayValue(getCell(row, "uf")),
        origem: displayValue(getCell(row, "origem")),
      },
    ]
  })
}
