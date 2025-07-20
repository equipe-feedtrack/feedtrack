import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

export const SidebarWrapper = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen relative">
      {/* Botão de menu (mobile) */}
      {/* Botão de menu (aparece SOMENTE em mobile) */}
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
