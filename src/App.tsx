import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useState } from "react"
import { BottomNav } from "./components/bottom-nav"
import { ActiveTripScreen } from "./screens/active-trip-screen"
import { DriverMatchingScreen } from "./screens/driver-matching-screen"
import { DriverOneTimeTripScreen } from "./screens/driver-one-time-trip-screen"
import { DriverScheduleScreen } from "./screens/driver-schedule-screen"
import { HomeScreen } from "./screens/home-screen"
import { PassengerCheckoutScreen } from "./screens/passenger-checkout-screen"
import { PassengerMatchingScreen } from "./screens/passenger-matching-screen"
import { PassengerSearchScreen } from "./screens/passenger-search-screen"
import { ProfileScreen } from "./screens/profile-screen"
import { SplashScreen } from "./screens/splash-screen"
import { TripDetailsScreen } from "./screens/trip-details-screen"
import { TripsScreen } from "./screens/trips-screen"
import { WalletScreen } from "./screens/wallet-screen"
import { AppProvider, useApp, type FlowScreen } from "./state/app-context"

function FlowRouter({ flow }: { flow: FlowScreen }) {
  switch (flow.name) {
    case "passenger-search":
      return <PassengerSearchScreen />
    case "passenger-matching":
      return <PassengerMatchingScreen origin={flow.origin} destination={flow.destination} />
    case "passenger-checkout":
      return (
        <PassengerCheckoutScreen
          offerId={flow.offerId}
          origin={flow.origin}
          destination={flow.destination}
        />
      )
    case "driver-schedule":
      return <DriverScheduleScreen />
    case "driver-one-time-trip":
      return <DriverOneTimeTripScreen />
    case "driver-matching":
      return <DriverMatchingScreen />
    case "active-trip":
      return <ActiveTripScreen />
    case "trip-details":
      return <TripDetailsScreen tripId={flow.tripId} />
    default:
      return null
  }
}

function Shell({ showSplash, onSplashDone }: { showSplash: boolean; onSplashDone: () => void }) {
  const { tab, flow } = useApp()

  return (
    <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden bg-mist-50 shadow-2xl">
      {/* Tab screens */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          className="h-full"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {tab === "home" && <HomeScreen />}
          {tab === "trips" && <TripsScreen />}
          {tab === "wallet" && <WalletScreen />}
          {tab === "profile" && <ProfileScreen />}
        </motion.div>
      </AnimatePresence>

      <BottomNav />

      {/* Full-screen flows layered above the tabs */}
      <AnimatePresence>
        {flow.name !== "none" && (
          <motion.div
            key={flow.name === "trip-details" ? `trip-details-${flow.tripId}` : flow.name}
            className="absolute inset-0 z-30 bg-mist-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <FlowRouter flow={flow} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={onSplashDone} />}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashDone = useCallback(() => setShowSplash(false), [])

  return (
    <AppProvider>
      <Shell showSplash={showSplash} onSplashDone={handleSplashDone} />
    </AppProvider>
  )
}
