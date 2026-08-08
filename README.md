# MilhasBot Modern

**Modernização do MilhasBot** — Plataforma brasileira de milhas e pontos, reconstruída com foco em **reutilização máxima** do ativo intelectual original + stack moderna de alta performance.

## 🎯 Contexto e Estratégia

Este projeto nasceu do **Prompt de Engenharia Reversa Completa** do site [milhasbot.com.br](https://www.milhasbot.com.br), realizado em julho de 2026.

### O que foi reutilizado (100%)
- Todas as **fórmulas matemáticas** originais
- Lógica completa de **Veredito** (excelente / bom / limítrofe / caro)
- **Valores de referência** por programa (tabela de julho/2026)
- Estrutura e dados da tabela `wp_mb_passagens`
- Metodologia editorial e regras de negócio
- Experiência validada de anos do MilhasBot

### O que foi modernizado
- **Stack**: WordPress + PHP + MySQL → **Next.js 14 App Router + TypeScript + Prisma + Supabase**
- UI/UX moderna, componentizada e performática
- Type-safety total
- Facilidade de manutenção e evolução

**Princípio**: Não reconstruir do zero. Entregar valor rápido reutilizando o que já funciona.

---

## 📦 Fases Implementadas

### Fase 0 - Core (P0) ✅ Finalizada
- **Calculadora do Milheiro** (4 modos completos)
- **Calculadora Reversa de Milhas** (com bônus 1.8x)

### Fase 1 - Valor dos Pontos (P1) 
- Comparador de Programas
- Custo de Fabricar Milhas
- Calculadora de Compras Bonificadas
- Livelo vs Esfera
- Milhas de Posto de Combustível

### Fase 2 - Emitir Passagem (P1)
- Planejador de Milhas
- Destinos mais baratos
- Buscador de passagens em milhas

### Fase 3 - Transferir Pontos (P1)
- Analisador de Transferência Bonificada
- Calendário de Bônus
- Para onde transferir
- Bônus de transferência ativos
- Transferir para ALL Accor

### Fase 6 - Mapa de Rotas das Américas (P0)
Alternativa ao FlightConnections, com recorte deliberado nas **Américas** e nas
**principais companhias** — é o recorte que torna possível entregar o que o
FlightConnections não entrega.

- **Mapa de rotas** (`/rotas`) — 2.043 rotas de 19 companhias entre 176 aeroportos
- **Página por companhia** (`/rotas/cia/[code]`) — malha completa, alcance e parceiros
- **Página por aeroporto** (`/rotas/aeroporto/[iata]`) — destinos diretos por região

**O que ele faz melhor:**

| | FlightConnections | Aqui |
|---|---|---|
| Mapa | tiles externos, carrega a cada interação | SVG pré-projetado no bundle, zero requisição |
| Destino | um aeroporto por vez | aeroporto, **país** ou **região inteira** |
| Conexões | foco em voo direto | direto, 1 e 2 paradas com tempo mínimo de conexão |
| Horário | — | **"chegar até"** com fuso real de cada aeroporto |
| Milhas | — | **qual programa emite** cada itinerário inteiro |
| Busca | ida e volta ao servidor | grafo inteiro em memória, resposta em milissegundos |

**Como funciona por dentro:**
- `lib/flights/land.ts` — contorno das Américas derivado do Natural Earth (110m),
  simplificado com Douglas-Peucker e **pré-projetado** em Mercator. É um arquivo
  gerado: o mapa não faz nenhuma requisição externa.
- `lib/flights/geo.ts` — projeção, distância ortodrômica e traçado dos arcos pelo
  círculo máximo (uma reta no Mercator seria a rota errada).
- `lib/flights/network.ts` — grafo de ~180 nós montado no import; busca direto,
  1 e 2 paradas com corte por desvio máximo sobre a rota direta.
- `lib/flights/time.ts` — fuso IANA por aeroporto, com horário de verão resolvido
  pelo próprio runtime via `Intl`.
- `lib/flights/airlines.ts` — o diferencial: para cada companhia, **quais programas
  emitem**. Um itinerário só é emissível num programa se *todos* os trechos forem.

**Honestidade sobre os dados:** é uma base curada de referência para planejamento,
não o inventário ao vivo das companhias. Durações e horários de chegada são
estimados a partir da distância — não são o horário publicado. A tela diz isso.

**Exemplo do que ele responde** — sair de Atlanta às 8h e chegar ao Brasil até 17h:

```
$ npm run flights:consulta -- ATL Brasil 17:00

ATL → Brasil · saindo 08:00 (hora local de Atlanta) · chegar até 17:00
ATL → PTY → MAO   8h58   chega 16:58   Manaus   Aeroplan, ConnectMiles, LifeMiles
1 de 12 cidades chegam até 17:00
```

E para GRU especificamente: saindo 06:20 chega 17:00 em ponto; saindo 06:30 já não dá.

Scripts:
- `npm run flights:validate` — checa IATAs órfãos, fusos inválidos, coordenadas
  fora da janela do mapa e distâncias contra valores conhecidos
- `npm run flights:consulta -- <ORIGEM> <destino> [chegar-até] [partida]` — a mesma
  busca da tela pela linha de comando

### Fase 4 - Cartões + Na Viagem (P1/P2)
- Anuidade Líquida do Cartão
- Conta Global vs Cartão no Exterior
- Cartões por Benefício

---

## 🛠️ Stack Técnica

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind
- **Backend**: Server Actions + funções puras reutilizáveis
- **Banco**: Prisma + Supabase (Postgres)
- **Deploy**: Vercel
- **Filosofia**: Máxima reutilização de lógica + código limpo e testável

---

## 🚀 Como rodar localmente

```bash
git clone https://github.com/mzinhoww-svg/milhasbot-modern.git
cd milhasbot-modern
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## 📁 Estrutura Principal

```
lib/calculations/
  ├── milheiro.ts          # Todas as fórmulas do Milheiro (reutilizadas)
  └── reversa.ts           # Lógica da Calculadora Reversa + 1.8x

app/
  ├── page.tsx                    # Home com navegação das ferramentas
  ├── calculadora/
  │   ├── milheiro/page.tsx       # Calculadora do Milheiro (4 modos)
  │   └── reversa/page.tsx        # Calculadora Reversa
  └── (outras fases...)

prisma/schema.prisma      # Schema completo do banco
```

---

## 📜 Origem

Este projeto foi gerado a partir de uma **engenharia reversa completa** do site MilhasBot.com.br, com o objetivo explícito de modernizar a plataforma mantendo todo o valor intelectual já construído pela redação e comunidade.

**Não é um clone.** É uma evolução técnica que preserva a alma do produto original.

---

## 🗄️ Banco de dados (Supabase)

As leituras de referência no servidor vêm do **Supabase** (tabelas `mb_programa`,
`mb_passagem`, `mb_bonus`), com **fallback automático** para os dados estáticos de
`lib/data/` caso o Supabase esteja indisponível — o site nunca quebra por causa do banco.

- Cliente: `lib/supabase.ts` (URL + chave publicável — públicas por design, protegidas
  por RLS; sobrescrevíveis via `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Acesso: `lib/repositories/reference.ts` (Supabase quando disponível, senão `lib/data/`).
- As tabelas têm RLS habilitado com política de **leitura pública** (dados de referência).

As ferramentas interativas (client components) seguem usando `lib/data/` diretamente —
a mesma fonte que popula o banco, mantendo consistência.

### Banco dedicado (opcional, via Prisma)

Para um Postgres próprio, há também `prisma/schema.prisma` + `prisma/seed.ts`:

```bash
cp .env.example .env    # preencha DATABASE_URL
npm run db:push         # cria as tabelas
npm run db:seed         # popula a partir de lib/data/
```

## 📝 Status do Projeto

- **Fase 0**: ✅ Concluída e utilizável
- **Fases 1 a 5**: ✅ Ferramentas funcionais, navegação global, editorial e admin protegido
- **Banco**: ✅ Supabase conectado (leitura ao vivo) com fallback estático
- **Deploy**: Preview disponível no Vercel

---

**Desenvolvido com ❤️ e foco em reutilização inteligente.**

Se você está lendo isso, provavelmente é porque participou da engenharia reversa ou está ajudando a modernizar uma das melhores plataformas de milhas do Brasil.

