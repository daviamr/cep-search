import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { useDataTable } from './use-data-table'
import { DataTableViewOptions } from './view-options'

export interface DataTableColumnFilterInputProps {
  /** Placeholder do input de busca (só usado se filtering estiver habilitado) */
  searchPlaceholder?: string
  /** AccessorKey da coluna a filtrar (só usado se filtering for objeto com column) */
  searchColumn?: string
  className?: string
}

/**
 * Input ligado ao filtro por coluna da tabela (via DataTableProvider).
 * Útil para posicionar o filtro fora do DataTableToolbar (ex.: à esquerda da barra).
 */
export function DataTableColumnFilterInput({
  searchPlaceholder = 'Filtrar...',
  searchColumn,
  className,
}: DataTableColumnFilterInputProps) {
  const { table, options } = useDataTable()

  const filteringEnabled = options.filtering === true || typeof options.filtering === 'object'

  const filterColumn =
    searchColumn ??
    (typeof options.filtering === 'object' && options.filtering?.column
      ? options.filtering.column
      : undefined)

  const placeholder =
    typeof options.filtering === 'object' && options.filtering?.placeholder
      ? options.filtering.placeholder
      : searchPlaceholder

  const columnToFilter = filterColumn ? table.getColumn(filterColumn) : null
  const firstFilterableColumn = table.getAllColumns().find((c) => c.getCanFilter())
  const actualFilterColumn = columnToFilter ?? firstFilterableColumn

  if (!filteringEnabled || !actualFilterColumn) {
    return null
  }

  return (
    <Input
      placeholder={placeholder}
      value={(actualFilterColumn.getFilterValue() as string) ?? ''}
      onChange={(event) => actualFilterColumn.setFilterValue(event.target.value)}
      className={cn('h-8 w-37.5 lg:w-62.5', className)}
    />
  )
}

export interface DataTableToolbarProps {
  /** Placeholder do input de busca (só usado se filtering estiver habilitado) */
  searchPlaceholder?: string
  /** AccessorKey da coluna a filtrar (só usado se filtering for objeto com column) */
  searchColumn?: string
  /** Se false, não renderiza o input (ex.: filtro renderizado à parte com DataTableColumnFilterInput) */
  showSearch?: boolean
  /** Mostrar botão de visibilidade de colunas (padrão: true se columnVisibility estiver habilitado) */
  showViewOptions?: boolean
  /** Conteúdo extra à direita (antes do view options) */
  children?: React.ReactNode
  className?: string
}

/**
 * Barra de ferramentas: input de filtro (quando filtering habilitado) e opcionalmente DataTableViewOptions.
 * Use quando quiser filtro e/ou toggle de colunas acima da tabela.
 */
export function DataTableToolbar({
  searchPlaceholder = 'Filtrar...',
  searchColumn,
  showSearch = true,
  showViewOptions,
  children,
  className,
}: DataTableToolbarProps) {
  const { table, options } = useDataTable()

  const filteringEnabled = options.filtering === true || typeof options.filtering === 'object'
  const columnVisibilityEnabled =
    options.columnVisibility === true || typeof options.columnVisibility === 'object'

  const filterColumn =
    searchColumn ??
    (typeof options.filtering === 'object' && options.filtering?.column
      ? options.filtering.column
      : undefined)

  const columnToFilter = filterColumn ? table.getColumn(filterColumn) : null
  const firstFilterableColumn = table.getAllColumns().find((c) => c.getCanFilter())
  const actualFilterColumn = columnToFilter ?? firstFilterableColumn

  const hasSearchInput = showSearch && filteringEnabled && !!actualFilterColumn
  const showViewOptionsButton = showViewOptions !== false && columnVisibilityEnabled

  if (!hasSearchInput && !showViewOptionsButton && !children) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {hasSearchInput && (
        <DataTableColumnFilterInput searchPlaceholder={searchPlaceholder} searchColumn={searchColumn} />
      )}
      {children}
      {showViewOptionsButton && <DataTableViewOptions table={table} />}
    </div>
  )
}

DataTableToolbar.displayName = 'DataTableToolbar'
