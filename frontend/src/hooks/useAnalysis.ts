import { useMutation } from '@tanstack/react-query'

interface AnalyzeRequest {
  text: string
  model: 'local' | 'deepseek' | 'openai'
  model_name_override?: string
}

interface LinguisticDetail {
  category: string
  matches: string[]
  score_contribution: number
}

interface AnalyzeResponse {
  verdict: string
  final_score: number
  reasoning: string
  linguistic_analysis: {
    linguistic_score: number
    match_density: number
    matched_patterns: Record<string, string[]>
    category_breakdown: LinguisticDetail[]
  }
  model_used: string
  processing_time_ms: number
}

export function useAnalysis() {
  return useMutation<AnalyzeResponse, Error, AnalyzeRequest>({
    mutationFn: async (req) => {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(err.detail || 'Analysis failed')
      }
      return res.json()
    },
  })
}
