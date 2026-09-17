import {
  downloadSpreadsheetSheets,
  type SpreadsheetDownloadFormat,
} from "@/utils/spreadsheet-download.util"

import type { AddressSearchType } from "./constants"
import type { EnrichedAddress } from "./types"

const CPF_ADDRESS_HEADERS = [
  "CPF",
  "Nome",
  "CEP",
  "Número",
  "Complemento",
  "Estado",
  "UF",
]

const CEP_ADDRESS_HEADERS = [
  "CEP",
  "Número",
  "Complemento",
  "Estado",
  "UF",
  "Origem",
]

function toCpfRow(address: EnrichedAddress): Array<string> {
  return [
    address.cpf,
    address.nome || "—",
    address.cep,
    address.numero,
    address.complemento,
    address.estado,
    address.uf,
  ]
}

function toCepRow(address: EnrichedAddress): Array<string> {
  return [
    address.cep,
    address.numero,
    address.complemento,
    address.estado,
    address.uf,
    address.origem,
  ]
}

export function downloadAddresses(
  addresses: EnrichedAddress[],
  fileName: string,
  format: SpreadsheetDownloadFormat,
  documentType: AddressSearchType = "cpf"
) {
  const isCep = documentType === "cep"

  downloadSpreadsheetSheets(
    [
      {
        name: "Endereços",
        rows: isCep
          ? [CEP_ADDRESS_HEADERS, ...addresses.map(toCepRow)]
          : [CPF_ADDRESS_HEADERS, ...addresses.map(toCpfRow)],
      },
    ],
    fileName,
    format
  )
}
