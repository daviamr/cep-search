import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { DefaultLayout } from "@/components/layout/default-layout/DefaultLayout"
import { Button } from "@/components/ui/button"
import {
  downloadFileCEP,
  getFileCEPById,
} from "@/lib/api/cep"
import { parseSpreadsheetBlob } from "@/lib/utils/parse-spreadsheet"

import { AddressResultsTable } from "../components/address-results-table"
import type { EnrichedCepAddress } from "../types"
import { enrichCepAddresses } from "../utils/enrich-addresses"
import { mapSpreadsheetRowsToCepAddressRecords } from "../utils/map-spreadsheet-to-address-records"

type PageState = "loading" | "ready" | "not_found" | "error"

export function CEPFileViewPage() {
  const { fileId = "" } = useParams<{ fileId: string }>()
  const [pageState, setPageState] = useState<PageState>("loading")
  const [fileName, setFileName] = useState("")
  const [addresses, setAddresses] = useState<EnrichedCepAddress[]>([])
  const [isEnriching, setIsEnriching] = useState(false)

  useEffect(() => {
    if (!fileId) {
      setPageState("not_found")
      return
    }

    async function loadFileResults() {
      setPageState("loading")
      setAddresses([])

      try {
        const file = await getFileCEPById(fileId)

        if (!file) {
          setPageState("not_found")
          return
        }

        setFileName(file.original_name)

        const { blob } = await downloadFileCEP(fileId, file.original_name)
        const rows = await parseSpreadsheetBlob(blob)
        const records = mapSpreadsheetRowsToCepAddressRecords(rows)

        if (records.length === 0) {
          setPageState("ready")
          return
        }

        setIsEnriching(true)
        const enriched = await enrichCepAddresses(records)
        setAddresses(enriched)
        setPageState("ready")
      } catch (error) {
        console.error(error)
        setPageState("error")
      } finally {
        setIsEnriching(false)
      }
    }

    void loadFileResults()
  }, [fileId])

  if (pageState === "loading") {
    return (
      <DefaultLayout className="my-16">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Carregando planilha...
        </div>
      </DefaultLayout>
    )
  }

  if (pageState === "not_found") {
    return (
      <DefaultLayout className="my-16">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Arquivo não encontrado</h1>
          <p className="text-sm text-muted-foreground">
            O arquivo solicitado não existe ou foi removido.
          </p>
          <Button variant="outline" asChild>
            <Link to="/cep">Voltar</Link>
          </Button>
        </div>
      </DefaultLayout>
    )
  }

  if (pageState === "error") {
    return (
      <DefaultLayout className="my-16">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Erro ao carregar planilha</h1>
          <p className="text-sm text-muted-foreground">
            Não foi possível baixar ou processar o arquivo. Tente novamente mais tarde.
          </p>
          <Button variant="outline" asChild>
            <Link to="/cep">Voltar</Link>
          </Button>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout className="my-16">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-bold">Resultados da planilha</h1>
          <p className="text-sm text-muted-foreground">
            Endereços encontrados em{" "}
            <span className="font-medium text-foreground">{fileName}</span>
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/cep">Voltar</Link>
        </Button>
      </div>

      <AddressResultsTable
        addresses={addresses}
        isLoading={isEnriching}
        showCep
        showCpf
      />
    </DefaultLayout>
  )
}
