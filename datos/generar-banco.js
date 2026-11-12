#!/usr/bin/env node
/*
 * Genera el banco de preguntas de test: datos/banco.json y datos/banco.js.
 *
 * Dos tipos de pregunta:
 *  - "revisada": las 10 preguntas escritas de cada tema (datos/temas/<id>.json).
 *  - "articulo": preguntas centradas en un artículo de las leyes del tema
 *    (campo "leyes" de datos/temas/<id>.json), con el texto oficial de
 *    leyes/*.pdf. Dos formas, como las preguntas revisadas:
 *       «¿Qué regula el art. 47 LPAC?»                      → respuesta: su título
 *       «¿Qué artículo recoge «Objeto de la Ley» en LPAC?»  → respuesta: el número
 *    Si el artículo no tiene título (p. ej. la Constitución), la respuesta es
 *    la primera frase de su texto. Los distractores son otros artículos de la
 *    misma norma; no se inventa contenido.
 *
 * Requiere pdftotext (poppler). Uso: node datos/generar-banco.js
 * Resultado determinista (semilla por id de tema).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const DIR = __dirname;
const RAIZ = path.join(DIR, '..');
const leer = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const temas = leer(path.join(DIR, 'temario-andalucia.json')).temas;
const catalogo = leer(path.join(DIR, 'leyes.json')).leyes;
const POR_TEMA = 100; // preguntas de artículo por tema, como máximo

const vm = require('vm');
const ALIAS = {
  'LO-3-2007': 'LO 3/2007', 'LO-1-2004': 'LO 1/2004', 'LO-4-1981': 'LO 4/1981',
  'LIG-AND-12-2007': 'Ley 12/2007', 'VG-AND-13-2007': 'Ley 13/2007',
  'L-14-2010': 'Ley 14/2010', 'L-22-2011': 'Ley 22/2011', 'L-37-2003': 'Ley 37/2003',
  'LPHA-14-2007': 'Ley 14/2007', 'LPHE-16-1985': 'Ley 16/1985', 'LVA-5-2025': 'Ley 5/2025',
  'LAND-4-2017': 'Ley 4/2017', 'DEC-AND-293-2009': 'Decreto 293/2009', 'DEC-AND-67-2011': 'Decreto 67/2011',
  'RD-1627-1997': 'RD 1627/1997', 'RD-470-2021': 'RD 470/2021', 'RD-470-2021-ACERO': 'RD 470/2021',
  'RD-105-2008': 'RD 105/2008', 'RD-346-2011': 'RD 346/2011', 'RD-355-2024': 'RD 355/2024',
  'RD-486-1997': 'RD 486/1997', 'RD-505-2007': 'RD 505/2007', 'RD-513-2017': 'RD 513/2017',
  'RD-842-2002': 'RD 842/2002', 'RD-919-2006': 'RD 919/2006', 'TMA-851-2021': 'Orden TMA/851/2021',
  'ECO-805-2003': 'Orden ECO/805/2003', 'TRLS-7-2015': 'TRLS', 'TRLCAT-1-2004': 'TRLCAT',
  'EA-ANDALUCIA': 'EA Andalucía', 'LFP-ANDALUCIA': 'LFP Andalucía', 'LGHPA': 'LGHPA',
  'TUE-TFUE': 'TUE/TFUE', 'TLISBOA-2007': 'Tratado de Lisboa', 'LISTA-7-2021': 'LISTA',
  'LAULA-5-2010': 'LAULA 5/2010', 'LPAP-33-2003': 'LPAP 33/2003', 'LPCA-4-1986': 'Ley 4/1986 Patrimonio Andalucía',
  'LGSS-8-2015': 'LGSS', 'ET-2-2015': 'Estatuto de los Trabajadores', 'LDAPA-7-2011': 'Ley 7/2011 Archivos Andalucía',
  'LACC-16-2007': 'Ley 16/2007 Ciencia Andalucía', 'DEC-AND-317-2003': 'Decreto 317/2003', 'DEC-AND-204-1995': 'Decreto 204/1995',
};
const alias = (id) => ALIAS[id] || id;

// ---------- utilidades ----------
function prng(seedStr) {
  let h = 2166136261;
  for (const ch of seedStr) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  let s = h >>> 0;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function barajar(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const elegir = (arr, n, rnd) => barajar(arr, rnd).slice(0, n);

// ---------- extracción de artículos desde datos/preceptos/<id>.js ----------
function primeraFrase(texto) {
  const t = String(texto || '').replace(/^\d+\s*\.\s*/, '').replace(/\s+/g, ' ').trim();
  const m = /^(.+?[a-záéíóúñ)]{4}[.;])\s/.exec(t);
  let f = m ? m[1] : t;
  if (f.length > 160) f = f.slice(0, 150).replace(/\s+\S*$/, '') + '…';
  return f;
}

const cacheArticulos = new Map();
function articulosDeLey(id) {
  if (cacheArticulos.has(id)) return cacheArticulos.get(id);
  let lista = [];
  const rutaPreceptos = path.join(DIR, 'preceptos', `${id}.js`);
  if (fs.existsSync(rutaPreceptos)) {
    const code = fs.readFileSync(rutaPreceptos, 'utf8');
    const ctx = { window: { PRECEPTOS_PDF: {} } };
    vm.runInNewContext(code, ctx);
    const d = ctx.window.PRECEPTOS_PDF[id];
    const items = (d && d.items) || [];
    const vistos = new Map();
    for (const it of items) {
      if (it.tipo !== 'art' || !it.num) continue;
      const num = String(it.num).trim();
      if (vistos.has(num)) continue;
      const mTit = /^Art[ií]culo\s+[^.]+?\.\s*(.+)$/.exec(String(it.titulo || '').trim());
      let titulo = mTit ? mTit[1].replace(/\.$/, '').trim() : null;
      if (titulo && titulo.length > 100) titulo = null;
      const frase = primeraFrase(it.texto || '');
      vistos.set(num, { num, titulo, frase });
    }
    const cuenta = new Map();
    for (const a of vistos.values()) if (a.titulo) cuenta.set(a.titulo, (cuenta.get(a.titulo) || 0) + 1);
    lista = [...vistos.values()]
      .map((a) => {
        if (a.titulo && (cuenta.get(a.titulo) > 1 || /derogad|suprimid/i.test(a.titulo))) a.titulo = null;
        return a;
      })
      .filter((a) => !/derogad|suprimid/i.test(a.frase) && (a.titulo || a.frase.length >= 25))
      .map((a) => ({ ...a, ley: id, contenido: a.titulo || a.frase }));
  }
  cacheArticulos.set(id, lista);
  return lista;
}

// ---------- construcción ----------
const banco = [];
const informe = [];

for (const t of temas) {
  const rnd = prng(t.id);
  const r = leer(path.join(DIR, 'temas', t.id + '.json'));

  const revisadas = r.test.map((q, i) => ({
    id: `${t.id}-${String(i + 1).padStart(3, '0')}`,
    tema: t.id, bloque: t.bloque, origen: 'revisada',
    enunciado: q.pregunta, opciones: q.opciones, correcta: q.correcta,
    explicacion: q.explicacion, referencia: q.referencia,
  }));

  const arts = r.leyes.flatMap((l) => articulosDeLey(l.id));
  const candidatas = [];
  const firmas = new Set();
  const añadir = (q) => {
    const f = q.enunciado + '|' + [...q.opciones].sort().join('|');
    if (firmas.has(f)) return;
    firmas.add(f);
    candidatas.push(q);
  };

  for (const a of arts) {
    const ref = `art. ${a.num} ${alias(a.ley)}`;
    const mismaLey = arts.filter((b) => b.ley === a.ley && b !== a);
    const otros = arts.filter((b) => b !== a);

    // Forma 1: «¿Qué regula el art. N NORMA?» → contenido del artículo.
    const contenidos = [...new Set(otros.map((b) => b.contenido))].filter((c) => c !== a.contenido);
    const sameLaw = [...new Set(mismaLey.map((b) => b.contenido))].filter((c) => c !== a.contenido);
    const dist1 = elegir(sameLaw, 3, rnd).concat(elegir(contenidos.filter((c) => !sameLaw.includes(c)), 3, rnd)).slice(0, 3);
    if (dist1.length === 3) {
      const opc = barajar([a.contenido, ...dist1], rnd);
      añadir({
        tema: t.id, bloque: t.bloque, origen: 'articulo', reutilizada: false,
        enunciado: `¿Qué regula el ${ref}?`,
        opciones: opc, correcta: opc.indexOf(a.contenido),
        explicacion: (a.titulo ? `Art. ${a.num} ${alias(a.ley)} («${a.titulo}»): ` : `Art. ${a.num} ${alias(a.ley)}: `) + a.frase,
        referencia: ref,
      });
    }

  }

  const elegidas = barajar(candidatas, rnd).slice(0, POR_TEMA);
  const articulo = elegidas.map((g, i) => ({ id: `${t.id}-a${String(i + 1).padStart(3, '0')}`, ...g }));
  // Preguntas de hechos escritas a mano (datos/hechos/<id>.json), si existen.
  const rutaHechos = path.join(DIR, 'hechos', t.id + '.json');
  const hechos = fs.existsSync(rutaHechos)
    ? leer(rutaHechos).map((q, i) => ({
        id: `${t.id}-h${String(i + 1).padStart(3, '0')}`,
        tema: t.id, bloque: t.bloque, origen: 'hecho', reutilizada: false,
        enunciado: q.pregunta, opciones: q.opciones, correcta: q.correcta,
        explicacion: q.explicacion, referencia: q.referencia,
      }))
    : [];

  const todas = [...revisadas, ...hechos, ...articulo];
  informe.push({ tema: t.id, revisadas: revisadas.length, hechos: hechos.length, articulos: arts.length, candidatas: candidatas.length, articulo: articulo.length, total: todas.length });
  banco.push(...todas);
}

fs.writeFileSync(path.join(DIR, 'banco.js'), 'window.BANCO = ' + JSON.stringify(banco) + ';\n');

const totRev = informe.reduce((n, x) => n + x.revisadas, 0);
const totArt = informe.reduce((n, x) => n + x.articulo, 0);
const completos = informe.filter((x) => x.articulo === POR_TEMA).length;
const bajos = informe.filter((x) => x.articulo < POR_TEMA).map((x) => `${x.tema}:${x.articulo}`);
const sinArt = informe.filter((x) => x.articulo === 0).map((x) => x.tema);
console.log(`Banco: ${banco.length} preguntas en ${temas.length} temas (${totRev} revisadas, ${totArt} de artículo).`);
console.log(`Temas con ${POR_TEMA} preguntas de artículo: ${completos} de ${temas.length}.`);
console.log(`Temas por debajo de ${POR_TEMA}: ${bajos.length ? bajos.join(' ') : 'ninguno'}.`);
console.log(`Temas sin preguntas de artículo: ${sinArt.length ? sinArt.join(' ') : 'ninguno'}.`);
