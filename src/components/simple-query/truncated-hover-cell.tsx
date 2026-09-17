import { HoverCard } from '@/components/hover-card'
import { cn } from '@/lib/utils'

type TruncatedHoverCellProps = {
  value: string | null | undefined
  className?: string
  maxWidthClassName?: string
}

export function TruncatedHoverCell({
  value,
  className,
  maxWidthClassName = 'max-w-48',
}: TruncatedHoverCellProps) {
  const text = value?.trim() || '—'

  if (text === '—') {
    return <span className={className}>{text}</span>
  }

  return (
    <HoverCard content={text} side="top" closeDelay={0.5} openDelay={0.5} contentClassName="max-w-sm">
      <span className={cn('block truncate', maxWidthClassName, className)} title={text}>
        {text}
      </span>
    </HoverCard>
  )
}
