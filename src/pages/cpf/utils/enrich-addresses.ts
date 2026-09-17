import { fetchViaCep } from "@/lib/api/viacep"
import { formatCep, formatCpf } from "@/lib/format"

import type { CpfAddressRecord } from "@/lib/api/cpf"
import type { EnrichedAddress } from "@/pages/address-search/types"

function displayValue(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : "—"
}

export async function enrichCpfAddresses(
  records: CpfAddressRecord[]
): Promise<EnrichedAddress[]> {
  const cepCache = new Map<string, Awaited<ReturnType<typeof fetchViaCep>>>()

  async function getViaCep(cep: string) {
    const normalized = cep.replace(/\D/g, "")

    if (cepCache.has(normalized)) {
      return cepCache.get(normalized) ?? null
    }

    const data = await fetchViaCep(normalized)
    cepCache.set(normalized, data)
    return data
  }

  return Promise.all(
    records.map(async (record, index) => {
      const viaCep = await getViaCep(record.CEP)

      return {
        id: `${index}-${record.ID}`,
        cpf: displayValue(formatCpf(record.CPF)),
        cep: formatCep(record.CEP),
        logradouro: displayValue(viaCep?.logradouro),
        numero: displayValue(record.Numero),
        complemento: displayValue(record.Complemento),
        bairro: displayValue(viaCep?.bairro),
        cidade: displayValue(viaCep?.localidade),
        estado: displayValue(record.Estado),
        uf: displayValue(record.UF || viaCep?.uf),
        origem: displayValue(record.Origem),
      }
    })
  )
}
