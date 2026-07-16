import { cn } from "@/lib/utils"

export function DefaultLayout({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("container mx-auto space-y-6 p-6", className)}>
      {children}
    </div>
  )
}
