/**
 * OttLeszek — Expo config. API URL for backend (override for emulator/device).
 * Usage:
 *   Android emulator: EXPO_PUBLIC_API_URL=http://10.0.2.2:3000 pnpm run dev
 *   iOS simulator:    default localhost works
 *   Physical device:  EXPO_PUBLIC_API_URL=http://<your-PC-IP>:3000 pnpm run dev
 */
const { expo } = require("./app.json");

module.exports = {
  expo: {
    ...expo,
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
    },
  },
};
