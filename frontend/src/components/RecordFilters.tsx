import { useState, useEffect, useRef } from 'react'
import { RecordFilters as RecordFiltersType } from '../types'
import api from '../services/api'

interface RecordFiltersProps {
  filters: RecordFiltersType
  onFiltersChange: (filters: RecordFiltersType) => void
  showDateRange?: boolean
}

interface FilterOptions {
  zones: string[]
  capacity_kw: string[]
  heaters: string[]
  controllers: string[]
  cards: string[]
  bodies: string[]
  sold_by: string[]
  lead_sources: string[]
}

function RecordFiltersComponent({ filters, onFiltersChange, showDateRange = false }: RecordFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<RecordFiltersType>(filters)
  const searchDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    zones: [],
    capacity_kw: [],
    heaters: [],
    controllers: [],
    cards: [],
    bodies: [],
    sold_by: [],
    lead_sources: []
  })
  const [loadingOptions, setLoadingOptions] = useState(true)

  useEffect(() => {
    // Sync localFilters with parent filters when they change externally
    setLocalFilters(filters)
  }, [filters])

  useEffect(() => {
    // Fetch filter options from API
    const fetchFilterOptions = async () => {
      try {
        const response = await api.get('/filters/options')
        setFilterOptions(response.data)
      } catch (error) {
        console.error('Error fetching filter options:', error)
      } finally {
        setLoadingOptions(false)
      }
    }
    fetchFilterOptions()
  }, [])

  // Debounced search - applies after user stops typing for 500ms
  const handleSearchChange = (value: string) => {
    const newFilters = { ...localFilters, search: value || undefined }
    setLocalFilters(newFilters)

    // Clear existing timer
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current)
    }

    // Set new timer to apply filter after 500ms of no typing
    searchDebounceTimer.current = setTimeout(() => {
      onFiltersChange(newFilters)
    }, 500)
  }

  const handleFilterChange = (key: keyof RecordFiltersType, value: string) => {
    const newFilters = { ...localFilters, [key]: value || undefined }
    setLocalFilters(newFilters)
    // Apply filter immediately for dropdowns
    onFiltersChange(newFilters)
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
  }

  const handleClear = () => {
    const clearedFilters: RecordFiltersType = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    // Clear any pending search debounce
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current)
      searchDebounceTimer.current = null
    }
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current)
      }
    }
  }, [])

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
        >
          {isOpen ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by record ID, name, phone, or address... (filters as you type)"
          value={localFilters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Zone</label>
            {loadingOptions ? (
              <div className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <select
                value={localFilters.zone || ''}
                onChange={(e) => handleFilterChange('zone', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Zones</option>
                {filterOptions.zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Capacity (KW)</label>
            {loadingOptions ? (
              <div className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <select
                value={localFilters.capacity_kw || ''}
                onChange={(e) => handleFilterChange('capacity_kw', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Capacities</option>
                {filterOptions.capacity_kw.map((capacity) => (
                  <option key={capacity} value={capacity}>
                    {capacity} KW
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heater</label>
            {loadingOptions ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-500">
                Loading...
              </div>
            ) : (
              <select
                value={localFilters.heater || ''}
                onChange={(e) => handleFilterChange('heater', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Heaters</option>
                {filterOptions.heaters.map((heater) => (
                  <option key={heater} value={heater}>
                    {heater}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Controller</label>
            {loadingOptions ? (
              <div className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <select
                value={localFilters.controller || ''}
                onChange={(e) => handleFilterChange('controller', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Controllers</option>
                {filterOptions.controllers.map((controller) => (
                  <option key={controller} value={controller}>
                    {controller}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Card</label>
            {loadingOptions ? (
              <div className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <select
                value={localFilters.card || ''}
                onChange={(e) => handleFilterChange('card', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Cards</option>
                {filterOptions.cards.map((card) => (
                  <option key={card} value={card}>
                    {card}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Body</label>
            {loadingOptions ? (
              <div className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <select
                value={localFilters.body || ''}
                onChange={(e) => handleFilterChange('body', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Bodies</option>
                {filterOptions.bodies.map((body) => (
                  <option key={body} value={body}>
                    {body}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Sold By</label>
            {loadingOptions ? (
              <div className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <select
                value={localFilters.sold_by || ''}
                onChange={(e) => handleFilterChange('sold_by', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Salespeople</option>
                {filterOptions.sold_by.map((soldBy) => (
                  <option key={soldBy} value={soldBy}>
                    {soldBy}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Lead Source</label>
            {loadingOptions ? (
              <div className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : (
              <select
                value={localFilters.lead_source || ''}
                onChange={(e) => handleFilterChange('lead_source', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Lead Sources</option>
                {filterOptions.lead_sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            )}
          </div>
          {showDateRange && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Date From</label>
                <input
                  type="date"
                  value={localFilters.date_from || ''}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Date To</label>
                <input
                  type="date"
                  value={localFilters.date_to || ''}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleClear}
          className="px-5 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="px-5 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all transform hover:-translate-y-0.5"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default RecordFiltersComponent
