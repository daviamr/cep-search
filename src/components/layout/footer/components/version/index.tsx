import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

const APP_VERSION = "0.0.1"
const LAST_UPDATE_LABEL = "16/07/2026"

function getVersionLabel() {
  return `Versão ${APP_VERSION}`
}

export function Versions() {
  const versionLabel = getVersionLabel()
  const lastUpdateLabel = `Ult. atualização ${LAST_UPDATE_LABEL}`

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-headerbar-muted">{lastUpdateLabel}</span>

      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="group perspective-[1000px] flex cursor-pointer items-center rounded-md px-2 py-1 transition-colors duration-200 hover:bg-primary/10"
          >
            <span
              data-hover={versionLabel}
              className={`
              relative inline-block transform-3d origin-[center_top] whitespace-nowrap
              text-xs font-bold
              transition-transform duration-200
              group-hover:transform-[rotateX(90deg)_translateY(-22px)]
              text-headerbar-muted
            `}
            >
              {versionLabel}
              <span
                className={`
                absolute top-full left-0 h-full w-full text-center
                transition-colors duration-200
                transform-[rotateX(-90deg)] origin-[center_top]
                content-[attr(data-hover)]
                text-headerbar-muted
                group-hover:text-primary
              `}
                aria-hidden="true"
              >
                {versionLabel}
              </span>
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-175">
          <DialogHeader className="flex flex-col items-start gap-2">
            <p className="flex items-center gap-2 text-base font-bold">
              Busca Endereço
            </p>
            <div className="mt-2 flex flex-col items-start gap-1">
              <DialogTitle>Novidades</DialogTitle>
              <DialogDescription>{LAST_UPDATE_LABEL}</DialogDescription>
            </div>
          </DialogHeader>

          <Separator orientation="horizontal" />

          <div>
            <p className="text-sm">
              Aqui temos listadas as versões desta plataforma, assim como suas
              respectivas descrições de atualizações.
            </p>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Versão {APP_VERSION}</p>
              <p className="text-sm text-muted-foreground">
                Interface alinhada ao padrão visual da plataforma.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
