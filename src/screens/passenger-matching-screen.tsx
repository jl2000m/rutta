import { motion } from "framer-motion"
import { ArrowLeft, Clock3, Footprints, Star, Users } from "lucide-react"
import { useState } from "react"
import { BottomSheet } from "../components/bottom-sheet"
import { CompatibilityBadge, CompatibilityReason } from "../components/ride-preferences-card"
import { MapCanvas } from "../components/map-canvas"
import {
  AvatarProfileButton,
  PublicProfileSheet,
} from "../components/public-profile-sheet"
import { UserAvatar } from "../components/user-avatar"
import {
  ALL_NODES,
  DRIVER_OFFERS,
  firstName,
  formatBalboa,
  formatTravelWith,
  type Persona,
} from "../data/mock"
import { computeCompatibility } from "../lib/ride-preferences"
import { useApp } from "../state/app-context"

interface Props {
  origin: string
  destination: string
}

export function PassengerMatchingScreen({ origin, destination }: Props) {
  const { setFlow, ridePreferences } = useApp()
  const [profilePersona, setProfilePersona] = useState<Persona | null>(null)
  const [profileAffinities, setProfileAffinities] = useState<string[]>([])

  const originKey = origin.split(",")[0]?.trim().toLowerCase() ?? ""
  const destinationKey = destination.split(",")[0]?.trim().toLowerCase() ?? ""

  const offers = DRIVER_OFFERS.filter((offer) => {
    const pickup = offer.pickupNode.toLowerCase()
    const drop = offer.dropoffLabel.toLowerCase()
    const matchesOrigin = !originKey || pickup.includes(originKey) || originKey.includes(pickup.split(",")[0] ?? "")
    const matchesDestination =
      !destinationKey || drop.includes(destinationKey) || destinationKey.includes(drop.split(",")[0] ?? "")
    // Soft match: keep offers that share either end of the corridor (demo coverage).
    return matchesOrigin || matchesDestination
  })
    .map((offer) => ({ offer, compatibility: computeCompatibility(ridePreferences, offer.persona.preferences) }))
    // Smart matching: most compatible drivers first.
    .sort((a, b) => b.compatibility.score - a.compatibility.score)

  return (
    <div className="relative h-full bg-mist-50">
      <MapCanvas
        showRoute
        className="h-full"
        nodes={ALL_NODES.map((n, i) => ({ id: n.id, x: n.x, y: n.y, active: i === 0 }))}
      />

      <div className="absolute inset-x-0 top-0 z-20 px-5 pt-14">
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setFlow({ name: "passenger-search" })}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-float"
            aria-label="Volver"
          >
            <ArrowLeft size={20} className="text-ink-900" />
          </motion.button>
          <div className="min-w-0 flex-1 rounded-2xl bg-white px-4 py-2.5 shadow-float">
            <p className="truncate text-[12px] font-bold text-ink-900">{origin}</p>
            <p className="truncate text-[12px] font-semibold text-ink-400">→ {destination}</p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-2 text-[12px] font-bold text-white shadow-float"
        >
          <Footprints size={14} className="text-sun-400" />
          Camina 3 min al punto de encuentro
        </motion.div>
      </div>

      <BottomSheet open onClose={() => setFlow({ name: "passenger-search" })} backdrop={false}>
        <div className="max-h-[52vh] overflow-y-auto px-5 pb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[17px] font-extrabold text-ink-900">Conductores disponibles</h2>
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-extrabold text-brand-700">
              {offers.length} en tu ruta
            </span>
          </div>

          <div className="space-y-3">
            {offers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-mist-200 bg-white px-4 py-10 text-center">
                <p className="text-[15px] font-extrabold text-ink-900">Sin conductores en esta ruta</p>
                <p className="mt-1 text-[12px] font-semibold text-ink-400">
                  Prueba otra combinación de origen y destino
                </p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFlow({ name: "passenger-search" })}
                  className="mt-4 min-h-[44px] rounded-xl bg-brand-600 px-4 text-[13px] font-extrabold text-white"
                >
                  Editar búsqueda
                </motion.button>
              </div>
            ) : (
              offers.map(({ offer, compatibility }, i) => {
              const companionPersonas = offer.companions.map((c) => c.persona)
              const peopleInCar = companionPersonas.length + 1
              return (
                <motion.button
                  key={offer.id}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    setFlow({
                      name: "passenger-checkout",
                      offerId: offer.id,
                      origin,
                      destination,
                    })
                  }
                  className="w-full rounded-3xl border border-mist-100 bg-white p-4 text-left shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={offer.vehicle.photo}
                        alt={`${offer.vehicle.model} ${offer.vehicle.year}`}
                        className="h-12 w-16 rounded-xl border border-mist-100 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute -bottom-1.5 -right-1.5 rounded-full border-2 border-white">
                        <AvatarProfileButton
                          persona={offer.persona}
                          size={26}
                          onOpen={() => {
                            setProfileAffinities([...compatibility.highlights, ...offer.routeAffinities])
                            setProfilePersona(offer.persona)
                          }}
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="flex items-center gap-2 text-[15px] font-extrabold text-ink-900">
                          {offer.persona.name}
                          <CompatibilityBadge compatibility={compatibility} />
                        </p>
                        <p className="text-[15px] font-extrabold text-brand-600">
                          {formatBalboa(offer.pricePerSeat)}
                        </p>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[12px] font-semibold text-ink-400">
                        <span className="flex items-center gap-0.5">
                          <Star size={12} className="fill-sun-500 text-sun-500" />
                          {offer.persona.rating.toFixed(1)}
                        </span>
                        <span>·</span>
                        <span className="truncate">
                          {offer.vehicle.model} {offer.vehicle.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  <CompatibilityReason compatibility={compatibility} />

                  {/* Group preview */}
                  <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-mist-50/90 px-3 py-2.5">
                    <div className="flex -space-x-2">
                      <UserAvatar persona={offer.persona} size={28} />
                      {companionPersonas.slice(0, 3).map((persona) => (
                        <UserAvatar key={persona.id} persona={persona} size={28} />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-extrabold text-ink-800">
                        {formatTravelWith(companionPersonas)}
                      </p>
                      <p className="text-[11px] font-semibold text-ink-400">
                        {peopleInCar}{" "}
                        {peopleInCar === 1 ? "persona" : "personas"} en el grupo
                        {companionPersonas.length > 0
                          ? ` · ${companionPersonas.map(firstName).join(", ")}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink-900/5 pt-3 text-[12px] font-bold">
                    <span className="flex items-center gap-1 rounded-full bg-mist-50 px-2.5 py-1 text-ink-700">
                      <Clock3 size={12} /> Sale {offer.departureTime}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-mist-50 px-2.5 py-1 text-ink-700">
                      <Footprints size={12} /> {offer.walkMinutes} min a pie
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                      <Users size={12} /> {offer.seatsLeft}{" "}
                      {offer.seatsLeft === 1 ? "asiento libre" : "asientos libres"}
                    </span>
                  </div>
                </motion.button>
              )
            })
            )}
          </div>
        </div>
      </BottomSheet>

      <PublicProfileSheet
        persona={profilePersona}
        open={profilePersona !== null}
        onClose={() => setProfilePersona(null)}
        variant="preview"
        affinities={profileAffinities}
        roleLabel="Conductor"
      />
    </div>
  )
}
