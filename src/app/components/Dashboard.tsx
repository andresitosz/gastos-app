// src/app/components/Dashboard.tsx (versión con filtro alternativo)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Plus, LogOut, Loader2, Calendar } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Charts } from './Charts';
import { toast } from 'sonner';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
  const [allExpenses, setAllExpenses] = useState([]); // Para debugging

  const archivePreviousMonthIfNeeded = async () => {
  if (!user) return;
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  
  // Último mes que se archivó (guardado en localStorage)
  const lastArchived = localStorage.getItem(`last_archived_${user.id}`);
  const lastArchivedDate = lastArchived ? new Date(lastArchived) : null;
  
  // Si no hay registro o pasó más de un mes
  if (!lastArchivedDate || 
      lastArchivedDate.getFullYear() !== currentYear ||
      lastArchivedDate.getMonth() + 1 !== currentMonth) {
    
    // Verificar si ya existe un registro para este mes
    const { data: existing } = await supabase
      .from('monthly_history')
      .select('id')
      .eq('user_id', user.id)
      .eq('year', currentYear)
      .eq('month', currentMonth)
      .single();
    
    if (!existing) {
      // Obtener gastos del MES ANTERIOR (para archivar)
      const lastMonth = new Date(currentYear, currentMonth - 2, 1);
      const lastMonthYear = lastMonth.getFullYear();
      const lastMonthNumber = lastMonth.getMonth() + 1;
      
      const startDate = new Date(lastMonthYear, lastMonthNumber - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(lastMonthYear, lastMonthNumber, 0).toISOString().split('T')[0];
      
      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date_expense', startDate)
        .lte('date_expense', endDate);
      
      if (expenses && expenses.length > 0) {
        const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
        
        await supabase
          .from('monthly_history')
          .insert({
            user_id: user.id,
            year: lastMonthYear,
            month: lastMonthNumber,
            total_amount: totalAmount,
            expenses_data: expenses
          });
        
        console.log(`✅ Archivado automático: ${lastMonthNumber}/${lastMonthYear}`);
      }
      
      // Guardar que ya se archivó este mes
      localStorage.setItem(`last_archived_${user.id}`, new Date().toISOString());
    }
  }
};

// Llama esta función dentro del useEffect que ya tienes, antes de loadExpenses:
useEffect(() => {
  if (user) {
    archivePreviousMonthIfNeeded();  // ← Agregar esta línea
    loadExpenses();
  }
}, [user]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      
      // PRIMERO: Cargar TODOS los gastos del usuario (para debugging)
      const { data: allData, error: allError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id);

      if (allError) throw allError;
      
      console.log('📊 TOTAL de gastos en BD:', allData?.length || 0);
      console.log('📝 Primer gasto:', allData?.[0]);
      setAllExpenses(allData || []);
      
      // Calcular fechas del mes actual
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); // 0-11
      
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);
      
      // Formato YYYY-MM-DD para comparar
      const startDateStr = startOfMonth.toISOString().split('T')[0];
      const endDateStr = endOfMonth.toISOString().split('T')[0];
      
      console.log('📅 Filtrando desde:', startDateStr, 'hasta:', endDateStr);
      
      // Filtrar gastos del mes actual
      const gastosDelMes = allData?.filter(gasto => {
        if (!gasto.date_expense) return false;
        // La fecha puede venir en diferentes formatos
        const fechaGasto = new Date(gasto.date_expense);
        const fechaStr = fechaGasto.toISOString().split('T')[0];
        return fechaStr >= startDateStr && fechaStr <= endDateStr;
      }) || [];
      
      console.log('✅ Gastos encontrados este mes:', gastosDelMes.length);
      
      setExpenses(gastosDelMes);
      const total = gastosDelMes.reduce((sum, e) => sum + (e.amount || 0), 0);
      setCurrentMonthTotal(total);
      
      if (gastosDelMes.length === 0 && allData && allData.length > 0) {
        console.warn('⚠️ Tienes gastos pero NO son de este mes. Fechas de tus gastos:', 
          allData.map(g => g.date_expense));
        toast.info(`Tienes ${allData.length} gastos, pero ninguno es de ${monthNames[month]}`);
      }
      
    } catch (error) {
      console.error('❌ Error cargando gastos:', error);
      toast.error('Error al cargar gastos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const averageExpense = expenses.length > 0 ? currentMonthTotal / expenses.length : 0;
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const currentMonthName = monthNames[new Date().getMonth()];

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
            {/*<p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Mostrando gastos de {currentMonthName} {new Date().getFullYear()}
            </p>
            {/* Debug: mostrar total de gastos en BD 
            <p className="text-xs text-gray-400 mt-1">
              📊 Total en BD: {allExpenses.length} gastos | Este mes: {expenses.length}
            </p>*/}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link to="/add" className="flex-1 sm:flex-none">
              <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-5 w-5" />
                Nuevo Gasto
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-5 w-5" />
                Historial
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard title={`Total Gastado (${currentMonthName})`} amount={currentMonthTotal} type="expense" />
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
            <h2 className="text-base sm:text-lg font-bold">📋 Gastos de {currentMonthName}</h2>
          </div>
          <div className="divide-y">
            {expenses.length > 0 ? (
              expenses.map((expense) => {
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
                          📅 {expense.date_expense ? new Date(expense.date_expense).toLocaleDateString() : 'Sin fecha'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-red-600 text-sm sm:text-base">
                        ${(expense.amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No hay gastos registrados este mes</p>
                {allExpenses.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    Tienes {allExpenses.length} gasto(s) de otros meses.
                    El dashboard solo muestra el mes actual.
                  </p>
                )}
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