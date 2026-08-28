from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.connection import get_db
from models.asset import Asset
from models.vulnerability import Vulnerability

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    total_assets = db.query(Asset).count()
    total_vulns = db.query(Vulnerability).count()
    critical_vulns = db.query(Vulnerability).filter(Vulnerability.severity == "CRITICAL").count()
    
    # Calculate average network risk
    avg_risk = db.query(func.avg(Vulnerability.contextual_risk_score)).scalar() or 0
    
    # Grab the top 5 highest risk vulnerabilities for the alert feed
    recent_alerts = db.query(Vulnerability, Asset.name)\
        .join(Asset, Vulnerability.asset_id == Asset.id)\
        .order_by(Vulnerability.contextual_risk_score.desc())\
        .limit(5)\
        .all()
        
    alerts_data = [
        {
            "id": vuln.id,
            "cve_id": vuln.cve_id,
            "asset_name": asset_name,
            "severity": vuln.severity,
            "risk_score": vuln.contextual_risk_score
        }
        for vuln, asset_name in recent_alerts
    ]
    
    return {
        "total_assets": total_assets,
        "total_vulnerabilities": total_vulns,
        "critical_threats": critical_vulns,
        "average_risk_index": int(avg_risk),
        "recent_alerts": alerts_data
    }