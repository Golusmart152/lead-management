
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './context/AuthProvider';

import MainLayout from './modules/shared/layouts/MainLayout';
import DashboardPage from './modules/dashboard/DashboardPage';
import CustomerListPage from './modules/customers/pages/CustomerListPage';
import CustomerDetailPage from './modules/customers/pages/CustomerDetailPage';
import ProductsPage from './modules/products/pages/ProductsPage';
import EmployeeListPage from './modules/employees/pages/EmployeeListPage';
import EmployeeDetailPage from './modules/employees/pages/EmployeeDetailPage';
import LeadsPage from './modules/leads/pages/LeadsPage';
import LeadDetailPage from './modules/leads/pages/LeadDetailPage';
import LogsPage from './modules/logs/pages/LogsPage';
import ReportsPage from './modules/reports/ReportsPage';
import SettingsPage from './modules/settings/pages/SettingsPage';
import SupportPage from './modules/support/SupportPage';
import RulesPage from './modules/rules/RulesPage';
import PrivateRoute from './components/PrivateRoute';

import { theme } from './theme';
import LoginPage from "./modules/auth/pages/LoginPage";

const AppRoutes: React.FC = () => {
    return (
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
                <Route path="customers" element={<CustomerListPage />} />
                <Route path="customers/:id" element={<CustomerDetailPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="employees" element={<EmployeeListPage />} />
                <Route path="employees/:id" element={<EmployeeDetailPage />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="leads/:id" element={<LeadDetailPage />} />
                <Route path="admin/logs" element={<LogsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="rules" element={<RulesPage />} />
            </Route>
        </Routes>
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
