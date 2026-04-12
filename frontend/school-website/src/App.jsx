import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import SchoolPage from './pages/SchoolPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/admin/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function SchoolWrapper({ school }) {
  return (
    <TenantProvider schoolSlug={school}>
      <SchoolPage />
    </TenantProvider>
  );
}

function RootPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const school = params.get('school');
  if (school) {
    return (
      <TenantProvider schoolSlug={school}>
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
        <Route path="/superadmin/login" element={<LoginPage />} />
        <Route path="/superadmin" element={
          <ProtectedRoute requiredRole="SuperAdmin">
            <SuperAdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/:school/admin/dashboard" element={
          <ProtectedRoute requiredRole="SchoolAdmin">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/:school/admin" element={<LoginPage />} />
        <Route path="/:school" element={
          <SchoolRouteWrapper />
        } />
        <Route path="/" element={<RootPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function SchoolRouteWrapper() {
  const location = useLocation();
  const school = location.pathname.split('/')[1];
  return (
    <TenantProvider schoolSlug={school}>
      <SchoolPage />
    </TenantProvider>
  );
}

export default App;
