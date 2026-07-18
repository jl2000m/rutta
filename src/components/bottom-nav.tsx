import { motion } from "framer-motion"
import { CreditCard, Home, Route, User, Wallet } from "lucide-react"
import { useApp, type Tab } from "../state/app-context"

export function BottomNav() {
  const { mode, tab, setTab } = useApp()
  const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "trips", label: "Viajes", icon: Route },
    {
      id: "wallet",
      label: mode === "driver" ? "Billetera" : "Pagos",
      icon: mode === "driver" ? Wallet : CreditCard,
    },
    { id: "profile", label: "Perfil", icon: User },
  ]

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-5">
      <div className="pointer-events-auto flex items-center justify-between rounded-[26px] border border-white/60 bg-white/85 px-2 py-2 shadow-float backdrop-blur-xl">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              whileTap={{ scale: 0.92 }}
              className="relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl"
              aria-label={label}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-x-1 inset-y-0 rounded-2xl bg-brand-600"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={2.4}
                className={`relative z-10 transition-colors ${active ? "text-white" : "text-ink-400"}`}
              />
              <span
                className={`relative z-10 text-[10px] font-bold transition-colors ${
                  active ? "text-white" : "text-ink-400"
                }`}
              >
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
