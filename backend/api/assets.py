from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.connection import get_db
from models.asset import Asset

# Set up the router
router = APIRouter(prefix="/api/assets", tags=["Assets"])

# Pydantic Schema for incoming data validation
class AssetCreate(BaseModel):
    name: str
    asset_type: str
    technology: str
    criticality: int
    internet_exposed: bool
    data_sensitivity: int

@router.post("/")
def create_asset(asset: AssetCreate, db: Session = Depends(get_db)):
    # Convert the Pydantic schema to an SQLAlchemy model and save to DB
    db_asset = Asset(**asset.model_dump())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@router.get("/")
def get_assets(db: Session = Depends(get_db)):
    # Fetch all assets from the DB
    return db.query(Asset).all()