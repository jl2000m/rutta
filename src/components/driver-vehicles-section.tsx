import { motion } from "framer-motion"
import { Camera, Check, Plus } from "lucide-react"
import { useState, type ChangeEvent } from "react"
import { useApp } from "../state/app-context"
import { BottomSheet } from "./bottom-sheet"
import { PressButton } from "./press-button"

const INITIAL_FORM = {
  model: "",
  year: "",
  plate: "",
  color: "",
  photo: "",
}

export function DriverVehiclesSection() {
  const { vehicles, selectedVehicle, selectVehicle, registerVehicle } = useApp()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)

  const isComplete =
    form.model.trim() &&
    form.year.trim() &&
    form.plate.trim() &&
    form.color.trim() &&
    form.photo

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((current) => ({ ...current, photo: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRegister = () => {
    if (!isComplete) return

    registerVehicle({
      model: form.model.trim(),
      year: Number(form.year),
      plate: form.plate.trim().toUpperCase(),
      color: form.color.trim(),
      capacity: 3,
      photo: form.photo,
    })
    setForm(INITIAL_FORM)
    setIsRegisterOpen(false)
  }

  return (
    <>
      <section className="mt-4 rounded-3xl border border-mist-100 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-extrabold text-ink-900">Mis vehículos</h2>
            <p className="text-[12px] font-semibold text-ink-400">
              {vehicles.length} registrados · Toca uno para usarlo
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsRegisterOpen(true)}
            className="flex min-h-11 items-center gap-1.5 rounded-2xl bg-brand-50 px-3 text-[12px] font-extrabold text-brand-700"
          >
            <Plus size={16} strokeWidth={2.7} /> Agregar
          </motion.button>
        </div>

        <div className="mt-4 space-y-3">
          {vehicles.map((vehicle) => {
            const isSelected = vehicle.plate === selectedVehicle.plate

            return (
              <motion.button
                key={vehicle.plate}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => selectVehicle(vehicle.plate)}
                className={`flex min-h-[82px] w-full items-center gap-3 rounded-2xl border p-3 text-left ${
                  isSelected ? "border-brand-600 bg-brand-50" : "border-mist-100 bg-mist-50"
                }`}
              >
                <img
                  src={vehicle.photo}
                  alt={`${vehicle.model} ${vehicle.year}`}
                  className="h-14 w-20 shrink-0 rounded-xl object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-extrabold text-ink-900">
                    {vehicle.model} {vehicle.year}
                  </span>
                  <span className="block text-[11px] font-semibold text-ink-400">
                    {vehicle.color} · {vehicle.plate}
                  </span>
                  {isSelected && (
                    <span className="mt-1 flex items-center gap-1 text-[10px] font-extrabold text-brand-700">
                      <Check size={11} strokeWidth={3} /> Vehículo activo
                    </span>
                  )}
                </span>
              </motion.button>
            )
          })}
        </div>
      </section>

      <BottomSheet open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <div className="max-h-[82vh] overflow-y-auto px-5 pb-10">
          <h2 className="text-[18px] font-extrabold text-ink-900">Registrar vehículo</h2>
          <p className="mt-1 text-[12px] font-semibold text-ink-400">
            Agrega los datos y una foto real del carro.
          </p>

          <label className="mt-4 block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhoto}
              className="sr-only"
            />
            {form.photo ? (
              <img
                src={form.photo}
                alt="Vista previa del vehículo"
                className="h-36 w-full rounded-3xl object-cover"
              />
            ) : (
              <span className="flex h-32 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50 text-brand-700">
                <Camera size={24} strokeWidth={2.3} />
                <span className="mt-2 text-[13px] font-extrabold">Tomar o subir foto</span>
              </span>
            )}
          </label>

          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-[1fr_92px] gap-3">
              <VehicleInput
                label="Marca y modelo"
                placeholder="Ej. Toyota Corolla"
                value={form.model}
                onChange={(value) => setForm((current) => ({ ...current, model: value }))}
              />
              <VehicleInput
                label="Año"
                placeholder="2024"
                value={form.year}
                inputMode="numeric"
                onChange={(value) => setForm((current) => ({ ...current, year: value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <VehicleInput
                label="Placa"
                placeholder="AB-1234"
                value={form.plate}
                onChange={(value) => setForm((current) => ({ ...current, plate: value }))}
              />
              <VehicleInput
                label="Color"
                placeholder="Blanco perla"
                value={form.color}
                onChange={(value) => setForm((current) => ({ ...current, color: value }))}
              />
            </div>
          </div>

          <PressButton
            className="mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!isComplete}
            onClick={handleRegister}
          >
            <Plus size={18} strokeWidth={2.7} /> Registrar y usar vehículo
          </PressButton>
        </div>
      </BottomSheet>
    </>
  )
}

interface VehicleInputProps {
  label: string
  placeholder: string
  value: string
  inputMode?: "text" | "numeric"
  onChange: (value: string) => void
}

function VehicleInput({
  label,
  placeholder,
  value,
  inputMode = "text",
  onChange,
}: VehicleInputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold text-ink-500">{label}</span>
      <input
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[50px] w-full rounded-2xl border border-mist-200 bg-mist-50 px-3 text-[13px] font-semibold text-ink-900 outline-none focus:border-brand-600"
      />
    </label>
  )
}
