import { Building2, Coins, Headset, IdCard, LayoutDashboard, Map, Search } from "lucide-react";
import { DefaultLayout } from "../default-layout/DefaultLayout";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge";
import { Menu } from "@/components/menu/Menu";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-[#050c20] py-4">
      <DefaultLayout className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 font-bold"><Map size={18} /> CEP Search</h1>

          <ul className="flex items-center gap-6 text-sm ml-32">
            <li>
              <a href="/" className="flex items-center gap-2 font-bold">
                <LayoutDashboard size={16} /> Dashboard
              </a>
            </li>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2"><Search size={16} /> Buscar</NavigationMenuTrigger>
                  <NavigationMenuContent className="text-nowrap p-4">
                    <NavigationMenuLink className="cursor-pointer" href="/cnpj"><Building2 size={16} /> Busca por CPNJ</NavigationMenuLink>
                    <NavigationMenuLink className="cursor-pointer" href="/cpf"><IdCard size={16} /> Busca por CPF</NavigationMenuLink>
                    <NavigationMenuLink className="cursor-pointer" href="/cep"><Map size={16} /> Busca por CEP</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </ul>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-4">
          <Badge
            variant="outline"
            className="h-5 shrink-0 gap-1 whitespace-nowrap border-primary/50 bg-primary/15 px-1.5 py-0 text-xs font-light leading-none text-headerbar-foreground">
            <Coins className="size-3 shrink-0 text-yellow-500" strokeWidth={2} aria-hidden />
            <span className="tabular-nums">
              12.500 créditos
            </span>
          </Badge>
          <Menu />
          <Button type="button" variant="outline" size="icon">
            <Headset />
          </Button>
        </div>
      </DefaultLayout>
    </header>
  )
}