import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Search } from "lucide-react"

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
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SimpleSearchInput, unknown, SimpleSearchValues>({
    resolver: zodResolver(simpleSearchSchema),
    defaultValues: { cpf: "" },
  })

  async function onSubmit({ cpf }: SimpleSearchValues) {
    setSearchError(null)
    setAddresses([])
    setIsLoadingAddresses(true)

    try {
      const data = await simpleSearchCPF(cpf)

      if (!data || !Array.isArray(data) || data.length === 0) {
        setSearchError("Nenhum resultado encontrado para este CPF.")
        return
      }

      const enriched = await enrichCpfAddresses(data)
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
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            aria-invalid={Boolean(errors.cpf)}
            {...register("cpf")}
          />
          {errors.cpf && (
            <p className="text-sm text-destructive">{errors.cpf.message}</p>
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
        />
      )}
    </div>
  )
}
