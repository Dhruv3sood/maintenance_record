import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { Record, RecordCreate, RecordUpdate } from '../types'

function RecordForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RecordCreate | RecordUpdate>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit && id) {
      api.get<Record>(`/records/${id}`)
        .then((response) => {
          const record = response.data
          reset({
            record_id: record.record_id,
            date_of_delivery: record.date_of_delivery ? record.date_of_delivery.split('T')[0] : '',
            date_of_installation: record.date_of_installation ? record.date_of_installation.split('T')[0] : '',
            date_of_site_visit: record.date_of_site_visit ? record.date_of_site_visit.split('T')[0] + 'T' + record.date_of_site_visit.split('T')[1].split('.')[0] : '',
            site_visit_done_by: record.site_visit_done_by,
            installation_done_by: record.installation_done_by,
            commission_done_by: record.commission_done_by,
            capacity_kw: record.capacity_kw,
            heater: record.heater,
            controller: record.controller,
            card: record.card,
            body: record.body,
            client_name: record.client_name,
            client_phone: record.client_phone,
            client_address: record.client_address,
            zone: record.zone,
            sale_price: record.sale_price,
            sold_by: record.sold_by,
            lead_source: record.lead_source,
            remarks: record.remarks,
          })
        })
        .catch((err) => {
          console.error('Error loading record:', err)
          setError('Failed to load record')
        })
    }
  }, [id, isEdit, reset])

  const onSubmit = async (data: RecordCreate | RecordUpdate) => {
    setLoading(true)
    setError('')

    try {
      // Convert date strings to ISO format (date only for delivery and installation)
      const formattedData = {
        ...data,
        date_of_delivery: data.date_of_delivery ? data.date_of_delivery : undefined,
        date_of_installation: data.date_of_installation ? data.date_of_installation : undefined,
        date_of_site_visit: data.date_of_site_visit ? new Date(data.date_of_site_visit).toISOString() : undefined,
      }

      if (isEdit && id) {
        await api.patch(`/records/${id}`, formattedData)
      } else {
        await api.post('/records', formattedData)
      }
      navigate('/maintenance')
    } catch (err: any) {
      console.error('Error saving record:', err)
      setError(err.response?.data?.detail || 'Failed to save record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            {isEdit ? 'Edit Record' : 'Create New Record'}
          </h2>
          <p className="text-sm text-gray-600">
            {isEdit ? 'Update record information' : 'Add a new maintenance record'}
          </p>
        </div>
        <Link
          to="/maintenance"
          className="text-gray-600 hover:text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
        >
          ← Back to Records
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-800 px-5 py-4 rounded-xl shadow-sm">
          <div className="text-sm font-semibold">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID/Meta Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b-2 border-primary-500">ID / Meta</h3>
          </div>
          {!isEdit && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Record ID (leave blank to auto-generate)
              </label>
              <input
                type="text"
                {...register('record_id')}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                placeholder="RMZ-000001"
              />
            </div>
          )}

          {/* Dates/Work Section */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b-2 border-primary-500">Dates / Work</h3>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date of Delivery <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('date_of_delivery', { required: 'Date of delivery is required' })}
              className={`w-full px-4 py-2.5 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm ${
                errors.date_of_delivery ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.date_of_delivery && (
              <p className="mt-1 text-sm text-red-600">{errors.date_of_delivery.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date of Installation
            </label>
            <input
              type="date"
              {...register('date_of_installation')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date of Site Visit
            </label>
            <input
              type="datetime-local"
              {...register('date_of_site_visit')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Site Visit Done By
            </label>
            <input
              type="text"
              {...register('site_visit_done_by')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Installation Done By
            </label>
            <input
              type="text"
              {...register('installation_done_by')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Commission Done By
            </label>
            <input
              type="text"
              {...register('commission_done_by')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>

          {/* Machine Section */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b-2 border-primary-500">Machine</h3>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Capacity (KW)
            </label>
            <input
              type="text"
              {...register('capacity_kw')}
              placeholder="6, 9, etc."
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Heater
            </label>
            <select
              {...register('heater')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            >
              <option value="">Select heater</option>
              <option value="Kunal">Kunal</option>
              <option value="Luxmi">Luxmi</option>
              <option value="Dovy">Dovy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Controller
            </label>
            <select
              {...register('controller')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            >
              <option value="">Select controller</option>
              <option value="6-button">6-button</option>
              <option value="3-button">3-button</option>
              <option value="touch">touch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Card
            </label>
            <select
              {...register('card')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            >
              <option value="">Select card</option>
              <option value="3-button">3-button</option>
              <option value="6-button">6-button</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Body
            </label>
            <select
              {...register('body')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            >
              <option value="">Select body</option>
              <option value="MS">MS</option>
              <option value="SS">SS</option>
            </select>
          </div>

          {/* Client Section */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b-2 border-primary-500">Client</h3>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('client_name', { required: 'Client name is required' })}
              className={`w-full px-4 py-2.5 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm ${
                errors.client_name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.client_name && (
              <p className="mt-1 text-sm text-red-600">{errors.client_name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Client Phone
            </label>
            <input
              type="text"
              {...register('client_phone')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Zone
            </label>
            <input
              type="text"
              {...register('zone')}
              placeholder="Delhi, GGN, etc."
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Client Address
            </label>
            <textarea
              {...register('client_address')}
              rows={3}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>

          {/* Commercial Section */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b-2 border-primary-500">Commercial</h3>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sale Price
            </label>
            <input
              type="number"
              step="0.01"
              {...register('sale_price', { valueAsNumber: true })}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sold By
            </label>
            <input
              type="text"
              {...register('sold_by')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lead Source
            </label>
            <input
              type="text"
              {...register('lead_source')}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>

          {/* Other Section */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b-2 border-primary-500">Other</h3>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              {...register('remarks')}
              rows={4}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            to="/maintenance"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Record' : 'Create Record'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RecordForm
