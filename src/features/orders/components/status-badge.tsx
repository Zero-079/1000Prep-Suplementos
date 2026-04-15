import { Order } from "../hooks/useOrders"
import { CheckCircle2, Clock, XCircle, AlertCircle, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

type StatusConfig = {
  label: string
  icon: React.ReactNode
  className: string
  bgColor: string
  textColor: string
}

function getStatusConfig(status: string): StatusConfig {
  switch (status) {
    case "PENDING":
      return {
        label: "Pendiente",
        icon: <Clock className="size-3.5" />,
        className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        bgColor: "#FEF3C7",
        textColor: "#F59E0B",
      }
    case "CONFIRMED":
      return {
        label: "Confirmado",
        icon: <CheckCircle2 className="size-3.5" />,
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        bgColor: "#DBEAFE",
        textColor: "#3B82F6",
      }
    case "ON_THE_WAY":
      return {
        label: "En camino",
        icon: <Truck className="size-3.5" />,
        className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        bgColor: "#EDE9FE",
        textColor: "#8B5CF6",
      }
    case "DELIVERED":
    case "COMPLETED":
      return {
        label: status === "DELIVERED" ? "Entregado" : "Completado",
        icon: <CheckCircle2 className="size-3.5" />,
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        bgColor: "#DCFCE7",
        textColor: "#22C55E",
      }
    case "CANCELLED":
    case "EXPIRED":
      return {
        label: status === "CANCELLED" ? "Cancelado" : "Expirado",
        icon: <XCircle className="size-3.5" />,
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        bgColor: "#FEE2E2",
        textColor: "#EF4444",
      }
    default:
      return {
        label: status,
        icon: <AlertCircle className="size-3.5" />,
        className: "bg-muted text-muted-foreground",
        bgColor: "#F3F4F6",
        textColor: "#6B7280",
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
      style={{
        backgroundColor: cfg.bgColor,
        color: cfg.textColor,
      }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  )
}
