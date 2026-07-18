export interface LocationNode {
  id: string
  name: string
  area: string
  kind: "origin" | "destination"
  /** Position on the stylized map, percentage coordinates */
  x: number
  y: number
}

export interface Persona {
  id: string
  name: string
  age: number
  role: string
  rating: number
  tripsCompleted: number
  initials: string
  avatarHue: number
  photo: string
  verifications: string[]
}

export interface Vehicle {
  model: string
  year: number
  plate: string
  color: string
  capacity: number
  photo: string
}

export interface Transaction {
  id: string
  label: string
  detail: string
  amount: number
  date: string
  kind: "earning" | "fee" | "withdrawal" | "topup"
}

export interface MatchCandidate {
  id: string
  persona: Persona
  pickupNode: string
  dropoffNode: string
  detourMinutes: number
  onSameRoute: boolean
  walkMinutes: number
}

/** Public companion info shown in group previews (no private data). */
export interface TripCompanion {
  persona: Persona
  pickupLabel: string
  dropoffLabel: string
  affinities: string[]
}

export interface DriverOffer {
  id: string
  persona: Persona
  vehicle: Vehicle
  departureTime: string
  seatsLeft: number
  walkMinutes: number
  pickupNode: string
  dropoffLabel: string
  playlist: string
  pricePerSeat: number
  /** Confirmed co-riders already in the carpool. */
  companions: TripCompanion[]
  /** Public shared-route affinities for the whole offer. */
  routeAffinities: string[]
}

export type TripPaymentMethod = "card" | "yappy" | "cash"

export const SEAT_PRICE = 2.5
export const SERVICE_FEE = 0.25
export const TRIP_DURATION = "1h 15m"

export const ORIGINS: LocationNode[] = [
  { id: "costa-verde", name: "Costa Verde", area: "La Chorrera", kind: "origin", x: 14, y: 72 },
  { id: "brisas-golf", name: "Brisas del Golf", area: "Arraiján", kind: "origin", x: 26, y: 58 },
  { id: "market-plaza", name: "Market Plaza", area: "Panamá Oeste", kind: "origin", x: 20, y: 44 },
  { id: "vacamonte", name: "Vacamonte", area: "Arraiján", kind: "origin", x: 18, y: 64 },
  { id: "burunga", name: "Burunga", area: "Arraiján", kind: "origin", x: 30, y: 50 },
  { id: "vista-alegre", name: "Vista Alegre", area: "Arraiján", kind: "origin", x: 22, y: 54 },
  { id: "chorrera-centro", name: "Centro de La Chorrera", area: "La Chorrera", kind: "origin", x: 10, y: 68 },
]

export const DESTINATIONS: LocationNode[] = [
  { id: "business-park", name: "Business Park", area: "Costa del Este", kind: "destination", x: 82, y: 30 },
  { id: "ciudad-saber", name: "Ciudad del Saber", area: "Clayton", kind: "destination", x: 64, y: 20 },
  { id: "campus-utp", name: "Campus UTP", area: "Vía Tocumen", kind: "destination", x: 88, y: 52 },
  { id: "multiplaza", name: "Multiplaza", area: "Paitilla", kind: "destination", x: 74, y: 36 },
  { id: "albrook", name: "Albrook Mall", area: "Albrook", kind: "destination", x: 56, y: 42 },
  { id: "calle-50", name: "Calle 50", area: "Bella Vista", kind: "destination", x: 70, y: 28 },
  { id: "costa-del-este", name: "Costa del Este", area: "Panamá", kind: "destination", x: 86, y: 34 },
]

export const ALL_NODES = [...ORIGINS, ...DESTINATIONS]

export const DIEGO: Persona = {
  id: "diego",
  name: "Diego",
  age: 25,
  role: "Digital Sales Manager · Estudiante",
  rating: 4.9,
  tripsCompleted: 128,
  initials: "DG",
  avatarHue: 224,
  photo: "/avatars/avatar-diego.png",
  verifications: ["Cédula", "Correo corporativo"],
}

export const CAMILA: Persona = {
  id: "camila",
  name: "Camila M.",
  age: 22,
  role: "Estudiante universitaria",
  rating: 5.0,
  tripsCompleted: 42,
  initials: "CM",
  avatarHue: 330,
  photo: "/avatars/avatar-camila.png",
  verifications: ["Cédula", "Correo universitario"],
}

export const LUIS: Persona = {
  id: "luis",
  name: "Luis P.",
  age: 27,
  role: "Analista financiero",
  rating: 4.8,
  tripsCompleted: 61,
  initials: "LP",
  avatarHue: 150,
  photo: "/avatars/avatar-luis.png",
  verifications: ["Cédula", "Correo corporativo"],
}

export const MARIA: Persona = {
  id: "maria",
  name: "María F.",
  age: 24,
  role: "Diseñadora UX",
  rating: 4.7,
  tripsCompleted: 23,
  initials: "MF",
  avatarHue: 28,
  photo: "/avatars/avatar-maria.png",
  verifications: ["Cédula"],
}

export const YARIS: Vehicle = {
  model: "Toyota Yaris",
  year: 2023,
  plate: "AB-4821",
  color: "Blanco perla",
  capacity: 3,
  photo: "/cars/car-yaris.jpg",
}

export const DRIVER_VEHICLES: Vehicle[] = [
  YARIS,
  {
    model: "Hyundai Tucson",
    year: 2022,
    plate: "BC-9027",
    color: "Gris grafito",
    capacity: 3,
    photo: "/cars/car-tucson.jpg",
  },
]

const COMPANION_CAMILA: TripCompanion = {
  persona: CAMILA,
  pickupLabel: "Parada Costa Verde",
  dropoffLabel: "Business Park",
  affinities: ["Misma salida matutina", "Ruta Panamá Oeste → Este"],
}

const COMPANION_LUIS: TripCompanion = {
  persona: LUIS,
  pickupLabel: "Entrada Brisas del Golf",
  dropoffLabel: "Ciudad del Saber",
  affinities: ["Corredor Arraiján", "Horario 6–7 a.m."],
}

export const DRIVER_OFFERS: DriverOffer[] = [
  {
    id: "offer-diego",
    persona: DIEGO,
    vehicle: YARIS,
    departureTime: "6:15 a.m.",
    seatsLeft: 1,
    walkMinutes: 3,
    pickupNode: "Punto Market Plaza",
    dropoffLabel: "Business Park, Costa del Este",
    playlist: "Morning Drive · Lo-fi panameño",
    pricePerSeat: SEAT_PRICE,
    companions: [COMPANION_CAMILA, COMPANION_LUIS],
    routeAffinities: ["Misma salida matutina", "Corredor Oeste → Costa del Este"],
  },
  {
    id: "offer-luis",
    persona: LUIS,
    vehicle: {
      model: "Hyundai Tucson",
      year: 2022,
      plate: "CD-1190",
      color: "Gris grafito",
      capacity: 3,
      photo: "/cars/car-tucson.jpg",
    },
    departureTime: "6:30 a.m.",
    seatsLeft: 1,
    walkMinutes: 5,
    pickupNode: "Entrada Brisas del Golf",
    dropoffLabel: "Ciudad del Saber, Clayton",
    playlist: "Reggae en ruta",
    pricePerSeat: SEAT_PRICE,
    companions: [COMPANION_CAMILA],
    routeAffinities: ["Corredor Arraiján", "Destino Clayton"],
  },
  {
    id: "offer-maria",
    persona: MARIA,
    vehicle: {
      model: "Kia Rio",
      year: 2021,
      plate: "EF-7742",
      color: "Azul acero",
      capacity: 3,
      photo: "/cars/car-rio.jpg",
    },
    departureTime: "6:45 a.m.",
    seatsLeft: 2,
    walkMinutes: 7,
    pickupNode: "Parada Costa Verde",
    dropoffLabel: "Campus UTP, Vía Tocumen",
    playlist: "Pop en español",
    pricePerSeat: SEAT_PRICE,
    companions: [],
    routeAffinities: ["Salida Costa Verde", "Ruta hacia Tocumen"],
  },
]

export const MATCH_CANDIDATES: MatchCandidate[] = [
  {
    id: "match-camila",
    persona: CAMILA,
    pickupNode: "Costa Verde, La Chorrera",
    dropoffNode: "Business Park, Costa del Este",
    detourMinutes: 0,
    onSameRoute: true,
    walkMinutes: 3,
  },
  {
    id: "match-luis",
    persona: LUIS,
    pickupNode: "Brisas del Golf, Arraiján",
    dropoffNode: "Ciudad del Saber, Clayton",
    detourMinutes: 3,
    onSameRoute: false,
    walkMinutes: 4,
  },
  {
    id: "match-maria",
    persona: MARIA,
    pickupNode: "Market Plaza",
    dropoffNode: "Campus UTP, Vía Tocumen",
    detourMinutes: 5,
    onSameRoute: false,
    walkMinutes: 2,
  },
]

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    label: "Viaje a Costa del Este",
    detail: "Camila M. · Asiento reservado",
    amount: 2.5,
    date: "Hoy · 6:15 a.m.",
    kind: "earning",
  },
  {
    id: "tx-2",
    label: "Tarifa de Plataforma",
    detail: "Service fee · Viaje #128",
    amount: -0.25,
    date: "Hoy · 6:15 a.m.",
    kind: "fee",
  },
  {
    id: "tx-3",
    label: "Viaje a Ciudad del Saber",
    detail: "Luis P. · Asiento reservado",
    amount: 2.5,
    date: "Ayer · 6:30 a.m.",
    kind: "earning",
  },
  {
    id: "tx-4",
    label: "Tarifa de Plataforma",
    detail: "Service fee · Viaje #127",
    amount: -0.25,
    date: "Ayer · 6:30 a.m.",
    kind: "fee",
  },
  {
    id: "tx-5",
    label: "Retiro a Banco General",
    detail: "Cuenta ····4821",
    amount: -10.0,
    date: "Lun 13 jul",
    kind: "withdrawal",
  },
  {
    id: "tx-6",
    label: "Viaje a Costa del Este",
    detail: "María F. + 1 pasajero",
    amount: 5.0,
    date: "Lun 13 jul",
    kind: "earning",
  },
]

export interface PastTrip {
  id: string
  origin: string
  destination: string
  /** Intermediate stop labels shown as "via". */
  viaNodes: string[]
  date: string
  time: string
  role: "driver" | "passenger"
  amount: number
  passengers: number
  status: "completed" | "scheduled"
  driver: Persona
  companions: Persona[]
  paymentMethod: TripPaymentMethod
  pickupLabel: string
  dropoffLabel: string
  offerId?: string
}

export const PAST_TRIPS: PastTrip[] = [
  {
    id: "trip-sched",
    origin: "Costa Verde, La Chorrera",
    destination: "Business Park, Costa del Este",
    viaNodes: ["Market Plaza", "Brisas del Golf"],
    date: "Mañana",
    time: "6:15 a.m.",
    role: "driver",
    amount: 5.0,
    passengers: 2,
    status: "scheduled",
    driver: DIEGO,
    companions: [CAMILA, LUIS],
    paymentMethod: "card",
    pickupLabel: "Costa Verde",
    dropoffLabel: "Business Park",
    offerId: "offer-diego",
  },
  {
    id: "trip-sched-passenger",
    origin: "Costa Verde, La Chorrera",
    destination: "Business Park, Costa del Este",
    viaNodes: ["Market Plaza"],
    date: "Mañana",
    time: "6:15 a.m.",
    role: "passenger",
    amount: -2.5,
    passengers: 3,
    status: "scheduled",
    driver: DIEGO,
    companions: [CAMILA, LUIS],
    paymentMethod: "yappy",
    pickupLabel: "Punto Market Plaza",
    dropoffLabel: "Business Park",
    offerId: "offer-diego",
  },
  {
    id: "trip-1",
    origin: "Costa Verde, La Chorrera",
    destination: "Business Park, Costa del Este",
    viaNodes: ["Market Plaza"],
    date: "Hoy",
    time: "6:15 a.m.",
    role: "driver",
    amount: 4.5,
    passengers: 2,
    status: "completed",
    driver: DIEGO,
    companions: [CAMILA, LUIS],
    paymentMethod: "card",
    pickupLabel: "Costa Verde",
    dropoffLabel: "Business Park",
  },
  {
    id: "trip-2",
    origin: "Brisas del Golf, Arraiján",
    destination: "Ciudad del Saber, Clayton",
    viaNodes: ["Market Plaza"],
    date: "Ayer",
    time: "6:30 a.m.",
    role: "driver",
    amount: 2.25,
    passengers: 1,
    status: "completed",
    driver: DIEGO,
    companions: [LUIS],
    paymentMethod: "cash",
    pickupLabel: "Brisas del Golf",
    dropoffLabel: "Ciudad del Saber",
  },
  {
    id: "trip-3",
    origin: "Market Plaza",
    destination: "Campus UTP, Vía Tocumen",
    viaNodes: ["Costa Verde"],
    date: "Jue 16 jul",
    time: "7:00 a.m.",
    role: "passenger",
    amount: -2.5,
    passengers: 2,
    status: "completed",
    driver: MARIA,
    companions: [CAMILA],
    paymentMethod: "card",
    pickupLabel: "Market Plaza",
    dropoffLabel: "Campus UTP",
  },
  {
    id: "trip-4",
    origin: "Brisas del Golf, Arraiján",
    destination: "Ciudad del Saber, Clayton",
    viaNodes: [],
    date: "Mié 15 jul",
    time: "6:30 a.m.",
    role: "passenger",
    amount: -2.5,
    passengers: 2,
    status: "completed",
    driver: LUIS,
    companions: [CAMILA],
    paymentMethod: "yappy",
    pickupLabel: "Entrada Brisas del Golf",
    dropoffLabel: "Ciudad del Saber",
  },
]

export interface KycStep {
  id: string
  title: string
  subtitle: string
  status: "verified" | "pending"
}

export const KYC_STEPS: KycStep[] = [
  {
    id: "kyc-id",
    title: "Identidad (Cédula)",
    subtitle: "Documento validado con Registro Civil",
    status: "verified",
  },
  {
    id: "kyc-email",
    title: "Correo Corporativo / Universitario",
    subtitle: "diego@empresa.com.pa",
    status: "verified",
  },
  {
    id: "kyc-police-record",
    title: "Récord Policivo",
    subtitle: "Sin antecedentes · Validado en Panamá Digital",
    status: "verified",
  },
  {
    id: "kyc-vehicle",
    title: "Vehículos y Seguros",
    subtitle: "2 vehículos · Pólizas aprobadas",
    status: "verified",
  },
]

export const WEEKDAYS = [
  { key: "L", label: "Lunes" },
  { key: "K", label: "Martes" },
  { key: "M", label: "Miércoles" },
  { key: "J", label: "Jueves" },
  { key: "V", label: "Viernes" },
] as const

export function formatBalboa(value: number, withSign = false): string {
  const sign = withSign && value > 0 ? "+ " : value < 0 ? "- " : ""
  return `${sign}B/. ${Math.abs(value).toFixed(2)}`
}

/** First name without trailing initial (e.g. "Camila M." → "Camila"). */
export function firstName(persona: Persona): string {
  return persona.name.replace(/\s+[A-Z]\.?$/, "").split(" ")[0]
}

/** "Viajarás con Camila y Luis" style copy for companion lists. */
export function formatTravelWith(companions: Persona[]): string {
  if (companions.length === 0) return "Serás el primero en unirte"
  const names = companions.map(firstName)
  if (names.length === 1) return `Viajarás con ${names[0]}`
  if (names.length === 2) return `Viajarás con ${names[0]} y ${names[1]}`
  const head = names.slice(0, -1).join(", ")
  return `Viajarás con ${head} y ${names[names.length - 1]}`
}

export function paymentMethodLabel(method: TripPaymentMethod): string {
  switch (method) {
    case "card":
      return "Visa ···· 4242"
    case "yappy":
      return "Yappy"
    case "cash":
      return "Efectivo"
  }
}

export function findOfferById(offerId: string): DriverOffer | undefined {
  return DRIVER_OFFERS.find((offer) => offer.id === offerId)
}

export function findTripById(tripId: string): PastTrip | undefined {
  return PAST_TRIPS.find((trip) => trip.id === tripId)
}
