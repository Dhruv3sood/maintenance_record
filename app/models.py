from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Date, Numeric, 
    Index, func
)
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, date
from app.database import Base


class Record(Base):
    __tablename__ = "records"
    
    # Primary key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # ID/Meta
    record_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Dates/work
    date_of_delivery: Mapped[date] = mapped_column(Date, nullable=False)
    date_of_installation: Mapped[date | None] = mapped_column(Date, nullable=True)
    date_of_site_visit: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    site_visit_done_by: Mapped[str | None] = mapped_column(String(200), nullable=True)
    installation_done_by: Mapped[str | None] = mapped_column(String(200), nullable=True)
    commission_done_by: Mapped[str | None] = mapped_column(String(200), nullable=True)
    
    # Machine
    capacity_kw: Mapped[str | None] = mapped_column(String(10), nullable=True)
    heater: Mapped[str | None] = mapped_column(String(50), nullable=True)
    controller: Mapped[str | None] = mapped_column(String(50), nullable=True)
    card: Mapped[str | None] = mapped_column(String(50), nullable=True)
    body: Mapped[str | None] = mapped_column(String(50), nullable=True)
    
    # Client
    client_name: Mapped[str] = mapped_column(String(200), nullable=False)
    client_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    client_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    zone: Mapped[str | None] = mapped_column(String(100), nullable=True)
    
    # Commercial
    sale_price: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    sold_by: Mapped[str | None] = mapped_column(String(200), nullable=True)
    lead_source: Mapped[str | None] = mapped_column(String(200), nullable=True)
    
    # Other
    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Indexes
    __table_args__ = (
        Index('idx_client_phone', 'client_phone'),
        Index('idx_zone', 'zone'),
        Index('idx_date_of_delivery', 'date_of_delivery'),
        Index('idx_sold_by', 'sold_by'),
        Index('idx_lead_source', 'lead_source'),
        Index('idx_capacity_kw', 'capacity_kw'),
        Index('idx_heater', 'heater'),
        Index('idx_controller', 'controller'),
        Index('idx_card', 'card'),
        Index('idx_body', 'body'),
    )
