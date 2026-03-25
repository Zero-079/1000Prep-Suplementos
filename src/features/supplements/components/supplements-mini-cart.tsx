// src/features/supplements/components/supplements-mini-cart.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { ShoppingCart, X, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSupplementCart } from "@/features/supplements/context/supplements-cart-context"
import { SupplementCheckoutModal } from "@/features/supplements/components/supplement-checkout-modal"
import { cn } from "@/lib/utils"

export function SupplementsMiniCart() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useSupplementCart()
  const [isOpen, setIsOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen])

  const handleOpenCheckout = () => {
    setIsOpen(false)
    setCheckoutOpen(true)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50" ref={panelRef}>
        <div
          className={cn(
            "absolute bottom-20 right-0 w-80 bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right overflow-hidden",
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-foreground text-sm">Carrito ({totalItems})</h3>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Cerrar carrito">
              <X className="size-4" />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center">
                <ShoppingBag className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((item) => {
                  const lineTotal = parseInt(item.supplement.price, 10) * item.quantity
                  return (
                    <li key={item.supplement.id} className="p-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.supplement.name}</p>
                        <p className="text-[11px] text-muted-foreground">{item.supplement.brand.name} · {item.supplement.servingSize}</p>
                        <p className="text-xs text-primary font-semibold">
                          {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(lineTotal)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(item.supplement.id, item.quantity - 1)}
                          className="size-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors" aria-label="Disminuir">
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium tabular-nums">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.supplement.id, item.quantity + 1)}
                          className="size-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors" aria-label="Aumentar">
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t border-border flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-base font-bold text-foreground">
                  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(totalPrice)}
                </span>
              </div>
              <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-full" size="sm" onClick={handleOpenCheckout}>
                Finalizar pedido
              </Button>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            "relative size-16 rounded-full flex items-center justify-center transition-all",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.3)]"
          )}
          aria-label={`Carrito: ${totalItems} artículos`}
        >
          <ShoppingCart className="size-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 size-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center ring-2 ring-background shadow-md">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <SupplementCheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  )
}
