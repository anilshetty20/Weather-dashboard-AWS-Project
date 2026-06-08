import React from 'react'

export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div style={{
      marginTop: 12,
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(255,107,107,0.06)',
      border: '1px solid rgba(255,107,107,0.2)',
      borderLeft: '3px solid var(--danger)',
      borderRadius: 2,
      padding: '12px 16px',
      fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
      color: 'var(--danger)', letterSpacing: '0.04em',
    }}>
      <span>⚠</span>
      <span>{message}</span>
    </div>
  )
}
