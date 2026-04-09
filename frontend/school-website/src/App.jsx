import React from 'react';
import { TenantProvider } from './context/TenantContext';
import SchoolPage from './pages/SchoolPage';

function App() {
  return (
    <TenantProvider>
      <SchoolPage />
    </TenantProvider>
  );
}

export default App;
