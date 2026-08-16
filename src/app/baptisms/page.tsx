"use client";

import { useState, useEffect, startTransition } from "react";
import { getBaptisms, createBaptism, type BaptismInput } from "@/app/actions";

export default function BaptismsPage() {
  const [baptisms, setBaptisms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados do formulário
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [isKids, setIsKids] = useState(false);
  const [dateBaptism, setDateBaptism] = useState("");
  const [responsableName, setResponsableName] = useState("");
  const [responsableCpf, setResponsableCpf] = useState("");

  const loadData = async (query = "") => {
    const data = await getBaptisms(query);
    setBaptisms(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    loadData(val);
  };

  const handleOpenModal = () => {
    setError(null);
    setName("");
    setCpf("");
    setIsKids(false);
    setDateBaptism("");
    setResponsableName("");
    setResponsableCpf("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: BaptismInput = {
      name,
      cpf: isKids ? undefined : cpf,
      isKids,
      dateBaptism,
      responsableName: isKids ? responsableName : undefined,
      responsableCpf: isKids ? responsableCpf : undefined,
    };

    const res = await createBaptism(input);
    setLoading(false);

    if (res.success) {
      setIsModalOpen(false);
      loadData(search);
    } else {
      setError(res.error || "Erro ao salvar batismo.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cadastro de Batismos</h1>
          <p className="page-description">Gerencie e registre os batismos da igreja.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          <span>➕</span> Novo Batismo
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou responsável..."
          className="input"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Tipo</th>
              <th>Data do Batismo</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            {baptisms.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "3rem" }}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              baptisms.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong style={{ color: "#fff" }}>{b.name}</strong>
                  </td>
                  <td>{b.cpf || <span style={{ color: "var(--text-muted)" }}>Não informado</span>}</td>
                  <td>
                    {b.isKids ? (
                      <span className="badge badge-kids">Criança</span>
                    ) : (
                      <span className="badge badge-adult">Adulto</span>
                    )}
                  </td>
                  <td>{new Date(b.dateBaptism).toLocaleDateString("pt-BR")}</td>
                  <td>
                    {b.isKids && b.responsableName ? (
                      <div className="responsable-detail">
                        👨‍👦 {b.responsableName} <br />
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>CPF: {b.responsableCpf || "N/A"}</span>
                      </div>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Novo Batismo</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label" htmlFor="name">
                  Nome do Batizando
                </label>
                <input
                  type="text"
                  id="name"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label" htmlFor="dateBaptism">
                    Data do Batismo
                  </label>
                  <input
                    type="date"
                    id="dateBaptism"
                    className="input"
                    value={dateBaptism}
                    onChange={(e) => setDateBaptism(e.target.value)}
                    required
                  />
                </div>

                {!isKids && (
                  <div className="form-group">
                    <label className="label" htmlFor="cpf">
                      CPF
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      className="input"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                )}
              </div>

              <div className="checkbox-group" onClick={() => setIsKids(!isKids)}>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isKids}
                  onChange={() => {}} // Tratado no click do container
                />
                <span className="label" style={{ cursor: "pointer", color: "#fff" }}>
                  É Criança?
                </span>
              </div>

              {isKids && (
                <div className="kids-section">
                  <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--primary)" }}>
                    Dados do Responsável
                  </h3>

                  <div className="form-group">
                    <label className="label" htmlFor="respName">
                      Nome do Responsável
                    </label>
                    <input
                      type="text"
                      id="respName"
                      className="input"
                      value={responsableName}
                      onChange={(e) => setResponsableName(e.target.value)}
                      placeholder="Nome completo do responsável"
                      required={isKids}
                    />
                  </div>

                  <div className="form-group">
                    <label className="label" htmlFor="respCpf">
                      CPF do Responsável
                    </label>
                    <input
                      type="text"
                      id="respCpf"
                      className="input"
                      value={responsableCpf}
                      onChange={(e) => setResponsableCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      required={isKids}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Gravando..." : "Salvar Batismo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
