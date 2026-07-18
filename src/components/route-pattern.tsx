import { motion, useReducedMotion } from "framer-motion"

interface RoutePatternProps {
  /** Visual tone matching the banner background. */
  tone: "sun" | "brand"
  className?: string
}

const PATHS = [
  "M -10 96 L 48 96 L 86 58 L 150 58",
  "M 40 150 L 96 150 L 140 106 L 214 106 L 246 74",
  "M 150 58 L 208 58 L 240 26 L 310 26",
  "M 246 74 L 306 74 L 342 110 L 412 110",
  "M 310 26 L 352 26 L 386 60 L 412 60",
]

const NODES = [
  { cx: 48, cy: 96 },
  { cx: 150, cy: 58 },
  { cx: 140, cy: 106 },
  { cx: 246, cy: 74 },
  { cx: 240, cy: 26 },
  { cx: 342, cy: 110 },
  { cx: 352, cy: 26 },
]

// Fade the print out toward the top-left so it never competes with the greeting.
const MASK = "linear-gradient(115deg, transparent 0%, transparent 32%, rgba(0,0,0,0.55) 58%, black 82%)"

/**
 * Subtle transit-map print for banners: faint route lines with nodes,
 * plus a slow dot travelling along the network. Masked away from the
 * top-left corner to keep text readable.
 */
export function RoutePattern({ tone, className = "" }: RoutePatternProps) {
  const reducedMotion = useReducedMotion()
  const line = tone === "sun" ? "#0B1B3F" : "#FFFFFF"
  const accent = tone === "sun" ? "#FFFFFF" : "#F5C518"
  // White/yellow on brand blue needs more presence than navy on yellow.
  const boost = tone === "sun" ? 1 : 2.4
  const pathIdle = 0.05 * boost
  const pathPeak = 0.09 * boost
  const nodeIdle = 0.07 * boost
  const nodePeak = 0.14 * boost
  const travelerOpacity = tone === "sun" ? 0.22 : 0.5

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
      aria-hidden
    >
      <svg viewBox="0 0 400 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g fill="none" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
          {PATHS.map((d, i) =>
            reducedMotion ? (
              <path key={d} d={d} stroke={i % 2 === 0 ? line : accent} opacity={pathPeak} />
            ) : (
              <motion.path
                key={d}
                d={d}
                stroke={i % 2 === 0 ? line : accent}
                initial={{ pathLength: 0.9, opacity: pathIdle }}
                animate={{ pathLength: [0.9, 1, 0.9], opacity: [pathIdle, pathPeak, pathIdle] }}
                transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1.1 }}
              />
            ),
          )}
        </g>
        {NODES.map((node, i) =>
          reducedMotion ? (
            <circle
              key={`${node.cx}-${node.cy}`}
              cx={node.cx}
              cy={node.cy}
              r={3.5}
              fill={i % 2 === 0 ? accent : line}
              opacity={nodePeak}
            />
          ) : (
            <motion.circle
              key={`${node.cx}-${node.cy}`}
              cx={node.cx}
              cy={node.cy}
              r={3.5}
              fill={i % 2 === 0 ? accent : line}
              initial={{ opacity: nodeIdle, scale: 1 }}
              animate={{ opacity: [nodeIdle, nodePeak, nodeIdle], scale: [1, 1.15, 1] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.9 }}
              style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
            />
          ),
        )}
        {!reducedMotion && (
          <circle r={3} fill={accent} opacity={travelerOpacity}>
            <animateMotion
              dur="24s"
              repeatCount="indefinite"
              path="M 40 150 L 96 150 L 140 106 L 214 106 L 246 74 L 306 74 L 342 110 L 412 110"
            />
          </circle>
        )}
      </svg>
    </div>
  )
}
