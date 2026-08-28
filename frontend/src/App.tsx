import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Vulnerabilities from './pages/Vulnerabilities';
import Copilot from './pages/Copilot';
import AttackPaths from './pages/AttackPaths';
import Remediation from './pages/Remediation';
import Reports from './pages/Reports'; // <-- Import it here

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="vulnerabilities" element={<Vulnerabilities />} />
          <Route path="attack-paths" element={<AttackPaths />} />
          <Route path="copilot" element={<Copilot />} />
          <Route path="remediation" element={<Remediation />} />
          <Route path="reports" element={<Reports />} /> {/* <-- Add route here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;