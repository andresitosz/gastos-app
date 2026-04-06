// src/app/components/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Plus, LogOut, Loader2, Calendar } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Charts } from './Charts';
import { toast } from 'sonner';
import { ThemeToggle } from './ThemeToggle';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);
  const [currentMonthIncomes, setCurrentMonthIncomes] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const currentMonthName = monthNames[new Date().getMonth()];

  // Archivar mes anterior automáticamente
  const archivePreviousMonthIfNeeded = async () => {
    if (!user) return;
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    const lastArchived = localStorage.getItem(`last_archived_${user.id}`);
    const lastArchivedDate = lastArchived ? new Date(lastArchived) : null;
    
    if (!lastArchivedDate || 
        lastArchivedDate.getFullYear() !== currentYear ||
        lastArchivedDate.getMonth() + 1 !== currentMonth) {
      
      const { data: existing } = await supabase
        .from('monthly_history')
        .select('id')
        .eq('user_id', user.id)
        .eq('year', currentYear)
        .eq('month', currentMonth)
        .single();
      
      if (!existing) {
        const lastMonth = new Date(currentYear, currentMonth - 2, 1);
        const lastMonthYear = lastMonth.getFullYear();
        const lastMonthNumber = lastMonth.getMonth() + 1;
        
        const startDate = new Date(lastMonthYear, lastMonthNumber - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(lastMonthYear, lastMonthNumber, 0).toISOString().split('T')[0];
        
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .gte('date_expense', startDate)
          .lte('date_expense', endDate);
        
        if (transactionsData && transactionsData.length > 0) {
          const totalAmount = transactionsData.reduce((sum, t) => sum + t.amount, 0);
          
          await supabase
            .from('monthly_history')
            .insert({
              user_id: user.id,
              year: lastMonthYear,
              month: lastMonthNumber,
              total_amount: totalAmount,
              transactions_data: transactionsData
            });
          
          console.log(`✅ Archivado automático: ${lastMonthNumber}/${lastMonthYear}`);
        }
        
        localStorage.setItem(`last_archived_${user.id}`, new Date().toISOString());
      }
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      
      const { data: allData, error: allError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id);

      if (allError) throw allError;
      
      console.log('📊 Total transacciones:', allData?.length || 0);
      setAllTransactions(allData || []);
      
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);
      
      const startDateStr = startOfMonth.toISOString().split('T')[0];
      const endDateStr = endOfMonth.toISOString().split('T')[0];
      
      const transaccionesDelMes = allData?.filter(t => {
        if (!t.date_expense) return false;
        const fecha = new Date(t.date_expense);
        const fechaStr = fecha.toISOString().split('T')[0];
        return fechaStr >= startDateStr && fechaStr <= endDateStr;
      }) || [];
      
      setTransactions(transaccionesDelMes);
      
      // Calcular gastos e ingresos del mes
      const expenses = transaccionesDelMes
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const incomes = transaccionesDelMes
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      setCurrentMonthExpenses(expenses);
      setCurrentMonthIncomes(incomes);
      
    } catch (error) {
      console.error('❌ Error cargando transacciones:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      archivePreviousMonthIfNeeded();
      loadTransactions();
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

  const balance = currentMonthIncomes - currentMonthExpenses;
  const transactionCount = transactions.length;

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
              Gestor de Finanzas
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Hola, {user?.email}
            </p>
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Mostrando {currentMonthName} {new Date().getFullYear()}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             {/*<ThemeToggle />*/}
            <Link to="/add" className="flex-1 sm:flex-none">
              <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-5 w-5" />
                Nueva Transacción
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

        {/* Stats Cards - Actualizadas para mostrar ingresos y gastos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard title="💸 Gastos" amount={currentMonthExpenses} type="expense" />
          <StatsCard title="💵 Ingresos" amount={currentMonthIncomes} type="income" />
          <StatsCard 
            title="💰 Balance" 
            amount={balance} 
            type={balance >= 0 ? "income" : "expense"} 
          />
          <StatsCard title="📊 Transacciones" amount={transactionCount} type="balance" />
        </div>

        {/* Charts */}
        <div className="mb-6 sm:mb-8">
          <Charts transactions={transactions} />
        </div>

        {/* Lista de transacciones */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 sm:p-4 bg-gray-50 border-b">
            <h2 className="text-base sm:text-lg font-bold">📋 Transacciones de {currentMonthName}</h2>
          </div>
          <div className="divide-y">
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                const categoryEmojis: Record<string, string> = {
                  comida: '🍕', transporte: '🚗', servicios: '💡',
                  general: '📦', entretenimiento: '🎬', salud: '🏥',
                  educación: '📚', salario: '💰', freelance: '💻',
                  inversion: '📈', regalo: '🎁', reembolso: '🔄'
                };
                
                const emoji = categoryEmojis[transaction.category] || '📌';
                const isExpense = transaction.type === 'expense';
                
                return (
                  <div key={transaction.id} className="p-3 sm:p-4 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">
                        {transaction.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isExpense ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          {emoji} {transaction.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          📅 {transaction.date_expense ? new Date(transaction.date_expense).toLocaleDateString() : 'Sin fecha'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className={`font-bold text-sm sm:text-base ${
                        isExpense ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {isExpense ? '-' : '+'}${(transaction.amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No hay transacciones registradas este mes</p>
                <Link to="/add">
                  <Button variant="outline" className="mt-4">
                    Agregar tu primera transacción
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