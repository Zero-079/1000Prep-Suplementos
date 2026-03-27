"use client"

import { User, MapPin, Lock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SectionId, Section } from "@/features/account/data/account-data"

const iconMap = {
  User: <User className="size-[18px]" />,
  MapPin: <MapPin className="size-[18px]" />,
  Lock: <Lock className="size-[18px]" />,
} satisfies Record<Section["iconName"], React.ReactNode>

export function ProfileSidebar({
  sections,
  active,
  onChange,
}: {
  sections: Section[]
  active: SectionId
  onChange: (id: SectionId) => void
}) {
  return (
    <nav className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Mi Cuenta
        </p>
      </div>
      <ul className="p-2 flex flex-col gap-0.5">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => onChange(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                active === section.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <span
                className={cn(
                  "transition-colors duration-200",
                  active === section.id ? "text-primary" : "text-muted-foreground/60"
                )}
              >
                {iconMap[section.iconName]}
              </span>
              <span className="flex-1 text-left">{section.label}</span>
              {active === section.id && (
                <ChevronRight className="size-4 text-primary/60" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
