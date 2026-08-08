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

### Fase 6 - Busca de Voos nas Américas (P0)
Alternativa ao FlightConnections com recorte nas **Américas**. Rotas, horários e
preços vêm da **Amadeus Self-Service API** — nada de malha escrita à mão.

- **Busca de voos** (`/rotas`) — origem, destino por aeroporto/país/região, data
  e filtro de horário de chegada
- **Malha direta por aeroporto** (`/rotas/aeroporto/[iata]`) — destinos sem
  escala segundo a Amadeus

**O que ele faz melhor que o FlightConnections:**

| | FlightConnections | Aqui |
|---|---|---|
| Mapa | tiles externos, recarrega a cada interação | SVG pré-projetado no bundle, zero requisição |
| Destino | um aeroporto por vez | aeroporto, **país** ou **região inteira** |
| Horário | — | **"chegar até"** comparado com o horário publicado da companhia |
| Milhas | — | **qual programa emite** o itinerário inteiro |

#### Procedência de cada dado

Esta é a parte que importa: o produto só mostra o que tem fonte.

| Dado | Fonte | Natureza |
|---|---|---|
| Voos, horários, preços | Amadeus Self-Service API | operacional, ao vivo |
| Aeroportos, coordenadas | [OurAirports](https://davidmegginson.github.io/ourairports-data/airports.csv) (domínio público) | gerado em `lib/flights/airports.data.ts` |
| Fuso de cada aeroporto | `tz-lookup` sobre as coordenadas | derivado |
| Nome dos países | `Intl.DisplayNames` em pt-BR | derivado |
| Contorno do mapa | Natural Earth 110m, simplificado e pré-projetado | gerado em `lib/flights/land.ts` |
| Aliança e programas de milhas | curadoria editorial própria, datada | **a única parte sem API** |

Sem `AMADEUS_CLIENT_ID`/`AMADEUS_CLIENT_SECRET` a busca **não retorna rota
nenhuma** e a tela explica como configurar. É deliberado: melhor não responder
do que responder com dado que ninguém verificou.

#### Configuração

```bash
# chave gratuita em https://developers.amadeus.com
AMADEUS_CLIENT_ID="..."
AMADEUS_CLIENT_SECRET="..."
AMADEUS_HOSTNAME="test"   # ou "production" quando o app for aprovado
```

O ambiente `test` tem cota mensal baixa e malha reduzida — por isso a busca é
sempre explícita (nada dispara ao abrir a página), as respostas são cacheadas no
servidor (24h para malha, 3h para ofertas) e a consulta por país é limitada a
poucos destinos por vez. O que ficou de fora do limite aparece declarado na
tela; truncar em silêncio faria o resultado parecer completo sem ser.

#### Scripts

- `npm run flights:aeroportos` — regera a base de aeroportos do OurAirports
- `npm run flights:checar` — diagnostica a integração com a Amadeus fora do Next,
  com erro legível para credencial, cota ou rede
  (`node scripts/checar-amadeus.mjs ATL GRU 2026-09-15`)

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

