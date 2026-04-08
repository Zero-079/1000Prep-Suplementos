"use client"

import { useState, useEffect } from "react"
import { Order } from "../hooks/useOrders"
import { StatusBadge } from "./status-badge"
import { fetchAPI } from "@/config/api"
import {
  Package,
  MapPin,
  CalendarDays,
  CreditCard,
  Clock,
} from "lucide-react"

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

export function OrderDetailDrawer({
  order,
  onClose,
}: {
  order: Order | null
  onClose: () => void
}) {
  const [supplementNames, setSupplementNames] = useState<Map<string, string>>(new Map())

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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-card border-l border-border z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Detalle del pedido</p>
            <p className="text-xs font-mono text-muted-foreground truncate max-w-[260px]">
              #{order.id.slice(0, 8).toUpperCase()}…
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Status + total */}
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status} />
            <span className="text-xl font-bold text-foreground">{formatCOP(order.total)}</span>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                <Clock className="size-3" /> Fecha de orden
              </p>
              <p className="text-sm font-medium text-foreground">{formatDate(order.createdAt)}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                <CalendarDays className="size-3" /> Entrega estimada
              </p>
              <p className="text-sm font-medium text-foreground">{formatDate(order.deliveryDate)}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Productos ({order.items.length})
            </p>
            <div className="flex flex-col gap-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.supplementId ? (supplementNames.get(item.supplementId) ?? "Cargando…") : "Suplemento"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cant. {item.quantity} · {formatCOP(item.unitPrice)} c/u
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {formatCOP(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-muted/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCOP(order.subtotal)}</span>
            </div>
            {parseFloat(order.discount) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuento</span>
                <span>-{formatCOP(order.discount)}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatCOP(order.total)}</span>
            </div>
          </div>

          {/* Address */}
          {order.address && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <MapPin className="size-3" /> Dirección de entrega
              </p>
              <div className="bg-muted/50 rounded-xl px-4 py-3">
                <p className="text-sm font-medium text-foreground">
                  {order.address.label} — {order.address.street}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {order.address.neighborhood}, {order.address.city}
                </p>
                {order.address.references && (
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    {order.address.references}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment */}
          {order.payment && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <CreditCard className="size-3" /> Pago
              </p>
              <div className="bg-muted/50 rounded-xl px-4 py-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <StatusBadge status={order.payment.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Método</span>
                  <span className="font-medium text-foreground">{order.payment.method}</span>
                </div>
                {order.payment.paidAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pagado el</span>
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
            <div className="bg-muted/50 rounded-xl px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Notas</p>
              <p className="text-sm text-foreground">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
