import * as React from 'react'

import type { DataTableContextValue } from './@types/types'
import { DataTableContext } from './data-table-context'

export function useDataTable<TData>() {
  const ctx = React.useContext(DataTableContext) as DataTableContextValue<TData> | null
  if (!ctx) {
    throw new Error('useDataTable must be used within DataTableProvider')
  }
  return ctx
}

export function useDataTableOptional<TData>() {
  return React.useContext(DataTableContext) as DataTableContextValue<TData> | null
}
