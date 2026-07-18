import { CheckCircle2, Clock3, ShieldCheck, Sparkles } from "lucide-react"
import type { ReactNode } from "react"

type BadgeTone = "verified" | "pending" | "trust" | "smart"

const TONES: Record<BadgeTone, { classes: string; icon: ReactNode }> = {
  verified: {
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 size={13} strokeWidth={2.5} />,
  },
  pending: {
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock3 size={13} strokeWidth={2.5} />,
  },
  trust: {
    classes: "bg-brand-50 text-brand-700 border-brand-100",
    icon: <ShieldCheck size={13} strokeWidth={2.5} />,
  },
  smart: {
    classes: "bg-sun-500/15 text-amber-800 border-sun-500/40",
    icon: <Sparkles size={13} strokeWidth={2.5} />,
  },
}

interface StatusBadgeProps {
  tone: BadgeTone
  children: ReactNode
  iconOverride?: ReactNode
}

export function StatusBadge({ tone, children, iconOverride }: StatusBadgeProps) {
  const { classes, icon } = TONES[tone]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${classes}`}
    >
      {iconOverride ?? icon}
      {children}
    </span>
  )
}
