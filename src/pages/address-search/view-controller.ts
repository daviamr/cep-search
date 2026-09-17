import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  downloadAddressEnrichmentFile,
  fetchAddressEnrichmentFileBlob,
  listAddressEnrichmentFiles,
} from "@/lib/api/enrichment"
import { canAccessProcessamentoResults } from "@/utils/format-processamento-status.util"
import type { SpreadsheetDownloadFormat } from "@/utils/spreadsheet-download.util"

import type { AddressSearchType } from "./constants"
import { mapAddressEnrichmentFiles } from "./mappers/map-address-enrichment-file"
import { parseAddressEnrichmentSpreadsheet } from "./parse-address-enrichment-spreadsheet"
import { addressSearchQueryKeys } from "./query-keys"
import type { AddressFile, EnrichedAddress } from "./types"

type FileResults = {
  file: AddressFile
  results: EnrichedAddress[]
}

async function getFileResults(
  fileId: string,
  documentType: AddressSearchType
): Promise<FileResults | null> {
  const apiFiles = await listAddressEnrichmentFiles(documentType)
  const file = mapAddressEnrichmentFiles(apiFiles, documentType).find((item) => item.id === fileId)

  if (!file) {
    return null
  }

  if (!canAccessProcessamentoResults(file.status)) {
    return { file, results: [] }
  }

  const { blob } = await fetchAddressEnrichmentFileBlob(fileId)
  const results = await parseAddressEnrichmentSpreadsheet(blob)

  return { file, results }
}

export function useAddressFileViewController(fileId: string, documentType: AddressSearchType) {
  const resultsQuery = useQuery({
    queryKey: addressSearchQueryKeys.results(fileId),
    queryFn: () => getFileResults(fileId, documentType),
    enabled: Boolean(fileId),
  })

  const downloadMutation = useMutation({
    mutationFn: ({
      id,
      fileName,
      format,
    }: {
      id: string
      fileName: string
      format?: SpreadsheetDownloadFormat
    }) => downloadAddressEnrichmentFile(id, fileName, format),
    onSuccess: () => {
      toast.success("Arquivo baixado com sucesso.")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível baixar o arquivo.")
    },
  })

  return {
    file: resultsQuery.data?.file ?? null,
    results: resultsQuery.data?.results ?? [],
    isLoading: resultsQuery.isLoading,
    isError: resultsQuery.isError,
    downloadFile: downloadMutation.mutateAsync,
    isDownloadingFile: downloadMutation.isPending,
  }
}
