import type { RouteObject } from "react-router-dom"

import PrivacyPolicy from "@/pages/auth/legal/privacy"
import TermsOfService from "@/pages/auth/legal/terms"
import SignIn from "@/pages/auth/sign-in"

export const authRoutes: RouteObject[] = [
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/termos-de-servico",
    element: <TermsOfService />,
  },
  {
    path: "/politica-de-privacidade",
    element: <PrivacyPolicy />,
  },
]
