export interface Record {
  id: number
  record_id: string
  created_at: string
  updated_at: string
  date_of_delivery: string
  date_of_installation?: string
  date_of_site_visit?: string
  site_visit_done_by?: string
  installation_done_by?: string
  commission_done_by?: string
  capacity_kw?: string
  heater?: string
  controller?: string
  card?: string
  body?: string
  client_name: string
  client_phone?: string
  client_address?: string
  zone?: string
  sale_price?: number
  sold_by?: string
  lead_source?: string
  remarks?: string
}

export interface RecordCreate {
  record_id?: string
  date_of_delivery: string
  date_of_installation?: string
  date_of_site_visit?: string
  site_visit_done_by?: string
  installation_done_by?: string
  commission_done_by?: string
  capacity_kw?: string
  heater?: string
  controller?: string
  card?: string
  body?: string
  client_name: string
  client_phone?: string
  client_address?: string
  zone?: string
  sale_price?: number
  sold_by?: string
  lead_source?: string
  remarks?: string
}

export interface RecordUpdate {
  record_id?: string
  date_of_delivery?: string
  date_of_installation?: string
  date_of_site_visit?: string
  site_visit_done_by?: string
  installation_done_by?: string
  commission_done_by?: string
  capacity_kw?: string
  heater?: string
  controller?: string
  card?: string
  body?: string
  client_name?: string
  client_phone?: string
  client_address?: string
  zone?: string
  sale_price?: number
  sold_by?: string
  lead_source?: string
  remarks?: string
}

export interface RecordListResponse {
  records: Record[]
  total: number
  page: number
  page_size: number
}

export interface WarrantySummary {
  in_warranty: number
  out_of_warranty: number
  expiring_soon: number
  total: number
}

export interface MonthlyTrend {
  month: string
  count: number
  revenue: number
}

export interface ProjectedSale {
  month: string
  count: number
  revenue: number
}

export interface OrderDetails {
  total_orders: number
  orders_with_price: number
  orders_without_price: number
  average_order_value?: number
  highest_order: number
  lowest_order: number
}

export interface SalesSummary {
  total_records: number
  total_revenue?: number
  average_order_value?: number
  by_zone: { [key: string]: number }
  by_zone_revenue: { [key: string]: number }
  by_sold_by: { [key: string]: number }
  by_sold_by_revenue: { [key: string]: number }
  by_lead_source: { [key: string]: number }
  by_lead_source_revenue: { [key: string]: number }
  monthly_trends: MonthlyTrend[]
  projected_sales: ProjectedSale[]
  order_details: OrderDetails
}

export interface RecordFilters {
  search?: string
  zone?: string
  capacity_kw?: string
  heater?: string
  controller?: string
  card?: string
  body?: string
  sold_by?: string
  lead_source?: string
  date_from?: string
  date_to?: string
  page?: number
  page_size?: number
}
