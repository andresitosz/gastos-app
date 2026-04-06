// src/app/components/History.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { ArrowLeft, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface MonthlyHistory {
  id: string;
  year: number;
  month: number;
  total_amount: number;
  transactions_data: any[];
}

export function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<MonthlyHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<MonthlyHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    if (!user) {
      console.log('No hay usuario logueado');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Cargando historial para usuario:', user.id);
      
      const { data, error } = await supabase
        .from('monthly_history')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }
      
      console.log('Datos recibidos:', data);
      console.log('Cantidad de registros:', data?.length || 0);
      
      setHistory(data || []);
      
      if (data?.length === 0) {
        console.log('No hay historial. La tabla monthly_history está vacía para este usuario.');
      }
      
    } catch (error: any) {
      console.error('Error cargando historial:', error);
      setError(error.message);
      toast.error('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Función para archivar el mes actual manualmente (para pruebas)
  const archiveCurrentMonth = async () => {
    if (!user) return;
    
    try {
      toast.loading('Archivando mes actual...');
      
      // Obtener gastos del mes actual
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const startOfMonth = new Date(year, today.getMonth(), 1);
      const endOfMonth = new Date(year, today.getMonth() + 1, 0);
      
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date_expense', startOfMonth.toISOString().split('T')[0])
        .lte('date_expense', endOfMonth.toISOString().split('T')[0]);
      
      if (expensesError) throw expensesError;
      
      const totalAmount = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
      
      const { error: insertError } = await supabase
        .from('monthly_history')
        .insert({
          user_id: user.id,
          year,
          month,
          total_amount: totalAmount,
          transactions_data: expenses || []
        });
      
      if (insertError) throw insertError;
      
      toast.dismiss();
      toast.success('Mes archivado correctamente');
      loadHistory(); // Recargar historial
      
    } catch (error: any) {
      toast.dismiss();
      console.error('Error archivando:', error);
      toast.error('Error al archivar: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Historial Mensual
            </h1>
          </div>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
            <p className="font-medium">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Lista de meses */}
        {history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Aún no hay historial de meses anteriores</p>
            <p className="text-sm text-gray-400 mt-2">
              Los meses se archivarán automáticamente cuando terminen
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={archiveCurrentMonth}
            >
              Archivar mes actual (prueba)
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              📊 {history.length} {history.length === 1 ? 'mes archivado' : 'meses archivados'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMonth(item)}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">
                      {monthNames[item.month - 1]} {item.year}
                    </h3>
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    ${(item.total_amount || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.transactions_data?.length || 0} gastos registrados
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal de detalles del mes */}
        {selectedMonth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b sticky top-0 bg-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    {monthNames[selectedMonth.month - 1]} {selectedMonth.year}
                  </h2>
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  Total: ${(selectedMonth.total_amount || 0).toLocaleString()}
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {selectedMonth.transactions_data && selectedMonth.transactions_data.length > 0 ? (
                  selectedMonth.transactions_data.map((expense: any, index: number) => {
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
                      <div key={expense.id || index} className="border-b py-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{expense.description || 'Sin descripción'}</span>
                          <span className="font-bold text-red-600">
                            ${(expense.amount || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                            {emoji} {expense.category || 'general'}
                          </span>
                          <span className="text-xs text-gray-400">
                            📅 {expense.date_expense ? new Date(expense.date_expense).toLocaleDateString() : 'Sin fecha'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 py-8">No hay detalles de gastos para este mes</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}