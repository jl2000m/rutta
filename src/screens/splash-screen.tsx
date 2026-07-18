import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"

interface SplashScreenProps {
  onComplete: () => void
}

const BRAND = "#0047FF"
const SUN = "#F5C518"

interface RoutePath {
  d: string
  color: string
  delay: number
}

interface RouteNode {
  cx: number
  cy: number
  fill: string
  stroke?: string
  delay: number
}

const PATHS: RoutePath[] = [
  { d: "M 36 168 L 36 96 L 108 40 L 180 40", color: BRAND, delay: 0.05 },
  { d: "M 36 168 L 100 168 L 148 120 L 220 120", color: BRAND, delay: 0.18 },
  { d: "M 108 40 L 108 100 L 180 168 L 248 168", color: SUN, delay: 0.28 },
  { d: "M 220 120 L 248 80 L 284 80", color: BRAND, delay: 0.38 },
  { d: "M 180 40 L 248 40 L 284 80", color: SUN, delay: 0.45 },
]

const NODES: RouteNode[] = [
  { cx: 36, cy: 168, fill: BRAND, delay: 0.55 },
  { cx: 108, cy: 40, fill: SUN, stroke: BRAND, delay: 0.62 },
  { cx: 180, cy: 40, fill: BRAND, delay: 0.68 },
  { cx: 148, cy: 120, fill: SUN, stroke: BRAND, delay: 0.74 },
  { cx: 220, cy: 120, fill: BRAND, delay: 0.8 },
  { cx: 248, cy: 168, fill: SUN, stroke: BRAND, delay: 0.86 },
  { cx: 284, cy: 80, fill: BRAND, delay: 0.92 },
]

/**
 * One-shot welcome splash: transit-map paths draw in and nodes spring in.
 * Tap or auto-dismiss after ~2.3s.
 */
export function SplashScreen({ onComplete }: SplashScreenProps) {
  const reducedMotion = useReducedMotion()
  const doneRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      onCompleteRef.current()
    }
    const ms = reducedMotion ? 1800 : 2300
    const timer = window.setTimeout(finish, ms)
    return () => window.clearTimeout(timer)
  }, [reducedMotion])

  const handleTap = () => {
    if (doneRef.current) return
    doneRef.current = true
    onComplete()
  }

  return (
    <motion.button
      type="button"
      aria-label="Continuar a Rutta"
      onClick={handleTap}
      className="absolute inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-mist-50 px-8"
      initial={reducedMotion ? false : { opacity: 1, scale: 1 }}
      exit={
        reducedMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 1.04, transition: { duration: 0.45, ease: "easeInOut" } }
      }
    >
      <div className="relative w-full max-w-[220px]">
        <svg viewBox="0 0 320 210" className="h-auto w-full" aria-hidden>
          {PATHS.map((path) =>
            reducedMotion ? (
              <path
                key={path.d}
                d={path.d}
                fill="none"
                stroke={path.color}
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <motion.path
                key={path.d}
                d={path.d}
                fill="none"
                stroke={path.color}
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0.35 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.85, delay: path.delay, ease: "easeInOut" }}
              />
            ),
          )}
          {NODES.map((node, i) =>
            reducedMotion ? (
              <circle
                key={`${node.cx}-${node.cy}-${i}`}
                cx={node.cx}
                cy={node.cy}
                r={node.stroke ? 11 : 9}
                fill={node.fill}
                stroke={node.stroke}
                strokeWidth={node.stroke ? 4 : 0}
              />
            ) : (
              <motion.circle
                key={`${node.cx}-${node.cy}-${i}`}
                cx={node.cx}
                cy={node.cy}
                r={node.stroke ? 11 : 9}
                fill={node.fill}
                stroke={node.stroke}
                strokeWidth={node.stroke ? 4 : 0}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 18, delay: node.delay }}
                style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
              />
            ),
          )}
        </svg>
      </div>

    </motion.button>
  )
}
