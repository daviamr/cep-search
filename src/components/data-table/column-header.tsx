'use client'

import type { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const SORTABLE_COLUMN_TITLES = new Set(['Arquivo', 'Data/Hora', 'MB', 'Nome'])

export interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  icon?: LucideIcon
  iconClassName?: string
}

/**
 * Cabeçalho de coluna com ordenação e opção de ocultar.
 * Use nas definições de coluna quando quiser sorting e/ou hide.
 * Ordenação só é exibida para: Arquivo, Data/Hora, MB e Nome.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  icon: Icon,
  iconClassName,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const canSort = column.getCanSort() && SORTABLE_COLUMN_TITLES.has(title)

  if (!canSort) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {Icon && <Icon className={cn('h-4 w-4 text-primary', iconClassName)} />}
        {title}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 hover:bg-transparent hover:text-inherit dark:hover:bg-transparent data-[state=open]:bg-transparent"
          >
            {Icon && <Icon className={cn('h-4 w-4 text-primary', iconClassName)} />}
            <span className="text-md">{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 h-4 w-4" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 h-4 w-4" />
            Desc
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="mr-2 h-4 w-4" />
                Ocultar
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

DataTableColumnHeader.displayName = 'DataTableColumnHeader'
