import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date_expense: string;
  create_at: string;
}

interface ChartsProps {
  expenses: Expense[];
}

const categoryColors: Record<string, string> = {
  comida: '#22C55E',
  transporte: '#F59E0B',
  servicios: '#14B8A6',
  general: '#8B5CF6',
  entretenimiento: '#EC4899',
  salud: '#EF4444',
  educación: '#6366F1'
};

export function Charts({ expenses }: ChartsProps) {
  // Si no hay gastos, mostrar mensaje
  if (!expenses || expenses.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 py-8">
              No hay gastos registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 py-8">
              No hay datos para mostrar
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Agrupar gastos por categoría
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
    color: categoryColors[category] || '#6B7280',
  }));

  // Datos para gastos por día (últimos 7 días)
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyData = last7Days.map(date => {
    const total = expenses
      .filter(e => e.date_expense === date)
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      date: new Date(date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      total: Number(total) || 0  // Asegurar que sea número
    };
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Verificar si hay datos para el gráfico de barras
  const hasBarData = dailyData.some(d => d.total > 0);

  return (
    <div className="space-y-6">
      {/* Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>💰 Total Gastado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {expenses.length} {expenses.length === 1 ? 'gasto' : 'gastos'} registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Promedio por gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(expenses.length > 0 ? totalExpenses / expenses.length : 0)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Por transacción
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de pastel - Gastos por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>🥧 Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No hay gastos registrados
              </p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Leyenda */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de barras - Gastos por día */}
        <Card>
          <CardHeader>
            <CardTitle>📅 Gastos por Día</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasBarData ? (
              <p className="text-center text-gray-500 py-8">
                No hay gastos en los últimos 7 días
              </p>
            ) : (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60}
                      interval={0}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Gasto']}
                      labelFormatter={(label) => `Fecha: ${label}`}
                    />
                    <Bar 
                      dataKey="total" 
                      fill="#F59E0B" 
                      name="Gastos" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-center text-sm text-gray-500">
                  Total últimos 7 días: {formatCurrency(dailyData.reduce((sum, d) => sum + d.total, 0))}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}