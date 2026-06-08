// ─────────────────────────────────────────────────────────────────
//  src/hooks/useWeather.js
//
//  Custom React hook that owns all weather-related state.
//  Components stay clean — no fetch logic, no state management.
//
//  Returns:
//    weather        — current weather data object (null initially)
//    recentSearches — array of { city, country } from DynamoDB
//    loading        — true while API call is in flight
//    error          — error message string, or null
//    search(city)   — trigger a weather search
//    loadRecents()  — manually refresh the recent searches list
// ─────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { getWeather, getRecentSearches } from '../utils/api'

export function useWeather() {
  const [weather, setWeather]               = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState(null)

  // Refresh recent searches from DynamoDB via backend
  const loadRecents = useCallback(async () => {
    try {
      const searches = await getRecentSearches()
      setRecentSearches(searches)
    } catch {
      // Recent searches are non-critical — fail silently
    }
  }, [])

  // Fetch weather for a city name
  const search = useCallback(async (city) => {
    const trimmed = city?.trim()
    if (!trimmed) {
      setError('Please enter a city name.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getWeather(trimmed)
      setWeather(data)
      // After a successful search, refresh recent searches
      await loadRecents()
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }, [loadRecents])

  return { weather, recentSearches, loading, error, search, loadRecents }
}