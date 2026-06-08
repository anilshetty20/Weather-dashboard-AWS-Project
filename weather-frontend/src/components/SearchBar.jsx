import React, { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  function handleSubmit() {
    if (!loading) onSearch(value)
  }

  return (
    <div style={{
      display: 'flex', gap: 0,
      border: `1px solid ${focused ? 'var(--accent)' : 'var(--border-2)'}`,
      borderRadius: 4,
      background: 'var(--surface)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: focused ? '0 0 0 3px rgba(200,241,53,0.08)' : 'none',
      overflow: 'hidden',
    }}>
      {/* Search icon */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        color: focused ? 'var(--accent)' : 'var(--muted)',
        fontSize: '1rem', transition: 'color 0.2s',
        borderRight: '1px solid var(--border)',
      }}>
        ⌕
      </div>

      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search any city in the world..."
        autoComplete="off"
        style={{
          flex: 1, background: 'transparent',
          border: 'none', outline: 'none',
          color: 'var(--text)', fontFamily: 'var(--font-body)',
          fontSize: '1rem', padding: '16px 20px',
          letterSpacing: '0.02em',
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: loading ? 'rgba(200,241,53,0.4)' : 'var(--accent)',
          color: '#0a0a0f', border: 'none',
          fontFamily: 'var(--font-display)',
          fontSize: '1rem', letterSpacing: '0.1em',
          padding: '0 32px', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'background 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        {loading
          ? <span style={{
              width: 16, height: 16,
              border: '2px solid rgba(0,0,0,0.2)',
              borderTopColor: '#0a0a0f',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
              display: 'inline-block',
            }} />
          : 'GET WEATHER'
        }
      </button>
    </div>
  )
}
