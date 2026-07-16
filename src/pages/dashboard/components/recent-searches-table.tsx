import { Eye, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

import { HoverCard } from "@/components/hover-card"
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
      <CardContent className="px-0 pb-0 sm:px-(--card-spacing) sm:pb-(--card-spacing)">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando consultas recentes...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border sm:rounded-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Tipo</TableHead>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Consultas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead className="sr-only text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhum arquivo processado ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  files.map((file) => (
                    <TableRow key={`${file.type}-${file.id}`}>
                      <TableCell>
                        <Badge variant="outline">{file.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[280px] truncate font-medium">
                        {file.fileName}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {formatNumber(file.consultas)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatStatus(file.status)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDateTime(file.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <HoverCard
                            content="Visualizar"
                            side="top"
                            closeDelay={0.5}
                            openDelay={0.5}
                          >
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
                          </HoverCard>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
