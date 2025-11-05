## CRM App Blueprint

### Overview

This document outlines the blueprint for a comprehensive Customer Relationship Management (CRM) application. The CRM is designed to streamline and enhance interactions with customers, leads, and internal teams, providing a centralized platform for managing all related data and workflows.

### Project Structure

The project follows a modular, feature-based architecture. The core application logic is located in the `src` directory, with each feature encapsulated in its own subdirectory within `src/modules`.

-   **`src/components`**: Contains shared, reusable components used across multiple features (e.g., `Header`, `Sidebar`, `Layout`).
-   **`src/context`**: Holds React context providers for global state management (e.g., `AuthContext`).
-   **`src/firebase`**: Includes Firebase configuration and initialization code.
-   **`src/hooks`**: Contains custom React hooks for shared logic.
-   **`src/modules`**: The heart of the application, where each feature module resides. Each module typically contains:
    -   `components`: Feature-specific React components.
    -   `pages`: Top-level components for the feature's routes.
    -   `services`: Data access and business logic for the feature.
    -   `types`: TypeScript type definitions for the feature.
-   **`src/pages`**: Contains top-level pages for the application (e.g., `Dashboard`, `LoginPage`).
-   **`src/services`**: Contains global services used across the application.
-   **`server`**: Contains backend server code.

### File Inventory

- `src/App.css`
- `src/App.tsx`
- `src/assets/react.svg`
- `src/components/AddNewItemModal.tsx`
- `src/components/ConfirmationDialog.tsx`
- `src/components/leads/FollowUp.tsx`
- `src/components/PrivateRoute.tsx`
- `src/context/AuthContext.ts`
- `src/context/AuthContext.tsx`
- `src/context/AuthProvider.tsx`
- `src/firebase/config.ts`
- `src/hooks/useAuth.ts`
- `src/index.css`
- `src/main.tsx`
- `src/models/follow-up.ts`
- `src/modules/admin/components/EditUserModal.tsx`
- `src/modules/admin/pages/UserManagementPage.tsx`
- `src/modules/auth/pages/LoginPage.tsx`
- `src/modules/customers/components/CustomerForm.tsx`
- `src/modules/customers/pages/CustomerPage.tsx`
- `src/modules/customers/services/customer-service.ts`
- `src/modules/customers/types.ts`
- `src/modules/dashboard/pages/DashboardPage.tsx`
- `src/modules/departments/pages/DepartmentsPage.tsx`
- `src/modules/departments/services/department-service.ts`
- `src/modules/employees/components/EmployeeForm.tsx`
- `src/modules/employees/components/EmployeesTable.tsx`
- `src/modules/employees/pages/EmployeesPage.tsx`
- `src/modules/employees/services/employee-service.ts`
- `src/modules/employees/types/index.ts`
- `src/modules/employees/views/EmployeeList.tsx`
- `src/modules/leads/components/EditFollowUpModal.tsx`
- `src/modules/leads/components/EditLeadModal.tsx`
- `src/modules/leads/components/FollowUpForm.tsx`
- `src/modules/leads/components/FollowUpModal.tsx`
- `src/modules/leads/components/FollowUpSection.tsx`
- `src/modules/leads/components/LeadCard.tsx`
- `src/modules/leads/components/LeadColumn.tsx`
- `src/modules/leads/components/LeadDetailModal.tsx`
- `src/modules/leads/components/LeadForm.tsx`
- `src/modules/leads/components/LeadKanbanBoard.tsx`
- `src/modules/leads/pages/LeadKanbanPage.tsx`
- `src/modules/leads/pages/ScheduledTasksPage.tsx`
- `src/modules/leads/services/lead-service.ts`
- `src/modules/leads/types/Lead.ts
- `src/modules/logs/pages/LogListPage.tsx`
- `src/modules/logs/types/Log.ts`
- `src/modules/logs/types.ts`
- `src/modules/notifications/NotificationContext.ts`
- `src/modules/notifications/useNotification.ts`
- `src/modules/products/components/ProductForm.tsx`
- `src/modules/products/pages/ProductsPage.tsx`
- `src/modules/products/services/product-service.ts`
- `src/modules/products/types/index.ts`
- `src/modules/products/types/Product.ts`
- `src/modules/reports/ReportsPage.tsx`
- `src/modules/roles/services/role-service.ts`
- `src/modules/search/components/SearchComponent.tsx`
- `src/modules/search/services/search-service.ts`
- `src/modules/search/types.ts`
- `src/modules/settings/pages/SettingsPage.tsx`
- `src/modules/shared/components/Header.tsx`
- `src/modules/shared/components/Sidebar.tsx`
- `src/modules/shared/layouts/MainLayout.tsx`
- `src/modules/support/SupportPage.tsx`
- `src/services/db-service.ts`
- `src/services/follow-up-service.ts`
- `src/services/google-sheets-service.ts`
- `src/services/id-service.ts`
- `src/services/interaction-service.ts`
- `src/services/sync-service.ts`
- `src/services/user-service.ts`
- `src/theme.ts`
- `src/types/index.ts`
- `src/types/user.ts`
- `src/types.ts`
- `src/utils/idGenerator.ts`


### Core Modules

-   **Dashboard:** (`src/modules/dashboard`) A central hub providing an at-a-glance overview of key metrics, including sales performance, lead conversion rates, and recent activities. It features interactive charts and data visualizations for quick insights.

-   **Customers:** (`src/modules/customers`) This module allows for the management of all customer information, including contact details, interaction history, and associated sales. It supports searching, filtering, and creating new customer profiles.

-   **Products:** (`src/modules/products`) Enables the creation and management of products and services offered by the business. Each entry includes details such as pricing, category, and description, and can be designated as either a product or a service.

-   **Employees:** (`src/modules/employees`) This module manages employee information, including their roles, departments, and contact details. It helps in assigning responsibilities and tracking internal team structures.

-   **Departments:** (`src/modules/departments`) Manages the different departments within the organization.

-   **Leads:** (`src/modules/leads`) A dedicated section for tracking potential customers. It includes a Kanban-style board for visualizing the sales pipeline, with stages such as "New," "In-Progress," "Converted," and "Lost." Each lead can have associated follow-ups and interaction logs.

-   **Roles:** (`src/modules/roles`) Manages user roles and permissions.

-   **Admin:** (`src/modules/admin`) Provides administrative functionalities, such as user management.

-   **Authentication:** (`src/modules/auth`) Handles user authentication. The signup functionality has been removed. For development purposes, a temporary super admin login is available. The full authentication module will be integrated later with a license app.

-   **Profile:** (`src/modules/profile`) Allows users to manage their own profiles.

-   **Logs:** (`src/modules/logs`) A page for viewing system logs, with options to filter by log level (info, warning, error), user, and date range. Logs can also be exported to a CSV file.

-   **Search:** (`src/modules/search`) A global search module that allows users to quickly find information across all modules of the application, including customers, products, employees, and leads.

-   **Reports:** (`src/modules/reports`) A section for generating and viewing various reports related to sales, customers, and other business activities.

-   **Settings:** (`src/modules/settings`) Allows users to configure application settings, such as personal preferences and system-wide configurations.

-   **Support:** (`src/modules/support`) Provides access to help documentation, FAQs, and a way to contact customer support.

### UI and Navigation

-   **Main Layout:** (`src/modules/shared/layouts/MainLayout.tsx`) The application now uses a responsive main layout with a persistent sidebar on desktop and a temporary drawer on mobile devices.
-   **Header:** (`src/modules/shared/components/Header.tsx`) A new `Header` component provides a consistent application header with a title, a user menu, and a toggle button for the mobile sidebar.
-   **Sidebar:** (`src/modules/shared/components/Sidebar.tsx`) A new `Sidebar` component offers navigation to all core modules of the application. It's designed to be responsive and intuitive.
-   **Enhanced Dashboard:** The dashboard has been redesigned to be more informative and visually appealing, featuring stat cards and charts for key metrics.

### Key Features

-   **Dynamic Forms:** All data entry is handled through intuitive and responsive forms, allowing for seamless creation and editing of records.
-   **Real-time Notifications:** (`src/modules/notifications`) A built-in notification system provides real-time feedback on actions such as creating, updating, or deleting records.
-   **Advanced Search and Filtering:** Most modules include robust search and filtering capabilities, making it easy to locate specific information.
-   **Data Visualization:** The dashboard and other sections will feature charts and graphs to provide clear, visual representations of data.
-   **Responsive Design:** The application is designed to be fully responsive, ensuring a seamless experience across desktops, tablets, and mobile devices.
-   **Lead Management:** A new Kanban board view has been added for managing leads. This allows users to visualize their sales pipeline and move leads through different stages by dragging and dropping them. This feature is powered by `@hello-pangea/dnd`.
