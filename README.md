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

## 📝 Status do Projeto

- **Fase 0**: ✅ Concluída e utilizável
- **Fase 1 a 4**: Em desenvolvimento (conforme solicitado)
- **Deploy**: Preview disponível no Vercel

---

**Desenvolvido com ❤️ e foco em reutilização inteligente.**

Se você está lendo isso, provavelmente é porque participou da engenharia reversa ou está ajudando a modernizar uma das melhores plataformas de milhas do Brasil.

