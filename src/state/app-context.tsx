import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import {
  DRIVER_VEHICLES,
  findOfferById,
  INITIAL_TRANSACTIONS,
  KYC_STEPS,
  MATCH_CANDIDATES,
  SEAT_PRICE,
  SERVICE_FEE,
  type DriverOffer,
  type KycStep,
  type MatchCandidate,
  type Transaction,
  type TripCompanion,
  type Vehicle,
} from "../data/mock"

export type UserMode = "passenger" | "driver"
export type Tab = "home" | "trips" | "wallet" | "profile"
export type PaymentMethod = "card" | "yappy" | "cash"

export type FlowScreen =
  | { name: "none" }
  | { name: "passenger-search" }
  | { name: "passenger-matching"; origin: string; destination: string }
  | { name: "passenger-checkout"; offerId: string; origin: string; destination: string }
  | { name: "driver-schedule" }
  | { name: "driver-one-time-trip" }
  | { name: "driver-matching" }
  | { name: "active-trip" }
  | { name: "trip-details"; tripId: string }

export interface TripPassenger {
  candidate: MatchCandidate
  boarded: boolean
}

/** Snapshot of a passenger booking: driver + companions retained after checkout. */
export interface BookedTrip {
  offerId: string
  offer: DriverOffer
  companions: TripCompanion[]
  origin: string
  destination: string
}

export interface OneTimeTrip {
  origin: string
  destination: string
  date: string
  time: string
  seats: number
}

interface AppState {
  mode: UserMode
  setMode: (mode: UserMode) => void
  tab: Tab
  setTab: (tab: Tab) => void
  flow: FlowScreen
  setFlow: (flow: FlowScreen) => void
  walletBalance: number
  transactions: Transaction[]
  acceptedPassengers: TripPassenger[]
  acceptCandidate: (candidate: MatchCandidate) => void
  rejectCandidate: (candidate: MatchCandidate) => void
  pendingCandidates: MatchCandidate[]
  confirmBoarding: (candidateId: string) => void
  bookedOfferId: string | null
  bookedTrip: BookedTrip | null
  bookSeat: (offerId: string, origin: string, destination: string) => void
  oneTimeTrip: OneTimeTrip | null
  publishOneTimeTrip: (trip: OneTimeTrip) => void
  paymentMethod: PaymentMethod
  setPaymentMethod: (method: PaymentMethod) => void
  hasSavedCard: boolean
  saveCard: () => void
  vehicles: Vehicle[]
  selectedVehicle: Vehicle
  selectVehicle: (plate: string) => void
  registerVehicle: (vehicle: Vehicle) => void
  kycSteps: KycStep[]
  /** Always true — pending KYC never blocks driver actions. */
  isDriverProfileEnabled: boolean
  approvePendingVerifications: () => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UserMode>("driver")
  const [tab, setTab] = useState<Tab>("home")
  const [flow, setFlow] = useState<FlowScreen>({ name: "none" })
  const [walletBalance, setWalletBalance] = useState(15.5)
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [pendingCandidates, setPendingCandidates] = useState<MatchCandidate[]>(MATCH_CANDIDATES)
  const [acceptedPassengers, setAcceptedPassengers] = useState<TripPassenger[]>([])
  const [bookedTrip, setBookedTrip] = useState<BookedTrip | null>(null)
  const [oneTimeTrip, setOneTimeTrip] = useState<OneTimeTrip | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [hasSavedCard, setHasSavedCard] = useState(true)
  const [vehicles, setVehicles] = useState<Vehicle[]>(DRIVER_VEHICLES)
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState(DRIVER_VEHICLES[0].plate)
  const [kycSteps, setKycSteps] = useState<KycStep[]>(KYC_STEPS)
  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.plate === selectedVehiclePlate) ?? vehicles[0]
  const isDriverProfileEnabled = true
  const bookedOfferId = bookedTrip?.offerId ?? null

  const value = useMemo<AppState>(
    () => ({
      mode,
      setMode,
      tab,
      setTab,
      flow,
      setFlow,
      walletBalance,
      transactions,
      acceptedPassengers,
      pendingCandidates,
      bookedOfferId,
      bookedTrip,
      oneTimeTrip,
      publishOneTimeTrip: setOneTimeTrip,
      paymentMethod,
      setPaymentMethod,
      hasSavedCard,
      saveCard: () => setHasSavedCard(true),
      vehicles,
      selectedVehicle,
      selectVehicle: setSelectedVehiclePlate,
      registerVehicle: (vehicle) => {
        setVehicles((previousVehicles) => {
          if (previousVehicles.some(({ plate }) => plate === vehicle.plate)) return previousVehicles
          return [...previousVehicles, vehicle]
        })
        setSelectedVehiclePlate(vehicle.plate)
      },
      kycSteps,
      isDriverProfileEnabled,
      approvePendingVerifications: () => {
        setKycSteps((previousSteps) =>
          previousSteps.map((step) =>
            step.status === "pending"
              ? {
                  ...step,
                  status: "verified",
                  subtitle:
                    step.id === "kyc-vehicle"
                      ? "2 vehículos · Pólizas aprobadas"
                      : step.subtitle,
                }
              : step,
          ),
        )
      },
      acceptCandidate: (candidate) => {
        setAcceptedPassengers((prev) =>
          prev.length >= 3 || prev.some((p) => p.candidate.id === candidate.id)
            ? prev
            : [...prev, { candidate, boarded: false }],
        )
        setPendingCandidates((prev) => prev.filter((c) => c.id !== candidate.id))
      },
      rejectCandidate: (candidate) => {
        setPendingCandidates((prev) => prev.filter((c) => c.id !== candidate.id))
      },
      confirmBoarding: (candidateId) => {
        setAcceptedPassengers((prev) =>
          prev.map((p) => (p.candidate.id === candidateId ? { ...p, boarded: true } : p)),
        )
        // Boarding releases the passenger's fare to the driver wallet (minus service fee).
        setWalletBalance((prev) => Math.round((prev + SEAT_PRICE - SERVICE_FEE) * 100) / 100)
        setTransactions((prev) => [
          {
            id: `tx-live-${candidateId}`,
            label: "Viaje a Costa del Este",
            detail: "Abordaje confirmado · Fondos liberados",
            amount: SEAT_PRICE,
            date: "Ahora",
            kind: "earning" as const,
          },
          {
            id: `tx-live-fee-${candidateId}`,
            label: "Tarifa de Plataforma",
            detail: "Service fee",
            amount: -SERVICE_FEE,
            date: "Ahora",
            kind: "fee" as const,
          },
          ...prev,
        ])
      },
      bookSeat: (offerId, origin, destination) => {
        const offer = findOfferById(offerId)
        if (!offer) return
        setBookedTrip({
          offerId,
          offer,
          companions: offer.companions,
          origin,
          destination,
        })
      },
    }),
    [
      mode,
      tab,
      flow,
      walletBalance,
      transactions,
      acceptedPassengers,
      pendingCandidates,
      bookedOfferId,
      bookedTrip,
      oneTimeTrip,
      paymentMethod,
      hasSavedCard,
      vehicles,
      selectedVehicle,
      kycSteps,
      isDriverProfileEnabled,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
