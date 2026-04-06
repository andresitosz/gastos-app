// src/app/hooks/useMonthlyReset.ts
import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useMonthlyReset(
  expenses: any[], 
  userId: string | undefined, 
  onResetComplete: () => void
) {
  const hasResetThisMonth = useRef(false);

  useEffect(() => {
    if (!userId || expenses.length === 0 || hasResetThisMonth.current) return;

    const checkAndArchiveMonth = async () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      
      const lastReset = localStorage.getItem(`last_reset_${userId}`);
      const lastResetDate = lastReset ? new Date(lastReset) : null;
      
      if (!lastResetDate || 
          lastResetDate.getMonth() + 1 !== currentMonth || 
          lastResetDate.getFullYear() !== currentYear) {
        
        const { data: existing } = await supabase
          .from('monthly_history')
          .select('id')
          .eq('user_id', userId)
          .eq('year', currentYear)
          .eq('month', currentMonth)
          .single();
        
        if (!existing && expenses.length > 0) {
          const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
          
          await supabase
            .from('monthly_history')
            .insert({
              user_id: userId,
              year: currentYear,
              month: currentMonth,
              total_amount: totalAmount,
              transactions_data: expenses
            });
          
          localStorage.setItem(`last_reset_${userId}`, new Date().toISOString());
          hasResetThisMonth.current = true;
          
          onResetComplete();
        }
      }
    };
    
    checkAndArchiveMonth();
  }, [expenses, userId, onResetComplete]);
}