import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useDarkMode } from '../contexts/DarkModeContext'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isMaintenance = user?.role === 'maintenance'
  const isSales = user?.role === 'sales'

  const handleHome = () => {
    const homePath = isMaintenance ? '/maintenance' : '/sales'
    navigate(homePath, { state: { clearFilters: true } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">
                  Maintenance CRM + Sales Report
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={handleHome}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    (isMaintenance && location.pathname === '/maintenance' && !location.pathname.includes('/records') && !location.pathname.includes('/warranty')) ||
                    (isSales && location.pathname === '/sales' && !location.pathname.includes('/summary'))
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </button>
                {isMaintenance && (
                  <>
                    <Link
                      to="/maintenance/warranty"
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                        location.pathname === '/maintenance/warranty'
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Warranty Reports
                    </Link>
                  </>
                )}
                {isSales && (
                  <>
                    <Link
                      to="/sales/summary"
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                        location.pathname === '/sales/summary'
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Summary
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  console.log('Dark mode button clicked, current state:', darkMode)
                  toggleDarkMode()
                }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all border border-gray-200 dark:border-gray-600 cursor-pointer"
                aria-label="Toggle dark mode"
                type="button"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg capitalize border border-gray-200 dark:border-gray-600">
                {user?.role} Role
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-gray-200 dark:border-gray-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

export default Layout
