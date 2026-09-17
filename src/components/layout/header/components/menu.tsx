import { useState } from "react"
import { CreditCard, Landmark, LogOut, Settings, Users } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

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
import { useAuth } from "@/context/auth-provider"

import { getHeaderMenuDropdownItemClass } from "../header-nav-styles"

export function Menu() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, user } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const userName = user?.name ?? "Usuário"
  const userEmail = user?.email ?? ""

  function isActive(href: string) {
    return location.pathname === href || location.pathname.startsWith(`${href}/`)
  }

  function handleSignOut() {
    if (isSigningOut) return

    setIsSigningOut(true)
    toast.message("Saindo...", { duration: 3000 })

    window.setTimeout(() => {
      signOut()
      navigate("/", { replace: true })
    }, 3000)
  }

  return (
    <DropdownMenu>
      <HoverCard content="Configurações" side="bottom" closeDelay={0.5} openDelay={0.5}>
        <DropdownMenuTrigger asChild>
          <div className="group flex max-h-11 w-52 cursor-pointer items-center justify-between gap-2 rounded-md p-2.5 transition-colors duration-200 hover:bg-primary/10 data-[state=open]:bg-primary/10">
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0 leading-tight">
              <p className="truncate text-sm text-headerbar-foreground transition-colors duration-200 group-hover:text-primary group-data-[state=open]:text-primary">
                {userName}
              </p>
              <small className="text-xs text-headerbar-muted transition-colors duration-200 group-hover:text-primary/90 group-data-[state=open]:text-primary/90">
                {userEmail}
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
            <DropdownMenuLabel className="text-md p-0">{userName}</DropdownMenuLabel>
            <DropdownMenuLabel className="p-0">{userEmail}</DropdownMenuLabel>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className={getHeaderMenuDropdownItemClass(isActive("/users"))}>
            <Link to="/users" className="flex items-center gap-2">
              <Users size={16} />
              <span>Usuários</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className={getHeaderMenuDropdownItemClass()}>
            <Settings size={16} />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={getHeaderMenuDropdownItemClass(isActive("/credits"))}>
            <Link to="/credits" className="flex items-center gap-2">
              <CreditCard size={16} />
              <span>Meus créditos</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className={getHeaderMenuDropdownItemClass(isActive("/statement"))}
          >
            <Link to="/statement" className="flex items-center gap-2">
              <Landmark size={16} />
              <span>Meu extrato</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <div className="flex items-center justify-between gap-2 p-1">
            <p className="text-md">Tema</p>
            <ModeToggle />
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild variant="destructive">
            <Button
              variant="destructive"
              className="flex w-full items-center gap-2"
              disabled={isSigningOut}
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              <span>Sair</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
