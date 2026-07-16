import { Bell, Coins, Headset, LayoutDashboard, Map } from "lucide-react"
import { Link } from "react-router-dom"

import { HoverCard } from "@/components/hover-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { BuscarHeaderLink } from "./components/buscar-link"
import { ApiHeaderLink } from "./components/api-link"
import { LinksHeader } from "./components/links"
import { Menu } from "./components/menu"

const CREDIT_BALANCE = 12500

const headerIconButtonClass =
  "text-headerbar-muted transition-colors hover:bg-primary/10 hover:text-primary"

export function Header() {
  return (
    <header className="fixed z-50 w-full shrink-0 rounded-none border-b border-border bg-headerbar py-1.5 text-headerbar-foreground shadow-md dark:border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 font-bold text-headerbar-foreground"
          >
            <Map size={18} aria-hidden />
            CEP Search
          </Link>

          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <LinksHeader
                  nameLink="Dashboard"
                  route="/"
                  icon={LayoutDashboard}
                />
              </li>
              <li>
                <BuscarHeaderLink />
              </li>
              <li>
                <ApiHeaderLink />
              </li>
            </ul>
          </nav>

          <div className="flex min-w-0 shrink-0 items-center gap-4">
            <Badge
              variant="outline"
              className="h-5 shrink-0 gap-1 whitespace-nowrap border-primary/50 bg-primary/15 px-1.5 py-0 text-xs leading-none font-light text-headerbar-foreground"
            >
              <Coins
                className="size-3 shrink-0 text-yellow-500"
                strokeWidth={2}
                aria-hidden
              />
              <span className="tabular-nums">
                {CREDIT_BALANCE.toLocaleString("pt-BR")} créditos
              </span>
            </Badge>
            <Menu />
            <HoverCard
              content="Notificações"
              side="bottom"
              closeDelay={0.5}
              openDelay={0.5}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={headerIconButtonClass}
                aria-label="Notificações"
              >
                <Bell />
              </Button>
            </HoverCard>
            <HoverCard
              content="Suporte"
              side="bottom"
              closeDelay={0.5}
              openDelay={0.5}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={headerIconButtonClass}
                aria-label="Suporte"
              >
                <Headset />
              </Button>
            </HoverCard>
          </div>
        </div>
      </div>
    </header>
  )
}
