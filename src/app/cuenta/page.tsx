"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useAddresses } from "@/features/account/hooks/useAddresses"
import { ProfileSidebar } from "@/features/account/components/profile-sidebar"
import { AccountInfoSection } from "@/features/account/components/account-info-section"
import { AddressesSection } from "@/features/account/components/addresses-section"
import { ChangePasswordSection } from "@/features/account/components/change-password-section"
import { SECTIONS } from "@/features/account/data/account-data"
import type { SectionId } from "@/features/account/data/account-data"

export default function CuentaPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("info")
  const { user, isAuthLoading } = useAuth()
  const { addresses, isLoading: isAddressesLoading, error: addressesError, refetch: refetchAddresses } = useAddresses()

  return (
    <div className="min-h-screen bg-muted/40">
      <Header />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* Column 1 — Sidebar navigation */}
          <ProfileSidebar
            sections={SECTIONS}
            active={activeSection}
            onChange={setActiveSection}
          />

          {/* Column 2 — Dynamic content */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:p-8 min-h-[400px]">
            {activeSection === "info" && (
              <AccountInfoSection key={user?.id ?? "loading"} user={user} isLoading={isAuthLoading} />
            )}
            {activeSection === "addresses" && (
              <AddressesSection
                addresses={addresses}
                isLoading={isAddressesLoading}
                error={addressesError}
                onAddressAdded={refetchAddresses}
              />
            )}
            {activeSection === "password" && <ChangePasswordSection />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
