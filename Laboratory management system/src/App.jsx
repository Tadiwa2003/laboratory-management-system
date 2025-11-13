import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/users/UserManagement';
import UserDetail from './pages/users/UserDetail';
import PatientManagement from './pages/patients/PatientManagement';
import PatientDetail from './pages/patients/PatientDetail';
import OrderManagement from './pages/orders/OrderManagement';
import OrderDetail from './pages/orders/OrderDetail';
import SpecimenManagement from './pages/specimens/SpecimenManagement';
import TestingProcess from './pages/testing/TestingProcess';
import ResultManagement from './pages/results/ResultManagement';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import Profile from './pages/profile/Profile';
import ToolbarPromptHandler from './components/toolbar/ToolbarPromptHandler';
import Welcome from './pages/Welcome';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { darkMode, setDarkMode } = useThemeStore();

  useEffect(() => {
    // Initialize theme from storage
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        if (theme.state?.darkMode) {
          setDarkMode(true);
        }
      } catch (e) {
        console.error('Error loading theme:', e);
      }
    }
  }, [setDarkMode]);

  return (
    <BrowserRouter>
      <ToolbarPromptHandler />
      <Routes>
        {/* Root path - show Welcome for unauthenticated, redirect to dashboard for authenticated */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Welcome />}
        />
        {/* Welcome page - explicit route */}
        <Route
          path="/welcome"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Welcome />}
        />
        {/* Login page */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        {/* Protected dashboard routes - all routes under /dashboard prefix */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
        {/* Other protected routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserManagement />} />
          <Route path=":id" element={<UserDetail />} />
        </Route>
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PatientManagement />} />
          <Route path=":id" element={<PatientDetail />} />
        </Route>
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OrderManagement />} />
          <Route path=":id" element={<OrderDetail />} />
        </Route>
        <Route
          path="/specimens"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SpecimenManagement />} />
          <Route path=":id" element={<SpecimenManagement />} />
        </Route>
        <Route
          path="/tests"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TestingProcess />} />
          <Route path=":id" element={<TestingProcess />} />
        </Route>
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ResultManagement />} />
          <Route path=":id" element={<ResultManagement />} />
        </Route>
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Reports />} />
        </Route>
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Settings />} />
        </Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
        </Route>
        {/* All other routes - redirect based on auth status */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
