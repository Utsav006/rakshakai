from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from models.vulnerability import Vulnerability
from models.asset import Asset

router = APIRouter(prefix="/api/paths", tags=["Attack Paths"])

@router.get("/")
def get_attack_paths(db: Session = Depends(get_db)):
    vulns = db.query(Vulnerability).filter(Vulnerability.status == "OPEN").all()
    
    # 1. Always create the starting "Attacker" node
    nodes = [{
        "id": "attacker",
        "position": {"x": 50, "y": 200},
        "data": {"label": "🌐 Public Internet (Attacker)"},
        "style": {"background": "#da3633", "color": "white", "fontWeight": "bold"}
    }]
    edges = []

    # 2. Dynamically build nodes for every open vulnerability
    x_offset = 350
    y_offset = 100
    
    for i, vuln in enumerate(vulns):
        vuln_node_id = f"vuln_{vuln.id}"
        asset_node_id = f"asset_{vuln.asset_id}"
        
        # Add Vulnerability Node
        nodes.append({
            "id": vuln_node_id,
            "position": {"x": x_offset, "y": y_offset + (i * 100)},
            "data": {"label": f"🚨 {vuln.cve_id}"},
            "style": {"background": "#b35900", "color": "white"}
        })
        
        # Add Asset Node (Target)
        nodes.append({
            "id": asset_node_id,
            "position": {"x": x_offset + 300, "y": y_offset + (i * 100)},
            "data": {"label": f"💻 Compromised Asset (ID: {vuln.asset_id})"},
            "style": {"background": "#1f6feb", "color": "white"}
        })

        # Connect Attacker -> Vulnerability -> Asset
        edges.append({"id": f"e_att_{vuln.id}", "source": "attacker", "target": vuln_node_id, "animated": True})
        edges.append({"id": f"e_vuln_{vuln.id}", "source": vuln_node_id, "target": asset_node_id, "animated": True})

    return {"nodes": nodes, "edges": edges}