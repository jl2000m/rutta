import { motion } from "framer-motion"
import { ArrowDown, Car, Footprints } from "lucide-react"
import { formatBalboa, firstName, type PastTrip } from "../data/mock"
import { StatusBadge } from "./status-badge"
import { UserAvatar } from "./user-avatar"

interface TripCardProps {
  trip: PastTrip
  onTap?: () => void
}

export function TripCard({ trip, onTap }: TripCardProps) {
  const isScheduled = trip.status === "scheduled"
  const group = trip.companions

  return (
    <motion.button
      type="button"
      onClick={onTap}
      whileTap={{ scale: 0.97 }}
      className={`w-full rounded-3xl border p-4 text-left shadow-card ${
        isScheduled ? "border-brand-100 bg-brand-50/60" : "border-mist-100 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              trip.role === "driver" ? "bg-brand-600 text-white" : "bg-sun-500 text-ink-900"
            }`}
          >
            {trip.role === "driver" ? (
              <Car size={17} strokeWidth={2.4} />
            ) : (
              <Footprints size={17} strokeWidth={2.4} />
            )}
          </div>
          <div>
            <p className="text-[13px] font-bold text-ink-900">
              {trip.date} · {trip.time}
            </p>
            <p className="text-[11px] font-semibold text-ink-400">
              {trip.role === "driver" ? "Como conductor" : `Con ${trip.driver.name}`}
            </p>
          </div>
        </div>
        {isScheduled ? (
          <StatusBadge tone="smart">Programado</StatusBadge>
        ) : (
          <span
            className={`text-sm font-extrabold ${
              trip.amount >= 0 ? "text-emerald-600" : "text-ink-700"
            }`}
          >
            {formatBalboa(trip.amount, true)}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-start gap-3 border-t border-ink-900/5 pt-3">
        <div className="mt-1 flex flex-col items-center gap-0.5">
          <span className="h-2 w-2 rounded-full bg-brand-600" />
          <ArrowDown size={11} className="text-ink-300" />
          <span className="h-2 w-2 rounded-full bg-sun-500" />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="truncate text-[13px] font-semibold text-ink-700">{trip.origin}</p>
          <p className="truncate text-[13px] font-semibold text-ink-700">{trip.destination}</p>
        </div>
      </div>

      {(group.length > 0 || trip.role === "passenger") && (
        <div className="mt-3 flex items-center gap-2 border-t border-ink-900/5 pt-3">
          <div className="flex -space-x-2">
            {trip.role === "passenger" && (
              <UserAvatar persona={trip.driver} size={28} />
            )}
            {group.slice(0, 3).map((persona) => (
              <UserAvatar key={persona.id} persona={persona} size={28} />
            ))}
          </div>
          <p className="min-w-0 truncate text-[11px] font-bold text-ink-500">
            {trip.role === "passenger"
              ? [trip.driver, ...group].map(firstName).join(", ")
              : group.map(firstName).join(", ") || "Sin pasajeros"}
          </p>
        </div>
      )}
    </motion.button>
  )
}
