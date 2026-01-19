import { RecordFilters } from '../types'

interface ExportButtonsProps {
  filters: RecordFilters
  type: 'records' | 'sales'
}

function ExportButtons({ filters, type }: ExportButtonsProps) {
  const buildExportUrl = (format: string) => {
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

    const token = localStorage.getItem('token')
    const baseUrl = import.meta.env.VITE_API_URL || '/api'
    const url = `${baseUrl}/export/${type}.${format}?${params}`
    
    return { url, token }
  }

  const handleExport = async (format: string) => {
    const { url, token } = buildExportUrl(format)
    
    try {
      // Use fetch with auth headers for downloads
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Export failed')
      }
      
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${type}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export. Please try again.')
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport('csv')}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Export CSV
      </button>
      <button
        onClick={() => handleExport('xlsx')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Export Excel
      </button>
      <button
        onClick={() => handleExport('pdf')}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Export PDF
      </button>
    </div>
  )
}

export default ExportButtons
