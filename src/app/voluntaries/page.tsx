"use client";

import { useState, useEffect } from "react";
import { getVoluntaries, createVoluntary, type VoluntaryInput } from "@/app/actions";

export default function VoluntariesPage() {
  const [voluntaries, setVoluntaries] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados do formulário (Voluntário)
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [isKids, setIsKids] = useState(false);
  const [useImage, setUseImage] = useState(true);
  const [dateAssign, setDateAssign] = useState("");

  // Estados do formulário (Responsável - Condicional)
  const [respName, setRespName] = useState("");
  const [respCpf, setRespCpf] = useState("");
  const [respKinship, setRespKinship] = useState("");
  const [respUseImage, setRespUseImage] = useState(true);

  const loadData = async (query = "") => {
    const data = await getVoluntaries(query);
    setVoluntaries(data);
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
    setUseImage(true);
    // Definir data de hoje como padrão para dateAssign
    const today = new Date().toISOString().split("T")[0];
    setDateAssign(today);
    
    // Reset responsável
    setRespName("");
    setRespCpf("");
    setRespKinship("");
    setRespUseImage(true);
    
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: VoluntaryInput = {
      name,
      cpf,
      isKids,
      useImage,
      dateAssign,
      responsable: isKids
        ? {
            name: respName,
            cpf: respCpf,
            kinship: respKinship,
            useImage: respUseImage,
          }
        : undefined,
    };

    const res = await createVoluntary(input);
    setLoading(false);

    if (res.success) {
      setIsModalOpen(false);
      loadData(search);
    } else {
      setError(res.error || "Erro ao salvar voluntário.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Voluntários</h1>
          <p className="page-description">Gerencie e inscreva novos voluntários para os ministérios.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          <span>➕</span> Novo Voluntário
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar voluntários por nome ou CPF..."
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
              <th>Uso de Imagem</th>
              <th>Data Cadastro</th>
              <th>Perfil</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            {voluntaries.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "3rem" }}>
                  Nenhum voluntário encontrado.
                </td>
              </tr>
            ) : (
              voluntaries.map((v) => (
                <tr key={v.id}>
                  <td>
                    <strong style={{ color: "#fff" }}>{v.name}</strong>
                  </td>
                  <td>{v.cpf}</td>
                  <td>
                    {v.useImage ? (
                      <span style={{ color: "var(--success)" }}>✓ Autorizado</span>
                    ) : (
                      <span style={{ color: "var(--danger)" }}>✗ Não autorizado</span>
                    )}
                  </td>
                  <td>{new Date(v.dateAssign).toLocaleDateString("pt-BR")}</td>
                  <td>
                    {v.isKids ? (
                      <span className="badge badge-kids">Criança</span>
                    ) : (
                      <span className="badge badge-adult">Adulto</span>
                    )}
                  </td>
                  <td>
                    {v.isKids && v.responsable ? (
                      <div className="responsable-detail">
                        👨‍👦 {v.responsable.name} ({v.responsable.kinship}) <br />
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          CPF: {v.responsable.cpf} | Imagem: {v.responsable.useImage ? "Sim" : "Não"}
                        </span>
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
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Cadastrar Voluntário</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label" htmlFor="name">
                  Nome do Voluntário
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
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="dateAssign">
                    Data de Cadastro
                  </label>
                  <input
                    type="date"
                    id="dateAssign"
                    className="input"
                    value={dateAssign}
                    onChange={(e) => setDateAssign(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem", margin: "1rem 0" }}>
                <div className="checkbox-group" onClick={() => setUseImage(!useImage)}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={useImage}
                    onChange={() => {}}
                  />
                  <span className="label" style={{ cursor: "pointer", color: "#fff" }}>
                    Autoriza uso de Imagem?
                  </span>
                </div>

                <div className="checkbox-group" onClick={() => setIsKids(!isKids)}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={isKids}
                    onChange={() => {}}
                  />
                  <span className="label" style={{ cursor: "pointer", color: "#fff" }}>
                    É Criança?
                  </span>
                </div>
              </div>

              {isKids && (
                <div className="kids-section">
                  <h3 style={{ fontSize: "1rem", marginBottom: "1.25rem", color: "var(--primary)" }}>
                    Dados do Responsável do Voluntário Criança
                  </h3>

                  <div className="form-group">
                    <label className="label" htmlFor="respName">
                      Nome do Responsável
                    </label>
                    <input
                      type="text"
                      id="respName"
                      className="input"
                      value={respName}
                      onChange={(e) => setRespName(e.target.value)}
                      placeholder="Nome completo do responsável"
                      required={isKids}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="label" htmlFor="respCpf">
                        CPF do Responsável
                      </label>
                      <input
                        type="text"
                        id="respCpf"
                        className="input"
                        value={respCpf}
                        onChange={(e) => setRespCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        required={isKids}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label" htmlFor="respKinship">
                        Grau de Parentesco
                      </label>
                      <select
                        id="respKinship"
                        className="select"
                        value={respKinship}
                        onChange={(e) => setRespKinship(e.target.value)}
                        required={isKids}
                      >
                        <option value="">Selecione...</option>
                        <option value="Pai">Pai</option>
                        <option value="Mãe">Mãe</option>
                        <option value="Tio(a)">Tio(a)</option>
                        <option value="Avô/Avó">Avô/Avó</option>
                        <option value="Irmão/Irmã">Irmão/Irmã</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div className="checkbox-group" onClick={() => setRespUseImage(!respUseImage)} style={{ marginTop: "1rem" }}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={respUseImage}
                      onChange={() => {}}
                    />
                    <span className="label" style={{ cursor: "pointer", color: "#fff" }}>
                      Responsável autoriza uso de Imagem da Criança?
                    </span>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Gravando..." : "Salvar Voluntário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
