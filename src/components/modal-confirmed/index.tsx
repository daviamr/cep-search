'use client'

import * as React from 'react'
import { CircleAlert, Loader2 } from 'lucide-react'

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

export interface ModalConfirmedProps {
  children: React.ReactNode
  action: () => void | Promise<void>
  isLoading?: boolean
  title: string
  subtitle: string
  confirmText?: string
}

export function ModalConfirmed({
  children,
  action,
  title,
  subtitle,
  isLoading,
  confirmText = 'Confirmar',
}: ModalConfirmedProps) {
  const [open, setOpen] = React.useState(false)

  async function handleConfirm() {
    try {
      await Promise.resolve(action())
      setOpen(false)
    } catch {
      /* empty */
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 sm:max-w-md"
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <div className="flex gap-4 p-6 pb-4">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20"
            aria-hidden
          >
            <CircleAlert className="size-5" strokeWidth={2} />
          </div>
          <DialogHeader className="flex-1 gap-1.5 space-y-0 text-left">
            <DialogTitle className="font-heading text-base leading-snug">{title}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border/80 bg-muted/30 px-6 py-4 sm:flex-row sm:justify-end sm:gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading} className="sm:min-w-24">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="default"
            disabled={isLoading}
            className="sm:min-w-24 flex items-center gap-1"
            onClick={handleConfirm}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'Confirmando…' : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
