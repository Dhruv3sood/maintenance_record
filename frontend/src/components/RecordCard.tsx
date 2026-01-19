import { useState } from 'react'
import { format } from 'date-fns'
import { Record } from '../types'
import RecordDetailModal from './RecordDetailModal'

interface RecordCardProps {
  record: Record
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

function RecordCard({ record, onDelete, onEdit }: RecordCardProps) {
  const [showModal, setShowModal] = useState(false)

  const calculateWarrantyStatus = () => {
    if (!record.date_of_delivery) return { status: 'out_of_warranty', daysRemaining: 0 }
    
    const delivery = new Date(record.date_of_delivery)
    const expiry = new Date(delivery)
    expiry.setFullYear(expiry.getFullYear() + 1)
    const today = new Date()
    const daysRemaining = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysRemaining < 0) return { status: 'out_of_warranty', expiry, daysRemaining: Math.abs(daysRemaining) }
    if (daysRemaining <= 30) return { status: 'expiring_soon', expiry, daysRemaining }
    return { status: 'in_warranty', expiry, daysRemaining }
  }

  const warranty = calculateWarrantyStatus()

  const getWarrantyBadge = () => {
    if (warranty.status === 'out_of_warranty') {
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700">Out of Warranty</span>
    }
    if (warranty.status === 'expiring_soon') {
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700">Expiring Soon ({warranty.daysRemaining}d)</span>
    }
    return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">In Warranty ({warranty.daysRemaining}d)</span>
  }

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:-translate-y-1"
      >
        <div className="p-6">
          {/* Header - Client Name First */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">{record.client_name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{record.record_id}</p>
              </div>
              <div className="ml-3 flex-shrink-0">
                {getWarrantyBadge()}
              </div>
            </div>
            
            {/* Address */}
            {record.client_address && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{record.client_address}</p>
                {record.client_phone && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{record.client_phone}</p>
                )}
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Zone</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{record.zone || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Delivery</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {format(new Date(record.date_of_delivery), 'MMM dd, yyyy')}
              </p>
            </div>
            {record.capacity_kw && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Capacity</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{record.capacity_kw} KW</p>
              </div>
            )}
            {record.sale_price && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price</p>
                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">₹{record.sale_price.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {(record.heater || record.controller || record.body) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {record.heater && (
                <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-700">
                  {record.heater}
                </span>
              )}
              {record.controller && (
                <span className="px-2.5 py-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md border border-purple-200 dark:border-purple-700">
                  {record.controller}
                </span>
              )}
              {record.body && (
                <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md border border-gray-300 dark:border-gray-600">
                  {record.body}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowModal(true)
              }}
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              View Details
            </button>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(record.id)
                }}
                className="px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 border border-primary-300 dark:border-primary-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Are you sure you want to delete this record?')) {
                    onDelete(record.id)
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <RecordDetailModal 
        record={record} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  )
}

export default RecordCard
