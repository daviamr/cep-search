import { FileSearch, SearchX } from "lucide-react"

type QueryEmptyStateProps = {
  variant: "initial" | "empty"
  title: string
  description: string
}

export function QueryEmptyState({
  variant,
  title,
  description,
}: QueryEmptyStateProps) {
  const Icon = variant === "initial" ? FileSearch : SearchX

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border bg-muted/20 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
