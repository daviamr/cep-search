import * as XLSX from "xlsx"

export function normalizeSpreadsheetHeader(header: string): string {
  return header
    .replace(/^\uFEFF/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
}

function serializeSpreadsheetValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ""
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return ""
    }

    return String(Math.trunc(value))
  }

  return String(value).trim()
}

function detectCsvDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim()) ?? ""

  if (!firstLine) {
    return ","
  }

  const semicolonCount = (firstLine.match(/;/g) ?? []).length
  const commaCount = (firstLine.match(/,/g) ?? []).length

  return semicolonCount > commaCount ? ";" : ","
}

function normalizeMergedDelimiterRows(
  rows: Record<string, string>[]
): Record<string, string>[] {
  if (rows.length === 0) {
    return rows
  }

  const keys = Object.keys(rows[0])

  if (keys.length !== 1) {
    return rows
  }

  const [onlyKey] = keys
  const hasMergedHeader = onlyKey.includes(";")
  const hasMergedValues = rows.some((row) => row[onlyKey]?.includes(";"))

  if (!hasMergedHeader && !hasMergedValues) {
    return rows
  }

  const headerParts = (hasMergedHeader ? onlyKey : rows[0][onlyKey])
    .split(";")
    .map((part) => normalizeSpreadsheetHeader(part))

  return rows.map((row) => {
    const valueParts = row[onlyKey].split(";")
    const normalizedRow: Record<string, string> = {}

    headerParts.forEach((header, index) => {
      if (!header) {
        return
      }

      normalizedRow[header] = (valueParts[index] ?? "").trim()
    })

    return normalizedRow
  })
}

export async function parseSpreadsheetBlob(
  blob: Blob
): Promise<Record<string, string>[]> {
  const buffer = await blob.arrayBuffer()
  const text = new TextDecoder().decode(buffer)
  const workbook = XLSX.read(buffer, {
    type: "array",
    FS: detectCsvDelimiter(text),
  })
  const sheetName = workbook.SheetNames[0]

  if (!sheetName) {
    return []
  }

  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  })

  const normalizedRows = rows.map((row) => {
    const normalizedRow: Record<string, string> = {}

    for (const [key, value] of Object.entries(row)) {
      normalizedRow[normalizeSpreadsheetHeader(String(key))] =
        serializeSpreadsheetValue(value)
    }

    return normalizedRow
  })

  return normalizeMergedDelimiterRows(normalizedRows)
}
