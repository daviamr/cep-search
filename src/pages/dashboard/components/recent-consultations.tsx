import {
  DataTable,
  DataTablePagination,
  DataTableProvider,
} from "@/components/data-table"

import { recentConsultationsColumns } from "../columns"
import type { RecentConsultation } from "../types"
import { RecentConsultationsFilters } from "./recent-consultations-filters"

type RecentConsultationsProps = {
  consultations: RecentConsultation[]
  isLoading?: boolean
  isError?: boolean
}

const NO_ROW_HOVER_CLASS =
  "[&_tr]:hover:bg-transparent [&_tr]:has-aria-expanded:bg-transparent"

export function RecentConsultations({
  consultations,
  isLoading = false,
  isError = false,
}: RecentConsultationsProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-md font-semibold tracking-tight text-foreground">
          Consultas recentes
        </h2>
        <p className="text-xs text-muted-foreground">
          Últimos arquivos em massa processados na plataforma.
        </p>
      </div>

      <DataTableProvider
        columns={recentConsultationsColumns}
        data={isLoading || isError ? [] : consultations}
        options={{
          pagination: { pageSize: 10 },
          sorting: true,
          filtering: true,
        }}
      >
        <div className="space-y-4">
          <RecentConsultationsFilters />

          <DataTable
            isLoading={isLoading}
            emptyMessage={
              isError
                ? "Não foi possível carregar as consultas recentes."
                : "Nenhuma consulta realizada ainda."
            }
            emptyDescription={
              isError ? undefined : "Ainda não há consultas recentes para exibir."
            }
            tableWrapperClassName={NO_ROW_HOVER_CLASS}
          />
          <DataTablePagination selectionText={null} />
        </div>
      </DataTableProvider>
    </section>
  )
}
