import { Download } from 'lucide-react'

import { useDataTable } from '@/components/data-table/use-data-table'
import { DownloadFile } from '@/components/download-file'
import { HoverCard } from '@/components/hover-card'
import { Button } from '@/components/ui/button'
import type { SpreadsheetDownloadFormat } from '@/utils/spreadsheet-download.util'

type ResultsDownloadProps = {
  fileId: string
  fileName: string
  resultCount?: number
  onDownload?: (
    fileId: string,
    format: SpreadsheetDownloadFormat,
    selectedRowIds?: string[],
  ) => void | Promise<void>
}

const SELECT_ROWS_HOVER_MESSAGE = 'Selecione ao menos um registro na tabela antes de baixar.'

export function ResultsDownloadAllButton({
  fileId,
  fileName,
  resultCount,
  onDownload,
}: ResultsDownloadProps) {
  const { table } = useDataTable<{ id: string }>()
  const count = resultCount ?? table.getCoreRowModel().rows.length

  return (
    <DownloadFile
      fileId={fileId}
      fileName={fileName}
      title="Arquivo completo"
      description={`Deseja baixar o arquivo completo de "${fileName}"?`}
      confirmLabel="Baixar"
      resultStats={[{ count, singular: 'resultado', plural: 'resultados' }]}
      trigger={
        <Button variant="outline" size="sm">
          <Download className="size-4" />
          Arquivo completo
        </Button>
      }
      onDownload={async (id, format) => {
        if (onDownload) {
          await onDownload(id, format)
        }
      }}
    />
  )
}

export function ResultsDownloadButton({ fileId, fileName, onDownload }: ResultsDownloadProps) {
  const { table } = useDataTable<{ id: string }>()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const hasSelection = selectedCount > 0
  const selectedRowIds = selectedRows.map((row) => row.original.id)
  const selectionLabel = `Seleção (${selectedCount})`

  if (!hasSelection) {
    return (
      <HoverCard content={SELECT_ROWS_HOVER_MESSAGE} side="top" closeDelay={0.5} openDelay={0.5}>
        <span className="inline-flex">
          <Button variant="outline" size="sm" disabled>
            <Download className="size-4" />
            Seleção (0)
          </Button>
        </span>
      </HoverCard>
    )
  }

  return (
    <DownloadFile
      fileId={fileId}
      fileName={fileName}
      title={selectionLabel}
      description={`Deseja baixar ${selectedCount} registro(s) selecionado(s) de "${fileName}"?`}
      confirmLabel="Baixar"
      resultStats={[
        {
          count: selectedCount,
          singular: 'registro selecionado',
          plural: 'registros selecionados',
        },
      ]}
      trigger={
        <Button variant="outline" size="sm">
          <Download className="size-4" />
          {selectionLabel}
        </Button>
      }
      onDownload={async (id, format) => {
        if (onDownload) {
          await onDownload(id, format, selectedRowIds)
        }
      }}
    />
  )
}
