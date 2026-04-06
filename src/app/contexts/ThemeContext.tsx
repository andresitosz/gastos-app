// src/app/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    console.log('Tema cambiado a:', theme);
    
    if (theme === 'dark') {
      // Fondo general de la página
      document.body.style.backgroundColor = '#0f172a'; // slate-900
      document.body.style.color = '#f1f5f9'; // slate-100
      
      // Fondos de tarjetas (bg-white)
      const whiteCards = document.querySelectorAll('.bg-white');
      whiteCards.forEach(card => {
        (card as HTMLElement).style.backgroundColor = '#1e293b'; // slate-800
        (card as HTMLElement).style.borderColor = '#334155'; // slate-700
      });
      
      // Fondos de áreas grises (bg-gray-50, bg-gray-100)
      const grayAreas = document.querySelectorAll('.bg-gray-50, .bg-gray-100');
      grayAreas.forEach(area => {
        (area as HTMLElement).style.backgroundColor = '#0f172a'; // slate-900
      });
      
      // Bordes
      const borders = document.querySelectorAll('.border-gray-200, .border-gray-300');
      borders.forEach(border => {
        (border as HTMLElement).style.borderColor = '#334155';
      });
      
      // Textos grises
      const grayTexts = document.querySelectorAll('.text-gray-500, .text-gray-600, .text-gray-400');
      grayTexts.forEach(text => {
        (text as HTMLElement).style.color = '#94a3b8'; // slate-400
      });
      
      // Títulos oscuros
      const darkTexts = document.querySelectorAll('.text-gray-900');
      darkTexts.forEach(text => {
        (text as HTMLElement).style.color = '#f1f5f9';
      });
      
    } else {
      // Modo claro - resetear a los valores originales
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      
      const whiteCards = document.querySelectorAll('.bg-white');
      whiteCards.forEach(card => {
        (card as HTMLElement).style.backgroundColor = '';
        (card as HTMLElement).style.borderColor = '';
      });
      
      const grayAreas = document.querySelectorAll('.bg-gray-50, .bg-gray-100');
      grayAreas.forEach(area => {
        (area as HTMLElement).style.backgroundColor = '';
      });
      
      const borders = document.querySelectorAll('.border-gray-200, .border-gray-300');
      borders.forEach(border => {
        (border as HTMLElement).style.borderColor = '';
      });
      
      const grayTexts = document.querySelectorAll('.text-gray-500, .text-gray-600, .text-gray-400');
      grayTexts.forEach(text => {
        (text as HTMLElement).style.color = '';
      });
      
      const darkTexts = document.querySelectorAll('.text-gray-900');
      darkTexts.forEach(text => {
        (text as HTMLElement).style.color = '';
      });
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);