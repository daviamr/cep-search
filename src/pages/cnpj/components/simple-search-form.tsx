import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Search, X } from "lucide-react"

import { HoverCard } from "@/components/hover-card"
import { QueryEmptyState } from "@/components/query-empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { simpleSearchCNPJ } from "@/lib/api/cnpj"

import {
  simpleSearchSchema,
  type SimpleSearchInput,
  type SimpleSearchValues,
} from "../schemas"

export function SimpleSearchForm() {
  const [result, setResult] = useState<unknown>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SimpleSearchInput, unknown, SimpleSearchValues>({
    resolver: zodResolver(simpleSearchSchema),
    defaultValues: { cnpj: "" },
  })

  const cnpjValue = watch("cnpj")
  const canClear = Boolean(cnpjValue?.trim()) || hasSearched || result !== null

  async function onSubmit({ cnpj }: SimpleSearchValues) {
    setSearchError(null)
    setResult(null)

    const data = await simpleSearchCNPJ(cnpj)

    if (!data) {
      setSearchError("Nenhum resultado encontrado para este CNPJ.")
      setHasSearched(true)
      return
    }

    setResult(data)
    setHasSearched(true)
  }

  function handleClear() {
    reset({ cnpj: "" })
    setResult(null)
    setSearchError(null)
    setHasSearched(false)
  }

  const showInitialState = !hasSearched && !isSubmitting
  const showEmptyResults = hasSearched && !isSubmitting && result === null

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Consulta simples</h2>
        <p className="text-sm text-muted-foreground">
          Consulte um CNPJ e visualize os endereços vinculados à empresa.
        </p>
      </div>

      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            type="text"
            inputMode="numeric"
            placeholder="00.000.000/0000-00"
            aria-invalid={Boolean(errors.cnpj)}
            disabled={isSubmitting}
            className="h-8 w-45 lg:w-55"
            {...register("cnpj")}
          />
          {errors.cnpj && (
            <p className="text-sm text-destructive">{errors.cnpj.message}</p>
          )}
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !cnpjValue?.trim()}
        >
          {isSubmitting ? (
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
              disabled={isSubmitting}
              aria-label="Limpar filtros"
              onClick={handleClear}
            >
              <X className="size-4" />
            </Button>
          </HoverCard>
        ) : null}
      </form>

      {isSubmitting ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Consultando...
        </div>
      ) : null}

      {showInitialState ? (
        <QueryEmptyState
          variant="initial"
          title="Nenhuma consulta realizada"
          description="Informe o CNPJ e clique em Consultar para visualizar os resultados."
        />
      ) : null}

      {showEmptyResults ? (
        <QueryEmptyState
          variant="empty"
          title="Nenhum resultado encontrado"
          description={
            searchError ?? "Nenhum resultado encontrado para este CNPJ."
          }
        />
      ) : null}

      {!isSubmitting && result !== null ? (
        <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </section>
  )
}
