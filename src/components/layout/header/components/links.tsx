import { useLocation } from "react-router-dom"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { useHeaderController } from "../controller"
import { getHeaderNavTriggerClass } from "../header-nav-styles"

interface HeaderLinksProps {
  route: string
  nameLink: string
  icon: LucideIcon
}

export function LinksHeader({ nameLink, route, icon: Icon }: HeaderLinksProps) {
  const { route: routePage } = useHeaderController()
  const { handlePage } = routePage
  const location = useLocation()
  const isActive =
    route === "/"
      ? location.pathname === "/"
      : location.pathname === route || location.pathname.startsWith(`${route}/`)

  const navClass = getHeaderNavTriggerClass(isActive)

  return (
    <button
      onClick={() => handlePage(route)}
      type="button"
      className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-2 py-1 transition-colors duration-200 hover:bg-primary/10"
    >
      <Icon size={16} className={navClass} />
      <span className={cn("text-md whitespace-nowrap font-bold lg:text-xs", navClass)}>
        {nameLink}
      </span>
    </button>
  )
}
