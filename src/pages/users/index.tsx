import { useMemo } from "react"

import {
  DataTable,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
} from "@/components/data-table"

import { getUsersColumns } from "./columns"
import { CreateUserDialog } from "./components/create-user-dialog"
import { UsersBreadcrumb } from "./components/users-breadcrumb"
import { UsersFilters } from "./components/users-filters"
import { useUsersController } from "./controller"

export function UsersPage() {
  const { users, isLoadingUsers, isErrorUsers, deleteUser, deletingUserId } =
    useUsersController()

  const columns = useMemo(
    () =>
      getUsersColumns({
        onRemove: async (userId) => {
          await deleteUser(userId)
        },
        deletingUserId,
      }),
    [deleteUser, deletingUserId]
  )

  return (
    <div className="container mx-auto space-y-6 p-6">
      <UsersBreadcrumb />

      <DataTableProvider
        columns={columns}
        data={users}
        options={{
          pagination: { pageSize: 10 },
          sorting: true,
          filtering: true,
          columnVisibility: true,
          rowSelection: true,
        }}
      >
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <UsersFilters />

            <div className="flex shrink-0 items-center gap-2">
              <CreateUserDialog />
              <DataTableToolbar showSearch={false} />
            </div>
          </div>
          <DataTable
            isLoading={isLoadingUsers}
            emptyMessage={
              isErrorUsers
                ? "Não foi possível carregar os usuários."
                : "Nenhum usuário encontrado."
            }
          />
          <DataTablePagination />
        </div>
      </DataTableProvider>
    </div>
  )
}
