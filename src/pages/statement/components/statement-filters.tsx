import { useState } from 'react'
import { Filter, X } from 'lucide-react'

import { useDataTable } from '@/components/data-table/use-data-table'
import { DatePickerWithRange, type DatePickerRangeValue } from '@/components/date-picker-range'
import { HoverCard } from '@/components/hover-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { STATEMENT_TYPE_LABELS, type StatementMovementType, type StatementRecord } from '../types'

const TYPE_OPTIONS = Object.entries(STATEMENT_TYPE_LABELS) as [StatementMovementType, string][]

type StatementFiltersDraft = {
  createdAt: DatePickerRangeValue
  type: StatementMovementType | ''
  description: string
}

const EMPTY_FILTERS: StatementFiltersDraft = {
  createdAt: undefined,
  type: '',
  description: '',
}

function hasAppliedFilters(table: ReturnType<typeof useDataTable<StatementRecord>>['table']) {
  const createdAt = table.getColumn('createdAt')?.getFilterValue() as DatePickerRangeValue
  const type = table.getColumn('type')?.getFilterValue()
  const description = table.getColumn('description')?.getFilterValue()

  return Boolean(
    createdAt?.from || type || (typeof description === 'string' && description.trim()),
  )
}

export function StatementFilters() {
  const { table } = useDataTable<StatementRecord>()
  const [draft, setDraft] = useState<StatementFiltersDraft>(EMPTY_FILTERS)

  const createdAtColumn = table.getColumn('createdAt')
  const typeColumn = table.getColumn('type')
  const descriptionColumn = table.getColumn('description')
  const filtersApplied = hasAppliedFilters(table)

  function handleApplyFilters() {
    createdAtColumn?.setFilterValue(draft.createdAt?.from ? draft.createdAt : undefined)
    typeColumn?.setFilterValue(draft.type || undefined)
    descriptionColumn?.setFilterValue(draft.description.trim() || undefined)
    table.setPageIndex(0)
  }

  function handleClearFilters() {
    setDraft(EMPTY_FILTERS)
    createdAtColumn?.setFilterValue(undefined)
    typeColumn?.setFilterValue(undefined)
    descriptionColumn?.setFilterValue(undefined)
    table.setPageIndex(0)
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <DatePickerWithRange
        id="statement-filter-date"
        label="Data"
        placeholder="Filtrar por data"
        defaultDateDirection="past"
        value={draft.createdAt}
        onChange={(range) => setDraft((prev) => ({ ...prev, createdAt: range }))}
        className="w-auto"
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="statement-filter-type">Tipo de movimentação</Label>
        <Select
          value={draft.type || 'all'}
          onValueChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              type: value === 'all' ? '' : (value as StatementMovementType),
            }))
          }
        >
          <SelectTrigger id="statement-filter-type" className="h-9 w-45 lg:w-55">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {TYPE_OPTIONS.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="statement-filter-description">Pesquisar por descrição</Label>
        <Input
          id="statement-filter-description"
          placeholder="Pesquisar por descrição..."
          value={draft.description}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, description: event.target.value }))
          }
          className="h-9 w-55 lg:w-70"
        />
      </div>

      <div className="flex items-center gap-2">
        <HoverCard content="Aplicar filtros" side="top" closeDelay={0.5} openDelay={0.5}>
          <Button
            type="button"
            size="icon-sm"
            aria-label="Aplicar filtros"
            onClick={handleApplyFilters}
          >
            <Filter className="size-4" />
          </Button>
        </HoverCard>

        {filtersApplied ? (
          <HoverCard content="Limpar filtros" side="top" closeDelay={0.5} openDelay={0.5}>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Limpar filtros"
              onClick={handleClearFilters}
            >
              <X className="size-4" />
            </Button>
          </HoverCard>
        ) : null}
      </div>
    </div>
  )
}
