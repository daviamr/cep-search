import { useState } from "react"
import { Filter, X } from "lucide-react"

import { useDataTable } from "@/components/data-table/use-data-table"
import { HoverCard } from "@/components/hover-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { CONSULTATION_STATUS_LABELS, CONSULTATION_TYPE_LABELS } from "../columns"
import type {
  ConsultationStatus,
  ConsultationType,
  RecentConsultation,
} from "../types"

type RecentConsultationsFiltersDraft = {
  type: ConsultationType | ""
  fileName: string
  status: ConsultationStatus | ""
}

const EMPTY_FILTERS: RecentConsultationsFiltersDraft = {
  type: "",
  fileName: "",
  status: "",
}

function hasAppliedFilters(
  table: ReturnType<typeof useDataTable<RecentConsultation>>["table"]
) {
  const type = table.getColumn("type")?.getFilterValue()
  const fileName = table.getColumn("fileName")?.getFilterValue()
  const status = table.getColumn("status")?.getFilterValue()

  return Boolean(type || (typeof fileName === "string" && fileName.trim()) || status)
}

export function RecentConsultationsFilters() {
  const { table } = useDataTable<RecentConsultation>()
  const [draft, setDraft] = useState<RecentConsultationsFiltersDraft>(EMPTY_FILTERS)

  const typeColumn = table.getColumn("type")
  const fileNameColumn = table.getColumn("fileName")
  const statusColumn = table.getColumn("status")
  const filtersApplied = hasAppliedFilters(table)

  function handleApplyFilters() {
    typeColumn?.setFilterValue(draft.type || undefined)
    fileNameColumn?.setFilterValue(draft.fileName.trim() || undefined)
    statusColumn?.setFilterValue(draft.status || undefined)
    table.setPageIndex(0)
  }

  function handleClearFilters() {
    setDraft(EMPTY_FILTERS)
    typeColumn?.setFilterValue(undefined)
    fileNameColumn?.setFilterValue(undefined)
    statusColumn?.setFilterValue(undefined)
    table.setPageIndex(0)
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="recent-consultations-filter-type">Tipo</Label>
        <Select
          value={draft.type || "all"}
          onValueChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              type: value === "all" ? "" : (value as ConsultationType),
            }))
          }
        >
          <SelectTrigger id="recent-consultations-filter-type">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {(Object.entries(CONSULTATION_TYPE_LABELS) as [ConsultationType, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="recent-consultations-filter-file">Arquivo</Label>
        <Input
          id="recent-consultations-filter-file"
          placeholder="Filtrar por arquivo..."
          value={draft.fileName}
          onChange={(event) => setDraft((prev) => ({ ...prev, fileName: event.target.value }))}
          className="h-9 w-45 lg:w-55"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="recent-consultations-filter-status">Status</Label>
        <Select
          value={draft.status || "all"}
          onValueChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              status: value === "all" ? "" : (value as ConsultationStatus),
            }))
          }
        >
          <SelectTrigger id="recent-consultations-filter-status">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {(
              Object.entries(CONSULTATION_STATUS_LABELS) as [ConsultationStatus, string][]
            ).map(([value, label]) => (
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
