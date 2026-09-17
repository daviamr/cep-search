import { FileSearch, Loader2, type LucideIcon } from 'lucide-react'

import { PAGE_ICON_CLASSNAME } from '@/components/page-breadcrumb'
import { cn } from '@/lib/utils'

type EmptyStateCardProps = {
  title?: string
  description?: string
  icon?: LucideIcon
  isLoading?: boolean
  className?: string
}

export function EmptyStateCard({
  title = 'Nenhuma consulta realizada',
  description,
  icon: Icon = FileSearch,
  isLoading = false,
  className,
}: EmptyStateCardProps) {
  return (
    <div
      className={cn(
        'flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card px-6 py-12 text-center',
        className,
      )}
    >
      {isLoading ? (
        <>
          <Loader2
            className={cn(PAGE_ICON_CLASSNAME, 'size-5 animate-spin')}
            aria-hidden="true"
          />
          <h3 className="text-base font-semibold tracking-tight text-foreground">Carregando...</h3>
        </>
      ) : (
        <>
          <Icon className={cn(PAGE_ICON_CLASSNAME, 'size-5')} aria-hidden="true" />
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
            {description ? (
              <p className="mx-auto max-w-md text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
