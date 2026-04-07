// src/components/footer.tsx
import Link from "next/link"
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter } from "lucide-react"
import Image from "next/image"

const footerLinks = {
  servicios: [
    { label: "Suplementos", href: "/" },
  ],
  empresa: [
    { label: "Sobre Nosotros", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  legal: [
    { label: "Aviso Legal", href: "#" },
    { label: "Política de Privacidad", href: "#" },
    { label: "Términos y Condiciones", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer id="contacto" className="bg-foreground text-background py-16 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image
                src="/LOGO_1000PREP_SUPLEMENTOS3.png"
                alt="1000Prep Logo"
                width={120}
                height={32}
                priority
                style={{ height: "auto" }}
                className="w-32"
              />
            </Link>
            <p className="text-background/70 leading-relaxed mb-6 max-w-sm">
              Suplementos deportivos de calidad, seleccionados por nuestros nutricionistas.
            </p>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-center gap-3"><Mail className="w-4 h-4" /><span>contacto@1000prep.com</span></div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4" /><span>+57 300 123 4567</span></div>
              <div className="flex items-center gap-3"><MapPin className="w-4 h-4" /><span>Ibagué, Colombia</span></div>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors" aria-label="Instagram"><Instagram className="w-4 h-4 text-background" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors" aria-label="Facebook"><Facebook className="w-4 h-4 text-background" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors" aria-label="Twitter"><Twitter className="w-4 h-4 text-background" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Servicios</h4>
            <ul className="space-y-3">
              {footerLinks.servicios.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-background mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-background mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">© 2026 1000Prep. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm text-background/50">
            <Link href="#" className="hover:text-background transition-colors">Política de Privacidad</Link>
            <Link href="#" className="hover:text-background transition-colors">Términos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
