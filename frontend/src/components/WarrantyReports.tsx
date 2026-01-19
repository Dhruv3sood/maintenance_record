import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import api from '../services/api'
import { Record, RecordListResponse, WarrantySummary } from '../types'

function WarrantyReports() {
  const [summary, setSummary] = useState<WarrantySummary | null>(null)
  const [outOfWarranty, setOutOfWarranty] = useState<Record[]>([])
  const [expiringSoon, setExpiringSoon] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'summary' | 'out' | 'expiring'>('summary')
  const [days, setDays] = useState(30)
  const [outPage, setOutPage] = useState(1)
  const [expiringPage, setExpiringPage] = useState(1)
  const [outTotal, setOutTotal] = useState(0)
  const [expiringTotal, setExpiringTotal] = useState(0)
  const pageSize = 50

  useEffect(() => {
    fetchSummary()
  }, [days])

  useEffect(() => {
    if (activeTab === 'out') {
      fetchOutOfWarranty()
    } else if (activeTab === 'expiring') {
      fetchExpiringSoon()
    }
  }, [activeTab, days, outPage, expiringPage])

  const fetchSummary = async () => {
    try {
      const response = await api.get<WarrantySummary>(`/records/warranty/summary?days=${days}`)
      setSummary(response.data)
    } catch (error) {
      console.error('Error fetching warranty summary:', error)
      alert('Failed to load warranty summary')
    } finally {
      setLoading(false)
    }
  }

  const fetchOutOfWarranty = async () => {
    try {
      const response = await api.get<RecordListResponse>(
        `/records/warranty/out-of-warranty?page=${outPage}&page_size=${pageSize}`
      )
      setOutOfWarranty(response.data.records)
      setOutTotal(response.data.total)
    } catch (error) {
      console.error('Error fetching out of warranty records:', error)
      alert('Failed to load out of warranty records')
    }
  }

  const fetchExpiringSoon = async () => {
    try {
      const response = await api.get<RecordListResponse>(
        `/records/warranty/expiring-soon?days=${days}&page=${expiringPage}&page_size=${pageSize}`
      )
      setExpiringSoon(response.data.records)
      setExpiringTotal(response.data.total)
    } catch (error) {
      console.error('Error fetching expiring soon records:', error)
      alert('Failed to load expiring soon records')
    }
  }

  const calculateWarrantyExpiry = (deliveryDate: string) => {
    const delivery = new Date(deliveryDate)
    const expiry = new Date(delivery)
    expiry.setFullYear(expiry.getFullYear() + 1)
    return expiry
  }

  const getWarrantyStatus = (deliveryDate: string) => {
    const expiry = calculateWarrantyExpiry(deliveryDate)
    const today = new Date()
    const daysRemaining = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysRemaining < 0) {
      return { status: 'out_of_warranty', daysRemaining, expiry }
    } else if (daysRemaining <= days) {
      return { status: 'expiring_soon', daysRemaining, expiry }
    } else {
      return { status: 'in_warranty', daysRemaining, expiry }
    }
  }

  if (loading && !summary) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Warranty Reports</h2>
          <p className="text-sm text-gray-600">Track warranty status and expiring records</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Expiring Soon Days:
            <input
              type="number"
              value={days}
              onChange={(e) => {
                setDays(Number(e.target.value))
                setActiveTab('summary')
              }}
              min="1"
              max="365"
              className="ml-2 px-2 py-1 border border-gray-300 rounded-md w-20"
            />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'summary'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('out')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'out'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Out of Warranty ({outTotal})
          </button>
          <button
            onClick={() => setActiveTab('expiring')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'expiring'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Expiring Soon ({expiringTotal})
          </button>
        </nav>
      </div>

      {/* Summary Tab */}
      {activeTab === 'summary' && summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Warranty</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{summary.in_warranty}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">!</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Expiring Soon</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{summary.expiring_soon}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                    <span className="text-red-600 font-bold">×</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Out of Warranty</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{summary.out_of_warranty}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-blue-600 font-bold">#</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{summary.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Out of Warranty Tab */}
      {activeTab === 'out' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {outOfWarranty.map((record) => {
              const { expiry } = getWarrantyStatus(record.date_of_delivery)
              return (
                <li key={record.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-primary-600">{record.record_id}</p>
                      <p className="ml-2 text-sm text-gray-500">{record.client_name}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Expired: {format(expiry, 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Zone: {record.zone || 'N/A'} | Delivery: {format(new Date(record.date_of_delivery), 'MMM dd, yyyy')}
                  </div>
                </li>
              )
            })}
          </ul>
          {Math.ceil(outTotal / pageSize) > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <button
                onClick={() => setOutPage(Math.max(1, outPage - 1))}
                disabled={outPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {outPage} of {Math.ceil(outTotal / pageSize)}
              </span>
              <button
                onClick={() => setOutPage(Math.min(Math.ceil(outTotal / pageSize), outPage + 1))}
                disabled={outPage >= Math.ceil(outTotal / pageSize)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expiring Soon Tab */}
      {activeTab === 'expiring' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {expiringSoon.map((record) => {
              const { expiry, daysRemaining } = getWarrantyStatus(record.date_of_delivery)
              return (
                <li key={record.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-primary-600">{record.record_id}</p>
                      <p className="ml-2 text-sm text-gray-500">{record.client_name}</p>
                    </div>
                    <div className="text-sm text-yellow-600 font-medium">
                      {daysRemaining} days remaining
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Zone: {record.zone || 'N/A'} | Expires: {format(expiry, 'MMM dd, yyyy')}
                  </div>
                </li>
              )
            })}
          </ul>
          {Math.ceil(expiringTotal / pageSize) > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <button
                onClick={() => setExpiringPage(Math.max(1, expiringPage - 1))}
                disabled={expiringPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {expiringPage} of {Math.ceil(expiringTotal / pageSize)}
              </span>
              <button
                onClick={() => setExpiringPage(Math.min(Math.ceil(expiringTotal / pageSize), expiringPage + 1))}
                disabled={expiringPage >= Math.ceil(expiringTotal / pageSize)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WarrantyReports
