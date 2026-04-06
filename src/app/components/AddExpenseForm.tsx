// src/app/components/AddExpenseForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { TrendingUp, TrendingDown } from "lucide-react";

export function AddExpenseForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "general",
    date_expense: new Date().toISOString().split("T")[0],
  });

  const categories = {
    expense: [
      { value: "comida", label: "🍕 Comida", color: "text-red-600" },
      { value: "transporte", label: "🚗 Transporte", color: "text-red-600" },
      { value: "servicios", label: "💡 Servicios", color: "text-red-600" },
      { value: "entretenimiento", label: "🎬 Entretenimiento", color: "text-red-600" },
      { value: "salud", label: "🏥 Salud", color: "text-red-600" },
      { value: "educación", label: "📚 Educación", color: "text-red-600" },
      { value: "general", label: "📦 General", color: "text-red-600" },
    ],
    income: [
      { value: "salario", label: "💰 Salario", color: "text-green-600" },
      { value: "freelance", label: "💻 Freelance", color: "text-green-600" },
      { value: "inversion", label: "📈 Inversión", color: "text-green-600" },
      { value: "regalo", label: "🎁 Regalo", color: "text-green-600" },
      { value: "reembolso", label: "🔄 Reembolso", color: "text-green-600" },
      { value: "general", label: "📦 General", color: "text-green-600" },
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date_expense: formData.date_expense,
        type: type,
      });

      if (error) throw error;

      toast.success(
        type === "expense" ? "💰 Gasto agregado" : "💵 Ingreso agregado"
      );
      navigate("/");
    } catch (error: any) {
      toast.error("Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Nueva Transacción
      </h2>

      {/* Selector de tipo */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`p-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
            type === "expense"
              ? "bg-red-500 text-white shadow-lg scale-105"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <TrendingDown className="h-5 w-5" />
          <span className="font-medium">Gasto</span>
        </button>
        <button
          type="button"
          onClick={() => setType("income")}
          className={`p-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
            type === "income"
              ? "bg-green-500 text-white shadow-lg scale-105"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <TrendingUp className="h-5 w-5" />
          <span className="font-medium">Ingreso</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Netflix, Salario, etc."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto (COP)
          </label>
          <input
            type="number"
            required
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {categories[type].map((cat) => (
              <option key={cat.value} value={cat.value} className={cat.color}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.date_expense}
            onChange={(e) =>
              setFormData({ ...formData, date_expense: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-medium text-white transition-all ${
            type === "expense"
              ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading
            ? "Guardando..."
            : type === "expense"
            ? "Agregar Gasto"
            : "Agregar Ingreso"}
        </button>
      </form>
    </div>
  );
}