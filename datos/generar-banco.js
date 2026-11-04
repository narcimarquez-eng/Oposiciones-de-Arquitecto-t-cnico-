#!/usr/bin/env node
/*
 * Genera el banco de preguntas (100 por tema, 70 temas => 7.000).
 *
 * Origen de cada pregunta:
 *  - "revisada": las 10 preguntas escritas y revisadas de datos/temas/<id>.json.
 *  - "generada": 90 preguntas construidas a partir de frases del desarrollo
 *    (datos/desarrollo/<id>.json), de los puntos del resumen y de las
 *    explicaciones de las preguntas revisadas. La respuesta correcta es la
 *    frase tal cual aparece en el texto; los distractores son la misma frase
 *    alterada (una cifra, un término normativo o un valor de referencia
 *    cambiado) o frases verdaderas de otros apartados del mismo tema.
 *
 * Uso: node datos/generar-banco.js
 * Salida: datos/banco.json y datos/banco.js (window.BANCO, para generador.html).
 *
 * El resultado es determinista: la semilla depende del id del tema.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const POR_TEMA = 100;
const leer = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

const temario = leer(path.join(DIR, 'temario-andalucia.json'));
const temas = temario.temas;

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
const norm = (s) => s.replace(/\s+/g, ' ').trim();

// Frases que son notas de verificación o metatexto, no contenido normativo.
const META = /(no se ha|no se han|se han comprobado|no verificad|no se ha verificado|según la búsqueda|según búsqueda|el tema |este tema|las preguntas de este|los errores habituales|para un caso práctico|para repasar|conviene |en el examen|un examen|el examen)/i;

function frasesDe(texto) {
  // Frases completas y, además, cláusulas separadas por punto y coma cuando
  // cada cláusula conserva sentido propio (empieza por mayúscula y termina en punto).
  const frases = texto.split(/(?<=[.])\s+(?=[A-ZÁÉÍÓÚÑ¿¡(“"])/).map(norm);
  const clausulas = frases.flatMap((x) => x.split(/;\s+(?=[A-ZÁÉÍÓÚÑ(])/).map(norm));
  return clausulas
    .map((f) => (/[.]$/.test(f) ? f : f + "."))
    .filter((f) => f.length >= 45 && f.length <= 240)
    .filter((f) => f.split(/\s+/).length >= 7)
    .filter((f) => !META.test(f));
}

// Cifras que no son el objeto de la pregunta (referencias, años, numeración).
const REF_PREFIX = /(art(?:[íi]culo)?s?\.?\s*|apartados?\s*|puntos?\s*|letras?\s*|tabla\s*|anexo\s*|secci[oó]n\s*|disposici[oó]n[^\d]{0,30}|[ivx]+\.\s*|BOE[- ]|núm\.\s*|n\.º\s*|de\s+)$/i;

// Busca cifras "de valor" (no referencias) y devuelve sus posiciones.
function cifrasDeValor(s) {
  const out = [];
  const re = /\d+(?:[.,]\d+)*/g;
  let m;
  while ((m = re.exec(s))) {
    const antes = s.slice(Math.max(0, m.index - 40), m.index);
    const val = m[0];
    if (/^(19|20)\d\d$/.test(val)) continue;          // años
    if (m.index > 0 && /[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(s[m.index - 1])) continue; // R2, N2, C-s2: códigos, no cifras
    if (REF_PREFIX.test(antes)) continue;              // art. 3, apartado 2...
    if (/[\/]\d/.test(s.slice(m.index - 1, m.index + val.length + 1))) continue; // fechas o fracciones tipo 1/2
    out.push({ idx: m.index, txt: val, len: val.length });
  }
  return out;
}

function formatear(valor, original) {
  // conserva el formato decimal (coma) y el número de decimales del original
  const decimales = (original.split(/[.,]/)[1] || '').length;
  const coma = original.includes(',');
  let t = decimales ? valor.toFixed(decimales) : String(Math.round(valor));
  if (coma) t = t.replace('.', ',');
  return t;
}

const FACTORES = [2, 0.5, 3, 1.5, 0.8, 10, 0.1];

function variantesNumericas(s) {
  const res = [];
  for (const c of cifrasDeValor(s)) {
    const v = parseFloat(c.txt.replace(/\./g, '').replace(',', '.'));
    if (!isFinite(v) || v === 0) continue;
    for (const f of FACTORES) {
      const nuevo = formatear(v * f, c.txt);
      if (nuevo === c.txt) continue;
      const alterada = s.slice(0, c.idx) + nuevo + s.slice(c.idx + c.txt.length);
      if (alterada !== s) res.push(alterada);
    }
  }
  return res;
}

const PARES = [
  ['no inferior', 'inferior'], ['no superior', 'superior'], ['inferior a', 'superior a'],
  ['superior a', 'inferior a'], ['mínimo', 'máximo'], ['máximo', 'mínimo'],
  ['obligatorio', 'voluntario'], ['obligatoria', 'voluntaria'], ['pública', 'privada'],
  ['privada', 'pública'], ['interior', 'exterior'], ['exterior', 'interior'],
  ['permite', 'impide'], ['impide', 'permite'], ['deberá', 'podrá'], ['podrá', 'deberá'],
  ['siempre', 'nunca'], ['antes de', 'después de'], ['después de', 'antes de'],
  ['mayor', 'menor'], ['menor', 'mayor'], ['primera', 'última'], ['última', 'primera'],
  ['sin perjuicio', 'con carácter excluyente'], ['en todo caso', 'en ningún caso'],
];

function variantesTermino(s) {
  const res = [];
  for (const [a, b] of PARES) {
    const re = new RegExp('(^|[^\\p{L}])' + a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=[^\\p{L}]|$)', 'iu');
    if (re.test(s)) {
      const nuevo = s.replace(re, (m0, pre) => pre + (a[0] === a[0].toUpperCase() ? b.charAt(0).toUpperCase() + b.slice(1) : b));
      if (nuevo !== s) res.push(nuevo);
    }
  }
  return res;
}

// Negación del verbo principal: si el texto afirma algo, la negación es falsa.
const VERBO_NEG = /(^|\s)(es|son|está|están|hay|existe|existen|debe|deben|debiera|será|serán|sea|sean|tiene|tienen|puede|pueden|podrá|podrán|regula|regulan|establece|establecen|exige|exigen|fija|fijan|incluye|incluyen|define|define[n]?|requiere|requieren|garantiza|garantizan|prevé|prevén|admite|admiten|limita|limitan|permite|permiten|obliga|obligan|consiste|constituye|constituyen|contiene|contienen|comprende|comprenden|abarca|abarcan|corresponde|corresponden|se aplica|se aplican|debe|deben|conviene|supone|suponen|impone|imponen)(?=\s)/;
function variantesNegacion(s) {
  if (/\bno\b/i.test(s)) return [];
  const m = VERBO_NEG.exec(s);
  if (!m) return [];
  const pos = m.index + m[1].length;
  const nuevo = s.slice(0, pos) + 'no ' + s.slice(pos);
  return nuevo === s ? [] : [nuevo];
}

// Desplazamiento del número de artículo citado: "art. 17" -> "art. 18" o "art. 16".
function variantesArticulo(s) {
  const res = [];
  const re = /(art(?:ículo)?s?\.?\s*)(\d+)/i;
  const m = re.exec(s);
  if (!m) return res;
  const n = parseInt(m[2], 10);
  for (const d of [1, -1]) {
    if (n + d < 1) continue;
    res.push(s.slice(0, m.index) + m[1] + String(n + d) + s.slice(m.index + m[0].length));
  }
  return res;
}

// Distractores distintos entre sí y distintos de la frase verdadera.
function distractores(s) {
  const pool = [];
  const vistos = new Set([s]);
  for (const v of [...variantesNegacion(s), ...variantesArticulo(s), ...variantesNumericas(s), ...variantesTermino(s)]) {
    if (!vistos.has(v)) { vistos.add(v); pool.push(v); }
  }
  return pool;
}

// Título corto del tema para los enunciados.
function tituloCorto(t) {
  const base = t.titulo.split(/[.]\s/)[0];
  const corto = base.length > 110 ? base.slice(0, 107).replace(/\s+\S*$/, '') + '…' : base;
  return corto.replace(/\.$/, '');
}

// Frases fuente del tema, con su sección de origen.
function fuentesDelTema(id) {
  const d = leer(path.join(DIR, 'desarrollo', id + '.json'));
  const r = leer(path.join(DIR, 'temas', id + '.json'));
  const out = [];
  const vistas = new Set();
  const add = (texto, seccion) => {
    for (const f of frasesDe(texto)) {
      if (vistas.has(f)) continue;
      vistas.add(f);
      out.push({ texto: f, seccion });
    }
  };
  for (const s of d.secciones) for (const p of s.parrafos) add(p, s.titulo.replace(/^\d+(\s?(bis|ter))?\.\s*/, ''));
  for (const b of r.resumen) for (const p of b.puntos) add(p + (/[.]$/.test(p) ? '' : '.'), b.titulo);
  for (const q of r.test) add(q.explicacion, 'Explicación de la pregunta revisada');
  return out;
}

// ---------- construcción ----------
const banco = [];
const informe = [];

for (const t of temas) {
  const rnd = prng(t.id);
  const tit = tituloCorto(t);
  const r = leer(path.join(DIR, 'temas', t.id + '.json'));

  // 1) preguntas revisadas
  const revisadas = r.test.map((q, i) => ({
    id: `${t.id}-${String(i + 1).padStart(3, '0')}`,
    tema: t.id,
    bloque: t.bloque,
    origen: 'revisada',
    enunciado: q.pregunta,
    opciones: q.opciones,
    correcta: q.correcta,
    explicacion: q.explicacion,
    referencia: q.referencia,
  }));

  // 2) preguntas generadas
  const fuentes = fuentesDelTema(t.id);
  const usables = [];
  for (const f of fuentes) {
    const d = distractores(f.texto);
    if (d.length >= 3) usables.push({ ...f, distractores: d });
  }
  const orden = barajar(usables, rnd);
  const generadas = [];
  const necesarias = POR_TEMA - revisadas.length;
  // Pasada 0: cada frase útil una vez. Pasadas siguientes (solo si faltan preguntas):
  // se reutiliza la frase con otro estilo o con otros distractores y la pregunta se
  // marca como "reutilizada". Estilo A necesita 3 distractores; estilo B, uno.
  let k = 0;
  const firmas = new Set();
  const firma = (q) => q.enunciado + "|" + [...q.opciones].sort().join("|");
  const añadir = (q) => { const fz = firma(q); if (firmas.has(fz)) return; firmas.add(fz); generadas.push(q); };
  for (let pasada = 0; pasada < 40 && generadas.length < necesarias; pasada++) {
    for (const f of orden) {
      if (generadas.length >= necesarias) break;
      const estiloB = k % 2 === 1;
      k++;
      const dist = barajar(f.distractores, rnd);
      if (!estiloB) {
        if (dist.length < 3) continue;
        const elegidos = dist.slice(0, 3);
        const enunciado = `Según el tema «${tit}», ¿cuál de las siguientes afirmaciones es correcta?`;
        const opc = barajar([f.texto, ...elegidos], rnd);
        añadir({ tema: t.id, bloque: t.bloque, origen: "generada", reutilizada: pasada > 0, enunciado, opciones: opc, correcta: opc.indexOf(f.texto), explicacion: `Texto del temario (${f.seccion}): «${f.texto}»`, referencia: f.seccion });
      } else {
        if (dist.length < 1) continue;
        const otras = orden.filter((g) => g.texto !== f.texto && !g.distractores.includes(f.texto));
        if (otras.length < 3) continue;
        const verdaderas = barajar(otras, rnd).slice(0, 3).map((g) => g.texto);
        const malas = dist[0];
        const enunciado = `Según el tema «${tit}», ¿cuál de las siguientes afirmaciones NO es correcta?`;
        const opc = barajar([malas, ...verdaderas], rnd);
        añadir({ tema: t.id, bloque: t.bloque, origen: "generada", reutilizada: pasada > 0, enunciado, opciones: opc, correcta: opc.indexOf(malas), explicacion: `Texto del temario (${f.seccion}): «${f.texto}»`, referencia: f.seccion });
      }
    }
  }
  generadas.length = Math.min(generadas.length, necesarias);

  const todas = [...revisadas, ...generadas.map((g, i) => ({
    id: `${t.id}-${String(revisadas.length + i + 1).padStart(3, '0')}`,
    ...g,
  }))];
  informe.push({ tema: t.id, revisadas: revisadas.length, generadas: generadas.length, total: todas.length, fuentes_utiles: usables.length, fuentes_totales: fuentes.length });
  banco.push(...todas);
}

const cortos = informe.filter((x) => x.total !== POR_TEMA);
if (cortos.length) {
  console.error('Temas con menos de 100 preguntas:');
  for (const c of cortos) console.error(`  ${c.tema}: ${c.total} (fuentes útiles ${c.fuentes_utiles})`);
  process.exitCode = 1;
}

fs.writeFileSync(path.join(DIR, 'banco.json'), JSON.stringify(banco, null, 0) + '\n');
fs.writeFileSync(path.join(DIR, 'banco.js'), 'window.BANCO = ' + JSON.stringify(banco) + ';\n');
const totalGen = banco.filter((q) => q.origen === 'generada').length;
console.log(`Banco: ${banco.length} preguntas en ${temas.length} temas (${banco.length - totalGen} revisadas, ${totalGen} generadas).`);
const minimo = Math.min(...informe.map((x) => x.fuentes_utiles));
console.log(`Fuentes útiles por tema: mínimo ${minimo}, media ${(informe.reduce((n, x) => n + x.fuentes_utiles, 0) / informe.length).toFixed(0)}.`);
