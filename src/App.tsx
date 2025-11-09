import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { NotificationProvider } from './modules/notifications/NotificationProvider';

import MainLayout from './modules/shared/layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from './components/ui/toaster';
import BackgroundEffects from './components/BackgroundEffects';

const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('./modules/dashboard/pages/DashboardPageSimple'));
const CustomerPage = lazy(() => import('./modules/customers/pages/CustomerPage'));
const ProductsPage = lazy(() => import('./modules/products/pages/ProductsPage'));
const EmployeesPage = lazy(() => import('./modules/employees/pages/EmployeesPage'));
const LeadsPage = lazy(() => import('./modules/leads/pages/LeadsPage'));
const ReportsPage = lazy(() => import('./modules/reports/ReportsPage'));
const SettingsPage = lazy(() => import('./modules/settings/pages/SettingsPage'));
const SupportPage = lazy(() => import('./modules/support/SupportPage'));
const LogListPage = lazy(() => import('./modules/logs/pages/LogListPage'));

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-lg font-medium text-muted-foreground">Loading...</div>
    </div>
  </div>
);

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
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
                    <Route path="leads" element={<LeadsPage />} />
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
        <ThemeProvider>
            <Router>
                <NotificationProvider>
                    <AuthProvider>
                        <BackgroundEffects>
                            <AppRoutes />
                            <Toaster />
                        </BackgroundEffects>
                    </AuthProvider>
                </NotificationProvider>
            </Router>
        </ThemeProvider>
    );
};

export default App;
