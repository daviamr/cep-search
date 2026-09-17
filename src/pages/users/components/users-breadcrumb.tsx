import { Users } from "lucide-react"

import { PageBreadcrumb } from "@/components/page-breadcrumb"

export function UsersBreadcrumb() {
  return <PageBreadcrumb items={[{ label: "Usuários", icon: Users }]} />
}
