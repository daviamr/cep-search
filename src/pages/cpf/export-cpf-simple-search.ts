import { formatCnpj, formatCpf } from "@/lib/format"
import {
  downloadSpreadsheetSheets,
  type SpreadsheetDownloadFormat,
} from "@/utils/spreadsheet-download.util"

import type { CpfSimpleSearchResult } from "./simple-search-types"

const ADDRESS_HEADERS = [
  "CPF",
  "Nome",
  "CEP",
  "Logradouro",
  "Número",
  "Complemento",
  "Bairro",
  "Cidade",
  "Estado",
  "UF",
  "Origem",
]

const COMPANY_HEADERS = ["CPF", "Nome", "CNPJ", "Razão Social", "Qualificação", "UF", "Cidade"]

export function exportCpfSimpleSearch(
  result: CpfSimpleSearchResult,
  format: SpreadsheetDownloadFormat
) {
  downloadSpreadsheetSheets(
    [
      {
        name: "Endereços",
        rows: [
          ADDRESS_HEADERS,
          ...result.addresses.map((address) => [
            formatCpf(result.socio.cpf),
            result.socio.nome,
            address.cep,
            address.logradouro,
            address.numero,
            address.complemento,
            address.bairro,
            address.cidade,
            address.estado,
            address.uf,
            address.origem,
          ]),
        ],
      },
      {
        name: "Empresas",
        rows: [
          COMPANY_HEADERS,
          ...result.companies.map((company) => [
            formatCpf(result.socio.cpf),
            result.socio.nome,
            formatCnpj(company.cnpj),
            company.razaoSocial,
            company.qualificacao,
            company.uf,
            company.cidade,
          ]),
        ],
      },
    ],
    `consulta-cpf-${result.socio.cpf}`,
    format
  )
}
