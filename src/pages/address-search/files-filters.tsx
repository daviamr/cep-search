import { useState } from "react"
import { Filter, X } from "lucide-react"

import { useDataTable } from "@/components/data-table/use-data-table"
import { HoverCard } from "@/components/hover-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { AddressFile } from "./types"

type AddressFilesFiltersDraft = {
  fileName: string
}

const EMPTY_FILTERS: AddressFilesFiltersDraft = {
  fileName: "",
}

function hasAppliedFilters(
  table: ReturnType<typeof useDataTable<AddressFile>>["table"]
) {
  const fileName = table.getColumn("fileName")?.getFilterValue()
  return Boolean(typeof fileName === "string" && fileName.trim())
}

export function AddressFilesFilters() {
  const { table } = useDataTable<AddressFile>()
  const [draft, setDraft] = useState<AddressFilesFiltersDraft>(EMPTY_FILTERS)
  const fileNameColumn = table.getColumn("fileName")
  const filtersApplied = hasAppliedFilters(table)

  function handleApplyFilters() {
    fileNameColumn?.setFilterValue(draft.fileName.trim() || undefined)
    table.setPageIndex(0)
  }

  function handleClearFilters() {
    setDraft(EMPTY_FILTERS)
    fileNameColumn?.setFilterValue(undefined)
    table.setPageIndex(0)
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address-files-filter-file">Arquivo</Label>
        <Input
          id="address-files-filter-file"
          placeholder="Filtrar por arquivo..."
          value={draft.fileName}
          onChange={(event) => setDraft((prev) => ({ ...prev, fileName: event.target.value }))}
          className="h-8 w-45 lg:w-55"
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
