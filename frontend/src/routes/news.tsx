import { motion } from 'framer-motion'
import { GlassCard } from '../components/common/GlassCard'
import { NewsCard } from '../components/news/NewsCard'
import { useNews } from '../hooks/useNews'

export function NewsPage() {
  const { data: news, isLoading, isError } = useNews()

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending News</h2>
        <p className="text-gray-500 mb-8">Click any news card to read full article, or click "Analyze this" to check its truth probability.</p>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <GlassCard key={i}>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {isError && (
          <GlassCard>
            <div className="py-12 text-center text-gray-400">
              <p className="text-lg mb-2">News server is not available</p>
              <p className="text-sm">
                The NewsNow aggregation service needs to be running. Start it with{' '}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">docker compose up -d newsnow</code>
              </p>
            </div>
          </GlassCard>
        )}

        {news && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NewsCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
