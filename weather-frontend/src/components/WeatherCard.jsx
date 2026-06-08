import React from 'react'
import { getWeatherIcon, getConditionTint } from '../utils/weatherUtils'

function StatBox({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: '20px 18px',
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2,
        background: accent ? 'var(--accent)' : 'var(--border-2)',
      }} />
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
        color: 'var(--muted-2)', textTransform: 'uppercase',
        letterSpacing: '0.14em',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '1.4rem', fontWeight: 500,
        color: accent ? 'var(--accent)' : 'var(--text)',
        fontFamily: 'var(--font-mono)',
      }}>
        {value}
      </span>
    </div>
  )
}

export default function WeatherCard({ weather }) {
  if (!weather) return null

  const icon = getWeatherIcon(weather.condition)

  return (
    <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
      {/* Main card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-2)',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Top accent bar */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
        }} />

        <div style={{ padding: '36px 40px' }}>
          {/* Top row — location + icon */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: 32,
          }}>
            <div>
              {/* Country label */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                color: 'var(--accent)', letterSpacing: '0.2em',
                textTransform: 'uppercase', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ opacity: 0.5 }}>◈</span>
                {weather.country}
              </div>
              {/* City name */}
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                lineHeight: 0.9, letterSpacing: '0.04em',
                color: 'var(--text)',
              }}>
                {weather.city.toUpperCase()}
              </h2>
            </div>

            {/* Weather icon badge */}
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-2)',
              borderRadius: 4, padding: '16px 20px',
              fontSize: '3rem', lineHeight: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8,
            }}>
              <span>{icon}</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                color: 'var(--muted-2)', textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                {weather.condition}
              </span>
            </div>
          </div>

          {/* Temperature */}
          <div style={{
            display: 'flex', alignItems: 'flex-end',
            gap: 16, marginBottom: 8,
            borderBottom: '1px solid var(--border)',
            paddingBottom: 28,
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 18vw, 10rem)',
              lineHeight: 0.85, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {Math.round(weather.temp)}
            </div>
            <div style={{ paddingBottom: 12 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem', color: 'var(--muted)',
                lineHeight: 1,
              }}>°C</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                color: 'var(--muted-2)', textTransform: 'capitalize',
                letterSpacing: '0.06em', marginTop: 4,
              }}>
                {weather.description}
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12, marginTop: 28,
          }}>
            <StatBox label="Humidity"   value={`${weather.humidity}%`} accent />
            <StatBox label="Wind Speed" value={`${weather.windSpeed}m/s`} />
            <StatBox label="Feels Like" value={`${Math.round(weather.feelsLike)}°C`} />
            <StatBox label="Visibility" value={`${(weather.visibility/1000).toFixed(1)}km`} />
          </div>
        </div>

        {/* Footer bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--surface-2)',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            color: 'var(--muted)', letterSpacing: '0.06em',
          }}>
            UPDATED {new Date().toLocaleTimeString().toUpperCase()}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            color: 'var(--muted)', letterSpacing: '0.06em',
          }}>
            SRC: OPENWEATHERMAP
          </span>
        </div>
      </div>
    </div>
  )
}
