import type { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import { Link } from "react-router-dom"

import { DataTableColumnHeader } from "@/components/data-table/column-header"
import { HoverCard } from "@/components/hover-card"
import { PAGE_ICON_CLASSNAME } from "@/components/page-breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDateAndHours } from "@/utils/date-and-hours.util"

import type { ConsultationStatus, ConsultationType, RecentConsultation } from "./types"

export const CONSULTATION_TYPE_LABELS: Record<ConsultationType, string> = {
  cpf: "CPF",
  cep: "CEP",
}

export const CONSULTATION_TYPE_ROUTES: Record<ConsultationType, string> = {
  cpf: "/cpf",
  cep: "/cep",
}

export const CONSULTATION_STATUS_LABELS: Record<ConsultationStatus, string> = {
  completed: "Concluída",
  processing: "Processando",
  error: "Erro",
}

const STATUS_CLASSNAMES: Record<ConsultationStatus, string> = {
  completed: "border-transparent bg-primary text-primary-foreground",
  processing: "border-transparent bg-secondary text-secondary-foreground",
  error: "border-transparent bg-destructive/15 text-destructive",
}

export const recentConsultationsColumns: ColumnDef<RecentConsultation>[] = [
  {
    accessorKey: "type",
    meta: { label: "Tipo" },
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" className="text-md" />
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true
      return row.getValue(columnId) === filterValue
    },
    cell: ({ row }) => CONSULTATION_TYPE_LABELS[row.original.type],
  },
  {
    accessorKey: "fileName",
    meta: { label: "Arquivo" },
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Arquivo" className="text-md" />
    ),
    filterFn: "includesString",
    cell: ({ row }) => (
      <span className="max-w-60 truncate">{row.getValue<string>("fileName")}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    meta: { label: "Data/Hora" },
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data/Hora" className="text-md" />
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatDateAndHours(row.getValue<Date>("createdAt"))}
      </span>
    ),
  },
  {
    accessorKey: "status",
    meta: { label: "Status" },
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" className="text-md" />
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true
      return row.getValue(columnId) === filterValue
    },
    cell: ({ row }) => {
      const status = row.original.status

      return (
        <Badge variant="outline" className={cn(STATUS_CLASSNAMES[status])}>
          {CONSULTATION_STATUS_LABELS[status]}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    meta: { variant: "actions", label: "Ações" },
    enableSorting: false,
    enableHiding: false,
    header: () => <span className="sr-only">Ações</span>,
    cell: ({ row }) => {
      const item = row.original
      const href = `${CONSULTATION_TYPE_ROUTES[item.type]}/${item.id}`

      if (!item.canView) {
        return (
          <HoverCard content="Arquivo indisponível para visualização" side="top">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled
              aria-label={`Visualizar ${item.fileName}`}
            >
              <Eye className={PAGE_ICON_CLASSNAME} />
            </Button>
          </HoverCard>
        )
      }

      return (
        <HoverCard content="Visualizar" side="top">
          <Button type="button" variant="outline" size="icon-sm" asChild>
            <Link to={href} aria-label={`Visualizar ${item.fileName}`}>
              <Eye className={PAGE_ICON_CLASSNAME} />
            </Link>
          </Button>
        </HoverCard>
      )
    },
  },
]
