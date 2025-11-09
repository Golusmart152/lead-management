# Blueprint

## Overview

This document outlines the plan for updating the application's UI to a new design system. The new design system is based on a modern, dark, "glassmorphism" aesthetic. It includes a new color palette, typography, and component styles.

## Plan

The following steps will be taken to implement the new design system:

1.  **Update Core UI Components:**
    *   Update the `Card` component to use the new `card-bg-neo` class for the `glass` variant.
    *   Update the `Button` component to use the new `btn-accent` and `btn-link` styles.
    *   Update the `Input` component to use the new `bg-[#161b26]` and `border-[#21243b]` styles.
    *   Create a new `Textarea` component with the same styles as the `Input` component.

2.  **Refactor Existing Forms:**
    *   Refactor the `LoginPage` to use the new design system.
    *   Refactor the `CustomerForm` to use the new design system.
    *   Refactor the `EmployeeForm` to use the new design system.
    *   Refactor the `ProductForm` to use the new design system.

3.  **Update `blueprint.md`:**
    *   Update the `blueprint.md` file to reflect the changes made.
