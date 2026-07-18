export interface MembershipTier {
  id: "miembro" | "plata" | "oro" | "platino" | "diamante"
  label: string
  /** Realistic medal/trophy emoji for the tier */
  emoji: string
  minTrips: number
  nextMin?: number
  /** Tailwind-ish accent classes for the banner */
  accent: string
  iconBg: string
  iconText: string
  labelColor: string
  bar: string
}

const TIERS: MembershipTier[] = [
  {
    id: "miembro",
    label: "Inicial",
    emoji: "🏅",
    minTrips: 0,
    nextMin: 25,
    accent: "bg-slate-800",
    iconBg: "bg-slate-300",
    iconText: "text-slate-800",
    labelColor: "text-slate-300",
    bar: "bg-slate-300",
  },
  {
    id: "plata",
    label: "Plata",
    emoji: "🥈",
    minTrips: 25,
    nextMin: 75,
    accent: "bg-slate-700",
    iconBg: "bg-slate-200",
    iconText: "text-slate-700",
    labelColor: "text-slate-200",
    bar: "bg-slate-200",
  },
  {
    id: "oro",
    label: "Oro",
    emoji: "🥇",
    minTrips: 75,
    nextMin: 150,
    accent: "bg-ink-900",
    iconBg: "bg-sun-500",
    iconText: "text-ink-900",
    labelColor: "text-sun-400",
    bar: "bg-sun-500",
  },
  {
    id: "platino",
    label: "Platino",
    emoji: "🏆",
    minTrips: 150,
    nextMin: 300,
    accent: "bg-[#1a2744]",
    iconBg: "bg-sky-200",
    iconText: "text-[#1a2744]",
    labelColor: "text-sky-200",
    bar: "bg-sky-300",
  },
  {
    id: "diamante",
    label: "Diamante",
    emoji: "💎",
    minTrips: 300,
    accent: "bg-[#0c1a2e]",
    iconBg: "bg-cyan-300",
    iconText: "text-[#0c1a2e]",
    labelColor: "text-cyan-300",
    bar: "bg-cyan-300",
  },
]

export function getMembershipTier(tripsCompleted: number): MembershipTier & {
  progress: number
  tripsToNext: number | null
  nextLabel: string | null
} {
  let current = TIERS[0]
  for (const tier of TIERS) {
    if (tripsCompleted >= tier.minTrips) current = tier
  }
  const next = TIERS.find((t) => t.minTrips > current.minTrips) ?? null
  const span = next ? next.minTrips - current.minTrips : 1
  const gained = tripsCompleted - current.minTrips
  const progress = next ? Math.min(1, Math.max(0, gained / span)) : 1
  const tripsToNext = next ? Math.max(0, next.minTrips - tripsCompleted) : null

  return {
    ...current,
    progress,
    tripsToNext,
    nextLabel: next?.label ?? null,
  }
}
