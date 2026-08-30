import { useEffect, useState } from 'react';
import { Server, Globe, ShieldAlert, Activity } from 'lucide-react';

// Define the shape of our data based on the backend model
interface Asset {
  id: number;
  name: string;
  asset_type: string;
  technology: string;
  criticality: number;
  internet_exposed: boolean;
  data_sensitivity: number;
}

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from live Render backend
    fetch('https://rakshak-backend-3kzw.onrender.com/api/assets/')
      .then((res) => res.json())
      .then((data) => {
        setAssets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching assets:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Asset Inventory</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Add Asset
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading assets from secure vault...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Server className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{asset.name}</h3>
                    <p className="text-sm text-gray-400 uppercase tracking-wider">{asset.asset_type}</p>
                  </div>
                </div>
                {asset.internet_exposed && (
                  <span className="flex items-center gap-1 text-xs font-medium bg-red-500/10 text-red-400 px-2 py-1 rounded-full">
                    <Globe className="h-3 w-3" />
                    Public
                  </span>
                )}
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Activity className="h-4 w-4"/> Technology</span>
                  <span className="text-gray-300">{asset.technology}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><ShieldAlert className="h-4 w-4"/> Criticality</span>
                  <span className="text-gray-300">Level {asset.criticality} / 5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><ShieldAlert className="h-4 w-4"/> Data Sensitivity</span>
                  <span className="text-gray-300">Level {asset.data_sensitivity} / 5</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}