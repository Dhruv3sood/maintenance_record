from datetime import datetime, date, timedelta
from typing import Optional
from app.models import Record


def calculate_warranty_expiry(date_of_delivery: date) -> date:
    """Calculate warranty expiry (1 year from delivery date)"""
    return date_of_delivery + timedelta(days=365)


def get_warranty_status(record: Record, days_soon: int = 30) -> tuple[Optional[date], str]:
    """
    Calculate warranty expiry and status.
    Returns (expiry_date, status) where status is:
    - "in_warranty": still under warranty
    - "expiring_soon": expiring within days_soon
    - "out_of_warranty": warranty expired
    """
    if not record.date_of_delivery:
        return None, "out_of_warranty"
    
    expiry = calculate_warranty_expiry(record.date_of_delivery)
    today = datetime.utcnow().date()
    
    if expiry < today:
        return expiry, "out_of_warranty"
    
    days_remaining = (expiry - today).days
    if days_remaining <= days_soon:
        return expiry, "expiring_soon"
    
    return expiry, "in_warranty"
