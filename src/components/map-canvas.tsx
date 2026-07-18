import { motion } from "framer-motion"
import { Car, MapPin } from "lucide-react"

interface MapCanvasProps {
  /** Draw the highlighted route between west origin and east destination. */
  showRoute?: boolean
  /** Animate a car marker travelling along the route. */
  liveCar?: boolean
  /** Meeting point nodes to render as tappable pins. */
  nodes?: {
    id: string
    x: number
    y: number
    active?: boolean
    label?: string
    marker?: string
    tone?: "origin" | "stop" | "pickup" | "destination"
  }[]
  className?: string
}

const ROUTE_PATH = "M 60 300 C 120 280 150 240 190 205 S 270 150 330 128"

/** Stylized map of the Panamá Oeste → Ciudad de Panamá corridor. */
export function MapCanvas({ showRoute = false, liveCar = false, nodes = [], className = "" }: MapCanvasProps) {
  return (
    <div className={`relative overflow-hidden bg-[#e9eef7] ${className}`}>
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* water: Bahía de Panamá */}
        <path d="M 250 400 Q 300 330 400 310 L 400 400 Z" fill="#cfe0f5" />
        <path d="M 0 400 Q 60 380 130 388 L 130 400 Z" fill="#cfe0f5" />
        {/* green areas */}
        <circle cx="310" cy="60" r="52" fill="#dcead9" />
        <circle cx="90" cy="120" r="64" fill="#dcead9" />
        <circle cx="230" cy="330" r="40" fill="#dcead9" />
        {/* city blocks */}
        <g fill="#dde3f0">
          <rect x="150" y="60" width="44" height="30" rx="6" />
          <rect x="210" y="90" width="34" height="46" rx="6" />
          <rect x="60" y="210" width="48" height="34" rx="6" />
          <rect x="120" y="150" width="30" height="30" rx="6" />
          <rect x="290" y="170" width="44" height="30" rx="6" />
          <rect x="330" y="230" width="34" height="44" rx="6" />
        </g>
        {/* secondary roads */}
        <g stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M 0 180 Q 100 170 200 190 T 400 170" />
          <path d="M 120 0 Q 130 120 100 250 T 140 400" />
          <path d="M 280 0 Q 260 140 300 260 T 260 400" />
          <path d="M 0 300 Q 120 290 240 320 T 400 300" />
        </g>
        {/* main corridor: Puente de las Américas → Corredor Sur */}
        <path d={ROUTE_PATH} stroke="#ffffff" strokeWidth="13" strokeLinecap="round" fill="none" />
        {showRoute && (
          <motion.path
            d={ROUTE_PATH}
            stroke="#0047FF"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        )}
        {showRoute && (
          <>
            <circle cx="60" cy="300" r="8" fill="#0047FF" stroke="#fff" strokeWidth="3" />
            <circle cx="330" cy="128" r="8" fill="#FFCC00" stroke="#fff" strokeWidth="3" />
          </>
        )}
      </svg>

      {liveCar && (
        <motion.div
          className="absolute z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shadow-float"
          style={{ marginLeft: -18, marginTop: -18 }}
          initial={{ left: "15%", top: "75%" }}
          animate={{ left: ["15%", "34%", "52%", "70%"], top: ["75%", "58%", "45%", "36%"] }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <Car size={18} strokeWidth={2.5} />
        </motion.div>
      )}

      {nodes.map((node, i) => {
        const labelAbove = node.y >= 55
        return (
        <motion.div
          key={node.id}
          className="absolute z-10"
          style={{ left: `${node.x}%`, top: `${node.y}%`, marginLeft: -16, marginTop: -32 }}
          initial={{ opacity: 0, y: -8, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: node.active ? 1.15 : 1 }}
          transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 380, damping: 22 }}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-extrabold shadow-card ${
              node.tone === "destination"
                ? "bg-ink-900 text-white"
                : node.active || node.tone === "pickup"
                  ? "bg-sun-500 text-ink-900"
                  : node.tone === "origin"
                    ? "bg-emerald-500 text-white"
                    : "bg-brand-600 text-white"
            }`}
          >
            {node.marker ?? <MapPin size={15} strokeWidth={2.5} />}
          </div>
          {node.label && (
            <span
              className={`absolute left-1/2 w-max max-w-[100px] -translate-x-1/2 rounded-lg bg-white/95 px-2 py-1 text-center text-[9px] font-extrabold leading-tight text-ink-800 shadow-card ${
                labelAbove ? "bottom-9" : "top-9"
              }`}
            >
              {node.label}
            </span>
          )}
          {node.active && (
            <motion.div
              className="absolute inset-0 -z-10 rounded-full bg-sun-500"
              animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </motion.div>
        )
      })}
    </div>
  )
}
