// src/app/catalogo/[id]/page.tsx
"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SupplementDetailContent } from "@/features/supplements/components/supplement-detail-content"
import { useSupplementById } from "@/features/supplements/hooks/useSupplements"
import { useSupplementCart } from "@/features/supplements/context/supplements-cart-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, AlertCircle, Package } from "lucide-react"

// UUID v4 regex: 8-4-4-4-12 hex characters
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id)
}

interface SupplementDetailPageProps {
  params: Promise<{ id: string }>
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 w-32 bg-muted rounded-lg mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="aspect-square lg:aspect-[4/5] bg-muted rounded-2xl" />
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-12 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-full" />
                <div className="h-6 bg-muted rounded w-5/6" />
                <div className="h-32 bg-muted rounded-xl mt-8" />
                <div className="h-14 bg-muted rounded-full mt-8 w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function ErrorState({ onRetry, onGoBack }: { onRetry: () => void; onGoBack: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20 px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center py-16">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl mx-auto w-48 h-48" />
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-6 shadow-xl">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Error al cargar el producto
          </h2>
          <p className="text-muted-foreground mb-8">
            Hubo un problema al obtener los datos del suplemento. Por favor intentá de nuevo.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={onRetry} className="rounded-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
            <Button
              variant="outline"
              onClick={onGoBack}
              className="rounded-full border-border text-foreground hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al catálogo
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function NotFoundState({ onGoBack }: { onGoBack: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20 px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center py-16">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl mx-auto w-48 h-48" />
            <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl mx-auto w-32 h-32 -top-4 -right-4" />
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6 shadow-xl">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Producto no encontrado
          </h2>
          <p className="text-muted-foreground mb-8">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          
          <Button
            variant="outline"
            onClick={onGoBack}
            className="rounded-full border-border text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al catálogo
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// Componente interno que recibe el ID resuelto
function SupplementDetailInner({ id }: { id: string }) {
  const router = useRouter()
  const { addItem } = useSupplementCart()
  const { supplement, isLoading, error, refetch } = useSupplementById(id)

  const handleAddToCart = (quantity: number) => {
    if (supplement) {
      addItem(supplement, quantity)
    }
  }

  const handleGoBack = () => {
    router.push("/catalogo")
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState onRetry={() => refetch()} onGoBack={handleGoBack} />
  }

  if (!supplement) {
    return <NotFoundState onGoBack={handleGoBack} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver al catálogo</span>
          </button>
          <SupplementDetailContent
            supplement={supplement}
            showQuantitySelector={true}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function SupplementDetailPage({ params }: SupplementDetailPageProps) {
  // Usar use() para resolver la Promise de params en React 19/Next.js 15
  const resolvedParams = use(params)
  const { id } = resolvedParams

  // Validar UUID antes de mostrar contenido
  if (!isValidUUID(id)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NotFoundState onGoBack={() => {}} />
        <Footer />
      </div>
    )
  }

  return <SupplementDetailInner id={id} />
}