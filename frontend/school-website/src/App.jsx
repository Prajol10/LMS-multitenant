import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import SchoolPage from './pages/SchoolPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/admin/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="SchoolAdmin">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/superadmin" element={
          <ProtectedRoute requiredRole="SuperAdmin">
            <SuperAdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/*" element={
          <TenantProvider>
            <SchoolPage />
          </TenantProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
