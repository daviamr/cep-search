import type { AddressEnrichmentFileApi } from "@/lib/api/enrichment"
import { bytesToMb } from "@/utils/format-size-mb.util"

import { ADDRESS_SEARCH_OUTPUT_TABLE, type AddressSearchType } from "../constants"
import type { AddressFile } from "../types"

const STATUS_MAP: Record<string, string> = {
  processing: "processando",
  completed: "concluido",
  error: "erro",
}

function getOutputCount(outputStats: unknown, table: string): number {
  if (!outputStats || typeof outputStats !== "object") {
    return 0
  }

  const value = (outputStats as Record<string, unknown>)[table]

  return typeof value === "number" ? value : 0
}

export function mapAddressEnrichmentFile(
  item: AddressEnrichmentFileApi,
  documentType: AddressSearchType
): AddressFile {
  return {
    id: item.id,
    fileName: item.original_name || item.filename,
    documentType,
    sizeMb: bytesToMb(item.file_size),
    registros: item.total_input_rows ?? item.row_count ?? 0,
    resultados: getOutputCount(item.output_stats, ADDRESS_SEARCH_OUTPUT_TABLE),
    status: STATUS_MAP[item.status] ?? item.status,
    progress: item.progress ?? 0,
    errorText: item.error_text ?? null,
    createdAt: new Date(item.created_at),
  }
}

export function mapAddressEnrichmentFiles(
  items: AddressEnrichmentFileApi[],
  documentType: AddressSearchType
): AddressFile[] {
  return items.map((item) => mapAddressEnrichmentFile(item, documentType))
}
