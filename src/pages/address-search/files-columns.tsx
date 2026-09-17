import { Download, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import type { ColumnDef } from "@tanstack/react-table"

import { DownloadFile } from "@/components/download-file"
import { getCheckboxColumn } from "@/components/data-table/checkbox-column"
import { DataTableColumnHeader } from "@/components/data-table/column-header"
import { HoverCard } from "@/components/hover-card"
import { ModalRemove } from "@/components/modal-remove"
import { Button } from "@/components/ui/button"
import { formatDateAndHours } from "@/utils/date-and-hours.util"
import {
  canAccessProcessamentoResults,
  formatProcessamentoStatus,
  isProcessamentoPending,
} from "@/utils/format-processamento-status.util"
import { formatNumber } from "@/utils/format-number.util"
import { formatSizeMb } from "@/utils/format-size-mb.util"
import type { SpreadsheetDownloadFormat } from "@/utils/spreadsheet-download.util"

import type { AddressFile } from "./types"

type AddressFilesColumnsOptions = {
  viewBasePath: string
  onDownload: (
    fileId: string,
    fileName: string,
    format?: SpreadsheetDownloadFormat
  ) => void | Promise<void>
  onRemove: (id: string | number) => void | Promise<void>
  downloadingFileId?: string | null
  removingFileId?: string | null
}

export function getAddressFilesColumns({
  viewBasePath,
  onDownload,
  onRemove,
  downloadingFileId,
  removingFileId,
}: AddressFilesColumnsOptions): ColumnDef<AddressFile>[] {
  return [
    getCheckboxColumn<AddressFile>(),
    {
      accessorKey: "fileName",
      meta: { label: "Arquivo" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Arquivo" />,
      filterFn: "includesString",
      cell: ({ row }) => (
        <HoverCard content={row.original.fileName} side="top" align="start">
          <span className="block max-w-20 truncate font-medium">{row.original.fileName}</span>
        </HoverCard>
      ),
    },
    {
      accessorKey: "status",
      meta: { label: "Status" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const file = row.original
        const label = formatProcessamentoStatus(file.status)

        if (isProcessamentoPending(file.status)) {
          return (
            <span>
              {label}
              {file.progress > 0 ? ` · ${file.progress}%` : ""}
            </span>
          )
        }

        if (file.status === "erro" && file.errorText) {
          return (
            <HoverCard content={file.errorText} side="top" contentClassName="max-w-sm">
              <span className="cursor-help underline decoration-dotted underline-offset-2">
                {label}
              </span>
            </HoverCard>
          )
        }

        return <span>{label}</span>
      },
    },
    {
      accessorKey: "sizeMb",
      meta: { label: "MB" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="MB" />,
      cell: ({ row }) => (
        <span className="tabular-nums">{formatSizeMb(row.getValue<number>("sizeMb"))}</span>
      ),
    },
    {
      accessorKey: "registros",
      meta: { label: "Registros" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Registros" />,
      cell: ({ row }) => (
        <span className="tabular-nums">{formatNumber(row.getValue<number>("registros"))}</span>
      ),
    },
    {
      accessorKey: "resultados",
      meta: { label: "Resultados" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Resultados" />,
      cell: ({ row }) => (
        <span className="tabular-nums">{formatNumber(row.getValue<number>("resultados"))}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      meta: { label: "Data/Hora" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Data/Hora" />,
      cell: ({ row }) => formatDateAndHours(row.getValue<Date>("createdAt")),
    },
    {
      id: "actions",
      meta: { variant: "actions", label: "Ações" },
      enableHiding: false,
      header: () => <span className="sr-only">Ações</span>,
      cell: ({ row }) => {
        const file = row.original
        const canAccessResults = canAccessProcessamentoResults(file.status)

        return (
          <div className="flex items-center gap-1">
            <DownloadFile
              fileId={file.id}
              fileName={file.fileName}
              disabled={!canAccessResults}
              loading={downloadingFileId === file.id}
              hoverContent={
                canAccessResults ? "Baixar arquivo" : "Arquivo indisponível para download"
              }
              title="Baixar arquivo"
              description={`Deseja baixar o arquivo de resultados de "${file.fileName}"?`}
              confirmLabel="Baixar arquivo"
              resultStats={[
                {
                  count: file.resultados,
                  singular: "resultado",
                  plural: "resultados",
                },
              ]}
              trigger={
                <Button
                  type="button"
                  size="icon-sm"
                  disabled={!canAccessResults}
                  aria-label={`Baixar arquivo ${file.fileName}`}
                >
                  <Download className="size-4" />
                </Button>
              }
              onDownload={async (fileId, format) => {
                await onDownload(fileId, file.fileName, format)
              }}
            />

            <HoverCard
              content={canAccessResults ? "Visualizar" : "Arquivo indisponível para visualização"}
              side="top"
              closeDelay={0.5}
              openDelay={0.5}
            >
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={!canAccessResults}
                aria-label={`Visualizar resultados de ${file.fileName}`}
                asChild={canAccessResults}
              >
                {canAccessResults ? (
                  <Link to={`${viewBasePath}/${file.id}`}>
                    <Eye className="size-4" />
                  </Link>
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </HoverCard>

            <ModalRemove
              id={file.id}
              title={file.fileName}
              isLoading={removingFileId === file.id}
              onConfirm={onRemove}
            />
          </div>
        )
      },
    },
  ]
}
