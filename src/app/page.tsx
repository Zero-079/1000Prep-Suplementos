// src/app/page.tsx
import { Suspense } from "react"
import { HomeContent } from "@/components/home-content"

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}