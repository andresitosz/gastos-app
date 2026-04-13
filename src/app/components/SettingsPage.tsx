// src/app/components/SettingsPage.tsx
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { LogOut, Moon, Sun, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabaseClient';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await signOut();
    toast.success('Sesión cerrada');
  };

  const handleExport = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user?.id);
    
    const csv = [
      ['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto'],
      ...(data || []).map(t => [
        t.date_expense,
        t.description,
        t.category,
        t.type,
        t.amount
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mis-finanzas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exportado correctamente');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-6">⚙️ Ajustes</h1>
        
        <div className="space-y-4">
          {/* Tema */}
          <div className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span>Tema {theme === 'light' ? 'Claro' : 'Oscuro'}</span>
            </div>
            <Button onClick={toggleTheme} variant="outline" size="sm">
              Cambiar
            </Button>
          </div>
          
          {/* Exportar */}
          <div className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-green-600" />
              <span>Exportar datos (CSV)</span>
            </div>
            <Button onClick={handleExport} variant="outline" size="sm">
              Exportar
            </Button>
          </div>
          
          {/* Cerrar sesión */}
          <div className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-600" />
              <span>Cerrar sesión</span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Salir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}