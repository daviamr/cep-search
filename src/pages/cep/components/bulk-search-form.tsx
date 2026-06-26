import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileSpreadsheet, Loader2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { bulkSearchCEP } from "@/lib/api/cep"

import {
  BULK_SEARCH_ACCEPT,
  bulkSearchSchema,
  type BulkSearchInput,
  type BulkSearchValues,
} from "../schemas"

type BulkSearchFormProps = {
  onUploadSuccess?: () => void | Promise<void>
}

export function BulkSearchForm({ onUploadSuccess }: BulkSearchFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BulkSearchInput, unknown, BulkSearchValues>({
    resolver: zodResolver(bulkSearchSchema),
  })

  const selectedFile = watch("file")

  function resetForm() {
    reset()
    setUploadError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value)
    if (!value) {
      resetForm()
    }
  }

  async function onSubmit({ file }: BulkSearchValues) {
    setUploadError(null)

    const success = await bulkSearchCEP(file)

    if (!success) {
      setUploadError("Não foi possível enviar o arquivo. Tente novamente.")
      return
    }

    onUploadSuccess?.()
    handleOpenChange(false)
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setValue("file", file as File, { shouldValidate: true })
    setUploadError(null)
  }

  function handleClearFile() {
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" className="mt-6 w-fit cursor-pointer">
          <Upload />
          Enviar planilha
        </Button>
      </DialogTrigger>

      <DialogContent className="pt-6 sm:max-w-md">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-[20px]">Enviar planilha</DialogTitle>
          <DialogDescription>
            Selecione um arquivo .csv ou .xlsx com a lista de CEPs para consulta em massa.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4 mb-8 space-y-2">
            <Label htmlFor="bulk-file">Planilha</Label>

            <div className="flex items-center gap-2">
              <Input
                id="bulk-file"
                name="file"
                ref={inputRef}
                type="file"
                accept={BULK_SEARCH_ACCEPT}
                aria-invalid={Boolean(errors.file)}
                className="cursor-pointer file:mr-3 file:cursor-pointer"
                onChange={handleFileChange}
              />

              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="cursor-pointer"
                disabled={!(selectedFile instanceof File) || isSubmitting}
                aria-label="Limpar arquivo selecionado"
                onClick={handleClearFile}
              >
                <X />
              </Button>
            </div>

            <p
              className={
                selectedFile instanceof File
                  ? "flex items-center gap-2 text-xs text-foreground"
                  : "text-xs text-muted-foreground"
              }
            >
              <FileSpreadsheet className="size-3.5 shrink-0" />
              <span className="my-1 truncate">
                {selectedFile instanceof File
                  ? selectedFile.name
                  : "Nenhum arquivo selecionado"}
              </span>
            </p>

            {errors.file && (
              <p className="text-sm text-destructive">{errors.file.message}</p>
            )}
            {uploadError && (
              <p className="text-sm text-destructive">{uploadError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
