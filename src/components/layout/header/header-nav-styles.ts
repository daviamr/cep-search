import { cn } from "@/lib/utils"

export function getHeaderNavTriggerClass(isActive: boolean, className?: string) {
  return cn(
    "transition-colors duration-200",
    isActive
      ? "text-primary"
      : "text-headerbar-muted group-hover:text-primary data-[state=open]:text-primary",
    className
  )
}

export function getHeaderHoverCardItemClass(isActive: boolean) {
  return cn(
    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-foreground hover:bg-primary/10 hover:text-primary"
  )
}

export function getHeaderMenuDropdownItemClass(isActive = false) {
  return cn(
    "cursor-pointer transition-colors",
    "focus:bg-primary/10 focus:text-primary not-data-[variant=destructive]:focus:**:text-primary",
    "data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary",
    isActive && "bg-primary/10 text-primary"
  )
}
