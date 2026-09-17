import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { PAGE_ICON_CLASSNAME } from "@/components/page-breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatCardProps = {
  title: string
  value: ReactNode
  icon: LucideIcon
  iconClassName?: string
}

export function StatCard({ title, value, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card size="sm">
      <CardContent className="space-y-3">
        <Icon className={cn(PAGE_ICON_CLASSNAME, iconClassName)} aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
