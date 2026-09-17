import type { AddressSearchType } from "./constants"

export const addressSearchQueryKeys = {
  all: ["address-search"] as const,
  files: (documentType: AddressSearchType) =>
    [...addressSearchQueryKeys.all, "files", documentType] as const,
  results: (fileId: string) => [...addressSearchQueryKeys.all, "results", fileId] as const,
}
