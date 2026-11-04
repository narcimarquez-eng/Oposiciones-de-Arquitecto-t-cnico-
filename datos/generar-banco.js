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

// Nombre corto de cada norma tal como aparece en las preguntas revisadas.
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

// ---------- extracción de artículos desde los PDF ----------
const HEAD = /^Artículo\s+(\d+(?:\s(?:bis|ter|quáter|quinquies))?)\s*\.?\s*(.*)$/;
const RUIDO = /BOLETÍN OFICIAL|^Núm\. \d+|https?:\/\/|^\d+\s*$|^Página \d+/;
const SECCION = /^(CAPÍTULO|TÍTULO|Capítulo|Título|SECCIÓN|Sección)\b/;

function primeraFrase(texto) {
  const t = texto.replace(/^\d+\s*\.\s*/, '').replace(/\s+/g, ' ').trim();
  const m = /^(.+?[a-záéíóúñ)]{4}[.;])\s/.exec(t);
  let f = m ? m[1] : t;
  if (f.length > 160) f = f.slice(0, 150).replace(/\s+\S*$/, '') + '…';
  return f;
}

const cacheArticulos = new Map();
function articulosDeLey(id) {
  if (cacheArticulos.has(id)) return cacheArticulos.get(id);
  const ley = catalogo.find((l) => l.id === id);
  let lista = [];
  if (ley && ley.pdf && fs.existsSync(path.join(RAIZ, ley.pdf))) {
    const txt = cp.execFileSync('pdftotext', ['-raw', path.join(RAIZ, ley.pdf), '-'],
      { maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    const lineas = txt.split('\n').map((s) => s.trim());
    const vistos = new Map();
    for (let i = 0; i < lineas.length; i++) {
      const s = lineas[i];
      if (/\.\s\.\s\./.test(s)) continue; // línea del índice
      const m = HEAD.exec(s);
      if (!m) continue;
      const num = m[1].replace(/\s+/g, ' ');
      if (vistos.has(num)) continue;
      const resto = m[2].trim();
      let titulo = null;
      if (resto && resto.length <= 100 && resto.endsWith('.')) titulo = resto.replace(/\.$/, '').trim();
      const cuerpo = [];
      for (let j = i + 1; j < lineas.length && cuerpo.join(' ').length < 400; j++) {
        const t = lineas[j];
        if (!t || RUIDO.test(t)) continue;
        if (HEAD.test(t) || SECCION.test(t)) break;
        cuerpo.push(t);
      }
      vistos.set(num, { num, titulo, frase: primeraFrase(cuerpo.join(' ')) });
    }
    // Un título repetido en la norma no identifica un artículo: se descarta como respuesta.
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

    // Forma 2: «¿Qué artículo recoge «TÍTULO» en NORMA?» → número del artículo.
    if (a.titulo) {
      const numeros = [...new Set(mismaLey.map((b) => b.num))];
      const dist2 = elegir(numeros, 3, rnd);
      if (dist2.length === 3) {
        const opc = barajar([a.num, ...dist2].map((n) => `art. ${n}`), rnd);
        añadir({
          tema: t.id, bloque: t.bloque, origen: 'articulo', reutilizada: false,
          enunciado: `¿Qué artículo recoge «${a.titulo}» en ${alias(a.ley)}?`,
          opciones: opc, correcta: opc.indexOf(`art. ${a.num}`),
          explicacion: `${alias(a.ley)}, art. ${a.num}: ${a.frase}`,
          referencia: ref,
        });
      }
    }
  }

  const elegidas = barajar(candidatas, rnd).slice(0, POR_TEMA);
  const articulo = elegidas.map((g, i) => ({ id: `${t.id}-a${String(i + 1).padStart(3, '0')}`, ...g }));
  const todas = [...revisadas, ...articulo];
  informe.push({ tema: t.id, revisadas: revisadas.length, articulos: arts.length, candidatas: candidatas.length, articulo: articulo.length, total: todas.length });
  banco.push(...todas);
}

fs.writeFileSync(path.join(DIR, 'banco.json'), JSON.stringify(banco) + '\n');
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
