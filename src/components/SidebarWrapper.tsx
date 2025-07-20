import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Outlet, Navigate } from "react-router-dom"; // 👈 1. Importar o Navigate
import { useAuth } from "@/contexts/AuthContext"; // 👈 2. Importar o useAuth

export const SidebarWrapper = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth(); // 👈 3. Usar o contexto

  // 4. Enquanto verifica a autenticação, mostramos uma mensagem.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        A carregar...
      </div>
    );
  }

  // 5. Se não estiver autenticado, redireciona para a página de login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 👇 Se estiver autenticado, o resto do seu código funciona perfeitamente.
  return (
    <div className="flex h-screen relative">
      {/* Botão de menu (mobile) */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-card border rounded-lg shadow"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar: drawer no mobile, fixo no desktop */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full z-40 transition-transform duration-300 md:relative md:translate-x-0 md:flex",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-y-auto w-full">
        <Outlet />
      </div>
    </div>
  );
};