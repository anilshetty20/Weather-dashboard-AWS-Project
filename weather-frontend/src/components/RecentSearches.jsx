import React, { useEffect } from 'react'

function RecentTag({ city, onSelect }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <button
      onClick={() => onSelect(city)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--accent)' : 'transparent',
        color: hovered ? '#0a0a0f' : 'var(--muted-2)',
        border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border-2)'}`,
        borderRadius: 2,
        padding: '6px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontWeight: hovered ? 700 : 400,
      }}
    >
      {city}
    </button>
  )
}

export default function RecentSearches({ searches, onSelect, loadRecents }) {
  useEffect(() => { loadRecents() }, [loadRecents])
  if (!searches.length) return null

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 14,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          color: 'var(--muted)', textTransform: 'uppercase',
          letterSpacing: '0.16em',
        }}>
          Recent
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {searches.map((s, i) => (
          <RecentTag key={`${s.city}-${i}`} city={s.city} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
