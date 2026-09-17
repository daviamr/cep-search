import { useMutation } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"

import { signIn, type SignInRequest } from "@/lib/api/auth"

export function useSignInController() {
  const signInMutation = useMutation({
    mutationFn: (credentials: SignInRequest) => signIn(credentials),
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        toast.error("E-mail ou senha inválidos.")
        return
      }

      toast.error("Não foi possível entrar. Tente novamente.")
    },
  })

  return {
    signIn: signInMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
  }
}
