import { motion } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useApp } from "../state/app-context"
import { BottomSheet } from "./bottom-sheet"

export function DriverVehicleSelector() {
  const { vehicles, selectedVehicle, selectVehicle } = useApp()
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (plate: string) => {
    selectVehicle(plate)
    setIsOpen(false)
  }

  return (
    <>
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(true)}
        className="flex min-h-11 max-w-[168px] items-center gap-2 rounded-2xl bg-white/15 p-1.5 pr-2.5 text-left text-white"
        aria-label={`Vehículo activo: ${selectedVehicle.model}. Cambiar vehículo`}
      >
        <img
          src={selectedVehicle.photo}
          alt=""
          className="h-8 w-11 shrink-0 rounded-xl object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11px] font-extrabold">{selectedVehicle.model}</span>
          <span className="block text-[9px] font-semibold text-white/70">{selectedVehicle.plate}</span>
        </span>
        <ChevronDown size={14} className="shrink-0 text-white/80" />
      </motion.button>

      <BottomSheet open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="px-5 pb-10">
          <h2 className="text-[18px] font-extrabold text-ink-900">Vehículo para este viaje</h2>
          <p className="mt-1 text-[12px] font-semibold text-ink-400">
            Los pasajeros verán el vehículo seleccionado.
          </p>

          <div className="mt-4 space-y-3">
            {vehicles.map((vehicle) => {
              const isSelected = vehicle.plate === selectedVehicle.plate

              return (
                <motion.button
                  key={vehicle.plate}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(vehicle.plate)}
                  className={`flex min-h-[76px] w-full items-center gap-3 rounded-3xl border p-3 text-left ${
                    isSelected
                      ? "border-brand-600 bg-brand-50"
                      : "border-mist-100 bg-white shadow-card"
                  }`}
                >
                  <img
                    src={vehicle.photo}
                    alt={`${vehicle.model} ${vehicle.year}`}
                    className="h-14 w-20 shrink-0 rounded-2xl object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-extrabold text-ink-900">
                      {vehicle.model} {vehicle.year}
                    </span>
                    <span className="block text-[11px] font-semibold text-ink-400">
                      {vehicle.color} · {vehicle.plate}
                    </span>
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      isSelected ? "bg-brand-600 text-white" : "border-2 border-mist-200"
                    }`}
                  >
                    {isSelected && <Check size={15} strokeWidth={3} />}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </BottomSheet>
    </>
  )
}
