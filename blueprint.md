# Lead Management App

## Overview

This is a simple lead management application built with React and Firebase. It allows users to create, view, edit, and delete leads. The application also includes features to manage employees, products, and services, and to track follow-ups for each lead.

## Features

*   **Lead Management:** Create, view, edit, and delete leads with a unique visible ID (e.g., L-00001).
*   **Employee Management:** Create, view, edit, and delete employees with a unique visible ID (e.g., E-00001).
*   **Product/Service Management:**
    *   Create, view, edit, and delete products and services with a unique visible ID (e.g., I-00001).
    *   Distinguish between "Product" and "Service" types.
    *   View detailed information for each product or service on a dedicated page.
*   **Follow-ups:** Add, view, edit, and delete follow-ups for each lead.
*   **Routing:** The application uses `react-router-dom` for navigation between different modules.
*   **Styling:** The application uses Material-UI for a modern and consistent look and feel.
*   **Firebase Integration:** The application uses Firebase for database and cloud functions.

## Current Plan

I have just implemented the requested changes for the "Products and Services" module. This includes adding a `type` field to distinguish between products and services, updating the visible ID to have a prefix of 'I', adding action buttons similar to the employees table, and creating a new detail page. The application is now ready for the next set of features or improvements.
