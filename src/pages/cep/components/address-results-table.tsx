import { Loader2 } from "lucide-react"

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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Carregando endereços...
      </div>
    )
  }

  if (addresses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum endereço encontrado.
      </p>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
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
                <TableCell className="font-mono">{address.cep}</TableCell>
              )}
              {showCpf && (
                <TableCell className="font-mono">{address.cpf}</TableCell>
              )}
              <TableCell>{address.logradouro}</TableCell>
              <TableCell>{address.numero}</TableCell>
              <TableCell>{address.complemento}</TableCell>
              <TableCell>{address.bairro}</TableCell>
              <TableCell>{address.cidade}</TableCell>
              <TableCell>{address.estado}</TableCell>
              <TableCell>{address.uf}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
