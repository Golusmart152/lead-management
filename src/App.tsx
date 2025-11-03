
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { deepPurple, amber } from '@mui/material/colors';
import { Box, CircularProgress } from '@mui/material';

import Layout from './components/layout/Layout';
import LeadsListPage from './pages/leads/LeadsListPage';
import LeadDetailPage from './pages/leads/LeadDetailPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminPage from './pages/admin/AdminPage';
import MyLicensePage from './pages/user/MyLicensePage';
import ProfilePage from './pages/user/ProfilePage';
import DashboardPage from './pages/dashboard/DashboardPage';

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[600],
    },
    secondary: {
      main: amber[500],
    },
    background: {
      default: '#f4f6f8'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.05)',
        }
      }
    }
  }
});

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {user ? (
            <Route path="/*" element={<Layout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="leads" element={<LeadsListPage />} />
              <Route path="leads/:leadId" element={<LeadDetailPage />} />

              {/* User Routes */}
              <Route path="my-license" element={<MyLicensePage />} />
              <Route path="profile" element={<ProfilePage />} />

              {/* Admin Route */}
              <Route element={<ProtectedRoute allowedRoles={['Super Admin']} />}>
                <Route path="admin" element={<AdminPage />} />
              </Route>

              {/* Redirect root to dashboard when logged in */}
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
          ) : (
            <>
              <Route path="/login" element={<LoginPage />} />
              {/* Redirect any other path to login if not authenticated */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
