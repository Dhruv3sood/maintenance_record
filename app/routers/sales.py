from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.database import get_db
from app.dependencies import require_sales
from app.schemas import RecordListResponse, RecordFilters, SalesSummary
from app.crud import get_records, get_sales_summary

router = APIRouter(prefix="/sales", tags=["sales"])


@router.get("/records", response_model=RecordListResponse)
def get_sales_records(
    search: Optional[str] = Query(None, description="Search in record_id, name, phone, address"),
    zone: Optional[str] = None,
    capacity_kw: Optional[str] = None,
    heater: Optional[str] = None,
    controller: Optional[str] = None,
    card: Optional[str] = None,
    body: Optional[str] = None,
    sold_by: Optional[str] = None,
    lead_source: Optional[str] = None,
    date_from: Optional[datetime] = Query(None, description="Start date filter"),
    date_to: Optional[datetime] = Query(None, description="End date filter"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    sort_by: str = Query("date_of_delivery"),
    sort_desc: bool = Query(True),
    db: Session = Depends(get_db),
    role: str = Depends(require_sales)
):
    """Get sales records with filters (read-only, sales role)"""
    filters = RecordFilters(
        search=search,
        zone=zone,
        capacity_kw=capacity_kw,
        heater=heater,
        controller=controller,
        card=card,
        body=body,
        sold_by=sold_by,
        lead_source=lead_source,
        date_from=date_from,
        date_to=date_to
    )
    
    records, total = get_records(db, filters, page, page_size, sort_by, sort_desc)
    
    return RecordListResponse(
        records=records,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/summary", response_model=SalesSummary)
def get_sales_summary_endpoint(
    zone: Optional[str] = None,
    sold_by: Optional[str] = None,
    date_from: Optional[datetime] = Query(None, description="Start date filter"),
    date_to: Optional[datetime] = Query(None, description="End date filter"),
    db: Session = Depends(get_db),
    role: str = Depends(require_sales)
):
    """Get sales summary with totals and breakdowns (sales role)"""
    filters = RecordFilters(
        zone=zone,
        sold_by=sold_by,
        date_from=date_from,
        date_to=date_to
    )
    
    summary = get_sales_summary(db, filters)
    return SalesSummary(**summary)
