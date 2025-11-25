import React from 'react'

export default function Logo({ className = 'w-12 h-12' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Santa Cruz Bike Adventures logo"
    >
      <defs>
        <linearGradient id="lg1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
      </defs>

      {/* background circle */}
      <circle cx="32" cy="32" r="30" fill="url(#lg1)" />

      {/* subtle horizon wave */}
      <path
        d="M6 38c6-6 12-6 18 0s12 6 18 0 12-6 18 0"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* bike wheels */}
      <circle cx="20" cy="40" r="6" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="44" cy="40" r="6" fill="none" stroke="#fff" strokeWidth="1.8" />

      {/* bike frame (simple) */}
      <path
        d="M20 40 L28 32 L36 36 L44 40 M28 32 L34 24"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* handlebar */}
      <path d="M36 36 L38 30" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />

      {/* small accent star */}
      <circle cx="52" cy="14" r="2" fill="rgba(255,255,255,0.9)" />
    </svg>
  )
}
