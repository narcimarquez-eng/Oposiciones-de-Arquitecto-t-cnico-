# Oposiciones-de-Arquitecto-t-cnico-

App de estudio para el Cuerpo de Técnicos de Grado Medio, opción Arquitectura Técnica (A2.2001), de la Junta de Andalucía: resumen, leyes aplicables y test por tema.

## Uso

Abre `index.html` en el navegador. No necesita servidor ni conexión.

## Contenido

- `datos/temario-andalucia.json`: índice de los 70 temas (30 comunes `c01`–`c30`, 40 específicos `e01`–`e40`).
- `datos/temas/<id>.json`: resumen, leyes y 10 preguntas de cada tema.
- `datos/leyes.json`: catálogo de normas citadas, con su estado de verificación.
- `datos/build.js`: valida el contenido y genera `datos/contenido.js`, que carga la app.
- `fuentes/`: texto de los programas oficiales.
- `PLAN.md`: plan de trabajo y fases.

## Añadir o cambiar contenido

1. Edita o crea `datos/temas/<id>.json` (ver el formato en `c01.json` o `e20.json`).
2. Si cita una norma nueva, añádela a `datos/leyes.json` con `verificada: false` hasta comprobarla en BOE o BOJA.
3. Ejecuta `node datos/build.js`. Si hay errores, no sale `contenido.js`; los avisos indican normas sin verificar.
4. Haz commit de los archivos de `datos/` junto con `datos/contenido.js`.

## Otra Junta

El temario de la Junta de Comunidades de Castilla-La Mancha (65 temas) queda archivado en `datos/temario-clm.json`, con su fuente en `fuentes/temario-cuerpo-tecnico-arquitectura-tecnica-clm.txt`.
