from fastapi import APIRouter, Depends, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.database import get_db
from app.dependencies import require_maintenance, require_sales, require_any_role
from app.schemas import RecordFilters
from app.crud import get_records, get_sales_summary
from app.utils.export_utils import export_to_csv, export_to_xlsx, export_to_pdf

router = APIRouter(prefix="/export", tags=["export"])


@router.get("/records.csv")
def export_records_csv(
    search: Optional[str] = None,
    zone: Optional[str] = None,
    capacity_kw: Optional[str] = None,
    heater: Optional[str] = None,
    controller: Optional[str] = None,
    card: Optional[str] = None,
    body: Optional[str] = None,
    sold_by: Optional[str] = None,
    lead_source: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """Export records to CSV (maintenance only)"""
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
    
    # Get all matching records (no pagination for export)
    records, _ = get_records(db, filters, page=1, page_size=10000)
    
    csv_file = export_to_csv(records)
    
    return StreamingResponse(
        csv_file,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=records.csv"}
    )


@router.get("/records.xlsx")
def export_records_xlsx(
    search: Optional[str] = None,
    zone: Optional[str] = None,
    capacity_kw: Optional[str] = None,
    heater: Optional[str] = None,
    controller: Optional[str] = None,
    card: Optional[str] = None,
    body: Optional[str] = None,
    sold_by: Optional[str] = None,
    lead_source: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """Export records to XLSX (maintenance only)"""
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
    
    records, _ = get_records(db, filters, page=1, page_size=10000)
    
    xlsx_file = export_to_xlsx(records)
    
    return StreamingResponse(
        xlsx_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=records.xlsx"}
    )


@router.get("/records.pdf")
def export_records_pdf(
    search: Optional[str] = None,
    zone: Optional[str] = None,
    capacity_kw: Optional[str] = None,
    heater: Optional[str] = None,
    controller: Optional[str] = None,
    card: Optional[str] = None,
    body: Optional[str] = None,
    sold_by: Optional[str] = None,
    lead_source: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: Session = Depends(get_db),
    role: str = Depends(require_maintenance)
):
    """Export records to PDF (maintenance only)"""
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
    
    records, _ = get_records(db, filters, page=1, page_size=10000)
    
    pdf_file = export_to_pdf(records, "Records Export")
    
    return StreamingResponse(
        pdf_file,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=records.pdf"}
    )


@router.get("/sales.csv")
def export_sales_csv(
    zone: Optional[str] = None,
    sold_by: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: Session = Depends(get_db),
    role: str = Depends(require_sales)
):
    """Export sales records to CSV (sales only)"""
    filters = RecordFilters(
        zone=zone,
        sold_by=sold_by,
        date_from=date_from,
        date_to=date_to
    )
    
    records, _ = get_records(db, filters, page=1, page_size=10000)
    
    csv_file = export_to_csv(records)
    
    return StreamingResponse(
        csv_file,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sales.csv"}
    )


@router.get("/sales.xlsx")
def export_sales_xlsx(
    zone: Optional[str] = None,
    sold_by: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: Session = Depends(get_db),
    role: str = Depends(require_sales)
):
    """Export sales records to XLSX (sales only)"""
    filters = RecordFilters(
        zone=zone,
        sold_by=sold_by,
        date_from=date_from,
        date_to=date_to
    )
    
    records, _ = get_records(db, filters, page=1, page_size=10000)
    
    xlsx_file = export_to_xlsx(records)
    
    return StreamingResponse(
        xlsx_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=sales.xlsx"}
    )


@router.get("/sales.pdf")
def export_sales_pdf(
    zone: Optional[str] = None,
    sold_by: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: Session = Depends(get_db),
    role: str = Depends(require_sales)
):
    """Export sales records to PDF (sales only)"""
    filters = RecordFilters(
        zone=zone,
        sold_by=sold_by,
        date_from=date_from,
        date_to=date_to
    )
    
    records, _ = get_records(db, filters, page=1, page_size=10000)
    
    pdf_file = export_to_pdf(records, "Sales Records Export")
    
    return StreamingResponse(
        pdf_file,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=sales.pdf"}
    )
