export const UserRole = {
  Admin: "admin",
  Manager: "manager",
  User: "user",
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Admin]: "Administrador",
  [UserRole.Manager]: "Gerente",
  [UserRole.User]: "Usuário",
}

export function isAdminRole(role?: UserRole | null) {
  return role === UserRole.Admin
}

export function getAssignableRoles(actorRole?: UserRole | null): UserRole[] {
  if (actorRole === UserRole.Admin) {
    return [UserRole.Admin, UserRole.Manager, UserRole.User]
  }

  if (actorRole === UserRole.Manager) {
    return [UserRole.User]
  }

  return []
}

export function canManageTargetUser(
  actorRole: UserRole | null | undefined,
  targetRole: UserRole
) {
  if (actorRole === UserRole.Admin) {
    return true
  }

  if (actorRole === UserRole.Manager) {
    return targetRole === UserRole.User
  }

  return false
}
