import { Building2, CheckCircle, IdCard, Map } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { HoverCard as HintHoverCard } from "@/components/hover-card"
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

const BUSCAR_ITEMS = [
  {
    label: "Buscar por CNPJ",
    href: "/cnpj",
    icon: Building2,
    disabled: true,
  },
  {
    label: "Buscar por CPF",
    href: "/cpf",
    icon: IdCard,
    disabled: false,
  },
  {
    label: "Buscar por CEP",
    href: "/cep",
    icon: Map,
    disabled: false,
  },
] as const

export function BuscarHeaderLink() {
  const location = useLocation()
  const isActive = BUSCAR_ITEMS.some(
    ({ href, disabled }) =>
      !disabled &&
      (location.pathname === href || location.pathname.startsWith(`${href}/`))
  )
  const navClass = getHeaderNavTriggerClass(isActive)

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-2 py-1 transition-colors duration-200 hover:bg-primary/10"
        >
          <CheckCircle size={16} className={navClass} />
          <span
            className={cn(
              "text-md whitespace-nowrap font-bold lg:text-xs",
              navClass
            )}
          >
            Checker
          </span>
        </button>
      </HoverCardTrigger>

      <HoverCardContent
        side="bottom"
        align="center"
        sideOffset={8}
        className="w-60 p-1.5"
      >
        <nav className="flex flex-col gap-0.5">
          {BUSCAR_ITEMS.map(({ label, href, icon: Icon, disabled }) => {
            const itemActive =
              !disabled &&
              (location.pathname === href ||
                location.pathname.startsWith(`${href}/`))

            const className = cn(
              getHeaderHoverCardItemClass(itemActive),
              disabled &&
                "cursor-not-allowed opacity-50 text-muted-foreground hover:bg-transparent hover:text-muted-foreground"
            )

            if (disabled) {
              return (
                <HintHoverCard key={href} content="Em breve" side="right">
                  <span className={className} aria-disabled="true">
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {label}
                  </span>
                </HintHoverCard>
              )
            }

            return (
              <Link key={href} to={href} className={className}>
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
