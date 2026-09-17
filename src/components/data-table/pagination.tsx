'use client'

import type { Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/utils/format-number.util'

import { useDataTableOptional } from './use-data-table'

export const DATA_TABLE_PAGE_SIZES = [10, 25, 50, 75, 100] as const

function formatResultsLabel(count: number): string {
  const formatted = formatNumber(count)
  return count === 1 ? `${formatted} resultado` : `${formatted} resultados`
}

export interface DataTablePaginationProps<TData> {
  /** Tabela (opcional se usado dentro de DataTableProvider) */
  table?: Table<TData>
  /** Texto à esquerda (ex: "X de Y linha(s) selecionada(s)."). Omitir para não mostrar. */
  selectionText?: React.ReactNode
  /** Exibe a quantidade de resultados no canto inferior esquerdo (padrão: true). */
  showResultsCount?: boolean
  /** Tamanhos de página disponíveis */
  pageSizes?: number[]
  className?: string
}

/**
 * Controles de paginação: tamanho da página, navegação e opcionalmente contagem de seleção.
 * Use apenas quando o DataTableProvider tiver options.pagination habilitado.
 * Pode ser usado sem props dentro do Provider: <DataTablePagination />
 */
export function DataTablePagination<TData>({
  table: tableProp,
  selectionText,
  showResultsCount = true,
  pageSizes = [...DATA_TABLE_PAGE_SIZES],
  className,
}: DataTablePaginationProps<TData>) {
  const context = useDataTableOptional<TData>()
  const table = tableProp ?? context?.table

  if (!table) {
    return null
  }

  const filteredRowCount = table.getFilteredRowModel().rows.length
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length
  const hasSelection = selectedRowCount > 0
  const showSelection =
    selectionText !== undefined ? true : hasSelection || table.getIsAllPageRowsSelected()

  return (
    <div
      className={cn('flex items-center justify-between px-2', className)}
    >
      <div className="text-muted-foreground flex-1 text-sm">
        <div className="flex flex-col gap-0.5">
          {showResultsCount ? (
            <span className="tabular-nums">{formatResultsLabel(filteredRowCount)}</span>
          ) : null}

          {showSelection && selectionText !== null ? (
            selectionText ?? (
              <>
                {selectedRowCount} de {filteredRowCount} linha(s) selecionada(s).
              </>
            )
          ) : null}
        </div>
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Linhas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-25 items-center justify-center text-sm font-medium">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Primeira página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Próxima página</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

DataTablePagination.displayName = 'DataTablePagination'
