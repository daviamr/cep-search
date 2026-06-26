import { Eye, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateTime, formatNumber } from "@/lib/format"

import type { RecentSearchFile } from "../types"

type RecentSearchesTableProps = {
  files: RecentSearchFile[]
  isLoading?: boolean
}

function formatStatus(status: string) {
  if (!status.trim()) return "—"
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

export function RecentSearchesTable({
  files,
  isLoading = false,
}: RecentSearchesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultas recentes</CardTitle>
        <CardDescription>
          Últimos arquivos processados em CNPJs, CPFs e CEPs.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pb-2">
        {isLoading ? (
          <div className="flex items-center gap-2 px-6 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando consultas recentes...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] pl-6">Tipo</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead className="w-[100px] text-right">Consulta</TableHead>
                <TableHead className="w-[110px]">Status</TableHead>
                <TableHead className="w-[140px]">Data/Hora</TableHead>
                <TableHead className="w-[70px] pr-6">
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Nenhum arquivo processado ainda.
                  </TableCell>
                </TableRow>
              ) : (
                files.map((file) => (
                  <TableRow key={`${file.type}-${file.id}`}>
                    <TableCell className="pl-6">
                      <Badge
                        variant="outline"
                        className="border-border bg-secondary/60 font-mono text-xs text-foreground"
                      >
                        {file.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate font-medium">
                      {file.fileName}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(file.consultas)}
                    </TableCell>
                    <TableCell>{formatStatus(file.status)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(file.createdAt)}
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          aria-label={`Visualizar planilha ${file.fileName}`}
                          asChild
                        >
                          <Link to={file.viewPath}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
