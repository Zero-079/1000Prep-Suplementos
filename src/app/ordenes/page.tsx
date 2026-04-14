"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { SellerOrdersList } from "@/features/orders/components"

export default function OrdenesPage() {
  return (
    <ProtectedRoute roles={["SELLER"]}>
      <div className="min-h-screen bg-muted/40">
        <Header />

        <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-20">
          <SellerOrdersList />
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
