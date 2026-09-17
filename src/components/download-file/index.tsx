import { useId, useState, type ReactNode } from 'react'
import { FileDown } from 'lucide-react'

import { HoverCard } from '@/components/hover-card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/utils/format-number.util'
import type { SpreadsheetDownloadFormat } from '@/utils/spreadsheet-download.util'

export type DownloadResultStat = {
  count: number
  singular: string
  plural: string
}

export type DownloadFileProps = {
  /** Elemento que abre o modal (botão, link, etc.) */
  trigger: React.ReactNode
  /** ID do arquivo a ser baixado */
  fileId: string
  /** Nome exibido na confirmação (opcional) */
  fileName?: string
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  disabled?: boolean
  loading?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Chamado ao confirmar o download; recebe o ID do arquivo e o formato escolhido */
  onDownload: (fileId: string, format: SpreadsheetDownloadFormat) => void | Promise<void>
  onSuccess?: (fileId: string) => void
  onError?: (error: unknown) => void
  className?: string
  showFileId?: boolean
  resultStats?: DownloadResultStat[]
  /** Texto exibido no hover do botão de abrir o modal */
  hoverContent?: ReactNode
}

function formatResultStats(stats: DownloadResultStat[]): string {
  return stats
    .map((stat) => {
      const label = stat.count === 1 ? stat.singular : stat.plural
      return `${formatNumber(stat.count)} ${label}`
    })
    .join(' · ')
}

export function DownloadFile({
  trigger,
  fileId,
  fileName,
  title = 'Download de arquivo',
  description,
  confirmLabel = 'Baixar',
  cancelLabel = 'Cancelar',
  disabled = false,
  loading = false,
  open,
  onOpenChange,
  onDownload,
  onSuccess,
  onError,
  className,
  showFileId = true,
  resultStats,
  hoverContent,
}: DownloadFileProps) {
  const errorId = useId()
  const formatGroupId = useId()

  const [internalOpen, setInternalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [format, setFormat] = useState<SpreadsheetDownloadFormat>('xlsx')

  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const isBusy = loading || isDownloading

  const setDialogOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value)
    }

    onOpenChange?.(value)

    if (value) {
      setFormat('xlsx')
    } else {
      setError(null)
    }
  }

  const resolvedDescription =
    description ??
    (fileName ? `Deseja baixar o arquivo "${fileName}"?` : 'Deseja baixar este arquivo?')

  const handleConfirm = async () => {
    if (!fileId || isBusy) return

    setIsDownloading(true)
    setError(null)

    try {
      await onDownload(fileId, format)
      onSuccess?.(fileId)
      setDialogOpen(false)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Não foi possível baixar o arquivo. Tente novamente.'

      setError(message)
      onError?.(err)
    } finally {
      setIsDownloading(false)
    }
  }

  const dialogTrigger = (
    <DialogTrigger asChild disabled={disabled || !fileId}>
      {trigger}
    </DialogTrigger>
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {hoverContent ? (
        <HoverCard content={hoverContent} side="top" closeDelay={0.5} openDelay={0.5}>
          {dialogTrigger}
        </HoverCard>
      ) : (
        dialogTrigger
      )}

      <DialogContent className={cn('sm:max-w-md', className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>

        {fileName || showFileId || resultStats?.length ? (
          <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
            <FileDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate font-medium">{fileName ?? 'Arquivo selecionado'}</p>
              {resultStats?.length ? (
                <p className="truncate text-xs text-muted-foreground tabular-nums">
                  {formatResultStats(resultStats)}
                </p>
              ) : null}
              {showFileId ? (
                <p className="truncate text-xs text-muted-foreground">ID: {fileId}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor={formatGroupId}>Formato do arquivo</Label>
          <RadioGroup
            id={formatGroupId}
            value={format}
            onValueChange={(value) => setFormat(value as SpreadsheetDownloadFormat)}
            className="grid grid-cols-2 gap-2"
            disabled={isBusy}
          >
            <Label
              htmlFor={`${formatGroupId}-xlsx`}
              className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 font-normal has-data-checked:border-primary"
            >
              <RadioGroupItem id={`${formatGroupId}-xlsx`} value="xlsx" />
              XLSX
            </Label>
            <Label
              htmlFor={`${formatGroupId}-csv`}
              className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 font-normal has-data-checked:border-primary"
            >
              <RadioGroupItem id={`${formatGroupId}-csv`} value="csv" />
              CSV
            </Label>
          </RadioGroup>
        </div>

        {error ? (
          <p id={errorId} role="alert" className="text-xs text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={() => setDialogOpen(false)}
          >
            {cancelLabel}
          </Button>
          <Button type="button" disabled={!fileId || disabled || isBusy} onClick={handleConfirm}>
            {isDownloading ? 'Baixando...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
