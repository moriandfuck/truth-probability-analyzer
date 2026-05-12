import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({ children, className = '', hover = true, onClick }: GlassCardProps) {
  return (
    <motion.div
      className={`glass ${className}`}
      style={{ padding: '24px' }}
      whileHover={hover ? { y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' } : undefined}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
