"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/protected-route"
import { useOrders, type Order } from "@/features/orders/hooks/useOrders"
import { OrderCard, OrderDetailDrawer } from "@/features/orders/components"
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function formatDate(dateStr: string | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...opts,
  })
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
