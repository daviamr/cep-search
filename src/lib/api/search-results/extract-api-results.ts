type LegacySearchData = {
  pagina?: number
  tamanho?: number
  total?: number
  resultados?: unknown[]
  socios?: unknown[]
  empresas?: unknown[]
  is_socio?: boolean
}

type ModernSearchResponse = {
  sucesso?: boolean
  success?: boolean
  mensagem?: string
  message?: string
  dados?: LegacySearchData | null
  data?: LegacySearchData | null
  erros?: Array<{ campo: string; mensagem: string }>
}

export function isSearchResponseSuccessful(response: ModernSearchResponse): boolean {
  if (response.sucesso === false || response.success === false) {
    return false
  }

  return response.sucesso === true || response.success === true
}

export function getSearchResponseErrorMessage(response: ModernSearchResponse): string {
  const fieldErrors = response.erros?.map((error) => error.mensagem).filter(Boolean)

  if (fieldErrors?.length) {
    return fieldErrors.join(', ')
  }

  return response.mensagem || response.message || 'Erro ao consultar sócios.'
}

export function extractRawSearchResults(response: ModernSearchResponse): unknown[] {
  const payload = response.dados ?? response.data

  if (!payload) {
    return []
  }

  if (Array.isArray(payload.resultados)) {
    return payload.resultados
  }

  if (Array.isArray(payload.socios)) {
    return payload.socios
  }

  if (Array.isArray(payload.empresas)) {
    if (payload.is_socio === false) {
      return []
    }

    return payload.empresas
  }

  return []
}
