"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>⛪</span> Igreja Viva
      </div>

      <nav style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <ul className="sidebar-menu">
          <li className={`sidebar-item ${pathname === "/" ? "active" : ""}`}>
            <Link href="/">
              <span>📊</span> Painel Geral
            </Link>
          </li>
          <li className={`sidebar-item ${pathname.startsWith("/baptisms") ? "active" : ""}`}>
            <Link href="/baptisms">
              <span>💧</span> Batismos
            </Link>
          </li>
          <li className={`sidebar-item ${pathname.startsWith("/voluntaries") ? "active" : ""}`}>
            <Link href="/voluntaries">
              <span>🤝</span> Voluntários
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          <form action={logoutAction}>
            <button type="submit" className="logout-btn">
              <span>🚪</span> Sair do Sistema
            </button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
