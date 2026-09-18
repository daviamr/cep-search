import type { AccessorKeyColumnDef, ColumnDef } from "@tanstack/react-table"

import { createCopyRowActionColumn } from "@/components/simple-query/copy-row-action-column"
import { TruncatedHoverCell } from "@/components/simple-query/truncated-hover-cell"
import { getCheckboxColumn } from "@/components/data-table/checkbox-column"
import { DataTableColumnHeader } from "@/components/data-table/column-header"

import type { EnrichedAddress } from "./types"

function formatAddressRow(row: EnrichedAddress): string {
  return [
    `CPF: ${row.cpf || "—"}`,
    `Nome: ${row.nome || "—"}`,
    `CEP: ${row.cep || "—"}`,
    `Logradouro: ${row.logradouro || "—"}`,
    `Número: ${row.numero || "—"}`,
    `Complemento: ${row.complemento || "—"}`,
    `Bairro: ${row.bairro || "—"}`,
    `Cidade: ${row.cidade || "—"}`,
    `Estado: ${row.estado || "—"}`,
    `UF: ${row.uf || "—"}`,
    `Origem: ${row.origem || "—"}`,
  ].join("\n")
}

const addressDataColumns: AccessorKeyColumnDef<EnrichedAddress>[] = [
  {
    accessorKey: "cpf",
    meta: { label: "CPF" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="CPF" />,
    filterFn: "includesString",
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue<string>("cpf") || "—"}</span>
    ),
  },
  {
    accessorKey: "cep",
    meta: { label: "CEP" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="CEP" />,
    filterFn: "includesString",
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue<string>("cep") || "—"}</span>
    ),
  },
  {
    accessorKey: "logradouro",
    meta: { label: "Logradouro" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Logradouro" />,
    filterFn: "includesString",
    cell: ({ row }) => <TruncatedHoverCell value={row.getValue<string>("logradouro")} />,
  },
  {
    accessorKey: "numero",
    meta: { label: "Número" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Número" />,
    cell: ({ row }) => row.getValue<string>("numero") || "—",
  },
  {
    accessorKey: "complemento",
    meta: { label: "Complemento" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Complemento" />,
    cell: ({ row }) => <TruncatedHoverCell value={row.getValue<string>("complemento")} />,
  },
  {
    accessorKey: "bairro",
    meta: { label: "Bairro" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bairro" />,
    filterFn: "includesString",
    cell: ({ row }) => <TruncatedHoverCell value={row.getValue<string>("bairro")} />,
  },
  {
    accessorKey: "cidade",
    meta: { label: "Cidade" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cidade" />,
    filterFn: "includesString",
    cell: ({ row }) => <TruncatedHoverCell value={row.getValue<string>("cidade")} />,
  },
  {
    accessorKey: "estado",
    meta: { label: "Estado" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    filterFn: "includesString",
    cell: ({ row }) => row.getValue<string>("estado") || "—",
  },
  {
    accessorKey: "uf",
    meta: { label: "UF" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="UF" />,
    filterFn: "includesString",
    cell: ({ row }) => row.getValue<string>("uf") || "—",
  },
  {
    accessorKey: "origem",
    meta: { label: "Origem" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Origem" />,
    filterFn: "includesString",
    cell: ({ row }) => <TruncatedHoverCell value={row.getValue<string>("origem")} />,
  },
]

const copyAddressColumn = createCopyRowActionColumn<EnrichedAddress>({
  formatRow: formatAddressRow,
  getAriaLabel: (row) => `Copiar linha de ${row.cep || row.cpf || "endereço"}`,
})

export const addressSimpleQueryColumns: ColumnDef<EnrichedAddress>[] = [
  ...addressDataColumns,
  copyAddressColumn,
]

export const cpfAddressTabColumns: ColumnDef<EnrichedAddress>[] = [
  ...addressDataColumns.filter((column) => column.accessorKey !== "cpf"),
  copyAddressColumn,
]

export const addressResultsColumns: ColumnDef<EnrichedAddress>[] = [
  getCheckboxColumn<EnrichedAddress>(),
  addressDataColumns[0],
  {
    accessorKey: "nome",
    meta: { label: "Nome" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    filterFn: "includesString",
    cell: ({ row }) => <TruncatedHoverCell value={row.original.nome} />,
  },
  ...addressDataColumns.filter((column) =>
    ["cep", "numero", "complemento", "estado", "uf"].includes(String(column.accessorKey))
  ),
]

export const cepResultsColumns: ColumnDef<EnrichedAddress>[] = [
  getCheckboxColumn<EnrichedAddress>(),
  ...addressDataColumns.filter((column) =>
    ["cep", "numero", "complemento", "estado", "uf", "origem"].includes(
      String(column.accessorKey)
    )
  ),
]
