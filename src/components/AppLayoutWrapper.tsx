"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  // Estado para controlar a abertura da sidebar no mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`app-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Cabeçalho visível no mobile */}
      <Header onMenuClick={toggleSidebar} />

      {/* Overlay para fechar a sidebar ao clicar fora dela em telas pequenas */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar com controle de estado */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Conteúdo principal */}
      <main className="main-content">{children}</main>
    </div>
  );
}
