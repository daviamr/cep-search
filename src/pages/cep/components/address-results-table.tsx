import { Loader2 } from "lucide-react"

import { QueryEmptyState } from "@/components/query-empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { EnrichedCepAddress } from "../types"

type AddressResultsTableProps = {
  addresses: EnrichedCepAddress[]
  isLoading?: boolean
  showCpf?: boolean
  showCep?: boolean
}

export function AddressResultsTable({
  addresses,
  isLoading = false,
  showCpf = false,
  showCep = true,
}: AddressResultsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Carregando endereços...
      </div>
    )
  }

  if (addresses.length === 0) {
    return (
      <QueryEmptyState
        variant="empty"
        title="Nenhum endereço encontrado"
        description="Não há endereços para exibir neste resultado."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            {showCep && <TableHead>CEP</TableHead>}
            {showCpf && <TableHead>CPF</TableHead>}
            <TableHead>Logradouro</TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Complemento</TableHead>
            <TableHead>Bairro</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>UF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((address) => (
            <TableRow key={address.id}>
              {showCep && (
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {address.cep}
                </TableCell>
              )}
              {showCpf && (
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {address.cpf}
                </TableCell>
              )}
              <TableCell>{address.logradouro}</TableCell>
              <TableCell className="text-muted-foreground">
                {address.numero}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {address.complemento}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {address.bairro}
              </TableCell>
              <TableCell>{address.cidade}</TableCell>
              <TableCell className="text-muted-foreground">
                {address.estado}
              </TableCell>
              <TableCell className="text-muted-foreground">{address.uf}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
