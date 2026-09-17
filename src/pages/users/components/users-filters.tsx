import { useState } from 'react'
import { Filter, X } from 'lucide-react'

import { useDataTable } from '@/components/data-table/use-data-table'
import { HoverCard } from '@/components/hover-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { USER_ROLE_LABELS, type User, type UserRole } from '../types'

const ROLE_OPTIONS = Object.entries(USER_ROLE_LABELS) as [UserRole, string][]

type UsersFiltersDraft = {
  name: string
  email: string
  role: UserRole | ''
}

const EMPTY_FILTERS: UsersFiltersDraft = {
  name: '',
  email: '',
  role: '',
}

function hasAppliedFilters(table: ReturnType<typeof useDataTable<User>>['table']) {
  const name = table.getColumn('name')?.getFilterValue()
  const email = table.getColumn('email')?.getFilterValue()
  const role = table.getColumn('role')?.getFilterValue()

  return Boolean(
    (typeof name === 'string' && name.trim()) ||
      (typeof email === 'string' && email.trim()) ||
      role,
  )
}

export function UsersFilters() {
  const { table } = useDataTable<User>()
  const [draft, setDraft] = useState<UsersFiltersDraft>(EMPTY_FILTERS)

  const nameColumn = table.getColumn('name')
  const emailColumn = table.getColumn('email')
  const roleColumn = table.getColumn('role')
  const filtersApplied = hasAppliedFilters(table)

  function handleApplyFilters() {
    nameColumn?.setFilterValue(draft.name.trim() || undefined)
    emailColumn?.setFilterValue(draft.email.trim() || undefined)
    roleColumn?.setFilterValue(draft.role || undefined)
    table.setPageIndex(0)
  }

  function handleClearFilters() {
    setDraft(EMPTY_FILTERS)
    nameColumn?.setFilterValue(undefined)
    emailColumn?.setFilterValue(undefined)
    roleColumn?.setFilterValue(undefined)
    table.setPageIndex(0)
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="users-filter-name">Nome</Label>
        <Input
          id="users-filter-name"
          placeholder="Filtrar por nome..."
          value={draft.name}
          onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
          className="h-8 w-45 lg:w-55"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="users-filter-email">E-mail</Label>
        <Input
          id="users-filter-email"
          placeholder="Filtrar por e-mail..."
          value={draft.email}
          onChange={(event) => setDraft((prev) => ({ ...prev, email: event.target.value }))}
          className="h-8 w-45 lg:w-55"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="users-filter-role">Nível de usuário</Label>
        <Select
          value={draft.role || 'all'}
          onValueChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              role: value === 'all' ? '' : (value as UserRole),
            }))
          }
        >
          <SelectTrigger id="users-filter-role" className="h-8 w-45 lg:w-55" size="sm">
            <SelectValue placeholder="Todos os níveis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os níveis</SelectItem>
            {ROLE_OPTIONS.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
