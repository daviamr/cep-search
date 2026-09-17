import type { LucideIcon } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

/** Ícone de página: cinza escuro no claro, claro no escuro (sem preto absoluto). */
export const PAGE_ICON_CLASSNAME = 'size-4 shrink-0 text-zinc-700 dark:text-zinc-200'

export type PageBreadcrumbItem = {
  label: string
  href?: string
  icon?: LucideIcon
  className?: string
}

type PageBreadcrumbProps = {
  items: PageBreadcrumbItem[]
  className?: string
}

function BreadcrumbLabel({
  label,
  icon: Icon,
  className,
}: {
  label: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2 text-md', className)}>
      {Icon ? <Icon className={PAGE_ICON_CLASSNAME} aria-hidden="true" /> : null}
      <span className="truncate">{label}</span>
    </span>
  )
}

export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  if (!items.length) {
    return null
  }

  const lastIndex = items.length - 1

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="text-md">
        {items.map((item, index) => {
          const isCurrent = index === lastIndex
          const content = (
            <BreadcrumbLabel label={item.label} icon={item.icon} className={item.className} />
          )

          return (
            <Fragment key={`${item.label}-${item.href ?? index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isCurrent ? (
                  <h1
                    className="inline-flex max-w-full items-center gap-2 text-md font-medium text-muted-foreground"
                    aria-current="page"
                  >
                    {content}
                  </h1>
                ) : item.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{content}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="text-muted-foreground">{content}</span>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
