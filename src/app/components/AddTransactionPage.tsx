// src/app/components/AddTransactionPage.tsx
import { useNavigate } from "react-router-dom";
import { AddExpenseForm } from "./AddExpenseForm";
import { ArrowLeft } from "lucide-react";

export function AddTransactionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver al inicio
        </button>
        
        <AddExpenseForm />
      </div>
    </div>
  );
}