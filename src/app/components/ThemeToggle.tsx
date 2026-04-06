// src/app/components/ThemeToggle.tsx
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    console.log('Botón clickeado, tema actual:', theme);
    toggleTheme();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      className="rounded-full"
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}