import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GlassCard } from '../components/common/GlassCard'
import { LiquidButton } from '../components/common/LiquidButton'

export function HomePage() {
  return (
    <div className="flex flex-col items-center pt-16">
      <motion.div
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight">
          <span className="text-gray-900">Truth </span>
          <span style={{ color: 'var(--lime-dark)' }}>Probability</span>
          <span className="text-gray-900"> Analyzer</span>
        </h1>
        <p className="text-xl text-gray-500 mb-12 leading-relaxed">
          AI-powered linguistic deception detection.
          <br />
          Powered by DeepSeek-R1 deep reasoning engine.
        </p>
        <Link to="/analyze">
          <LiquidButton variant="primary" className="text-lg px-10 py-4">
            Start Analysis →
          </LiquidButton>
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <GlassCard>
          <div className="w-10 h-10 rounded-xl bg-lime-100 mb-3 flex items-center justify-center">
            <svg className="w-5 h-5 text-lime-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Linguistic Analysis</h3>
          <p className="text-sm text-gray-500">
            Detects hedging, overemphasis, distancing language, and 6 categories of deception markers.
          </p>
        </GlassCard>
        <GlassCard>
          <div className="w-10 h-10 rounded-xl bg-lime-100 mb-3 flex items-center justify-center">
            <svg className="w-5 h-5 text-lime-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 6v4l3 2"/><circle cx="12" cy="12" r="1"/></svg>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Deep Reasoning</h3>
          <p className="text-sm text-gray-500">
            DeepSeek-R1 7B performs deep chain-of-thought reasoning for accurate deception judgment.
          </p>
        </GlassCard>
        <GlassCard>
          <div className="w-10 h-10 rounded-xl bg-lime-100 mb-3 flex items-center justify-center">
            <svg className="w-5 h-5 text-lime-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Visual Reports</h3>
          <p className="text-sm text-gray-500">
            Beautiful score gauge, linguistic breakdown, and shared analysis results.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
