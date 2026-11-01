import { motion } from "framer-motion"
import { ArrowLeft, Car, Check, Dog, MessageCircle, Music2, Sandwich, Sparkles, Thermometer, Users } from "lucide-react"
import { useState, type ReactNode } from "react"
import { PressButton } from "../components/press-button"
import {
  CONVERSATION_OPTIONS,
  MUSIC_CONTROL_OPTIONS,
  MUSIC_GENRES,
  MUSIC_VOLUME_OPTIONS,
  SEAT_OPTIONS,
  TEMPERATURE_OPTIONS,
  TOPICS,
  type RidePreferences,
} from "../lib/ride-preferences"
import { useApp } from "../state/app-context"

const MAX_TOPICS = 5

function Section({ icon, title, subtitle, children }: { icon: ReactNode; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-mist-100 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">{icon}</div>
        <div>
          <h2 className="text-[15px] font-extrabold text-ink-900">{title}</h2>
          {subtitle && <p className="text-[12px] font-semibold text-ink-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function SegmentOption({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-2xl border px-2 py-2.5 text-center transition-colors ${
        selected ? "border-brand-600 bg-brand-50 text-brand-700" : "border-mist-200 bg-white text-ink-700"
      }`}
    >
      {children}
    </motion.button>
  )
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-bold transition-colors ${
        selected ? "border-brand-600 bg-brand-600 text-white" : "border-mist-200 bg-white text-ink-700"
      }`}
    >
      {selected && <Check size={13} strokeWidth={3} />}
      {children}
    </motion.button>
  )
}

function Toggle({ label, hint, icon, checked, onChange }: { label: string; hint: string; icon: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl px-1 text-left"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mist-50 text-ink-500">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-extrabold text-ink-900">{label}</p>
        <p className="text-[12px] font-semibold text-ink-400">{hint}</p>
      </div>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-emerald-500" : "bg-mist-200"}`}>
        <motion.span
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
          animate={{ left: checked ? 24 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        />
      </span>
    </button>
  )
}

function toggleItem(list: string[], item: string, max = Infinity): string[] {
  if (list.includes(item)) return list.filter((i) => i !== item)
  if (list.length >= max) return list
  return [...list, item]
}

export function RidePreferencesScreen() {
  const { setFlow, mode, ridePreferences, setRidePreferences } = useApp()
  const [draft, setDraft] = useState<RidePreferences>(ridePreferences)
  const [saved, setSaved] = useState(false)
  const isDriver = mode === "driver"

  const update = <K extends keyof RidePreferences>(key: K, value: RidePreferences[K]) => {
    setSaved(false)
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const save = () => {
    setRidePreferences(draft)
    setSaved(true)
    setTimeout(() => setFlow({ name: "none" }), 650)
  }

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
        <div className="flex-1">
          <h1 className="text-lg font-extrabold text-ink-900">Preferencias de viaje</h1>
          <p className="text-[12px] font-semibold text-ink-400">
            {isDriver ? "Como conductor" : "Como pasajero"} · Mejoran tu smart matching
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-36">
        <div className="flex items-start gap-2.5 rounded-2xl border border-sun-500/40 bg-sun-500/15 px-4 py-3">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-700" />
          <p className="text-[12px] font-semibold leading-relaxed text-amber-900">
            La IA de Rutta usa estas preferencias para emparejarte con {isDriver ? "pasajeros" : "conductores y compañeros"} afines.
            Solo se muestran como coincidencias, nunca tu perfil completo.
          </p>
        </div>

        <Section icon={<MessageCircle size={18} />} title="Conversación" subtitle="¿Cómo te gusta el ambiente?">
          <div className="flex gap-2">
            {CONVERSATION_OPTIONS.map((o) => (
              <SegmentOption key={o.value} selected={draft.conversation === o.value} onClick={() => update("conversation", o.value)}>
                <span className="text-[22px] leading-none">{o.emoji}</span>
                <span className="mt-1 text-[13px] font-extrabold">{o.label}</span>
                <span className="text-[11px] font-semibold text-ink-400">{o.hint}</span>
              </SegmentOption>
            ))}
          </div>
        </Section>

        <Section icon={<Sparkles size={18} />} title="Temas que te gustan" subtitle={`Elige hasta ${MAX_TOPICS} · ${draft.topics.length}/${MAX_TOPICS}`}>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <Chip
                key={t.label}
                selected={draft.topics.includes(t.label)}
                onClick={() => update("topics", toggleItem(draft.topics, t.label, MAX_TOPICS))}
              >
                <span aria-hidden>{t.emoji}</span> {t.label}
              </Chip>
            ))}
          </div>
        </Section>

        <Section icon={<Music2 size={18} />} title="Música" subtitle="Volumen y géneros favoritos">
          <div className="flex gap-2">
            {MUSIC_VOLUME_OPTIONS.map((o) => (
              <SegmentOption key={o.value} selected={draft.musicVolume === o.value} onClick={() => update("musicVolume", o.value)}>
                <span className="text-[18px] leading-none">{o.emoji}</span>
                <span className="mt-1 text-[12px] font-extrabold">{o.label}</span>
              </SegmentOption>
            ))}
          </div>
          {draft.musicVolume !== "off" && (
            <div className="mt-3 flex flex-wrap gap-2">
              {MUSIC_GENRES.map((g) => (
                <Chip key={g} selected={draft.musicGenres.includes(g)} onClick={() => update("musicGenres", toggleItem(draft.musicGenres, g))}>
                  {g}
                </Chip>
              ))}
            </div>
          )}
          {isDriver && (
            <div className="mt-3 flex gap-2">
              {MUSIC_CONTROL_OPTIONS.map((o) => (
                <SegmentOption key={o.value} selected={draft.musicControl === o.value} onClick={() => update("musicControl", o.value)}>
                  <span className="text-[13px] font-extrabold">{o.label}</span>
                  <span className="text-[11px] font-semibold text-ink-400">{o.hint}</span>
                </SegmentOption>
              ))}
            </div>
          )}
        </Section>

        <Section icon={<Thermometer size={18} />} title="Temperatura" subtitle="Aire acondicionado">
          <div className="flex gap-2">
            {TEMPERATURE_OPTIONS.map((o) => (
              <SegmentOption key={o.value} selected={draft.temperature === o.value} onClick={() => update("temperature", o.value)}>
                <span className="text-[18px] leading-none">{o.emoji}</span>
                <span className="mt-1 text-[12px] font-extrabold">{o.label}</span>
              </SegmentOption>
            ))}
          </div>
        </Section>

        {!isDriver && (
          <Section icon={<Users size={18} />} title="Asiento preferido">
            <div className="flex gap-2">
              {SEAT_OPTIONS.map((o) => (
                <SegmentOption key={o.value} selected={draft.seat === o.value} onClick={() => update("seat", o.value)}>
                  <span className="text-[13px] font-extrabold">{o.label}</span>
                </SegmentOption>
              ))}
            </div>
          </Section>
        )}

        <Section icon={<Car size={18} />} title={isDriver ? "Reglas de tu auto" : "Extras"}>
          <Toggle
            label="Mascotas"
            hint={isDriver ? "Permito mascotas pequeñas" : "Viajo a veces con mi mascota"}
            icon={<Dog size={18} />}
            checked={draft.petsOk}
            onChange={(v) => update("petsOk", v)}
          />
          <Toggle
            label="Comida y bebidas"
            hint={isDriver ? "Se puede desayunar en el auto" : "Me gusta desayunar en ruta"}
            icon={<Sandwich size={18} />}
            checked={draft.foodOk}
            onChange={(v) => update("foodOk", v)}
          />
        </Section>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-mist-50 via-mist-50 to-transparent px-5 pb-8 pt-6">
        <PressButton variant={saved ? "success" : "primary"} className="w-full" onClick={save}>
          {saved ? (
            <>
              <Check size={18} strokeWidth={3} /> Preferencias guardadas
            </>
          ) : (
            "Guardar preferencias"
          )}
        </PressButton>
      </div>
    </div>
  )
}
