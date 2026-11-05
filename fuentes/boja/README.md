# Fuentes BOJA descargadas

Las fichas del texto consolidado del BOJA (ws040.juntadeandalucia.es/sedeboja) cargan
el documento con peticiones JSF. Desde el entorno de trabajo no se consiguió el texto
completo: las respuestas son la misma ficha o un error interno del servidor.

- `ficha-decreto-293-2009-accesibilidad.html`: Decreto 293/2009, de 7 de julio (accesibilidad
  en infraestructuras, urbanismo, edificación y transporte). Identificador 0000021251.
- `ficha-decreto-67-2011-control-calidad.html`: Decreto 67/2011, de 5 de abril (control de
  calidad de la construcción y obra pública). Identificador 0000022306.
- `intentos/`: respuestas de las peticiones de descarga (HTML y PDF) y del script de la
  página. No contienen el articulado.

Para contrastar los decretos hace falta el texto completo: descargarlo desde el botón
«HTML» o «PDF» de cada ficha y guardarlo aquí como `texto-293-2009.html` o `texto-67-2011.pdf`.

Capturas subidas por el usuario (`intentos/captura-resumen-ficha-4.mht` y `-5.mht`): son
la página «Resumen Ficha» del BOJA guardada mientras cargaba («La versión no contiene un
fichero html. Cargando…»). No tienen título, ni artículos. Solo difieren en la hora de captura.

## Decretos verificados (texto consolidado en PDF)

- `decreto-293-2009-consolidado.pdf` (y `.txt`): versión consolidada de 24/10/2017 (BOJA 191, 4/10/2017).
- `decreto-67-2011-consolidado.pdf` (y `.txt`): versión inicial de 20/4/2011 (BOJA 77, 19/4/2011).

Con estos textos se han contrastado las preguntas de hechos que citan ambos decretos
(e17, e21, e36, e37 y los demás). No se ha encontrado ninguna contradicción.

## Orden de 24 de enero de 2003 (normas de diseño de edificios docentes)

- `boja-2003-43-fasciculo-2.pdf`: BOJA núm. 43, de 5 de marzo de 2003, fascículo 2, descargado de
  https://www.juntadeandalucia.es/boja/2003/43/fasciculo-2.pdf (el PDF aportado por el usuario solo contenía
  la referencia del sumario: «Ver esta disposición en fascículo 2»).
- `orden-24-enero-2003-diseno-centros-docentes.txt`: texto extraído desde el inicio de la Orden.

## Control de vigencia (5 de noviembre de 2026)

Se consultó la API de datos abiertos del BOE (metadatos y análisis) para todas las normas del catálogo con
identificador BOE, y se volvieron a descargar sus textos consolidados para comparar con los del repositorio:

- Ley 22/2011 de residuos: derogada por la Ley 7/2022 (preguntas ya adaptadas).
- Ley 14/2007 del Patrimonio Histórico de Andalucía: derogada con efectos desde el 7 de abril de 2027 por la
  Ley 4/2026, de Patrimonio Cultural de Andalucía (añadida al catálogo y al tema e39).
- RD 1627/1997: el art. 18 (aviso previo) está derogado por el RD 337/2010.
- RD 346/2011 (ICT): modificado el 5 de noviembre de 2026; PDF actualizado.
- Resto de textos consolidados: sin cambios respecto a los PDF del repositorio.

Las normas solo publicadas en el BOJA (decretos y órdenes) no se pueden consultar por esta vía.
