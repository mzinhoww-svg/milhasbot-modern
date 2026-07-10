import { NextRequest, NextResponse } from 'next/server';

export const config = { matcher: ['/admin', '/admin/:path*'] };

/**
 * Protege /admin com HTTP Basic Auth.
 * Configure ADMIN_USER e ADMIN_PASSWORD nas variáveis de ambiente (Vercel).
 * Sem essas variáveis, o acesso é negado por padrão (fail-closed).
 */
export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  const auth = req.headers.get('authorization');
  if (user && pass && auth?.startsWith('Basic ')) {
    const decoded = atob(auth.slice(6));
    const sep = decoded.indexOf(':');
    const u = decoded.slice(0, sep);
    const p = decoded.slice(sep + 1);
    if (u === user && p === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Autenticação necessária.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin MilhasBot"' },
  });
}
