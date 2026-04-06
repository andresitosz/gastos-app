// src/app/components/StatsCard.tsx
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface StatsCardProps {
  title: string;
  amount: number;
  type: 'expense' | 'income' | 'balance' | string;
}

export function StatsCard({ title, amount, type }: StatsCardProps) {
  // Asegurar que amount es número
  const numericAmount = typeof amount === 'number' ? amount : Number(amount) || 0;
  
  // Formatear con separadores de miles (ej: 53200 -> 53.200)
  const formatWithThousands = (value: number) => {
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const getIcon = () => {
    if (type === 'expense') return <TrendingDown className="h-5 w-5 text-red-500" />;
    if (type === 'income') return <TrendingUp className="h-5 w-5 text-green-500" />;
    return <DollarSign className="h-5 w-5 text-blue-500" />;
  };

  const getAmountColor = () => {
    if (type === 'expense') return 'text-red-600';
    if (type === 'income') return 'text-green-600';
    if (type === 'balance' && numericAmount < 0) return 'text-red-600';
    if (type === 'balance' && numericAmount > 0) return 'text-green-600';
    return 'text-gray-900';
  };

  // Determinar qué mostrar según el título
  const isTransactionCount = title === '📊 Transacciones';
  
  if (isTransactionCount) {
    // Para Transacciones: solo el número, sin $ ni separadores
    return (
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {getIcon()}
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
          {numericAmount}
        </p>
      </div>
    );
  }

  // Para Gastos, Ingresos y Balance
  const getPrefix = () => {
    if (type === 'expense' && numericAmount > 0) return '- $';
    if (type === 'income' && numericAmount > 0) return '+ $';
    if (type === 'balance' && numericAmount < 0) return '- $';
    if (type === 'balance' && numericAmount > 0) return '+ $';
    return '$ ';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {getIcon()}
      </div>
      <p className={`text-2xl sm:text-3xl font-bold ${getAmountColor()}`}>
        {getPrefix()}{formatWithThousands(Math.abs(numericAmount))}
      </p>
    </div>
  );
}