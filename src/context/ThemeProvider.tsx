import React, { useEffect, useState } from 'react';
import { ThemeContext, type ThemeContextType } from './ThemeContext';

type Theme = 'dark' | 'light';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'dark'; // Default to dark theme as requested
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark', 'light-theme', 'dark-theme');
    
    // Add the appropriate classes
    root.classList.add(theme, `${theme}-theme`);
    
    // Update localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const value: ThemeContextType = { theme, toggleTheme, setTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
