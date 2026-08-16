import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar arquivos estáticos, rotas de API e a própria página de login
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/login" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Verificar se o cookie de sessão existe
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // Redireciona para o login mantendo a url original como callback
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Mapear todas as rotas de requisições, exceto as especificadas.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
