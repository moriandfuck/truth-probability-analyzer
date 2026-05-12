import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const selectedModelAtom = atomWithStorage<'local' | 'deepseek' | 'openai'>('model', 'local')
export const modelNameAtom = atomWithStorage<string>('modelName', '')
export const darkModeAtom = atomWithStorage<boolean>('darkMode', false)

export interface AnalysisResult {
  id: string
  text: string
  verdict: string
  finalScore: number
  reasoning: string
  linguisticScore: number
  matchDensity: number
  modelUsed: string
  timestamp: number
}

export const historyAtom = atomWithStorage<AnalysisResult[]>('history', [])
