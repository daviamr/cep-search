import type { ComponentProps, ReactNode } from "react"

import {
  HoverCard as HoverCardRoot,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

type HoverCardContentProps = ComponentProps<typeof HoverCardContent>
type HoverCardRootProps = ComponentProps<typeof HoverCardRoot>

export type HoverCardProps = {
  children: ReactNode
  content: ReactNode
  asChild?: boolean
  side?: HoverCardContentProps["side"]
  align?: HoverCardContentProps["align"]
  sideOffset?: HoverCardContentProps["sideOffset"]
  contentClassName?: string
} & Pick<HoverCardRootProps, "openDelay" | "closeDelay">

export function HoverCard({
  children,
  content,
  asChild = true,
  openDelay = 200,
  closeDelay = 0,
  side = "top",
  align = "center",
  sideOffset,
  contentClassName,
}: HoverCardProps) {
  return (
    <HoverCardRoot openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild={asChild}>{children}</HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn("w-fit max-w-64 p-2 text-xs", contentClassName)}
      >
        {content}
      </HoverCardContent>
    </HoverCardRoot>
  )
}
