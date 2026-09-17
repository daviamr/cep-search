import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type LegalSection = {
  title: string
  body: string
}

type LegalDocumentPageProps = {
  title: string
  intro: string
  sections: LegalSection[]
}

export function LegalDocumentPage({ title, intro, sections }: LegalDocumentPageProps) {
  return (
    <div className="relative flex min-h-svh flex-col bg-muted p-6 md:p-10">
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="size-4" />
            Voltar para o login
          </Link>
        </Button>
      </div>

      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <ModeToggle />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center py-14">
        <Card className="w-full">
          <CardContent className="space-y-8 p-6 md:p-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <img
                src="/buscaendereco.png"
                alt="Busca Endereço"
                className="h-10 w-auto object-contain"
              />
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
            </div>

            <p className="text-sm text-muted-foreground">{intro}</p>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <section key={section.title} className="space-y-2">
                  <h2 className="text-base font-semibold tracking-tight">
                    {index + 1}. {section.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
                </section>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
