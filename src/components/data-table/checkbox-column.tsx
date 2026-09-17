import type { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'

/**
 * Retorna a definição da coluna de seleção (checkbox) para usar no início do array de colunas.
 * Use apenas quando o DataTableProvider tiver options.rowSelection habilitado.
 *
 * @example
 * const columns: ColumnDef<Payment>[] = [
 *   getCheckboxColumn<Payment>(),
 *   { accessorKey: "email", header: "Email" },
 *   ...
 * ]
 */
export function getCheckboxColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: 'select',
    meta: { align: 'left' },
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}
