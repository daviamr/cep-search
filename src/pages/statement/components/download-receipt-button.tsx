import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { HoverCard } from '@/components/hover-card'
import { ModalConfirmed } from '@/components/modal-confirmed'
import { Button } from '@/components/ui/button'

import type { StatementRecord } from '../types'
import { downloadStatementReceipt } from '../utils/download-statement-receipt'

type DownloadReceiptButtonProps = {
  record: StatementRecord
}

export function DownloadReceiptButton({ record }: DownloadReceiptButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  async function handleDownload() {
    if (isDownloading) return

    setIsDownloading(true)

    try {
      downloadStatementReceipt(record)
      toast.success('Comprovante baixado com sucesso.')
    } catch {
      toast.error('Não foi possível gerar o comprovante.')
      throw new Error('download-failed')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <HoverCard content="Baixar comprovante" side="top" closeDelay={0.5} openDelay={0.5}>
      <span className="inline-flex">
        <ModalConfirmed
          title="Baixar comprovante?"
          subtitle={`Deseja baixar o comprovante de "${record.description}"?`}
          confirmText="Baixar comprovante"
          isLoading={isDownloading}
          action={handleDownload}
        >
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={isDownloading}
            aria-label={`Baixar comprovante de ${record.description}`}
          >
            {isDownloading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="size-4" aria-hidden="true" />
            )}
          </Button>
        </ModalConfirmed>
      </span>
    </HoverCard>
  )
}
