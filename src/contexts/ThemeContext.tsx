"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ColorTheme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'teal' | 'indigo' | 'amber' | 'emerald' | 'rose' | 'cyan' | 'violet' | 'lime' | 'slate';
export type ThemeMode = 'light' | 'dark';
export type BackgroundTheme = 'default' | 'paper' | 'warm' | 'cool' | 'contrast' | 'soft' | 'vibrant' | 'minimal';

interface ThemeContextType {
  colorTheme: ColorTheme;
  themeMode: ThemeMode;
  backgroundTheme: BackgroundTheme;
  setColorTheme: (theme: ColorTheme) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setBackgroundTheme: (theme: BackgroundTheme) => void;
  toggleThemeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('default');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedColorTheme = localStorage.getItem('color-theme') as ColorTheme;
    const savedThemeMode = localStorage.getItem('theme-mode') as ThemeMode;
    const savedBackgroundTheme = localStorage.getItem('background-theme') as BackgroundTheme;
    
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
    
    if (savedThemeMode) {
      setThemeMode(savedThemeMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(prefersDark ? 'dark' : 'light');
    }
    
    if (savedBackgroundTheme) {
      setBackgroundTheme(savedBackgroundTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('dark', 'theme-default', 'theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-red', 'theme-pink', 'theme-teal', 'theme-indigo', 'theme-amber', 'theme-emerald', 'theme-rose', 'theme-cyan', 'theme-violet', 'theme-lime', 'theme-slate');
    root.classList.remove('bg-default', 'bg-paper', 'bg-warm', 'bg-cool', 'bg-contrast', 'bg-soft', 'bg-vibrant', 'bg-minimal');
    
    // Add current theme classes
    if (themeMode === 'dark') {
      root.classList.add('dark');
    }
    root.classList.add(`theme-${colorTheme}`);
    root.classList.add(`bg-${backgroundTheme}`);
    
    // Save to localStorage
    localStorage.setItem('color-theme', colorTheme);
    localStorage.setItem('theme-mode', themeMode);
    localStorage.setItem('background-theme', backgroundTheme);
  }, [colorTheme, themeMode, backgroundTheme]);

  const toggleThemeMode = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    colorTheme,
    themeMode,
    backgroundTheme,
    setColorTheme,
    setThemeMode,
    setBackgroundTheme,
    toggleThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};