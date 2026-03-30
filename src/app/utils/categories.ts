import { CategoryInfo } from '../types';

export const categoryInfo: Record<string, CategoryInfo> = {
  food: {
    label: 'Comida',
    color: '#ef4444',
    icon: 'UtensilsCrossed',
  },
  transport: {
    label: 'Transporte',
    color: '#3b82f6',
    icon: 'Car',
  },
  shopping: {
    label: 'Compras',
    color: '#8b5cf6',
    icon: 'ShoppingBag',
  },
  entertainment: {
    label: 'Entretenimiento',
    color: '#ec4899',
    icon: 'Sparkles',
  },
  bills: {
    label: 'Servicios',
    color: '#f59e0b',
    icon: 'Receipt',
  },
  health: {
    label: 'Salud',
    color: '#10b981',
    icon: 'Heart',
  },
  salary: {
    label: 'Salario',
    color: '#06b6d4',
    icon: 'Briefcase',
  },
  freelance: {
    label: 'Freelance',
    color: '#14b8a6',
    icon: 'Laptop',
  },
  investment: {
    label: 'Inversiones',
    color: '#84cc16',
    icon: 'TrendingUp',
  },
  other: {
    label: 'Otros',
    color: '#6b7280',
    icon: 'MoreHorizontal',
  },
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
