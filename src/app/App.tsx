// src/app/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext"; // ✅ Importar
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { AddTransactionPage } from "./components/AddTransactionPage";
import { History } from "./components/History";

function App() {
  console.log("App renderizando con ThemeProvider"); // ✅ Para debug

  return (
    <BrowserRouter>
      <ThemeProvider>  {/* ✅ ThemeProvider afuera */}
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><AddTransactionPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;