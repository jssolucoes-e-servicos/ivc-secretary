"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Função auxiliar para fechar a sidebar após um clique em link no mobile
  const handleNavigation = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Botão de Fechar no Mobile */}
      <button type="button" className="sidebar-close-btn" onClick={onClose} aria-label="Fechar menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={{ width: "24px", height: "24px" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="sidebar-logo">
        <span>⛪</span> Igreja Viva
      </div>

      <nav style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <ul className="sidebar-menu">
          <li className={`sidebar-item ${pathname === "/" ? "active" : ""}`}>
            <Link href="/" onClick={handleNavigation}>
              <span>📊</span> Painel Geral
            </Link>
          </li>
          <li className={`sidebar-item ${pathname.startsWith("/baptisms") ? "active" : ""}`}>
            <Link href="/baptisms" onClick={handleNavigation}>
              <span>💧</span> Batismos
            </Link>
          </li>
          <li className={`sidebar-item ${pathname.startsWith("/voluntaries") ? "active" : ""}`}>
            <Link href="/voluntaries" onClick={handleNavigation}>
              <span>🤝</span> Voluntários
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          <form action={logoutAction} onSubmit={handleNavigation}>
            <button type="submit" className="logout-btn">
              <span>🚪</span> Sair do Sistema
            </button>
          </form>
        </div>
      </nav>
    </aside>
  );
}

