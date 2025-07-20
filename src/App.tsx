import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarWrapper } from "./components/SidebarWrapper";

import Index from "./pages/Index";
import { CustomersPage } from "./pages/CustomersPage";
import { CampaignsPage } from "./pages/CampaignsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login";
import { RecuperarSenha } from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* 🔓 Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />

            {/* 🔐 Rotas com layout e sidebar */}
            <Route element={<SidebarWrapper />}>
              <Route path="/" element={<Index />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
