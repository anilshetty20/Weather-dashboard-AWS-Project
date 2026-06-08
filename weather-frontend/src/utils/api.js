// ─────────────────────────────────────────────────────────────────
//  src/utils/api.js
//
//  All backend HTTP calls live here.
//  VITE_API_BASE is read from .env.local (dev) or .env (production).
//  Vite bakes it into the build at compile time via import.meta.env
// ─────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

/**
 * Fetch current weather for a city from our EC2 backend.
 * The backend calls OpenWeatherMap and saves the search to DynamoDB.
 *
 * @param {string} city - city name e.g. "London"
 * @returns {Promise<Object>} weather data object
 * @throws {Error} with a human-readable message on failure
 */
export async function getWeather(city) {
  const res = await fetch(`${BASE}/weather?city=${encodeURIComponent(city)}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'City not found.')
  return data
}

/**
 * Fetch the 10 most recent unique city searches stored in DynamoDB.
 *
 * @returns {Promise<Array>} array of { city, country } objects
 */
export async function getRecentSearches() {
  const res = await fetch(`${BASE}/searches`)
  if (!res.ok) return []
  const data = await res.json()
  return data.searches || []
}