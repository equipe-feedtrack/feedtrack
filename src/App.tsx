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
import { FeedbacksPage } from "./pages/FeedbacksPage"; // 👈 1. IMPORTA A NOVA PÁGINA
import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login";
import { RecuperarSenha } from "./pages/ResetPassword";
import { LandingPage } from "./pages/LandingPage";
import { CustomerProvider } from "./contexts/CustomerContext";
import { ProductProvider } from "./contexts/ProductContext";
import { ProductsPage } from "./pages/ProdutosPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CustomerProvider>
        <ProductProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          {/* 🔓 Rotas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />

            {/* 🔐 Rotas com layout e sidebar */}
            <Route element={<SidebarWrapper />}>
              <Route path="/home" element={<Index />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/feedbacks" element={<FeedbacksPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
        </ProductProvider>
      </CustomerProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
