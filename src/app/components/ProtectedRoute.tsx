// src/app/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute - loading:", loading, "user:", user?.email); // ← Log

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    console.log("No user, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("User authenticated, showing children");
  return <>{children}</>;
}