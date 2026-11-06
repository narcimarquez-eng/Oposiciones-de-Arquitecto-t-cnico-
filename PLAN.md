# Plan: app visual de estudio — Cuerpo Técnico, Arquitectura Técnica (A2)

## 1. Supuestos y riesgos

- **Junta de Andalucía** (confirmada, única del proyecto): Cuerpo de Técnicos de Grado Medio, opción Arquitectura Técnica (A2.2001). **70 temas** = 30 comunes (`c01`–`c30`) + 40 específicos (`e01`–`e40`). Índice: `datos/temario-andalucia.json`. Fuentes: programa común (Res. 27/05/2024, BOJA 107) y programa específico (Anexo VII, Res. 04/06/2019, BOJA 109), con el texto coincidente en el PDF del IAAP.
- **Riesgo de vigencia (Andalucía):** el programa específico es el de 2019 y el común el de 2024. El específico no ha cambiado desde 2019 en las fuentes que encontré, pero la última convocatoria que vi es de febrero de 2025 y no he visto la BOJA de 2026 que la sustituya.
- **Andalucía, temas de contenido jurídico que cambian:** el temario andaluz cita la Ley de Ordenación de la Edificación, el CTE, la LCSP y la legislación urbanística andaluza. Estas normas se han modificado varias veces, así que cada referencia se verifica en BOE/BOJA antes de publicarse.
- **Vigencia de las leyes:** las normas se citan con su referencia (número, fecha) y se verifican contra BOE/DOCM antes de publicarse. No se afirma ninguna referencia sin haberla comprobado.

## 2. Entregable

Una **aplicación HTML sin build ni dependencias externas**, que se abre con doble clic (`file://`) y también en GitHub Pages:

- **Estudio por tema:** resumen estructurado, leyes aplicables con su referencia, y enlace a la norma.
- **Test por tema:** 10 preguntas tipo test (4 opciones, 1 correcta), con explicación y referencia legal de cada respuesta.
- **Modos adicionales:** test por bloque, test aleatorio mezclando temas, y repaso de fallos.
- **Progreso:** temas estudiados, aciertos por tema, guardado en `localStorage` (es un progreso personal, no hace falta base de datos).
- **Diseño:** responsive (móvil con margen de 16px, sin scroll horizontal), modo claro y oscuro.

## 3. Estructura del repositorio

Junta elegida: **Andalucía** (70 temas). Estructura real tras la fase 1:

```
index.html                       App (HTML + CSS + JS en un solo archivo, sin dependencias)
datos/
  temario-andalucia.json         Índice de los 70 temas (activo)
  temas/c01.json, e20.json …     Un archivo por tema: resumen, leyes, test (2 de 70 hechos)
  leyes.json                     Catálogo de leyes, con referencia y estado de verificación
  build.js                       Validación y generación de contenido.js (Node, sin dependencias)
  contenido.js                   Generado por build.js; lo carga index.html
fuentes/                         Programas oficiales en texto (Andalucía)
PLAN.md                          Este documento
README.md                        Cómo usar la app y cómo añadir contenido
```

Los archivos por tema permiten revisar y commitear por bloques, y el script de validación comprueba la estructura antes de cada commit. La app carga los datos con `<script>` (no `fetch`), así funciona también abriéndola desde disco.

## 4. Modelo de datos por tema

```json
{
  "id": "e09",
  "bloque": "edificacion",
  "titulo": "…texto literal del temario…",
  "resumen": [
    { "titulo": "Idea clave", "puntos": ["…", "…"] }
  ],
  "leyes": [
    { "id": "LOE", "rol": "Régimen principal" }
  ],
  "test": [
    {
      "pregunta": "…",
      "opciones": ["…", "…", "…", "…"],
      "correcta": 2,
      "explicacion": "…",
      "referencia": "Art. X de la Ley Y"
    }
  ]
}
```

Reglas de contenido:
- **Resumen:** 4–8 bloques por tema, con datos concretos (plazos, porcentajes, tipos, artículos), no paráfrasis genérica.
- **Test:** exactamente 10 preguntas, 4 opciones, una correcta. Las distractoras deben ser plausibles (no "todas son falsas"). Índice `correcta` entre 0 y 3, repartido de forma equilibrada.
- **Leyes:** cada tema lista sus normas con `rol` (principal, complementaria, o sectorial autonómica).

## 5. Catálogo de leyes (a verificar)

Se parte de un catálogo de referencias candidatas. **Ninguna pasa a `verificada: true` sin comprobarla en BOE o DOCM.**

El catálogo vigente es `datos/leyes.json`. Cada norma se añade con su referencia y su estado de verificación; las normas de otras comunidades autónomas no forman parte del proyecto.

Cada norma en `leyes.json` lleva: referencia completa, enlace oficial, estado (`vigente` / `modificada` / `derogada`), fecha de verificación y los temas que la citan.

## 6. Fases

| Fase | Contenido | Criterio de salida |
| **0. Plan y fuentes** | Este documento, temario extraído, índice de 70 temas | ✅ Hecho en este commit |
| **1. Esqueleto y piloto** | `index.html` con navegación, `build.js`, y 2 temas completos (c02 Constitución y e09 Ordenación de la Edificación) como muestra | Revisión tuya del formato y del tono antes de seguir |
| **2. Bloque común** | c01–c30 | `build.js` pasa sin errores; leyes del bloque verificadas |
| **3. Bloques específicos** | e01–e40, en lotes de 8–10 temas por commit (un bloque por lote) | Cada lote validado; leyes marcadas tras comprobar BOE/DOCM |
| **4. Modos de test** | Test por bloque, aleatorio, repaso de fallos, progreso | Pruebas en navegador con Playwright (móvil y escritorio) |
| **5. Revisión final** | Revisión de vigencia de temario y leyes, README | Lista de "pendientes de verificar" vacía o explicada |

## 7. Verificación

- `node datos/build.js` valida: 70 temas presentes, 10 preguntas por tema, 4 opciones, `correcta` en rango, leyes del tema presentes en el catálogo, y ningún campo vacío.
- Prueba en navegador (Playwright, Chromium ya instalado): que carguen todos los temas, que el test califique bien, que no haya scroll horizontal a 375px, y capturas en escritorio y móvil.
- Muestreo manual de cada lote: comprobar al menos 3 preguntas por tema contra la norma citada.

## 8. Git

- Todo en la rama `ccr-55edcf0b-rwlbnt`. Sin PR salvo que lo pidas.
- Un commit por fase o lote, con mensaje descriptivo.

## 9. Decisiones

- Junta: **Andalucía** (única del proyecto).
- Test: el banco de test (`datos/banco.json`, generado con `datos/generar-banco.js`) tiene 10 preguntas revisadas por tema y hasta 100 de artículo, extraídas de los PDF de `leyes/`.
