import { Order } from "../hooks/useOrders"
import { StatusBadge } from "./status-badge"
import { Package, ChevronRight, CalendarDays } from "lucide-react"

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

export function OrderCard({
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
