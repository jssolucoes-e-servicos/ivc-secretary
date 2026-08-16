"use client";

import { useActionState, startTransition } from "react";
import { loginAction } from "@/app/actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h1 className="login-logo">⛪ Igreja Viva</h1>
        <p className="login-subtitle">Sistema de Cadastro e Controle Geral</p>

        {state && !state.success && (
          <div className="login-error">
            <strong>Erro: </strong>
            {state.error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div className="form-group">
            <label className="label" htmlFor="username">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="input"
              placeholder="Digite o usuário"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="label" htmlFor="password">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              placeholder="Digite a senha"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.95rem" }}
            disabled={isPending}
          >
            {isPending ? "Autenticando..." : "Entrar no Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}
