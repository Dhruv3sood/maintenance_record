import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Record, RecordListResponse, RecordFilters } from '../types'
import RecordFiltersComponent from './RecordFilters'
import ExportButtons from './ExportButtons'

function SalesRecords() {
  const navigate = useNavigate()
  const location = useLocation()
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(50)
  const [filters, setFilters] = useState<RecordFilters>({})

  // Clear filters when navigating from home button
  useEffect(() => {
    if (location.state?.clearFilters) {
      setFilters({})
      setPage(1)
      // Clear the state to avoid clearing on subsequent renders
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.zone) params.append('zone', filters.zone)
      if (filters.capacity_kw) params.append('capacity_kw', filters.capacity_kw)
      if (filters.heater) params.append('heater', filters.heater)
      if (filters.controller) params.append('controller', filters.controller)
      if (filters.card) params.append('card', filters.card)
      if (filters.body) params.append('body', filters.body)
      if (filters.sold_by) params.append('sold_by', filters.sold_by)
      if (filters.lead_source) params.append('lead_source', filters.lead_source)
      if (filters.date_from) params.append('date_from', filters.date_from)
      if (filters.date_to) params.append('date_to', filters.date_to)
      params.append('page', page.toString())
      params.append('page_size', pageSize.toString())

      const response = await api.get<RecordListResponse>(`/sales/records?${params}`)
      setRecords(response.data.records)
      setTotal(response.data.total)
    } catch (error) {
      console.error('Error fetching sales records:', error)
      alert('Failed to load sales records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [page, filters])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="px-4 py-8 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Sales Records</h2>
          <p className="text-sm text-gray-600">View and analyze sales data</p>
        </div>
        <ExportButtons filters={filters} type="sales" />
      </div>

      <RecordFiltersComponent
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters)
          setPage(1)
        }}
        showDateRange={true}
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No records found</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {records.map((record) => (
                <li key={record.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {record.record_id}
                        </p>
                        <p className="ml-2 flex-shrink-0 text-sm text-gray-500">
                          {record.client_name}
                        </p>
                      </div>
                      {record.sale_price && (
                        <div className="ml-2 flex-shrink-0 text-sm font-medium text-gray-900">
                          ₹{record.sale_price.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Zone: {record.zone || 'N/A'}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          Delivery: {format(new Date(record.date_of_delivery), 'MMM dd, yyyy')}
                        </p>
                        {record.sold_by && (
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Sold By: {record.sold_by}
                          </p>
                        )}
                        {record.lead_source && (
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Source: {record.lead_source}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-md">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(page * pageSize, total)}</span> of{' '}
                    <span className="font-medium">{total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          p === page
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SalesRecords
