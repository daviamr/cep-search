export type ViaCepResponse = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export async function fetchViaCep(cep: string): Promise<ViaCepResponse | null> {
  const digits = cep.replace(/\D/g, "")

  if (digits.length !== 8) {
    return null
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
    const data = (await response.json()) as ViaCepResponse

    if (data.erro) {
      return null
    }

    return data
  } catch (error) {
    console.error(error)
    return null
  }
}
