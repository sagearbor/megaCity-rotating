import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ColorPalette {
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  border: {
    default: string;
    hover: string;
    active: string;
  };
  utilities: {
    water: string;
    power: string;
    sewage: string;
    data: string;
  };
}

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  colors: ColorPalette;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const getColorPalette = (isDarkMode: boolean): ColorPalette => ({
  bg: {
    primary: isDarkMode ? '#020617' : '#f8fafc',
    secondary: isDarkMode ? '#1e293b' : '#ffffff',
    tertiary: isDarkMode ? '#334155' : '#f1f5f9',
    overlay: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'
  },
  text: {
    primary: isDarkMode ? '#f8fafc' : '#0f172a',
    secondary: isDarkMode ? '#cbd5e1' : '#475569',
    tertiary: isDarkMode ? '#94a3b8' : '#64748b',
    accent: isDarkMode ? '#60a5fa' : '#3b82f6'
  },
  border: {
    default: isDarkMode ? '#334155' : '#e2e8f0',
    hover: isDarkMode ? '#475569' : '#cbd5e1',
    active: isDarkMode ? '#60a5fa' : '#3b82f6'
  },
  utilities: {
    water: isDarkMode ? '#06b6d4' : '#0891b2',
    power: isDarkMode ? '#fbbf24' : '#f59e0b',
    sewage: isDarkMode ? '#6b7280' : '#9ca3af',
    data: isDarkMode ? '#8b5cf6' : '#7c3aed'
  }
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('rotunda-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rotunda-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const colors = getColorPalette(isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
