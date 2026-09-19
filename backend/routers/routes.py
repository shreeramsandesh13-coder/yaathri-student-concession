from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/routes", tags=["Transit Routes"])

@router.get("", response_model=List[schemas.RouteOut])
def list_active_routes(db: Session = Depends(get_db)):
    return db.query(models.Route).filter(models.Route.is_active == True).all()

@router.get("/{id}", response_model=schemas.RouteOut)
def get_route(id: int, db: Session = Depends(get_db)):
    route = db.query(models.Route).filter(models.Route.id == id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Transit corridor not found.")
    return route

