import { useMemo, useState, type FormEvent } from "react"
import { Download, IdCard, Loader2, Search, X } from "lucide-react"
import { toast } from "sonner"

import { DataTable, DataTablePagination, DataTableProvider } from "@/components/data-table"
import { DownloadFile } from "@/components/download-file"
import { EmptyStateCard } from "@/components/empty-state-card"
import { HoverCard } from "@/components/hover-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCpf } from "@/lib/format"
import { cpfAddressTabColumns } from "@/pages/address-search/address-columns"
import { useInvalidateCredits } from "@/pages/credits/use-invalidate-credits"
import { removeCaracteres } from "@/utils/remove-caracteres.util"

import { getCpfCompanyColumns } from "../company-columns"
import { exportCpfSimpleSearch } from "../export-cpf-simple-search"
import { searchCpfSimple } from "../search-cpf-simple"
import type { CpfSimpleSearchResult } from "../simple-search-types"

const CPF_STORAGE_KEY = "busca-endereco:cpf-simple"
const NO_SOCIO_MESSAGE = "Nenhum vínculo societário encontrado para este CPF."

export function CpfSimpleQuery() {
  const invalidateCredits = useInvalidateCredits()
  const [document, setDocument] = useState(() => sessionStorage.getItem(CPF_STORAGE_KEY) ?? "")
  const [result, setResult] = useState<CpfSimpleSearchResult | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState("addresses")
  const [searchKey, setSearchKey] = useState(0)

  const companyColumns = useMemo(() => getCpfCompanyColumns(), [])
  const canClear = document.trim().length > 0 || hasSearched

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const digits = removeCaracteres(document)

    if (digits.length !== 11) {
      toast.error("Informe um CPF válido com 11 dígitos.")
      return
    }

    setIsSearching(true)

    try {
      const nextResult = await searchCpfSimple(digits)

      await invalidateCredits()

      setResult(nextResult)
      setHasSearched(true)
      setActiveTab("addresses")
      setSearchKey((current) => current + 1)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível consultar o CPF."
      )
      setResult(null)
      setHasSearched(false)
    } finally {
      setIsSearching(false)
    }
  }

  function handleDocumentChange(value: string) {
    setDocument(value)
    sessionStorage.setItem(CPF_STORAGE_KEY, value)
  }

  function handleClear() {
    setDocument("")
    sessionStorage.removeItem(CPF_STORAGE_KEY)
    setResult(null)
    setHasSearched(false)
    setActiveTab("addresses")
  }

  function handleExport(format: "xlsx" | "csv") {
    if (!result) return

    try {
      exportCpfSimpleSearch(result, format)
    } catch {
      toast.error("Não foi possível exportar os resultados.")
    }
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Consulta simples</h2>
        <p className="text-sm text-muted-foreground">
          Informe um CPF para visualizar os endereços e as empresas vinculadas.
        </p>
      </div>

      <form
        className="flex flex-wrap items-end gap-2 rounded-xl border border-border bg-card p-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cpf-simple-query">CPF</Label>
          <Input
            id="cpf-simple-query"
            placeholder="000.000.000-00"
            value={document}
            onChange={(event) => handleDocumentChange(event.target.value)}
            disabled={isSearching}
            className="h-8 w-45 lg:w-55"
          />
        </div>

        <Button type="submit" size="sm" disabled={isSearching || !document.trim()}>
          {isSearching ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
          Consultar
        </Button>

        {canClear ? (
          <HoverCard content="Limpar filtros" side="top" closeDelay={0.5} openDelay={0.5}>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={isSearching}
              aria-label="Limpar filtros"
              onClick={handleClear}
            >
              <X className="size-4" />
            </Button>
          </HoverCard>
        ) : null}
      </form>

      {isSearching ? (
        <EmptyStateCard isLoading />
      ) : result ? (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <IdCard className="size-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold tracking-tight">
                  {result.socio.nome}
                </h3>
                <p className="text-sm text-muted-foreground">
                  CPF <span className="font-mono">{formatCpf(result.socio.cpf)}</span>
                </p>
              </div>
            </div>

            <DownloadFile
              fileId={result.socio.cpf}
              fileName={`consulta-cpf-${result.socio.cpf}`}
              showFileId={false}
              title="Exportar resultados"
              description="Escolha o formato do arquivo para baixar os endereços e as empresas vinculadas."
              confirmLabel="Baixar"
              resultStats={[
                {
                  count: result.addresses.length,
                  singular: "endereço",
                  plural: "endereços",
                },
                {
                  count: result.companies.length,
                  singular: "empresa vinculada",
                  plural: "empresas vinculadas",
                },
              ]}
              trigger={
                <Button type="button" variant="outline" size="sm">
                  <Download className="size-4" />
                  Exportar resultados
                </Button>
              }
              onDownload={async (_id, format) => {
                handleExport(format)
              }}
            />
          </div>

          <div className="space-y-4 p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="addresses">
                  Endereços
                  <Badge variant="secondary">{result.addresses.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="companies">
                  Empresas vinculadas
                  <Badge variant="secondary">{result.companies.length}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="addresses" forceMount className="data-[state=inactive]:hidden">
                <DataTableProvider
                  key={searchKey}
                  columns={cpfAddressTabColumns}
                  data={result.addresses}
                  options={{ pagination: { pageSize: 10 }, sorting: true }}
                >
                  <div className="space-y-4">
                    <DataTable
                      emptyMessage="Nenhum endereço encontrado para este CPF."
                      emptyDescription="Não há endereços para o CPF informado."
                    />
                    {result.addresses.length > 0 ? <DataTablePagination /> : null}
                  </div>
                </DataTableProvider>
              </TabsContent>

              <TabsContent value="companies" forceMount className="data-[state=inactive]:hidden">
                <DataTableProvider
                  key={searchKey}
                  columns={companyColumns}
                  data={result.companies}
                  options={{ pagination: { pageSize: 10 }, sorting: true }}
                >
                  <div className="space-y-4">
                    <DataTable emptyMessage="Nenhuma empresa vinculada encontrada." />
                    {result.companies.length > 0 ? <DataTablePagination /> : null}
                  </div>
                </DataTableProvider>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : hasSearched ? (
        <EmptyStateCard
          title={NO_SOCIO_MESSAGE}
          description="Confirme o CPF informado ou consulte outro documento."
        />
      ) : (
        <EmptyStateCard
          title="Nenhuma consulta realizada"
          description="Informe o CPF e clique em Consultar para visualizar os endereços e as empresas vinculadas."
        />
      )}
    </section>
  )
}
