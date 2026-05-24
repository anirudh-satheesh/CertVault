import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Login } from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { CertificateDetails } from './pages/CertificateDetails';
import { Settings } from './pages/Settings';
import { useAuthStore } from './stores/authStore';
import { Home } from './pages/Home';


// Protected Route Guard
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Public Route Guard: keeps authenticated users out of /login
const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing (ALWAYS public) */}
        <Route path="/" element={<Home />} />

        {/* Public Login (guest-only) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="upload" element={<Upload />} />
            <Route path="certificate/:id" element={<CertificateDetails />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Redirect unknown routes back to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;

