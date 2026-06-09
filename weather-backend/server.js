// ─────────────────────────────────────────────────────────────────
//  backend/server.js
//
//  Express app entry point.
//  Loads env vars, sets up middleware, mounts routes, starts server.
// ─────────────────────────────────────────────────────────────────

require('dotenv').config()   // loads .env into process.env

const express = require('express')
const cors    = require('cors')
const routes  = require('./routes')

const app  = express()
const PORT = process.env.PORT || 3000

// ── Middleware ────────────────────────────────────────────────────

// CORS — allow requests from your React frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET'],
}))

// Parse JSON request bodies
app.use(express.json())

// Request logger — useful when debugging on EC2
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// ── Routes ────────────────────────────────────────────────────────
app.use('/', routes)

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.url} not found.` })
})

// ── Global error handler ──────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Unhandled error]', err.message)
  res.status(500).json({ error: 'Internal server error.' })
})

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════╗
║        Weather-Backend is running            ║
║                                              ║
║  Local:   http://localhost:${PORT}           ║
║  EC2:     http://<your-ec2-ip>:${PORT}       ║
║                                              ║
║  Endpoints:                                  ║
║    GET /health                               ║
║    GET /weather?city=London                  ║
║    GET /searches                             ║
╚══════════════════════════════════════════════╝
  `)
})