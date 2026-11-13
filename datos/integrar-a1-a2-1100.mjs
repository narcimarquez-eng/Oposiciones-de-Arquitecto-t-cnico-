import fs from 'fs';

const a1Txt = fs.readFileSync('/tmp/a1_1100.txt', 'utf8');
const a2Txt = fs.readFileSync('/tmp/a2_1100.txt', 'utf8');

const HEADERS = [
  'DERECHO CONSTITUCIONAL',
  'ORGANIZACIÓN DE LA COMUNIDAD AUTÓNOMA DE ANDALUCÍA',
  'LA UNIÓN EUROPEA',
  'GESTIÓN PÚBLICA Y SISTEMAS DE INFORMACIÓN',
  'INNOVACIÓN E IGUALDAD DE GÉNERO EN ANDALUCÍA',
  'IGUALDAD DE GÉNERO EN ANDALUCÍA',
  'DERECHO CIVIL',
  'DERECHO ADMINISTRATIVO Y POLÍTICAS SECTORIALES',
  'DERECHO ADMINISTRATIVO',
  'HACIENDA PÚBLICA',
  'DERECHO LABORAL',
  'FUNCIÓN PÚBLICA'
];

function parseSyllabus(txt, total) {
  // Remove page numbers like 1/9, 2/9, 1/7, etc.
  let clean = txt.replace(/\r/g, '').replace(/\b\d+\s*\/\s*\d+\b/g, '\n');
  const result = [];
  for (let i = 1; i <= total; i++) {
    const startRe = new RegExp('(?:^|\\s)Tema\\s+' + i + '\\.\\s*', 'm');
    const mStart = startRe.exec(clean);
    if (!mStart) {
      throw new Error('Could not find Tema ' + i);
    }
    const startIdx = mStart.index + mStart[0].length;
    let endIdx = clean.length;
    if (i < total) {
      const nextRe = new RegExp('(?:^|\\s)Tema\\s+' + (i + 1) + '\\.\\s*', 'm');
      const mNext = nextRe.exec(clean.slice(startIdx));
      if (!mNext) {
        throw new Error('Could not find next Tema ' + (i + 1));
      }
      endIdx = startIdx + mNext.index;
    }
    let raw = clean.slice(startIdx, endIdx).replace(/\s+/g, ' ').trim();
    // Strip trailing block headers if any appear at the end of raw
    for (const h of HEADERS) {
      const hPattern = new RegExp('\\s*' + h.replace(/\s+/g, '\\s+') + '\\s*$', 'i');
      raw = raw.replace(hPattern, '').trim();
    }
    result.push({ num: i, titulo: raw });
  }
  return result;
}

const parsedA1 = parseSyllabus(a1Txt, 100);
const parsedA2 = parseSyllabus(a2Txt, 69);

console.log('Successfully parsed A1.1100:', parsedA1.length, 'temas');
console.log('Successfully parsed A2.1100:', parsedA2.length, 'temas');

// Map A1.1100 (100 topics) to content IDs and official BOJA blocks
const mapA1 = {
  1: 'c01', 2: 'c01', 3: 'c01', 4: 'c02', 5: 'c02', 6: 'c02', 7: 'c03', 8: 'c02', 9: 'c02', 10: 'g13', 11: 'g13', 12: 'c03', 13: 'c04', 14: 'c04', 15: 'c04', 16: 'c04',
  17: 'c05', 18: 'c05', 19: 'c06', 20: 'c07', 21: 'c06', 22: 'c08', 23: 'c08',
  24: 'c09', 25: 'c09', 26: 'c09', 27: 'c10', 28: 'c10', 29: 'c10',
  30: 'c35', 31: 'c35', 32: 'c25', 33: 'c35', 34: 'c35', 35: 'c35', 36: 'c23', 37: 'c24', 38: 'c27',
  39: 'c31', 40: 'c31', 41: 'c29', 42: 'c30',
  43: 'g14', 44: 'g14', 45: 'g14', 46: 'g14',
  47: 'c11', 48: 'c11', 49: 'c12', 50: 'c12', 51: 'c12', 52: 'c13', 53: 'c13', 54: 'c14', 55: 'c15', 56: 'c15', 57: 'c16', 58: 'c16', 59: 'c19', 60: 'c32', 61: 'c17', 62: 'c17', 63: 'c18', 64: 'g15', 65: 'c33', 66: 'g19', 67: 'g19', 68: 'g19', 69: 'e39', 70: 'g20', 71: 'e02', 72: 'g20', 73: 'g20', 74: 'g20', 75: 'e34', 76: 'e35', 77: 'g20',
  78: 'g16', 79: 'g16', 80: 'c21', 81: 'g01', 82: 'g01', 83: 'c34', 84: 'g16', 85: 'g16',
  86: 'g17', 87: 'g17', 88: 'g18', 89: 'g17', 90: 'g18', 91: 'g18', 92: 'g05', 93: 'g05', 94: 'g18',
  95: 'c20', 96: 'c20', 97: 'c20', 98: 'c20', 99: 'g04', 100: 'c20'
};

function getBloqueA1(n) {
  if (n <= 16) return { id: 'a1-constitucional', nombre: 'Derecho Constitucional (Temas 1 a 16)', corto: 'Constitucional' };
  if (n <= 23) return { id: 'a1-organizacion-ca', nombre: 'Organización de la Comunidad Autónoma de Andalucía (Temas 17 a 23)', corto: 'Organización CA' };
  if (n <= 29) return { id: 'a1-ue', nombre: 'La Unión Europea (Temas 24 a 29)', corto: 'Unión Europea' };
  if (n <= 38) return { id: 'a1-gestion-sistemas', nombre: 'Gestión Pública y Sistemas de Información (Temas 30 a 38)', corto: 'Gestión y Sistemas' };
  if (n <= 42) return { id: 'a1-innovacion-igualdad', nombre: 'Innovación e Igualdad de Género en Andalucía (Temas 39 a 42)', corto: 'Innovación e Igualdad' };
  if (n <= 46) return { id: 'a1-civil', nombre: 'Derecho Civil (Temas 43 a 46)', corto: 'Derecho Civil' };
  if (n <= 77) return { id: 'a1-administrativo', nombre: 'Derecho Administrativo y Políticas Sectoriales (Temas 47 a 77)', corto: 'Administrativo y Sectorial' };
  if (n <= 85) return { id: 'a1-hacienda', nombre: 'Hacienda Pública (Temas 78 a 85)', corto: 'Hacienda Pública' };
  if (n <= 94) return { id: 'a1-laboral', nombre: 'Derecho Laboral (Temas 86 a 94)', corto: 'Derecho Laboral' };
  return { id: 'a1-funcion-publica', nombre: 'Función Pública (Temas 95 a 100)', corto: 'Función Pública' };
}

// Map A2.1100 (69 topics) to content IDs and official BOJA blocks
const mapA2 = {
  1: 'c01', 2: 'c01', 3: 'c01', 4: 'c02', 5: 'c03', 6: 'c03', 7: 'c04', 8: 'c04', 9: 'g13', 10: 'g13',
  11: 'c05', 12: 'c05', 13: 'c06', 14: 'c07', 15: 'c06', 16: 'c08', 17: 'c08',
  18: 'c09', 19: 'c09', 20: 'c10',
  21: 'c35', 22: 'c35', 23: 'c25', 24: 'c23', 25: 'c24',
  26: 'c29', 27: 'c30',
  28: 'c11', 29: 'c11', 30: 'c12', 31: 'c12', 32: 'c12', 33: 'c13', 34: 'c13', 35: 'c14', 36: 'c17', 37: 'c15', 38: 'c15', 39: 'c16', 40: 'c16', 41: 'c16', 42: 'c19', 43: 'c32', 44: 'c17', 45: 'c18', 46: 'g15', 47: 'c33',
  48: 'g16', 49: 'c21', 50: 'g01', 51: 'g01', 52: 'c34', 53: 'g16', 54: 'g16',
  55: 'g17', 56: 'g17', 57: 'g18', 58: 'g18', 59: 'g18', 60: 'g05', 61: 'g05', 62: 'g18',
  63: 'c20', 64: 'c20', 65: 'c20', 66: 'c20', 67: 'g04', 68: 'g04', 69: 'c20'
};

function getBloqueA2(n) {
  if (n <= 10) return { id: 'a2-constitucional', nombre: 'Derecho Constitucional (Temas 1 a 10)', corto: 'Constitucional' };
  if (n <= 17) return { id: 'a2-organizacion-ca', nombre: 'Organización de la Comunidad Autónoma de Andalucía (Temas 11 a 17)', corto: 'Organización CA' };
  if (n <= 20) return { id: 'a2-ue', nombre: 'La Unión Europea (Temas 18 a 20)', corto: 'Unión Europea' };
  if (n <= 25) return { id: 'a2-gestion-sistemas', nombre: 'Gestión Pública y Sistemas de Información (Temas 21 a 25)', corto: 'Gestión y Sistemas' };
  if (n <= 27) return { id: 'a2-igualdad', nombre: 'Igualdad de Género en Andalucía (Temas 26 a 27)', corto: 'Igualdad' };
  if (n <= 47) return { id: 'a2-administrativo', nombre: 'Derecho Administrativo (Temas 28 a 47)', corto: 'Administrativo' };
  if (n <= 54) return { id: 'a2-hacienda', nombre: 'Hacienda Pública (Temas 48 a 54)', corto: 'Hacienda Pública' };
  if (n <= 62) return { id: 'a2-laboral', nombre: 'Derecho Laboral (Temas 55 a 62)', corto: 'Derecho Laboral' };
  return { id: 'a2-funcion-publica', nombre: 'Función Pública (Temas 63 a 69)', corto: 'Función Pública' };
}

function buildCuerpo(meta, parsedTemas, mapIds, getBloqueFn) {
  const bloquesMap = new Map();
  const temasList = [];
  for (const pt of parsedTemas) {
    const b = getBloqueFn(pt.num);
    const contentId = mapIds[pt.num];
    if (!contentId) throw new Error('Missing contentId for tema ' + pt.num);
    if (!bloquesMap.has(b.id)) {
      bloquesMap.set(b.id, {
        id: b.id,
        nombre: b.nombre,
        nombreCorto: b.corto,
        temas: []
      });
    }
    const bObj = bloquesMap.get(b.id);
    if (!bObj.temas.includes(contentId)) {
      bObj.temas.push(contentId);
    }
    temasList.push({
      num: pt.num,
      etiqueta: 'Tema ' + pt.num,
      id: contentId,
      bloque: b.id,
      bloqueNombre: b.nombre,
      titulo: pt.titulo
    });
  }
  return {
    ...meta,
    bloques: Array.from(bloquesMap.values()),
    temas: temasList
  };
}

const cuerpoA1_1100 = buildCuerpo({
  id: 'a1-1100',
  codigo: 'A1.1100',
  subgrupo: 'A1',
  nombreCorto: 'A1.1100 · Administradores Generales',
  nombreCompleto: 'Cuerpo Superior de Administradores, especialidad Administración General (A1.1100)',
  normativa: 'BOJA núm. 106 de 3 de junio de 2024 (Resolución de 28 de mayo de 2024, IAAP — 100 temas)',
  totalTemas: 100,
  minutosExamen: 150,
  preguntasExamen: 100,
  reservaExamen: 5,
  penalizacion: 1 / 3
}, parsedA1, mapA1, getBloqueA1);

const cuerpoA2_1100 = buildCuerpo({
  id: 'a2-1100',
  codigo: 'A2.1100',
  subgrupo: 'A2',
  nombreCorto: 'A2.1100 · Gestión Administrativa',
  nombreCompleto: 'Cuerpo de Gestión Administrativa, especialidad Administración General (A2.1100)',
  normativa: 'BOJA núm. 106 de 3 de junio de 2024 (Resolución de 28 de mayo de 2024, IAAP — 69 temas)',
  totalTemas: 69,
  minutosExamen: 120,
  preguntasExamen: 100,
  reservaExamen: 5,
  penalizacion: 1 / 3
}, parsedA2, mapA2, getBloqueA2);

const cuerpos = JSON.parse(fs.readFileSync('datos/cuerpos-andalucia.json', 'utf8'));

const orderedCuerpos = {
  'a2-2001': cuerpos['a2-2001'],
  'a1-2001': cuerpos['a1-2001'],
  'a1-1100': cuerpoA1_1100,
  'a2-1100': cuerpoA2_1100,
  'c1-1100': cuerpos['c1-1100'],
  'c2-1100': cuerpos['c2-1100']
};

fs.writeFileSync('datos/cuerpos-andalucia.json', JSON.stringify(orderedCuerpos, null, 2) + '\n', 'utf8');
console.log('Updated datos/cuerpos-andalucia.json with a1-1100 (100 temas) and a2-1100 (69 temas)!');
