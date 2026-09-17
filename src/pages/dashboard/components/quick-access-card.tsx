import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { HoverCard } from "@/components/hover-card"
import { PAGE_ICON_CLASSNAME } from "@/components/page-breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type QuickAccessCardProps = {
  title: string
  description: string
  href: string
  icon: LucideIcon
  iconClassName?: string
  disabled?: boolean
}

export function QuickAccessCard({
  title,
  description,
  href,
  icon: Icon,
  iconClassName,
  disabled = false,
}: QuickAccessCardProps) {
  return (
    <Card className="flex h-full flex-col" size="sm">
      <CardContent className="flex h-full flex-col gap-4">
        <Icon className={cn(PAGE_ICON_CLASSNAME, iconClassName)} aria-hidden="true" />
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="mt-auto">
          {disabled ? (
            <HoverCard content="Em breve" side="top">
              <span className="inline-flex">
                <Button variant="outline" size="sm" disabled>
                  Acessar
                </Button>
              </span>
            </HoverCard>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to={href}>Acessar</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
