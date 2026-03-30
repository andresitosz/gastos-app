// src/app/components/AddExpenseForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'comida', label: '🍕 Comida' },
  { value: 'transporte', label: '🚗 Transporte' },
  { value: 'servicios', label: '💡 Servicios' },
  { value: 'general', label: '📦 General' },
  { value: 'entretenimiento', label: '🎬 Entretenimiento' },
  { value: 'salud', label: '🏥 Salud' },
  { value: 'educación', label: '📚 Educación' }
];

export function AddExpenseForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'general',
    date_expense: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('expenses')
        .insert([
          {
            description: formData.description,
            amount: parseFloat(formData.amount),
            category: formData.category,
            date_expense: formData.date_expense,
            user_id: user?.id,
            create_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      toast.success('💰 Gasto agregado correctamente');
      navigate('/');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al agregar el gasto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Nuevo Gasto
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Registra tus gastos de forma rápida y sencilla
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Descripción *
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ej: Compra en supermercado, Pago de renta, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Monto *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Categoría
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Fecha del gasto
          </label>
          <input
            type="date"
            value={formData.date_expense}
            onChange={(e) => setFormData({ ...formData, date_expense: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : '💾 Guardar gasto'}
          </button>
        </div>
      </form>
    </div>
  );
}