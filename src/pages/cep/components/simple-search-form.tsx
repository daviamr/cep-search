import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Search } from "lucide-react"

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
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SimpleSearchInput, unknown, SimpleSearchValues>({
    resolver: zodResolver(simpleSearchSchema),
    defaultValues: { cep: "" },
  })

  async function onSubmit({ cep }: SimpleSearchValues) {
    setSearchError(null)
    setAddresses([])
    setIsLoadingAddresses(true)

    try {
      const data = await simpleSearchCEP(cep)

      if (!data || !Array.isArray(data) || data.length === 0) {
        setSearchError("Nenhum resultado encontrado para este CEP.")
        return
      }

      const enriched = await enrichCepAddresses(data)
      setAddresses(enriched)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const showResults = isLoadingAddresses || addresses.length > 0

  return (
    <div className="mt-6 space-y-4">
      <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            aria-invalid={Boolean(errors.cep)}
            {...register("cep")}
          />
          {errors.cep && (
            <p className="text-sm text-destructive">{errors.cep.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting || isLoadingAddresses} className="w-fit">
          {isSubmitting || isLoadingAddresses ? (
            <>
              <Loader2 className="animate-spin" />
              Consultando...
            </>
          ) : (
            <>
              <Search />
              Consultar
            </>
          )}
        </Button>
      </form>

      {searchError && <p className="text-sm text-destructive">{searchError}</p>}

      {showResults && (
        <AddressResultsTable
          addresses={addresses}
          isLoading={isLoadingAddresses}
          showCpf
          showCep={false}
        />
      )}
    </div>
  )
}
