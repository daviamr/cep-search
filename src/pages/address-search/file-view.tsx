import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import {
  DataTable,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
} from "@/components/data-table"
import { EmptyStateCard } from "@/components/empty-state-card"
import {
  ResultsDownloadAllButton,
  ResultsDownloadButton,
} from "@/components/results-download-button"
import { PageBreadcrumb, type PageBreadcrumbItem } from "@/components/page-breadcrumb"
import { Button } from "@/components/ui/button"
import type { SpreadsheetDownloadFormat } from "@/utils/spreadsheet-download.util"

import { addressResultsColumns, cepResultsColumns } from "./address-columns"
import type { AddressSearchType } from "./constants"
import { downloadAddresses } from "./download-addresses.util"
import { AddressResultsFilters } from "./results-filters"
import {
  ADDRESS_RESULTS_VIEW_PAGE_SIZES,
  type EnrichedAddress,
} from "./types"

type AddressFileViewProps = {
  backPath: string
  backLabel: string
  breadcrumbItems: PageBreadcrumbItem[]
  fileName: string
  fileId: string
  documentType?: AddressSearchType
  results: EnrichedAddress[]
  isLoading: boolean
  isError: boolean
  notFound: boolean
  onDownloadAll: (format: SpreadsheetDownloadFormat) => Promise<void>
}

export function AddressFileView({
  backPath,
  backLabel,
  breadcrumbItems,
  fileName,
  fileId,
  documentType = "cpf",
  results,
  isLoading,
  isError,
  notFound,
  onDownloadAll,
}: AddressFileViewProps) {
  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <EmptyStateCard isLoading />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Erro ao carregar resultados
          </h1>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os resultados deste arquivo. Tente novamente mais
            tarde.
          </p>
          <Button variant="outline" asChild>
            <Link to={backPath}>Voltar para {backLabel}</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">Arquivo não encontrado</h1>
          <p className="text-sm text-muted-foreground">
            O arquivo solicitado não existe ou foi removido.
          </p>
          <Button variant="outline" asChild>
            <Link to={backPath}>Voltar para {backLabel}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <PageBreadcrumb items={breadcrumbItems} />

        <Button variant="outline" size="sm" asChild>
          <Link to={backPath}>
            <ArrowLeft className="size-4" />
            Voltar para {backLabel}
          </Link>
        </Button>
      </div>

      <DataTableProvider
        columns={documentType === "cep" ? cepResultsColumns : addressResultsColumns}
        data={results}
        options={{
          pagination: { pageSize: 50 },
          sorting: true,
          filtering: true,
          columnVisibility: true,
          rowSelection: true,
        }}
      >
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <AddressResultsFilters documentType={documentType} />
            <DataTableToolbar showSearch={false}>
              <div className="flex items-center gap-2">
                <ResultsDownloadAllButton
                  fileId={fileId}
                  fileName={fileName}
                  resultCount={results.length}
                  onDownload={async (_id, format) => {
                    await onDownloadAll(format)
                  }}
                />
                <ResultsDownloadButton
                  fileId={fileId}
                  fileName={fileName}
                  onDownload={async (_id, format, selectedRowIds) => {
                    if (!selectedRowIds?.length) return

                    const selectedResults = results.filter((result) =>
                      selectedRowIds.includes(result.id)
                    )

                    downloadAddresses(
                      selectedResults,
                      `selecionados-${fileName}`,
                      format,
                      documentType
                    )
                    toast.success("Arquivo baixado com sucesso.")
                  }}
                />
              </div>
            </DataTableToolbar>
          </div>

          <DataTable
            emptyMessage="Nenhum endereço encontrado para este arquivo."
            emptyDescription="Este arquivo não retornou endereços para exibir."
          />
          <DataTablePagination pageSizes={[...ADDRESS_RESULTS_VIEW_PAGE_SIZES]} />
        </div>
      </DataTableProvider>
    </div>
  )
}
