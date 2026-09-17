/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  RowSelectionState,
  Table as TanStackTable,
} from '@tanstack/react-table'

export type { ColumnDef, TanStackTable }

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Rótulo exibido no seletor de visibilidade de colunas e filtros. */
    label?: string
    /** Alinhamento do cabeçalho e das células (padrão: left). */
    align?: 'left' | 'center' | 'right'
    /** Coluna de ações (botões); alinha à direita como `align: 'right'`. */
    variant?: 'actions'
  }
}

export interface DataTableProviderOptions {
  /** Habilita paginação (padrão: false) */
  pagination?: boolean | { pageSize?: number }
  /** Habilita ordenação por colunas (padrão: false) */
  sorting?: boolean
  /** Habilita filtro global ou por coluna (padrão: false). Se string, é o accessorKey da coluna para o filtro. */
  filtering?: boolean | { column?: string; placeholder?: string }
  /** Habilita toggle de visibilidade de colunas (padrão: false) */
  columnVisibility?: boolean | { initial?: VisibilityState }
  /** Habilita seleção de linhas com checkbox (padrão: false) */
  rowSelection?: boolean
}

export interface DataTableContextValue<TData> {
  table: TanStackTable<TData>
  sorting: SortingState
  columnFilters: ColumnFiltersState
  columnVisibility: VisibilityState
  rowSelection: RowSelectionState
  options: DataTableProviderOptions
}
