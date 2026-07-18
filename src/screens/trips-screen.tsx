import { motion } from "framer-motion"
import { TripCard } from "../components/trip-card"
import { PAST_TRIPS } from "../data/mock"
import { useApp } from "../state/app-context"

export function TripsScreen() {
  const { mode, setFlow } = useApp()
  const modeTrips = PAST_TRIPS.filter((t) => t.role === mode)
  const scheduled = modeTrips.filter((t) => t.status === "scheduled")
  const completed = modeTrips.filter((t) => t.status === "completed")

  return (
    <div className="h-full overflow-y-auto px-5 pb-28 pt-14">
      <h1 className="text-2xl font-extrabold text-ink-900">Tus viajes</h1>
      <p className="mt-1 text-[13px] font-semibold text-ink-400">
        {mode === "driver"
          ? "Historial y próximas rutas como conductor"
          : "Historial y próximas rutas como pasajero"}
      </p>

      <section className="mt-5">
        <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
          Próximos
        </h2>
        <div className="space-y-3">
          {scheduled.length === 0 && (
            <p className="rounded-3xl border border-dashed border-mist-200 bg-white/60 px-4 py-6 text-center text-[13px] font-semibold text-ink-400">
              No tienes viajes próximos en este modo
            </p>
          )}
          {scheduled.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <TripCard
                trip={trip}
                onTap={() => setFlow({ name: "trip-details", tripId: trip.id })}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
          Anteriores
        </h2>
        <div className="space-y-3">
          {completed.length === 0 && (
            <p className="rounded-3xl border border-dashed border-mist-200 bg-white/60 px-4 py-6 text-center text-[13px] font-semibold text-ink-400">
              Aún no hay viajes completados
            </p>
          )}
          {completed.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <TripCard
                trip={trip}
                onTap={() => setFlow({ name: "trip-details", tripId: trip.id })}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
