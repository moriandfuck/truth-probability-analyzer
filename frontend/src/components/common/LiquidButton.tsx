import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface LiquidButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
  variant?: 'primary' | 'secondary'
}

export function LiquidButton({
  children,
  onClick,
  disabled,
  loading,
  className = '',
  variant = 'primary',
}: LiquidButtonProps) {
  const base = variant === 'primary'
    ? 'bg-lime-400 text-gray-900 shadow-[0_4px_16px_rgba(185,245,0,0.3)]'
    : 'bg-white/60 text-gray-700 border border-white/40'

  return (
    <motion.button
      className={`relative overflow-hidden font-semibold px-8 py-3 rounded-2xl transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${base} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 bg-lime-300/50"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {loading && (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </span>
    </motion.button>
  )
}
