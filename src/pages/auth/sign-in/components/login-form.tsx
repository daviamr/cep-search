import { useState, type ComponentProps } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import { useSignInController } from "../controller"

type SignInFormValues = {
  email: string
  password: string
}

export function LoginForm({ className, ...props }: ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, isSigningIn } = useSignInController()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit({ email, password }: SignInFormValues) {
    try {
      await signIn({ email: email.trim(), password })
    } catch {
      // Erro já tratado no controller (toast)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <img
                  src="/buscaendereco.png"
                  alt="Busca Endereço"
                  className="mb-2 h-10 w-auto object-contain"
                />
                <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                <p className="text-balance text-muted-foreground">Entre na sua conta</p>
              </div>

              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Informe o e-mail.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Informe um e-mail válido.",
                  },
                }}
                render={({ field }) => (
                  <Field data-invalid={!!errors.email || undefined}>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      disabled={isSigningIn}
                      aria-invalid={!!errors.email}
                      {...field}
                    />
                    <FieldError errors={[errors.email]} />
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Informe a senha.",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres.",
                  },
                }}
                render={({ field }) => (
                  <Field data-invalid={!!errors.password || undefined}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Senha</FieldLabel>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className="pr-10"
                        disabled={isSigningIn}
                        aria-invalid={!!errors.password}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        disabled={isSigningIn}
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" aria-hidden="true" />
                        ) : (
                          <Eye className="size-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                    <FieldError errors={[errors.password]} />
                  </Field>
                )}
              />

              <Field>
                <Button type="submit" disabled={isSigningIn}>
                  {isSigningIn ? (
                    <>
                      <Spinner />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
              <img
                src="/buscaendereco.png"
                alt="Ilustração de login"
                className="max-h-24 w-auto object-contain px-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao clicar em continuar, você concorda com nossos{" "}
        <Link to="/termos-de-servico" className="underline underline-offset-4 hover:text-primary">
          Termos de Serviço
        </Link>{" "}
        e{" "}
        <Link
          to="/politica-de-privacidade"
          className="underline underline-offset-4 hover:text-primary"
        >
          Política de Privacidade
        </Link>
        .
      </FieldDescription>
    </div>
  )
}
