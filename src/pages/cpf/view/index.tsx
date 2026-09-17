import { CheckCircle, FileText, IdCard } from "lucide-react"
import { useParams } from "react-router-dom"

import { AddressFileView } from "@/pages/address-search/file-view"
import { useAddressFileViewController } from "@/pages/address-search/view-controller"

export function CPFFileViewPage() {
  const { fileId = "" } = useParams<{ fileId: string }>()
  const { file, results, isLoading, isError, downloadFile } = useAddressFileViewController(
    fileId,
    "cpf"
  )

  return (
    <AddressFileView
      backPath="/cpf"
      backLabel="CPF"
      breadcrumbItems={[
        { label: "Checker", icon: CheckCircle },
        { label: "Buscar por CPF", href: "/cpf", icon: IdCard },
        { label: file?.fileName || "Resultados", icon: FileText, className: "max-w-50" },
      ]}
      fileName={file?.fileName ?? ""}
      fileId={fileId}
      documentType="cpf"
      results={results}
      isLoading={isLoading}
      isError={isError}
      notFound={!isLoading && !isError && !file}
      onDownloadAll={async (format) => {
        if (!file) return

        await downloadFile({ id: file.id, fileName: file.fileName, format })
      }}
    />
  )
}
