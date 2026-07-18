import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, Banknote, CreditCard, Landmark, ReceiptText } from "lucide-react"
import { useState } from "react"
import { BottomSheet } from "../components/bottom-sheet"
import { PressButton } from "../components/press-button"
import { formatBalboa, type Transaction } from "../data/mock"
import { useApp } from "../state/app-context"
import { PassengerPaymentsScreen } from "./passenger-payments-screen"

const TX_ICONS: Record<Transaction["kind"], { icon: typeof Banknote; classes: string }> = {
  earning: { icon: ArrowDownLeft, classes: "bg-emerald-50 text-emerald-600" },
  fee: { icon: ReceiptText, classes: "bg-mist-100 text-ink-500" },
  withdrawal: { icon: ArrowUpRight, classes: "bg-brand-50 text-brand-600" },
  topup: { icon: CreditCard, classes: "bg-sun-500/15 text-amber-700" },
}

export function WalletScreen() {
  const { mode, walletBalance, transactions } = useApp()
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)

  if (mode === "passenger") return <PassengerPaymentsScreen />

  const totalEarned = transactions
    .filter((t) => t.kind === "earning")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="h-full overflow-y-auto pb-28">
      {/* Hero */}
      <header className="rounded-b-[32px] bg-brand-600 px-5 pb-7 pt-14">
        <p className="text-[13px] font-bold uppercase tracking-wider text-brand-200">Billetera Rutta</p>
        <motion.p
          key={walletBalance}
          initial={{ scale: 1.06, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-2 text-[44px] font-extrabold leading-none tracking-tight text-white"
        >
          {formatBalboa(walletBalance)}
        </motion.p>
        <p className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-brand-100">
          <span className="rounded-full bg-sun-500 px-2 py-0.5 text-[11px] font-extrabold text-ink-900">
            +{formatBalboa(totalEarned)}
          </span>
          ganados compartiendo tu ruta
        </p>

        <div className="mt-5">
          <PressButton variant="accent" className="w-full" onClick={() => setIsWithdrawOpen(true)}>
            <Banknote size={18} strokeWidth={2.5} /> Retirar Fondos
          </PressButton>
        </div>
      </header>

      {/* Transactions */}
      <section className="px-5 pt-5">
        <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-wide text-ink-400">
          Actividad reciente
        </h2>
        <div className="overflow-hidden rounded-3xl border border-mist-100 bg-white shadow-card">
          {transactions.map((tx, i) => {
            const { icon: Icon, classes } = TX_ICONS[tx.kind]
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3 px-4 py-3.5 ${
                  i < transactions.length - 1 ? "border-b border-ink-900/5" : ""
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${classes}`}>
                  <Icon size={18} strokeWidth={2.4} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-ink-900">{tx.label}</p>
                  <p className="truncate text-[12px] font-semibold text-ink-400">
                    {tx.detail} · {tx.date}
                  </p>
                </div>
                <span
                  className={`text-[14px] font-extrabold ${
                    tx.amount > 0 ? "text-emerald-600" : "text-ink-700"
                  }`}
                >
                  {formatBalboa(tx.amount, true)}
                </span>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Withdraw sheet */}
      <BottomSheet open={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)}>
        <div className="px-5 pb-10">
          <h2 className="text-[17px] font-extrabold text-ink-900">Retirar Fondos</h2>
          <p className="mt-1 text-[13px] font-semibold text-ink-400">
            Disponible: {formatBalboa(walletBalance)} · Transferencia ACH sin costo
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-mist-100 bg-mist-50 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Landmark size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-extrabold text-ink-900">Banco General</p>
              <p className="text-[12px] font-semibold text-ink-400">Cuenta de ahorros ····4821</p>
            </div>
          </div>
          <PressButton className="mt-4 w-full" onClick={() => setIsWithdrawOpen(false)}>
            Retirar {formatBalboa(walletBalance)}
          </PressButton>
        </div>
      </BottomSheet>
    </div>
  )
}
