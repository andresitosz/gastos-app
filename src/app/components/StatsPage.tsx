// src/app/components/StatsPage.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function StatsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date_expense', { ascending: false });
      
      setTransactions(data || []);
      
      // Agrupar por mes
      const monthly = (data || []).reduce((acc: any, t) => {
        const month = new Date(t.date_expense).toLocaleString('es', { month: 'short' });
        if (!acc[month]) acc[month] = { month, gastos: 0, ingresos: 0 };
        if (t.type === 'expense') acc[month].gastos += t.amount;
        else acc[month].ingresos += t.amount;
        return acc;
      }, {});
      
      setMonthlyData(Object.values(monthly));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');
  
  const categoryTotals = expenses.reduce((acc: any, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name: name === 'comida' ? '🍕 Comida' :
          name === 'transporte' ? '🚗 Transporte' :
          name === 'servicios' ? '💡 Servicios' :
          name === 'entretenimiento' ? '🎬 Entretenimiento' : name,
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pb-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-6">📊 Estadísticas</h1>
        
        {/* Totales */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">💸 Total Gastos</p>
            <p className="text-xl font-bold text-red-600">
              ${expenses.reduce((s, t) => s + t.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">💵 Total Ingresos</p>
            <p className="text-xl font-bold text-green-600">
              ${incomes.reduce((s, t) => s + t.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Gráfico de categorías */}
        <div className="bg-white rounded-xl p-4 shadow mb-6">
          <h2 className="font-semibold mb-4">📊 Gastos por Categoría</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" dataKey="value" label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `$${v?.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">No hay datos</p>
          )}
        </div>
        
        {/* Evolución mensual */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold mb-4">📈 Evolución Mensual</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => `$${v?.toLocaleString()}`} />
                <Bar dataKey="gastos" name="Gastos" fill="#ef4444" />
                <Bar dataKey="ingresos" name="Ingresos" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">No hay datos</p>
          )}
        </div>
      </div>
    </div>
  );
}