import { useMemo, useState } from "react"
import { Copy } from "lucide-react"

import { DefaultLayout } from "@/components/layout/default-layout/DefaultLayout"
import { QueryEmptyState } from "@/components/query-empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateAndHours, formatNumber } from "@/lib/format"

import { ApiBreadcrumb } from "../components/api-breadcrumb"
import { ApiHistoryFilters } from "./components/api-history-filters"
import { apiHistoryMock } from "./mock-data"
import type { ApiHistoryRecord } from "./types"

const STATUS_LABELS = {
  success: "Sucesso",
  error: "Erro",
  processing: "Processando",
} as const

const METHOD_VARIANTS = {
  GET: "secondary",
  POST: "default",
  DELETE: "destructive",
} as const

export function ApiHistoryPage() {
  const [endpointFilter, setEndpointFilter] = useState("")
  const [originFilter, setOriginFilter] = useState("")

  const filteredRecords = useMemo(() => {
    const endpointQuery = endpointFilter.trim().toLowerCase()
    const originQuery = originFilter.trim().toLowerCase()

    return apiHistoryMock.filter((record) => {
      const matchesEndpoint =
        !endpointQuery || record.endpoint.toLowerCase().includes(endpointQuery)
      const matchesOrigin =
        !originQuery || record.origin.toLowerCase().includes(originQuery)

      return matchesEndpoint && matchesOrigin
    })
  }, [endpointFilter, originFilter])

  return (
    <DefaultLayout>
      <ApiBreadcrumb page="Histórico" />

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Histórico</h1>
        <p className="text-sm text-muted-foreground">
          Registro de requisições realizadas à API do Busca Endereço.
        </p>
      </div>

      <div className="space-y-4">
        <ApiHistoryFilters
          endpointFilter={endpointFilter}
          originFilter={originFilter}
          onEndpointFilterChange={setEndpointFilter}
          onOriginFilterChange={setOriginFilter}
        />

        {filteredRecords.length === 0 ? (
          <QueryEmptyState
            variant="empty"
            title="Nenhuma requisição encontrada"
            description="Ajuste os filtros ou realize novas consultas pela API."
          />
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Créditos</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead className="sr-only text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <HistoryRow key={record.id} record={record} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DefaultLayout>
  )
}

function HistoryRow({ record }: { record: ApiHistoryRecord }) {
  return (
    <TableRow>
      <TableCell>
        <span className="font-mono text-xs text-foreground">
          {record.endpoint}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={METHOD_VARIANTS[record.method]}>{record.method}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-start gap-0.5">
          <Badge
            variant={
              record.status === "success"
                ? "default"
                : record.status === "error"
                  ? "destructive"
                  : "secondary"
            }
          >
            {STATUS_LABELS[record.status]}
          </Badge>
          <span className="text-xs text-muted-foreground tabular-nums">
            {record.statusCode}
          </span>
        </div>
      </TableCell>
      <TableCell className="tabular-nums">
        {formatNumber(record.credits)}
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {formatDateAndHours(record.createdAt)}
      </TableCell>
      <TableCell>
        <span className="max-w-40 truncate font-mono text-xs">
          {record.origin}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={`Copiar origem de ${record.endpoint}`}
            onClick={() => {
              void navigator.clipboard.writeText(record.origin)
            }}
          >
            <Copy className="size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
