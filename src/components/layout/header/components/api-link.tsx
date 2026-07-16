import { History, Server } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

import {
  getHeaderHoverCardItemClass,
  getHeaderNavTriggerClass,
} from "../header-nav-styles"

const API_ITEMS = [
  {
    label: "Histórico",
    href: "/api/historico",
    icon: History,
  },
] as const

export function ApiHeaderLink() {
  const location = useLocation()
  const isActive = location.pathname.startsWith("/api")
  const navClass = getHeaderNavTriggerClass(isActive)

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-2 py-1 transition-colors duration-200 hover:bg-primary/10"
        >
          <Server size={16} className={navClass} />
          <span
            className={cn(
              "text-md whitespace-nowrap font-bold lg:text-xs",
              navClass
            )}
          >
            API
          </span>
        </button>
      </HoverCardTrigger>

      <HoverCardContent
        side="bottom"
        align="center"
        sideOffset={8}
        className="w-52 p-1.5"
      >
        <nav className="flex flex-col gap-0.5">
          {API_ITEMS.map(({ label, href, icon: Icon }) => {
            const itemActive = location.pathname === href

            return (
              <Link
                key={href}
                to={href}
                className={getHeaderHoverCardItemClass(itemActive)}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>
      </HoverCardContent>
    </HoverCard>
  )
}
