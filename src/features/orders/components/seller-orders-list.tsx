// src/features/orders/components/seller-orders-list.tsx
"use client"

import { useState, useMemo } from "react"
import { useSellerOrders, type Order } from "../hooks/useSellerOrders"
import { OrderDetailModal, StatusBadge } from "./index"
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Package,
  Search,
  Receipt,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type OrderStatus = "ALL" | "PENDING" | "CONFIRMED" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED"

interface StatusTabConfig {
  value: OrderStatus
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const STATUS_TABS: StatusTabConfig[] = [
  { value: "ALL", label: "Todas", icon: <Receipt className="size-3.5" />, color: "text-slate-600", bgColor: "bg-slate-100" },
  { value: "PENDING", label: "Pendientes", icon: <Clock className="size-3.5" />, color: "text-amber-600", bgColor: "bg-amber-100" },
  { value: "CONFIRMED", label: "Confirmadas", icon: <CheckCircle2 className="size-3.5" />, color: "text-blue-600", bgColor: "bg-blue-100" },
  { value: "ON_THE_WAY", label: "En camino", icon: <Truck className="size-3.5" />, color: "text-violet-600", bgColor: "bg-violet-100" },
  { value: "DELIVERED", label: "Entregadas", icon: <TrendingUp className="size-3.5" />, color: "text-emerald-600", bgColor: "bg-emerald-100" },
  { value: "CANCELLED", label: "Canceladas", icon: <XCircle className="size-3.5" />, color: "text-red-600", bgColor: "bg-red-100" },
]

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatCOP(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(num)
}

interface SellerOrdersListProps {
  className?: string
}

export function SellerOrdersList({ className }: SellerOrdersListProps) {
  const { orders, usersMap, isLoading, error, refetch, updateOrderStatus } = useSellerOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  // Open modal when order is selected
  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false)
    // Delay clearing the order to allow animation to complete
    setTimeout(() => setSelectedOrder(null), 300)
  }

  // Update selected order when status changes
  const handleOrderUpdate = (updatedOrder: Order) => {
    setSelectedOrder(updatedOrder)
  }

  // Filtrar pedidos
  const filteredOrders = useMemo(() => {
    let result = orders

    // Filtro por estado
    if (statusFilter !== "ALL") {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Filtro por búsqueda (ID del pedido o fecha)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          formatDate(order.createdAt).toLowerCase().includes(query)
      )
    }

    // Ordenar por fecha descendente
    return result.slice().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [orders, statusFilter, searchQuery])

  // Contadores por estado
  const statusCounts = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      ALL: orders.length,
      PENDING: orders.filter((o) => o.status === "PENDING").length,
      CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
      ON_THE_WAY: orders.filter((o) => o.status === "ON_THE_WAY").length,
      DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
      CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
    }
    return counts
  }, [orders])

  return (
    <div className={cn("space-y-8", className)}>
      {/* Search and filters row */}
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center xl:justify-between">
        {/* Search with icon */}
        <div className="relative w-full xl:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="size-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            placeholder="Buscar por ID o fecha..."
            className="pl-11 h-11 bg-card border-border/40 rounded-xl text-sm focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Quick stats pills - Editorial styling */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground text-xs uppercase tracking-wider">Filtros:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 border",
                statusFilter === "PENDING"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground hover:text-foreground border-primary/30 hover:border-primary/50"
              )}
            >
              {statusCounts.PENDING} Pendientes
            </button>
            <button
              onClick={() => setStatusFilter("ON_THE_WAY")}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 border",
                statusFilter === "ON_THE_WAY"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground hover:text-foreground border-primary/30 hover:border-primary/50"
              )}
            >
              {statusCounts.ON_THE_WAY} En camino
            </button>
          </div>
        </div>
      </div>

      {/* Status tabs - Editorial Botanist design */}
      <div className="relative">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => {
            const count = statusCounts[tab.value]
            const isActive = statusFilter === tab.value
            
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  "group px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2.5 border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent border-primary/30 text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                <span className={cn(
                  "transition-transform duration-200",
                  isActive ? "text-primary-foreground" : tab.color
                )}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground"
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* States with Editorial Botanist styling */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Loader2 className="size-7 text-primary animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-serif text-xl text-foreground mb-1">Cargando órdenes</p>
            <p className="text-muted-foreground text-sm">Obteniendo los datos de tus pedidos...</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-destructive/10 flex items-center justify-center border border-destructive/20">
              <AlertCircle className="size-8 text-destructive" />
            </div>
          </div>
          <div className="text-center max-w-sm">
            <p className="font-serif text-xl font-semibold text-foreground mb-2">
              Error al cargar
            </p>
            <p className="text-muted-foreground text-sm mb-6">{error}</p>
            <Button
              variant="outline"
              className="rounded-xl px-6 gap-2 h-10 font-medium border-border/40"
              onClick={refetch}
            >
              <RefreshCw className="size-4" />
              Reintentar
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !error && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center border border-dashed border-border/40">
              <Package className="size-10 text-muted-foreground/30" />
            </div>
          </div>
          <div className="text-center max-w-sm">
            <p className="font-serif text-xl font-semibold text-foreground mb-2">
              No se encontraron órdenes
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              {statusFilter !== "ALL"
                ? `No hay órdenes con estado "${STATUS_TABS.find((t) => t.value === statusFilter)?.label}"`
                : searchQuery.trim()
                ? "No hay órdenes que coincidan con tu búsqueda"
                : "Aún no hay órdenes en el sistema"}
            </p>
          </div>
          {(statusFilter !== "ALL" || searchQuery.trim()) && (
            <Button
              variant="outline"
              className="rounded-xl px-5 gap-2 h-10 font-medium border-border/40"
              onClick={() => {
                setStatusFilter("ALL")
                setSearchQuery("")
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {/* Table - Editorial Botanist design */}
      {!isLoading && !error && filteredOrders.length > 0 && (
        <div className="relative overflow-hidden bg-card rounded-xl border border-border/30 shadow-sm">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-2">
                      <Receipt className="size-3.5 text-primary/60" />
                      Pedido
                    </span>
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-2">
                      <Clock className="size-3.5 text-primary/60" />
                      Fecha
                    </span>
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-primary/60" />
                      Estado
                    </span>
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="size-3.5 text-primary/60" />
                      Total
                    </span>
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-2 justify-end">
                      <Package className="size-3.5 text-primary/60" />
                      Acción
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={cn(
                      "border-b border-border/20 hover:bg-muted/30 transition-all duration-200 cursor-pointer group",
                      index % 2 === 0 ? "bg-card" : "bg-muted/15"
                    )}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                          <Receipt className="size-4 text-primary" />
                        </div>
                        <div>
                          <span className="text-sm font-mono font-medium text-foreground">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <p className="text-xs text-muted-foreground">{order.items.length} producto{order.items.length !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-foreground">
                        {formatCOP(order.total)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOrderSelect(order)
                        }}
                      >
                        Ver detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col">
            {filteredOrders.map((order, index) => (
              <button
                key={order.id}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 border-b border-border/20 hover:bg-muted/30 transition-all duration-200 text-left",
                  index % 2 === 0 ? "bg-card" : "bg-muted/15"
                )}
                onClick={() => handleOrderSelect(order)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                    <Receipt className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-mono font-medium text-foreground block">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)} · {order.items.length} prod{order.items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-3">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-semibold text-foreground">
                    {formatCOP(order.total)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Detail modal */}
      <OrderDetailModal
        order={selectedOrder}
        usersMap={usersMap}
        open={modalOpen}
        onOpenChange={handleCloseModal}
        onStatusUpdate={updateOrderStatus}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  )
}
