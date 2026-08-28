from models.asset import Asset
from models.vulnerability import Vulnerability

def calculate_contextual_risk(asset: Asset, vuln: Vulnerability) -> int:
    # Normalize base severity to a 0-100 scale
    severity_map = {"CRITICAL": 100, "HIGH": 75, "MEDIUM": 50, "LOW": 25}
    base_severity = severity_map.get(vuln.severity.upper(), 0)
    
    # Normalize asset factors to a 0-100 scale
    criticality_score = (asset.criticality / 5) * 100
    sensitivity_score = (asset.data_sensitivity / 5) * 100
    exposure_score = 100 if asset.internet_exposed else 0
    
    # Health Buddy Contextual Risk Formula
    # 40% Vulnerability Severity
    # 30% Asset Criticality
    # 15% Internet Exposure
    # 15% Data Sensitivity
    risk_score = (
        (base_severity * 0.40) +
        (criticality_score * 0.30) +
        (exposure_score * 0.15) +
        (sensitivity_score * 0.15)
    )
    
    return min(int(risk_score), 100)