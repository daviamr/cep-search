import { useState } from "react"
import { Download, Eye, Loader2, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

import { HoverCard } from "@/components/hover-card"
import { QueryEmptyState } from "@/components/query-empty-state"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateAndHours, formatNumber, formatSizeMb } from "@/lib/format"

import type { CnpjBulkFile } from "../types"

type BulkFilesTableProps = {
  files: CnpjBulkFile[]
  onDownload: (file: CnpjBulkFile) => void | Promise<void>
  onRemove: (id: string) => void | Promise<void>
}

export function BulkFilesTable({
  files,
  onDownload,
  onRemove,
}: BulkFilesTableProps) {
  const [fileToDelete, setFileToDelete] = useState<CnpjBulkFile | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function handleDownload(file: CnpjBulkFile) {
    setDownloadingId(file.id)
    try {
      await onDownload(file)
    } finally {
      setDownloadingId(null)
    }
  }

  async function handleRemove() {
    if (!fileToDelete) return

    setRemovingId(fileToDelete.id)
    try {
      await onRemove(fileToDelete.id)
      setFileToDelete(null)
    } finally {
      setRemovingId(null)
    }
  }

  if (files.length === 0) {
    return (
      <QueryEmptyState
        variant="initial"
        title="Nenhuma consulta realizada"
        description="Envie uma planilha com CNPJs para começar o processamento em massa."
      />
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Arquivo</TableHead>
              <TableHead>MB</TableHead>
              <TableHead>Consultas</TableHead>
              <TableHead>Endereços</TableHead>
              <TableHead>Válidos</TableHead>
              <TableHead>Inválidos</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead className="sr-only text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="max-w-[240px] truncate font-medium">
                  {file.fileName}
                </TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {formatSizeMb(file.sizeMb)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatNumber(file.consultas)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatNumber(file.enderecos)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatNumber(file.validos)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatNumber(file.invalidos)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDateAndHours(file.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <HoverCard content="Baixar" side="top" closeDelay={0.5} openDelay={0.5}>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Baixar arquivo ${file.fileName}`}
                        disabled={downloadingId === file.id}
                        onClick={() => handleDownload(file)}
                      >
                        {downloadingId === file.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Download className="size-4" />
                        )}
                      </Button>
                    </HoverCard>

                    <HoverCard content="Visualizar" side="top" closeDelay={0.5} openDelay={0.5}>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Visualizar resultados de ${file.fileName}`}
                        asChild
                      >
                        <Link to={`/cnpj/${file.id}`}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                    </HoverCard>

                    <HoverCard content="Excluir" side="top" closeDelay={0.5} openDelay={0.5}>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Excluir arquivo ${file.fileName}`}
                        onClick={() => setFileToDelete(file)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </HoverCard>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={fileToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setFileToDelete(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir planilha</DialogTitle>
            <DialogDescription>
              Deseja excluir &quot;{fileToDelete?.fileName}&quot;? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={removingId !== null}
              onClick={() => setFileToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={removingId !== null}
              onClick={handleRemove}
            >
              {removingId !== null ? (
                <>
                  <Loader2 className="animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
