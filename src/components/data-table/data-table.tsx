import type { LucideIcon } from 'lucide-react'
import { flexRender } from '@tanstack/react-table'

import { EmptyStateCard } from '@/components/empty-state-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { useDataTable } from './use-data-table'

const headAlignClass = 'text-left'
const cellAlignClass = 'text-left text-xs text-muted-foreground'
const actionsAlignClass = 'text-right [&>div]:justify-end'

function isActionsColumn(column: { columnDef: { meta?: { variant?: string } } }) {
  return column.columnDef.meta?.variant === 'actions'
}

export interface DataTableProps {
  /** Título do empty state (quando não há linhas) */
  emptyMessage?: string
  /** Descrição opcional do empty state */
  emptyDescription?: string
  /** Ícone do empty state */
  emptyIcon?: LucideIcon
  /** Exibe o card de loading no lugar da tabela */
  isLoading?: boolean
  className?: string
  /** Classe aplicada ao wrapper da tabela (overflow e border) */
  tableWrapperClassName?: string
}

/** Header (h-10) + 10 linhas (~3rem cada) — altura fixa só quando pageSize > 10 */
const TEN_ROWS_MAX_HEIGHT_CLASS = '[&>div]:max-h-[calc(2.5rem+10*3rem)]'

export function DataTable({
  emptyMessage = 'Nenhum resultado.',
  emptyDescription,
  emptyIcon,
  isLoading = false,
  className,
  tableWrapperClassName,
}: DataTableProps) {
  const { table } = useDataTable()
  const hasRows = Boolean(table.getRowModel().rows?.length)
  const pageSize = table.getState().pagination.pageSize
  const needsScroll = pageSize > 10

  if (isLoading || !hasRows) {
    return (
      <EmptyStateCard
        isLoading={isLoading}
        title={emptyMessage}
        description={emptyDescription}
        icon={emptyIcon}
        className={className}
      />
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          '[&>div]:rounded-sm [&>div]:border overflow-hidden rounded-md border',
          needsScroll ? TEN_ROWS_MAX_HEIGHT_CLASS : '[&>div]:max-h-none',
          tableWrapperClassName,
        )}
      >
        <Table className="table-auto w-max min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-background sticky top-0">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        headAlignClass,
                        isActionsColumn(header.column) && actionsAlignClass,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cellAlignClass,
                        isActionsColumn(cell.column) && actionsAlignClass,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

DataTable.displayName = 'DataTable'
