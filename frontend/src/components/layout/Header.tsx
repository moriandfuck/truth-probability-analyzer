import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/analyze', label: 'Analyze' },
  { path: '/news', label: 'News' },
  { path: '/settings', label: 'Settings' },
]

export function Header() {
  const location = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '0 24px' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'var(--lime)' }}>
            T
          </span>
          <span className="font-bold text-gray-900 text-lg">Truth Analyzer</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ path, label }) => {
            const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
            return (
              <Link key={path} to={path} className="no-underline">
                <motion.div
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-lime-200/60 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
