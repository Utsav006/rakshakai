import { useEffect, useState } from 'react';
import { Download, ShieldCheck } from 'lucide-react';

export default function Reports() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error(err));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!metrics) return <div className="text-gray-400">Compiling report data...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-white">Executive Reports</h1>
          <p className="text-gray-400 text-sm mt-1">Generate automated compliance and security posture summaries</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Export as PDF
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-lg print:bg-white print:border-none print:shadow-none" id="printable-report">
        <div className="flex items-center gap-3 border-b border-gray-800 print:border-gray-300 pb-6 mb-6">
          <ShieldCheck className="h-10 w-10 text-blue-500 print:text-blue-700" />
          <div>
            <h2 className="text-2xl font-bold text-white print:text-black">RakshakAI Security Posture Report</h2>
            <p className="text-gray-400 print:text-gray-600 text-sm">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-gray-400 print:text-gray-600 text-sm mb-1">Total Assets</p>
            <p className="text-2xl font-bold text-white print:text-black">{metrics.total_assets}</p>
          </div>
          <div>
            <p className="text-gray-400 print:text-gray-600 text-sm mb-1">Active Threats</p>
            <p className="text-2xl font-bold text-white print:text-black">{metrics.total_vulnerabilities}</p>
          </div>
          <div>
            <p className="text-gray-400 print:text-gray-600 text-sm mb-1">Critical Priority</p>
            <p className="text-2xl font-bold text-red-500 print:text-red-700">{metrics.critical_threats}</p>
          </div>
          <div>
            <p className="text-gray-400 print:text-gray-600 text-sm mb-1">Network Risk Index</p>
            <p className="text-2xl font-bold text-blue-500 print:text-blue-700">{metrics.average_risk_index} / 100</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white print:text-black mb-4">Executive Summary</h3>
          <p className="text-gray-300 print:text-gray-800 text-sm leading-relaxed">
            This automated report details the current security posture across all monitored infrastructure. 
            The current Network Risk Index is {metrics.average_risk_index}. All identified critical vulnerabilities 
            require immediate remediation to maintain compliance and prevent unauthorized access. 
            Refer to the active threat registry for detailed remediation steps and historical patch data.
          </p>
        </div>
      </div>
    </div>
  );
}