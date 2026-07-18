# Rutta — Smart Carpooling (Frontend Demo)

High-fidelity, interactive frontend prototype for **Rutta**, a smart carpooling app for the
Panamá Oeste → Ciudad de Panamá commute. Pure frontend: all data is mocked in React state.

## Stack

- **React 19 + TypeScript** (Vite)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Framer Motion** — bottom sheets (drag-to-dismiss), swipe-to-accept cards, tap scales, tab transitions
- **lucide-react** icons

## Run it

```bash
npm install
npm run dev
```

Open the printed URL — the app renders as a mobile PWA layout (max-width 430px, centered).

## Demo map

| Module | Where |
| --- | --- |
| Home hub + mode switcher | Inicio tab — toggle Pasajero/Conductor |
| Passenger flow | Pasajero mode → "¿A dónde vas hoy?" → matching map → checkout ("Reservar Asiento") |
| Driver recurring schedule | Conductor mode → "Mi horario recurrente" |
| AI smart matching (swipe) | Conductor mode → "Pasajeros recomendados" — swipe right/left |
| Active trip + boarding | "Ruta de hoy" card → "Confirmar Abordaje" releases funds to the wallet |
| Trust / KYC dashboard | Perfil tab |
| Fintech wallet | Billetera tab — withdraw & payment-method sheets |

Personas: Diego (driver, Toyota Yaris 2023, 4.9★) and Camila (passenger, 5.0★).
Flat rate **B/. 2.50** per seat, **B/. 0.25** platform fee.
