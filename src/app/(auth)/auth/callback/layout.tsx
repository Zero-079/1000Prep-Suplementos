import Link from "next/link"
import Image from "next/image"

export default function AuthCallbackLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <span aria-hidden="true" className="text-lg leading-none">←</span>
        <span className="text-sm font-medium">Volver al inicio</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="lg:hidden flex justify-center mb-8">
          <Link href="/" className="flex items-center">
            <Image src="/LOGO_1000PREP_SUPLEMENTOS3.png" alt="1000Prep" width={180} height={48} priority className="h-12 w-auto" loading="eager"/>
          </Link>
        </div>

        {children}
      </div>
    </div>
  )
}