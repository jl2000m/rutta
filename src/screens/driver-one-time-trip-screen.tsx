import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Circle,
  Clock3,
  MapPin,
  Minus,
  Plus,
  Users,
} from "lucide-react"
import { useMemo, useState } from "react"
import { PressButton } from "../components/press-button"
import { DESTINATIONS, ORIGINS } from "../data/mock"
import { useApp } from "../state/app-context"

const TIMES = ["6:00 a.m.", "7:00 a.m.", "8:00 a.m.", "10:00 a.m.", "2:00 p.m.", "5:00 p.m."]

function toLocalDateInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getQuickDates() {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const saturday = new Date(today)
  const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7
  saturday.setDate(today.getDate() + daysUntilSaturday)

  const sunday = new Date(saturday)
  sunday.setDate(saturday.getDate() + 1)

  return [
    { label: "Hoy", value: toLocalDateInput(today) },
    { label: "Mañana", value: toLocalDateInput(tomorrow) },
    { label: "Sábado", value: toLocalDateInput(saturday) },
    { label: "Domingo", value: toLocalDateInput(sunday) },
  ]
}

export function DriverOneTimeTripScreen() {
  const { setFlow, oneTimeTrip, publishOneTimeTrip } = useApp()
  const quickDates = useMemo(getQuickDates, [])
  const [origin, setOrigin] = useState(oneTimeTrip?.origin ?? ORIGINS[0].id)
  const [destination, setDestination] = useState(oneTimeTrip?.destination ?? DESTINATIONS[0].id)
  const [date, setDate] = useState(oneTimeTrip?.date ?? quickDates[2].value)
  const [time, setTime] = useState(oneTimeTrip?.time ?? "10:00 a.m.")
  const [seats, setSeats] = useState(oneTimeTrip?.seats ?? 2)
  const [originQuery, setOriginQuery] = useState("")
  const [destinationQuery, setDestinationQuery] = useState("")
  const [isPublished, setIsPublished] = useState(false)

  const filteredOrigins = ORIGINS.filter((node) =>
    `${node.name} ${node.area}`.toLowerCase().includes(originQuery.toLowerCase()),
  )
  const filteredDestinations = DESTINATIONS.filter((node) =>
    `${node.name} ${node.area}`.toLowerCase().includes(destinationQuery.toLowerCase()),
  )
  const selectedOrigin = ORIGINS.find((node) => node.id === origin)
  const selectedDestination = DESTINATIONS.find((node) => node.id === destination)

  const handlePublish = () => {
    if (!selectedOrigin || !selectedDestination || isPublished) return
    publishOneTimeTrip({
      origin,
      destination,
      date,
      time,
      seats,
    })
    setIsPublished(true)
    window.setTimeout(() => setFlow({ name: "none" }), 1200)
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
          <h1 className="text-lg font-extrabold text-ink-900">Crear viaje puntual</h1>
          <p className="text-[12px] font-semibold text-ink-400">Para hoy, el fin de semana o cuando quieras</p>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-36">
        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <h2 className="mb-4 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">Ruta</h2>
          <PlacePicker
            label="Origen"
            query={originQuery}
            onQueryChange={setOriginQuery}
            options={filteredOrigins}
            selectedId={origin}
            onSelect={(id) => {
              setOrigin(id)
              setOriginQuery("")
            }}
            tone="brand"
          />
          <div className="my-4 h-px bg-mist-100" />
          <PlacePicker
            label="Destino"
            query={destinationQuery}
            onQueryChange={setDestinationQuery}
            options={filteredDestinations}
            selectedId={destination}
            onSelect={(id) => {
              setDestination(id)
              setDestinationQuery("")
            }}
            tone="sun"
          />
        </section>

        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <h2 className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
            <CalendarDays size={15} /> ¿Cuándo sales?
          </h2>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {quickDates.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setDate(option.value)}
                className={`min-h-[44px] rounded-xl border text-[11px] font-extrabold ${
                  date === option.value
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-mist-200 bg-white text-ink-600"
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
          <label className="mt-3 block">
            <span className="sr-only">Otra fecha</span>
            <input
              type="date"
              value={date}
              min={quickDates[0].value}
              onChange={(event) => setDate(event.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-mist-200 bg-mist-50 px-3.5 text-[13px] font-bold text-ink-800 outline-none focus:border-brand-600"
            />
          </label>
        </section>

        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <h2 className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
            <Clock3 size={15} /> Hora de salida
          </h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {TIMES.map((option) => (
              <motion.button
                key={option}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setTime(option)}
                className={`min-h-[44px] shrink-0 rounded-xl border px-4 text-[12px] font-extrabold ${
                  time === option
                    ? "border-sun-500 bg-sun-500 text-ink-900"
                    : "border-mist-200 bg-white text-ink-600"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
                <Users size={15} /> Asientos disponibles
              </h2>
              <p className="mt-1 text-[12px] font-semibold text-ink-400">Máximo 3 para viajar cómodos</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setSeats((current) => Math.max(1, current - 1))}
                disabled={seats === 1}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-mist-100 text-ink-700 disabled:opacity-35"
                aria-label="Menos asientos"
              >
                <Minus size={18} />
              </motion.button>
              <span className="w-5 text-center text-xl font-extrabold text-ink-900">{seats}</span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setSeats((current) => Math.min(3, current + 1))}
                disabled={seats === 3}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white disabled:opacity-35"
                aria-label="Más asientos"
              >
                <Plus size={18} />
              </motion.button>
            </div>
          </div>
        </section>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-mist-50 via-mist-50/95 to-transparent px-5 pb-8 pt-6">
        <PressButton className="w-full" onClick={handlePublish} variant={isPublished ? "success" : "primary"}>
          <AnimatePresence mode="wait" initial={false}>
            {isPublished ? (
              <motion.span
                key="published"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check size={18} strokeWidth={3} /> Viaje publicado
              </motion.span>
            ) : (
              <motion.span key="publish" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Publicar viaje puntual
              </motion.span>
            )}
          </AnimatePresence>
        </PressButton>
      </div>
    </div>
  )
}

interface PlacePickerProps {
  label: string
  query: string
  onQueryChange: (value: string) => void
  options: typeof ORIGINS
  selectedId: string
  onSelect: (id: string) => void
  tone: "brand" | "sun"
}

function PlacePicker({
  label,
  query,
  onQueryChange,
  options,
  selectedId,
  onSelect,
  tone,
}: PlacePickerProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[12px] font-bold text-ink-500">
        {tone === "brand" ? (
          <Circle size={10} className="fill-brand-600 text-brand-600" />
        ) : (
          <MapPin size={13} className="text-sun-600" />
        )}
        {label}
      </label>
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={`Buscar ${label.toLowerCase()}…`}
        className="mt-2 min-h-[44px] w-full rounded-xl border border-mist-200 bg-mist-50 px-3.5 text-[13px] font-bold text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-600"
      />
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {options.length === 0 ? (
          <p className="py-2 text-[12px] font-semibold text-ink-400">No encontramos ese lugar</p>
        ) : (
          options.map((node) => (
            <motion.button
              key={node.id}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelect(node.id)}
              className={`min-h-[44px] shrink-0 rounded-xl border px-3.5 text-left ${
                selectedId === node.id
                  ? tone === "brand"
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-sun-500 bg-sun-500 text-ink-900"
                  : "border-mist-200 bg-white text-ink-700"
              }`}
            >
              <span className="block text-[12px] font-extrabold">{node.name}</span>
              <span className="block text-[10px] font-semibold opacity-65">{node.area}</span>
            </motion.button>
          ))
        )}
      </div>
    </div>
  )
}
