"use client"

import { useToast } from "@/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

const ICON_MAP = {
  default: <Info size={18} />,
  success: <CheckCircle size={18} />,
  destructive: <AlertTriangle size={18} />,
}

const getThemeStyles = (variant?: string) => {
  switch (variant) {
    case "destructive":
      return {
        iconBg: "bg-red-500/90",
        ring: "ring-red-400/30",
      }
    case "success":
      return {
        iconBg: "bg-green-500/90",
        ring: "ring-green-400/30",
      }
    case "info":
    case "default":
    default:
      return {
        iconBg: "bg-blue-500/90",
        ring: "ring-blue-400/30",
      }
  }
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 w-full max-w-sm">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const styles = getThemeStyles(toast.variant)
          return toast.open ? (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.95,
                transition: { duration: 0.3 },
              }}
              className={cn(
                "flex items-start w-full backdrop-blur-md bg-white/70 dark:bg-zinc-900/60 rounded-2xl ring-2",
                styles.ring,
                "shadow-lg overflow-hidden"
              )}
            >
              {/* Icon */}
              <div className={cn("w-12 h-12 flex items-center justify-center m-3 rounded-xl", styles.iconBg)}>
                <div className="text-white">{ICON_MAP[toast.variant || "default"]}</div>
              </div>

              {/* Content */}
              <div className="flex-1 pr-4 py-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    {toast.title && (
                      <p className="text-sm font-semibold dark:text-white text-zinc-900">
                        {toast.title}
                      </p>
                    )}
                    {toast.description && (
                      <p className="text-xs mt-1 text-zinc-600 dark:text-zinc-400">
                        {toast.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => dismiss(toast.id)}
                    className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
                {toast.action && <div className="mt-3">{toast.action}</div>}
              </div>
            </motion.div>
          ) : null
        })}
      </AnimatePresence>
    </div>
  )
}
