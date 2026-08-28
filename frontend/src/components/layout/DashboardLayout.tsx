import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Server, ShieldAlert, GitGraph, BrainCircuit, Wrench, FileText } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Assets', href: '/assets', icon: Server },
  { name: 'Vulnerabilities', href: '/vulnerabilities', icon: ShieldAlert },
  { name: 'Attack Paths', href: '/attack-paths', icon: GitGraph },
  { name: 'Security Copilot', href: '/copilot', icon: BrainCircuit },
  { name: 'Remediation', href: '/remediation', icon: Wrench },
  { name: 'Reports', href: '/reports', icon: FileText },
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="flex items-center gap-3 p-6">
          <Shield className="h-8 w-8 text-blue-500" />
         <span className="text-xl font-bold tracking-widest uppercase">Rakshak AI</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-950 p-8">
        <Outlet />
      </main>
    </div>
  );
}