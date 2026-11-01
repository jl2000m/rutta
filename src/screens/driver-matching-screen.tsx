import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion"
import { ArrowLeft, Check, Footprints, MapPin, Sparkles, Star, X } from "lucide-react"
import { CompatibilityBadge, CompatibilityReason } from "../components/ride-preferences-card"
import { StatusBadge } from "../components/status-badge"
import { UserAvatar } from "../components/user-avatar"
import type { MatchCandidate } from "../data/mock"
import { computeCompatibility, type Compatibility } from "../lib/ride-preferences"
import { useApp } from "../state/app-context"

export function DriverMatchingScreen() {
  const { setFlow, pendingCandidates, acceptedPassengers, acceptCandidate, rejectCandidate, ridePreferences } =
    useApp()
  // Smart matching: detour first, then affinity with the driver's ride preferences.
  const rankedCandidates = pendingCandidates
    .map((candidate) => ({ candidate, compatibility: computeCompatibility(ridePreferences, candidate.persona.preferences) }))
    .sort(
      (a, b) =>
        a.candidate.detourMinutes - b.candidate.detourMinutes || b.compatibility.score - a.compatibility.score,
    )
  const seatsFull = acceptedPassengers.length >= 3

  return (
    <div className="flex h-full flex-col bg-mist-50">
      <header className="flex items-center gap-3 px-5 pb-4 pt-14">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setFlow({ name: "none" })}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-card"
          aria-label="Volver"
        >
          <ArrowLeft size={20} className="text-ink-900" />
        </motion.button>
        <div className="flex-1">
          <h1 className="flex items-center gap-1.5 text-lg font-extrabold text-ink-900">
            Pasajeros recomendados <Sparkles size={17} className="text-brand-600" />
          </h1>
          <p className="text-[12px] font-semibold text-ink-400">
            IA de Rutta · Menor desvío + afinidad
          </p>
        </div>
        <span className="rounded-full bg-brand-600 px-3 py-1.5 text-[12px] font-extrabold text-white">
          {acceptedPassengers.length}/3
        </span>
      </header>

      <div className="mx-5 mb-3 flex items-center gap-2 rounded-2xl border border-brand-100 bg-brand-50/70 px-4 py-2.5 text-[12px] font-bold text-brand-700">
        <span className="flex items-center gap-1">
          <Check size={13} strokeWidth={3} /> Desliza a la derecha para aceptar
        </span>
        <span className="text-brand-300">·</span>
        <span className="flex items-center gap-1">
          <X size={13} strokeWidth={3} /> izquierda para rechazar
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-32">
        <AnimatePresence>
          {rankedCandidates.map(({ candidate, compatibility }) => (
            <SwipeCard
              key={candidate.id}
              candidate={candidate}
              compatibility={compatibility}
              disabled={seatsFull}
              onAccept={() => acceptCandidate(candidate)}
              onReject={() => rejectCandidate(candidate)}
            />
          ))}
        </AnimatePresence>

        {pendingCandidates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-mist-200 bg-white/60 p-8 text-center"
          >
            <p className="text-[15px] font-extrabold text-ink-900">No hay más solicitudes</p>
            <p className="mt-1 text-[13px] font-semibold text-ink-400">
              Te avisaremos cuando la IA encuentre nuevos pasajeros en tu ruta.
            </p>
          </motion.div>
        )}

        {acceptedPassengers.length > 0 && (
          <section className="pt-2">
            <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
              Confirmados para mañana
            </h2>
            <div className="space-y-2">
              {acceptedPassengers.map(({ candidate }) => (
                <motion.div
                  key={candidate.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5"
                >
                  <UserAvatar persona={candidate.persona} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-extrabold text-ink-900">{candidate.persona.name}</p>
                    <p className="truncate text-[12px] font-semibold text-ink-500">
                      Sube en {candidate.pickupNode}
                    </p>
                  </div>
                  <StatusBadge tone="verified">Aceptado</StatusBadge>
                </motion.div>
              ))}
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setFlow({ name: "active-trip" })}
              className="mt-3 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-ink-900 text-[15px] font-extrabold text-sun-400 shadow-xl shadow-blue-900/10"
            >
              Ir al viaje activo
            </motion.button>
          </section>
        )}
      </div>
    </div>
  )
}

interface SwipeCardProps {
  candidate: MatchCandidate
  compatibility: Compatibility
  disabled: boolean
  onAccept: () => void
  onReject: () => void
}

function SwipeCard({ candidate, compatibility, disabled, onAccept, onReject }: SwipeCardProps) {
  const x = useMotionValue(0)
  const acceptOpacity = useTransform(x, [24, 110], [0, 1])
  const rejectOpacity = useTransform(x, [-110, -24], [1, 0])
  const rotate = useTransform(x, [-160, 160], [-3, 3])

  return (
    <motion.div
      layout
      exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.25 } }}
      className="relative"
    >
      {/* Swipe hint backgrounds */}
      <motion.div
        style={{ opacity: acceptOpacity }}
        className="absolute inset-0 flex items-center rounded-3xl bg-emerald-500 px-5"
      >
        <span className="flex items-center gap-1.5 text-[14px] font-extrabold text-white">
          <Check size={18} strokeWidth={3} /> Aceptar
        </span>
      </motion.div>
      <motion.div
        style={{ opacity: rejectOpacity }}
        className="absolute inset-0 flex items-center justify-end rounded-3xl bg-red-500 px-5"
      >
        <span className="flex items-center gap-1.5 text-[14px] font-extrabold text-white">
          Rechazar <X size={18} strokeWidth={3} />
        </span>
      </motion.div>

      <motion.div
        drag="x"
        style={{ x, rotate }}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={(_, info) => {
          if ((info.offset.x > 120 || info.velocity.x > 700) && !disabled) onAccept()
          else if (info.offset.x < -120 || info.velocity.x < -700) onReject()
        }}
        className="relative cursor-grab touch-pan-y rounded-3xl border border-mist-100 bg-white p-4 shadow-card active:cursor-grabbing"
      >
        <div className="flex items-center gap-3">
          <UserAvatar persona={candidate.persona} size={48} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-extrabold text-ink-900">{candidate.persona.name}</p>
              <span className="flex items-center gap-0.5 text-[13px] font-bold text-ink-700">
                <Star size={12} className="fill-sun-500 text-sun-500" />
                {candidate.persona.rating.toFixed(1)}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="min-w-0 truncate text-[12px] font-semibold text-ink-400">{candidate.persona.role}</p>
              <CompatibilityBadge compatibility={compatibility} />
            </div>
          </div>
        </div>
        <CompatibilityReason compatibility={compatibility} />

        <div className="mt-3 space-y-1.5 border-t border-ink-900/5 pt-3">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-500">
            <MapPin size={13} className="shrink-0 text-brand-600" />
            <span className="truncate">
              {candidate.pickupNode} → {candidate.dropoffNode}
            </span>
          </p>
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-500">
            <Footprints size={13} className="shrink-0 text-ink-400" />
            Camina {candidate.walkMinutes} min al punto de encuentro
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {candidate.onSameRoute ? (
            <StatusBadge tone="smart">En tu misma ruta</StatusBadge>
          ) : (
            <StatusBadge tone="pending" iconOverride={<MapPin size={13} strokeWidth={2.5} />}>
              Desvío: +{candidate.detourMinutes} min
            </StatusBadge>
          )}
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={onReject}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500"
              aria-label={`Rechazar a ${candidate.persona.name}`}
            >
              <X size={19} strokeWidth={2.8} />
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => !disabled && onAccept()}
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                disabled ? "bg-mist-100 text-ink-300" : "bg-emerald-500 text-white shadow-card"
              }`}
              aria-label={`Aceptar a ${candidate.persona.name}`}
            >
              <Check size={19} strokeWidth={2.8} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
