import type { ColumnDef } from "@tanstack/react-table"

import { createCopyRowActionColumn } from "@/components/simple-query/copy-row-action-column"
import { TruncatedHoverCell } from "@/components/simple-query/truncated-hover-cell"
import { DataTableColumnHeader } from "@/components/data-table/column-header"
import { formatCnpj } from "@/lib/format"

import type { CpfSimpleSearchCompany } from "./simple-search-types"

function formatCompanyRow(row: CpfSimpleSearchCompany): string {
  return [
    `CNPJ: ${formatCnpj(row.cnpj)}`,
    `Razão Social: ${row.razaoSocial}`,
    `Qualificação: ${row.qualificacao}`,
    `UF: ${row.uf}`,
    `Cidade: ${row.cidade}`,
  ].join("\n")
}

export function getCpfCompanyColumns(): ColumnDef<CpfSimpleSearchCompany>[] {
  return [
    {
      accessorKey: "cnpj",
      meta: { label: "CNPJ" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="CNPJ" />,
      cell: ({ row }) => (
        <span className="font-mono">{formatCnpj(row.getValue<string>("cnpj"))}</span>
      ),
    },
    {
      accessorKey: "razaoSocial",
      meta: { label: "Razão Social" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Razão Social" />,
      cell: ({ row }) => <TruncatedHoverCell value={row.getValue<string>("razaoSocial")} />,
    },
    {
      accessorKey: "qualificacao",
      meta: { label: "Qualificação" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Qualificação" />,
      cell: ({ row }) => <TruncatedHoverCell value={row.getValue<string>("qualificacao")} />,
    },
    {
      accessorKey: "uf",
      meta: { label: "UF" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="UF" />,
      cell: ({ row }) => row.getValue<string>("uf") || "—",
    },
    {
      accessorKey: "cidade",
      meta: { label: "Cidade" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Cidade" />,
      cell: ({ row }) => <TruncatedHoverCell value={row.getValue<string>("cidade")} />,
    },
    createCopyRowActionColumn<CpfSimpleSearchCompany>({
      formatRow: formatCompanyRow,
      getAriaLabel: (row) => `Copiar empresa ${row.razaoSocial}`,
    }),
  ]
}
