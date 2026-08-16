import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "igrejaviva_segredo_super_secreto_2026";
const ADMIN_USER = "igrejaviva";

// O hash bcrypt da senha '522576' gerado previamente
const ADMIN_PASSWORD_HASH = "$2b$10$Pc0PcT7f9QQlXhQyAiZ0SezIZAu0DEgkitEfcOCkhBGK1cIcisORC";

/**
 * Verifica se o usuário e senha correspondem ao administrador.
 */
export async function verifyCredentials(user: string, pass: string): Promise<boolean> {
  if (user !== ADMIN_USER) return false;
  return bcrypt.compare(pass, ADMIN_PASSWORD_HASH);
}

/**
 * Cria um token JWT para a sessão.
 */
export function createToken(payload: { username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verifica se um token JWT é válido e retorna o payload.
 */
export function verifyToken(token: string): { username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { username: string };
  } catch {
    return null;
  }
}
