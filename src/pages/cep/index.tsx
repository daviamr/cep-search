import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { DefaultLayout } from "@/components/layout/default-layout/DefaultLayout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
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
    <DefaultLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Busca por CEP</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Busca por CEP</h1>
        <p className="text-sm text-muted-foreground">
          Consulte um CEP individualmente ou envie uma planilha com vários CEPs.
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
            Envie uma planilha (.csv ou .xlsx) com vários CEPs para processamento.
          </p>
        </div>

        <div className="flex justify-end">
          <BulkSearchForm onUploadSuccess={loadFiles} />
        </div>

        <BulkFilesTable
          files={files}
          isLoading={isLoadingFiles}
          onDownload={handleDownload}
          onRemove={handleRemove}
        />
      </section>
    </DefaultLayout>
  )
}
