"use client";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="mobile-header">
      {/* Botão de Menu Hambúrguer */}
      <button type="button" className="menu-toggle-btn" onClick={onMenuClick} aria-label="Abrir menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={{ width: "24px", height: "24px" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Título/Logo do App no Mobile */}
      <div className="mobile-logo">
        <span>⛪</span> Igreja Viva
      </div>

      {/* Espaçador para centralizar o título se necessário, ou manter vazio */}
      <div style={{ width: "24px" }} />
    </header>
  );
}
