from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.connection import get_db
from models.vulnerability import Vulnerability

# Set up the router
router = APIRouter(prefix="/api/vulnerabilities", tags=["Vulnerabilities"])

# Pydantic Schema for incoming data
class VulnCreate(BaseModel):
    asset_id: int
    cve_id: str
    severity: str
    cvss_score: float
    description: str

@router.post("/")
def create_vulnerability(vuln: VulnCreate, db: Session = Depends(get_db)):
    db_vuln = Vulnerability(**vuln.model_dump())
    db.add(db_vuln)
    db.commit()
    db.refresh(db_vuln)
    return db_vuln

@router.get("/")
def get_vulnerabilities(db: Session = Depends(get_db)):
    return db.query(Vulnerability).all()