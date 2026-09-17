import { Download, Loader2, Search, X } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'

import type { ColumnDef } from '@tanstack/react-table'

import { DataTable, DataTablePagination, DataTableProvider } from '@/components/data-table'
import { DownloadFile } from '@/components/download-file'
import { HoverCard } from '@/components/hover-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SpreadsheetDownloadFormat } from '@/utils/spreadsheet-download.util'

type SimpleQueryProps<TData> = {
  documentLabel: string
  documentPlaceholder: string
  submitLabel?: string
  description?: string
  extraFields?: ReactNode | ((ctx: { isSearching: boolean }) => ReactNode)
  onClear?: () => void
  columns: ColumnDef<TData>[]
  onSearch: (document: string) => Promise<TData[] | null> | TData[] | null
  emptyMessage?: string
  onExport?: (
    results: TData[],
    format: SpreadsheetDownloadFormat,
    document: string,
  ) => void | Promise<void>
  exportFileName?: string
}

export function SimpleQuery<TData>({
  documentLabel,
  documentPlaceholder,
  submitLabel = 'Consultar',
  description = 'Informe o documento e clique em Consultar para visualizar os resultados.',
  extraFields,
  onClear,
  columns,
  onSearch,
  emptyMessage = 'Nenhum resultado encontrado.',
  onExport,
  exportFileName,
}: SimpleQueryProps<TData>) {
  const [document, setDocument] = useState('')
  const [results, setResults] = useState<TData[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const canClear = document.trim().length > 0 || hasSearched
  const hasResults = results.length > 0
  const resolvedExportFileName = exportFileName ?? `consulta-${documentLabel.toLowerCase()}`

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const value = document.trim()
    if (!value) return

    setIsSearching(true)

    try {
      const nextResults = await onSearch(value)
      setResults(nextResults ?? [])
      setHasSearched(true)
    } finally {
      setIsSearching(false)
    }
  }

  function handleClear() {
    setDocument('')
    setResults([])
    setHasSearched(false)
    onClear?.()
  }

  const resolvedExtraFields =
    typeof extraFields === 'function' ? extraFields({ isSearching }) : extraFields

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Consulta simples</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <form
        className="flex flex-wrap items-end gap-2 rounded-xl border border-border bg-card p-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="simple-query-document">{documentLabel}</Label>
          <Input
            id="simple-query-document"
            placeholder={documentPlaceholder}
            value={document}
            onChange={(event) => setDocument(event.target.value)}
            disabled={isSearching}
            className="h-8 w-45 lg:w-55"
          />
        </div>

        {resolvedExtraFields}

        <Button type="submit" size="sm" disabled={isSearching || !document.trim()}>
          {isSearching ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
          {submitLabel}
        </Button>

        {canClear ? (
          <HoverCard content="Limpar filtros" side="top" closeDelay={0.5} openDelay={0.5}>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={isSearching}
              aria-label="Limpar filtros"
              onClick={handleClear}
            >
              <X className="size-4" />
            </Button>
          </HoverCard>
        ) : null}
      </form>

      <DataTableProvider
        columns={columns}
        data={results}
        options={{
          pagination: { pageSize: 10 },
        }}
      >
        <div className="space-y-4 overflow-hidden rounded-xl border border-border bg-card p-4">
          {hasResults && onExport ? (
            <div className="flex justify-end">
              <DownloadFile
                fileId={resolvedExportFileName}
                fileName={resolvedExportFileName}
                showFileId={false}
                title="Exportar resultados"
                description="Escolha o formato do arquivo para baixar os resultados da consulta."
                confirmLabel="Baixar"
                resultStats={[
                  {
                    count: results.length,
                    singular: 'resultado',
                    plural: 'resultados',
                  },
                ]}
                trigger={
                  <Button type="button" variant="outline" size="sm">
                    <Download className="size-4" />
                    Exportar resultados
                  </Button>
                }
                onDownload={async (_id, format) => {
                  await onExport(results, format, document)
                }}
              />
            </div>
          ) : null}
          <DataTable
            isLoading={isSearching}
            emptyMessage={hasSearched ? emptyMessage : 'Nenhuma consulta realizada'}
            emptyDescription={
              hasSearched
                ? 'Tente consultar outro documento ou limpe os filtros para iniciar uma nova busca.'
                : 'Informe o documento e clique em Consultar para selecionar as colunas e visualizar os resultados.'
            }
          />
          {hasResults ? <DataTablePagination /> : null}
        </div>
      </DataTableProvider>
    </section>
  )
}
