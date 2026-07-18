import { motion } from "framer-motion"
import { Car, Footprints } from "lucide-react"
import { useApp, type UserMode } from "../state/app-context"

const MODES: { id: UserMode; label: string; icon: typeof Car }[] = [
  { id: "passenger", label: "Pasajero", icon: Footprints },
  { id: "driver", label: "Conductor", icon: Car },
]

export function ModeSwitcher() {
  const { mode, setMode } = useApp()
  // On the driver (blue) header inactive labels need light text; on the
  // passenger (yellow) header dark text reads better.
  const inactiveText = mode === "driver" ? "text-white/75" : "text-ink-700"

  return (
    <div className={`flex rounded-2xl p-1 ${mode === "driver" ? "bg-white/15" : "bg-ink-900/10"}`}>
      {MODES.map(({ id, label, icon: Icon }) => {
        const active = mode === id
        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            whileTap={{ scale: 0.96 }}
            className="relative flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl"
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-xl bg-white shadow-card"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon
              size={16}
              strokeWidth={2.5}
              className={`relative z-10 ${active ? (id === "driver" ? "text-brand-700" : "text-ink-900") : inactiveText}`}
            />
            <span
              className={`relative z-10 text-[13px] font-bold ${
                active ? (id === "driver" ? "text-brand-700" : "text-ink-900") : inactiveText
              }`}
            >
              {label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
