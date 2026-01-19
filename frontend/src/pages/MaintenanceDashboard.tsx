import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import RecordsList from '../components/RecordsList'
import RecordForm from '../components/RecordForm'
import WarrantyReports from '../components/WarrantyReports'
import { useAuth } from '../contexts/AuthContext'

function MaintenanceDashboard() {
  const { user } = useAuth()

  if (user?.role !== 'maintenance') {
    return <Navigate to="/login" replace />
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<RecordsList />} />
        <Route path="records/new" element={<RecordForm />} />
        <Route path="records/:id/edit" element={<RecordForm />} />
        <Route path="warranty" element={<WarrantyReports />} />
      </Routes>
    </Layout>
  )
}

export default MaintenanceDashboard
