import { useState } from "react"
import { Building2, CheckCircle } from "lucide-react"

import { DefaultLayout } from "@/components/layout/default-layout/DefaultLayout"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { Separator } from "@/components/ui/separator"

import { BulkFilesTable } from "./components/bulk-files-table"
import { BulkSearchForm } from "./components/bulk-search-form"
import { SimpleSearchForm } from "./components/simple-search-form"
import { cnpjBulkFilesMock } from "./mock-data"
import type { CnpjBulkFile } from "./types"

export function CNPJPage() {
  const [files, setFiles] = useState<CnpjBulkFile[]>(cnpjBulkFilesMock)

  async function handleDownload(file: CnpjBulkFile) {
    console.log("Baixar arquivo:", file.id, file.fileName)
  }

  async function handleRemove(id: string) {
    setFiles((current) => current.filter((file) => file.id !== id))
  }

  function handleUploadSuccess(file: CnpjBulkFile) {
    setFiles((current) => [file, ...current])
  }

  return (
    <DefaultLayout>
      <PageBreadcrumb
        items={[
          { label: "Checker", icon: CheckCircle },
          { label: "Buscar por CNPJ", icon: Building2 },
        ]}
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Busca por CNPJ</h1>
        <p className="text-sm text-muted-foreground">
          Consulte um CNPJ individualmente ou envie uma planilha com vários
          CNPJs.
        </p>
      </div>

      <SimpleSearchForm />

      <Separator />

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            Consulta em massa
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Envie uma planilha (.csv ou .xlsx) com vários CNPJs para
            processamento.
          </p>
        </div>

        <div className="flex justify-end">
          <BulkSearchForm onUploadSuccess={handleUploadSuccess} />
        </div>

        <BulkFilesTable
          files={files}
          onDownload={handleDownload}
          onRemove={handleRemove}
        />
      </section>
    </DefaultLayout>
  )
}
