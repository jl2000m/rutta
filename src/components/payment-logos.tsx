/** Official brand marks for payment methods, served from public/logos. */

export function VisaLogo({ height = 14 }: { height?: number }) {
  return <img src="/logos/visa.svg" alt="Visa" style={{ height }} className="w-auto" />
}

export function YappyLogo({ height = 14 }: { height?: number }) {
  return <img src="/logos/yappy.svg" alt="Yappy" style={{ height }} className="w-auto" />
}

export function CashEmoji({ size = 20 }: { size?: number }) {
  return (
    <span role="img" aria-label="Efectivo" style={{ fontSize: size, lineHeight: 1 }}>
      💵
    </span>
  )
}
