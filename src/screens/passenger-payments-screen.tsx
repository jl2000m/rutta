import { motion } from "framer-motion"
import { Check, CreditCard, Plus, ShieldCheck } from "lucide-react"
import { useState, type ReactNode } from "react"
import { BottomSheet } from "../components/bottom-sheet"
import { CashEmoji, VisaLogo, YappyLogo } from "../components/payment-logos"
import { PressButton } from "../components/press-button"
import { useApp, type PaymentMethod } from "../state/app-context"

const METHODS: {
  id: PaymentMethod
  label: string
  detail: string
  logo: ReactNode
  tileClasses: string
}[] = [
  {
    id: "card",
    label: "Visa ···· 4242",
    detail: "Tarjeta guardada · Vence 08/29",
    logo: <VisaLogo height={13} />,
    tileClasses: "border border-mist-200 bg-white",
  },
  {
    id: "yappy",
    label: "Yappy",
    detail: "Pago directo desde Banco General",
    logo: <YappyLogo height={18} />,
    tileClasses: "border border-mist-200 bg-white",
  },
  {
    id: "cash",
    label: "Efectivo",
    detail: "Paga al conductor al abordar",
    logo: <CashEmoji size={22} />,
    tileClasses: "bg-emerald-50 border border-emerald-100",
  },
]

export function PassengerPaymentsScreen() {
  const { paymentMethod, setPaymentMethod, saveCard } = useApp()
  const [isCardSheetOpen, setIsCardSheetOpen] = useState(false)
  const [shouldSaveCard, setShouldSaveCard] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  const handleSaveCard = () => {
    if (shouldSaveCard) saveCard()
    setPaymentMethod("card")
    setIsSaved(true)
    setTimeout(() => {
      setIsCardSheetOpen(false)
      setIsSaved(false)
    }, 900)
  }

  return (
    <div className="h-full overflow-y-auto px-5 pb-28 pt-14">
      <h1 className="text-2xl font-extrabold text-ink-900">Métodos de pago</h1>
      <p className="mt-1 text-[13px] font-semibold text-ink-400">
        Paga cada viaje directamente. Rutta no usa saldo para pasajeros.
      </p>

      <section className="mt-6">
        <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
          Método preferido
        </h2>
        <div className="space-y-3">
          {METHODS.map(({ id, label, detail, logo, tileClasses }, index) => {
            const isSelected = paymentMethod === id
            return (
              <motion.button
                key={id}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPaymentMethod(id)}
                className={`flex min-h-[72px] w-full items-center gap-3 rounded-3xl border p-4 text-left transition-colors ${
                  isSelected
                    ? "border-brand-600 bg-brand-50 shadow-card"
                    : "border-mist-100 bg-white"
                }`}
              >
                <div
                  className={`flex h-11 w-14 shrink-0 items-center justify-center rounded-xl ${tileClasses}`}
                >
                  {logo}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-extrabold text-ink-900">{label}</p>
                  <p className="text-[12px] font-semibold text-ink-400">{detail}</p>
                </div>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    isSelected ? "border-brand-600 bg-brand-600 text-white" : "border-mist-200"
                  }`}
                >
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </span>
              </motion.button>
            )
          })}
        </div>
      </section>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsCardSheetOpen(true)}
        className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-300 bg-white text-[14px] font-extrabold text-brand-700"
      >
        <Plus size={18} strokeWidth={2.7} /> Agregar otra tarjeta
      </motion.button>

      <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
        <ShieldCheck size={19} className="mt-0.5 shrink-0 text-emerald-600" />
        <p className="text-[12px] font-semibold leading-relaxed text-emerald-800">
          Los datos de tarjeta se tokenizan y no se almacenan directamente en Rutta. Puedes cambiar el
          método antes de confirmar cada viaje.
        </p>
      </div>

      <BottomSheet open={isCardSheetOpen} onClose={() => setIsCardSheetOpen(false)}>
        <div className="px-5 pb-10">
          <h2 className="text-[18px] font-extrabold text-ink-900">Agregar tarjeta</h2>
          <p className="mt-1 text-[13px] font-semibold text-ink-400">Visa o Mastercard</p>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-bold text-ink-500">Número de tarjeta</span>
              <input
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                className="min-h-[52px] w-full rounded-2xl border border-mist-200 bg-mist-50 px-4 text-[14px] font-semibold text-ink-900 outline-none focus:border-brand-600"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="mb-1.5 block text-[12px] font-bold text-ink-500">Vencimiento</span>
                <input
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/AA"
                  className="min-h-[52px] w-full rounded-2xl border border-mist-200 bg-mist-50 px-4 text-[14px] font-semibold text-ink-900 outline-none focus:border-brand-600"
                />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold text-ink-500">CVV</span>
                <input
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  className="min-h-[52px] w-full rounded-2xl border border-mist-200 bg-mist-50 px-4 text-[14px] font-semibold text-ink-900 outline-none focus:border-brand-600"
                />
              </label>
            </div>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setShouldSaveCard((value) => !value)}
            className="mt-4 flex min-h-[48px] w-full items-center gap-3 text-left"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                shouldSaveCard ? "border-brand-600 bg-brand-600 text-white" : "border-mist-200"
              }`}
            >
              {shouldSaveCard && <Check size={14} strokeWidth={3} />}
            </span>
            <span>
              <span className="block text-[14px] font-bold text-ink-900">Guardar tarjeta en Rutta</span>
              <span className="block text-[11px] font-semibold text-ink-400">
                Para reservar más rápido, como en Uber
              </span>
            </span>
          </motion.button>

          <PressButton
            className="mt-4 w-full"
            variant={isSaved ? "success" : "primary"}
            onClick={handleSaveCard}
          >
            {isSaved ? <Check size={18} strokeWidth={3} /> : <CreditCard size={18} />}
            {isSaved ? "Tarjeta guardada" : "Guardar tarjeta"}
          </PressButton>
        </div>
      </BottomSheet>
    </div>
  )
}
