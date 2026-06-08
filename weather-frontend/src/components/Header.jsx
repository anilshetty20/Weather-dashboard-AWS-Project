import React from 'react'

export default function Header() {
  return (
    <header style={{
      position: 'relative', zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 48px',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(10,10,15,0.8)',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Logo mark */}
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>
          ⬡
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.6rem', letterSpacing: '0.08em',
          color: 'var(--text)',
        }}>
          SKYWATCH
        </span>
      </div>

      {/* Status pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--surface-2)',
        border: '1px solid var(--border-2)',
        borderRadius: 100, padding: '6px 14px',
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        color: 'var(--accent)',
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 6px var(--accent)',
          animation: 'pulse-ring 2s ease-out infinite',
          display: 'inline-block',
        }} />
        LIVE DATA
      </div>
    </header>
  )
}
