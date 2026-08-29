from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from models.asset import Asset
from models.vulnerability import Vulnerability
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/ingest", tags=["Automated Ingestion"])

class VulnPayload(BaseModel):
    cve_id: str
    description: str
    severity: str
    cvss_score: float

class ScanPayload(BaseModel):
    asset_name: str
    asset_type: str
    vulnerabilities: List[VulnPayload]

@router.post("/scan")
def ingest_scan_data(payload: ScanPayload, db: Session = Depends(get_db)):
    # Pillar 3: Idempotent Asset Management (Upsert)
    existing_asset = db.query(Asset).filter(Asset.name == payload.asset_name).first()
    
    if existing_asset:
        # Update existing asset
        existing_asset.asset_type = payload.asset_type
        db.commit()
        db.refresh(existing_asset)
        asset_id = existing_asset.id
        
        # Clear old open vulnerabilities to replace with fresh scan data
        db.query(Vulnerability).filter(Vulnerability.asset_id == asset_id).delete()
    else:
        # Create new asset
        new_asset = Asset(
            name=payload.asset_name,
            asset_type=payload.asset_type
        )
        db.add(new_asset)
        db.commit()
        db.refresh(new_asset)
        asset_id = new_asset.id

    # Automatically log the vulnerabilities the agent found
    for v in payload.vulnerabilities:
        risk = int(v.cvss_score * 10)

        new_vuln = Vulnerability(
            asset_id=asset_id,
            cve_id=v.cve_id,
            description=v.description,
            severity=v.severity,
            cvss_score=v.cvss_score,
            contextual_risk_score=risk,
            status="OPEN"
        )
        db.add(new_vuln)
    
    db.commit()
    return {"message": "Health Buddy agent scan data ingested successfully!", "asset_id": asset_id}