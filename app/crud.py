from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func, desc
from typing import Optional
from datetime import datetime, date
from app.models import Record
from app.schemas import RecordCreate, RecordUpdate, RecordFilters
from app.utils.warranty import get_warranty_status


def generate_record_id(db: Session) -> str:
    """Generate next record ID in format RMZ-000001"""
    last_record = db.query(Record).order_by(Record.id.desc()).first()
    if last_record and last_record.record_id.startswith("RMZ-"):
        try:
            num = int(last_record.record_id.split("-")[1])
            next_num = num + 1
        except (ValueError, IndexError):
            next_num = 1
    else:
        next_num = 1
    return f"RMZ-{next_num:06d}"


def create_record(db: Session, record: RecordCreate, auto_generate_id: bool = True) -> Record:
    """Create a new record"""
    record_data = record.model_dump()
    
    # Auto-generate record_id if not provided or if auto_generate_id is True
    if auto_generate_id or not record_data.get("record_id"):
        record_data["record_id"] = generate_record_id(db)
    
    db_record = Record(**record_data)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def get_record(db: Session, record_id: int) -> Optional[Record]:
    """Get record by ID"""
    return db.query(Record).filter(Record.id == record_id).first()


def get_record_by_record_id(db: Session, record_id_str: str) -> Optional[Record]:
    """Get record by record_id string"""
    return db.query(Record).filter(Record.record_id == record_id_str).first()


def update_record(db: Session, record_id: int, record_update: RecordUpdate) -> Optional[Record]:
    """Update a record"""
    db_record = get_record(db, record_id)
    if not db_record:
        return None
    
    update_data = record_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_record, field, value)
    
    db_record.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_record)
    return db_record


def delete_record(db: Session, record_id: int) -> bool:
    """Delete a record"""
    db_record = get_record(db, record_id)
    if not db_record:
        return False
    db.delete(db_record)
    db.commit()
    return True


def get_records(
    db: Session,
    filters: RecordFilters,
    page: int = 1,
    page_size: int = 50,
    sort_by: str = "date_of_delivery",
    sort_desc: bool = True
) -> tuple[list[Record], int]:
    """Get records with filters, search, pagination, and sorting"""
    query = db.query(Record)
    
    # Search (record_id, client_name, client_phone, client_address)
    if filters.search:
        search_term = f"%{filters.search}%"
        query = query.filter(
            or_(
                Record.record_id.ilike(search_term),
                Record.client_name.ilike(search_term),
                Record.client_phone.ilike(search_term),
                Record.client_address.ilike(search_term)
            )
        )
    
    # Filters
    if filters.zone:
        query = query.filter(Record.zone == filters.zone)
    if filters.capacity_kw:
        query = query.filter(Record.capacity_kw == filters.capacity_kw)
    if filters.heater:
        query = query.filter(Record.heater == filters.heater)
    if filters.controller:
        query = query.filter(Record.controller == filters.controller)
    if filters.card:
        query = query.filter(Record.card == filters.card)
    if filters.body:
        query = query.filter(Record.body == filters.body)
    if filters.sold_by:
        query = query.filter(Record.sold_by == filters.sold_by)
    if filters.lead_source:
        query = query.filter(Record.lead_source == filters.lead_source)
    
    # Date range filter
    if filters.date_from:
        query = query.filter(Record.date_of_delivery >= filters.date_from)
    if filters.date_to:
        query = query.filter(Record.date_of_delivery <= filters.date_to)
    
    # Get total count before pagination
    total = query.count()
    
    # Sorting
    sort_column = getattr(Record, sort_by, Record.date_of_delivery)
    if sort_desc:
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(sort_column)
    
    # Pagination
    offset = (page - 1) * page_size
    records = query.offset(offset).limit(page_size).all()
    
    return records, total


def get_records_by_client_phone(
    db: Session,
    client_phone: str,
    exclude_id: Optional[int] = None,
    limit: int = 10
) -> list[Record]:
    """Get records by exact client phone match, sorted by date descending (newest first)"""
    query = db.query(Record).filter(Record.client_phone == client_phone)
    
    if exclude_id:
        query = query.filter(Record.id != exclude_id)
    
    # Sort by date_of_delivery descending (newest first)
    records = query.order_by(desc(Record.date_of_delivery)).limit(limit).all()
    
    return records


def get_records_out_of_warranty(db: Session, page: int = 1, page_size: int = 50) -> tuple[list[Record], int]:
    """Get records that are out of warranty"""
    from datetime import timedelta, date
    one_year_ago = date.today() - timedelta(days=365)
    
    query = db.query(Record).filter(Record.date_of_delivery < one_year_ago)
    total = query.count()
    
    records = query.order_by(desc(Record.date_of_delivery)).offset((page - 1) * page_size).limit(page_size).all()
    return records, total


def get_records_expiring_soon(db: Session, days: int = 30, page: int = 1, page_size: int = 50) -> tuple[list[Record], int]:
    """Get records expiring soon"""
    from datetime import timedelta, date
    today = date.today()
    start_date = today - timedelta(days=365 - days)
    end_date = today - timedelta(days=365)
    
    query = db.query(Record).filter(
        and_(
            Record.date_of_delivery >= end_date,
            Record.date_of_delivery <= start_date
        )
    )
    total = query.count()
    
    records = query.order_by(Record.date_of_delivery).offset((page - 1) * page_size).limit(page_size).all()
    return records, total


def get_warranty_summary(db: Session, days_soon: int = 30) -> dict:
    """Get warranty summary counts"""
    all_records = db.query(Record).filter(Record.date_of_delivery.isnot(None)).all()
    
    in_warranty = 0
    out_of_warranty = 0
    expiring_soon = 0
    
    for record in all_records:
        _, status = get_warranty_status(record, days_soon)
        if status == "in_warranty":
            in_warranty += 1
        elif status == "expiring_soon":
            expiring_soon += 1
        else:
            out_of_warranty += 1
    
    return {
        "in_warranty": in_warranty,
        "out_of_warranty": out_of_warranty,
        "expiring_soon": expiring_soon,
        "total": len(all_records)
    }


def get_sales_summary(db: Session, filters: Optional[RecordFilters] = None) -> dict:
    """Get sales summary with totals, breakdowns, trends, and projections"""
    from datetime import timedelta
    from collections import defaultdict
    
    query = db.query(Record)
    
    # Apply filters if provided
    if filters:
        if filters.zone:
            query = query.filter(Record.zone == filters.zone)
        if filters.sold_by:
            query = query.filter(Record.sold_by == filters.sold_by)
        if filters.date_from:
            query = query.filter(Record.date_of_delivery >= filters.date_from)
        if filters.date_to:
            query = query.filter(Record.date_of_delivery <= filters.date_to)
    
    records = query.all()
    
    total_records = len(records)
    records_with_price = [r for r in records if r.sale_price]
    total_revenue = sum(float(r.sale_price) for r in records_with_price)
    avg_order_value = total_revenue / len(records_with_price) if records_with_price else 0
    
    # Breakdown by zone (count and revenue)
    by_zone = {}
    by_zone_revenue = {}
    for record in records:
        zone = record.zone or "Unknown"
        by_zone[zone] = by_zone.get(zone, 0) + 1
        if record.sale_price:
            by_zone_revenue[zone] = by_zone_revenue.get(zone, 0) + float(record.sale_price)
    
    # Breakdown by sold_by (count and revenue)
    by_sold_by = {}
    by_sold_by_revenue = {}
    for record in records:
        sold_by = record.sold_by or "Unknown"
        by_sold_by[sold_by] = by_sold_by.get(sold_by, 0) + 1
        if record.sale_price:
            by_sold_by_revenue[sold_by] = by_sold_by_revenue.get(sold_by, 0) + float(record.sale_price)
    
    # Breakdown by lead_source (count and revenue)
    by_lead_source = {}
    by_lead_source_revenue = {}
    for record in records:
        lead_source = record.lead_source or "Unknown"
        by_lead_source[lead_source] = by_lead_source.get(lead_source, 0) + 1
        if record.sale_price:
            by_lead_source_revenue[lead_source] = by_lead_source_revenue.get(lead_source, 0) + float(record.sale_price)
    
    # Monthly sales trends (last 12 months)
    monthly_sales = defaultdict(lambda: {"count": 0, "revenue": 0})
    
    for record in records:
        if record.date_of_delivery:
            month_key = record.date_of_delivery.strftime("%Y-%m")
            monthly_sales[month_key]["count"] += 1
            if record.sale_price:
                monthly_sales[month_key]["revenue"] += float(record.sale_price)
    
    # Sort monthly sales and get last 12 months
    sorted_months = sorted(monthly_sales.keys())[-12:]
    monthly_trends = [
        {
            "month": month,
            "count": monthly_sales[month]["count"],
            "revenue": monthly_sales[month]["revenue"]
        }
        for month in sorted_months
    ]
    
    # Calculate projected sales for next 3 months based on average
    projected_sales = []
    if monthly_trends and len(monthly_trends) >= 3:
        # Use average of last 3 months for projection
        recent_months = monthly_trends[-3:]
        avg_monthly_count = sum(m["count"] for m in recent_months) / len(recent_months)
        avg_monthly_revenue = sum(m["revenue"] for m in recent_months) / len(recent_months)
        
        # Calculate growth trend if we have enough data
        if len(monthly_trends) >= 6:
            recent_avg = sum(m["count"] for m in monthly_trends[-3:]) / 3
            older_avg = sum(m["count"] for m in monthly_trends[-6:-3]) / 3
            growth_rate = (recent_avg - older_avg) / older_avg if older_avg > 0 else 0
        else:
            growth_rate = 0
        
        # Project next 3 months
        if sorted_months:
            last_month_str = sorted_months[-1]
            year, month_num = last_month_str.split('-')
            last_month = date(int(year), int(month_num), 1)
            
            current_month = last_month
            for i in range(1, 4):
                # Calculate next month
                if current_month.month == 12:
                    next_month = date(current_month.year + 1, 1, 1)
                else:
                    next_month = date(current_month.year, current_month.month + 1, 1)
                
                month_key = next_month.strftime("%Y-%m")
                
                projected_count = avg_monthly_count * (1 + growth_rate) ** i
                projected_revenue = avg_monthly_revenue * (1 + growth_rate) ** i
                
                projected_sales.append({
                    "month": month_key,
                    "count": int(projected_count),
                    "revenue": projected_revenue
                })
                
                # Update for next iteration
                current_month = next_month
    
    # Order details breakdown
    order_details = {
        "total_orders": total_records,
        "orders_with_price": len(records_with_price),
        "orders_without_price": total_records - len(records_with_price),
        "average_order_value": avg_order_value,
        "highest_order": max((float(r.sale_price) for r in records_with_price), default=0),
        "lowest_order": min((float(r.sale_price) for r in records_with_price), default=0) if records_with_price else 0
    }
    
    return {
        "total_records": total_records,
        "total_revenue": total_revenue if total_revenue > 0 else None,
        "average_order_value": avg_order_value if avg_order_value > 0 else None,
        "by_zone": by_zone,
        "by_zone_revenue": by_zone_revenue,
        "by_sold_by": by_sold_by,
        "by_sold_by_revenue": by_sold_by_revenue,
        "by_lead_source": by_lead_source,
        "by_lead_source_revenue": by_lead_source_revenue,
        "monthly_trends": monthly_trends,
        "projected_sales": projected_sales,
        "order_details": order_details
    }
