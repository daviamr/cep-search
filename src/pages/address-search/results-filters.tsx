import { useState } from "react"
import { Filter, X } from "lucide-react"

import { useDataTable } from "@/components/data-table/use-data-table"
import { HoverCard } from "@/components/hover-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { AddressSearchType } from "./constants"
import type { EnrichedAddress } from "./types"

type AddressResultsFiltersDraft = {
  cpf: string
  nome: string
  cep: string
}

const EMPTY_FILTERS: AddressResultsFiltersDraft = {
  cpf: "",
  nome: "",
  cep: "",
}

function hasAppliedFilters(
  table: ReturnType<typeof useDataTable<EnrichedAddress>>["table"],
  documentType: AddressSearchType
) {
  const cep = table.getColumn("cep")?.getFilterValue()
  const hasCep = typeof cep === "string" && cep.trim()

  if (documentType === "cep") {
    return Boolean(hasCep)
  }

  const cpf = table.getColumn("cpf")?.getFilterValue()
  const nome = table.getColumn("nome")?.getFilterValue()

  return Boolean(
    (typeof cpf === "string" && cpf.trim()) ||
      (typeof nome === "string" && nome.trim()) ||
      hasCep
  )
}

export function AddressResultsFilters({
  documentType = "cpf",
}: {
  documentType?: AddressSearchType
}) {
  const { table } = useDataTable<EnrichedAddress>()
  const [draft, setDraft] = useState<AddressResultsFiltersDraft>(EMPTY_FILTERS)
  const filtersApplied = hasAppliedFilters(table, documentType)
  const isCep = documentType === "cep"

  function handleApplyFilters() {
    if (!isCep) {
      table.getColumn("cpf")?.setFilterValue(draft.cpf.trim() || undefined)
      table.getColumn("nome")?.setFilterValue(draft.nome.trim() || undefined)
    }

    table.getColumn("cep")?.setFilterValue(draft.cep.trim() || undefined)
    table.setPageIndex(0)
  }

  function handleClearFilters() {
    setDraft(EMPTY_FILTERS)

    if (!isCep) {
      table.getColumn("cpf")?.setFilterValue(undefined)
      table.getColumn("nome")?.setFilterValue(undefined)
    }

    table.getColumn("cep")?.setFilterValue(undefined)
    table.setPageIndex(0)
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      {isCep ? null : (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address-results-filter-cpf">CPF</Label>
            <Input
              id="address-results-filter-cpf"
              placeholder="Filtrar por CPF..."
              value={draft.cpf}
              onChange={(event) => setDraft((prev) => ({ ...prev, cpf: event.target.value }))}
              className="h-8 w-45 lg:w-55"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address-results-filter-nome">Nome</Label>
            <Input
              id="address-results-filter-nome"
              placeholder="Filtrar por nome..."
              value={draft.nome}
              onChange={(event) => setDraft((prev) => ({ ...prev, nome: event.target.value }))}
              className="h-8 w-45 lg:w-55"
            />
          </div>
        </>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address-results-filter-cep">CEP</Label>
        <Input
          id="address-results-filter-cep"
          placeholder="Filtrar por CEP..."
          value={draft.cep}
          onChange={(event) => setDraft((prev) => ({ ...prev, cep: event.target.value }))}
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
