# License Manager Application

## Overview

This is a web application for managing software licenses. It allows users to view their licenses, and administrators to manage users and their roles.

## Features

*   **Authentication:** Users can log in to the application.
*   **User Roles:** The application supports three user roles:
    *   **Super Admin:** Can manage users and their roles.
    *   **Admin:** (Not yet fully implemented)
    *   **User:** Can view their own licenses.
*   **License Management:** Users can view a list of their licenses.
*   **User Management:** Super Admins can view a list of all users and edit their roles.
*   **Dashboard:** A central page for users after they log in.
*   **Routing:** The application uses `react-router-dom` for navigation.

## Styling

The application uses Material-UI for its components and styling. It has a custom theme with a deep purple primary color and an amber secondary color. The background color is a light gray (`#f4f6f8`). Cards have a custom `border-radius` and `box-shadow`.

## Changelog

### 2024-05-22

*   **Bug Fix:** Fixed incorrect import paths in the following files:
    *   `src/hooks/useAuth.ts`
    *   `src/pages/dashboard/DashboardPage.tsx`
    *   `src/components/auth/ProtectedRoute.tsx`
    *   `src/pages/user/MyLicensePage.tsx`
    *   `src/pages/user/ProfilePage.tsx`
    *   `src/components/layout/Layout.tsx`
    *   `src/pages/admin/UserManagementPage.tsx`
    *   `src/pages/admin/LicensesPage.tsx`
