export type TransactionType = 'expense' | 'income';

export type Category = 
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'bills'
  | 'health'
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'other';

export interface Transaction {
  id?: string; // El id es opcional porque Supabase lo genera automáticamente
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
  createdAt: number;
}

export interface CategoryInfo {
  label: string;
  color: string;
  icon: string;
}