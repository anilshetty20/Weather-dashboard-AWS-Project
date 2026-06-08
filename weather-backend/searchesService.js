// ─────────────────────────────────────────────────────────────────
//  backend/searchesService.js
//
//  All DynamoDB operations for the WeatherSearches table.
//
//  Table schema:
//    searchId  (String) — Partition key, format: "CityName-timestamp"
//    city      (String)
//    country   (String)
//    temp      (Number)
//    condition (String)
//    timestamp (String) — ISO 8601
// ─────────────────────────────────────────────────────────────────

const { PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb')
const dynamo = require('./db')

const TABLE = process.env.DYNAMO_TABLE || 'WeatherSearches'

/**
 * Save a weather search to DynamoDB.
 * Called after every successful weather fetch.
 */
async function saveSearch({ city, country, temp, condition }) {
  const item = {
    searchId:  `${city}-${Date.now()}`,   // unique partition key
    city,
    country,
    temp,
    condition,
    timestamp: new Date().toISOString(),
  }

  await dynamo.send(new PutCommand({
    TableName: TABLE,
    Item: item,
  }))
}

/**
 * Get the 10 most recent unique city searches from DynamoDB.
 * Uses a Scan (fine for small tables in a learning project).
 *
 * @returns {Promise<Array<{ city, country }>>}
 */
async function getRecentSearches() {
  const result = await dynamo.send(new ScanCommand({
    TableName: TABLE,
  }))

  const items = result.Items || []

  // Sort newest first, then deduplicate by city name, take top 10
  const seen   = new Set()
  const unique = items
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .filter(item => {
      if (seen.has(item.city)) return false
      seen.add(item.city)
      return true
    })
    .slice(0, 10)
    .map(item => ({ city: item.city, country: item.country }))

  return unique
}

module.exports = { saveSearch, getRecentSearches }