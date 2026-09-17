import { endOfDay, startOfDay } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'

import { getCheckboxColumn } from '@/components/data-table/checkbox-column'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatDateAndHours } from '@/utils/date-and-hours.util'
import { moneyFormat } from '@/utils/money.util'

import { DownloadReceiptButton } from './components/download-receipt-button'
import { STATEMENT_TYPE_LABELS, type StatementMovementType, type StatementRecord } from './types'

const TYPE_BADGE_CLASSNAMES: Record<StatementMovementType, string> = {
  addition: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  removal: 'border-destructive/30 bg-destructive/10 text-destructive',
  refund: 'border-primary/30 bg-primary/10 text-primary',
}

export const statementColumns: ColumnDef<StatementRecord>[] = [
  getCheckboxColumn<StatementRecord>(),
  {
    accessorKey: 'createdAt',
    meta: { label: 'Data/Hora' },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data/Hora" />,
    filterFn: (row, columnId, filterValue: DateRange | undefined) => {
      if (!filterValue?.from) return true

      const date = row.getValue<Date>(columnId)
      const from = startOfDay(filterValue.from)
      const to = endOfDay(filterValue.to ?? filterValue.from)

      return date >= from && date <= to
    },
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDateAndHours(row.getValue<Date>('createdAt'))}
      </span>
    ),
  },
  {
    accessorKey: 'description',
    meta: { label: 'Descrição' },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Descrição" />,
    filterFn: 'includesString',
    cell: ({ row }) => (
      <span className="max-w-80 truncate font-medium text-foreground">
        {row.getValue<string>('description')}
      </span>
    ),
  },
  {
    accessorKey: 'type',
    meta: { label: 'Tipo' },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true
      return row.getValue<StatementMovementType>(columnId) === filterValue
    },
    cell: ({ row }) => {
      const type = row.getValue<StatementMovementType>('type')

      return (
        <Badge variant="outline" className={TYPE_BADGE_CLASSNAMES[type]}>
          {STATEMENT_TYPE_LABELS[type]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'amount',
    meta: { label: 'Valor' },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valor" />,
    cell: ({ row }) => {
      const amount = row.getValue<number>('amount')
      const isPositive = amount > 0

      return (
        <span
          className={cn(
            'tabular-nums font-medium',
            isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
          )}
        >
          {moneyFormat(amount)}
        </span>
      )
    },
  },
  {
    accessorKey: 'balanceAfter',
    meta: { label: 'Saldo' },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Saldo" />,
    cell: ({ row }) => (
      <span className="tabular-nums text-foreground">
        {moneyFormat(row.getValue<number>('balanceAfter'))}
      </span>
    ),
  },
  {
    id: 'actions',
    meta: { variant: 'actions', label: 'Ações' },
    enableHiding: false,
    header: () => <span className="sr-only">Ações</span>,
    cell: ({ row }) => (
      <div className="flex items-center">
        <DownloadReceiptButton record={row.original} />
      </div>
    ),
  },
]
