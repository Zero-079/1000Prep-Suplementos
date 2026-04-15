"use client"

import { useState, useEffect } from "react"
import { Order } from "../hooks/useOrders"
import type { User as UserData } from "../hooks/useSellerOrders"
import { StatusBadge } from "./status-badge"
import { fetchAPI } from "@/config/api"
import axiosInstance from "@/lib/axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Package,
  MapPin,
  CalendarDays,
  CreditCard,
  Clock,
  User,
  Mail,
  Phone,
  X,
  ShoppingBag,
  Loader2,
  CheckCircle,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type AllowedSellerStatus = "ON_THE_WAY" | "DELIVERED"

interface OrderDetailModalProps {
  order: Order | null
  usersMap: Map<string, UserData>
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusUpdate?: (orderId: string, status: string) => Promise<void>
}

function formatCOP(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(num)
}

function formatDate(dateStr: string | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...opts,
  })
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface OrderDetailModalProps {
  order: Order | null
  usersMap: Map<string, UserData>
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusUpdate?: (orderId: string, status: string) => Promise<void>
  onOrderUpdate?: (updatedOrder: Order) => void
}

export function OrderDetailModal({ order, usersMap, open, onOpenChange, onStatusUpdate, onOrderUpdate }: OrderDetailModalProps) {
  const [supplementNames, setSupplementNames] = useState<Map<string, string>>(new Map())
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Get user data from usersMap using order.userId
  const user = order?.userId ? usersMap.get(order.userId) : undefined

  const canChangeStatus = order?.status === "CONFIRMED"

  const handleStatusChange = async (newStatus: string) => {
    if (!order || !onStatusUpdate) return
    
    setIsUpdatingStatus(true)
    try {
      await onStatusUpdate(order.id, newStatus)
      // Actualizar el order localmente para reflejar el cambio inmediatamente
      if (onOrderUpdate) {
        onOrderUpdate({ ...order, status: newStatus })
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  useEffect(() => {
    if (!order) return

    const ids = order.items.map((i) => i.supplementId).filter(Boolean) as string[]
    if (ids.length === 0) return

    fetchAPI<Array<{ id: string; name: string }>>("/supplements", { method: "GET" })
      .then((data) => {
        const map = new Map(data.map((s) => [s.id, s.name]))
        setSupplementNames(map)
      })
      .catch(() => {})
  }, [order])

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-2xl max-h-[92vh] overflow-hidden p-0 gap-0 bg-card border-border/40 shadow-xl rounded-xl">
        {/* Header - Editorial Botanist */}
        <DialogHeader className="px-5 py-4 border-b border-border/30 bg-muted/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <ShoppingBag className="size-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2.5">
                  <span className="font-mono text-primary">#{order.id.slice(0, 8).toUpperCase()}</span>
                </DialogTitle>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <CalendarDays className="size-3" />
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="shrink-0 p-2 rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <X className="size-4" />
            </button>
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-5 py-4 flex flex-col gap-4 max-h-[calc(92vh-130px)]">
          {/* Status control section for seller */}
          {onStatusUpdate && (
            <div className={cn(
              "rounded-xl p-4 border-l-4",
              order.status === "CONFIRMED" && "bg-blue-50 border-l-blue-500",
              order.status === "ON_THE_WAY" && "bg-violet-50 border-l-violet-500",
              order.status === "DELIVERED" && "bg-emerald-50 border-l-emerald-500"
            )}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.status === "CONFIRMED" && "Pedido confirmado, listo para enviar"}
                      {order.status === "ON_THE_WAY" && "Pedido en camino hacia el cliente"}
                      {order.status === "DELIVERED" && "Pedido entregado exitosamente"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.status === "CONFIRMED" && "El cliente ha confirmado su pedido"}
                      {order.status === "ON_THE_WAY" && "El repartidor está en camino"}
                      {order.status === "DELIVERED" && "El cliente recibió su pedido"}
                    </p>
                  </div>
                </div>
                {order.status === "CONFIRMED" && (
                  <Button
                    onClick={() => handleStatusChange("ON_THE_WAY")}
                    disabled={isUpdatingStatus}
                    className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Truck className="size-4" />
                    )}
                    Marcar En camino
                  </Button>
                )}
                {order.status === "ON_THE_WAY" && (
                  <Button
                    onClick={() => handleStatusChange("DELIVERED")}
                    disabled={isUpdatingStatus}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CheckCircle className="size-4" />
                    )}
                    Marcar Entregado
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Customer info - Editorial */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <User className="size-3.5 text-primary/70" />
              Cliente
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-muted/30 rounded-lg px-3.5 py-3 border border-border/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-blue-500/8 flex items-center justify-center shrink-0">
                  <User className="size-4 text-blue-500/80" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Nombre</p>
                  <p className="text-sm font-medium text-foreground truncate">{user?.name || "—"}</p>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg px-3.5 py-3 border border-border/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-emerald-500/8 flex items-center justify-center shrink-0">
                  <Mail className="size-4 text-emerald-500/80" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground truncate">{user?.email || "—"}</p>
                </div>
              </div>
              {user?.phone && (
                <div className="bg-muted/30 rounded-lg px-3.5 py-3 border border-border/20 flex items-center gap-3 sm:col-span-2">
                  <div className="w-8 h-8 rounded-md bg-violet-500/8 flex items-center justify-center shrink-0">
                    <Phone className="size-4 text-violet-500/80" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-medium text-foreground">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Items - Editorial */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Package className="size-3.5 text-primary/70" />
              Productos
            </p>
            <div className="flex flex-col gap-1.5">
              {order.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between bg-muted/25 rounded-lg px-3.5 py-3 border border-border/20 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                      <Package className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.supplementId ? (supplementNames.get(item.supplementId) ?? "Cargando…") : "Suplemento"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">{item.quantity}</span> × {formatCOP(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground tabular-nums shrink-0 ml-3">
                    {formatCOP(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown - Editorial */}
          <div className="bg-muted/20 rounded-lg p-3.5 flex flex-col gap-2 border border-border/20">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground font-medium">{formatCOP(order.subtotal)}</span>
            </div>
            {parseFloat(order.discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Descuento</span>
                <span className="text-primary font-semibold">-{formatCOP(order.discount)}</span>
              </div>
            )}
            <div className="border-t border-border/30 pt-2 flex justify-between items-center">
              <span className="text-foreground font-semibold">Total</span>
              <span className="text-primary text-lg font-bold">{formatCOP(order.total)}</span>
            </div>
          </div>

          {/* Address - Editorial */}
          {order.address && (
            <div className="flex flex-col gap-2.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MapPin className="size-3.5 text-primary/70" />
                Entrega
              </p>
              <div className="bg-muted/25 rounded-lg px-4 py-3.5 border border-border/20">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md bg-orange-500/8 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="size-3.5 text-orange-500/80" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {order.address.label}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {order.address.street}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.address.neighborhood}, {order.address.city}
                    </p>
                    {order.address.references && (
                      <p className="text-xs text-muted-foreground/60 mt-1.5 italic">
                        Ref: {order.address.references}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment - Editorial */}
          {order.payment && (
            <div className="flex flex-col gap-2.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="size-3.5 text-primary/70" />
                Pago
              </p>
              <div className="bg-muted/25 rounded-lg px-4 py-3.5 flex flex-col gap-2.5 border border-border/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <StatusBadge status={order.payment.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CreditCard className="size-3.5 text-muted-foreground/50" />
                    Método
                  </span>
                  <span className="font-medium text-foreground">{order.payment.method}</span>
                </div>
                {order.payment.paidAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="size-3.5 text-muted-foreground/50" />
                      Pagado
                    </span>
                    <span className="font-medium text-foreground">
                      {formatDateTime(order.payment.paidAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="bg-muted/25 rounded-lg px-4 py-3.5 border border-primary/15">
              <p className="text-xs font-medium text-primary mb-1.5 flex items-center gap-2">
                <span className="text-primary/80">📝</span> Notas
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}