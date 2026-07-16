import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header/Header"

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col antialiased">
      <Header />
      <main className="mt-16 flex-1">{children}</main>
      <Footer />
    </div>
  )
}
