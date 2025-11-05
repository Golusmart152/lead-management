import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, CircularProgress, Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './context/AuthProvider';

import { theme } from './theme';
import MainLayout from './modules/shared/layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';

const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('./modules/dashboard/pages/DashboardPage'));
const CustomerPage = lazy(() => import('./modules/customers/pages/CustomerPage'));
const ProductsPage = lazy(() => import('./modules/products/pages/ProductsPage'));
const EmployeesPage = lazy(() => import('./modules/employees/pages/EmployeesPage'));
const LeadKanbanPage = lazy(() => import('./modules/leads/pages/LeadKanbanPage'));
const ReportsPage = lazy(() => import('./modules/reports/ReportsPage'));
const SettingsPage = lazy(() => import('./modules/settings/pages/SettingsPage'));
const SupportPage = lazy(() => import('./modules/support/SupportPage'));
const LogListPage = lazy(() => import('./modules/logs/pages/LogListPage'));

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        }>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route 
                    path="/*" 
                    element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="customers" element={<CustomerPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="employees" element={<EmployeesPage />} />
                    <Route path="leads" element={<LeadKanbanPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="support" element={<SupportPage />} />
                    <Route path="admin/logs" element={<LogListPage />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
                <Router>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </Router>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
