import type { Metadata } from "next";
import { cookies } from "next/headers";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
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
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        ) : (
          <div className="login-wrapper">{children}</div>
        )}
      </body>
    </html>
  );
}
