import { useEffect, useState } from 'react';
import { Wrench, CheckCircle, Clock } from 'lucide-react';

interface Vuln {
  id: number;
  cve_id: string;
  severity: string;
  status: string;
  description: string;
}

export default function Remediation() {
  const [vulns, setVulns] = useState<Vuln[]>([]);

  const fetchVulns = () => {
    fetch('http://localhost:8000/api/vulnerabilities')
      .then(res => res.json())
      .then(data => setVulns(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchVulns();
  }, []);

  const markAsPatched = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/remediation/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PATCHED' })
      });
      fetchVulns(); // Refresh the list
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Remediation Tracker</h1>
        <p className="text-gray-400 text-sm mt-1">Manage and resolve active security threats</p>
      </div>

      <div className="grid gap-4">
        {vulns.map((vuln) => (
          <div key={vuln.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex justify-between items-center shadow-lg">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">{vuln.cve_id}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  vuln.status === 'PATCHED' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                }`}>
                  {vuln.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-2xl">{vuln.description}</p>
            </div>
            
            <div>
              {vuln.status === 'OPEN' ? (
                <button 
                  onClick={() => markAsPatched(vuln.id)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                >
                  <Wrench className="h-4 w-4" /> Apply Patch
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-5 py-2 rounded-lg font-medium border border-green-500/20">
                  <CheckCircle className="h-4 w-4" /> Resolved
                </div>
              )}
            </div>
          </div>
        ))}
        {vulns.length === 0 && <p className="text-gray-500">No vulnerabilities found.</p>}
      </div>
    </div>
  );
}