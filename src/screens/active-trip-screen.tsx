import { motion } from "framer-motion"
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Footprints,
  LifeBuoy,
  Navigation,
  PhoneCall,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react"
import { useState } from "react"
import { BottomSheet } from "../components/bottom-sheet"
import { MapCanvas } from "../components/map-canvas"
import {
  AvatarProfileButton,
  PublicProfileSheet,
} from "../components/public-profile-sheet"
import { StatusBadge } from "../components/status-badge"
import { UserAvatar } from "../components/user-avatar"
import {
  CAMILA,
  DRIVER_OFFERS,
  TRIP_DURATION,
  formatBalboa,
  formatTravelWith,
  SEAT_PRICE,
  type Persona,
} from "../data/mock"
import { useApp } from "../state/app-context"

export function ActiveTripScreen() {
  const { mode, setFlow, acceptedPassengers, confirmBoarding, bookedTrip } = useApp()
  const [sosOpen, setSosOpen] = useState(false)
  const [isWazeConnected, setIsWazeConnected] = useState(false)
  const [profilePersona, setProfilePersona] = useState<Persona | null>(null)
  const [profileMeeting, setProfileMeeting] = useState<string | undefined>()
  const [profileAffinities, setProfileAffinities] = useState<string[]>([])
  const wazeUrl =
    "https://www.waze.com/ul?q=Business%20Park%2C%20Costa%20del%20Este&navigate=yes&utm_source=rutta"

  const passengers =
    acceptedPassengers.length > 0
      ? acceptedPassengers
      : [
          {
            candidate: {
              id: "match-camila",
              persona: CAMILA,
              pickupNode: "Costa Verde, La Chorrera",
              dropoffNode: "Business Park, Costa del Este",
              detourMinutes: 0,
              onSameRoute: true,
              walkMinutes: 3,
            },
            boarded: false,
          },
        ]
  const isDemoFallback = acceptedPassengers.length === 0
  const [demoBoarded, setDemoBoarded] = useState(false)

  const passengerOffer = bookedTrip?.offer ?? DRIVER_OFFERS[0]
  const passengerCompanions = bookedTrip?.companions ?? passengerOffer.companions

  const openProfile = (persona: Persona, meeting?: string, affinities: string[] = []) => {
    setProfilePersona(persona)
    setProfileMeeting(meeting)
    setProfileAffinities(affinities)
  }

  return (
    <div className="relative h-full bg-mist-50">
      <MapCanvas showRoute liveCar className="h-full" />

      <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-3 px-5 pt-14">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setFlow({ name: "none" })}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-float"
          aria-label="Volver"
        >
          <ArrowLeft size={20} className="text-ink-900" />
        </motion.button>
        <div className="flex-1 rounded-2xl bg-ink-900 px-4 py-3 text-white shadow-float">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[13px] font-extrabold">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-emerald-400"
              />
              Viaje en curso
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-sun-400">
              <Navigation size={13} /> {TRIP_DURATION} restante
            </span>
          </div>
        </div>
      </div>

      {/* Prominent SOS button floating over the map */}
      <div className="absolute right-5 top-32 z-20">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setSosOpen(true)}
          className="relative flex h-16 w-16 flex-col items-center justify-center rounded-full bg-red-500 text-white shadow-xl shadow-red-500/40"
          aria-label="Emergencia y soporte"
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-red-500"
            animate={{ scale: [1, 1.35], opacity: [0.45, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          <ShieldAlert size={22} strokeWidth={2.5} className="relative" />
          <span className="relative text-[11px] font-extrabold tracking-wide">SOS</span>
        </motion.button>
      </div>

      <BottomSheet open backdrop={false} collapsible dismissible={false} collapsedPeek={118}>
        <div className="max-h-[48vh] overflow-y-auto px-5 pb-8">
          {mode === "driver" ? (
            <>
              <div className="mb-4 rounded-3xl border border-[#33CCFF]/30 bg-[#EAF9FF] p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#33CCFF] shadow-card">
                    <img src="/logos/waze.svg" alt="Waze" className="h-7 w-7" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-extrabold text-ink-900">
                      {isWazeConnected ? "Waze conectado" : "Navega con Waze"}
                    </p>
                    <p className="truncate text-[11px] font-semibold text-ink-500">
                      Mejor ruta a Business Park, Costa del Este
                    </p>
                  </div>
                </div>
                <motion.a
                  href={wazeUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsWazeConnected(true)}
                  className={`mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl text-[14px] font-extrabold shadow-card ${
                    isWazeConnected
                      ? "bg-emerald-500 text-white"
                      : "bg-[#05C8F9] text-ink-900"
                  }`}
                >
                  {isWazeConnected ? <Check size={17} strokeWidth={3} /> : <Navigation size={17} />}
                  {isWazeConnected ? "Ruta abierta en Waze" : "Abrir ruta en Waze"}
                  {!isWazeConnected && <ExternalLink size={14} />}
                </motion.a>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[17px] font-extrabold text-ink-900">Pasajeros del viaje</h2>
                <span className="text-[12px] font-bold text-ink-400">
                  {passengers.length} de 3 asientos
                </span>
              </div>

              <div className="space-y-3">
                {passengers.map(({ candidate, boarded }) => {
                  const isBoarded = isDemoFallback ? demoBoarded : boarded
                  return (
                    <div
                      key={candidate.id}
                      className={`rounded-3xl border p-4 transition-colors ${
                        isBoarded
                          ? "border-emerald-200 bg-emerald-50/70"
                          : "border-mist-100 bg-white shadow-card"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <AvatarProfileButton
                          persona={candidate.persona}
                          size={46}
                          onOpen={() =>
                            openProfile(candidate.persona, candidate.pickupNode, [
                              candidate.onSameRoute ? "Misma ruta exacta" : "Ruta cercana",
                            ])
                          }
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-extrabold text-ink-900">
                            {candidate.persona.name}
                          </p>
                          <p className="truncate text-[12px] font-semibold text-ink-400">
                            Punto: {candidate.pickupNode}
                          </p>
                        </div>
                        {isBoarded ? (
                          <StatusBadge tone="verified">A bordo</StatusBadge>
                        ) : (
                          <StatusBadge tone="pending">Esperando</StatusBadge>
                        )}
                      </div>

                      {!isBoarded ? (
                        <div>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            onClick={() =>
                              isDemoFallback
                                ? setDemoBoarded(true)
                                : confirmBoarding(candidate.id)
                            }
                            className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-[14px] font-extrabold text-white shadow-xl shadow-blue-900/10"
                          >
                            <Check size={17} strokeWidth={3} /> Confirmar Abordaje
                          </motion.button>
                          <p className="mt-2 text-center text-[11px] font-semibold text-ink-400">
                            Al confirmar se liberan {formatBalboa(SEAT_PRICE)} a tu billetera
                          </p>
                        </div>
                      ) : (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-100/70 py-2.5 text-[12px] font-extrabold text-emerald-700"
                        >
                          <Check size={14} strokeWidth={3} />{" "}
                          {formatBalboa(SEAT_PRICE)} liberados a tu billetera
                        </motion.p>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <>
              {/* Passenger view: driver + co-riders + own pickup */}
              <div className="mb-4 rounded-3xl border border-mist-100 bg-white p-4 shadow-card">
                <p className="mb-3 text-[12px] font-extrabold uppercase tracking-wide text-ink-400">
                  Tu conductor
                </p>
                <button
                  type="button"
                  onClick={() =>
                    openProfile(
                      passengerOffer.persona,
                      passengerOffer.pickupNode,
                      passengerOffer.routeAffinities,
                    )
                  }
                  className="flex min-h-[56px] w-full items-center gap-3 text-left"
                >
                  <UserAvatar persona={passengerOffer.persona} size={52} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-extrabold text-ink-900">
                      {passengerOffer.persona.name}
                    </p>
                    <p className="truncate text-[12px] font-semibold text-ink-400">
                      {passengerOffer.vehicle.model} · {passengerOffer.vehicle.color}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1 text-[12px] font-bold text-ink-700">
                      <Star size={12} className="fill-sun-500 text-sun-500" />
                      {passengerOffer.persona.rating.toFixed(1)}
                    </div>
                  </div>
                </button>
              </div>

              <div className="mb-4 flex items-center gap-2 rounded-2xl bg-sun-500/15 px-3.5 py-3 text-[13px] font-bold text-amber-900">
                <Footprints size={16} className="shrink-0" />
                Tu subida: {passengerOffer.pickupNode} · {passengerOffer.walkMinutes} min a pie
              </div>

              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[17px] font-extrabold text-ink-900">Tu grupo</h2>
                <span className="flex items-center gap-1 text-[12px] font-bold text-ink-400">
                  <Users size={13} /> {passengerCompanions.length + 1} personas
                </span>
              </div>
              <p className="mb-3 text-[12px] font-semibold text-ink-500">
                {formatTravelWith(passengerCompanions.map((c) => c.persona))}
              </p>

              <div className="space-y-2">
                {passengerCompanions.map((companion) => (
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
                    className="flex min-h-[56px] w-full items-center gap-3 rounded-3xl border border-mist-100 bg-white p-3.5 text-left shadow-card"
                  >
                    <AvatarProfileButton
                      persona={companion.persona}
                      size={44}
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
                      <p className="truncate text-[12px] font-semibold text-ink-400">
                        Sube en {companion.pickupLabel}
                      </p>
                    </div>
                    <StatusBadge tone="smart">Compañero</StatusBadge>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </BottomSheet>

      <BottomSheet open={sosOpen} onClose={() => setSosOpen(false)}>
        <div className="px-5 pb-10">
          <h2 className="text-[17px] font-extrabold text-ink-900">Emergencia y soporte</h2>
          <p className="mt-1 text-[13px] font-semibold text-ink-400">
            Tu ubicación en vivo se comparte con el equipo de seguridad de Rutta.
          </p>
          <div className="mt-4 space-y-2.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-red-500 text-[15px] font-extrabold text-white shadow-xl shadow-red-500/25"
            >
              <PhoneCall size={18} strokeWidth={2.5} /> Llamar al 911
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setSosOpen(false)}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-ink-900/5 text-[15px] font-bold text-ink-700"
            >
              <LifeBuoy size={18} strokeWidth={2.5} /> Chatear con soporte Rutta
            </motion.button>
          </div>
        </div>
      </BottomSheet>

      <PublicProfileSheet
        persona={profilePersona}
        open={profilePersona !== null}
        onClose={() => setProfilePersona(null)}
        variant="full"
        meetingPoint={profileMeeting}
        affinities={profileAffinities}
      />
    </div>
  )
}
