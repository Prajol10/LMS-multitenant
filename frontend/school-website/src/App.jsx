import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import SchoolPage from './pages/SchoolPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/admin/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function RootPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const school = params.get('school');

  if (school) {
    return (
      <TenantProvider>
        <SchoolPage />
      </TenantProvider>
    );
  }

  return <LandingPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
        <Route path="/*" element={<RootPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
