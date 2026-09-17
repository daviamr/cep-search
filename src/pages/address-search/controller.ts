import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  deleteAddressEnrichmentFile,
  downloadAddressEnrichmentFile,
  listAddressEnrichmentFiles,
  submitAddressEnrichment,
} from "@/lib/api/enrichment"
import { creditsQueryKeys } from "@/pages/credits/query-keys"
import { useInvalidateCredits } from "@/pages/credits/use-invalidate-credits"
import { isProcessamentoPending } from "@/utils/format-processamento-status.util"
import type { SpreadsheetDownloadFormat } from "@/utils/spreadsheet-download.util"

import type { AddressEnrichmentColumnMapping, AddressSearchType } from "./constants"
import { mapAddressEnrichmentFiles } from "./mappers/map-address-enrichment-file"
import { addressSearchQueryKeys } from "./query-keys"

export function useMassSearchController(documentType: AddressSearchType) {
  const queryClient = useQueryClient()
  const invalidateCredits = useInvalidateCredits()

  const filesQuery = useQuery({
    queryKey: addressSearchQueryKeys.files(documentType),
    queryFn: () => listAddressEnrichmentFiles(documentType),
    select: (files) => mapAddressEnrichmentFiles(files, documentType),
  })

  const hasPendingFiles =
    filesQuery.data?.some((file) => isProcessamentoPending(file.status)) ?? false

  useEffect(() => {
    if (!hasPendingFiles) {
      return
    }

    const id = window.setInterval(() => {
      void queryClient.invalidateQueries({
        queryKey: addressSearchQueryKeys.files(documentType),
      })
      void queryClient.invalidateQueries({ queryKey: creditsQueryKeys.me() })
    }, 3000)

    return () => window.clearInterval(id)
  }, [documentType, hasPendingFiles, queryClient])

  const uploadMutation = useMutation({
    mutationFn: ({ file, mapping }: { file: File; mapping: AddressEnrichmentColumnMapping }) =>
      submitAddressEnrichment({ file, mapping, documentType }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: addressSearchQueryKeys.files(documentType),
      })
      await invalidateCredits()
      toast.success("Arquivo enviado para processamento.")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível enviar o arquivo.")
    },
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

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteAddressEnrichmentFile(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: addressSearchQueryKeys.files(documentType),
      })
      toast.success("Arquivo excluído com sucesso.")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível excluir o arquivo.")
    },
  })

  return {
    files: filesQuery.data ?? [],
    isLoadingFiles: filesQuery.isLoading,
    isErrorFiles: filesQuery.isError,
    uploadFile: (file: File, mapping: AddressEnrichmentColumnMapping) =>
      uploadMutation.mutateAsync({ file, mapping }),
    isUploadingFile: uploadMutation.isPending,
    downloadFile: downloadMutation.mutateAsync,
    downloadingFileId: downloadMutation.isPending ? (downloadMutation.variables?.id ?? null) : null,
    removeFile: removeMutation.mutateAsync,
    removingFileId: removeMutation.isPending ? (removeMutation.variables ?? null) : null,
  }
}
