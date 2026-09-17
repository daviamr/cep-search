import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { CLIENT_OPTIONS } from '../constants'
import { USER_ROLE_LABELS, UserRole } from '../types'

export type UserFormValues = {
  name: string
  email: string
  password: string
  role: UserRole | ''
  client: string
}

export const EMPTY_USER_FORM: UserFormValues = {
  name: '',
  email: '',
  password: '',
  role: '',
  client: '',
}

type UserFormProps = {
  id: string
  values: UserFormValues
  onChange: (values: UserFormValues) => void
  passwordRequired?: boolean
  passwordHint?: string
  allowedRoles?: UserRole[]
}

export function UserForm({
  id,
  values,
  onChange,
  passwordRequired = true,
  passwordHint,
  allowedRoles,
}: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const roleOptions = (allowedRoles ?? Object.keys(USER_ROLE_LABELS) as UserRole[]).map(
    (role) => [role, USER_ROLE_LABELS[role]] as const,
  )

  function updateField<K extends keyof UserFormValues>(field: K, value: UserFormValues[K]) {
    const nextValues = { ...values, [field]: value }

    if (field === 'role' && value !== UserRole.Admin) {
      nextValues.client = ''
    }

    onChange(nextValues)
  }

  return (
    <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field>
        <FieldLabel htmlFor={`${id}-name`}>Nome</FieldLabel>
        <Input
          id={`${id}-name`}
          value={values.name}
          placeholder="Nome completo"
          required
          onChange={(event) => updateField('name', event.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor={`${id}-email`}>E-mail</FieldLabel>
        <Input
          id={`${id}-email`}
          type="email"
          value={values.email}
          placeholder="usuario@empresa.com"
          required
          onChange={(event) => updateField('email', event.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor={`${id}-password`}>Senha</FieldLabel>
        <div className="relative">
          <Input
            id={`${id}-password`}
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            placeholder={passwordRequired ? 'Digite a senha' : 'Nova senha (opcional)'}
            required={passwordRequired}
            className="pr-10"
            onChange={(event) => updateField('password', event.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        {passwordHint ? <FieldDescription>{passwordHint}</FieldDescription> : null}
      </Field>

      <Field>
        <FieldLabel htmlFor={`${id}-role`}>Nível de usuário</FieldLabel>
        <Select
          value={values.role || undefined}
          onValueChange={(value) => updateField('role', value as UserRole)}
        >
          <SelectTrigger id={`${id}-role`} className="w-full">
            <SelectValue placeholder="Selecione o nível" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {values.role === UserRole.Admin ? (
        <Field>
          <FieldLabel htmlFor={`${id}-client`}>Cliente vinculado</FieldLabel>
          <Select value={values.client || undefined} onValueChange={(value) => updateField('client', value)}>
            <SelectTrigger id={`${id}-client`} className="w-full">
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              {CLIENT_OPTIONS.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      ) : null}
    </FieldGroup>
  )
}

export function isUserFormValid(values: UserFormValues, passwordRequired: boolean): boolean {
  if (!values.name.trim() || !values.email.trim() || !values.role) {
    return false
  }

  if (passwordRequired && !values.password.trim()) {
    return false
  }

  if (values.role === UserRole.Admin && !values.client) {
    return false
  }

  return true
}
