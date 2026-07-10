'use client';

export default function Admin() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
      <p className="text-zinc-400 mb-8">Fase 5 • Área protegida por autenticação (Basic Auth)</p>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { titulo: 'Gerenciar Programas', desc: 'Atualizar valores de referência e paridades' },
          { titulo: 'Gerenciar Bônus', desc: 'Adicionar e editar bônus de transferência' },
          { titulo: 'Gerenciar Reviews', desc: 'Publicar e editar análises de cartões e programas' },
        ].map((item, i) => (
          <div key={i} className="border border-zinc-800 rounded-3xl p-8">
            <h3 className="font-semibold text-xl">{item.titulo}</h3>
            <p className="text-sm text-zinc-400 mt-3">{item.desc}</p>
            <button className="mt-6 text-sm px-5 py-2.5 border border-zinc-700 rounded-2xl hover:bg-zinc-900">
              Acessar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
