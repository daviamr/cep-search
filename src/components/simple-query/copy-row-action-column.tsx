import { Copy } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { HoverCard } from '@/components/hover-card'
import { Button } from '@/components/ui/button'

type CopyRowActionColumnOptions<TData> = {
  formatRow: (row: TData) => string
  getAriaLabel: (row: TData) => string
}

export function createCopyRowActionColumn<TData>({
  formatRow,
  getAriaLabel,
}: CopyRowActionColumnOptions<TData>): ColumnDef<TData> {
  return {
    id: 'actions',
    meta: { variant: 'actions', label: 'Ações' },
    enableHiding: false,
    header: () => <span className="sr-only">Ações</span>,
    cell: ({ row }) => {
      const data = row.original

      async function handleCopy() {
        try {
          await navigator.clipboard.writeText(formatRow(data))
          toast.success('Linha copiada para a área de transferência.')
        } catch {
          toast.error('Não foi possível copiar a linha.')
        }
      }

      return (
        <div className="flex items-center gap-1">
          <HoverCard content="Copiar linha" side="top" closeDelay={0.5} openDelay={0.5}>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={getAriaLabel(data)}
              onClick={() => {
                void handleCopy()
              }}
            >
              <Copy className="size-4" />
            </Button>
          </HoverCard>
        </div>
      )
    },
  }
}
