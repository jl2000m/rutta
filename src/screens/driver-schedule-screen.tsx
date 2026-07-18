import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Check, Circle, Clock3, MapPin, Minus, Plus, Repeat } from "lucide-react"
import { useMemo, useState } from "react"
import { DESTINATIONS, ORIGINS, WEEKDAYS } from "../data/mock"
import { useApp } from "../state/app-context"

const TIMES = ["5:45 a.m.", "6:00 a.m.", "6:15 a.m.", "6:30 a.m.", "6:45 a.m.", "7:00 a.m."]
const MAX_SEATS = 3

function matchesPlace(name: string, area: string, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return name.toLowerCase().includes(q) || area.toLowerCase().includes(q)
}

export function DriverScheduleScreen() {
  const { setFlow } = useApp()
  const [origin, setOrigin] = useState(ORIGINS[0].id)
  const [destination, setDestination] = useState(DESTINATIONS[0].id)
  const [originQuery, setOriginQuery] = useState("")
  const [destinationQuery, setDestinationQuery] = useState("")
  const [time, setTime] = useState("6:15 a.m.")
  const [days, setDays] = useState<Set<string>>(new Set(["L", "K", "M", "J", "V"]))
  const [seats, setSeats] = useState(2)
  const [saved, setSaved] = useState(false)

  const filteredOrigins = useMemo(
    () => ORIGINS.filter((n) => matchesPlace(n.name, n.area, originQuery)),
    [originQuery],
  )
  const filteredDestinations = useMemo(
    () => DESTINATIONS.filter((n) => matchesPlace(n.name, n.area, destinationQuery)),
    [destinationQuery],
  )

  const toggleDay = (key: string) => {
    setDays((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleSave = () => {
    if (saved) return
    setSaved(true)
    setTimeout(() => setFlow({ name: "driver-matching" }), 1400)
  }

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
        <div>
          <h1 className="text-lg font-extrabold text-ink-900">Horario recurrente</h1>
          <p className="text-[12px] font-semibold text-ink-400">Publica tu ruta de todos los días</p>
        </div>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-36">
        {/* Route */}
        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 flex items-center gap-1.5 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
            <Repeat size={14} /> Tu ruta
          </h2>
          <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold text-ink-500">
            <Circle size={9} className="fill-brand-600 text-brand-600" /> Origen
          </label>
          <input
            value={originQuery}
            onChange={(e) => setOriginQuery(e.target.value)}
            placeholder="Buscar origen…"
            autoComplete="off"
            className="mb-2.5 w-full rounded-xl border border-mist-200 bg-mist-50 px-3.5 py-2.5 text-[13px] font-bold text-ink-900 outline-none placeholder:font-semibold placeholder:text-ink-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
            aria-label="Buscar origen"
          />
          <div className="mb-4 flex flex-wrap gap-2">
            {filteredOrigins.length === 0 ? (
              <p className="text-[12px] font-semibold text-ink-400">Sin resultados para “{originQuery}”</p>
            ) : (
              filteredOrigins.map((node) => (
                <motion.button
                  key={node.id}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setOrigin(node.id)
                    setOriginQuery("")
                  }}
                  className={`min-h-[44px] rounded-xl border px-3.5 text-[13px] font-bold transition-colors ${
                    origin === node.id
                      ? "border-brand-600 bg-brand-600 text-white shadow-card"
                      : "border-mist-200 bg-white text-ink-700"
                  }`}
                >
                  {node.name}
                </motion.button>
              ))
            )}
          </div>
          <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold text-ink-500">
            <MapPin size={11} className="text-sun-600" /> Destino
          </label>
          <input
            value={destinationQuery}
            onChange={(e) => setDestinationQuery(e.target.value)}
            placeholder="Buscar destino…"
            autoComplete="off"
            className="mb-2.5 w-full rounded-xl border border-mist-200 bg-mist-50 px-3.5 py-2.5 text-[13px] font-bold text-ink-900 outline-none placeholder:font-semibold placeholder:text-ink-400 focus:border-sun-500 focus:ring-2 focus:ring-sun-500/30"
            aria-label="Buscar destino"
          />
          <div className="flex flex-wrap gap-2">
            {filteredDestinations.length === 0 ? (
              <p className="text-[12px] font-semibold text-ink-400">
                Sin resultados para “{destinationQuery}”
              </p>
            ) : (
              filteredDestinations.map((node) => (
                <motion.button
                  key={node.id}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setDestination(node.id)
                    setDestinationQuery("")
                  }}
                  className={`min-h-[44px] rounded-xl border px-3.5 text-[13px] font-bold transition-colors ${
                    destination === node.id
                      ? "border-sun-500 bg-sun-500 text-ink-900 shadow-card"
                      : "border-mist-200 bg-white text-ink-700"
                  }`}
                >
                  {node.name}
                </motion.button>
              ))
            )}
          </div>
        </section>

        {/* Departure time */}
        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 flex items-center gap-1.5 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
            <Clock3 size={14} /> Hora de salida
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TIMES.map((t) => (
              <motion.button
                key={t}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setTime(t)}
                className={`min-h-[44px] shrink-0 rounded-xl border px-4 text-[13px] font-bold transition-colors ${
                  time === t
                    ? "border-brand-600 bg-brand-600 text-white shadow-card"
                    : "border-mist-200 bg-white text-ink-700"
                }`}
              >
                {t}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Days of week */}
        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
            Días de la semana
          </h2>
          <div className="flex justify-between">
            {WEEKDAYS.map(({ key, label }) => {
              const active = days.has(key)
              return (
                <motion.button
                  key={key}
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => toggleDay(key)}
                  aria-label={label}
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-[15px] font-extrabold transition-colors ${
                    active ? "bg-brand-600 text-white shadow-card" : "bg-mist-100 text-ink-400"
                  }`}
                >
                  {key}
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* Seats */}
        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-extrabold text-ink-900">Asientos disponibles</h2>
              <p className="text-[12px] font-semibold text-ink-400">Máx. 3 para viajar cómodos</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => setSeats((s) => Math.max(1, s - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-mist-100 text-ink-700"
                aria-label="Menos asientos"
              >
                <Minus size={18} strokeWidth={2.6} />
              </motion.button>
              <motion.span
                key={seats}
                initial={{ scale: 1.4, color: "#0047FF" }}
                animate={{ scale: 1, color: "#0c1330" }}
                className="w-6 text-center text-2xl font-extrabold"
              >
                {seats}
              </motion.span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => setSeats((s) => Math.min(MAX_SEATS, s + 1))}
                className={`flex h-11 w-11 items-center justify-center rounded-full ${
                  seats >= MAX_SEATS ? "bg-mist-100 text-ink-300" : "bg-brand-600 text-white"
                }`}
                aria-label="Más asientos"
              >
                <Plus size={18} strokeWidth={2.6} />
              </motion.button>
            </div>
          </div>
          {seats >= MAX_SEATS && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 rounded-xl bg-sun-500/10 px-3 py-2 text-[12px] font-bold text-amber-800"
            >
              Límite alcanzado: Rutta reserva el asiento delantero para tu comodidad.
            </motion.p>
          )}
        </section>
      </div>

      {/* CTA */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-mist-50 via-mist-50/95 to-transparent px-5 pb-8 pt-6">
        <motion.button
          type="button"
          onClick={handleSave}
          whileTap={{ scale: saved ? 1 : 0.95 }}
          animate={{ backgroundColor: saved ? "#10b981" : "#0047FF" }}
          className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-extrabold text-white shadow-xl shadow-blue-900/10"
        >
          <AnimatePresence mode="wait" initial={false}>
            {saved ? (
              <motion.span
                key="saved"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check size={20} strokeWidth={3} /> Ruta publicada
              </motion.span>
            ) : (
              <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Publicar horario · {days.size} días
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}
