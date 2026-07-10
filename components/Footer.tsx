import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <span>
          MilhasBot Modern • Valores de referência julho/2026 • Dados de referência, não constituem
          recomendação financeira.
        </span>
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">
          Painel administrativo
        </Link>
      </div>
    </footer>
  );
}
