import { motion } from "framer-motion"
import { ChevronRight, SlidersHorizontal, Sparkles } from "lucide-react"
import {
  compatibilityTone,
  conversationLabel,
  topicEmoji,
  type Compatibility,
} from "../lib/ride-preferences"
import { useApp } from "../state/app-context"

/** Profile entry point that summarizes the user's ride preferences. */
export function RidePreferencesCard() {
  const { ridePreferences, setFlow } = useApp()
  const summary = [
    conversationLabel(ridePreferences.conversation),
    ...ridePreferences.musicGenres.slice(0, 2),
  ].join(" · ")

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={() => setFlow({ name: "ride-preferences" })}
      className="mt-4 w-full rounded-3xl border border-brand-100 bg-white p-4 text-left shadow-card"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-card">
          <SlidersHorizontal size={20} strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[15px] font-extrabold text-ink-900">
            Preferencias de viaje <Sparkles size={14} className="text-brand-600" />
          </p>
          <p className="truncate text-[12px] font-semibold text-ink-400">{summary}</p>
        </div>
        <ChevronRight size={18} className="text-ink-300" />
      </div>
      {ridePreferences.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ridePreferences.topics.map((topic) => (
            <span key={topic} className="rounded-full bg-mist-50 px-2.5 py-1 text-[11px] font-bold text-ink-700">
              {topicEmoji(topic)} {topic}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  )
}

export function CompatibilityBadge({ compatibility }: { compatibility: Compatibility }) {
  const tone = compatibilityTone(compatibility.score)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${tone.classes}`}
      title={tone.label}
    >
      <Sparkles size={12} strokeWidth={2.6} />
      {compatibility.score}% afín
    </span>
  )
}

/** One-line reason under a match card, e.g. "A ambos les gusta conversar". */
export function CompatibilityReason({ compatibility }: { compatibility: Compatibility }) {
  const reason = compatibility.highlights[0]
  if (!reason) return null
  return (
    <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-ink-500">
      <Sparkles size={12} className="shrink-0 text-amber-600" />
      <span className="truncate">{reason}</span>
    </p>
  )
}
