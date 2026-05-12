import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAtom } from 'jotai'
import { useSearchParams } from 'react-router-dom'
import { GlassCard } from '../components/common/GlassCard'
import { LiquidButton } from '../components/common/LiquidButton'
import { ScoreGauge } from '../components/analysis/ScoreGauge'
import { LinguisticBreakdown } from '../components/analysis/LinguisticBreakdown'
import { ReasoningDisplay } from '../components/analysis/ReasoningDisplay'
import { useAnalysis } from '../hooks/useAnalysis'
import { selectedModelAtom, modelNameAtom, historyAtom, type AnalysisResult } from '../atoms'

export function AnalysisPage() {
  const [searchParams] = useSearchParams()
  const [text, setText] = useState('')
  const [model, setModel] = useAtom(selectedModelAtom)
  const [modelName, setModelName] = useAtom(modelNameAtom)
  const [history, setHistory] = useAtom(historyAtom)
  const [activeTab, setActiveTab] = useState<'breakdown' | 'reasoning'>('breakdown')

  const analysis = useAnalysis()

  useEffect(() => {
    const textParam = searchParams.get('text')
    if (textParam) setText(textParam)
  }, [searchParams])

  const handleSubmit = () => {
    if (!text.trim()) return
    analysis.mutate(
      {
        text: text.trim(),
        model,
        model_name_override: modelName || undefined,
      },
      {
        onSuccess: (data) => {
          const result: AnalysisResult = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            text: text.trim(),
            verdict: data.verdict,
            finalScore: data.final_score,
            reasoning: data.reasoning,
            linguisticScore: data.linguistic_analysis.linguistic_score,
            matchDensity: data.linguistic_analysis.match_density,
            modelUsed: data.model_used,
            timestamp: Date.now(),
          }
          setHistory((prev) => [result, ...prev].slice(0, 50))
        },
      }
    )
  }

  const result = analysis.data
  const verdictLabel =
    result?.verdict === 'deceptive' ? 'Likely Deceptive' :
    result?.verdict === 'honest' ? 'Likely Honest' :
    'Uncertain'

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Deception Analysis</h2>

        <GlassCard className="mb-6">
          <textarea
            className="glass-input w-full min-h-32 resize-y"
            placeholder="Enter text to analyze... e.g. 'Honestly, I really didn't take your stuff, I swear this has nothing to do with me'"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
            }}
          />

          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 bg-white/30 rounded-xl p-1">
              {(['local', 'deepseek', 'openai'] as const).map((m) => (
                <button
                  key={m}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    model === m ? 'bg-lime-400 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setModel(m)}
                >
                  {m === 'local' ? 'Local R1' : m === 'deepseek' ? 'DeepSeek API' : 'OpenAI'}
                </button>
              ))}
            </div>

            {model !== 'local' && (
              <input
                className="glass-input py-1.5 px-3 text-sm w-40"
                placeholder="Model name (optional)"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            )}

            <span className="text-xs text-gray-400 ml-auto">Ctrl+Enter to submit</span>
          </div>

          <div className="mt-4">
            <LiquidButton onClick={handleSubmit} loading={analysis.isPending} disabled={!text.trim()}>
              {analysis.isPending ? 'Analyzing...' : 'Analyze'}
            </LiquidButton>
          </div>

          {analysis.isError && (
            <p className="mt-3 text-red-500 text-sm">{analysis.error?.message || 'Error occurred'}</p>
          )}
        </GlassCard>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="mb-6">
                <div className="flex items-center gap-6 flex-wrap">
                  <ScoreGauge score={result.final_score} verdict={result.verdict} />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-2xl font-bold mb-2 ${
                        result.verdict === 'deceptive' ? 'text-red-500' :
                        result.verdict === 'honest' ? 'text-green-600' :
                        'text-yellow-500'
                      }`}
                    >
                      {verdictLabel}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Final Score: {result.final_score}/100 &middot; Linguistic Score: {result.linguistic_analysis.linguistic_score}/100
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Model: {result.model_used} &middot; Time: {result.processing_time_ms}ms
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex gap-4 mb-4 border-b border-gray-200/50 pb-3">
                  {[
                    { key: 'breakdown', label: 'Linguistic Breakdown' },
                    { key: 'reasoning', label: 'AI Reasoning' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      className={`text-sm font-medium pb-1 border-b-2 transition-colors cursor-pointer ${
                        activeTab === key
                          ? 'border-lime-400 text-gray-900'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                      onClick={() => setActiveTab(key as typeof activeTab)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {activeTab === 'breakdown' ? (
                  <LinguisticBreakdown
                    breakdown={result.linguistic_analysis.category_breakdown}
                    density={result.linguistic_analysis.match_density}
                    patterns={result.linguistic_analysis.matched_patterns}
                  />
                ) : (
                  <ReasoningDisplay reasoning={result.reasoning} />
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
