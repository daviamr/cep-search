import { useEffect, useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { DefaultLayout } from "@/components/layout/default-layout/DefaultLayout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { downloadFileCEP, getFileCEPById } from "@/lib/api/cep"
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
      <DefaultLayout>
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Carregando planilha...
        </div>
      </DefaultLayout>
    )
  }

  if (pageState === "not_found") {
    return (
      <DefaultLayout>
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Arquivo não encontrado
          </h1>
          <p className="text-sm text-muted-foreground">
            O arquivo solicitado não existe ou foi removido.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/cep">
              <ArrowLeft className="size-4" />
              Voltar para CEP
            </Link>
          </Button>
        </div>
      </DefaultLayout>
    )
  }

  if (pageState === "error") {
    return (
      <DefaultLayout>
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Erro ao carregar resultados
          </h1>
          <p className="text-sm text-muted-foreground">
            Não foi possível baixar ou processar o arquivo. Tente novamente mais
            tarde.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/cep">
              <ArrowLeft className="size-4" />
              Voltar para CEP
            </Link>
          </Button>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/cep">Busca por CEP</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{fileName || "Resultados"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="outline" size="sm" asChild>
          <Link to="/cep">
            <ArrowLeft className="size-4" />
            Voltar para CEP
          </Link>
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Resultados</h1>
        <p className="text-sm text-muted-foreground">
          Endereços encontrados em{" "}
          <span className="font-medium text-foreground">{fileName}</span>
        </p>
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
