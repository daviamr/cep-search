import * as XLSX from 'xlsx'

export type SpreadsheetDownloadFormat = 'xlsx' | 'csv'

export type SpreadsheetSheet = {
  name: string
  rows: Array<Array<string | number>>
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function withSpreadsheetExtension(
  fileName: string,
  format: SpreadsheetDownloadFormat,
): string {
  const trimmed = fileName.trim() || 'resultados'
  const withoutExtension = trimmed.replace(/\.(csv|xls|xlsx|txt)$/i, '')

  return `${withoutExtension}.${format}`
}

function workbookToCsv(workbook: XLSX.WorkBook): string {
  return workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    const csv = sheet ? XLSX.utils.sheet_to_csv(sheet, { FS: ';' }) : ''

    if (workbook.SheetNames.length === 1) {
      return csv
    }

    return `# ${sheetName}\n${csv}`.trim()
  }).join('\n\n')
}

export function downloadWorkbook(
  workbook: XLSX.WorkBook,
  fileName: string,
  format: SpreadsheetDownloadFormat,
) {
  const resolvedName = withSpreadsheetExtension(fileName, format)

  if (format === 'csv') {
    const csv = workbookToCsv(workbook)
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' })
    triggerDownload(blob, resolvedName)
    return
  }

  const output = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([output], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  triggerDownload(blob, resolvedName)
}

export function downloadSpreadsheetSheets(
  sheets: SpreadsheetSheet[],
  fileName: string,
  format: SpreadsheetDownloadFormat,
) {
  const workbook = XLSX.utils.book_new()

  for (const sheet of sheets) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(sheet.rows), sheet.name)
  }

  downloadWorkbook(workbook, fileName, format)
}

export async function downloadSpreadsheetBlob(
  blob: Blob,
  fileName: string,
  format: SpreadsheetDownloadFormat,
) {
  const buffer = await blob.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })

  downloadWorkbook(workbook, fileName, format)
}
