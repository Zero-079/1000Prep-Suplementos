"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  User,
  MapPin,
  Lock,
  Trash2,
  Camera,
  Pencil,
  Plus,
  AlertTriangle,
  ChevronRight,
  Home,
  Building2,
} from "lucide-react"

// ── Types ───────────────────────────────────────────────────────────────────
type SectionId = "info" | "addresses" | "password" | "delete"

interface Address {
  id: string
  label: string
  street: string
  neighborhood: string
  city: string
  references: string
  icon: "home" | "work"
}

// ── Hardcoded data ──────────────────────────────────────────────────────────
const USER_DATA = {
  name: "Germán Pérez",
  email: "german.perez@email.com",
  avatarUrl: "",
}

const ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Casa",
    street: "Calle 45 #12-38, Apto 502",
    neighborhood: "El Poblado",
    city: "Medellín",
    references: "Portón verde junto al parque, edificio con portero 24h",
    icon: "home",
  },
  {
    id: "addr-2",
    label: "Trabajo",
    street: "Carrera 70 #45-20, Oficina 301",
    neighborhood: "Laureles",
    city: "Medellín",
    references: "Entrada por la lateral del edificio, preguntar por Recepción",
    icon: "work",
  },
]

const SECTIONS: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: "info", label: "Información de cuenta", icon: <User className="size-[18px]" /> },
  { id: "addresses", label: "Direcciones", icon: <MapPin className="size-[18px]" /> },
  { id: "password", label: "Cambiar contraseña", icon: <Lock className="size-[18px]" /> },
  { id: "delete", label: "Borrar cuenta", icon: <Trash2 className="size-[18px]" /> },
]

// ── Helpers ─────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// ── Sidebar ─────────────────────────────────────────────────────────────────
function ProfileSidebar({
  active,
  onChange,
}: {
  active: SectionId
  onChange: (id: SectionId) => void
}) {
  return (
    <nav className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Mi Cuenta
        </p>
      </div>
      <ul className="p-2 flex flex-col gap-0.5">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => onChange(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                active === section.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <span
                className={cn(
                  "transition-colors duration-200",
                  active === section.id ? "text-primary" : "text-muted-foreground/60"
                )}
              >
                {section.icon}
              </span>
              <span className="flex-1 text-left">{section.label}</span>
              {active === section.id && (
                <ChevronRight className="size-4 text-primary/60" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ── Section: Account Info ───────────────────────────────────────────────────
function AccountInfoSection() {
  const [name, setName] = useState(USER_DATA.name)
  const [email] = useState(USER_DATA.email)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
          Información de <span className="text-primary">cuenta</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Actualiza tus datos personales
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {/* Avatar inline */}
        <div
          className="relative group cursor-pointer shrink-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="size-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-[3px] border-primary/20 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10">
            <span className="text-2xl font-bold text-primary/70 select-none font-serif">
              {getInitials(name)}
            </span>
          </div>
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-all duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <Camera className="size-5 text-white" />
          </div>
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            JPG, PNG o WEBP
          </p>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-5 flex-1 max-w-md">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre" className="text-sm font-medium text-foreground">
              Nombre completo
            </Label>
            <Input
              id="nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              className="h-11 rounded-xl bg-muted/30 border-border/40 text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground/60">
              El correo no se puede modificar
            </p>
          </div>

          <Button className="h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-medium mt-2 w-fit px-8 transition-all duration-200 hover:shadow-md">
            Modificar
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Section: Addresses ──────────────────────────────────────────────────────
function AddressesSection() {
  const [addresses] = useState<Address[]>(ADDRESSES)

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
          Mis <span className="text-primary">direcciones</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Gestiona tus direcciones de entrega
        </p>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
          <div className="size-14 rounded-full bg-muted flex items-center justify-center">
            <MapPin className="size-6 text-muted-foreground/50" />
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">No tienes direcciones guardadas</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Agrega una dirección para agilizar tus próximas compras
            </p>
          </div>
          <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-2">
            <Plus className="size-4" />
            Agregar dirección
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={cn(
                      "size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      addr.icon === "home"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary/10 text-secondary"
                    )}
                  >
                    {addr.icon === "home" ? (
                      <Home className="size-[18px]" />
                    ) : (
                      <Building2 className="size-[18px]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      {addr.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{addr.street}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {addr.neighborhood}, {addr.city}
                    </p>
                    {addr.references && (
                      <p className="text-xs text-muted-foreground/70 mt-1 italic">
                        Ref: {addr.references}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="size-3.5" />
                  </button>
                  <button className="size-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60 gap-2 h-11 mt-2 w-fit"
          >
            <Plus className="size-4" />
            Agregar dirección
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Section: Change Password ────────────────────────────────────────────────
function ChangePasswordSection() {
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
          Cambiar <span className="text-primary">contraseña</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Asegúrate de usar una contraseña segura
        </p>
      </div>

      <div className="flex flex-col gap-5 max-w-md">
        <div className="flex flex-col gap-2">
          <Label htmlFor="current-pw" className="text-sm font-medium text-foreground">
            Contraseña actual
          </Label>
          <Input
            id="current-pw"
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="••••••••"
            className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="new-pw" className="text-sm font-medium text-foreground">
            Nueva contraseña
          </Label>
          <Input
            id="new-pw"
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-pw" className="text-sm font-medium text-foreground">
            Confirmar nueva contraseña
          </Label>
          <Input
            id="confirm-pw"
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Repite la nueva contraseña"
            className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
          />
        </div>

        <Button className="h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-medium mt-2 w-fit px-8 transition-all duration-200 hover:shadow-md">
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}

// ── Section: Delete Account ─────────────────────────────────────────────────
function DeleteAccountSection() {
  const [confirmPw, setConfirmPw] = useState("")

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
          Borrar <span className="text-destructive">cuenta</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Esta acción es permanente e irreversible
        </p>
      </div>

      {/* Warning card */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 flex gap-4">
        <div className="size-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="size-5 text-destructive" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-destructive">
            ¿Estás seguro de que quieres eliminar tu cuenta?
          </p>
          <p className="text-sm text-destructive/70 leading-relaxed">
            Al eliminar tu cuenta se borrarán permanentemente todos tus datos,
            historial de pedidos, direcciones guardadas y preferencias.
            Esta acción no se puede deshacer.
          </p>
        </div>
      </div>

      {/* Confirmation */}
      <div className="flex flex-col gap-5 max-w-md">
        <div className="flex flex-col gap-2">
          <Label htmlFor="delete-pw" className="text-sm font-medium text-foreground">
            Escribe tu contraseña para confirmar
          </Label>
          <Input
            id="delete-pw"
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Tu contraseña actual"
            className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
          />
        </div>

        <Button className="h-11 rounded-xl bg-destructive text-white hover:bg-destructive/90 font-medium mt-2 w-fit px-8 transition-all duration-200 hover:shadow-md hover:shadow-destructive/20">
          <Trash2 className="size-4 mr-2" />
          Eliminar cuenta
        </Button>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function CuentaPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("info")

  return (
    <div className="min-h-screen bg-muted/40">
      <Header />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            Mi <span className="text-primary">Cuenta</span>
          </h1>
          <p className="text-muted-foreground">
            Administra tu información personal y preferencias
          </p>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* Column 1 — Sidebar navigation */}
          <ProfileSidebar active={activeSection} onChange={setActiveSection} />

          {/* Column 2 — Dynamic content */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:p-8 min-h-[400px]">
            {activeSection === "info" && <AccountInfoSection />}
            {activeSection === "addresses" && <AddressesSection />}
            {activeSection === "password" && <ChangePasswordSection />}
            {activeSection === "delete" && <DeleteAccountSection />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
