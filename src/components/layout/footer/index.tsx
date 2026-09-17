import LGPD from "@/assets/selo-footer.png"
import { HoverCard } from "@/components/hover-card"

import { Versions } from "./components/version"

export function Footer() {
  const dateNow = new Date().getFullYear()

  return (
    <footer className="w-full shrink-0 rounded-none border-t border-border bg-headerbar py-1.5 text-headerbar-foreground shadow-md dark:border-white/10">
      <div className="container relative mx-auto grid w-full grid-cols-2 items-center px-4">
        <div className="max-w-20">
          <HoverCard
            side="top"
            content="Plataforma desenvolvida de acordo com as diretrizes da nova Lei Geral de Proteção de Dados."
          >
            <img
              src={LGPD}
              alt="LGPD"
              className="w-20 brightness-30 dark:brightness-80"
            />
          </HoverCard>
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2 transform justify-center">
          <p className="text-center text-xs text-headerbar-muted">
            <strong className="font-semibold text-headerbar-foreground">
              Busca Endereço
            </strong>{" "}
            © {dateNow} Todos os direitos reservados
          </p>
        </div>

        <div className="ml-auto flex">
          <Versions />
        </div>
      </div>
    </footer>
  )
}
