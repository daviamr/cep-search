import { useState } from "react"
import { toast } from "sonner"

import { SimpleQuery } from "@/components/simple-query"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { simpleSearchCEP } from "@/lib/api/cep"

import { addressSimpleQueryColumns } from "@/pages/address-search/address-columns"
import { downloadAddresses } from "@/pages/address-search/download-addresses.util"
import { enrichCepAddresses } from "../utils/enrich-addresses"

function stripNonDigits(value: string) {
  return value.replace(/\D/g, "")
}

export function CepSimpleQuery() {
  const [numero, setNumero] = useState("")
  const [complemento, setComplemento] = useState("")

  return (
    <SimpleQuery
      documentLabel="CEP"
      documentPlaceholder="00000-000"
      description="Informe um CEP para visualizar os endereços e CPFs vinculados ao local."
      columns={addressSimpleQueryColumns}
      emptyMessage="Nenhum endereço encontrado para este CEP."
      exportFileName="consulta-cep"
      onClear={() => {
        setNumero("")
        setComplemento("")
      }}
      extraFields={({ isSearching }) => (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="simple-query-numero">Número</Label>
            <Input
              id="simple-query-numero"
              placeholder="Ex.: 123"
              value={numero}
              onChange={(event) => setNumero(event.target.value)}
              disabled={isSearching}
              className="h-8 w-28"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="simple-query-complemento">Complemento</Label>
            <Input
              id="simple-query-complemento"
              placeholder="Ex.: Apto 101"
              value={complemento}
              onChange={(event) => setComplemento(event.target.value)}
              disabled={isSearching}
              className="h-8 w-40"
            />
          </div>
        </>
      )}
      onExport={(results, format, document) => {
        const digits = stripNonDigits(document)
        downloadAddresses(results, `consulta-cep-${digits || "resultados"}`, format)
      }}
      onSearch={async (document) => {
        const digits = stripNonDigits(document)

        if (digits.length !== 8) {
          toast.error("Informe um CEP válido com 8 dígitos.")
          return null
        }

        try {
          const results = await simpleSearchCEP(digits, { numero, complemento })

          if (!results?.length) {
            toast.error("Nenhum resultado encontrado para este CEP.")
            return null
          }

          return enrichCepAddresses(results)
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Não foi possível consultar o CEP."
          )
          return null
        }
      }}
    />
  )
}
