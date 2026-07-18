import { MapPin, Route, Star } from "lucide-react"
import { BottomSheet } from "./bottom-sheet"
import { StatusBadge } from "./status-badge"
import { UserAvatar } from "./user-avatar"
import { firstName, type Persona } from "../data/mock"

export type PublicProfileVariant = "preview" | "full"

interface PublicProfileSheetProps {
  persona: Persona | null
  open: boolean
  onClose: () => void
  /** Limited before booking; fuller after booking. */
  variant?: PublicProfileVariant
  meetingPoint?: string
  affinities?: string[]
  roleLabel?: string
}

/**
 * Public companion/driver profile in a bottom sheet.
 * Preview hides full names partially and exact meeting points;
 * full variant reveals them after a seat is booked.
 */
export function PublicProfileSheet({
  persona,
  open,
  onClose,
  variant = "preview",
  meetingPoint,
  affinities = [],
  roleLabel,
}: PublicProfileSheetProps) {
  if (!persona) return null

  const isFull = variant === "full"
  const displayName = isFull ? persona.name : firstName(persona)
  const subtitle = isFull
    ? persona.role
    : persona.role.split("·")[0]?.trim() || persona.role

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-5 pb-10">
        <div className="flex items-center gap-4">
          <UserAvatar persona={persona} size={72} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-[20px] font-extrabold text-ink-900">
                {displayName}
                {isFull ? `, ${persona.age}` : ""}
              </h2>
              {roleLabel && <StatusBadge tone="smart">{roleLabel}</StatusBadge>}
            </div>
            <p className="mt-0.5 truncate text-[13px] font-semibold text-ink-400">{subtitle}</p>
            <div className="mt-1.5 flex items-center gap-1 text-[13px] font-bold text-ink-700">
              <Star size={13} className="fill-sun-500 text-sun-500" />
              {persona.rating.toFixed(1)}
              <span className="font-semibold text-ink-400">
                · {persona.tripsCompleted} viajes
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {persona.verifications.map((item) => (
            <StatusBadge key={item} tone="trust">
              {item}
            </StatusBadge>
          ))}
        </div>

        {isFull && meetingPoint && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-mist-50 px-3.5 py-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-brand-600" />
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink-400">
                Punto de encuentro
              </p>
              <p className="text-[14px] font-bold text-ink-800">{meetingPoint}</p>
            </div>
          </div>
        )}

        {!isFull && (
          <p className="mt-4 rounded-2xl bg-brand-50/80 px-3.5 py-3 text-[12px] font-semibold leading-relaxed text-brand-800">
            Reserva tu asiento para ver el nombre completo y el punto de encuentro general.
          </p>
        )}

        {affinities.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wide text-ink-400">
              <Route size={13} /> Por qué coincide con tu ruta
            </div>
            <ul className="space-y-1.5">
              {affinities.map((affinity) => (
                <li
                  key={affinity}
                  className="rounded-xl border border-mist-100 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-ink-700 shadow-card"
                >
                  {affinity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BottomSheet>
  )
}

interface AvatarProfileButtonProps {
  persona: Persona
  size?: number
  ring?: boolean
  onOpen: () => void
  label?: string
  className?: string
}

/** Accessible tap target (≥44px) wrapping a UserAvatar to open a public profile. */
export function AvatarProfileButton({
  persona,
  size = 44,
  ring = false,
  onOpen,
  label,
  className = "",
}: AvatarProfileButtonProps) {
  const hit = Math.max(44, size)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
      aria-label={label ?? `Ver perfil de ${persona.name}`}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${className}`}
      style={{ width: hit, height: hit }}
    >
      <UserAvatar persona={persona} size={size} ring={ring} />
    </button>
  )
}
