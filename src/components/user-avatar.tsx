import type { Persona } from "../data/mock"

interface UserAvatarProps {
  persona: Persona
  size?: number
  ring?: boolean
}

export function UserAvatar({ persona, size = 44, ring = false }: UserAvatarProps) {
  const { avatarHue: hue, initials, photo, name } = persona
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white ${
        ring ? "ring-2 ring-white ring-offset-2 ring-offset-transparent" : ""
      }`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        // Gradient stays visible behind the photo while it loads (and as fallback).
        background: `linear-gradient(135deg, hsl(${hue} 85% 55%), hsl(${hue + 32} 80% 42%))`,
        boxShadow: `0 4px 12px -2px hsl(${hue} 85% 45% / 0.45)`,
      }}
      aria-label={name}
    >
      {initials}
      <img
        src={photo}
        alt={name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none"
        }}
      />
    </div>
  )
}
