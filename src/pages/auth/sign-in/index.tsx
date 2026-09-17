import { ModeToggle } from "@/components/mode-toggle"

import { LoginForm } from "./components/login-form"

export default function SignIn() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <ModeToggle />
      </div>
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
