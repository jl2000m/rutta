import { motion, type HTMLMotionProps } from "framer-motion"

type Variant = "primary" | "accent" | "ghost" | "success" | "danger-ghost"

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-xl shadow-blue-900/10",
  accent: "bg-sun-500 text-ink-900 shadow-xl shadow-amber-500/20",
  ghost: "bg-ink-900/5 text-ink-700",
  success: "bg-emerald-500 text-white shadow-xl shadow-emerald-500/25",
  "danger-ghost": "bg-red-50 text-red-600 border border-red-100",
}

interface PressButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant
}

export function PressButton({ variant = "primary", className = "", children, ...rest }: PressButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-bold ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
