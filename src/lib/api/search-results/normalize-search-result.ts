import type {
  SearchCpfEmpresaApi,
  SearchCpfRawResultApi,
  SearchCpfResultApi,
  SearchCpfSocioApi,
} from "@/lib/api/socios"
import { removeCaracteres } from "@/utils/remove-caracteres.util"

export type LegacyCnpjSocioApi = {
  cidade?: string
  cnpj_completo?: string
  cpf?: string
  faixa_etaria?: string | number
  nome_socio?: string
  porte?: string
  qualificacao?: string
  razao_social?: string
  uf?: string
  situacao_cadastral?: string | number
}

export type LegacyCpfSocioInfoApi = {
  name?: string
  cpf_cnpj?: string
  qualificacao?: string
  data_entrada?: string
  faixa_etaria?: number
}

export type LegacyCpfEmpresaInfoApi = {
  base_cnpj?: string
  name?: string
  porte?: string
  capital?: number
  capital_social?: number
  faturamento?: string
  uf?: string
  municipio?: string | { name?: string }
  situacao_cadastral?: number | string
  cnae_principal?: number
  cnae_descricao?: string
  optante_mei?: boolean
}

export type LegacyCpfEmpresaVinculoApi = {
  socio?: LegacyCpfSocioInfoApi
  empresa?: LegacyCpfEmpresaInfoApi
  matriz?: {
    uf?: string
    municipio?: string | { name?: string }
    cnae_principal?: number
    cnae_descricao?: string
    situacao_cadastral?: number | string
    optante_mei?: boolean
  }
  cnpj?: string
  uf?: string
  municipio?: string
  situacao_cadastral?: number | string
  cnae_principal?: number
  cnae_descricao?: string
  optante_mei?: boolean
}

function parseNumericCode(value: string | number | undefined): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  const parsed = Number(String(value).replace(/\D/g, ''))

  return Number.isFinite(parsed) ? parsed : undefined
}

function parseCapitalSocial(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  const parsed = Number(String(value).replace(/\./g, '').replace(',', '.'))

  return Number.isFinite(parsed) ? parsed : null
}

function resolveMunicipioName(value: string | { name?: string } | undefined): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  return value.name
}

function createSocioFromLegacy(
  socio: Partial<SearchCpfSocioApi & LegacyCpfSocioInfoApi>,
  index: number,
): SearchCpfSocioApi {
  return {
    id: 'id' in socio && typeof socio.id === 'number' ? socio.id : index,
    nome: socio.nome || socio.name || '—',
    qualificacao: socio.qualificacao || '—',
    tipo: 'tipo' in socio && typeof socio.tipo === 'number' ? socio.tipo : 0,
    cpf_cnpj: socio.cpf_cnpj || socio.cpf_completo || '',
    cpf_completo: removeCaracteres(socio.cpf_completo || socio.cpf_cnpj || ''),
    data_entrada: socio.data_entrada || '',
    faixa_etaria:
      typeof socio.faixa_etaria === 'number'
        ? socio.faixa_etaria
        : parseNumericCode(socio.faixa_etaria) ?? 0,
  }
}

function createEmpresaRecord(
  empresa: Partial<SearchCpfEmpresaApi> | LegacyCpfEmpresaInfoApi | undefined,
  cnpj: string,
  cnpjBase: string,
  fields: {
    uf?: string
    municipio?: string
    situacaoCadastral?: number
    cnaePrincipal?: number
    cnaeDescricao?: string
    optanteMei?: boolean
    capitalSocial?: number | null
    faturamento?: string | null
    cep?: string
    logradouro?: string
    numero?: string
    bairro?: string
    tipoLogradouro?: string
  },
): SearchCpfEmpresaApi {
  const legacyEmpresa = (empresa ?? {}) as LegacyCpfEmpresaInfoApi & Partial<SearchCpfEmpresaApi>

  return {
    cnpj,
    cnpj_base: cnpjBase,
    razao_social: legacyEmpresa.razao_social || legacyEmpresa.name || '—',
    porte: legacyEmpresa.porte,
    uf: fields.uf ?? legacyEmpresa.uf,
    municipio: fields.municipio ?? resolveMunicipioName(legacyEmpresa.municipio),
    situacao_cadastral: fields.situacaoCadastral ?? parseNumericCode(legacyEmpresa.situacao_cadastral),
    cnae_principal: fields.cnaePrincipal ?? legacyEmpresa.cnae_principal,
    cnae_descricao: fields.cnaeDescricao ?? legacyEmpresa.cnae_descricao,
    optante_mei: fields.optanteMei ?? legacyEmpresa.optante_mei,
    capital_social:
      fields.capitalSocial ??
      parseCapitalSocial(legacyEmpresa.capital_social ?? legacyEmpresa.capital) ??
      undefined,
    faturamento: fields.faturamento ?? legacyEmpresa.faturamento,
    cep: fields.cep ?? legacyEmpresa.cep,
    logradouro: fields.logradouro ?? legacyEmpresa.logradouro,
    numero: fields.numero ?? legacyEmpresa.numero,
    bairro: fields.bairro ?? legacyEmpresa.bairro,
    tipo_logradouro: fields.tipoLogradouro ?? legacyEmpresa.tipo_logradouro,
  }
}

function normalizeModernSearchResult(
  item: SearchCpfRawResultApi,
  index: number,
): SearchCpfResultApi | null {
  const socioSource = item.socio
  const empresaSource = item.empresa
  const estabelecimento = item.estabelecimento

  if (!socioSource) {
    return null
  }

  const cnpj = removeCaracteres(
    estabelecimento?.cnpj || item.cnpj || empresaSource?.cnpj || empresaSource?.cnpj_base || '',
  )

  const cnpjBase = removeCaracteres(
    estabelecimento?.cnpj_base ||
      empresaSource?.cnpj_base ||
      item.cnpj_base ||
      cnpj.slice(0, 8),
  )

  const uf = estabelecimento?.uf || item.uf || empresaSource?.uf
  const municipio =
    resolveMunicipioName(estabelecimento?.municipio) ||
    resolveMunicipioName(item.municipio) ||
    resolveMunicipioName(empresaSource?.municipio)

  const situacaoCadastral = parseNumericCode(
    estabelecimento?.situacao_cadastral ??
      item.situacao_cadastral ??
      empresaSource?.situacao_cadastral,
  )

  const cnaePrincipal =
    estabelecimento?.cnae_principal ?? item.cnae_principal ?? empresaSource?.cnae_principal

  const cnaeDescricao =
    estabelecimento?.cnae_descricao ?? item.cnae_descricao ?? empresaSource?.cnae_descricao

  const optanteMei =
    estabelecimento?.optante_mei ?? item.optante_mei ?? empresaSource?.optante_mei

  const capitalSocial =
    parseCapitalSocial(item.capital_social) ??
    parseCapitalSocial(empresaSource?.capital_social ?? empresaSource?.capital)

  const faturamento = item.faturamento ?? empresaSource?.faturamento ?? null

  return {
    cnpj,
    cnpj_base: cnpjBase,
    uf,
    municipio,
    situacao_cadastral: situacaoCadastral,
    cnae_principal: cnaePrincipal,
    cnae_descricao: cnaeDescricao,
    optante_mei: optanteMei,
    capital_social: capitalSocial,
    faturamento,
    empresa: createEmpresaRecord(empresaSource, cnpj, cnpjBase, {
      uf,
      municipio,
      situacaoCadastral,
      cnaePrincipal,
      cnaeDescricao,
      optanteMei,
      capitalSocial,
      faturamento,
      cep: estabelecimento?.cep,
      logradouro: estabelecimento?.logradouro,
      numero: estabelecimento?.numero,
      bairro: estabelecimento?.bairro,
      tipoLogradouro: estabelecimento?.tipo_logradouro,
    }),
    socio: createSocioFromLegacy(socioSource, index),
  }
}

export function normalizeLegacyCnpjSocio(
  socio: LegacyCnpjSocioApi,
  index: number,
): SearchCpfResultApi {
  const cnpj = removeCaracteres(socio.cnpj_completo ?? '')

  return normalizeModernSearchResult(
    {
      cnpj,
      uf: socio.uf,
      municipio: socio.cidade,
      situacao_cadastral: socio.situacao_cadastral,
      empresa: {
        razao_social: socio.razao_social,
        porte: socio.porte,
      },
      socio: {
        nome: socio.nome_socio,
        cpf_cnpj: socio.cpf,
        cpf_completo: socio.cpf,
        qualificacao: socio.qualificacao,
        faixa_etaria: parseNumericCode(socio.faixa_etaria),
      },
    },
    index,
  ) as SearchCpfResultApi
}

export function normalizeLegacyCpfVinculo(
  vinculo: LegacyCpfEmpresaVinculoApi,
  index: number,
): SearchCpfResultApi | null {
  const socioSource = vinculo.socio
  const empresaSource = vinculo.empresa
  const matriz = vinculo.matriz

  if (!socioSource || !empresaSource) {
    return null
  }

  return normalizeModernSearchResult(
    {
      cnpj: vinculo.cnpj || empresaSource.base_cnpj,
      uf: vinculo.uf || matriz?.uf || empresaSource.uf,
      municipio:
        vinculo.municipio ||
        resolveMunicipioName(matriz?.municipio) ||
        resolveMunicipioName(empresaSource.municipio),
      situacao_cadastral:
        vinculo.situacao_cadastral ?? matriz?.situacao_cadastral ?? empresaSource.situacao_cadastral,
      cnae_principal:
        vinculo.cnae_principal ?? matriz?.cnae_principal ?? empresaSource.cnae_principal,
      cnae_descricao:
        vinculo.cnae_descricao ?? matriz?.cnae_descricao ?? empresaSource.cnae_descricao,
      optante_mei: vinculo.optante_mei ?? matriz?.optante_mei ?? empresaSource.optante_mei,
      empresa: {
        ...empresaSource,
        municipio: resolveMunicipioName(empresaSource.municipio),
      },
      socio: socioSource,
    },
    index,
  )
}

function isLegacyFlatCnpjSocio(value: unknown): value is LegacyCnpjSocioApi {
  if (!value || typeof value !== 'object') return false

  const item = value as LegacyCnpjSocioApi

  return Boolean(item.nome_socio || item.cnpj_completo) && !('socio' in item)
}

export function normalizeSearchResultItem(
  result: unknown,
  index: number,
): SearchCpfResultApi | null {
  if (!result || typeof result !== 'object') {
    return null
  }

  if (isLegacyFlatCnpjSocio(result)) {
    return normalizeLegacyCnpjSocio(result, index)
  }

  const item = result as SearchCpfRawResultApi & LegacyCpfEmpresaVinculoApi

  if (item.socio) {
    return normalizeModernSearchResult(item, index)
  }

  return normalizeLegacyCpfVinculo(item, index)
}

export function normalizeSearchResults(results: unknown[]): SearchCpfResultApi[] {
  return results
    .map((result, index) => normalizeSearchResultItem(result, index))
    .filter((result): result is SearchCpfResultApi => result !== null)
}
