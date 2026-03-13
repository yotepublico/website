import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ThemeStyle = 'standard' | 'highcontrast';

interface ThemeContextType {
  theme: Theme;
  themeStyle: ThemeStyle;
  toggleTheme: () => void;
  setThemeStyle: (style: ThemeStyle) => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [themeStyle, setThemeStyleState] = useState<ThemeStyle>('standard');
  const [mounted, setMounted] = useState(false);

  // Cargar preferencias guardadas
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedStyle = localStorage.getItem('themeStyle') as ThemeStyle | null;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedStyle) setThemeStyleState(savedStyle);
    
    setMounted(true);
  }, []);

  // Aplicar tema al documento
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Aplicar tema claro/oscuro
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Aplicar estilo de tema
    root.classList.remove('theme-standard', 'theme-highcontrast');
    root.classList.add(`theme-${themeStyle}`);

    // Guardar preferencias
    localStorage.setItem('theme', theme);
    localStorage.setItem('themeStyle', themeStyle);

    // Actualizar meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      if (themeStyle === 'highcontrast') {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#FFFFFF' : '#000000');
      } else {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#1F2937' : '#E63946');
      }
    }
  }, [theme, themeStyle, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setThemeStyle = (style: ThemeStyle) => {
    setThemeStyleState(style);
  };

  const value: ThemeContextType = {
    theme,
    themeStyle,
    toggleTheme,
    setThemeStyle,
    switchable,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
}
