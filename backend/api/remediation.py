from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from models.vulnerability import Vulnerability
from pydantic import BaseModel

router = APIRouter(prefix="/api/remediation", tags=["Remediation"])

class UpdateStatus(BaseModel):
    status: str

@router.patch("/{vuln_id}/status")
def update_vulnerability_status(vuln_id: int, request: UpdateStatus, db: Session = Depends(get_db)):
    vuln = db.query(Vulnerability).filter(Vulnerability.id == vuln_id).first()
    if not vuln:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    
    vuln.status = request.status
    
    # If it is patched, we drop the risk score to 0 so the dashboard reflects the fix!
    if request.status == "PATCHED":
        vuln.contextual_risk_score = 0
        
    db.commit()
    return {"message": "Status updated successfully", "new_status": vuln.status}