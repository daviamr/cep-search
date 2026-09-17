import { CheckCircle, Map } from "lucide-react"

import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { MassSearchSection } from "@/pages/address-search/mass-search-section"
import { useMassSearchController } from "@/pages/address-search/controller"

import { CepSimpleQuery } from "./components/cep-simple-query"

export function CEPPage() {
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
  } = useMassSearchController("cep")

  return (
    <div className="container mx-auto space-y-6 p-6">
      <PageBreadcrumb
        items={[
          { label: "Checker", icon: CheckCircle },
          { label: "Buscar por CEP", icon: Map },
        ]}
      />

      <CepSimpleQuery />

      <Separator />

      <MassSearchSection
        documentType="CEP"
        viewBasePath="/cep"
        files={files}
        isLoadingFiles={isLoadingFiles}
        isErrorFiles={isErrorFiles}
        isUploadingFile={isUploadingFile}
        downloadingFileId={downloadingFileId}
        removingFileId={removingFileId}
        exampleFileName="exemplo-ceps.csv"
        exampleHeader="cep;numero;complemento"
        exampleRows={[
          "01001000;;",
          "20040020;272;",
          "30130010;100;Apto 101",
        ]}
        uploadTitle="Nova consulta de CEPs"
        uploadDescription="Envie um arquivo .csv (separador ;) ou .xlsx. Pode ter só a coluna CEP, CEP + número, ou CEP + número + complemento."
        emptyDescription="Envie um arquivo com CEP, CEP + número, ou CEP + número + complemento para acompanhar o processamento dos resultados aqui."
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
