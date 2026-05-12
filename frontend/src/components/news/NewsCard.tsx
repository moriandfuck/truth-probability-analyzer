import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface NewsItem {
  id: string
  title: string
  url: string
  source: string
  publishedAt?: string
  summary?: string
  hotScore?: number
}

interface NewsCardProps {
  item: NewsItem
}

export function NewsCard({ item }: NewsCardProps) {
  const navigate = useNavigate()

  const handleAnalyze = () => {
    const text = item.title + (item.summary ? '\n\n' + item.summary : '')
    navigate(`/analyze?text=${encodeURIComponent(text)}`)
  }

  return (
    <motion.div
      className="glass p-5 cursor-pointer"
      whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
      onClick={() => window.open(item.url, '_blank')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">
            {item.title}
          </h4>
          {item.summary && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.summary}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="px-2 py-0.5 rounded-full bg-lime-100 text-lime-700 font-medium">
              {item.source}
            </span>
            {item.hotScore && (
              <span>🔥 {item.hotScore}</span>
            )}
            {item.publishedAt && (
              <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      <button
        className="mt-3 w-full py-1.5 text-xs font-medium text-lime-700 bg-lime-50 hover:bg-lime-100 rounded-lg transition-colors cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          handleAnalyze()
        }}
      >
        Analyze this →
      </button>
    </motion.div>
  )
}
