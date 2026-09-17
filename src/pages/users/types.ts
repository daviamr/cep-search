import { UserRole } from "@/enums/user-role.enum"

export {
  UserRole,
  USER_ROLE_LABELS,
  canManageTargetUser,
  getAssignableRoles,
  isAdminRole,
} from "@/enums/user-role.enum"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  client_id: string | null
  client: string
  created_at: string
  updated_at: string
}
