import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  createUser,
  deleteUser,
  listUsers,
  type CreateUserRequest,
} from "@/lib/api/users"

import { usersQueryKeys } from "./query-keys"
import type { User } from "./types"
import { getUsersApiErrorMessage } from "./utils/get-users-api-error-message"

async function mapUsers(): Promise<User[]> {
  const users = await listUsers()

  return users.map((user) => ({
    ...user,
    client: "—",
  }))
}

export function useUsersController() {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: usersQueryKeys.list(),
    queryFn: mapUsers,
  })

  const createMutation = useMutation({
    mutationFn: (body: CreateUserRequest) => createUser(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersQueryKeys.list() })
      toast.success("Usuário criado com sucesso.")
    },
    onError: (error) => {
      toast.error(getUsersApiErrorMessage(error, "Não foi possível criar o usuário."))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: usersQueryKeys.list() })
      toast.success(data.message || "Usuário excluído com sucesso.")
    },
    onError: (error) => {
      toast.error(getUsersApiErrorMessage(error, "Não foi possível excluir o usuário."))
    },
  })

  return {
    users: usersQuery.data ?? ([] as User[]),
    isLoadingUsers: usersQuery.isLoading,
    isErrorUsers: usersQuery.isError,
    createUser: createMutation.mutateAsync,
    isCreatingUser: createMutation.isPending,
    deleteUser: deleteMutation.mutateAsync,
    isDeletingUser: deleteMutation.isPending,
    deletingUserId: deleteMutation.isPending ? (deleteMutation.variables ?? null) : null,
  }
}
