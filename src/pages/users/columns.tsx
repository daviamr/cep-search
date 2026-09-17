import type { ColumnDef } from "@tanstack/react-table"

import { getCheckboxColumn } from "@/components/data-table/checkbox-column"
import { DataTableColumnHeader } from "@/components/data-table/column-header"
import { ModalRemove } from "@/components/modal-remove"
import { useAuth } from "@/context/auth-provider"
import { canManageTargetUser } from "@/enums/user-role.enum"
import { formatDateAndHours } from "@/utils/date-and-hours.util"

import { USER_ROLE_LABELS, type User } from "./types"

type UsersColumnsOptions = {
  onRemove: (userId: string) => Promise<void>
  deletingUserId?: string | null
}

function UserActionsCell({
  user,
  onRemove,
  deletingUserId,
}: {
  user: User
  onRemove: (userId: string) => Promise<void>
  deletingUserId?: string | null
}) {
  const { user: currentUser } = useAuth()
  const canManage = canManageTargetUser(currentUser?.role, user.role)

  return (
    <div className="flex h-8 min-h-8 items-center justify-end gap-1">
      {canManage ? (
        <ModalRemove
          id={user.id}
          title={user.name}
          isLoading={deletingUserId === user.id}
          className="size-8"
          onConfirm={async (id) => {
            await onRemove(String(id))
          }}
        />
      ) : null}
    </div>
  )
}

export function getUsersColumns({
  onRemove,
  deletingUserId = null,
}: UsersColumnsOptions): ColumnDef<User>[] {
  return [
    getCheckboxColumn<User>(),
    {
      accessorKey: "name",
      meta: { label: "Nome" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
      filterFn: "includesString",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.getValue<string>("name")}</span>
      ),
    },
    {
      accessorKey: "email",
      meta: { label: "E-mail" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="E-mail" />,
      filterFn: "includesString",
    },
    {
      accessorKey: "role",
      meta: { label: "Nível" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nível" />,
      cell: ({ row }) => USER_ROLE_LABELS[row.original.role],
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true
        return row.getValue(columnId) === filterValue
      },
    },
    {
      accessorKey: "created_at",
      meta: { label: "Data criação" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Data criação" />,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatDateAndHours(row.getValue<string>("created_at"))}
        </span>
      ),
    },
    {
      accessorKey: "updated_at",
      meta: { label: "Data atualização" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Data atualização" />,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatDateAndHours(row.getValue<string>("updated_at"))}
        </span>
      ),
    },
    {
      id: "actions",
      meta: { variant: "actions", label: "Ações" },
      enableHiding: false,
      header: () => <span className="sr-only">Ações</span>,
      cell: ({ row }) => (
        <UserActionsCell
          user={row.original}
          onRemove={onRemove}
          deletingUserId={deletingUserId}
        />
      ),
    },
  ]
}
