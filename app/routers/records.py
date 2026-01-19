from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.database import get_db
from app.dependencies import require_maintenance
from app.schemas import (
    RecordCreate, RecordUpdate, RecordResponse, RecordListResponse,
    RecordFilters, RecordWithWarranty, WarrantySummary
)
from app.crud import (
    create_record, get_record, update_record, delete_record,
    get_records, get_records_out_of_warranty, get_records_expiring_soon,
    get_warranty_summary, get_records_by_client_phone
)
from app.utils.warranty import get_warranty_status

router = APIRouter(prefix="/records", tags=["records"])


@router.post("", response_model=RecordResponse, status_code=201)
def create_record_endpoint(
    record: RecordCreate,
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """Create a new record (maintenance only)"""
    return create_record(db, record)


@router.get("/{record_id}", response_model=RecordResponse)
def get_record_endpoint(
    record_id: int,
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """Get a record by ID (maintenance only)"""
    record = get_record(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@router.patch("/{record_id}", response_model=RecordResponse)
def update_record_endpoint(
    record_id: int,
    record_update: RecordUpdate,
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """Update a record (maintenance only)"""
    record = update_record(db, record_id, record_update)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@router.delete("/{record_id}", status_code=204)
def delete_record_endpoint(
    record_id: int,
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """Delete a record (maintenance only)"""
    success = delete_record(db, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Record not found")
    return None


@router.get("", response_model=RecordListResponse)
def list_records(
    search: Optional[str] = Query(None, description="Search in record_id, name, phone, address"),
    zone: Optional[str] = None,
    capacity_kw: Optional[str] = None,
    heater: Optional[str] = None,
    controller: Optional[str] = None,
    card: Optional[str] = None,
    body: Optional[str] = None,
    sold_by: Optional[str] = None,
    lead_source: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    sort_by: str = Query("date_of_delivery"),
    sort_desc: bool = Query(True),
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """List records with search, filters, and pagination (maintenance only)"""
    filters = RecordFilters(
        search=search,
        zone=zone,
        capacity_kw=capacity_kw,
        heater=heater,
        controller=controller,
        card=card,
        body=body,
        sold_by=sold_by,
        lead_source=lead_source
    )
    
    records, total = get_records(db, filters, page, page_size, sort_by, sort_desc)
    
    return RecordListResponse(
        records=records,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/warranty/out-of-warranty", response_model=RecordListResponse)
def get_out_of_warranty(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """Get records that are out of warranty (maintenance only)"""
    records, total = get_records_out_of_warranty(db, page, page_size)
    
    return RecordListResponse(
        records=records,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/warranty/expiring-soon", response_model=RecordListResponse)
def get_expiring_soon(
    days: int = Query(30, ge=1, le=365, description="Days until expiry"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """Get records expiring soon (maintenance only)"""
    records, total = get_records_expiring_soon(db, days, page, page_size)
    
    return RecordListResponse(
        records=records,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/warranty/summary", response_model=WarrantySummary)
def get_warranty_summary_endpoint(
    days: int = Query(30, ge=1, le=365, description="Days for expiring soon threshold"),
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """Get warranty summary counts (maintenance only)"""
    summary = get_warranty_summary(db, days)
    return WarrantySummary(**summary)


@router.get("/history/{client_phone}", response_model=RecordListResponse)
def get_client_history(
    client_phone: str,
    exclude_id: Optional[int] = Query(None, description="Record ID to exclude from results"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of records to return"),
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """Get history of records for a specific client phone number (maintenance only)"""
    records = get_records_by_client_phone(db, client_phone, exclude_id=exclude_id, limit=limit)
    
    return RecordListResponse(
        records=records,
        total=len(records),
        page=1,
        page_size=len(records)
    )
