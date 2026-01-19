import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DarkModeProvider } from './contexts/DarkModeContext'
import Login from './pages/Login'
import MaintenanceDashboard from './pages/MaintenanceDashboard'
import SalesDashboard from './pages/SalesDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/maintenance/*"
        element={
          <ProtectedRoute allowedRole="maintenance">
            <MaintenanceDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales/*"
        element={
          <ProtectedRoute allowedRole="sales">
            <SalesDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          user ? (
            user.role === 'maintenance' ? (
              <Navigate to="/maintenance" replace />
            ) : (
              <Navigate to="/sales" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  )
}

export default App
