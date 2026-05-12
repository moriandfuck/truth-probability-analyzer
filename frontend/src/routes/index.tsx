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
          <div className="text-3xl mb-3">🔬</div>
          <h3 className="font-bold text-gray-900 mb-2">Linguistic Analysis</h3>
          <p className="text-sm text-gray-500">
            Detects hedging, overemphasis, distancing language, and 6 categories of deception markers.
          </p>
        </GlassCard>
        <GlassCard>
          <div className="text-3xl mb-3">🧠</div>
          <h3 className="font-bold text-gray-900 mb-2">Deep Reasoning</h3>
          <p className="text-sm text-gray-500">
            DeepSeek-R1 14B performs deep chain-of-thought reasoning for accurate deception judgment.
          </p>
        </GlassCard>
        <GlassCard>
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-bold text-gray-900 mb-2">Visual Reports</h3>
          <p className="text-sm text-gray-500">
            Beautiful score gauge, linguistic breakdown, and shared analysis results.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
