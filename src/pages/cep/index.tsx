import { useEffect, useState } from "react"

import { DefaultLayout } from "@/components/layout/default-layout/DefaultLayout"
import {
  downloadFileCEP,
  getFilesCEP,
  type CEPBulkFile,
} from "@/lib/api/cep"

import { BulkFilesTable } from "./components/bulk-files-table"
import { BulkSearchForm } from "./components/bulk-search-form"
import { SimpleSearchForm } from "./components/simple-search-form"

function saveBlobAsFile(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export function CEPPage() {
  const [files, setFiles] = useState<CEPBulkFile[]>([])
  const [isLoadingFiles, setIsLoadingFiles] = useState(true)

  async function loadFiles() {
    setIsLoadingFiles(true)
    try {
      const data = await getFilesCEP()
      setFiles(data)
    } finally {
      setIsLoadingFiles(false)
    }
  }

  useEffect(() => {
    void loadFiles()
  }, [])

  async function handleDownload(file: CEPBulkFile) {
    const { blob, fileName } = await downloadFileCEP(file.id, file.original_name)
    saveBlobAsFile(blob, fileName)
  }

  async function handleRemove(id: string) {
    setFiles((current) => current.filter((file) => file.id !== id))
  }

  return (
    <DefaultLayout className="my-16">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold">Busca por CEP</h1>
        <p className="text-sm text-muted-foreground">
          Consulte um CEP individualmente ou envie uma planilha com vários CEPs.
        </p>
      </div>

      <section className="border-t pt-8">
        <h2 className="mb-1 text-[20px] font-bold">Consulta simples</h2>
        <p className="text-sm text-muted-foreground">
          Consulte um CEP e visualize os endereços e CPFs vinculados ao local.
        </p>
        <SimpleSearchForm />
      </section>

      <section className="mt-10 border-t pt-8">
        <h2 className="mb-1 text-[20px] font-bold">Consulta em massa</h2>
        <p className="text-sm text-muted-foreground">
          Envie uma planilha (.csv ou .xlsx) com vários CEPs para processamento.
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <BulkSearchForm onUploadSuccess={loadFiles} />
          </div>
          <BulkFilesTable
            files={files}
            isLoading={isLoadingFiles}
            onDownload={handleDownload}
            onRemove={handleRemove}
          />
        </div>
      </section>
    </DefaultLayout>
  )
}
