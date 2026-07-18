import { motion } from "framer-motion"
import {
  ArrowDown,
  ArrowLeft,
  CreditCard,
  Navigation,
  Star,
  Users,
} from "lucide-react"
import { useState } from "react"
import { CashEmoji, VisaLogo, YappyLogo } from "../components/payment-logos"
import {
  AvatarProfileButton,
  PublicProfileSheet,
} from "../components/public-profile-sheet"
import { PressButton } from "../components/press-button"
import { StatusBadge } from "../components/status-badge"
import {
  findTripById,
  formatBalboa,
  paymentMethodLabel,
  type Persona,
  type TripPaymentMethod,
} from "../data/mock"
import { useApp } from "../state/app-context"

interface Props {
  tripId: string
}

function PaymentIcon({ method }: { method: TripPaymentMethod }) {
  if (method === "yappy") return <YappyLogo height={14} />
  if (method === "cash") return <CashEmoji size={16} />
  return <VisaLogo height={12} />
}

export function TripDetailsScreen({ tripId }: Props) {
  const { setFlow, mode } = useApp()
  const trip = findTripById(tripId)
  const [profilePersona, setProfilePersona] = useState<Persona | null>(null)
  const [profileMeeting, setProfileMeeting] = useState<string | undefined>()

  if (!trip) {
    return (
      <div className="flex h-full flex-col bg-mist-50 px-5 pt-14">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setFlow({ name: "none" })}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-card"
          aria-label="Volver"
        >
          <ArrowLeft size={20} className="text-ink-900" />
        </motion.button>
        <p className="mt-8 text-center text-[15px] font-bold text-ink-500">Viaje no encontrado</p>
      </div>
    )
  }

  const isScheduled = trip.status === "scheduled"
  const coRiders = trip.companions

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
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-extrabold text-ink-900">Detalle del viaje</h1>
          <p className="text-[12px] font-semibold text-ink-400">
            {trip.date} · {trip.time}
          </p>
        </div>
        {isScheduled ? (
          <StatusBadge tone="smart">Programado</StatusBadge>
        ) : (
          <StatusBadge tone="verified">Completado</StatusBadge>
        )}
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-28">
        {/* Route */}
        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex flex-col items-center gap-0.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />
              <ArrowDown size={12} className="text-ink-300" />
              {trip.viaNodes.map((node) => (
                <div key={node} className="flex flex-col items-center gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
                  <ArrowDown size={12} className="text-ink-300" />
                </div>
              ))}
              <span className="h-2.5 w-2.5 rounded-full bg-sun-500" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-[14px] font-bold text-ink-900">{trip.origin}</p>
              {trip.viaNodes.map((node) => (
                <p key={node} className="text-[12px] font-semibold text-ink-400">
                  vía {node}
                </p>
              ))}
              <p className="text-[14px] font-bold text-ink-900">{trip.destination}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-ink-900/5 pt-3">
            <span className="text-[13px] font-semibold text-ink-500">
              {trip.date} · {trip.time}
            </span>
            <span
              className={`text-[16px] font-extrabold ${
                trip.amount >= 0 ? "text-emerald-600" : "text-ink-900"
              }`}
            >
              {formatBalboa(trip.amount, true)}
            </span>
          </div>
        </section>

        {/* Driver */}
        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <p className="mb-3 text-[12px] font-extrabold uppercase tracking-wide text-ink-400">
            Conductor
          </p>
          <button
            type="button"
            onClick={() => {
              setProfileMeeting(trip.pickupLabel)
              setProfilePersona(trip.driver)
            }}
            className="flex min-h-[56px] w-full items-center gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <AvatarProfileButton
              persona={trip.driver}
              size={52}
              onOpen={() => {
                setProfileMeeting(trip.pickupLabel)
                setProfilePersona(trip.driver)
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-extrabold text-ink-900">{trip.driver.name}</p>
              <p className="truncate text-[12px] font-semibold text-ink-400">{trip.driver.role}</p>
              <div className="mt-0.5 flex items-center gap-1 text-[12px] font-bold text-ink-700">
                <Star size={12} className="fill-sun-500 text-sun-500" />
                {trip.driver.rating.toFixed(1)}
              </div>
            </div>
          </button>
        </section>

        {/* Co-riders */}
        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink-400">
              Compañeros
            </p>
            <span className="flex items-center gap-1 text-[12px] font-bold text-ink-500">
              <Users size={13} /> {coRiders.length}
            </span>
          </div>
          {coRiders.length === 0 ? (
            <p className="text-[13px] font-semibold text-ink-400">Sin otros pasajeros en este viaje</p>
          ) : (
            <ul className="space-y-2">
              {coRiders.map((persona) => (
                <li key={persona.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMeeting(trip.pickupLabel)
                      setProfilePersona(persona)
                    }}
                    className="flex min-h-[52px] w-full items-center gap-3 rounded-2xl px-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    <AvatarProfileButton
                      persona={persona}
                      size={44}
                      onOpen={() => {
                        setProfileMeeting(trip.pickupLabel)
                        setProfilePersona(persona)
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-extrabold text-ink-900">{persona.name}</p>
                      <p className="truncate text-[12px] font-semibold text-ink-400">
                        {persona.role}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Payment + status */}
        <section className="rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist-50">
              {trip.paymentMethod === "cash" ? (
                <PaymentIcon method={trip.paymentMethod} />
              ) : (
                <span className="flex h-7 w-10 items-center justify-center rounded-lg border border-mist-200 bg-white">
                  <PaymentIcon method={trip.paymentMethod} />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink-400">
                Método de pago
              </p>
              <p className="text-[14px] font-bold text-ink-900">
                {paymentMethodLabel(trip.paymentMethod)}
              </p>
            </div>
            <CreditCard size={18} className="text-ink-300" />
          </div>
        </section>
      </div>

      {isScheduled && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-mist-50 via-mist-50/95 to-transparent px-5 pb-8 pt-6">
          <PressButton
            className="w-full"
            onClick={() => setFlow({ name: "active-trip" })}
          >
            <Navigation size={17} strokeWidth={2.5} />
            {mode === "driver" ? "Ir al viaje en curso" : "Ver viaje en curso"}
          </PressButton>
        </div>
      )}

      <PublicProfileSheet
        persona={profilePersona}
        open={profilePersona !== null}
        onClose={() => setProfilePersona(null)}
        variant="full"
        meetingPoint={profileMeeting}
        affinities={["Compartieron esta ruta", "Misma franja horaria"]}
        roleLabel={profilePersona?.id === trip.driver.id ? "Conductor" : "Pasajero"}
      />
    </div>
  )
}
