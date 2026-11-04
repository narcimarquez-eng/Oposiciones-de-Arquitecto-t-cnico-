# Oposiciones-de-Arquitecto-t-cnico-

App de estudio para el Cuerpo de Técnicos de Grado Medio, opción Arquitectura Técnica (A2.2001), de la Junta de Andalucía: resumen, leyes aplicables y test por tema.

## Uso

Abre `index.html` en el navegador. No necesita servidor ni conexión.

El botón «Generador de tests» de la cabecera abre el generador. Cada tema tiene sus 10 preguntas revisadas y hasta 100 preguntas generadas: «¿Qué regula el art. N de la norma X?» con el contenido del artículo como opciones, extraído de los PDF de `leyes/`. Las preguntas de hechos (quién nombra, qué órgano decide, cuánto dura…) están escritas a mano en `datos/hechos/<tema>.json`. El banco (`datos/banco.js`) lo genera `datos/generar-banco.js`, que necesita `pdftotext` (poppler). El banco se carga solo al abrir el generador.

Modos del generador: **práctica** (corrección al responder) y **examen** (corrección al final: cada acierto suma 1, cada fallo resta 1/3, las preguntas en blanco no restan). Las estadísticas de aciertos, fallos y blancos se guardan en este navegador (`localStorage`) por tema, por bloque y en general.

## Contenido

- `datos/temario-andalucia.json`: índice de los 70 temas (30 comunes `c01`–`c30`, 40 específicos `e01`–`e40`).
- `datos/temas/<id>.json`: resumen breve, leyes y 10 preguntas de cada tema.
- `datos/desarrollo/<id>.json`: desarrollo extenso (objetivo: unas 10 páginas, ≈ 3.500 palabras) con fuentes y enlaces a BOE/PDF.
- `leyes/`: PDF oficiales consolidados del BOE de las normas citadas, descargados y comprobados. La app los enlaza en local.
- `datos/leyes.json`: catálogo de normas citadas, con su estado de verificación.
- `datos/build.js`: valida el contenido y genera `datos/contenido.js`, que carga la app.
- `fuentes/`: texto de los programas oficiales.
- `PLAN.md`: plan de trabajo y fases.

## Añadir o cambiar contenido

1. Edita o crea `datos/temas/<id>.json` (ver el formato en `c01.json` o `e20.json`).
2. Si cita una norma nueva, añádela a `datos/leyes.json` con `verificada: false` hasta comprobarla en BOE o BOJA.
3. Para normas nuevas, descarga el PDF consolidado del BOE en `leyes/` (nombre `BOE-A-AAAA-NNNNN.pdf`) y comprueba que el PDF se abre antes de referenciarlo.
4. Ejecuta `node datos/build.js`. Si hay errores, no sale `contenido.js`; los avisos indican normas sin verificar.
5. Haz commit de los archivos de `datos/` junto con `datos/contenido.js`.

