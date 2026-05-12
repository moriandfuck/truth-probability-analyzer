import { useQuery } from '@tanstack/react-query'

interface NewsItem {
  id: string
  title: string
  url: string
  source: string
  publishedAt?: string
  summary?: string
  image?: string
  hotScore?: number
}

export function useNews() {
  return useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await fetch('/api/news/feed')
      if (!res.ok) throw new Error('Failed to fetch news')
      return res.json()
    },
    staleTime: 300000,
    refetchInterval: 600000,
  })
}
