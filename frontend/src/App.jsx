import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Login } from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { CertificateDetails } from './pages/CertificateDetails';
import { Settings } from './pages/Settings';
import { useAuthStore } from './stores/authStore';
import { Home } from './pages/Home';
import { supabase } from './services/supabase';

// Protected Route Guard
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated === null) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Public Route Guard: keeps authenticated users out of /login
const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated === null) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

function App() {
  const setSession = useAuthStore((state) => state.setSession);
  const signOutLocal = useAuthStore((state) => state.signOutLocal);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) signOutLocal();
      }
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [setSession, signOutLocal]);

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


