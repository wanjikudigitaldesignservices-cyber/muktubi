import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoginPage from '@/pages/LoginPage';

// Pages
import HQOverview from '@/pages/hq/HQOverview';
import HQCenters from '@/pages/hq/HQCenters';
import HQCatalog from '@/pages/hq/HQCatalog';
import CenterDashboard from '@/pages/center/CenterDashboard';
import MemberProfilePage from '@/pages/center/MemberProfilePage';
import StudentPortal from '@/pages/student/StudentPortal';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import PlaceholderPage from '@/pages/PlaceholderPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              
              {/* Super Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
                <Route path="/hq/*" element={<HQOverview />} />
                <Route path="/hq/centers/*" element={<HQCenters />} />
                <Route path="/hq/catalog/*" element={<HQCatalog />} />
                <Route path="/hq/reports/*" element={<PlaceholderPage title="HQ Reports" />} />
                <Route path="/hq/settings/*" element={<PlaceholderPage title="HQ Settings" />} />
              </Route>

              {/* Center Librarian Routes */}
              <Route element={<ProtectedRoute allowedRoles={['center_librarian']} />}>
                <Route path="/center/member/:memberId" element={<MemberProfilePage />} />
                <Route path="/center/*" element={<CenterDashboard />} />
              </Route>

              {/* Teacher Routes */}
              <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="/teacher/*" element={<TeacherDashboard />} />
              </Route>

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/*" element={<StudentPortal />} />
              </Route>

              {/* Fallback for authenticated users */}
              <Route path="/" element={<HomeRedirect />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Redirects users to their default dashboard based on role
import { useAuth } from '@/contexts/AuthContext';
function HomeRedirect() {
  const { getDefaultPath } = useAuth();
  return <Navigate to={getDefaultPath()} replace />;
}
