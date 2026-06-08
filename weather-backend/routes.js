// ─────────────────────────────────────────────────────────────────
//  backend/routes.js
//
//  All route handlers in one place.
//  Imported by server.js and mounted at '/'.
// ─────────────────────────────────────────────────────────────────

const express        = require('express')
const { fetchWeather }      = require('./weatherService')
const { saveSearch, getRecentSearches } = require('./searchesService')

const router = express.Router()

// ── GET /health ───────────────────────────────────────────────────
// Health check — used to verify EC2 + PM2 is running correctly
router.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    service:   'skywatch-backend',
  })
})

// ── GET /weather?city=<name> ──────────────────────────────────────
// Fetches weather from OpenWeatherMap and saves search to DynamoDB
router.get('/weather', async (req, res) => {
  const city = req.query.city?.trim()

  if (!city) {
    return res.status(400).json({ error: 'city query parameter is required.' })
  }

  try {
    // 1. Call OpenWeatherMap
    const weather = await fetchWeather(city)

    // 2. Save to DynamoDB (non-blocking — don't fail the request if this errors)
    saveSearch(weather).catch(err =>
      console.error('[DynamoDB] saveSearch failed:', err.message)
    )

    // 3. Return weather data to frontend
    res.json(weather)

  } catch (err) {
    const status = err.statusCode || 500
    console.error(`[/weather] ${err.message}`)
    res.status(status).json({ error: err.message })
  }
})

// ── GET /searches ─────────────────────────────────────────────────
// Returns last 10 unique recent searches from DynamoDB
router.get('/searches', async (req, res) => {
  try {
    const searches = await getRecentSearches()
    res.json({ searches })
  } catch (err) {
    console.error(`[/searches] ${err.message}`)
    // Return empty list rather than erroring — recent searches are non-critical
    res.status(500).json({ searches: [], error: 'Could not load recent searches.' })
  }
})

module.exports = router