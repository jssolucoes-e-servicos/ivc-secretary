import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Buscar contagens diretamente do banco de dados
  const totalBaptisms = await prisma.baptism.count();
  const kidsBaptisms = await prisma.baptism.count({ where: { isKids: true } });
  const adultBaptisms = totalBaptisms - kidsBaptisms;

  const totalVoluntaries = await prisma.voluntary.count();
  const kidsVoluntaries = await prisma.voluntary.count({ where: { isKids: true } });
  const adultVoluntaries = totalVoluntaries - kidsVoluntaries;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Painel Geral</h1>
          <p className="page-description">Estatísticas e visão consolidada dos cadastros da Igreja Viva.</p>
        </div>
      </div>

      <div className="stats-grid">
        {/* Card Batismos */}
        <div className="card stat-card">
          <div className="stat-icon">💧</div>
          <div className="stat-info">
            <span className="stat-value">{totalBaptisms}</span>
            <span className="stat-label">Total de Batismos</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              🧒 {kidsBaptisms} Crianças | 👨 {adultBaptisms} Adultos
            </span>
          </div>
        </div>

        {/* Card Voluntários */}
        <div className="card stat-card">
          <div className="stat-icon">🤝</div>
          <div className="stat-info">
            <span className="stat-value">{totalVoluntaries}</span>
            <span className="stat-label">Total de Voluntários</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              🧒 {kidsVoluntaries} Crianças | 👨 {adultVoluntaries} Adultos
            </span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "2.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Bem-vindo ao Sistema Igreja Viva ⛪</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
          Utilize o menu lateral para gerenciar os cadastros do ministério. O sistema permite pesquisar,
          visualizar detalhes e cadastrar novos membros para os processos de <strong>Batismo</strong> e
          escalas de <strong>Voluntários</strong>.
        </p>
      </div>
    </div>
  );
}
