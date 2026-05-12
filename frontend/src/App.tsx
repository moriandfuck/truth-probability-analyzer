import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { LiquidBackground } from './components/common/LiquidBackground'
import { HomePage } from './routes/index'
import { AnalysisPage } from './routes/analyze'
import { NewsPage } from './routes/news'
import { SettingsPage } from './routes/settings'

export default function App() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
      <LiquidBackground />
      <Header />
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalysisPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}
