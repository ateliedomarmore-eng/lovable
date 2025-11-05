import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Entradas from "./pages/Entradas";
import Saidas from "./pages/Saidas";
import Categorias from "./pages/Categorias";
import Tarefas from "./pages/Tarefas";
import ContasPagar from "./pages/ContasPagar";
import ContasReceber from "./pages/ContasReceber";
import Configuracao from "./pages/Configuracao";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/entradas" element={<ProtectedRoute><Entradas /></ProtectedRoute>} />
          <Route path="/saidas" element={<ProtectedRoute><Saidas /></ProtectedRoute>} />
          <Route path="/categorias" element={<ProtectedRoute><Categorias /></ProtectedRoute>} />
          <Route path="/tarefas" element={<ProtectedRoute><Tarefas /></ProtectedRoute>} />
          <Route path="/contas-pagar" element={<ProtectedRoute><ContasPagar /></ProtectedRoute>} />
          <Route path="/contas-receber" element={<ProtectedRoute><ContasReceber /></ProtectedRoute>} />
          <Route path="/configuracao" element={<ProtectedRoute><Configuracao /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
