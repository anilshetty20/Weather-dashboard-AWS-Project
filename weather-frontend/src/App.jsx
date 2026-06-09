import React from 'react'
import BackgroundOrbs  from './components/BackgroundOrbs'
import Header          from './components/Header'
import SearchBar       from './components/SearchBar'
import WeatherCard     from './components/WeatherCard'
import RecentSearches  from './components/RecentSearches'
import ErrorMessage    from './components/ErrorMessage'
import { useWeather }  from './hooks/useWeather'

export default function App() {
  const { weather, recentSearches, loading, error, search, loadRecents } = useWeather()

  return (
    <>
      <BackgroundOrbs />
      <Header />

      <main style={{
        position: 'relative', zIndex: 10,
        maxWidth: 860, margin: '0 auto',
        padding: '72px 24px 100px',
        display: 'flex', flexDirection: 'column', gap: 40,
      }}>

        {/* Hero heading */}
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
            color: 'var(--accent)', letterSpacing: '0.22em',
            textTransform: 'uppercase', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              display: 'inline-block', width: 20, height: 1,
              background: 'var(--accent)',
            }} />
            Real-time Weather Intelligence
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            lineHeight: 0.92, letterSpacing: '0.04em',
            color: 'var(--text)',
          }}>
            WHAT'S THE<br />
            <span style={{
              WebkitTextStroke: '1px var(--accent)',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}>
              WEATHER
            </span>
            <span style={{ color: 'var(--accent)' }}> TODAY?</span>
          </h1>
        </div>

        {/* Search */}
        <div>
          <SearchBar onSearch={search} loading={loading} />
          <ErrorMessage message={error} />
        </div>

        {/* Recent searches */}
        <RecentSearches
          searches={recentSearches}
          onSelect={search}
          loadRecents={loadRecents}
        />

        {/* Weather card */}
        <WeatherCard weather={weather} />

      </main>

      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid var(--border)',
        padding: '20px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(20px)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
          color: 'var(--muted)', letterSpacing: '0.1em',
        }}>
          © WEATHER SEARCH — AWS LEARNING PROJECT
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
          color: 'var(--muted)', letterSpacing: '0.1em',
        }}>
          AWS REACT APP
        </span>
      </footer>
    </>
  )
}
