import { useCallback, useMemo, useRef, useState } from "react"
import { FileSpreadsheet, Upload } from "lucide-react"
import { toast } from "sonner"

import {
  DataTable,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
} from "@/components/data-table"
import { UploadFiles } from "@/components/upload-files"
import { Button } from "@/components/ui/button"
import {
  COMPLEMENTO_COLUMN_CANDIDATES,
  detectColumn,
  detectDocumentColumn,
  NUMERO_COLUMN_CANDIDATES,
  readFileHeaders,
} from "@/utils/file-headers.util"
import type { SpreadsheetDownloadFormat } from "@/utils/spreadsheet-download.util"

import type { AddressEnrichmentColumnMapping } from "./constants"
import { getAddressFilesColumns } from "./files-columns"
import { AddressFilesFilters } from "./files-filters"
import type { AddressFile } from "./types"

type MassSearchSectionProps = {
  documentType: "CPF" | "CEP"
  viewBasePath: string
  files: AddressFile[]
  isLoadingFiles: boolean
  isErrorFiles?: boolean
  isUploadingFile: boolean
  downloadingFileId?: string | null
  removingFileId?: string | null
  exampleFileName: string
  exampleHeader: string
  exampleRows: string[]
  uploadTitle: string
  uploadDescription: string
  emptyDescription: string
  onUpload: (file: File, mapping: AddressEnrichmentColumnMapping) => Promise<unknown>
  onDownload: (
    fileId: string,
    fileName: string,
    format?: SpreadsheetDownloadFormat
  ) => Promise<void>
  onRemove: (id: string | number) => Promise<void>
}

function downloadExampleSpreadsheet(
  fileName: string,
  header: string,
  rows: string[]
) {
  const content = [header, ...rows].join("\n")
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = fileName
  link.rel = "noopener"
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function unusedColumnOptions(options: string[], used: Array<string | null>) {
  const usedValues = new Set(used.filter((value): value is string => Boolean(value)))
  return options.filter((option) => !usedValues.has(option))
}

export function MassSearchSection({
  documentType,
  viewBasePath,
  files,
  isLoadingFiles,
  isErrorFiles = false,
  isUploadingFile,
  downloadingFileId,
  removingFileId,
  exampleFileName,
  exampleHeader,
  exampleRows,
  uploadTitle,
  uploadDescription,
  emptyDescription,
  onUpload,
  onDownload,
  onRemove,
}: MassSearchSectionProps) {
  const [columnOptions, setColumnOptions] = useState<Array<string>>([])
  const [documentColumn, setDocumentColumn] = useState<string | null>(null)
  const [numeroColumn, setNumeroColumn] = useState<string | null>(null)
  const [complementoColumn, setComplementoColumn] = useState<string | null>(null)
  const headerReadRequestRef = useRef(0)
  const isCepMass = documentType === "CEP"

  const handleFileChange = useCallback(
    async (file: File | null) => {
      const requestId = ++headerReadRequestRef.current

      setColumnOptions([])
      setDocumentColumn(null)
      setNumeroColumn(null)
      setComplementoColumn(null)

      if (!file) {
        return
      }

      try {
        const headers = await readFileHeaders(file)

        if (requestId !== headerReadRequestRef.current) {
          return
        }

        const options = Array.from(new Set(headers))
        const detectedDocument = detectDocumentColumn(options, documentType)

        setColumnOptions(options)
        setDocumentColumn(detectedDocument)

        if (documentType !== "CEP") {
          return
        }

        const detectedNumero = detectColumn(
          options,
          NUMERO_COLUMN_CANDIDATES,
          detectedDocument ? [detectedDocument] : []
        )
        const detectedComplemento = detectedNumero
          ? detectColumn(options, COMPLEMENTO_COLUMN_CANDIDATES, [
              ...(detectedDocument ? [detectedDocument] : []),
              detectedNumero,
            ])
          : null

        setNumeroColumn(detectedNumero)
        setComplementoColumn(detectedComplemento)
      } catch {
        if (requestId !== headerReadRequestRef.current) {
          return
        }

        setColumnOptions([])
        setDocumentColumn(null)
        setNumeroColumn(null)
        setComplementoColumn(null)
        toast.error("Não foi possível ler os cabeçalhos do arquivo.")
      }
    },
    [documentType]
  )

  const columns = useMemo(
    () =>
      getAddressFilesColumns({
        viewBasePath,
        onDownload,
        onRemove,
        downloadingFileId,
        removingFileId,
      }),
    [downloadingFileId, onDownload, onRemove, removingFileId, viewBasePath]
  )

  return (
    <section className="space-y-4">
      <div className="max-w-1/2 space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Consulta em massa
        </h2>
        <p className="text-sm text-muted-foreground">
          Após a consulta, faça o download dos arquivos que deseja salvar. Eles permanecerão
          disponíveis para download na plataforma por 7 dias após o processamento do arquivo.
        </p>
      </div>

      <DataTableProvider
        columns={columns}
        data={files}
        options={{
          pagination: { pageSize: 10 },
          sorting: true,
          filtering: true,
          columnVisibility: true,
          rowSelection: true,
        }}
      >
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <AddressFilesFilters />

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadExampleSpreadsheet(
                    exampleFileName,
                    exampleHeader,
                    exampleRows
                  )
                }
              >
                <FileSpreadsheet className="size-4" />
                Exemplo de planilha
              </Button>
              <UploadFiles
                loading={isUploadingFile}
                trigger={
                  <Button variant="default" size="sm">
                    <Upload className="size-4" />
                    Novo arquivo
                  </Button>
                }
                title={uploadTitle}
                description={uploadDescription}
                submitLabel="Enviar consulta"
                accept=".csv,.xlsx"
                onFileChange={handleFileChange}
                columnSelect={{
                  label: `Coluna do ${documentType}`,
                  placeholder: `Selecione a coluna do ${documentType}`,
                  description: isCepMass
                    ? "Obrigatória. Escolha a coluna da planilha que contém os CEPs."
                    : "Escolha a coluna da planilha que contém os documentos da consulta.",
                  options: unusedColumnOptions(columnOptions, [
                    numeroColumn,
                    complementoColumn,
                  ]),
                  value: documentColumn,
                  onChange: (value) => {
                    setDocumentColumn(value)

                    if (value && value === numeroColumn) {
                      setNumeroColumn(null)
                      setComplementoColumn(null)
                    }

                    if (value && value === complementoColumn) {
                      setComplementoColumn(null)
                    }
                  },
                }}
                extraColumnSelects={
                  isCepMass
                    ? [
                        {
                          label: "Coluna do número",
                          placeholder: "Selecione a coluna do número",
                          description:
                            "Opcional. Use se o arquivo tiver CEP + número.",
                          options: unusedColumnOptions(columnOptions, [
                            documentColumn,
                            complementoColumn,
                          ]),
                          value: numeroColumn,
                          required: false,
                          emptyOptionLabel: "Não usar",
                          onChange: (value) => {
                            setNumeroColumn(value)

                            if (!value) {
                              setComplementoColumn(null)
                            }

                            if (value && value === complementoColumn) {
                              setComplementoColumn(null)
                            }
                          },
                        },
                        {
                          label: "Coluna do complemento",
                          placeholder: "Selecione a coluna do complemento",
                          description:
                            "Opcional. Use se o arquivo tiver CEP + número + complemento.",
                          options: unusedColumnOptions(columnOptions, [
                            documentColumn,
                            numeroColumn,
                          ]),
                          value: complementoColumn,
                          required: false,
                          emptyOptionLabel: "Não usar",
                          disabled: !numeroColumn,
                          onChange: setComplementoColumn,
                        },
                      ]
                    : []
                }
                onSubmit={async (file) => {
                  if (!documentColumn) {
                    toast.error(`Selecione a coluna do ${documentType}.`)
                    return
                  }

                  await onUpload(file, {
                    document: documentColumn,
                    numero: isCepMass ? numeroColumn : null,
                    complemento: isCepMass && numeroColumn ? complementoColumn : null,
                  })
                }}
              />
              <DataTableToolbar showSearch={false} />
            </div>
          </div>

          <DataTable
            isLoading={isLoadingFiles}
            emptyMessage={
              isErrorFiles
                ? "Não foi possível carregar os arquivos."
                : "Nenhuma consulta realizada"
            }
            emptyDescription={isErrorFiles ? undefined : emptyDescription}
          />
          <DataTablePagination />
        </div>
      </DataTableProvider>
    </section>
  )
}
