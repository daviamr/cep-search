import { CheckCircle, IdCard } from "lucide-react"

import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { MassSearchSection } from "@/pages/address-search/mass-search-section"
import { useMassSearchController } from "@/pages/address-search/controller"

import { CpfSimpleQuery } from "./components/cpf-simple-query"

export function CPFPage() {
  const {
    files,
    isLoadingFiles,
    isErrorFiles,
    uploadFile,
    isUploadingFile,
    downloadFile,
    downloadingFileId,
    removeFile,
    removingFileId,
  } = useMassSearchController("cpf")

  return (
    <div className="container mx-auto space-y-6 p-6">
      <PageBreadcrumb
        items={[
          { label: "Checker", icon: CheckCircle },
          { label: "Buscar por CPF", icon: IdCard },
        ]}
      />

      <CpfSimpleQuery />

      <Separator />

      <MassSearchSection
        documentType="CPF"
        viewBasePath="/cpf"
        files={files}
        isLoadingFiles={isLoadingFiles}
        isErrorFiles={isErrorFiles}
        isUploadingFile={isUploadingFile}
        downloadingFileId={downloadingFileId}
        removingFileId={removingFileId}
        exampleFileName="exemplo-cpfs.csv"
        exampleHeader="cpf"
        exampleRows={["11144477735", "52998224725", "12345678909"]}
        uploadTitle="Nova consulta de CPFs"
        uploadDescription="Envie um arquivo .csv (separador ;) ou .xlsx com a lista de CPFs para consulta."
        emptyDescription="Envie um arquivo com a lista de CPFs para acompanhar o processamento dos resultados aqui."
        onUpload={uploadFile}
        onDownload={async (fileId, fileName, format) => {
          await downloadFile({ id: fileId, fileName, format })
        }}
        onRemove={async (id) => {
          await removeFile(String(id))
        }}
      />
    </div>
  )
}
