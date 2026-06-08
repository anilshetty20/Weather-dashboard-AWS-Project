import React from 'react'

export default function BackgroundOrbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Large teal orb top left */}
      <div style={{
        position: 'absolute', width: 700, height: 700,
        borderRadius: '50%', top: -200, left: -200,
        background: 'radial-gradient(circle, rgba(53,241,200,0.12) 0%, transparent 70%)',
        animation: 'drift 16s ease-in-out infinite alternate',
      }} />
      {/* Lime orb top right */}
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%', top: -100, right: -150,
        background: 'radial-gradient(circle, rgba(200,241,53,0.1) 0%, transparent 70%)',
        animation: 'drift 12s ease-in-out infinite alternate-reverse',
      }} />
      {/* Small accent bottom center */}
      <div style={{
        position: 'absolute', width: 300, height: 300,
        borderRadius: '50%', bottom: '10%', left: '40%',
        background: 'radial-gradient(circle, rgba(53,241,200,0.07) 0%, transparent 70%)',
        animation: 'drift 20s ease-in-out infinite alternate',
      }} />
      {/* Grid lines overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
    </div>
  )
}
