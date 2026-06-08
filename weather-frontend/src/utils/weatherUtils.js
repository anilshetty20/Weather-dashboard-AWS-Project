// ─────────────────────────────────────────────────────────────────
//  src/utils/weatherUtils.js
//
//  Maps OpenWeatherMap condition strings to emoji icons and
//  subtle background tints for the weather card.
// ─────────────────────────────────────────────────────────────────

const WEATHER_ICONS = {
  Clear:        '☀️',
  Clouds:       '☁️',
  Rain:         '🌧️',
  Drizzle:      '🌦️',
  Thunderstorm: '⛈️',
  Snow:         '❄️',
  Mist:         '🌫️',
  Fog:          '🌫️',
  Haze:         '🌁',
  Smoke:        '💨',
  Dust:         '🌪️',
  Sand:         '🌪️',
  Tornado:      '🌪️',
}

// Subtle warm/cool tint on the card background per condition
const CONDITION_TINTS = {
  Clear:        'rgba(255, 200, 50,  0.06)',
  Thunderstorm: 'rgba(100, 100, 200, 0.08)',
  Snow:         'rgba(180, 220, 255, 0.06)',
  Rain:         'rgba(80,  140, 220, 0.07)',
  Drizzle:      'rgba(80,  140, 220, 0.05)',
}

export function getWeatherIcon(condition) {
  return WEATHER_ICONS[condition] ?? '🌡️'
}

export function getConditionTint(condition) {
  return CONDITION_TINTS[condition] ?? 'transparent'
}