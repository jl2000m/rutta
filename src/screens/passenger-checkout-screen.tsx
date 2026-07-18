import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Clock3,
  Footprints,
  MapPin,
  Route,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react"
import { useState, type ReactNode } from "react"
import { CashEmoji, VisaLogo, YappyLogo } from "../components/payment-logos"
import {
  AvatarProfileButton,
  PublicProfileSheet,
} from "../components/public-profile-sheet"
import { MapCanvas } from "../components/map-canvas"
import { StatusBadge } from "../components/status-badge"
import { UserAvatar } from "../components/user-avatar"
import {
  DRIVER_OFFERS,
  TRIP_DURATION,
  formatBalboa,
  formatTravelWith,
  type Persona,
} from "../data/mock"
import { useApp, type PaymentMethod } from "../state/app-context"

interface Props {
  offerId: string
  origin: string
  destination: string
}

export function PassengerCheckoutScreen({ offerId, origin, destination }: Props) {
  const { setFlow, bookSeat, paymentMethod, setPaymentMethod } = useApp()
  const offer = DRIVER_OFFERS.find((o) => o.id === offerId) ?? DRIVER_OFFERS[0]
  const [booked, setBooked] = useState(false)
  const [profilePersona, setProfilePersona] = useState<Persona | null>(null)
  const [profileMeeting, setProfileMeeting] = useState<string | undefined>()
  const [profileAffinities, setProfileAffinities] = useState<string[]>([])
  const [profileVariant, setProfileVariant] = useState<"preview" | "full">("preview")

  const companions = offer.companions
  const peopleCount = companions.length + 1
  const seatsTaken = offer.vehicle.capacity - offer.seatsLeft + 1
  const routeStops = [
    {
      id: "route-origin",
      label: origin.split(",")[0],
      detail: "Salida",
      x: 15,
      y: 62,
      tone: "origin" as const,
      marker: "A",
    },
    ...companions.map((companion, index) => ({
      id: `companion-${companion.persona.id}`,
      label: companion.pickupLabel,
      detail: `Recoge a ${companion.persona.name}`,
      x: 31 + index * 17,
      y: 61 - index * 10,
      tone: "stop" as const,
      marker: String(index + 1),
    })),
    {
      id: "your-pickup",
      label: offer.pickupNode,
      detail: "Tu parada",
      x: 64,
      y: 43,
      tone: "pickup" as const,
      marker: "Tú",
      active: true,
    },
    {
      id: "route-destination",
      label: destination.split(",")[0],
      detail: "Destino",
      x: 83,
      y: 30,
      tone: "destination" as const,
      marker: "B",
    },
  ]

  const handleBook = () => {
    if (booked) return
    setBooked(true)
    bookSeat(offer.id, origin, destination)
    setTimeout(() => setFlow({ name: "none" }), 1800)
  }

  const openProfile = (
    persona: Persona,
    meeting?: string,
    affinities: string[] = [],
    variant: "preview" | "full" = booked ? "full" : "preview",
  ) => {
    setProfilePersona(persona)
    setProfileMeeting(meeting)
    setProfileAffinities(affinities)
    setProfileVariant(variant)
  }

  return (
    <div className="flex h-full flex-col bg-mist-50">
      <header className="flex items-center gap-3 px-5 pb-4 pt-14">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setFlow({ name: "passenger-matching", origin, destination })}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-card"
          aria-label="Volver"
        >
          <ArrowLeft size={20} className="text-ink-900" />
        </motion.button>
        <h1 className="text-lg font-extrabold text-ink-900">Confirmar reserva</h1>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-36">
        {/* Tu grupo de viaje — primary hierarchy */}
        <section className="rounded-3xl border border-brand-100 bg-white p-5 shadow-xl shadow-blue-900/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-brand-600">
                Tu grupo de viaje
              </p>
              <h2 className="mt-1 text-[22px] font-extrabold leading-tight text-ink-900">
                {peopleCount} {peopleCount === 1 ? "persona" : "personas"}
              </h2>
              <p className="mt-1 text-[13px] font-semibold text-ink-500">
                {formatTravelWith(companions.map((c) => c.persona))}
              </p>
            </div>
            <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <Users size={20} strokeWidth={2.5} />
              <span className="text-[11px] font-extrabold">
                {seatsTaken}/{offer.vehicle.capacity}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            <button
              type="button"
              onClick={() =>
                openProfile(offer.persona, offer.pickupNode, offer.routeAffinities)
              }
              className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl bg-mist-50 px-3 py-2.5 text-left"
            >
              <AvatarProfileButton
                persona={offer.persona}
                size={48}
                onOpen={() =>
                  openProfile(offer.persona, offer.pickupNode, offer.routeAffinities)
                }
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[15px] font-extrabold text-ink-900">{offer.persona.name}</p>
                  <BadgeCheck size={15} className="fill-brand-600 text-white" />
                </div>
                <p className="text-[12px] font-semibold text-ink-400">Conductor · {offer.persona.role}</p>
              </div>
              <StatusBadge tone="smart">Conductor</StatusBadge>
            </button>

            {companions.map((companion) => (
              <button
                key={companion.persona.id}
                type="button"
                onClick={() =>
                  openProfile(
                    companion.persona,
                    companion.pickupLabel,
                    companion.affinities,
                  )
                }
                className="flex min-h-[52px] w-full items-center gap-3 rounded-2xl border border-mist-100 px-3 py-2 text-left"
              >
                <AvatarProfileButton
                  persona={companion.persona}
                  size={42}
                  onOpen={() =>
                    openProfile(
                      companion.persona,
                      companion.pickupLabel,
                      companion.affinities,
                    )
                  }
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-extrabold text-ink-900">
                    {companion.persona.name}
                  </p>
                  <p className="truncate text-[11px] font-semibold text-ink-400">
                    Sube · {companion.pickupLabel}
                  </p>
                </div>
              </button>
            ))}

            {offer.seatsLeft > 0 && (
              <div className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-dashed border-mist-200 px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-[12px] font-extrabold text-emerald-700">
                  +{offer.seatsLeft}
                </div>
                <p className="text-[13px] font-bold text-ink-500">
                  {offer.seatsLeft === 1
                    ? "1 asiento libre — tú ocupas el último"
                    : `${offer.seatsLeft} asientos libres`}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-2 border-t border-ink-900/5 pt-4">
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-brand-600" />
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink-400">
                  Subida / bajada
                </p>
                <p className="text-[13px] font-bold text-ink-800">
                  {offer.pickupNode} → {offer.dropoffLabel}
                </p>
              </div>
            </div>
            {offer.routeAffinities.length > 0 && (
              <div className="flex items-start gap-2.5">
                <Route size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink-400">
                    Afinidades de ruta
                  </p>
                  <p className="text-[13px] font-semibold text-ink-700">
                    {offer.routeAffinities.join(" · ")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Route map and ordered pickup stops */}
        <section className="overflow-hidden rounded-3xl border border-mist-100 bg-white shadow-card">
          <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-5">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-brand-600">
                Ruta compartida
              </p>
              <h2 className="mt-1 text-[17px] font-extrabold text-ink-900">Ruta y paradas</h2>
              <p className="mt-0.5 text-[12px] font-semibold text-ink-400">
                {companions.length + 1}{" "}
                {companions.length + 1 === 1 ? "parada" : "paradas"} antes del destino
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <Route size={19} strokeWidth={2.5} />
            </span>
          </div>

          <MapCanvas
            showRoute
            className="relative z-0 h-[220px] overflow-hidden border-y border-mist-100"
            nodes={routeStops.map(({ id, x, y, active, label, marker, tone }) => ({
              id,
              x,
              y,
              active,
              label,
              marker,
              tone,
            }))}
          />

          <div className="space-y-2 px-5 py-4">
            {routeStops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${
                    stop.tone === "destination"
                      ? "bg-ink-900 text-white"
                      : stop.tone === "pickup"
                        ? "bg-sun-500 text-ink-900"
                        : stop.tone === "origin"
                          ? "bg-emerald-500 text-white"
                          : "bg-brand-600 text-white"
                  }`}
                >
                  {stop.marker}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-extrabold text-ink-900">{stop.label}</p>
                  <p className="text-[11px] font-semibold text-ink-400">{stop.detail}</p>
                </div>
                {index < routeStops.length - 1 && (
                  <span className="text-[10px] font-bold text-ink-300">
                    {index + 1}/{routeStops.length}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Driver / vehicle summary */}
        <div className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <div className="flex items-center gap-3.5">
            <UserAvatar persona={offer.persona} size={58} />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-[17px] font-extrabold text-ink-900">{offer.persona.name}</p>
                <BadgeCheck size={17} className="fill-brand-600 text-white" />
              </div>
              <p className="text-[12px] font-semibold text-ink-400">{offer.persona.role}</p>
              <div className="mt-1 flex items-center gap-1 text-[13px] font-bold text-ink-700">
                <Star size={13} className="fill-sun-500 text-sun-500" />
                {offer.persona.rating.toFixed(1)}
                <span className="font-semibold text-ink-400">
                  · {offer.persona.tripsCompleted} viajes
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <StatusBadge tone="trust">Identidad verificada</StatusBadge>
            <StatusBadge tone="verified">Correo corporativo</StatusBadge>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl bg-mist-50">
            <div className="relative h-36 w-full">
              <img
                src={offer.vehicle.photo}
                alt={`${offer.vehicle.model} ${offer.vehicle.year} ${offer.vehicle.color}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <p className="text-[14px] font-extrabold text-ink-900">
                {offer.vehicle.model} {offer.vehicle.year}
              </p>
              <p className="text-[12px] font-semibold text-ink-400">
                {offer.vehicle.color} · Placa {offer.vehicle.plate}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-[13px] font-bold text-ink-700">
            <span className="flex items-center gap-1.5">
              <Clock3 size={15} className="text-brand-600" /> Sale {offer.departureTime}
            </span>
            <span className="text-ink-400">{TRIP_DURATION} estimado</span>
          </div>
          <div className="mt-3 border-t border-ink-900/5 pt-3">
            <p className="truncate text-[13px] font-semibold text-ink-700">{origin}</p>
            <p className="mt-1 truncate text-[13px] font-semibold text-ink-700">→ {destination}</p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-sun-500/10 px-3 py-2.5 text-[12px] font-bold text-amber-800">
            <Footprints size={14} />
            Camina {offer.walkMinutes} min al punto: {offer.pickupNode}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl bg-[#121212] p-4 shadow-card">
          <img src="/logos/spotify.svg" alt="Spotify" className="h-10 w-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#1DB954]">
              Únete al jam del conductor
            </p>
            <p className="truncate text-[14px] font-bold text-white">{offer.playlist}</p>
          </div>
          <div className="flex items-end gap-0.5" aria-hidden>
            {[10, 16, 8, 14].map((h, i) => (
              <motion.span
                key={i}
                className="w-1 rounded-full bg-[#1DB954]"
                animate={{ height: [h, h * 1.6, h] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-extrabold text-ink-900">Método de pago</h2>
              <p className="text-[12px] font-semibold text-ink-400">Se cobra directamente al reservar</p>
            </div>
            <ShieldCheck size={19} className="text-emerald-600" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(
              [
                {
                  id: "card",
                  label: "Visa",
                  detail: "···· 4242",
                  logo: <VisaLogo height={13} />,
                  tile: "border border-mist-200 bg-white",
                },
                {
                  id: "yappy",
                  label: "Yappy",
                  detail: "Directo",
                  logo: <YappyLogo height={16} />,
                  tile: "border border-mist-200 bg-white",
                },
                {
                  id: "cash",
                  label: "Efectivo",
                  detail: "Al abordar",
                  logo: <CashEmoji size={17} />,
                  tile: "bg-emerald-50 border border-emerald-100",
                },
              ] satisfies {
                id: PaymentMethod
                label: string
                detail: string
                logo: ReactNode
                tile: string
              }[]
            ).map(({ id, label, detail, logo, tile }) => {
              const isSelected = paymentMethod === id
              return (
                <motion.button
                  key={id}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setPaymentMethod(id)}
                  className={`flex min-h-[80px] flex-col items-center justify-center rounded-2xl border text-center ${
                    isSelected
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-mist-200 bg-white text-ink-500"
                  }`}
                >
                  <span className={`flex h-7 w-11 items-center justify-center rounded-lg ${tile}`}>
                    {logo}
                  </span>
                  <span className="mt-1.5 text-[12px] font-extrabold">{label}</span>
                  <span className="text-[10px] font-semibold opacity-70">{detail}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
          <ShieldCheck size={18} className="shrink-0 text-emerald-600" />
          <p className="text-[12px] font-semibold text-emerald-800">
            {paymentMethod === "cash"
              ? "Paga en efectivo al conductor cuando abordes. Confirma el monto desde la app."
              : "El cobro se autoriza en tu método seleccionado y solo se libera al conductor cuando abordas."}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-mist-50 via-mist-50/95 to-transparent px-5 pb-8 pt-6">
        <motion.button
          type="button"
          onClick={handleBook}
          whileTap={{ scale: booked ? 1 : 0.95 }}
          animate={{ backgroundColor: booked ? "#10b981" : "#0047FF" }}
          transition={{ duration: 0.35 }}
          className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-extrabold text-white shadow-xl shadow-blue-900/10"
        >
          <AnimatePresence mode="wait" initial={false}>
            {booked ? (
              <motion.span
                key="done"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25"
                >
                  <Check size={17} strokeWidth={3.5} />
                </motion.span>
                ¡Asiento reservado!
              </motion.span>
            ) : (
              <motion.span key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Reservar Asiento — {formatBalboa(offer.pricePerSeat)}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <PublicProfileSheet
        persona={profilePersona}
        open={profilePersona !== null}
        onClose={() => setProfilePersona(null)}
        variant={profileVariant}
        meetingPoint={profileMeeting}
        affinities={profileAffinities}
      />
    </div>
  )
}
