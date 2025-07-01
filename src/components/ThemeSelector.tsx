"use client";

import React, { useState } from 'react';
import { useTheme, ColorTheme, BackgroundTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Palette, Sun, Moon, Check, Sparkles } from 'lucide-react';

const colorThemes: { id: ColorTheme; name: string; colors: { light: string; dark: string } }[] = [
  {
    id: 'default',
    name: 'Default',
    colors: { light: 'bg-slate-100', dark: 'bg-slate-800' }
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    colors: { light: 'bg-blue-100', dark: 'bg-blue-800' }
  },
  {
    id: 'green',
    name: 'Forest Green',
    colors: { light: 'bg-green-100', dark: 'bg-green-800' }
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    colors: { light: 'bg-purple-100', dark: 'bg-purple-800' }
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    colors: { light: 'bg-orange-100', dark: 'bg-orange-800' }
  },
  {
    id: 'red',
    name: 'Ruby Red',
    colors: { light: 'bg-red-100', dark: 'bg-red-800' }
  },
  {
    id: 'pink',
    name: 'Cherry Blossom',
    colors: { light: 'bg-pink-100', dark: 'bg-pink-800' }
  },
  {
    id: 'teal',
    name: 'Tropical Teal',
    colors: { light: 'bg-teal-100', dark: 'bg-teal-800' }
  },
  {
    id: 'indigo',
    name: 'Midnight Indigo',
    colors: { light: 'bg-indigo-100', dark: 'bg-indigo-800' }
  },
  {
    id: 'amber',
    name: 'Golden Amber',
    colors: { light: 'bg-amber-100', dark: 'bg-amber-800' }
  },
  {
    id: 'emerald',
    name: 'Emerald Gem',
    colors: { light: 'bg-emerald-100', dark: 'bg-emerald-800' }
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    colors: { light: 'bg-rose-100', dark: 'bg-rose-800' }
  },
  {
    id: 'cyan',
    name: 'Arctic Cyan',
    colors: { light: 'bg-cyan-100', dark: 'bg-cyan-800' }
  },
  {
    id: 'violet',
    name: 'Mystic Violet',
    colors: { light: 'bg-violet-100', dark: 'bg-violet-800' }
  },
  {
    id: 'lime',
    name: 'Electric Lime',
    colors: { light: 'bg-lime-100', dark: 'bg-lime-800' }
  },
  {
    id: 'slate',
    name: 'Storm Slate',
    colors: { light: 'bg-slate-200', dark: 'bg-slate-700' }
  }
];

const backgroundThemes: { id: BackgroundTheme; name: string; description: string; preview: { light: string; dark: string } }[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard clean background',
    preview: { light: 'bg-white', dark: 'bg-gray-900' }
  },
  {
    id: 'paper',
    name: 'Paper',
    description: 'Warm paper-like texture',
    preview: { light: 'bg-amber-50', dark: 'bg-amber-950' }
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Cozy warm tones',
    preview: { light: 'bg-orange-50', dark: 'bg-orange-950' }
  },
  {
    id: 'cool',
    name: 'Cool',
    description: 'Refreshing cool tones',
    preview: { light: 'bg-blue-50', dark: 'bg-blue-950' }
  },
  {
    id: 'contrast',
    name: 'High Contrast',
    description: 'Maximum readability',
    preview: { light: 'bg-gray-50', dark: 'bg-black' }
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Gentle muted background',
    preview: { light: 'bg-gray-25', dark: 'bg-gray-925' }
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Energetic bright background',
    preview: { light: 'bg-gradient-to-br from-blue-50 to-purple-50', dark: 'bg-gradient-to-br from-blue-950 to-purple-950' }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean minimal look',
    preview: { light: 'bg-neutral-25', dark: 'bg-neutral-975' }
  }
];

export const ThemeSelector: React.FC = () => {
  const { colorTheme, themeMode, backgroundTheme, setColorTheme, setBackgroundTheme, toggleThemeMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'colors' | 'special'>('appearance');

  const tabs = [
    { id: 'appearance' as const, label: 'Appearance', icon: Sun },
    { id: 'colors' as const, label: 'Colors', icon: Palette },
    { id: 'special' as const, label: 'Special', icon: Sparkles },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 w-7 p-0 flex items-center justify-center">
          <Palette className="w-3.5 h-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Settings
          </DialogTitle>
          <DialogDescription>
            Customize your experience with appearance, colors, and special effects
          </DialogDescription>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Light & Dark Mode</h3>
                <p className="text-sm text-muted-foreground mb-4">Choose your preferred brightness level</p>
              </div>
              <div className="flex gap-3">
                <Card
                  className={`flex-1 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    themeMode === 'light' ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-md'
                  }`}
                  onClick={() => themeMode === 'dark' && toggleThemeMode()}
                >
                  <CardContent className="p-6 text-center">
                    <Sun className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
                    <h4 className="font-semibold mb-1">Light Mode</h4>
                    <p className="text-xs text-muted-foreground">Bright and clear interface</p>
                    {themeMode === 'light' && (
                      <Check className="w-5 h-5 text-primary mx-auto mt-2" />
                    )}
                  </CardContent>
                </Card>
                <Card
                  className={`flex-1 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    themeMode === 'dark' ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-md'
                  }`}
                  onClick={() => themeMode === 'light' && toggleThemeMode()}
                >
                  <CardContent className="p-6 text-center">
                    <Moon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                    <h4 className="font-semibold mb-1">Dark Mode</h4>
                    <p className="text-xs text-muted-foreground">Easy on the eyes</p>
                    {themeMode === 'dark' && (
                      <Check className="w-5 h-5 text-primary mx-auto mt-2" />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Color Themes</h3>
                <p className="text-sm text-muted-foreground mb-4">Select your favorite color palette</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {colorThemes.map((theme) => (
                  <Card
                    key={theme.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      colorTheme === theme.id
                        ? 'ring-2 ring-primary shadow-md'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setColorTheme(theme.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{theme.name}</span>
                        {colorTheme === theme.id && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex gap-1">
                        <div className={`w-6 h-6 rounded-full ${theme.colors.light} border border-gray-300`} />
                        <div className={`w-6 h-6 rounded-full ${theme.colors.dark} border border-gray-300`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Special Tab */}
          {activeTab === 'special' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Special Effects</h3>
                <p className="text-sm text-muted-foreground mb-4">Unique background styles and atmospheres</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {backgroundThemes.map((theme) => (
                  <Card
                    key={theme.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      backgroundTheme === theme.id
                        ? 'ring-2 ring-primary shadow-md'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setBackgroundTheme(theme.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{theme.name}</span>
                        {backgroundTheme === theme.id && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{theme.description}</p>
                      <div className="flex gap-2">
                        <div className={`w-5 h-5 rounded ${theme.preview.light} border border-gray-300`} />
                        <div className={`w-5 h-5 rounded ${theme.preview.dark} border border-gray-300`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};