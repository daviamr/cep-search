import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreditCard, Landmark, LogOut, Settings, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function Menu() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="group flex max-h-11 w-52 items-center justify-between gap-2 rounded-md cursor-pointer transition-colors duration-200 px-6 hover:bg-white/10">
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0 leading-tight">
              <p className="truncate text-sm text-headerbar-foreground transition-colors duration-200 group-hover:text-headerbar-accent">
                username
              </p>
              <small className="text-xs text-headerbar-muted transition-colors duration-200 group-hover:text-headerbar-accent/95">
                username@mail.com
              </small>
            </div>
            <Settings
              size={16}
              className="shrink-0 text-headerbar-muted transition-colors duration-200 group-hover:text-headerbar-accent"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/users" className="flex items-center gap-2">
                <Users size={16} />
                <p>Usuários</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <Settings size={16} />
                <p>Configurações</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <CreditCard size={16} />
                <p>Meus créditos</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <Landmark size={16} />
                <p>Meu extrato</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button variant="destructive" className="flex items-center gap-2 w-full">
                <LogOut size={16} />
                <p>Sair</p>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
