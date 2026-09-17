import { useState } from "react"
import { Loader2, UserPlus } from "lucide-react"
import { toast } from "sonner"

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
import { useAuth } from "@/context/auth-provider"
import { getAssignableRoles } from "@/enums/user-role.enum"

import { useUsersController } from "../controller"
import { UserRole } from "../types"
import {
  EMPTY_USER_FORM,
  isUserFormValid,
  UserForm,
  type UserFormValues,
} from "./user-form"

function getInitialFormValues(allowedRoles: UserRole[]): UserFormValues {
  const defaultRole = allowedRoles.length === 1 ? allowedRoles[0] : ""

  return {
    ...EMPTY_USER_FORM,
    role: defaultRole,
  }
}

export function CreateUserDialog() {
  const { user } = useAuth()
  const { createUser, isCreatingUser } = useUsersController()
  const allowedRoles = getAssignableRoles(user?.role)
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<UserFormValues>(() =>
    getInitialFormValues(allowedRoles)
  )

  function handleOpenChange(nextOpen: boolean) {
    if (isCreatingUser) return

    setOpen(nextOpen)

    if (nextOpen) {
      setValues(getInitialFormValues(allowedRoles))
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isUserFormValid(values, true) || !values.role) {
      return
    }

    if (!allowedRoles.includes(values.role)) {
      toast.error("Você não tem permissão para criar este nível de usuário.")
      return
    }

    try {
      await createUser({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.role,
      })
      setOpen(false)
    } catch {
      // Erro já tratado no controller (toast)
    }
  }

  if (!allowedRoles.length) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="size-4" />
          Novo usuário
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar um novo usuário.
          </DialogDescription>
        </DialogHeader>

        <form id="create-user-form" className="space-y-4" onSubmit={handleSubmit}>
          <UserForm
            id="create-user"
            values={values}
            onChange={setValues}
            passwordRequired
            allowedRoles={allowedRoles}
          />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isCreatingUser}
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="create-user-form"
            disabled={isCreatingUser || !isUserFormValid(values, true)}
          >
            {isCreatingUser ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Salvando…
              </>
            ) : (
              "Criar usuário"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
