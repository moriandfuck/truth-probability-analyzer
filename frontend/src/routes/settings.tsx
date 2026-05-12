import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '../components/common/GlassCard'
import { LiquidButton } from '../components/common/LiquidButton'
import { useApiKeys } from '../hooks/useApiKeys'
import { useLLMStatus } from '../hooks/useLLMStatus'

export function SettingsPage() {
  const { keysQuery, setKeyMutation, deleteKeyMutation } = useApiKeys()
  const { data: llmStatus } = useLLMStatus()
  const [deepseekKey, setDeepseekKey] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')

  const maskedKeys = keysQuery.data || {}

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Settings</h2>

        {/* LLM Status */}
        <GlassCard className="mb-6">
          <h3 className="font-bold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <StatusRow
              label="Ollama (Local)"
              status={llmStatus?.ollama?.available ? 'connected' : 'disconnected'}
              detail={llmStatus?.ollama?.available ? `Models: ${llmStatus.ollama.models.join(', ') || 'N/A'}` : 'Docker ollama container not running'}
            />
            <StatusRow
              label="DeepSeek API"
              status={llmStatus?.deepseek_api?.configured || !!maskedKeys['deepseek'] ? 'connected' : 'disconnected'}
              detail={maskedKeys['deepseek'] ? `Key: ${maskedKeys['deepseek']}` : 'Not configured'}
            />
            <StatusRow
              label="OpenAI API"
              status={llmStatus?.openai_api?.configured || !!maskedKeys['openai'] ? 'connected' : 'disconnected'}
              detail={maskedKeys['openai'] ? `Key: ${maskedKeys['openai']}` : 'Not configured'}
            />
          </div>
        </GlassCard>

        {/* API Keys */}
        <GlassCard className="mb-6">
          <h3 className="font-bold text-gray-900 mb-4">API Keys</h3>
          <p className="text-sm text-gray-500 mb-4">
            Keys are encrypted at rest. They can also be set via environment variables: <code className="bg-gray-100 px-1 rounded text-xs">DEEPSEEK_API_KEY</code>, <code className="bg-gray-100 px-1 rounded text-xs">OPENAI_API_KEY</code>
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">DeepSeek API Key</label>
              <div className="flex gap-2 mt-1">
                <input
                  className="glass-input flex-1 py-2"
                  type="password"
                  placeholder={maskedKeys['deepseek'] ? maskedKeys['deepseek'] : 'sk-...'}
                  value={deepseekKey}
                  onChange={(e) => setDeepseekKey(e.target.value)}
                />
                <LiquidButton
                  variant="secondary"
                  className="text-sm px-4 py-2"
                  onClick={() => {
                    if (deepseekKey) setKeyMutation.mutate({ provider: 'deepseek', key: deepseekKey })
                    setDeepseekKey('')
                  }}
                  loading={setKeyMutation.isPending}
                >
                  Save
                </LiquidButton>
                {maskedKeys['deepseek'] && (
                  <button
                    className="px-3 py-2 text-sm text-red-400 hover:text-red-600 cursor-pointer"
                    onClick={() => deleteKeyMutation.mutate('deepseek')}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">OpenAI API Key</label>
              <div className="flex gap-2 mt-1">
                <input
                  className="glass-input flex-1 py-2"
                  type="password"
                  placeholder={maskedKeys['openai'] ? maskedKeys['openai'] : 'sk-...'}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                />
                <LiquidButton
                  variant="secondary"
                  className="text-sm px-4 py-2"
                  onClick={() => {
                    if (openaiKey) setKeyMutation.mutate({ provider: 'openai', key: openaiKey })
                    setOpenaiKey('')
                  }}
                  loading={setKeyMutation.isPending}
                >
                  Save
                </LiquidButton>
                {maskedKeys['openai'] && (
                  <button
                    className="px-3 py-2 text-sm text-red-400 hover:text-red-600 cursor-pointer"
                    onClick={() => deleteKeyMutation.mutate('openai')}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

function StatusRow({ label, status, detail }: { label: string; status: string; detail: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          status === 'connected' ? 'bg-lime-400 shadow-[0_0_6px_rgba(185,245,0,0.6)]' : 'bg-gray-300'
        }`}
      />
      <div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-400 ml-2">{detail}</span>
      </div>
    </div>
  )
}
