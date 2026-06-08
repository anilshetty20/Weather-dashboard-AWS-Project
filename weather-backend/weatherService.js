// ─────────────────────────────────────────────────────────────────
//  backend/weatherService.js
//
//  Handles the OpenWeatherMap API call and shapes the response
//  into the object our frontend expects.
// ─────────────────────────────────────────────────────────────────

const axios = require('axios')

const OWM_BASE = 'https://api.openweathermap.org/data/2.5/weather'

/**
 * Fetch current weather for a city from OpenWeatherMap.
 *
 * @param {string} city — city name e.g. "London" or "Mumbai,IN"
 * @returns {Promise<Object>} shaped weather object
 * @throws {Error} with .statusCode for the route handler to use
 */
async function fetchWeather(city) {
  let owmRes

  try {
    owmRes = await axios.get(OWM_BASE, {
      params: {
        q:     city,
        appid: process.env.OWM_API_KEY,
        units: 'metric',   // celsius — change to 'imperial' for fahrenheit
      },
    })
  } catch (err) {
    // Map OWM HTTP errors to friendly messages
    const status = err.response?.status

    if (status === 404) {
      const error = new Error(`City "${city}" not found. Check the spelling.`)
      error.statusCode = 404
      throw error
    }
    if (status === 401) {
      const error = new Error('Invalid OpenWeatherMap API key. Check your .env file.')
      error.statusCode = 500
      throw error
    }
    if (status === 429) {
      const error = new Error('OpenWeatherMap rate limit hit. Try again in a minute.')
      error.statusCode = 429
      throw error
    }

    const error = new Error('Failed to reach weather service. Try again.')
    error.statusCode = 502
    throw error
  }

  const w = owmRes.data

  // Shape the response — only expose what the frontend needs
  return {
    city:        w.name,
    country:     w.sys.country,
    temp:        w.main.temp,
    feelsLike:   w.main.feels_like,
    humidity:    w.main.humidity,
    description: w.weather[0].description,
    condition:   w.weather[0].main,
    windSpeed:   w.wind.speed,
    visibility:  w.visibility,
    timestamp:   new Date().toISOString(),
  }
}

module.exports = { fetchWeather }