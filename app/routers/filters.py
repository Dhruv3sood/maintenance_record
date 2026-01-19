from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import distinct, func
from app.database import get_db
from app.dependencies import require_any_role
from app.models import Record

router = APIRouter(prefix="/filters", tags=["filters"])


@router.get("/options")
def get_filter_options(
    db: Session = Depends(get_db),
    role: str = Depends(require_any_role)
):
    """Get all available filter options from the database"""
    
    # Get distinct values for each filter field
    zones = [row[0] for row in db.query(distinct(Record.zone)).filter(Record.zone.isnot(None)).order_by(Record.zone).all()]
    capacity_kw = [row[0] for row in db.query(distinct(Record.capacity_kw)).filter(Record.capacity_kw.isnot(None)).order_by(Record.capacity_kw).all()]
    heaters = [row[0] for row in db.query(distinct(Record.heater)).filter(Record.heater.isnot(None)).order_by(Record.heater).all()]
    controllers = [row[0] for row in db.query(distinct(Record.controller)).filter(Record.controller.isnot(None)).order_by(Record.controller).all()]
    cards = [row[0] for row in db.query(distinct(Record.card)).filter(Record.card.isnot(None)).order_by(Record.card).all()]
    bodies = [row[0] for row in db.query(distinct(Record.body)).filter(Record.body.isnot(None)).order_by(Record.body).all()]
    sold_by = [row[0] for row in db.query(distinct(Record.sold_by)).filter(Record.sold_by.isnot(None)).order_by(Record.sold_by).all()]
    lead_sources = [row[0] for row in db.query(distinct(Record.lead_source)).filter(Record.lead_source.isnot(None)).order_by(Record.lead_source).all()]
    
    return {
        "zones": zones,
        "capacity_kw": capacity_kw,
        "heaters": heaters,
        "controllers": controllers,
        "cards": cards,
        "bodies": bodies,
        "sold_by": sold_by,
        "lead_sources": lead_sources
    }
