from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from models.vulnerability import Vulnerability

router = APIRouter(prefix="/api/remediation", tags=["Remediation"])

@router.get("/all")
def get_remediation_items(db: Session = Depends(get_db)):
    """Fetch all vulnerabilities for the remediation tracker page."""
    vulns = db.query(Vulnerability.id, Vulnerability.cve_id, Vulnerability.description, Vulnerability.status, Vulnerability.severity).all()
    return [
        {
            "id": v.id,
            "cve_id": v.cve_id,
            "description": v.description,
            "status": v.status,
            "severity": v.severity
        }
        for v in vulns
    ]

@router.post("/patch/{vuln_id}")
def apply_patch(vuln_id: int, db: Session = Depends(get_db)):
    """Marks a vulnerability as resolved and mitigates its risk score."""
    vuln = db.query(Vulnerability).filter(Vulnerability.id == vuln_id).first()
    if not vuln:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    
    # Update status and zero out the risk score
    vuln.status = "RESOLVED"
    vuln.contextual_risk_score = 0
    db.commit()
    
    return {"message": f"Successfully patched vulnerability {vuln.cve_id}!", "vuln_id": vuln_id}