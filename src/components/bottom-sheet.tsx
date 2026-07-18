import { AnimatePresence, motion, useDragControls } from "framer-motion"
import { useEffect, useState, type PointerEvent, type ReactNode } from "react"

interface BottomSheetProps {
  open: boolean
  onClose?: () => void
  children: ReactNode
  /** When false the sheet renders without a dimmed backdrop (docked mode). */
  backdrop?: boolean
  className?: string
  /**
   * When true, dragging down collapses the sheet to a peek instead of dismissing.
   * Useful for map screens where the sheet should reveal more map.
   */
  collapsible?: boolean
  /** How much of the sheet remains visible when collapsed (px). */
  collapsedPeek?: number
  /** When false, drag-down / backdrop never dismiss the sheet. Defaults to true. */
  dismissible?: boolean
}

/**
 * Draggable bottom sheet. By default dismisses when dragged down past a
 * threshold. With `collapsible`, it snaps between expanded and a peek height
 * so the map behind stays visible.
 */
export function BottomSheet({
  open,
  onClose,
  children,
  backdrop = true,
  className = "",
  collapsible = false,
  collapsedPeek = 112,
  dismissible = true,
}: BottomSheetProps) {
  const controls = useDragControls()
  const [snap, setSnap] = useState<"expanded" | "collapsed">("expanded")

  useEffect(() => {
    if (open) setSnap("expanded")
  }, [open])

  const startDrag = (event: PointerEvent) => {
    controls.start(event)
  }

  const handleDismiss = () => {
    if (dismissible) onClose?.()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {backdrop && (
            <motion.div
              key="sheet-backdrop"
              className="absolute inset-0 z-30 bg-ink-900/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismiss}
            />
          )}
          <motion.div
            key="sheet-panel"
            className={`absolute inset-x-0 bottom-0 z-40 rounded-t-[28px] bg-white shadow-sheet ${className}`}
            initial={{ y: "104%" }}
            animate={{
              y: collapsible && snap === "collapsed" ? `calc(100% - ${collapsedPeek}px)` : 0,
            }}
            exit={{ y: "104%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.02, bottom: 0.55 }}
            onDragEnd={(_, info) => {
              const draggedDown = info.offset.y > 80 || info.velocity.y > 500
              const draggedUp = info.offset.y < -60 || info.velocity.y < -400

              if (collapsible) {
                if (draggedDown) setSnap("collapsed")
                else if (draggedUp) setSnap("expanded")
                return
              }

              if (draggedDown) handleDismiss()
            }}
          >
            <div
              className="flex cursor-grab touch-none justify-center pb-2 pt-3 active:cursor-grabbing"
              onPointerDown={startDrag}
              onClick={() => {
                if (collapsible && snap === "collapsed") setSnap("expanded")
              }}
            >
              <div className="h-1.5 w-11 rounded-full bg-mist-200" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
