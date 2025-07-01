"use client";

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { themeMode, toggleThemeMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleThemeMode}
      className="h-8 w-8 p-0"
    >
      {themeMode === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};