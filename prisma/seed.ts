/**
 * Popula o banco a partir da fonte estática (lib/data + valores de referência).
 * Rodar após configurar DATABASE_URL:
 *   npm run db:push   # cria as tabelas
 *   npm run db:seed   # popula os dados
 */
import { PrismaClient } from '@prisma/client';
import { VALORES_REFERENCIA } from '../lib/calculations/milheiro';
import { programasInfo } from '../lib/data/programas';
import { passagens } from '../lib/data/passagens';
import { bonusTransferencias } from '../lib/data/bonus';

const prisma = new PrismaClient();

async function main() {
  console.log('Semeando programas…');
  const idPorNome: Record<string, string> = {};
  for (const p of programasInfo) {
    const ref = VALORES_REFERENCIA[p.programa];
    const slug = p.programa.toLowerCase().replace(/\s+/g, '-');
    const rec = await prisma.programa.upsert({
      where: { slug },
      update: {
        nome: p.programa,
        tipo: p.tipo,
        valorRefBaixo: ref.baixo,
        valorRefAlto: ref.alto,
        validadeMeses: p.validadeMeses,
        temClube: p.temClube,
        paridades: p.paridades,
      },
      create: {
        slug,
        nome: p.programa,
        tipo: p.tipo,
        valorRefBaixo: ref.baixo,
        valorRefAlto: ref.alto,
        validadeMeses: p.validadeMeses,
        temClube: p.temClube,
        paridades: p.paridades,
      },
    });
    idPorNome[p.programa] = rec.id;
  }

  console.log('Semeando passagens…');
  await prisma.passagem.deleteMany();
  for (const pass of passagens) {
    const programaId = idPorNome[pass.programa];
    if (!programaId) {
      console.warn(`  Programa "${pass.programa}" não encontrado; passagem ignorada.`);
      continue;
    }
    await prisma.passagem.create({
      data: {
        destino: pass.destino,
        origem: pass.origem,
        programaId,
        milhas: pass.milhas,
        cabine: pass.cabine,
        regiao: pass.regiao,
      },
    });
  }

  console.log('Semeando bônus de transferência…');
  await prisma.bonusTransferencia.deleteMany();
  for (const b of bonusTransferencias) {
    await prisma.bonusTransferencia.create({
      data: {
        origem: b.origem,
        destino: b.destino,
        percentual: b.percentual,
        inicio: new Date(b.inicio),
        fim: new Date(b.fim),
        ativo: b.ativo,
      },
    });
  }

  console.log('Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
