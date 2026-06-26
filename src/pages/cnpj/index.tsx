import { useState } from "react"

import { DefaultLayout } from "@/components/layout/default-layout/DefaultLayout"

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
    <DefaultLayout className="my-16">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold">Busca por CNPJ</h1>
        <p className="text-sm text-muted-foreground">
          Consulte um CNPJ individualmente ou envie uma planilha com vários CNPJs.
        </p>
      </div>

      <section className="border-t pt-8">
        <h2 className="mb-1 text-[20px] font-bold">Consulta simples</h2>
        <p className="text-sm text-muted-foreground">
          Consulte um CNPJ e visualize os endereços vinculados à empresa.
        </p>
        <SimpleSearchForm />
      </section>

      <section className="mt-10 border-t pt-8">
        <h2 className="mb-1 text-[20px] font-bold">Consulta em massa</h2>
        <p className="text-sm text-muted-foreground">
          Envie uma planilha (.csv ou .xlsx) com vários CNPJs para processamento.
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <BulkSearchForm onUploadSuccess={handleUploadSuccess} />
          </div>
          <BulkFilesTable
            files={files}
            onDownload={handleDownload}
            onRemove={handleRemove}
          />
        </div>
      </section>
    </DefaultLayout>
  )
}
