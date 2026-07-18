import { motion } from "framer-motion"
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CreditCard,
  ShieldCheck,
  Star,
} from "lucide-react"
import { DriverVehiclesSection } from "../components/driver-vehicles-section"
import { StatusBadge } from "../components/status-badge"
import { UserAvatar } from "../components/user-avatar"
import { DIEGO } from "../data/mock"
import { getMembershipTier } from "../lib/membership"
import { useApp } from "../state/app-context"

function MemberBanner({
  tripsCompleted,
  roleLabel,
}: {
  tripsCompleted: number
  roleLabel: "Pasajero" | "Conductor"
}) {
  const tier = getMembershipTier(tripsCompleted)

  return (
    <section
      className={`mt-5 overflow-hidden rounded-3xl p-5 text-white shadow-xl shadow-blue-900/10 ${tier.accent}`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tier.iconBg}`}
        >
          <span className="text-[26px] leading-none" aria-hidden>
            {tier.emoji}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-[11px] font-extrabold uppercase tracking-wide ${tier.labelColor}`}>
            Nivel de {roleLabel.toLowerCase()}
          </p>
          <p className="text-[16px] font-extrabold">
            {roleLabel} {tier.label}
          </p>
          <p className="text-[12px] font-semibold text-white/60">
            {tripsCompleted} viajes
            {tier.nextLabel && tier.tripsToNext != null
              ? ` · ${tier.tripsToNext} más para ${tier.nextLabel}`
              : " · Nivel máximo"}
          </p>
        </div>
      </div>
      {tier.nextLabel && (
        <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className={`h-full rounded-full ${tier.bar}`}
            style={{ width: `${Math.round(tier.progress * 100)}%` }}
          />
        </div>
      )}
    </section>
  )
}

function PassengerProfile() {
  const { setTab } = useApp()

  return (
    <div className="h-full overflow-y-auto px-5 pb-28 pt-14">
      <div className="flex items-center gap-4">
        <UserAvatar persona={DIEGO} size={64} />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-extrabold text-ink-900">
            {DIEGO.name}, {DIEGO.age}
          </h1>
          <p className="text-[13px] font-semibold text-ink-400">{DIEGO.role}</p>
          <div className="mt-1 flex items-center gap-1 text-[13px] font-bold text-ink-700">
            <Star size={13} className="fill-sun-500 text-sun-500" />
            {DIEGO.rating.toFixed(1)}
            <span className="font-semibold text-ink-400">· {DIEGO.tripsCompleted} viajes</span>
          </div>
        </div>
      </div>

      <MemberBanner tripsCompleted={DIEGO.tripsCompleted} roleLabel="Pasajero" />

      <section className="mt-5 rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-500/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-card">
            <ShieldCheck size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-ink-900">Confianza de pasajero</h2>
            <p className="text-[12px] font-semibold text-ink-400">Verificaciones ligeras</p>
          </div>
        </div>
        <div className="mt-4 space-y-1">
          {[
            { title: "Cédula", subtitle: "Identidad validada" },
            { title: "Correo corporativo / universitario", subtitle: "diego@empresa.com.pa" },
          ].map((item) => (
            <div key={item.title} className="flex min-h-[56px] items-center gap-3 rounded-2xl px-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={20} strokeWidth={2.4} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-extrabold text-ink-900">{item.title}</p>
                <p className="truncate text-[12px] font-semibold text-ink-400">{item.subtitle}</p>
              </div>
              <StatusBadge tone="verified">Verificado</StatusBadge>
            </div>
          ))}
        </div>
      </section>

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setTab("wallet")}
        className="mt-4 flex w-full items-center gap-3 rounded-3xl border border-mist-100 bg-white p-4 text-left shadow-card"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <CreditCard size={20} strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold text-ink-900">Métodos de pago</p>
          <p className="text-[12px] font-semibold text-ink-400">Visa, Yappy o efectivo</p>
        </div>
      </motion.button>
    </div>
  )
}

function DriverProfile() {
  const { kycSteps } = useApp()
  const verifiedCount = kycSteps.filter((s) => s.status === "verified").length
  const progress = verifiedCount / kycSteps.length

  return (
    <div className="h-full overflow-y-auto px-5 pb-28 pt-14">
      <div className="flex items-center gap-4">
        <UserAvatar persona={DIEGO} size={64} />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-extrabold text-ink-900">
            {DIEGO.name}, {DIEGO.age}
          </h1>
          <p className="text-[13px] font-semibold text-ink-400">{DIEGO.role}</p>
          <div className="mt-1 flex items-center gap-1 text-[13px] font-bold text-ink-700">
            <Star size={13} className="fill-sun-500 text-sun-500" />
            {DIEGO.rating.toFixed(1)}
            <span className="font-semibold text-ink-400">· {DIEGO.tripsCompleted} viajes</span>
          </div>
        </div>
        <StatusBadge tone="verified">Habilitado</StatusBadge>
      </div>

      <MemberBanner tripsCompleted={DIEGO.tripsCompleted} roleLabel="Conductor" />

      <section className="mt-5 rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-card">
              <ShieldCheck size={22} strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-ink-900">Panel de Confianza</h2>
              <p className="text-[12px] font-semibold text-ink-400">
                {verifiedCount} de {kycSteps.length} verificaciones completas
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-mist-100">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          />
        </div>

        <div className="mt-4 space-y-1">
          {kycSteps.map((step, i) => {
            const verified = step.status === "verified"
            return (
              <motion.button
                key={step.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className={`flex min-h-[64px] w-full items-center gap-3 rounded-2xl px-3 text-left ${
                  verified ? "" : "bg-amber-50/60"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    verified ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {verified ? (
                    <CheckCircle2 size={20} strokeWidth={2.4} />
                  ) : (
                    <Clock3 size={20} strokeWidth={2.4} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-extrabold text-ink-900">{step.title}</p>
                  <p className="truncate text-[12px] font-semibold text-ink-400">{step.subtitle}</p>
                </div>
                {verified ? (
                  <StatusBadge tone="verified">Verificado</StatusBadge>
                ) : (
                  <StatusBadge tone="pending">
                    <AlertTriangle size={11} /> Pendiente
                  </StatusBadge>
                )}
              </motion.button>
            )
          })}
        </div>
      </section>

      <DriverVehiclesSection />
    </div>
  )
}

export function ProfileScreen() {
  const { mode } = useApp()
  return mode === "passenger" ? <PassengerProfile /> : <DriverProfile />
}
