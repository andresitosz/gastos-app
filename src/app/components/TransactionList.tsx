import { Transaction } from '../types';
import { categoryInfo, formatCurrency, formatDate } from '../utils/categories';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Sparkles,
  Receipt,
  Heart,
  Briefcase,
  Laptop,
  TrendingUp,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Sparkles,
  Receipt,
  Heart,
  Briefcase,
  Laptop,
  TrendingUp,
  MoreHorizontal,
};

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transacciones Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedTransactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay transacciones todavía. ¡Añade tu primera transacción!
            </p>
          ) : (
            sortedTransactions.map((transaction) => {
              const category = categoryInfo[transaction.category];
              const IconComponent = iconMap[category.icon];

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <IconComponent
                        className="h-5 w-5"
                        style ={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {category.label}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-semibold text-lg ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => transaction.id && onDelete(transaction.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}