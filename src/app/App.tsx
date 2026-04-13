// src/app/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { AddTransactionPage } from "./components/AddTransactionPage";
import { History } from "./components/History";
import { StatsPage } from "./components/StatsPage";
import { SettingsPage } from "./components/SettingsPage";
import { BottomNavBar } from "./components/BottomNavBar";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="pb-16"> {/* Espacio para el bottom nav */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <ProtectedRoute>
                    <AddTransactionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stats"
                element={
                  <ProtectedRoute>
                    <StatsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <BottomNavBar />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;