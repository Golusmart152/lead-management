
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { deepPurple, amber } from '@mui/material/colors';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { NotificationProvider } from './modules/notifications/NotificationProvider';

// Lazy load components
const Layout = lazy(() => import('./components/layout/Layout'));
const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('./modules/dashboard/DashboardPage'));
const LeadsListPage = lazy(() => import('./modules/leads/pages/LeadsListPage'));
const LeadDetailPage = lazy(() => import('./modules/leads/pages/LeadDetailPage'));
const EmployeeListPage = lazy(() => import('./modules/employees/pages/EmployeeListPage'));
const EmployeeDetailPage = lazy(() => import('./modules/employees/pages/EmployeeDetailPage'));
const ProductServiceListPage = lazy(() => import('./modules/products/pages/ProductServiceListPage'));
const ProductServiceDetailPage = lazy(() => import('./modules/products/pages/ProductServiceDetailPage'));
const LicensePage = lazy(() => import('./modules/license/pages/LicensePage'));
const ProfilePage = lazy(() => import('./modules/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('./modules/profile/pages/SettingsPage'));
const AdminPage = lazy(() => import('./modules/admin/pages/AdminPage'));
const RolesPage = lazy(() => import('./modules/roles/pages/RolesPage'));
const DepartmentsPage = lazy(() => import('./modules/departments/pages/DepartmentsPage'));

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[600],
    },
    secondary: {
      main: amber[500],
    },
    background: {
      default: '#f4f5f7',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px, rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
        },
      },
    },
  },
});

interface PrivateRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'Super Admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/*" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="leads" element={<LeadsListPage />} />
        <Route path="leads/:leadId" element={<LeadDetailPage />} />
        <Route path="employees" element={<EmployeeListPage />} />
        <Route path="employees/:id" element={<EmployeeDetailPage />} />
        <Route path="products" element={<ProductServiceListPage />} />
        <Route path="products/:id" element={<ProductServiceDetailPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="my-license" element={<LicensePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

const SuspenseFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Suspense fallback={<SuspenseFallback />}>
              <AppRoutes />
            </Suspense>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
