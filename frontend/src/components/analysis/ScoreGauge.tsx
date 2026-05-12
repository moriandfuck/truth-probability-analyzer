import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ScoreGaugeProps {
  score: number
  verdict: string
}

export function ScoreGauge({ score, verdict }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const duration = 1500
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(score * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [score])

  const circumference = 2 * Math.PI * 54
  const offset = circumference * (1 - displayScore / 100)

  const color =
    verdict === 'deceptive' ? '#ef4444' :
    verdict === 'honest' ? '#22c55e' :
    '#eab308'

  return (
    <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
      <svg viewBox="0 0 128 128" className="transform -rotate-90">
        <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="10" />
        <motion.circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-gray-900">{displayScore}</span>
        <span className="text-xs text-gray-400">/100</span>
      </div>
    </div>
  )
}
