// src/app/components/BottomNavBar.tsx
import { Link, useLocation } from 'react-router-dom';
import { Home, ChartNoAxesCombined, Plus, History, Settings } from 'lucide-react';

export function BottomNavBar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/stats', icon: ChartNoAxesCombined, label: 'Estadísticas' },
    { path: '/add', icon: Plus, label: 'Agregar' },
    { path: '/history', icon: History, label: 'Historial' },
    { path: '/settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-lg z-50">
      <div className="flex justify-around items-center py-2 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}