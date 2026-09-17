import { Landmark } from "lucide-react"

import {
  DataTable,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
} from "@/components/data-table"
import { PageBreadcrumb } from "@/components/page-breadcrumb"

import { statementColumns } from "./columns"
import { StatementFilters } from "./components/statement-filters"
import { useStatementController } from "./controller"

export function StatementPage() {
  const { records, isLoading, isError } = useStatementController()

  return (
    <div className="container mx-auto space-y-6 p-6">
      <PageBreadcrumb items={[{ label: "Extrato", icon: Landmark }]} />

      <DataTableProvider
        columns={statementColumns}
        data={records}
        options={{
          pagination: { pageSize: 10 },
          sorting: true,
          filtering: true,
          columnVisibility: true,
          rowSelection: true,
        }}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <StatementFilters />
            <DataTableToolbar showSearch={false} />
          </div>

          <DataTable
            isLoading={isLoading}
            emptyMessage={
              isError ? "Não foi possível carregar o extrato." : "Nenhuma movimentação encontrada."
            }
            emptyDescription={
              isError
                ? "Tente novamente em alguns instantes."
                : "Não há lançamentos no extrato para o período selecionado."
            }
          />
          <DataTablePagination />
        </div>
      </DataTableProvider>
    </div>
  )
}
