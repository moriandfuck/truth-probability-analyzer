import { useQuery } from '@tanstack/react-query'

interface LLMStatus {
  ollama: {
    available: boolean
    models: string[]
    docker_running: boolean
  }
  deepseek_api: { configured: boolean }
  openai_api: { configured: boolean }
}

export function useLLMStatus() {
  return useQuery<LLMStatus>({
    queryKey: ['llm-status'],
    queryFn: async () => {
      const res = await fetch('/api/llm/status')
      return res.json()
    },
    refetchInterval: 30000,
  })
}
