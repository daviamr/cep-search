import { History, ScrollText, Server } from "lucide-react"

import { PageBreadcrumb } from "@/components/page-breadcrumb"

type ApiBreadcrumbProps = {
  page: "Histórico" | "Documentação"
}

const PAGE_ICONS = {
  Histórico: History,
  Documentação: ScrollText,
} as const

export function ApiBreadcrumb({ page }: ApiBreadcrumbProps) {
  return (
    <PageBreadcrumb
      items={[
        { label: "API", icon: Server },
        { label: page, icon: PAGE_ICONS[page] },
      ]}
    />
  )
}
