from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.connection import get_db
from models.vulnerability import Vulnerability
from models.asset import Asset
from services.risk_engine import calculate_contextual_risk # <-- Import the engine

router = APIRouter(prefix="/api/vulnerabilities", tags=["Vulnerabilities"])

class VulnCreate(BaseModel):
    asset_id: int
    cve_id: str
    severity: str
    cvss_score: float
    description: str

@router.post("/")
def create_vulnerability(vuln: VulnCreate, db: Session = Depends(get_db)):
    # 1. Fetch the targeted asset
    target_asset = db.query(Asset).filter(Asset.id == vuln.asset_id).first()
    if not target_asset:
        raise HTTPException(status_code=404, detail="Target asset not found")
        
    # 2. Create the vulnerability object
    db_vuln = Vulnerability(**vuln.model_dump())
    
    # 3. Calculate the contextual risk BEFORE saving to the database
    db_vuln.contextual_risk_score = calculate_contextual_risk(target_asset, db_vuln)
    
    # 4. Save everything
    db.add(db_vuln)
    db.commit()
    db.refresh(db_vuln)
    return db_vuln

@router.get("/")
def get_vulnerabilities(db: Session = Depends(get_db)):
    return db.query(Vulnerability).all()