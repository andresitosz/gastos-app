// src/app/components/Charts.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export function Charts({ transactions = [] }: { transactions?: any[] }) {
  // Filtrar solo gastos
  const expenses = transactions?.filter(t => t.type === 'expense') || [];
  
  // Agrupar por categoría
  const categoryTotals = expenses.reduce((acc: any, t) => {
    const cat = t.category || 'general';
    acc[cat] = (acc[cat] || 0) + (t.amount || 0);
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name: name === 'comida' ? '🍕 Comida' :
          name === 'transporte' ? '🚗 Transporte' :
          name === 'servicios' ? '💡 Servicios' :
          name === 'entretenimiento' ? '🎬 Entretenimiento' :
          name === 'salud' ? '🏥 Salud' :
          name === 'educación' ? '📚 Educación' : '📦 General',
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">📊 Distribución de Gastos por Categoría</h3>
      {pieData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value?.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500 py-8">No hay datos de gastos para mostrar</p>
      )}
    </div>
  );
}