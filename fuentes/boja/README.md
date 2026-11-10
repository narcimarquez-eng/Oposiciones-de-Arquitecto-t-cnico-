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

## Decreto 550/2022 (Reglamento General de la LISTA)

- `decreto-550-2022-reglamento-lista.pdf`: BOJA núm. 232, de 2 de diciembre de 2022, descargado de
  https://www.juntadeandalucia.es/boja/2022/232/BOJA22-232-00310-19728-01_00272914.pdf
  (el enlace de iberley aportado por el usuario bloquea las descargas automáticas).
- Es el texto original, no un texto consolidado: si el Reglamento se ha modificado después, esas
  modificaciones no están incorporadas.

## Decreto 149/2006 (Reglamento de Viviendas Protegidas de Andalucía)

- `decreto-149-2006-reglamento-vivienda-protegida.pdf`: BOJA núm. 153, de 8 de agosto de 2006, descargado de
  https://www.juntadeandalucia.es/boja/2006/153/d2.pdf (el enlace de iberley bloquea las descargas).
- Texto original, no consolidado. La Ley 5/2025 de Vivienda modifica sus arts. 12, 28, 35-36, 37 y 44
  (y deroga la Ley 13/2005 que desarrollaba); otras modificaciones posteriores pueden no estar incorporadas.
  Las preguntas solo usan artículos no afectados por la Ley 5/2025.

## Decretos adicionales incorporados (6 de noviembre de 2026)

### Decretos autonómicos de Andalucía (BOJA)
- `decreto-69-2008-autorizaciones-sanitarias.pdf` (`DEC-AND-69-2008`): Decreto 69/2008, de 26 de febrero, procedimientos de las Autorizaciones Sanitarias y Registro Andaluz de Centros, Servicios y Establecimientos Sanitarios (BOJA núm. 52, de 14/03/2008, `d14.pdf`).
- `decreto-91-2020-plan-vive.pdf` (`DEC-AND-91-2020`): Decreto 91/2020, de 30 de junio, Plan Vive en Andalucía 2020-2030 (BOJA núm. 127, de 03/07/2020).
- `decreto-60-2010-reglamento-disciplina-urbanistica.pdf` (`DEC-AND-60-2010`): Decreto 60/2010, de 16 de marzo, Reglamento de Disciplina Urbanística de Andalucía (BOJA núm. 66, de 07/04/2010, `d3.pdf`).
- `decreto-282-2010-reglamento-subvenciones.pdf` (`DEC-AND-282-2010`): Decreto 282/2010, de 4 de mayo, Reglamento de los Procedimientos de Concesión de Subvenciones de la Junta de Andalucía (BOJA núm. 108, de 04/06/2010, `d1.pdf`).
- `decreto-1-2012-registros-demandantes-vivienda.pdf` (`DEC-AND-1-2012`): Decreto 1/2012, de 10 de enero, Reglamento Regulador de los Registros Públicos Municipales de Demandantes de Vivienda Protegida (BOJA núm. 19, de 30/01/2012, `d2.pdf`).
- `decreto-161-2018-defensa-vivienda.pdf` (`DEC-AND-161-2018`): Decreto 161/2018, de 28 de agosto, defensa de la vivienda del parque público residencial de Andalucía (BOJA núm. 172, de 05/09/2018).
- `orden-21-julio-2008-diseno-vivienda-protegida.pdf` (`ORD-AND-21-07-2008`): Orden de 21 de julio de 2008, sobre normativa técnica de diseño y calidad aplicable a las viviendas protegidas en Andalucía (texto integrado publicado por Orden de 12 de febrero de 2020, BOJA núm. 35, de 20/02/2020).
- `decreto-6-2012-contaminacion-acustica.pdf` (`DEC-AND-6-2012`): Decreto 6/2012, de 17 de enero, Reglamento de Protección contra la Contaminación Acústica en Andalucía (BOJA núm. 24, de 06/02/2012, `d4.pdf`).
- `decreto-70-2009-agua-consumo-humano.pdf` (`DEC-AND-70-2009`): Decreto 70/2009, de 31 de marzo, Reglamento de Vigilancia Sanitaria y Calidad del Agua de Consumo Humano de Andalucía (BOJA núm. 73, de 17/04/2009, `d4.pdf`).
- `decreto-19-1995-reglamento-patrimonio-historico.pdf` (`DEC-AND-19-1995`): Decreto 19/1995, de 7 de febrero, Reglamento de Protección y Fomento del Patrimonio Histórico de Andalucía (BOJA núm. 43, de 17/03/1995, `d1.pdf`).
- `decreto-168-2003-reglamento-actividades-arqueologicas.pdf` (`DEC-AND-168-2003`): Decreto 168/2003, de 17 de junio, Reglamento de Actividades Arqueológicas de Andalucía (BOJA núm. 134, de 15/07/2003, `d6.pdf`).
- `decreto-622-2019-administracion-electronica.pdf` (`DEC-AND-622-2019`): Decreto 622/2019, de 27 de diciembre, de administración electrónica, simplificación de procedimientos y racionalización organizativa de la Junta de Andalucía (BOJA núm. 250, de 31/12/2019).

### Reales Decretos y Leyes estatales (BOE en `leyes/`)
- `BOE-A-1957-7998.pdf` (`REF-1957`): Decreto de 26 de abril de 1957 por el que se aprueba el Reglamento de la Ley de Expropiación Forzosa.
- `BOE-A-1960-10906.pdf` (`LPH-49-1960`): Ley 49/1960, de 21 de julio, sobre propiedad horizontal.
- `BOE-A-1986-2277.pdf` (`RD-111-1986`): Desarrollo parcial de la Ley 16/1985 del Patrimonio Histórico Español.
- `BOE-A-1986-33252.pdf` (`RD-2568-1986`): Reglamento de Organización, Funcionamiento y Régimen Jurídico de las Entidades Locales (ROF).
- `BOE-A-1991-16419.pdf` (`RD-1004-1991`): Requisitos mínimos de los centros de enseñanzas de régimen general no universitarias.
- `BOE-A-1997-1853.pdf` (`RD-39-1997`): Reglamento de los Servicios de Prevención.
- `BOE-A-1997-8668.pdf` (`RD-485-1997`): Disposiciones mínimas de señalización de seguridad y salud en el trabajo.
- `BOE-A-1997-12735.pdf` (`RD-773-1997`): Disposiciones mínimas sobre equipos de protección individual (EPI).
- `BOE-A-1997-17824.pdf` (`RD-1215-1997`): Disposiciones mínimas para la utilización de equipos de trabajo.
- `BOE-A-1998-4769.pdf` (`RDL-1-1998`): Real Decreto-ley 1/1998, de 27 de febrero, sobre infraestructuras comunes en los edificios para el acceso a los servicios de telecomunicación (ICT).
- `BOE-A-2003-3596.pdf` (`RD-140-2003`) y `BOE-A-2023-628.pdf` (`RD-3-2023`): Calidad del agua de consumo humano.
- `BOE-A-2003-14408.pdf` (`RD-865-2003`) y `BOE-A-2022-10297.pdf` (`RD-487-2022`): Prevención y control de la legionelosis.
- `BOE-A-2003-21614.pdf` (`LGP-47-2003`): Ley 47/2003, de 26 de noviembre, General Presupuestaria.
- `BOE-A-2004-1848.pdf` (`RD-171-2004`): Coordinación de actividades empresariales (art. 24 LPRL).
- `BOE-A-2004-21830.pdf` (`L-3-2004`): Ley 3/2004, de 29 de diciembre, de lucha contra la morosidad en las operaciones comerciales.
- `BOE-A-2005-20792.pdf` (`RD-1513-2005`) y `BOE-A-2007-18397.pdf` (`RD-1367-2007`): Reglamentos de desarrollo de la Ley 37/2003 del Ruido.
- `BOE-A-2006-6474.pdf` (`RD-396-2006`): Trabajos con riesgo de exposición al amianto.
- `BOE-A-2006-18205.pdf` (`L-32-2006`) y `BOE-A-2007-15766.pdf` (`RD-1109-2007`): Ley 32/2006 reguladora de la subcontratación en el Sector de la Construcción y su Reglamento de desarrollo.
- `BOE-A-2007-19881.pdf` (`RD-1464-2007`): Normas técnicas de valoración catastral de bienes inmuebles de características especiales.
- `BOE-A-2010-6368.pdf` (`RD-410-2010`): Requisitos exigibles a entidades y laboratorios de control de calidad de la edificación.
- `BOE-A-2011-16749.pdf` (`RD-1359-2011`): Fórmulas-tipo generales de revisión de precios de contratos de obras.
- `BOE-A-2011-17629.pdf` (`RD-1492-2011`): Real Decreto 1492/2011, Reglamento de valoraciones de la Ley de Suelo.
- `BOE-A-2015-3443.pdf` (`L-2-2015`) y `BOE-A-2017-1150.pdf` (`RD-55-2017`): Ley 2/2015 de desindexación de la economía española y su Reglamento de desarrollo.
- `BOE-A-2025-7190.pdf` (`RD-164-2025`): Reglamento de seguridad contra incendios en establecimientos industriales y modificación del RIPCI.

