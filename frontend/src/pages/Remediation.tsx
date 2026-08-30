import { useEffect, useState } from "react";

interface Vulnerability {
  id: number;
  cve_id: string;
  description: string;
  status: string;
  severity: string;
}

export default function Remediation() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch remediation items from backend
  const fetchRemediationData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/remediation/all");
      if (response.ok) {
        const data: Vulnerability[] = await response.json();
        setVulnerabilities(data);
      }
    } catch (error) {
      console.error("Failed to fetch remediation data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemediationData();
  }, []);

  // Handle patching a vulnerability with explicit number type for vulnId
  const handleApplyPatch = async (vulnId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/remediation/patch/${vulnId}`, {
        method: "POST",
      });
      
      if (response.ok) {
        alert("✅ Patch applied successfully! Threat resolved.");
        fetchRemediationData();
      } else {
        alert("❌ Failed to apply patch.");
      }
    } catch (error) {
      console.error("Error applying patch:", error);
    }
  };

  if (loading) return <div style={{ color: "white", padding: "20px" }}>Loading remediation queue...</div>;

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1>Remediation Tracker</h1>
      <p style={{ color: "#8a99ad", marginBottom: "20px" }}>Manage and resolve active security threats</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {vulnerabilities.map((vuln) => (
          <div 
            key={vuln.id} 
            style={{
              background: "#161b22", 
              border: "1px solid #30363d", 
              borderRadius: "8px", 
              padding: "20px", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>{vuln.cve_id}</span>
                <span 
                  style={{
                    padding: "2px 8px", 
                    borderRadius: "4px", 
                    fontSize: "12px", 
                    fontWeight: "bold",
                    background: vuln.status === "RESOLVED" ? "#238636" : "#da3633"
                  }}
                >
                  {vuln.status}
                </span>
              </div>
              <p style={{ color: "#8b949e", margin: 0, fontSize: "14px" }}>{vuln.description}</p>
            </div>

            {vuln.status !== "RESOLVED" ? (
              <button
                onClick={() => handleApplyPatch(vuln.id)}
                style={{
                  background: "#1f6feb",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                🛠️ Apply Patch
              </button>
            ) : (
              <span style={{ color: "#3fb950", fontWeight: "bold" }}>✔ Resolved</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}