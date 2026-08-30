import { useEffect, useState } from 'react';
import { ShieldAlert, Server, Activity, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardMetrics {
  total_assets: number;
  total_vulnerabilities: number;
  critical_threats: number;
  average_risk_index: number;
  recent_alerts: any[];
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    fetch('https://rakshak-backend-3kzw.onrender.com/api/dashboard/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error(err));
  }, []);

  if (!metrics) return <div className="text-gray-400">Loading telemetry...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Security Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time posture and threat intelligence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Assets</p>
              <h2 className="text-3xl font-bold text-white mt-2">{metrics.total_assets}</h2>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><Server className="h-6 w-6"/></div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Active Threats</p>
              <h2 className="text-3xl font-bold text-white mt-2">{metrics.total_vulnerabilities}</h2>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400"><Activity className="h-6 w-6"/></div>
          </div>
        </div>

        <div className="bg-gray-900 border border-red-500/30 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-red-400 font-medium text-sm">Critical Priority</p>
              <h2 className="text-3xl font-bold text-red-500 mt-2">{metrics.critical_threats}</h2>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg text-red-500"><ShieldAlert className="h-6 w-6"/></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-300 text-sm">Network Risk Index</p>
              <h2 className="text-3xl font-bold text-white mt-2">{metrics.average_risk_index} <span className="text-sm text-gray-500">/ 100</span></h2>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg text-red-400 animate-pulse"><Flame className="h-6 w-6"/></div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Top Priority Alerts</h2>
          <Link to="/vulnerabilities" className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</Link>
        </div>
        <div className="divide-y divide-gray-800">
          {metrics.recent_alerts.map((alert, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-800/50 transition-colors flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">{alert.cve_id} <span className="text-gray-500 text-sm ml-2">on {alert.asset_name}</span></h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-full text-sm">Score: {alert.risk_score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}