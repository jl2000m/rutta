import { motion } from "framer-motion"
import { ArrowLeft, Circle, MapPin, SearchX } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { PressButton } from "../components/press-button"
import { DESTINATIONS, ORIGINS, type LocationNode } from "../data/mock"
import { useApp } from "../state/app-context"

type Field = "origin" | "destination"

function nodeLabel(node: LocationNode) {
  return `${node.name}, ${node.area}`
}

function matchesQuery(node: LocationNode, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    node.name.toLowerCase().includes(q) ||
    node.area.toLowerCase().includes(q) ||
    nodeLabel(node).toLowerCase().includes(q)
  )
}

export function PassengerSearchScreen() {
  const { setFlow } = useApp()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [activeField, setActiveField] = useState<Field>("origin")
  const originRef = useRef<HTMLInputElement>(null)
  const destinationRef = useRef<HTMLInputElement>(null)

  const filteredOrigins = useMemo(() => {
    const exact = ORIGINS.some((n) => nodeLabel(n) === origin)
    return ORIGINS.filter((node) => matchesQuery(node, exact ? "" : origin))
  }, [origin])

  const filteredDestinations = useMemo(() => {
    const exact = DESTINATIONS.some((n) => nodeLabel(n) === destination)
    return DESTINATIONS.filter((node) => matchesQuery(node, exact ? "" : destination))
  }, [destination])

  const originSelected = ORIGINS.some((n) => nodeLabel(n) === origin)
  const destinationSelected = DESTINATIONS.some((n) => nodeLabel(n) === destination)
  const ready = originSelected && destinationSelected && origin !== destination

  const handlePickOrigin = (node: LocationNode) => {
    setOrigin(nodeLabel(node))
    setActiveField("destination")
    requestAnimationFrame(() => destinationRef.current?.focus())
  }

  const handlePickDestination = (node: LocationNode) => {
    setDestination(nodeLabel(node))
    setActiveField("destination")
  }

  const showOrigins = activeField === "origin" || !originSelected
  const showDestinations = activeField === "destination" || (originSelected && !destinationSelected)

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
        <h1 className="text-lg font-extrabold text-ink-900">Buscar viaje</h1>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-32">
        <div className="rounded-3xl border border-mist-100 bg-white p-4 shadow-xl shadow-blue-900/10">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1 py-2">
              <Circle size={11} className="fill-brand-600 text-brand-600" />
              <span className="h-8 w-px border-l-2 border-dotted border-ink-300" />
              <MapPin size={14} className="text-sun-600" />
            </div>
            <div className="flex-1 space-y-2">
              <label
                className={`flex min-h-[48px] items-center rounded-xl px-4 transition-colors ${
                  activeField === "origin" ? "bg-brand-50 ring-2 ring-brand-600/30" : "bg-mist-50"
                }`}
              >
                <input
                  ref={originRef}
                  value={origin}
                  onChange={(e) => {
                    setOrigin(e.target.value)
                    setActiveField("origin")
                  }}
                  onFocus={() => setActiveField("origin")}
                  placeholder="Buscar origen…"
                  autoComplete="off"
                  className="w-full bg-transparent text-[14px] font-bold text-ink-900 outline-none placeholder:font-semibold placeholder:text-ink-400"
                  aria-label="Origen"
                />
              </label>
              <label
                className={`flex min-h-[48px] items-center rounded-xl px-4 transition-colors ${
                  activeField === "destination" ? "bg-sun-500/15 ring-2 ring-sun-500/40" : "bg-mist-50"
                }`}
              >
                <input
                  ref={destinationRef}
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value)
                    setActiveField("destination")
                  }}
                  onFocus={() => setActiveField("destination")}
                  placeholder="Buscar destino…"
                  autoComplete="off"
                  className="w-full bg-transparent text-[14px] font-bold text-ink-900 outline-none placeholder:font-semibold placeholder:text-ink-400"
                  aria-label="Destino"
                />
              </label>
            </div>
          </div>
        </div>

        {showOrigins && (
          <section>
            <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
              {origin.trim() ? "Resultados de origen" : "Panamá Oeste · Origen"}
            </h2>
            {filteredOrigins.length === 0 ? (
              <EmptySearch query={origin} kind="origen" />
            ) : (
              <div className="space-y-2">
                {filteredOrigins.map((node) => {
                  const label = nodeLabel(node)
                  const selected = origin === label
                  return (
                    <motion.button
                      key={node.id}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePickOrigin(node)}
                      className={`flex min-h-[56px] w-full items-center gap-3 rounded-2xl border px-4 text-left transition-colors ${
                        selected ? "border-brand-600 bg-brand-50 shadow-card" : "border-mist-100 bg-white"
                      }`}
                    >
                      <Circle
                        size={12}
                        className={selected ? "fill-brand-600 text-brand-600" : "text-ink-300"}
                      />
                      <div>
                        <p className="text-[14px] font-bold text-ink-900">{node.name}</p>
                        <p className="text-[12px] font-semibold text-ink-400">{node.area}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {showDestinations && (
          <section>
            <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
              {destination.trim() ? "Resultados de destino" : "Ciudad de Panamá · Destino"}
            </h2>
            {filteredDestinations.length === 0 ? (
              <EmptySearch query={destination} kind="destino" />
            ) : (
              <div className="space-y-2">
                {filteredDestinations.map((node) => {
                  const label = nodeLabel(node)
                  const selected = destination === label
                  return (
                    <motion.button
                      key={node.id}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePickDestination(node)}
                      className={`flex min-h-[56px] w-full items-center gap-3 rounded-2xl border px-4 text-left transition-colors ${
                        selected ? "border-sun-500 bg-sun-500/10 shadow-card" : "border-mist-100 bg-white"
                      }`}
                    >
                      <MapPin size={15} className={selected ? "text-sun-600" : "text-ink-300"} />
                      <div>
                        <p className="text-[14px] font-bold text-ink-900">{node.name}</p>
                        <p className="text-[12px] font-semibold text-ink-400">{node.area}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </section>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-mist-50 via-mist-50/95 to-transparent px-5 pb-8 pt-6">
        <PressButton
          className="w-full"
          disabled={!ready}
          style={{ opacity: ready ? 1 : 0.4 }}
          onClick={() =>
            ready &&
            setFlow({
              name: "passenger-matching",
              origin,
              destination,
            })
          }
        >
          Buscar conductores
        </PressButton>
      </div>
    </div>
  )
}

function EmptySearch({ query, kind }: { query: string; kind: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-mist-200 bg-white px-4 py-8 text-center">
      <SearchX size={28} className="text-ink-300" strokeWidth={2} />
      <p className="mt-2 text-[14px] font-extrabold text-ink-800">Sin resultados</p>
      <p className="mt-0.5 text-[12px] font-semibold text-ink-400">
        No encontramos un {kind} para “{query.trim()}”
      </p>
    </div>
  )
}
