import type { RouteObject } from "react-router-dom"

import { RootLayout } from "@/components/layout/root-layout"
import App from "@/App"
import { ApiHistoryPage } from "@/pages/api/history"
import { CEPPage } from "@/pages/cep"
import { CEPFileViewPage } from "@/pages/cep/view"
import { CNPJPage } from "@/pages/cnpj"
import { CreditsPage } from "@/pages/credits"
import { CPFPage } from "@/pages/cpf"
import { CPFFileViewPage } from "@/pages/cpf/view"
import { StatementPage } from "@/pages/statement"
import { UsersPage } from "@/pages/users"

export const appRoutes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/cnpj", element: <CNPJPage /> },
      { path: "/cpf", element: <CPFPage /> },
      { path: "/cpf/:fileId", element: <CPFFileViewPage /> },
      { path: "/cep", element: <CEPPage /> },
      { path: "/cep/:fileId", element: <CEPFileViewPage /> },
      { path: "/api/historico", element: <ApiHistoryPage /> },
      { path: "/users", element: <UsersPage /> },
      { path: "/credits", element: <CreditsPage /> },
      { path: "/statement", element: <StatementPage /> },
    ],
  },
]
