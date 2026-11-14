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

const HEAD_ART = /^(?:Art[ií]culo|ART[IÍ]CULO)\s+(\d+(?:\s*(?:bis|ter|qu[aá]ter|quinquies|sexies|septies|octies|novies|decies))?|únic[oa]|ÚNIC[OA]|[IVXLC]+)\b[.\sºª-]*(.*)$/;
const SUFIJO_LATIN_RE = '(?:bis|ter|qu[aá]ter|quinquies|sexies|septies|octies|novies|decies)';
const NUM_PALABRA_RE = '(?:(?:ciento|cien|doscient[oa]s|trescient[oa]s)\\s+)?(?:(?:treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)(?:\\s+(?:y\\s+)?(?:un[oa]?|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|primer[oa]?|segund[oa]?|tercer[oa]?|cuart[oa]?|quint[oa]?|sext[oa]?|s[eé]ptim[oa]?|octav[oa]?|noven[oa]?))?|veinti(?:[uú]n[oa]?|d[oó]s|tr[eé]s|cuatro|cinco|s[eé]is|siete|ocho|nueve)|dieci(?:s[eé]is|siete|ocho|nueve)|veinte|diez|once|doce|trece|catorce|quince|cien|primer[oa]?|segund[oa]?|tercer[oa]?|cuart[oa]?|quint[oa]?|sext[oa]?|s[eé]ptim[oa]?|octav[oa]?|noven[oa]?|d[eé]cim[oa]?|un[oa]?|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)';
const HEAD_ART_PALABRA = new RegExp(`^(?:Art[ií]culo|ART[IÍ]CULO)\\s+(${NUM_PALABRA_RE}(?:\\s+${SUFIJO_LATIN_RE})?)\\.?\\s*(.*)$`);
const HEAD_CTE_SEC = /^(?:Secci[oó]n|SECCI[OÓ]N)\s+(SI|SUA|HE|HS|HR|SE(?:-[A-Z]+)?)\s*(\d+)?\b[.\s-]*(.*)$/;
const HEAD_CTE_DOT = /^(SI|SUA|HE|HS|HR|SE(?:-[A-Z]+)?)\s*(\d+)\.\s+([A-ZÁÉÍÓÚÑ].*)$/;
const HEAD_NUM_SEC = /^(\d+(?:\.\d+){0,2})\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s,()/-]{3,85})$/;
const HEAD_STRUCT = /^((?:CAP[IÍ]TULO|T[IÍ]TULO|ANEJO|ANEXO|SECCI[OÓ]N|Secci[oó]n|Disposici[oó]n\s+(?:adicional|transitoria|derogatoria|final)|DISPOSICI[OÓ]N\s+(?:ADICIONAL|TRANSITORIA|DEROGATORIA|FINAL))\s+[^\n.]{1,85})(?:\.\s*(.*))?$/;
const RUIDO = /^(?:BOLET[IÍ]N OFICIAL|LEGISLACI[OÓ]N CONSOLIDADA|P[aá]gina\s+\d+|N[úu]m\.\s+\d+|https?:\/\/|cve:\s*BOE|Verificable en|D\s*ocumento\s+B\s*[aá]sico\s+)/i;

const UNIDADES_ES = {
  primer: 1, primero: 1, primera: 1, uno: 1, una: 1, un: 1,
  segundo: 2, segunda: 2, dos: 2,
  tercer: 3, tercero: 3, tercera: 3, tres: 3,
  cuarto: 4, cuarta: 4, cuatro: 4,
  quinto: 5, quinta: 5, cinco: 5,
  sexto: 6, sexta: 6, seis: 6,
  septimo: 7, septima: 7, siete: 7,
  octavo: 8, octava: 8, ocho: 8,
  noveno: 9, novena: 9, nueve: 9,
  decimo: 10, decima: 10, diez: 10,
  once: 11, doce: 12, trece: 13, catorce: 14, quince: 15,
  dieciseis: 16, diecisiete: 17, dieciocho: 18, diecinueve: 19,
  veinte: 20, veintiuno: 21, veintiuna: 21, veintiun: 21,
  veintidos: 22, veintitres: 23, veinticuatro: 24, veinticinco: 25,
  veintiseis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29
};
const DECENAS_ES = {
  treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90
};
const CENTENAS_ES = {
  cien: 100, ciento: 100, doscientos: 200, doscientas: 200, trescientos: 300, trescientas: 300
};

function palabrasANumeroArticulo(txt) {
  const clean = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  const mSuf = clean.match(/\b(bis|ter|quater|quinquies|sexies|septies|octies|novies|decies)$/);
  const suf = mSuf ? ' ' + mSuf[1] : '';
  const body = (mSuf ? clean.slice(0, mSuf.index) : clean).trim();
  const toks = body.split(/\s+/).filter(t => t !== 'y');
  let total = 0;
  let matched = false;
  for (const t of toks) {
    if (CENTENAS_ES[t] != null) { total += CENTENAS_ES[t]; matched = true; }
    else if (DECENAS_ES[t] != null) { total += DECENAS_ES[t]; matched = true; }
    else if (UNIDADES_ES[t] != null) { total += UNIDADES_ES[t]; matched = true; }
    else return null;
  }
  return matched && total > 0 ? String(total) + suf : null;
}

async function extractFromPdf(pdfPath, lawId) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data, verbosity: 0 }).promise;
  const rawItems = [];
  const pageTexts = [];
  let current = null;
  let currentMajorObj = null;
  let currentMajorSec = '';
  let inToc = false;
  let tueTfueParte = lawId === 'TUE-TFUE' ? 'TUE' : '';

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

    if (lawId === 'TUE-TFUE' && p >= 40) {
      const joined = lines.join(' ');
      if (/TRATADO\s+DE\s+FUNCIONAMIENTO\s+DE\s+LA\s+UNI[ÓO]N\s+EUROPEA/i.test(joined) && p >= 47) {
        tueTfueParte = 'TFUE';
      } else if (/^PROTOCOLOS$/i.test(lines[0] || '') || (p >= 200 && /\bPROTOCOLOS\b/.test(joined) && !/VERSI[ÓO]N CONSOLIDADA/.test(joined))) {
        tueTfueParte = 'PROT';
      }
    }

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
        const pref = lawId === 'TUE-TFUE' ? tueTfueParte.toLowerCase() + '-' : '';
        const prefTit = lawId === 'TUE-TFUE' ? tueTfueParte + ' · ' : '';
        current = {
          tipo: 'art',
          clave: pref + 'art-' + num.toLowerCase() + (lawId === 'TUE-TFUE' && tueTfueParte === 'PROT' ? '-p' + p : ''),
          num: num.toLowerCase(),
          titulo: prefTit + 'Artículo ' + num + (tit ? '. ' + tit : ''),
          pag: p,
          texto: ''
        };
        rawItems.push(current);
        continue;
      }
      if ((m = HEAD_ART_PALABRA.exec(line))) {
        const numConv = palabrasANumeroArticulo(m[1]);
        if (numConv) {
          const tit = m[2].trim().replace(/\.$/, '');
          current = {
            tipo: 'art',
            clave: 'art-' + numConv.toLowerCase(),
            num: numConv.toLowerCase(),
            titulo: 'Artículo ' + numConv + (tit ? '. ' + tit : ''),
            pag: p,
            texto: ''
          };
          rawItems.push(current);
          continue;
        }
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

const onlyArg = process.argv.find(a => a.startsWith('--only='));
const onlySet = onlyArg ? new Set(onlyArg.slice(7).split(',').map(s => s.trim()).filter(Boolean)) : null;

let totalLaws = 0;
let totalPrecepts = 0;

for (const l of catalogo) {
  if (onlySet && !onlySet.has(l.id)) continue;
  const fullPath = path.join(RAIZ, l.pdf);
  if (!fs.existsSync(fullPath)) continue;
  const res = await extractFromPdf(fullPath, l.id);

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
