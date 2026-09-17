import type { Table } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  /** Label do botão (padrão: "Colunas") */
  triggerLabel?: string
  /** Incluir apenas colunas com accessorFn (colunas de dados, não ações) para toggle. Padrão: true */
  onlyDataColumns?: boolean
  className?: string
}

/**
 * Dropdown para alternar visibilidade de colunas.
 * Use quando o DataTableProvider tiver options.columnVisibility habilitado.
 */
export function DataTableViewOptions<TData>({
  table,
  triggerLabel = 'Selecionar Colunas',
  onlyDataColumns = true,
  className,
}: DataTableViewOptionsProps<TData>) {
  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        (onlyDataColumns ? typeof column.accessorFn !== 'undefined' : true) && column.getCanHide(),
    )

  if (columns.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className ?? 'ml-auto hidden h-8 lg:flex'}>
          <Settings2 className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-37.5">
        <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {(column.columnDef as { meta?: { label?: string } }).meta?.label ?? column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

DataTableViewOptions.displayName = 'DataTableViewOptions'
