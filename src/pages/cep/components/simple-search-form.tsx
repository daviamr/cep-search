import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Search, X } from "lucide-react"

import { HoverCard } from "@/components/hover-card"
import { QueryEmptyState } from "@/components/query-empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { simpleSearchCEP } from "@/lib/api/cep"

import { AddressResultsTable } from "./address-results-table"
import {
  simpleSearchSchema,
  type SimpleSearchInput,
  type SimpleSearchValues,
} from "../schemas"
import type { EnrichedCepAddress } from "../types"
import { enrichCepAddresses } from "../utils/enrich-addresses"

export function SimpleSearchForm() {
  const [addresses, setAddresses] = useState<EnrichedCepAddress[]>([])
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
    defaultValues: { cep: "", numero: "", complemento: "" },
  })

  const cepValue = watch("cep")
  const canClear =
    Boolean(cepValue?.trim()) || hasSearched || addresses.length > 0

  async function onSubmit({ cep, numero, complemento }: SimpleSearchValues) {
    setSearchError(null)
    setAddresses([])
    setIsLoadingAddresses(true)

    try {
      const data = await simpleSearchCEP(cep, { numero, complemento })

      if (!data || !Array.isArray(data) || data.length === 0) {
        setSearchError("Nenhum resultado encontrado para este CEP.")
        setHasSearched(true)
        return
      }

      const enriched = await enrichCepAddresses(data)
      setAddresses(enriched)
      setHasSearched(true)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  function handleClear() {
    reset({ cep: "", numero: "", complemento: "" })
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
          Consulte um CEP e visualize os endereços e CPFs vinculados ao local.
        </p>
      </div>

      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            aria-invalid={Boolean(errors.cep)}
            disabled={isBusy}
            className="h-8 w-45 lg:w-55"
            {...register("cep")}
          />
          {errors.cep && (
            <p className="text-sm text-destructive">{errors.cep.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="numero">Número</Label>
          <Input
            id="numero"
            type="text"
            placeholder="Ex.: 123"
            disabled={isBusy}
            className="h-8 w-28"
            {...register("numero")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            type="text"
            placeholder="Ex.: Apto 101"
            disabled={isBusy}
            className="h-8 w-40"
            {...register("complemento")}
          />
        </div>

        <Button type="submit" size="sm" disabled={isBusy || !cepValue?.trim()}>
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
          description="Informe o CEP e clique em Consultar para visualizar os resultados."
        />
      ) : null}

      {showEmptyResults ? (
        <QueryEmptyState
          variant="empty"
          title="Nenhum resultado encontrado"
          description={
            searchError ?? "Nenhum resultado encontrado para este CEP."
          }
        />
      ) : null}

      {!isBusy && addresses.length > 0 ? (
        <AddressResultsTable
          addresses={addresses}
          isLoading={false}
          showCpf
          showCep={false}
        />
      ) : null}
    </section>
  )
}
