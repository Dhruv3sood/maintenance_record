from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date


# Auth schemas
class LoginRequest(BaseModel):
    passcode: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


# Record schemas
class RecordBase(BaseModel):
    record_id: str
    date_of_delivery: date
    date_of_installation: Optional[date] = None
    date_of_site_visit: Optional[datetime] = None
    site_visit_done_by: Optional[str] = None
    installation_done_by: Optional[str] = None
    commission_done_by: Optional[str] = None
    capacity_kw: Optional[str] = None
    heater: Optional[str] = None
    controller: Optional[str] = None
    card: Optional[str] = None
    body: Optional[str] = None
    client_name: str
    client_phone: Optional[str] = None
    client_address: Optional[str] = None
    zone: Optional[str] = None
    sale_price: Optional[float] = None
    sold_by: Optional[str] = None
    lead_source: Optional[str] = None
    remarks: Optional[str] = None


class RecordCreate(RecordBase):
    pass


class RecordUpdate(BaseModel):
    record_id: Optional[str] = None
    date_of_delivery: Optional[date] = None
    date_of_installation: Optional[date] = None
    date_of_site_visit: Optional[datetime] = None
    site_visit_done_by: Optional[str] = None
    installation_done_by: Optional[str] = None
    commission_done_by: Optional[str] = None
    capacity_kw: Optional[str] = None
    heater: Optional[str] = None
    controller: Optional[str] = None
    card: Optional[str] = None
    body: Optional[str] = None
    client_name: Optional[str] = None
    client_phone: Optional[str] = None
    client_address: Optional[str] = None
    zone: Optional[str] = None
    sale_price: Optional[float] = None
    sold_by: Optional[str] = None
    lead_source: Optional[str] = None
    remarks: Optional[str] = None


class RecordResponse(RecordBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class RecordWithWarranty(RecordResponse):
    warranty_expiry: Optional[datetime] = None
    warranty_status: Optional[str] = None  # "in_warranty", "out_of_warranty", "expiring_soon"


class RecordListResponse(BaseModel):
    records: list[RecordResponse]
    total: int
    page: int
    page_size: int


# Filter/Pagination schemas
class RecordFilters(BaseModel):
    search: Optional[str] = None  # searches record_id, name, phone, address
    zone: Optional[str] = None
    capacity_kw: Optional[str] = None
    heater: Optional[str] = None
    controller: Optional[str] = None
    card: Optional[str] = None
    body: Optional[str] = None
    sold_by: Optional[str] = None
    lead_source: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None


# Warranty schemas
class WarrantySummary(BaseModel):
    in_warranty: int
    out_of_warranty: int
    expiring_soon: int
    total: int


# Sales schemas
class MonthlyTrend(BaseModel):
    month: str
    count: int
    revenue: float


class ProjectedSale(BaseModel):
    month: str
    count: int
    revenue: float


class OrderDetails(BaseModel):
    total_orders: int
    orders_with_price: int
    orders_without_price: int
    average_order_value: Optional[float] = None
    highest_order: float
    lowest_order: float


class SalesSummary(BaseModel):
    total_records: int
    total_revenue: Optional[float] = None
    average_order_value: Optional[float] = None
    by_zone: dict[str, int]
    by_zone_revenue: dict[str, float]
    by_sold_by: dict[str, int]
    by_sold_by_revenue: dict[str, float]
    by_lead_source: dict[str, int]
    by_lead_source_revenue: dict[str, float]
    monthly_trends: list[MonthlyTrend]
    projected_sales: list[ProjectedSale]
    order_details: OrderDetails
