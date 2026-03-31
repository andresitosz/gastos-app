// src/app/components/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Plus, LogOut, Loader2 } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Charts } from './Charts';
import { toast } from 'sonner';

// src/app/utils/formatCurrency.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id)
        .order('id', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar gastos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gestor de Gastos
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Hola, {user?.email}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link to="/add" className="flex-1 sm:flex-none">
              <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-5 w-5" />
                Nuevo Gasto
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard title="Total Gastado" amount={totalExpenses} type="expense" />
          <StatsCard title="Promedio por gasto" amount={averageExpense} type="balance" />
          <StatsCard title="Número de gastos" amount={expenses.length} type="income" />
        </div>

        {/* Charts */}
        <div className="mb-6 sm:mb-8">
          <Charts expenses={expenses} />
        </div>

        {/* Lista de gastos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
  <div className="p-3 sm:p-4 bg-gray-50 border-b">
    <h2 className="text-base sm:text-lg font-bold">📋 Lista de Gastos</h2>
  </div>
  <div className="divide-y">
    {expenses.length > 0 ? (
      expenses.map((expense) => {
        // Mapeo de emojis por categoría
        const categoryEmojis: Record<string, string> = {
          comida: '🍕',
          transporte: '🚗',
          servicios: '💡',
          general: '📦',
          entretenimiento: '🎬',
          salud: '🏥',
          educación: '📚'
        };
        
        const emoji = categoryEmojis[expense.category] || '📌';
        
        return (
                  <div key={expense.id} className="p-3 sm:p-4 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">
                        {expense.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                          {emoji} {expense.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          📅 {new Date(expense.date_expense).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-red-600 text-sm sm:text-base">
                        ${expense.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No hay gastos registrados</p>
                <Link to="/add">
                  <Button variant="outline" className="mt-4">
                    Agregar tu primer gasto
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}