#!/usr/bin/env node
/*
 * Valida el contenido de datos/temas/*.json contra datos/temario-andalucia.json
 * y datos/leyes.json, y genera datos/contenido.js (que carga index.html).
 *
 * Uso: node datos/build.js
 * Sin dependencias. Sale con código 1 si hay errores; los avisos no bloquean.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const errores = [];
const avisos = [];
const err = (msg) => errores.push(msg);
const aviso = (msg) => avisos.push(msg);

const leerJSON = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const esTextoNoVacio = (s) => typeof s === 'string' && s.trim().length > 0;

// 1. Temario de referencia
const temario = leerJSON(path.join(DIR, 'temario-andalucia.json'));
const idsTemario = temario.temas.map((t) => t.id);
if (temario.total_temas !== 70 || temario.temas.length !== 70) {
  err(`temario-andalucia.json: se esperaban 70 temas y hay ${temario.temas.length}`);
}
if (new Set(idsTemario).size !== idsTemario.length) err('temario: hay ids duplicados');

// 2. Catálogo de leyes
const leyesCat = leerJSON(path.join(DIR, 'leyes.json')).leyes;
const leyes = {};
for (const l of leyesCat) {
  if (!esTextoNoVacio(l.id) || !esTextoNoVacio(l.nombre) || !esTextoNoVacio(l.referencia)) {
    err(`leyes.json: entrada incompleta (${l.id || '?'})`);
    continue;
  }
  if (leyes[l.id]) err(`leyes.json: id duplicado ${l.id}`);
  leyes[l.id] = l;
  if (l.verificada === false) aviso(`ley ${l.id} sin verificar (${l.referencia})`);
  if (l.verificada === 'parcial') aviso(`ley ${l.id} verificada solo en parte: ${l.notas}`);
  if (l.verificada !== true && l.verificada !== false && l.verificada !== 'parcial') {
    err(`ley ${l.id}: campo verificada debe ser true, 'parcial' o false`);
  }
}

// 3. Temas con contenido
const dirTemas = path.join(DIR, 'temas');
const ficheros = fs.existsSync(dirTemas)
  ? fs.readdirSync(dirTemas).filter((f) => f.endsWith('.json')).sort()
  : [];
const contenido = {};

for (const f of ficheros) {
  const idArchivo = f.replace(/\.json$/, '');
  let t;
  try {
    t = leerJSON(path.join(dirTemas, f));
  } catch (e) {
    err(`${f}: JSON no válido (${e.message})`);
    continue;
  }
  const p = `[${idArchivo}]`;
  if (t.id !== idArchivo) err(`${p} el campo id (${t.id}) no coincide con el nombre del archivo`);
  if (!idsTemario.includes(t.id)) err(`${p} no existe en temario-andalucia.json`);

  // resumen
  if (!Array.isArray(t.resumen) || t.resumen.length < 3 || t.resumen.length > 8) {
    err(`${p} resumen: se esperan entre 3 y 8 bloques`);
  } else {
    t.resumen.forEach((b, i) => {
      if (!esTextoNoVacio(b.titulo)) err(`${p} resumen[${i}] sin título`);
      if (!Array.isArray(b.puntos) || b.puntos.length === 0 || !b.puntos.every(esTextoNoVacio)) {
        err(`${p} resumen[${i}] puntos vacíos o no válidos`);
      }
    });
  }

  // leyes
  if (!Array.isArray(t.leyes) || t.leyes.length === 0) {
    err(`${p} leyes: debe haber al menos una`);
  } else {
    for (const l of t.leyes) {
      if (!leyes[l.id]) err(`${p} cita la ley "${l.id}" que no está en leyes.json`);
      if (!esTextoNoVacio(l.rol)) err(`${p} ley ${l.id}: falta el rol`);
    }
  }

  // test
  if (!Array.isArray(t.test) || t.test.length !== 10) {
    err(`${p} test: se esperan exactamente 10 preguntas y hay ${t.test ? t.test.length : 0}`);
  } else {
    const preguntas = new Set();
    const posiciones = [0, 0, 0, 0];
    t.test.forEach((q, i) => {
      const pq = `${p} test[${i}]`;
      if (!esTextoNoVacio(q.pregunta)) err(`${pq} sin pregunta`);
      if (preguntas.has(q.pregunta)) err(`${pq} pregunta duplicada`);
      preguntas.add(q.pregunta);
      if (!Array.isArray(q.opciones) || q.opciones.length !== 4 || !q.opciones.every(esTextoNoVacio)) {
        err(`${pq} debe tener 4 opciones no vacías`);
      } else if (new Set(q.opciones).size !== 4) {
        err(`${pq} opciones repetidas`);
      }
      if (!Number.isInteger(q.correcta) || q.correcta < 0 || q.correcta > 3) {
        err(`${pq} correcta debe ser 0-3`);
      } else {
        posiciones[q.correcta]++;
      }
      if (!esTextoNoVacio(q.explicacion)) err(`${pq} sin explicación`);
      if (!esTextoNoVacio(q.referencia)) err(`${pq} sin referencia legal`);
    });
    const max = Math.max(...posiciones);
    if (max > 5) aviso(`${p} la posición correcta se repite demasiado: ${posiciones.join('/')}`);
  }

  for (const l of t.leyes || []) {
    if (leyes[l.id] && leyes[l.id].verificada !== true) {
      aviso(`${p} usa la ley ${l.id} que no está verificada del todo`);
    }
  }

  contenido[t.id] = { resumen: t.resumen, leyes: t.leyes, test: t.test };
}

// 4. Cobertura: informativa
const conContenido = Object.keys(contenido).length;
console.log(`Temas en el temario: ${idsTemario.length}`);
console.log(`Temas con contenido: ${conContenido}`);
console.log(`Pendientes: ${idsTemario.length - conContenido}`);

if (avisos.length) {
  console.log(`\nAvisos (${avisos.length}):`);
  avisos.forEach((a) => console.log('  - ' + a));
}

if (errores.length) {
  console.error(`\nErrores (${errores.length}):`);
  errores.forEach((e) => console.error('  x ' + e));
  process.exit(1);
}

// 5. Generar datos/contenido.js
const salida = {
  temario: {
    fuente: temario.fuente || 'Junta de Andalucía',
    cuerpo: temario.cuerpo,
    fuentes: temario.fuentes,
    bloques: temario.bloques,
    temas: temario.temas.map((t) => ({ id: t.id, num: t.num, bloque: t.bloque, titulo: t.titulo })),
  },
  leyes,
  contenido,
};

const js =
  '/* Generado por datos/build.js. No editar a mano: editar datos/temas/*.json y leyes.json. */\n' +
  'window.DATOS_ESTUDIO = ' +
  JSON.stringify(salida, null, 1) +
  ';\n';
fs.writeFileSync(path.join(DIR, 'contenido.js'), js, 'utf8');
console.log('\nOK: datos/contenido.js generado.');
