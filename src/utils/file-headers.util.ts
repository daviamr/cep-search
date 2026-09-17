import * as XLSX from 'xlsx'

const CSV_DELIMITERS = [';', ',', '\t', '|']

const DOCUMENT_COLUMN_CANDIDATES: Record<'CPF' | 'CNPJ' | 'CEP', string[]> = {
  CPF: ['documento', 'cpf', 'cpf_cnpj'],
  CNPJ: ['documento', 'cnpj', 'cnpj_cpf'],
  CEP: ['cep', 'codigo_postal', 'codigo postal', 'postal'],
}

export const NUMERO_COLUMN_CANDIDATES = ['numero', 'num', 'nro', 'number']
export const COMPLEMENTO_COLUMN_CANDIDATES = [
  'complemento',
  'compl',
  'complem',
  'complement',
]

const COLUMN_LABEL_ACRONYMS = new Set(['cpf', 'cnpj', 'cep', 'uf', 'id', 'ddd'])

function normalizeHeader(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

/** Converte `socios_cnpj` em `Socios CNPJ` para exibir no select, sem alterar o valor enviado. */
export function formatSpreadsheetColumnLabel(header: string): string {
  const words = header
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)

  if (words.length === 0) {
    return header
  }

  return words
    .map((word) => {
      const lower = word.toLowerCase()

      if (COLUMN_LABEL_ACRONYMS.has(lower)) {
        return lower.toUpperCase()
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

function getFirstCsvRecord(text: string): string {
  let inQuotes = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]

    if (character === '"') {
      if (inQuotes && text[index + 1] === '"') {
        index += 1
      } else {
        inQuotes = !inQuotes
      }

      continue
    }

    if (!inQuotes && (character === '\r' || character === '\n')) {
      return text.slice(0, index)
    }
  }

  return text
}

function countDelimiterOutsideQuotes(line: string, delimiter: string): number {
  let inQuotes = false
  let count = 0

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        index += 1
      } else {
        inQuotes = !inQuotes
      }

      continue
    }

    if (!inQuotes && character === delimiter) {
      count += 1
    }
  }

  return count
}

function sniffDelimiter(line: string): string {
  let best = ','
  let bestCount = 0

  for (const delimiter of CSV_DELIMITERS) {
    const count = countDelimiterOutsideQuotes(line, delimiter)

    if (count > bestCount) {
      best = delimiter
      bestCount = count
    }
  }

  return best
}

function parseCsvRecord(line: string, delimiter: string): string[] {
  const values: string[] = []
  let value = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        value += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }

      continue
    }

    if (!inQuotes && character === delimiter) {
      values.push(value.trim())
      value = ''
      continue
    }

    value += character
  }

  values.push(value.trim())

  return values
}

async function readCsvHeaders(file: File): Promise<string[]> {
  const text = await file.text()
  const firstRecord = getFirstCsvRecord(text).replace(/^\ufeff/, '')

  if (!firstRecord.trim()) {
    return []
  }

  const delimiter = sniffDelimiter(firstRecord)

  return parseCsvRecord(firstRecord, delimiter)
    .filter(Boolean)
}

async function readXlsxHeaders(file: File): Promise<string[]> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = sheetName ? workbook.Sheets[sheetName] : undefined

  if (!sheet) {
    return []
  }

  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 })
  const headerRow = rows[0]

  if (!Array.isArray(headerRow)) {
    return []
  }

  return headerRow.map((value) => String(value ?? '').trim()).filter(Boolean)
}

/** Lê os cabeçalhos da primeira linha/aba do arquivo, como a API lê. */
export async function readFileHeaders(file: File): Promise<string[]> {
  const magic = new Uint8Array(await file.slice(0, 2).arrayBuffer())
  const isZip = magic[0] === 0x50 && magic[1] === 0x4b // "PK" (XLSX é um zip)

  return isZip ? readXlsxHeaders(file) : readCsvHeaders(file)
}

/**
 * Encontra a coluna do documento nos cabeçalhos, ignorando maiúsculas,
 * minúsculas e acentos. Devolve o cabeçalho original (que a API exige).
 */
export function detectColumn(
  headers: string[],
  candidates: string[],
  usedHeaders: string[] = [],
): string | null {
  const used = new Set(usedHeaders.map(normalizeHeader))

  for (const candidate of candidates) {
    const match = headers.find((header) => {
      const normalized = normalizeHeader(header)
      return normalized === candidate && !used.has(normalized)
    })

    if (match) {
      return match
    }
  }

  return null
}

export function detectDocumentColumn(
  headers: string[],
  tipo: 'CPF' | 'CNPJ' | 'CEP',
): string | null {
  return detectColumn(headers, DOCUMENT_COLUMN_CANDIDATES[tipo])
}
