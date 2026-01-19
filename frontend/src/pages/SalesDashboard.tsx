import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import SalesRecords from '../components/SalesRecords'
import SalesSummary from '../components/SalesSummary'
import { useAuth } from '../contexts/AuthContext'

function SalesDashboard() {
  const { user } = useAuth()

  if (user?.role !== 'sales') {
    return <Navigate to="/login" replace />
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<SalesRecords />} />
        <Route path="summary" element={<SalesSummary />} />
      </Routes>
    </Layout>
  )
}

export default SalesDashboard
