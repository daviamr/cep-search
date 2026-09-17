import * as React from 'react'
import { AlertTriangle, Loader2, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { HoverCard } from '../hover-card'

export interface ModalRemoveProps {
  id: number | string
  title: string
  onConfirm: (id: number | string) => void | Promise<void>
  isLoading?: boolean
  className?: string
}

export function ModalRemove({ id, title, onConfirm, isLoading, className }: ModalRemoveProps) {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const isPending = isLoading || isSubmitting

  async function handleConfirm() {
    try {
      setIsSubmitting(true)
      await Promise.resolve(onConfirm(id))
      setOpen(false)
    } catch {
      /* empty */
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) return
        setOpen(nextOpen)
      }}
    >
      <HoverCard content="Excluir" side="top" closeDelay={0.5} openDelay={0.5}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(className)}
            aria-label="Excluir"
          >
            <Trash size={16} />
          </Button>
        </DialogTrigger>
      </HoverCard>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 sm:max-w-md"
        onPointerDownOutside={(e) => {
          if (isPending) e.preventDefault()
        }}
        onEscapeKeyDown={(e) => {
          if (isPending) e.preventDefault()
        }}
      >
        <div className="flex gap-4 p-6 pb-4">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20"
            aria-hidden
          >
            <AlertTriangle className="size-5" strokeWidth={2} />
          </div>
          <DialogHeader className="flex-1 gap-2 space-y-0 text-left">
            <DialogTitle className="text-base leading-snug">Excluir {title}?</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              Tem certeza que deseja excluir <span className="font-medium">{title}</span>? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-border/80 bg-muted/30 px-6 py-4 sm:flex-row sm:justify-end sm:gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending} className="sm:min-w-24">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            className="sm:min-w-24 flex items-center gap-1"
            onClick={handleConfirm}
          >
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? 'Excluindo…' : 'Excluir'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
