"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyCredentials, createToken } from "@/lib/auth";

/**
 * Ação de Login: verifica as credenciais e define o cookie de sessão.
 */
export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Usuário e senha são obrigatórios." };
  }

  const isValid = await verifyCredentials(username, password);

  if (!isValid) {
    return { success: false, error: "Usuário ou senha incorretos." };
  }

  // Gera o token e salva no cookie
  const token = createToken({ username });
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  });

  redirect("/");
}

/**
 * Ação de Logout: remove o cookie de sessão.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}

// ==========================================
// BATISMOS (BAPTISMS) ACTIONS
// ==========================================

export interface BaptismInput {
  name: string;
  cpf?: string;
  isKids: boolean;
  dateBaptism: string; // no formato YYYY-MM-DD
  responsableName?: string;
  responsableCpf?: string;
}

/**
 * Retorna a lista de batismos com busca opcional.
 */
export async function getBaptisms(query?: string) {
  try {
    if (query) {
      return await prisma.baptism.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { cpf: { contains: query, mode: "insensitive" } },
            { responsableName: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: { dateBaptism: "desc" },
      });
    }
    return await prisma.baptism.findMany({
      orderBy: { dateBaptism: "desc" },
    });
  } catch (error) {
    console.error("Erro ao buscar batismos:", error);
    return [];
  }
}

/**
 * Cria um novo registro de batismo.
 */
export async function createBaptism(data: BaptismInput) {
  try {
    if (!data.name || !data.dateBaptism) {
      return { success: false, error: "Nome e Data do Batismo são obrigatórios." };
    }

    await prisma.baptism.create({
      data: {
        name: data.name,
        cpf: data.isKids ? null : data.cpf || null,
        isKids: data.isKids,
        dateBaptism: new Date(data.dateBaptism),
        responsableName: data.isKids ? data.responsableName || null : null,
        responsableCpf: data.isKids ? data.responsableCpf || null : null,
      },
    });

    revalidatePath("/baptisms");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao cadastrar batismo:", error);
    return { success: false, error: "Erro interno ao salvar no banco de dados." };
  }
}

// ==========================================
// VOLUNTÁRIOS (VOLUNTARIES) ACTIONS
// ==========================================

export interface VoluntaryInput {
  name: string;
  cpf: string;
  isKids: boolean;
  useImage: boolean;
  dateAssign: string; // YYYY-MM-DD
  responsable?: {
    name: string;
    cpf: string;
    kinship: string;
    useImage: boolean;
  };
}

/**
 * Retorna a lista de voluntários (com dados do responsável inclusos).
 */
export async function getVoluntaries(query?: string) {
  try {
    if (query) {
      return await prisma.voluntary.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { cpf: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          responsable: true,
        },
        orderBy: { dateAssign: "desc" },
      });
    }
    return await prisma.voluntary.findMany({
      include: {
        responsable: true,
      },
      orderBy: { dateAssign: "desc" },
    });
  } catch (error) {
    console.error("Erro ao buscar voluntários:", error);
    return [];
  }
}

/**
 * Cria um novo voluntário.
 */
export async function createVoluntary(data: VoluntaryInput) {
  try {
    if (!data.name || !data.cpf || !data.dateAssign) {
      return { success: false, error: "Nome, CPF e Data de Cadastro são obrigatórios." };
    }

    // Criar voluntário e opcionalmente o responsável
    await prisma.voluntary.create({
      data: {
        name: data.name,
        cpf: data.cpf,
        isKids: data.isKids,
        useImage: data.useImage,
        dateAssign: new Date(data.dateAssign),
        responsable: data.isKids && data.responsable
          ? {
              create: {
                name: data.responsable.name,
                cpf: data.responsable.cpf,
                kinship: data.responsable.kinship,
                useImage: data.responsable.useImage,
              },
            }
          : undefined,
      },
    });

    revalidatePath("/voluntaries");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao cadastrar voluntário:", error);
    return { success: false, error: "Erro interno ao salvar no banco de dados." };
  }
}
