import { CreditCard, Landmark, LogOut, Settings, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { HoverCard } from "@/components/hover-card"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { getHeaderMenuDropdownItemClass } from "../header-nav-styles"

export function Menu() {
  const location = useLocation()
  const isUsersActive =
    location.pathname === "/users" || location.pathname.startsWith("/users/")

  return (
    <DropdownMenu>
      <HoverCard content="Configurações" side="bottom" closeDelay={0.5} openDelay={0.5}>
        <DropdownMenuTrigger asChild>
          <div className="group flex max-h-11 w-52 cursor-pointer items-center justify-between gap-2 rounded-md p-2.5 transition-colors duration-200 hover:bg-primary/10 data-[state=open]:bg-primary/10">
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0 leading-tight">
              <p className="truncate text-sm text-headerbar-foreground transition-colors duration-200 group-hover:text-primary group-data-[state=open]:text-primary">
                username
              </p>
              <small className="text-xs text-headerbar-muted transition-colors duration-200 group-hover:text-primary/90 group-data-[state=open]:text-primary/90">
                username@mail.com
              </small>
            </div>
            <Settings
              size={16}
              className="shrink-0 text-headerbar-muted transition-colors duration-200 group-hover:text-primary group-data-[state=open]:text-primary"
            />
          </div>
        </DropdownMenuTrigger>
      </HoverCard>
      <DropdownMenuContent>
        <DropdownMenuGroup asChild>
          <div className="p-1">
            <DropdownMenuLabel className="text-md p-0">username</DropdownMenuLabel>
            <DropdownMenuLabel className="p-0">username@mail.com</DropdownMenuLabel>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className={getHeaderMenuDropdownItemClass(isUsersActive)}>
            <Link to="/users" className="flex items-center gap-2">
              <Users size={16} />
              <span>Usuários</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className={getHeaderMenuDropdownItemClass()}>
            <Settings size={16} />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuItem className={getHeaderMenuDropdownItemClass()}>
            <CreditCard size={16} />
            <span>Meus créditos</span>
          </DropdownMenuItem>
          <DropdownMenuItem className={getHeaderMenuDropdownItemClass()}>
            <Landmark size={16} />
            <span>Meu extrato</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <div className="flex items-center justify-between gap-2 p-1">
            <p className="text-md">Tema</p>
            <ModeToggle />
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild variant="destructive">
            <Button variant="destructive" className="flex w-full items-center gap-2">
              <LogOut size={16} />
              <span>Sair</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
