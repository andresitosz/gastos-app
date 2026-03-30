// src/app/lib/expenses.ts
import { supabase } from './supabaseClient';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date_expense: string;
  create_at: string;
  user_id: string;
}

// Obtener gastos del usuario actual
export async function getExpenses(): Promise<Expense[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }

  return data || [];
}

// Agregar gasto con user_id
export async function addExpense(expense: Omit<Expense, 'id' | 'create_at' | 'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuario no autenticado');

  const { data, error } = await supabase
    .from('expenses')
    .insert([
      {
        ...expense,
        user_id: user.id,
        create_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding expense:', error);
    throw error;
  }

  return data;
}

// Eliminar gasto (solo si es del usuario)
export async function deleteExpense(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuario no autenticado');

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting expense:', error);
    return false;
  }

  return true;
}