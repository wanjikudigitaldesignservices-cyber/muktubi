// ============================================================
// MUKTUBI — Protected Route
// Handles role-based access control
// ============================================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/lib/types';
import { ROLES } from '@/lib/constants';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="login-page">
        <div className="empty-state">
          <div className="empty-state-title">Loading MUKTUBI...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    // Redirect to their default path if they try to access an unauthorized route
    return <Navigate to={ROLES[profile.role].defaultPath} replace />;
  }

  return <Outlet />;
}
