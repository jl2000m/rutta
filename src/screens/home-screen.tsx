import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight,
  CalendarClock,
  ChevronRight,
  Circle,
  CirclePlus,
  Leaf,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  Users,
} from "lucide-react"
import { DriverVehicleSelector } from "../components/driver-vehicle-selector"
import { ModeSwitcher } from "../components/mode-switcher"
import { RoutePattern } from "../components/route-pattern"
import { UserAvatar } from "../components/user-avatar"
import { DESTINATIONS, DIEGO, formatTravelWith, ORIGINS, TRIP_DURATION } from "../data/mock"
import { useApp } from "../state/app-context"

export function HomeScreen() {
  const { mode, setFlow, acceptedPassengers, pendingCandidates, bookedTrip, oneTimeTrip } = useApp()
  const isDriver = mode === "driver"

  return (
    <div className="flex h-full flex-col overflow-y-auto pb-28">
      <header
        className={`relative px-5 pb-6 pt-14 transition-colors duration-500 ${
          isDriver ? "bg-brand-600" : "bg-sun-500"
        } rounded-b-[32px]`}
      >
        <RoutePattern tone={isDriver ? "brand" : "sun"} className="rounded-b-[32px]" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar persona={DIEGO} size={46} ring />
            <div>
              <p className={`text-[13px] font-semibold ${isDriver ? "text-brand-100" : "text-ink-700"}`}>
                Buenos días
              </p>
              <h1
                className={`whitespace-nowrap text-[18px] font-extrabold ${
                  isDriver ? "text-white" : "text-ink-900"
                }`}
              >
                Hola, {DIEGO.name}
              </h1>
            </div>
          </div>
          {isDriver && <DriverVehicleSelector />}
        </div>

        <div className="relative mt-5">
          <ModeSwitcher />
        </div>
      </header>

      <div className="flex-1 space-y-4 px-5 pt-5">
        <AnimatePresence mode="wait">
          {isDriver ? (
            <motion.div
              key="driver-home"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-4"
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setFlow({ name: "active-trip" })}
                className="w-full rounded-3xl bg-ink-900 p-5 text-left text-white shadow-xl shadow-blue-900/10"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-sun-500 px-3 py-1 text-[11px] font-extrabold text-ink-900">
                    <Navigation size={12} strokeWidth={2.8} /> RUTA DE HOY
                  </span>
                  <span className="text-[12px] font-bold text-white/60">{TRIP_DURATION} est.</span>
                </div>
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Circle size={10} className="fill-brand-400 text-brand-400" />
                    <p className="text-[15px] font-bold">Costa Verde, La Chorrera</p>
                  </div>
                  <div className="ml-[4.5px] h-3 w-px bg-white/25" />
                  <div className="flex items-center gap-2.5">
                    <MapPin size={12} className="text-sun-400" />
                    <p className="text-[15px] font-bold">Business Park, Costa del Este</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3.5">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white/70">
                    <Users size={15} /> {acceptedPassengers.length} de 3 asientos ocupados
                  </span>
                  <span className="flex items-center gap-1 text-[13px] font-extrabold text-sun-400">
                    Iniciar viaje
                    <ArrowRight size={15} strokeWidth={2.8} />
                  </span>
                </div>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setFlow({ name: "driver-schedule" })}
                className="w-full rounded-3xl border border-mist-100 bg-white p-5 text-left shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sun-500/20 text-amber-700">
                      <CalendarClock size={20} strokeWidth={2.4} />
                    </div>
                    <div>
                      <p className="text-[15px] font-extrabold text-ink-900">Mi horario recurrente</p>
                      <p className="text-[12px] font-semibold text-ink-400">L a V · Salida 6:15 a.m.</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-ink-300" />
                </div>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setFlow({ name: "driver-matching" })}
                className="w-full rounded-3xl border border-brand-100 bg-white p-5 text-left shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                      <Sparkles size={20} strokeWidth={2.4} />
                    </div>
                    <div>
                      <p className="text-[15px] font-extrabold text-ink-900">Pasajeros recomendados</p>
                      <p className="text-[12px] font-semibold text-ink-400">
                        {pendingCandidates.length}{" "}
                        {pendingCandidates.length === 1 ? "match" : "matches"} en tu misma ruta
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-ink-300" />
                </div>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setFlow({ name: "driver-one-time-trip" })}
                className={`w-full rounded-3xl border p-5 text-left shadow-card ${
                  oneTimeTrip
                    ? "border-emerald-100 bg-emerald-50/70"
                    : "border-brand-100 bg-brand-50/60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        oneTimeTrip
                          ? "bg-emerald-500 text-white"
                          : "bg-brand-600 text-white"
                      }`}
                    >
                      <CirclePlus size={20} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-extrabold text-ink-900">
                        {oneTimeTrip ? "Viaje puntual publicado" : "Crear viaje puntual"}
                      </p>
                      <p className="truncate text-[12px] font-semibold text-ink-400">
                        {oneTimeTrip
                          ? `${ORIGINS.find((node) => node.id === oneTimeTrip.origin)?.name ?? "Origen"} → ${
                              DESTINATIONS.find((node) => node.id === oneTimeTrip.destination)?.name ??
                              "Destino"
                            } · ${oneTimeTrip.time}`
                          : "Hoy, fin de semana o cuando quieras"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-ink-300" />
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="passenger-home"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-4"
            >
              {bookedTrip && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFlow({ name: "active-trip" })}
                  className="w-full rounded-3xl border border-brand-100 bg-white p-5 text-left shadow-xl shadow-blue-900/10"
                >
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold text-brand-700">
                    PRÓXIMO VIAJE RESERVADO
                  </span>
                  <p className="mt-3 text-[16px] font-extrabold text-ink-900">
                    {bookedTrip.origin.split(",")[0]} → {bookedTrip.destination.split(",")[0]}
                  </p>
                  <p className="mt-1 text-[12px] font-semibold text-ink-400">
                    Sale {bookedTrip.offer.departureTime} · con {bookedTrip.offer.persona.name}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <UserAvatar persona={bookedTrip.offer.persona} size={32} />
                      {bookedTrip.companions.slice(0, 3).map((c) => (
                        <UserAvatar key={c.persona.id} persona={c.persona} size={32} />
                      ))}
                    </div>
                    <p className="min-w-0 flex-1 truncate text-[12px] font-bold text-ink-500">
                      {formatTravelWith(bookedTrip.companions.map((c) => c.persona))}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[13px] font-extrabold text-brand-600">
                    Ver viaje en curso <ArrowRight size={15} strokeWidth={2.8} />
                  </div>
                </motion.button>
              )}

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setFlow({ name: "passenger-search" })}
                className="flex w-full items-center gap-3 rounded-3xl border border-mist-100 bg-white p-4 text-left shadow-xl shadow-blue-900/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <Search size={21} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[16px] font-extrabold text-ink-900">¿A dónde vas hoy?</p>
                  <p className="text-[12px] font-semibold text-ink-400">Busca conductores en tu ruta</p>
                </div>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setFlow({
                    name: "passenger-matching",
                    origin: "Costa Verde, La Chorrera",
                    destination: "Business Park, Costa del Este",
                  })
                }
                className="w-full rounded-3xl bg-ink-900 p-5 text-left text-white shadow-xl shadow-blue-900/10"
              >
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold text-sun-400">
                  TU RUTA FRECUENTE
                </span>
                <p className="mt-3 text-[16px] font-extrabold">Costa Verde → Costa del Este</p>
                <p className="mt-1 text-[12px] font-semibold text-white/60">
                  3 conductores salen entre 6:00 y 7:00 a.m. · grupos con Camila y Luis
                </p>
                <div className="mt-3 flex items-center gap-1 text-[13px] font-extrabold text-sun-400">
                  Ver conductores <ArrowRight size={15} strokeWidth={2.8} />
                </div>
              </motion.button>

              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                    <Leaf size={20} strokeWidth={2.4} />
                  </div>
                  <div>
                    <p className="text-[15px] font-extrabold text-ink-900">Este mes ahorraste B/. 34.00</p>
                    <p className="text-[12px] font-semibold text-emerald-700">
                      vs. taxi individual · 18 kg CO₂ menos
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-3 pb-4">
          <div className="rounded-3xl border border-mist-100 bg-white p-4 shadow-card">
            <p className="text-2xl font-extrabold text-ink-900">128</p>
            <p className="text-[12px] font-semibold text-ink-400">Viajes compartidos</p>
          </div>
          <div className="rounded-3xl border border-mist-100 bg-white p-4 shadow-card">
            <p className="text-2xl font-extrabold text-ink-900">4.9 ★</p>
            <p className="text-[12px] font-semibold text-ink-400">Tu calificación</p>
          </div>
        </div>
      </div>
    </div>
  )
}
