#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(__dirname, '..');
const OUT_DIR = path.join(__dirname, 'preceptos');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const catalogo = JSON.parse(fs.readFileSync(path.join(__dirname, 'leyes.json'), 'utf8')).leyes;

const HEAD_ART = /^(?:Art[ií]culo|ART[IÍ]CULO)\s+(\d+(?:\s*(?:bis|ter|qu[aá]ter|quinquies|sexies|septies|octies|novies|decies))?|únic[oa]|ÚNIC[OA]|[IVXLC]+)\b[.\s-]*(.*)$/;
const HEAD_CTE_SEC = /^(?:Secci[oó]n|SECCI[OÓ]N)\s+(SI|SUA|HE|HS|HR|SE(?:-[A-Z]+)?)\s*(\d+)?\b[.\s-]*(.*)$/;
const HEAD_CTE_DOT = /^(SI|SUA|HE|HS|HR|SE(?:-[A-Z]+)?)\s*(\d+)\.\s+([A-ZÁÉÍÓÚÑ].*)$/;
const HEAD_NUM_SEC = /^(\d+(?:\.\d+){0,2})\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s,()/-]{3,85})$/;
const HEAD_STRUCT = /^((?:CAP[IÍ]TULO|T[IÍ]TULO|ANEJO|ANEXO|SECCI[OÓ]N|Secci[oó]n|Disposici[oó]n\s+(?:adicional|transitoria|derogatoria|final)|DISPOSICI[OÓ]N\s+(?:ADICIONAL|TRANSITORIA|DEROGATORIA|FINAL))\s+[^\n.]{1,85})(?:\.\s*(.*))?$/;
const RUIDO = /^(?:BOLET[IÍ]N OFICIAL|LEGISLACI[OÓ]N CONSOLIDADA|P[aá]gina\s+\d+|N[úu]m\.\s+\d+|https?:\/\/|cve:\s*BOE|Verificable en|D\s*ocumento\s+B\s*[aá]sico\s+)/i;

async function extractFromPdf(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data, verbosity: 0 }).promise;
  const rawItems = [];
  const pageTexts = [];
  let current = null;
  let currentMajorObj = null;
  let currentMajorSec = '';
  let inToc = false;

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    let lastY = null, lines = [], cur = '';
    for (const it of tc.items) {
      if (lastY !== null && Math.abs(it.transform[5] - lastY) > 3) {
        if (cur.trim()) lines.push(cur.trim());
        cur = '';
      }
      cur += (cur && !cur.endsWith(' ') && !it.str.startsWith(' ') ? ' ' : '') + it.str;
      lastY = it.transform[5];
    }
    if (cur.trim()) lines.push(cur.trim());

    const cleanPageLines = lines.filter(l => !RUIDO.test(l));
    if (cleanPageLines.length) {
      pageTexts.push({
        tipo: 'pag',
        clave: 'pag-' + p,
        num: String(p),
        titulo: 'Página ' + p + ' del documento oficial',
        pag: p,
        texto: cleanPageLines.join('\n').slice(0, 2600)
      });
    }

    const pageHasDots = lines.filter(l => /\.\s*\.\s*\.\s*\./.test(l)).length >= 2;
    const pageHasIndice = lines.some(l => /^(?:[IÍ]NDICE|[IÍ]ndice|SUMARIO|Sumario)$/.test(l));
    if (pageHasIndice || pageHasDots) inToc = true;
    else if (p > 2) inToc = false;

    for (const line of lines) {
      if (RUIDO.test(line) || /\.\s*\.\s*\.\s*\./.test(line)) continue;
      if (/^(?:[IÍ]NDICE|[IÍ]ndice|SUMARIO|Sumario)$/.test(line)) { inToc = true; continue; }
      if (inToc && p <= 12 && lines.length > 14 && lines.filter(l => /^\d+(\.\d+)*\s+[A-ZÁÉÍÓÚÑ]/.test(l)).length > 6) {
        continue;
      }

      let m;
      if ((m = HEAD_ART.exec(line))) {
        const num = m[1].replace(/\s+/g, ' ').trim();
        const tit = m[2].trim().replace(/\.$/, '');
        current = {
          tipo: 'art',
          clave: 'art-' + num.toLowerCase(),
          num: num.toLowerCase(),
          titulo: 'Artículo ' + num + (tit ? '. ' + tit : ''),
          pag: p,
          texto: ''
        };
        rawItems.push(current);
        continue;
      }
      if ((m = HEAD_CTE_SEC.exec(line)) || (m = HEAD_CTE_DOT.exec(line))) {
        const prefix = m[1].toUpperCase();
        const snum = (m[2] || '').trim();
        const tit = (m[3] || '').trim();
        currentMajorSec = prefix + (snum ? ' ' + snum : '');
        currentMajorObj = {
          tipo: 'sec',
          clave: 'sec-' + currentMajorSec.toLowerCase(),
          num: currentMajorSec.toLowerCase(),
          titulo: 'Sección ' + currentMajorSec + (tit ? '. ' + tit : ''),
          pag: p,
          texto: ''
        };
        current = currentMajorObj;
        rawItems.push(currentMajorObj);
        continue;
      }
      if ((m = HEAD_STRUCT.exec(line)) && line.length < 110) {
        const code = m[1].replace(/\s+/g, ' ').trim();
        const tit = (m[2] || '').trim();
        current = {
          tipo: 'sec',
          clave: 'str-' + code.toLowerCase(),
          num: code.toLowerCase(),
          titulo: code + (tit ? '. ' + tit : ''),
          pag: p,
          texto: ''
        };
        rawItems.push(current);
        continue;
      }
      if ((m = HEAD_NUM_SEC.exec(line)) && !/^\d+\s+(?:de\s+)?(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|horas|días|meses|años|metros|puntos|por\s+ciento|euros|millones|grados)\b/i.test(line)) {
        const num = m[1].trim();
        const tit = m[2].trim();
        const subClave = (currentMajorSec ? currentMajorSec.toLowerCase() + '-' : '') + num;
        current = {
          tipo: 'sub',
          clave: 'sub-' + subClave,
          num: subClave,
          padre: currentMajorSec || '',
          titulo: (currentMajorSec ? currentMajorSec + ' · ' : '') + num + ' ' + tit,
          pag: p,
          texto: ''
        };
        rawItems.push(current);
        if (currentMajorObj && currentMajorObj.texto.length < 2500) {
          currentMajorObj.texto += (currentMajorObj.texto ? '\n\n' : '') + '▸ ' + num + ' ' + tit;
        }
        continue;
      }
      if (current && current.texto.length < 2600) {
        current.texto += (current.texto ? '\n' : '') + line;
      }
      if (currentMajorObj && currentMajorObj !== current && currentMajorObj.texto.length < 2500) {
        currentMajorObj.texto += (currentMajorObj.texto ? '\n' : '') + line;
      }
    }
  }

  const byClave = new Map();
  for (const it of rawItems) {
    if (it.texto.trim().length < 20) continue;
    // Si empieza con un subtítulo en la primera línea y el título no tenía descripción, enriquecer el título
    if (it.tipo === 'sec' && !it.titulo.includes('.') && it.texto) {
      const firstLine = it.texto.split('\n')[0].trim();
      if (firstLine.length > 4 && firstLine.length < 85 && /^[A-ZÁÉÍÓÚÑ]/.test(firstLine) && !/^▸/.test(firstLine)) {
        it.titulo += '. ' + firstLine;
      }
    }
    const prev = byClave.get(it.clave);
    if (!prev || (prev.texto.length < 150 && it.texto.length > prev.texto.length)) {
      byClave.set(it.clave, it);
    }
  }

  let finalItems = [...byClave.values()];
  if (finalItems.length < 3 && pageTexts.length > 0) {
    finalItems = finalItems.concat(pageTexts);
  }
  return { numPages: doc.numPages, items: finalItems };
}

let totalLaws = 0;
let totalPrecepts = 0;

for (const l of catalogo) {
  const fullPath = path.join(RAIZ, l.pdf);
  if (!fs.existsSync(fullPath)) continue;
  const res = await extractFromPdf(fullPath);

  // Caso especial: DEC-AND-19-1995 es un PDF escaneado de 1995; si no tiene texto embebido, extraer del BOJA HTML
  if (l.id === 'DEC-AND-19-1995' && res.items.length === 0) {
    try {
      const resp = await fetch('https://www.juntadeandalucia.es/boja/1995/43/1');
      const html = await resp.text();
      const paras = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
      let cur = null;
      for (const p of paras) {
        const m = HEAD_ART.exec(p);
        if (m) {
          const num = m[1].replace(/\s+/g, ' ').trim();
          const tit = m[2].trim().replace(/\.$/, '');
          cur = { tipo: 'art', clave: 'art-' + num.toLowerCase(), num: num.toLowerCase(), titulo: 'Artículo ' + num + (tit ? '. ' + tit : ''), pag: 1, texto: '' };
          res.items.push(cur);
        } else if (cur && cur.texto.length < 2500) {
          cur.texto += (cur.texto ? '\n' : '') + p;
        }
      }
    } catch (e) { /* ignore */ }
  }

  const jsContent = 'window.PRECEPTOS_PDF = window.PRECEPTOS_PDF || {};\nwindow.PRECEPTOS_PDF[' + JSON.stringify(l.id) + '] = ' + JSON.stringify(res) + ';\n';
  fs.writeFileSync(path.join(OUT_DIR, l.id + '.js'), jsContent);
  totalLaws++;
  totalPrecepts += res.items.length;
}

console.log(`OK: ${totalLaws} normas procesadas en datos/preceptos/*.js (${totalPrecepts} artículos/secciones con página exacta y texto literal).`);
