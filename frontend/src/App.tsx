import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Vulnerabilities from './pages/Vulnerabilities'; // <-- Import the new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="vulnerabilities" element={<Vulnerabilities />} /> {/* <-- Add the route here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;