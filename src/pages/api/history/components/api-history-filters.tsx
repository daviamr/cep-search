import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ApiHistoryFiltersProps = {
  endpointFilter: string
  originFilter: string
  onEndpointFilterChange: (value: string) => void
  onOriginFilterChange: (value: string) => void
}

export function ApiHistoryFilters({
  endpointFilter,
  originFilter,
  onEndpointFilterChange,
  onOriginFilterChange,
}: ApiHistoryFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="api-history-filter-endpoint">Endpoint</Label>
        <Input
          id="api-history-filter-endpoint"
          placeholder="Filtrar por endpoint..."
          value={endpointFilter}
          onChange={(event) => onEndpointFilterChange(event.target.value)}
          className="h-8 w-45 lg:w-55"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="api-history-filter-origin">Origem</Label>
        <Input
          id="api-history-filter-origin"
          placeholder="Filtrar por origem..."
          value={originFilter}
          onChange={(event) => onOriginFilterChange(event.target.value)}
          className="h-8 w-45 lg:w-55"
        />
      </div>
    </div>
  )
}
