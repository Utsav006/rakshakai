from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from models.asset import Asset
from models.vulnerability import Vulnerability
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/ingest", tags=["Automated Ingestion"])

# Define the structure of the incoming data from the startup's agent
class VulnPayload(BaseModel):
    cve_id: str
    description: str
    severity: str
    cvss_score: float

class ScanPayload(BaseModel):
    asset_name: str
    asset_type: str
    ip_address: str
    vulnerabilities: List[VulnPayload]

@router.post("/scan")
def ingest_scan_data(payload: ScanPayload, db: Session = Depends(get_db)):
    # 1. Automatically register the startup's server as a new Asset
    # We strictly use only the columns that exist in your lean database schema
    new_asset = Asset(
        name=payload.asset_name,
        asset_type=payload.asset_type
    )
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)

    # 2. Automatically log the vulnerabilities the agent found
    for v in payload.vulnerabilities:
        # Dynamic Risk Engine math based on the incoming scan
        risk = int(v.cvss_score * 10)

        new_vuln = Vulnerability(
            asset_id=new_asset.id,
            cve_id=v.cve_id,
            description=v.description,
            severity=v.severity,
            cvss_score=v.cvss_score,
            contextual_risk_score=risk,
            status="OPEN"
        )
        db.add(new_vuln)
    
    db.commit()
    return {"message": "Agent scan data ingested successfully!", "asset_id": new_asset.id}