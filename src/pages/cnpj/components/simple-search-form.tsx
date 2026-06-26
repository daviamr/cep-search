import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Search } from "lucide-react"

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SimpleSearchInput, unknown, SimpleSearchValues>({
    resolver: zodResolver(simpleSearchSchema),
    defaultValues: { cnpj: "" },
  })

  async function onSubmit({ cnpj }: SimpleSearchValues) {
    setSearchError(null)
    setResult(null)

    const data = await simpleSearchCNPJ(cnpj)

    if (!data) {
      setSearchError("Nenhum resultado encontrado para este CNPJ.")
      return
    }

    setResult(data)
  }

  return (
    <div className="mt-6 space-y-4">
      <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            type="text"
            inputMode="numeric"
            placeholder="00.000.000/0000-00"
            aria-invalid={Boolean(errors.cnpj)}
            {...register("cnpj")}
          />
          {errors.cnpj && (
            <p className="text-sm text-destructive">{errors.cnpj.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-fit">
          {isSubmitting ? (
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

      {result !== null && (
        <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
