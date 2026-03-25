import Link from "next/link"
import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-white bg-transparent border-none hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-full px-3 py-1.5"
      >
        <span aria-hidden="true" className="text-lg leading-none font-bold">←</span>
        <span className="text-sm md:text-base font-bold hover:underline">Volver al inicio</span>
      </Link>

      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-64 rounded-full border border-primary-foreground/20" />
          <div className="absolute bottom-20 right-20 size-96 rounded-full border border-primary-foreground/20" />
          <div className="absolute top-1/2 left-1/3 size-48 rounded-full border border-primary-foreground/20" />
        </div>

        <div className="relative z-10 max-w-md text-center flex flex-col items-center gap-8">
          <Link href="/" className="flex items-center justify-center">
            <Image src="/LOGO_1000PREP_SUPLEMENTOS3.png" alt="1000Prep Logo" width={220} height={64} className="h-45 w-auto" loading="eager"/>
          </Link>
          <h2 className="text-primary-foreground text-2xl font-serif font-semibold leading-relaxed text-balance">
            Suplementos deportivos seleccionados por nutricionistas
          </h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Proteínas, vitaminas, creatina y más. Calidad verificada para alcanzar tus objetivos.
          </p>
          {/*
          <div className="flex items-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-primary-foreground text-2xl font-bold">500+</p>
              <p className="text-primary-foreground/70 text-sm">Productos</p>
            </div>
            <div className="h-8 w-px bg-primary-foreground/20" />
            <div className="text-center">
              <p className="text-primary-foreground text-2xl font-bold">10K+</p>
              <p className="text-primary-foreground/70 text-sm">Clientes</p>
            </div>
            <div className="h-8 w-px bg-primary-foreground/20" />
            <div className="text-center">
              <p className="text-primary-foreground text-2xl font-bold">100%</p>
              <p className="text-primary-foreground/70 text-sm">Puntualidad</p>
            </div>
          </div>
          */}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center">
              <Image src="/LOGO_1000PREP_SUPLEMENTOS3.png" alt="1000Prep" width={180} height={48} priority className="h-12 w-auto" loading="eager"/>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
