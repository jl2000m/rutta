export type ConversationStyle = "quiet" | "some" | "chatty"
export type MusicVolume = "off" | "low" | "loud"
export type Temperature = "cool" | "medium" | "warm"
export type SeatPreference = "front" | "back" | "any"
export type MusicControl = "driver" | "shared"

export interface RidePreferences {
  conversation: ConversationStyle
  musicVolume: MusicVolume
  musicGenres: string[]
  topics: string[]
  temperature: Temperature
  /** Passenger-only: where they'd like to sit. */
  seat: SeatPreference
  /** Driver-only: whether riders can pick the music. */
  musicControl: MusicControl
  petsOk: boolean
  foodOk: boolean
}

export const CONVERSATION_OPTIONS: { value: ConversationStyle; label: string; emoji: string; hint: string }[] = [
  { value: "quiet", label: "Silencioso", emoji: "🤫", hint: "Prefiero ir tranquilo" },
  { value: "some", label: "Depende", emoji: "🙂", hint: "Un poco de charla" },
  { value: "chatty", label: "Conversador", emoji: "💬", hint: "¡Me encanta hablar!" },
]

export const MUSIC_VOLUME_OPTIONS: { value: MusicVolume; label: string; emoji: string }[] = [
  { value: "off", label: "Sin música", emoji: "🔇" },
  { value: "low", label: "De fondo", emoji: "🔉" },
  { value: "loud", label: "A todo volumen", emoji: "🔊" },
]

export const TEMPERATURE_OPTIONS: { value: Temperature; label: string; emoji: string }[] = [
  { value: "cool", label: "A/C fuerte", emoji: "❄️" },
  { value: "medium", label: "Templado", emoji: "🌤️" },
  { value: "warm", label: "Poco A/C", emoji: "☀️" },
]

export const SEAT_OPTIONS: { value: SeatPreference; label: string }[] = [
  { value: "front", label: "Adelante" },
  { value: "back", label: "Atrás" },
  { value: "any", label: "Me da igual" },
]

export const MUSIC_CONTROL_OPTIONS: { value: MusicControl; label: string; hint: string }[] = [
  { value: "driver", label: "Yo pongo la música", hint: "Tu playlist de Spotify" },
  { value: "shared", label: "Playlist compartida", hint: "Pasajeros pueden sugerir" },
]

export const MUSIC_GENRES = [
  "Reggaetón",
  "Salsa",
  "Típico",
  "Pop en español",
  "Reggae",
  "Rock",
  "Lo-fi",
  "Electrónica",
  "Jazz",
  "Podcasts",
  "Noticias",
] as const

export const TOPICS = [
  { label: "Tecnología", emoji: "💻" },
  { label: "Deportes", emoji: "⚽" },
  { label: "Emprendimiento", emoji: "🚀" },
  { label: "Finanzas", emoji: "📈" },
  { label: "Series y cine", emoji: "🎬" },
  { label: "Música", emoji: "🎧" },
  { label: "Viajes", emoji: "✈️" },
  { label: "Comida", emoji: "🍔" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Fitness", emoji: "💪" },
  { label: "Universidad", emoji: "🎓" },
  { label: "Diseño", emoji: "🎨" },
] as const

export const DEFAULT_PREFERENCES: RidePreferences = {
  conversation: "some",
  musicVolume: "low",
  musicGenres: ["Lo-fi", "Pop en español"],
  topics: ["Tecnología", "Emprendimiento"],
  temperature: "cool",
  seat: "any",
  musicControl: "shared",
  petsOk: false,
  foodOk: true,
}

export function topicEmoji(label: string): string {
  return TOPICS.find((t) => t.label === label)?.emoji ?? "✨"
}

export function conversationLabel(style: ConversationStyle): string {
  return CONVERSATION_OPTIONS.find((o) => o.value === style)?.label ?? style
}

const CONVERSATION_RANK: Record<ConversationStyle, number> = { quiet: 0, some: 1, chatty: 2 }
const VOLUME_RANK: Record<MusicVolume, number> = { off: 0, low: 1, loud: 2 }
const TEMPERATURE_RANK: Record<Temperature, number> = { cool: 0, medium: 1, warm: 2 }

/** 1 when equal, 0.5 when one step apart, 0 when opposite ends of a 3-step scale. */
function scaleSimilarity(a: number, b: number): number {
  return 1 - Math.abs(a - b) / 2
}

/** Overlap of two lists relative to the smaller one (so a short list isn't penalized). */
function overlap(a: string[], b: string[]): { ratio: number; shared: string[] } {
  const shared = a.filter((item) => b.includes(item))
  const base = Math.min(a.length, b.length)
  return { ratio: base === 0 ? 0.5 : shared.length / base, shared }
}

export interface Compatibility {
  /** 0–100 */
  score: number
  /** Short human-readable reasons, best first. */
  highlights: string[]
  sharedTopics: string[]
  sharedGenres: string[]
}

/**
 * Smart-matching affinity between the current user and another person.
 * Weights: conversation 30, topics 25, music genres 20, volume 10, temperature 10, extras 5.
 */
export function computeCompatibility(me: RidePreferences, other: RidePreferences): Compatibility {
  const conversation = scaleSimilarity(CONVERSATION_RANK[me.conversation], CONVERSATION_RANK[other.conversation])
  const topics = overlap(me.topics, other.topics)
  const genres = overlap(me.musicGenres, other.musicGenres)
  const volume = scaleSimilarity(VOLUME_RANK[me.musicVolume], VOLUME_RANK[other.musicVolume])
  const temperature = scaleSimilarity(TEMPERATURE_RANK[me.temperature], TEMPERATURE_RANK[other.temperature])
  const extras = (Number(me.petsOk === other.petsOk) + Number(me.foodOk === other.foodOk)) / 2

  const raw =
    conversation * 30 +
    topics.ratio * 25 +
    genres.ratio * 20 +
    volume * 10 +
    temperature * 10 +
    extras * 5
  const score = Math.round(Math.max(0, Math.min(100, raw)))

  const highlights: string[] = []
  if (conversation === 1) {
    highlights.push(
      me.conversation === "quiet"
        ? "Ambos prefieren viajes silenciosos"
        : me.conversation === "chatty"
          ? "A ambos les gusta conversar"
          : "Mismo nivel de conversación",
    )
  }
  if (topics.shared.length > 0) {
    highlights.push(`Temas en común: ${topics.shared.slice(0, 3).join(", ")}`)
  }
  if (genres.shared.length > 0) {
    highlights.push(`Música en común: ${genres.shared.slice(0, 3).join(", ")}`)
  }
  if (temperature === 1) highlights.push("Misma preferencia de A/C")
  if (conversation === 0) highlights.push("Estilos de conversación distintos")

  return { score, highlights, sharedTopics: topics.shared, sharedGenres: genres.shared }
}

export function compatibilityTone(score: number): { label: string; classes: string } {
  if (score >= 80) return { label: "Súper compatible", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" }
  if (score >= 60) return { label: "Compatible", classes: "bg-brand-50 text-brand-700 border-brand-100" }
  return { label: "Poco afín", classes: "bg-amber-50 text-amber-700 border-amber-200" }
}
