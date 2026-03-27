// src/components/header.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, ShoppingCart, LogOut, ChevronDown, Package, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useSupplementCart } from "@/features/supplements/context/supplements-cart-context"
import { SupplementsMiniCart } from "@/features/supplements/components/supplements-mini-cart"
import { SupplementCheckoutModal } from "@/features/supplements/components/supplement-checkout-modal"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface HeaderUser {
  name: string
  email: string
  avatarUrl?: string
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchClosing, setSearchClosing] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const { user, isAuthenticated, isAuthLoading, logout } = useAuth()
  const { totalItems } = useSupplementCart()
  const searchRef = useRef<HTMLDivElement>(null)

  const handleOpenCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  // Cerrar search con animación (para click fuera)
  const closeSearchAnimated = () => {
    setSearchClosing(true)
    setTimeout(() => {
      setSearchOpen(false)
      setSearchClosing(false)
    }, 200)
  }

  // Cerrar search inmediatamente (para click en X o Escape)
  const closeSearchImmediate = () => {
    setSearchOpen(false)
    setSearchClosing(false)
  }

  // Cerrar search al hacer click fuera (con animación)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchOpen && !searchClosing && searchRef.current && !searchRef.current.contains(e.target as Node)) {
        closeSearchAnimated()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [searchOpen, searchClosing])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <nav className="max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-6 lg:px-8">

          {/* Left — Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/LOGO_1000PREP_SUPLEMENTOS.png"
              alt="1000Prep Logo"
              width={120}
              height={32}
              priority
              style={{ height: "auto" }}
              className="w-32"
            />
          </Link>

          {/* Center — Nav links + Search (desktop) */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Inline search */}
            <div className="relative ml-2" ref={searchRef}>
              {searchOpen && !searchClosing && (
                <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
                  <Input
                    autoFocus
                    placeholder="Buscar suplementos..."
                    className="h-9 w-48 lg:w-64 rounded-full text-sm bg-muted/60 border-border/60 pr-9"
                    onKeyDown={(e) => e.key === "Escape" && closeSearchImmediate()}
                  />
                  <button
                    onClick={closeSearchImmediate}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {searchClosing && (
                <div className="flex items-center gap-1 animate-out fade-out zoom-out-95 duration-200 origin-center">
                  <Input
                    placeholder="Buscar suplementos..."
                    className="h-9 w-48 lg:w-64 rounded-full text-sm bg-muted/60 border-border/60 pr-9"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {!searchOpen && !searchClosing && (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  aria-label="Buscar"
                >
                  <Search className="w-[18px] h-[18px]" />
                </button>
              )}
            </div>
          </div>

          {/* Right — Cart + Auth (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Cart - Ahora funcional */}
            <div className="relative">
              <button
                className="relative p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                aria-label={`Carrito: ${totalItems} artículos`}
                onClick={() => setCartOpen(!cartOpen)}
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              
              {cartOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <SupplementsMiniCart 
                    variant="dropdown" 
                    isOpen={cartOpen} 
                    onOpenChange={setCartOpen}
                    onCheckoutOpen={handleOpenCheckout}
                  />
                </div>
              )}
            </div>

            {/* Auth */}
            {isAuthLoading ? (
              <div className="flex items-center gap-3 ml-1">
                <div className="h-9 w-20 rounded-full bg-muted animate-pulse" />
                <div className="h-9 w-24 rounded-full bg-muted animate-pulse" />
              </div>
            ) : isAuthenticated && user ? (
              <AccountMenu user={{ name: user.name, email: user.email }} onLogout={logout} onOpenChange={(open) => {
        if (open && cartOpen) setCartOpen(false)
      }} />
            ) : (
              <>
                <Button variant="ghost" className="text-foreground hover:bg-muted rounded-full px-5" asChild>
                  <Link href="/login">Ingresar</Link>
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5" asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile — Search + Hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-muted/60 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Abrir menú"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Buscar suplementos..."
                className="h-10 w-full rounded-full text-sm bg-muted/60 border-border/60 pl-10"
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-6 px-4 border-t border-border/50">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-3 pt-3 border-t border-border/50">
                <button
                  onClick={() => { setIsOpen(false); setCartOpen(true); }}
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-foreground hover:bg-muted/60 rounded-lg transition-colors w-full"
                >
                  <ShoppingCart className="w-5 h-5" />Carrito {totalItems > 0 && `(${totalItems})`}
                </button>
              </div>

              {isAuthLoading ? (
                <div className="flex flex-col gap-3 mt-3 opacity-0" aria-hidden>
                  <div className="h-10 w-full rounded-full bg-muted" />
                  <div className="h-10 w-full rounded-full bg-muted" />
                </div>
              ) : isAuthenticated && user ? (
                <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-3 px-1 mb-3">
                    <Avatar className="size-9">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  <Link
                    href="/cuenta"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted/60 transition-colors text-sm"
                  >
                    <User className="size-4" />Mi cuenta
                  </Link>
                  <Link
                    href="/pedidos"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted/60 transition-colors text-sm"
                  >
                    <Package className="size-4" />Mis pedidos
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); logout() }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-sm"
                  >
                    <LogOut className="size-4" />Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-border/50">
                  <Button variant="outline" className="rounded-full w-full" asChild>
                    <Link href="/login">Ingresar</Link>
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-full" asChild>
                    <Link href="/register">Registrarse</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Checkout Modal - siempre visible a nivel del header */}
      <SupplementCheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </header>
  )
}

function AccountMenu({ user, onLogout, onOpenChange }: { user: HeaderUser; onLogout?: () => void; onOpenChange?: (open: boolean) => void }) {
  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open)
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1.5 hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ml-1">
          <Avatar className="size-8">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground max-w-[120px] truncate hidden lg:inline">
            {user.name}
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground hidden lg:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-xl p-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
        <DropdownMenuLabel className="px-3 py-2.5 font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">{user.name}</span>
              <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer">
            <Link href="/cuenta">
              <User className="size-4" />
              <span>Mi cuenta</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer">
            <Link href="/pedidos">
              <Package className="size-4" />
              <span>Mis pedidos</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="rounded-lg px-3 py-2.5 cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}