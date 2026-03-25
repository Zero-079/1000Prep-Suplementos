// src/features/supplements/components/supplement-checkout-modal.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MapPin, CalendarDays, StickyNote, Package, AlertCircle, Loader2,
  CreditCard, Clock, ExternalLink, CheckCircle2, XCircle, RotateCcw, LogIn, ShoppingCart,
} from "lucide-react"
import { useSupplementCart } from "@/features/supplements/context/supplements-cart-context"
import { useUserAddresses } from "@/features/supplements/hooks/useUserAddresses"
import { supplementOrderService } from "@/features/supplements/services/supplement-order.service"
import { paymentService } from "@/features/supplements/services/payment.service"
import { useAuthContext } from "@/features/auth/context/AuthContext"
import { fetchAPI } from "@/config/api"
import { cn } from "@/lib/utils"

const CART_STORAGE_KEY = "supplement_cart_pending"

interface SupplementCheckoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = "login-required" | "form" | "payment" | "success" | "cancelled"

function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(value)
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0]
}

function useCountdown(expiresAt: string | null) {
  const [secondsLeft, setSecondsLeft] = useState(0)
  useEffect(() => {
    if (!expiresAt) return
    const calc = () => setSecondsLeft(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)))
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [expiresAt])
  return { minutes: Math.floor(secondsLeft / 60), seconds: secondsLeft % 60, secondsLeft, isExpired: secondsLeft === 0 && expiresAt !== null }
}

export function SupplementCheckoutModal({ open, onOpenChange }: SupplementCheckoutModalProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuthContext()
  const { items, totalPrice, clearCart } = useSupplementCart()
  const { addresses, isLoading: loadingAddresses, error: addressError } = useUserAddresses()

  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [notes, setNotes] = useState("")

  const [step, setStep] = useState<Step>("form")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderTotal, setOrderTotal] = useState(0)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [isInitingPayment, setIsInitingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentWasAttempted, setPaymentWasAttempted] = useState(false)

  const { minutes, seconds, secondsLeft, isExpired } = useCountdown(expiresAt)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!open) return
    if (authLoading) return
    if (!isAuthenticated) setStep("login-required")
    else setStep("form")
  }, [open, isAuthenticated, authLoading])

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0]
      setSelectedAddressId(def.id)
    }
  }, [addresses, selectedAddressId])

  const stopPolling = useCallback(() => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null }
  }, [])

  useEffect(() => {
    if (!paymentLink || !orderId || step !== "payment") return
    pollingRef.current = setInterval(async () => {
      try {
        const order = await fetchAPI<{ status: string; payment: { status: string; paidAt: string | null } | null }>(`/orders/${orderId}`)
        if (order.status === "CONFIRMED") { stopPolling(); setStep("success") }
        else if (order.status === "CANCELLED" || order.status === "EXPIRED") {
          stopPolling()
          setPaymentWasAttempted(order.payment != null && order.payment.status !== "COMPLETED")
          setStep("cancelled")
        }
      } catch { /* silently ignore */ }
    }, 5000)
    return () => stopPolling()
  }, [paymentLink, orderId, step, stopPolling])

  useEffect(() => { if (isExpired) stopPolling() }, [isExpired, stopPolling])

  const handleGoToLogin = useCallback(() => {
    try {
      const cartSnapshot = items.map((i) => ({ id: i.supplement.id, quantity: i.quantity }))
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartSnapshot))
    } catch { /* sessionStorage might not be available */ }
    onOpenChange(false)
    router.push("/login?returnTo=/")
  }, [items, onOpenChange, router])

  const canSubmit = items.length > 0 && selectedAddressId !== "" && deliveryDate !== "" && !isSubmitting

  const handleCreateOrder = async () => {
    if (!canSubmit) return
    setIsSubmitting(true); setSubmitError(null)
    try {
      const order = await supplementOrderService.createOrder({
        items: items.map((i) => ({ supplementId: i.supplement.id, quantity: i.quantity })),
        addressId: selectedAddressId, notes: notes.trim() || undefined, deliveryDate,
      })
      setOrderId(order.id); setOrderTotal(order.totalAmount ?? totalPrice)
      setExpiresAt((order as any).expiresAt ?? null); clearCart(); setStep("payment")
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al crear la orden")
    } finally { setIsSubmitting(false) }
  }

  const handleInitPayment = async () => {
    if (!orderId) return
    setIsInitingPayment(true); setPaymentError(null)
    try {
      const result = await paymentService.initPayment(orderId)
      setPaymentLink(result.paymentLink)
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Error al iniciar el pago")
    } finally { setIsInitingPayment(false) }
  }

  const handleClose = useCallback(() => {
    if (isSubmitting || isInitingPayment) return
    stopPolling(); onOpenChange(false)
    setTimeout(() => {
      setStep("form"); setSubmitError(null); setPaymentError(null)
      setSelectedAddressId(""); setDeliveryDate(""); setNotes("")
      setPaymentLink(null); setExpiresAt(null); setOrderId(null)
      setOrderTotal(0); setPaymentWasAttempted(false)
    }, 300)
  }, [isSubmitting, isInitingPayment, onOpenChange, stopPolling])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-0 gap-0">
        {authLoading && (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
        )}

        {step === "login-required" && !authLoading && (
          <div className="flex flex-col items-center justify-center gap-6 p-10 text-center">
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="size-10 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Inicia sesión para continuar</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                Necesitas una cuenta para finalizar tu pedido. Tu carrito se guardará y podrás continuar justo donde lo dejaste.
              </p>
            </div>
            {items.length > 0 && (
              <div className="w-full bg-muted/50 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Tu carrito</p>
                {items.slice(0, 3).map((item) => (
                  <div key={item.supplement.id} className="flex items-center justify-between text-sm">
                    <span className="text-foreground truncate max-w-[65%]">
                      {item.supplement.name}<span className="text-muted-foreground ml-1">×{item.quantity}</span>
                    </span>
                    <span className="font-medium tabular-nums text-foreground">
                      {formatCOP(parseInt(item.supplement.price, 10) * item.quantity)}
                    </span>
                  </div>
                ))}
                {items.length > 3 && <p className="text-xs text-muted-foreground">+{items.length - 3} más…</p>}
                <Separator />
                <div className="flex items-center justify-between font-semibold text-sm">
                  <span>Total</span><span className="text-primary">{formatCOP(totalPrice)}</span>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2 w-full">
              <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-full" onClick={handleGoToLogin}>
                <LogIn className="size-4 mr-2" />Iniciar sesión
              </Button>
              <Button variant="ghost" className="rounded-full w-full text-muted-foreground" onClick={handleClose}>Cancelar</Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center gap-6 p-10 text-center">
            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="size-12 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">¡Pago completado!</h2>
              <p className="text-muted-foreground text-sm">Tu pedido fue confirmado. Pronto recibirás noticias sobre tu entrega.</p>
            </div>
            {orderId && (
              <div className="w-full bg-muted/50 rounded-xl px-4 py-3 text-left">
                <p className="text-xs text-muted-foreground mb-1">Número de orden</p>
                <p className="text-sm font-mono font-semibold text-foreground break-all">{orderId}</p>
              </div>
            )}
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 w-full" onClick={handleClose}>Cerrar</Button>
          </div>
        )}

        {step === "cancelled" && (
          <div className="flex flex-col items-center justify-center gap-6 p-10 text-center">
            <div className="size-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="size-12 text-destructive" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Pedido cancelado</h2>
              <p className="text-muted-foreground text-sm">Tu pedido fue cancelado. No se realizó ningún cobro.</p>
            </div>
            {paymentWasAttempted && (
              <div className="w-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl px-5 py-4 text-left flex gap-3">
                <CreditCard className="size-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Reembolso automático</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                    Si realizaste algún pago, será devuelto automáticamente en un plazo de <span className="font-semibold">3 a 5 días hábiles</span>.
                  </p>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2 w-full">
              <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-full" onClick={() => {
                stopPolling(); setStep("form"); setPaymentLink(null); setExpiresAt(null)
                setOrderId(null); setOrderTotal(0); setPaymentWasAttempted(false)
              }}>
                <RotateCcw className="size-4 mr-2" />Volver a intentar
              </Button>
              <Button variant="ghost" className="rounded-full w-full text-muted-foreground" onClick={handleClose}>Cerrar</Button>
            </div>
          </div>
        )}

        {step === "form" && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
              <DialogTitle className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                <Package className="size-5 text-primary" />Finalizar pedido
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm mt-1">Confirma tu dirección y fecha de entrega</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6 p-6">
              <div className="bg-muted/50 rounded-xl p-4 flex flex-col gap-3">
                <p className="text-sm font-semibold text-foreground">Resumen ({items.length} producto{items.length !== 1 ? "s" : ""})</p>
                <ul className="flex flex-col gap-2">
                  {items.map((item) => (
                    <li key={item.supplement.id} className="flex items-center justify-between text-sm">
                      <span className="text-foreground truncate max-w-[60%]">{item.supplement.name}<span className="text-muted-foreground ml-1">×{item.quantity}</span></span>
                      <span className="font-medium tabular-nums">{formatCOP(parseInt(item.supplement.price, 10) * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-base font-bold text-primary">{formatCOP(totalPrice)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><MapPin className="size-4 text-primary" />Dirección de entrega</label>
                {loadingAddresses ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm py-2"><Loader2 className="size-4 animate-spin" /> Cargando direcciones…</div>
                ) : addressError ? (
                  <p className="text-sm text-destructive">{addressError}</p>
                ) : addresses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tienes direcciones guardadas. Agrega una en tu perfil.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {addresses.map((addr) => (
                      <button key={addr.id} type="button" onClick={() => setSelectedAddressId(addr.id)}
                        className={cn("text-left rounded-xl border p-3 transition-colors",
                          selectedAddressId === addr.id ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-muted"
                        )}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-medium text-foreground">{addr.label || addr.street}</span>
                          {addr.isDefault && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Principal</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">{addr.street}, {addr.city}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="deliveryDate" className="text-sm font-semibold text-foreground flex items-center gap-1.5"><CalendarDays className="size-4 text-primary" />Fecha de entrega</label>
                <input id="deliveryDate" type="date" min={getTodayString()} value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="notes" className="text-sm font-semibold text-foreground flex items-center gap-1.5"><StickyNote className="size-4 text-primary" />Notas (opcional)</label>
                <textarea id="notes" rows={3} placeholder="Ej: Entregar en horario de mañana" value={notes} onChange={(e) => setNotes(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
              </div>

              {submitError && (
                <div className="flex items-start gap-2 text-destructive bg-destructive/10 rounded-xl px-3 py-2">
                  <AlertCircle className="size-4 mt-0.5 shrink-0" /><p className="text-sm">{submitError}</p>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-1">
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-full" disabled={!canSubmit} onClick={handleCreateOrder}>
                  {isSubmitting ? <><Loader2 className="size-4 animate-spin mr-2" />Creando orden…</> : `Continuar al pago · ${formatCOP(totalPrice)}`}
                </Button>
                <Button variant="ghost" className="rounded-full w-full text-muted-foreground" onClick={handleClose} disabled={isSubmitting}>Cancelar</Button>
              </div>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
              <DialogTitle className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                <CreditCard className="size-5 text-primary" />Pagar pedido
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm mt-1">Tu orden fue creada. Completa el pago antes de que expire.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-5 p-6">
              <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total a pagar</span>
                <span className="text-xl font-bold text-primary">{formatCOP(orderTotal || totalPrice)}</span>
              </div>

              {expiresAt && (
                <div className={cn("flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors",
                  isExpired ? "border-destructive/40 bg-destructive/10" : secondsLeft <= 120 ? "border-orange-400/40 bg-orange-50 dark:bg-orange-950/20" : "border-border bg-muted/40"
                )}>
                  <Clock className={cn("size-5 shrink-0", isExpired ? "text-destructive" : secondsLeft <= 120 ? "text-orange-500" : "text-muted-foreground")} />
                  <div>
                    <p className="text-xs text-muted-foreground leading-none mb-1">{isExpired ? "Orden expirada" : "Tiempo restante para pagar"}</p>
                    {isExpired ? (
                      <p className="text-sm font-semibold text-destructive">La orden fue cancelada automáticamente</p>
                    ) : (
                      <p className={cn("text-2xl font-bold tabular-nums tracking-tight leading-none", secondsLeft <= 120 ? "text-orange-500" : "text-foreground")}>
                        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {paymentLink && !isExpired && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs bg-muted/50 rounded-xl px-4 py-2">
                  <Loader2 className="size-3 animate-spin shrink-0" />Esperando confirmación de pago…
                </div>
              )}

              {paymentLink ? (
                <a href={paymentLink} target="_blank" rel="noopener noreferrer"
                  className={cn("flex items-center justify-center gap-2 rounded-full px-6 py-3 w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-colors", isExpired && "pointer-events-none opacity-50")}>
                  <ExternalLink className="size-4" />Ir a PayPal para completar el pago
                </a>
              ) : (
                <>
                  {paymentError && (
                    <div className="flex items-start gap-2 text-destructive bg-destructive/10 rounded-xl px-3 py-2">
                      <AlertCircle className="size-4 mt-0.5 shrink-0" /><p className="text-sm">{paymentError}</p>
                    </div>
                  )}
                  <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-full" disabled={isInitingPayment || isExpired} onClick={handleInitPayment}>
                    {isInitingPayment ? <><Loader2 className="size-4 animate-spin mr-2" />Generando enlace…</> : <><CreditCard className="size-4 mr-2" />Iniciar pago</>}
                  </Button>
                </>
              )}
              <Button variant="ghost" className="rounded-full w-full text-muted-foreground" onClick={handleClose} disabled={isInitingPayment}>Cerrar</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
