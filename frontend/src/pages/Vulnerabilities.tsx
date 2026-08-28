import { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, Activity, Flame } from 'lucide-react';

interface Vulnerability {
  id: number;
  asset_id: number;
  cve_id: string;
  severity: string;
  cvss_score: number;
  description: string;
  status: string;
  contextual_risk_score: number;
}

export default function Vulnerabilities() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/vulnerabilities/')
      .then((res) => res.json())
      .then((data) => {
        setVulnerabilities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching vulnerabilities:", err);
        setLoading(false);
      });
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Active Vulnerabilities</h1>
          <p className="text-gray-400 text-sm mt-1">Context-aware prioritized threat registry</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Run Security Scan
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Fetching threat data...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {vulnerabilities.map((vuln) => (
            <div key={vuln.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-gray-700 transition-colors">
              
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg border ${getSeverityColor(vuln.severity)}`}>
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-white">{vuln.cve_id}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${getSeverityColor(vuln.severity)}`}>
                      {vuln.severity}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{vuln.description}</p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-4 min-w-[220px] bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400 flex items-center gap-1.5"><Activity className="h-4 w-4 text-blue-400"/> CVSS Base</span>
                  <span className="text-white font-semibold">{vuln.cvss_score} / 10</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-red-400 flex items-center gap-1.5 font-medium"><Flame className="h-4 w-4"/> Context Risk</span>
                  <span className="text-red-400 font-bold text-base">{vuln.contextual_risk_score} / 100</span>
                </div>
                <div className="flex justify-between text-xs items-center border-t border-gray-800/80 pt-2">
                  <span className="text-gray-500 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5"/> Target Asset</span>
                  <span className="text-gray-400">ID #{vuln.asset_id}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}