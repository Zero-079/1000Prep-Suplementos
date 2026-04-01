"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/protected-route"
import { useOrders, type Order } from "@/features/orders/hooks/useOrders"
import {
  Package,
  ChevronRight,
  MapPin,
  CalendarDays,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

// ── Formatters ─────────────────────────────────────────────────────────────
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

// ── Status config ──────────────────────────────────────────────────────────
type StatusConfig = {
  label: string
  icon: React.ReactNode
  className: string
}

function getStatusConfig(status: string): StatusConfig {
  switch (status) {
    case "COMPLETED":
    case "CONFIRMED":
      return {
        label: status === "COMPLETED" ? "Completado" : "Confirmado",
        icon: <CheckCircle2 className="size-3.5" />,
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      }
    case "PENDING":
      return {
        label: "Pendiente",
        icon: <Clock className="size-3.5" />,
        className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      }
    case "CANCELLED":
    case "EXPIRED":
      return {
        label: status === "CANCELLED" ? "Cancelado" : "Expirado",
        icon: <XCircle className="size-3.5" />,
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      }
    default:
      return {
        label: status,
        icon: <AlertCircle className="size-3.5" />,
        className: "bg-muted text-muted-foreground",
      }
  }
}

// ── Status badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = getStatusConfig(status)
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        cfg.className
      )}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

// ── Order detail drawer ────────────────────────────────────────────────────
function OrderDetailDrawer({
  order,
  onClose,
}: {
  order: Order | null
  onClose: () => void
}) {
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
                      <p className="text-sm font-medium text-foreground">Suplemento</p>
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

// ── Order card ─────────────────────────────────────────────────────────────
function OrderCard({
  order,
  onClick,
}: {
  order: Order
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="flex items-start gap-4 min-w-0">
          {/* Icon */}
          <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Package className="size-5 text-primary" />
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <StatusBadge status={order.status} />
              <span className="text-xs text-muted-foreground font-mono">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
              {" · "}
              {formatDate(order.createdAt)}
            </p>
            {order.deliveryDate && (
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <CalendarDays className="size-3" />
                Entrega: {formatDate(order.deliveryDate)}
              </p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-base font-bold text-foreground">
            {formatCOP(order.total)}
          </span>
          <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function PedidosPage() {
  const { orders, isLoading, error, refetch } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-muted/40">
      <Header />

      <main className="max-w-3xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            Mis <span className="text-primary">Pedidos</span>
          </h1>
          <p className="text-muted-foreground">
            Historial de tus pedidos de suplementos
          </p>
        </div>

        {/* States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Cargando pedidos…</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="size-8 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Error al cargar pedidos</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button
              variant="outline"
              className="rounded-full gap-2"
              onClick={refetch}
            >
              <RefreshCw className="size-4" />
              Reintentar
            </Button>
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="size-20 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="size-9 text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-serif text-xl font-semibold text-foreground mb-2">
                Aún no tienes pedidos
              </p>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Explora nuestro catálogo de suplementos y realiza tu primer pedido.
              </p>
            </div>
            <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/catalogo">Ver suplementos</Link>
            </Button>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="flex flex-col gap-3">
            {orders
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Detail drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
    </ProtectedRoute>
  )
}
