import type { Metadata } from "next";
import { cookies } from "next/headers";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Igreja Viva - Sistema de Cadastro",
  description: "Gerenciamento de Batismos e Voluntários - Igreja Viva",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasToken = cookieStore.has("token");

  return (
    <html lang="pt-BR">
      <body>
        {hasToken ? (
          <div className="app-container">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
        ) : (
          <div className="login-wrapper">{children}</div>
        )}
      </body>
    </html>
  );
}
