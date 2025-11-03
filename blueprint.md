# Leads Management Application

## Overview

This is a web application for managing sales leads. It allows users to view and manage leads, and administrators to manage users.

## Features

*   **Authentication:** Users can log in to the application.
*   **User Roles:** The application supports user roles, including "Super Admin".
*   **Leads Management:**
    *   View a list of leads.
    *   View the details of a specific lead.
    *   Create, edit, and delete leads.
    *   Data is stored in a PostgreSQL database and synchronized with a Google Sheet.
*   **Interaction Tracking:**
    *   View a list of interactions for each lead.
    *   Add new interactions for each lead.
    *   Interaction data is stored in a Google Sheet.
*   **User Management (Super Admin):** Super Admins can manage users.
*   **Dashboard:** A central page for users after they log in.
*   **Routing:** The application uses `react-router-dom` for navigation.

## Styling

The application uses Material-UI for its components and styling. It has a custom theme with a deep purple primary color and an amber secondary color. The background color is a light gray (`#f4f6f8`). Cards have a custom `border-radius` and `box-shadow`.

## Changelog

### 2024-05-24

*   **Refactor Google Sheets Integration:** Moved the Google Sheets API interaction from the client-side to a Firebase Function. This resolves build errors caused by using server-side libraries in the browser and improves the application's security and architecture.
*   **Fix Build Errors:** Resolved multiple build errors related to Material-UI `Grid` components and server-side module usage in the client bundle. Replaced `Grid` with `Box` and refactored server-side logic into a Firebase Function.

### 2024-05-23

*   **Interaction Tracking:** Added the ability to track interactions with leads. This includes viewing a list of interactions and adding new ones.
*   **Data Persistence:** Migrated lead management to a PostgreSQL database, with Google Sheets as a backup.

### 2024-05-22

*   **Project Initialization:** Set up the basic structure for the Leads Management Application.
*   **Bug Fix:** Fixed incorrect import paths in various files.
