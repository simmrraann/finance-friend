import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { FinanceProvider } from "./contexts/FinanceContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import CharacterSelect from "./pages/CharacterSelect";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProfileOnboarding from "./pages/ProfileOnboarding";
import { AppLayout } from "./components/AppLayout";

const queryClient = new QueryClient();

// Protected Route component
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if profile is incomplete
  if (!user.username || !user.phoneNumber) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

// Wrapper for protected routes with layout
function ProtectedLayout({ children }: { children: JSX.Element }) {
  return (
    <ProtectedRoute>
      <AppLayout>
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/onboarding" 
                  element={
                    <ProtectedRoute>
                      <ProfileOnboarding />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/character-select" 
                  element={
                    <ProtectedRoute>
                      <CharacterSelect />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedLayout>
                      <Dashboard />
                    </ProtectedLayout>
                  } 
                />
                <Route 
                  path="/statistics" 
                  element={
                    <ProtectedLayout>
                      <Statistics />
                    </ProtectedLayout>
                  } 
                />
                <Route 
                  path="/transactions" 
                  element={
                    <ProtectedLayout>
                      <Transactions />
                    </ProtectedLayout>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedLayout>
                      <Settings />
                    </ProtectedLayout>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
