'use client';

import { useState } from 'react';
import {
  calcularMilheiroEmissao,
  calcularCustoFabricar,
  calcularQuantoValem,
  calcularCarteira,
  getVeredito,
  getVereditoColor,
  getVereditoLabel,
  VALORES_REFERENCIA,
  type Programa,
} from '@/lib/calculations/milheiro';

const programas: Programa[] = Object.keys(VALORES_REFERENCIA) as Programa[];

export default function CalculadoraMilheiro() {
  const [modo, setModo] = useState<'emissao' | 'fabricar' | 'valem' | 'carteira'>('emissao');

  // === MODO 1: Emissão ===
  const [preco, setPreco] = useState(1200);
  const [taxas, setTaxas] = useState(180);
  const [milhas, setMilhas] = useState(25000);
  const [programaEmissao, setProgramaEmissao] = useState<Programa>('LATAM');

  const valorEmissao = calcularMilheiroEmissao(preco, taxas, milhas);
  const vereditoEmissao = getVeredito(valorEmissao, programaEmissao);

  // === MODO 2: Fabricar ===
  const [custo, setCusto] = useState(800);
  const [pontos, setPontos] = useState(30000);
  const [bonus, setBonus] = useState(80);
  const valorFabricar = calcularCustoFabricar(custo, pontos, bonus);
  const vereditoFabricar = getVeredito(valorFabricar, 'Livelo');

  // === MODO 3: Quanto Valem ===
  const [saldo, setSaldo] = useState(85000);
  const [programaValem, setProgramaValem] = useState<Programa>('Smiles');
  const valorValem = calcularQuantoValem(saldo, VALORES_REFERENCIA[programaValem].alto);

  // === MODO 4: Carteira ===
  const [saldosCarteira] = useState([
    { programa: 'LATAM' as Programa, saldo: 45000 },
    { programa: 'Smiles' as Programa, saldo: 32000 },
    { programa: 'Livelo' as Programa, saldo: 28000 },
  ]);
  const carteira = calcularCarteira(saldosCarteira);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Calculadora do Milheiro</h1>
        <p className="text-gray-600 mt-2">Reutilização 100% das fórmulas e vereditos originais do MilhasBot • Valores julho/2026</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { key: 'emissao', label: 'Milhas ou Dinheiro' },
          { key: 'fabricar', label: 'Custo de Fabricar' },
          { key: 'valem', label: 'Quanto Valem' },
          { key: 'carteira', label: 'Minha Carteira' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setModo(tab.key as any)}
            className={`px-5 py-2 rounded-full text-sm font-medium ${modo === tab.key ? 'bg-black text-white' : 'bg-gray-100'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* MODO EMISSÃO */}
      {modo === 'emissao' && (
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm">Preço (R$)</label><input type="number" value={preco} onChange={e=>setPreco(+e.target.value)} className="w-full border rounded-lg px-4 py-3 text-xl mt-1"/></div>
              <div><label className="text-sm">Taxas (R$)</label><input type="number" value={taxas} onChange={e=>setTaxas(+e.target.value)} className="w-full border rounded-lg px-4 py-3 text-xl mt-1"/></div>
            </div>
            <div><label className="text-sm">Milhas</label><input type="number" value={milhas} onChange={e=>setMilhas(+e.target.value)} className="w-full border rounded-lg px-4 py-3 text-xl mt-1"/></div>
            <div><label className="text-sm">Programa</label>
              <select value={programaEmissao} onChange={e=>setProgramaEmissao(e.target.value as Programa)} className="w-full border rounded-lg px-4 py-3 text-xl mt-1">
                {programas.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="md:col-span-2 bg-white border rounded-3xl p-8">
            <div className="text-sm text-gray-500">Valor do milheiro</div>
            <div className="text-7xl font-bold tracking-[-3px] mt-1">R$ {valorEmissao.toFixed(2)}</div>
            <div className={`mt-4 inline-block px-5 py-1.5 rounded-full text-sm font-semibold ${getVereditoColor(vereditoEmissao)}`}>
              {getVereditoLabel(vereditoEmissao)}
            </div>
            <p className="mt-8 text-xs text-gray-500">Fórmula: (Preço − Taxas) ÷ Milhas × 1.000</p>
          </div>
        </div>
      )}

      {/* MODO FABRICAR */}
      {modo === 'fabricar' && (
        <div className="max-w-md space-y-5">
          <div><label>Custo total (R$)</label><input type="number" value={custo} onChange={e=>setCusto(+e.target.value)} className="w-full border rounded-lg px-4 py-3 text-xl mt-1"/></div>
          <div><label>Pontos</label><input type="number" value={pontos} onChange={e=>setPontos(+e.target.value)} className="w-full border rounded-lg px-4 py-3 text-xl mt-1"/></div>
          <div><label>Bônus (%)</label><input type="number" value={bonus} onChange={e=>setBonus(+e.target.value)} className="w-full border rounded-lg px-4 py-3 text-xl mt-1"/></div>

          <div className="bg-white border rounded-3xl p-8 mt-4">
            <div className="text-sm text-gray-500">Custo efetivo por milheiro</div>
            <div className="text-6xl font-bold tracking-tight mt-1">R$ {valorFabricar.toFixed(2)}</div>
            <div className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-medium ${getVereditoColor(vereditoFabricar)}`}>
              {getVereditoLabel(vereditoFabricar)}
            </div>
          </div>
        </div>
      )}

      {modo === 'valem' && (
        <div className="max-w-md">
          <div><label>Saldo de milhas</label><input type="number" value={saldo} onChange={e=>setSaldo(+e.target.value)} className="w-full border rounded-lg px-4 py-3 text-xl mt-1"/></div>
          <div className="mt-4"><label>Programa</label>
            <select value={programaValem} onChange={e=>setProgramaValem(e.target.value as Programa)} className="w-full border rounded-lg px-4 py-3 text-xl mt-1">
              {programas.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="mt-8 bg-white border rounded-3xl p-8">
            <div className="text-sm text-gray-500">Valor da sua milhas</div>
            <div className="text-6xl font-bold tracking-tight">R$ {valorValem.toFixed(0)}</div>
          </div>
        </div>
      )}

      {modo === 'carteira' && (
        <div className="bg-white border rounded-3xl p-8">
          <div className="text-5xl font-bold">R$ {carteira.total.toFixed(0)}</div>
          <p className="text-gray-500 mt-1">Valor total da sua carteira</p>
          <div className="mt-6 space-y-3">
            {Object.entries(carteira.porPrograma).map(([prog, valor]) => (
              <div key={prog} className="flex justify-between border-b pb-2">
                <span>{prog}</span>
                <span className="font-medium">R$ {valor.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
