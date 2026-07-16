import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Search, X } from "lucide-react"

import { HoverCard } from "@/components/hover-card"
import { QueryEmptyState } from "@/components/query-empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { simpleSearchCPF } from "@/lib/api/cpf"

import { AddressResultsTable } from "./address-results-table"
import {
  simpleSearchSchema,
  type SimpleSearchInput,
  type SimpleSearchValues,
} from "../schemas"
import type { EnrichedCpfAddress } from "../types"
import { enrichCpfAddresses } from "../utils/enrich-addresses"

export function SimpleSearchForm() {
  const [addresses, setAddresses] = useState<EnrichedCpfAddress[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SimpleSearchInput, unknown, SimpleSearchValues>({
    resolver: zodResolver(simpleSearchSchema),
    defaultValues: { cpf: "" },
  })

  const cpfValue = watch("cpf")
  const canClear =
    Boolean(cpfValue?.trim()) || hasSearched || addresses.length > 0

  async function onSubmit({ cpf }: SimpleSearchValues) {
    setSearchError(null)
    setAddresses([])
    setIsLoadingAddresses(true)

    try {
      const data = await simpleSearchCPF(cpf)

      if (!data || !Array.isArray(data) || data.length === 0) {
        setSearchError("Nenhum resultado encontrado para este CPF.")
        setHasSearched(true)
        return
      }

      const enriched = await enrichCpfAddresses(data)
      setAddresses(enriched)
      setHasSearched(true)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  function handleClear() {
    reset({ cpf: "" })
    setAddresses([])
    setSearchError(null)
    setHasSearched(false)
  }

  const isBusy = isSubmitting || isLoadingAddresses
  const showInitialState = !hasSearched && !isBusy
  const showEmptyResults = hasSearched && !isBusy && addresses.length === 0

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Consulta simples</h2>
        <p className="text-sm text-muted-foreground">
          Consulte um CPF e visualize os endereços vinculados à pessoa.
        </p>
      </div>

      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            aria-invalid={Boolean(errors.cpf)}
            disabled={isBusy}
            className="h-8 w-45 lg:w-55"
            {...register("cpf")}
          />
          {errors.cpf && (
            <p className="text-sm text-destructive">{errors.cpf.message}</p>
          )}
        </div>

        <Button type="submit" size="sm" disabled={isBusy || !cpfValue?.trim()}>
          {isBusy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
          Consultar
        </Button>

        {canClear ? (
          <HoverCard content="Limpar filtros" side="top" closeDelay={0.5} openDelay={0.5}>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={isBusy}
              aria-label="Limpar filtros"
              onClick={handleClear}
            >
              <X className="size-4" />
            </Button>
          </HoverCard>
        ) : null}
      </form>

      {isBusy ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Consultando...
        </div>
      ) : null}

      {showInitialState ? (
        <QueryEmptyState
          variant="initial"
          title="Nenhuma consulta realizada"
          description="Informe o CPF e clique em Consultar para visualizar os resultados."
        />
      ) : null}

      {showEmptyResults ? (
        <QueryEmptyState
          variant="empty"
          title="Nenhum resultado encontrado"
          description={
            searchError ?? "Nenhum resultado encontrado para este CPF."
          }
        />
      ) : null}

      {!isBusy && addresses.length > 0 ? (
        <AddressResultsTable
          addresses={addresses}
          isLoading={false}
        />
      ) : null}
    </section>
  )
}
