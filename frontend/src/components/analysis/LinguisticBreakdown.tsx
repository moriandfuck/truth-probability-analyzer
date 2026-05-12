import { motion } from 'framer-motion'

interface BreakdownItem {
  category: string
  matches: string[]
  score_contribution: number
}

interface LinguisticBreakdownProps {
  breakdown: BreakdownItem[]
  density: number
  patterns: Record<string, string[]>
}

export function LinguisticBreakdown({ breakdown, density, patterns }: LinguisticBreakdownProps) {
  if (breakdown.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">
        <p className="text-lg mb-2">No linguistic markers detected</p>
        <p className="text-sm">The text appears to be straightforward with no obvious deception patterns.</p>
      </div>
    )
  }

  const colors = ['#B9F500', '#8BC34A', '#689f38', '#f59e0b', '#f97316', '#ef4444']

  return (
    <div>
      <div className="mb-4 text-sm text-gray-500">
        Match density: <span className="font-semibold text-gray-700">{(density * 100).toFixed(1)}%</span>
      </div>
      <div className="space-y-3">
        {breakdown.map((item, i) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{item.category}</span>
              <span className="text-xs text-gray-400">+{item.score_contribution.toFixed(1)}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((item.score_contribution / 25) * 100, 100)}%` }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.matches.map((w) => (
                <span
                  key={w}
                  className="text-xs px-2 py-0.5 rounded-full bg-lime-100 text-lime-800"
                >
                  {w}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
