import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { Header } from "./components/layout/header/Header.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CNPJPage } from "./pages/cnpj/index.tsx"
import { CPFPage } from "./pages/cpf/index.tsx"
import { CPFFileViewPage } from "./pages/cpf/view/index.tsx"
import { CEPPage } from "./pages/cep/index.tsx"
import { CEPFileViewPage } from "./pages/cep/view/index.tsx"
import App from "./App.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="theme">
        <Header />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/cnpj" element={<CNPJPage />} />
          <Route path="/cpf" element={<CPFPage />} />
          <Route path="/cpf/:fileId" element={<CPFFileViewPage />} />
          <Route path="/cep" element={<CEPPage />} />
          <Route path="/cep/:fileId" element={<CEPFileViewPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
