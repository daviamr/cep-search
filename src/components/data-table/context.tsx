'use client'

import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { DataTableContext } from './data-table-context'
import type { DataTableContextValue, DataTableProviderOptions } from './@types/types'

interface DataTableProviderProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  options?: DataTableProviderOptions
  children: React.ReactNode
}

export function DataTableProvider<TData, TValue>({
  columns,
  data,
  options = {},
  children,
}: DataTableProviderProps<TData, TValue>) {
  const paginationEnabled = options.pagination === true || typeof options.pagination === 'object'
  const sortingEnabled = options.sorting === true
  const filteringEnabled = options.filtering === true || typeof options.filtering === 'object'
  const columnVisibilityEnabled =
    options.columnVisibility === true || typeof options.columnVisibility === 'object'
  const initialColumnVisibility =
    typeof options.columnVisibility === 'object' ? (options.columnVisibility.initial ?? {}) : {}
  const rowSelectionEnabled = options.rowSelection === true

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const pageSize =
    typeof options.pagination === 'object' && options.pagination?.pageSize != null
      ? options.pagination.pageSize
      : 10

  const table = useReactTable({
    data,
    columns,
    getRowId: (row, index) => {
      const id = (row as { id?: string | number }).id
      return id == null ? String(index) : String(id)
    },
    state: {
      ...(sortingEnabled && { sorting }),
      ...(filteringEnabled && { columnFilters }),
      ...(columnVisibilityEnabled && { columnVisibility }),
      ...(rowSelectionEnabled && { rowSelection }),
    },
    onSortingChange: sortingEnabled ? setSorting : undefined,
    onColumnFiltersChange: filteringEnabled ? setColumnFilters : undefined,
    onColumnVisibilityChange: columnVisibilityEnabled ? setColumnVisibility : undefined,
    onRowSelectionChange: rowSelectionEnabled ? setRowSelection : undefined,
    getCoreRowModel: getCoreRowModel(),
    // Evita setState durante o render (React 19 + Strict Mode) ao carregar/filtrar dados.
    // Ver: https://github.com/TanStack/table/issues/5026
    autoResetPageIndex: false,
    ...(paginationEnabled && {
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize } },
    }),
    ...(sortingEnabled && { getSortedRowModel: getSortedRowModel() }),
    ...(filteringEnabled && { getFilteredRowModel: getFilteredRowModel() }),
  })

  const value: DataTableContextValue<TData> = {
    table,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    options,
  }

  return (
    <DataTableContext.Provider value={value as DataTableContextValue<unknown>}>
      {children}
    </DataTableContext.Provider>
  )
}

DataTableProvider.displayName = 'DataTableProvider'
