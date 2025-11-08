# Dark Theme Toggle Guide

Your app now has a complete dark theme system with toggle functionality!

## How to Use the Dark Theme Toggle

### 1. **Theme Toggle Button**
- The toggle button is located in the header of your app
- It shows a **Sun icon** when in dark mode (click to switch to light)
- It shows a **Moon icon** when in light mode (click to switch to dark)

### 2. **Available Classes**
The system adds these CSS classes to the `<html>` element:
- `dark` and `dark-theme` for dark mode
- `light` and `light-theme` for light mode

### 3. **CSS Custom Properties**
All the new dark theme colors are available as CSS custom properties:
- `--gray-1` through `--gray-12` (solid colors)
- `--gray-a1` through `--gray-a12` (alpha variants)
- `--gray-contrast`, `--gray-surface`, etc.

### 4. **Usage in Components**
You can use the theme context in any component:

```tsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-1 text-gray-12' : 'bg-white text-black'}`}>
      Current theme: {theme}
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### 5. **Tailwind Classes**
All the new gray colors are available in Tailwind:
- `text-gray-1` through `text-gray-12`
- `bg-gray-1` through `bg-gray-12`
- And all other Tailwind utilities work with the new color scheme

### 6. **Persistence**
- The theme preference is saved in `localStorage`
- The system respects the user's system preference (prefers-color-scheme)
- Default theme is dark (as requested)

### 7. **P3 Display Support**
- The theme includes support for P3 displays
- Automatically enhanced colors for displays that support it

## Color Scheme Overview

**Dark Theme Colors:**
- Background: `#111113` (very dark gray)
- Primary: `#5f606a` (medium gray)
- Text: `#eeeef0` (light gray/white)
- Secondary: `#46484f` (dark gray)
- And 12 complete gray scales with alpha variants

The entire app automatically inherits these colors through the CSS custom properties and Tailwind configuration!