import { Order } from "../hooks/useOrders"
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

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

export function StatusBadge({ status }: { status: string }) {
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
