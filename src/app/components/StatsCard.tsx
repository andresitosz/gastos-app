import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface StatsCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  percentage?: number;
}

export function StatsCard({ title, amount, type, percentage }: StatsCardProps) {
  const Icon = type === 'income' ? TrendingUp : type === 'expense' ? TrendingDown : Wallet;
  
  const colorClass = 
    type === 'income' 
      ? 'text-green-500' 
      : type === 'expense' 
      ? 'text-red-500' 
      : 'text-blue-500';

  const bgClass = 
    type === 'income' 
      ? 'bg-green-100' 
      : type === 'expense' 
      ? 'bg-red-100' 
      : 'bg-blue-100';

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(Math.abs(value));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${bgClass} p-2 rounded-full`}>
          <Icon className={`h-4 w-4 ${colorClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatAmount(amount)}</div>
        {percentage !== undefined && (
          <p className="text-xs text-gray-500 mt-1">
            {percentage > 0 ? '+' : ''}{percentage.toFixed(1)}% desde el mes pasado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
