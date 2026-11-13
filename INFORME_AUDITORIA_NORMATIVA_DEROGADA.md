# Informe de Auditoría de Vigencia Normativa (BOE / BOJA)

**Fecha de auditoría:** 12 de noviembre de 2026  
**Alcance del rastreo:** 174 normas (leyes orgánicas, leyes estatales y autonómicas de Andalucía, reales decretos legislativos, reales decretos, decretos del Consejo de Gobierno de la Junta de Andalucía, órdenes, convenio colectivo y Documentos Básicos del CTE) catalogadas en `datos/leyes.json` para los 6 cuerpos de oposiciones de la Junta de Andalucía (`A2.2001`, `A1.2001`, `A1.1100`, `A2.1100`, `C1.1000` y `C2.1000`).  
**Metodología:** Cruce automatizado contra el servicio de **Legislación Consolidada del BOE (`xml.php` — metadatos `<estatus_derogacion>`, `<fecha_derogacion>`, `<vigencia_agotada>` y `<posteriores>`)** y rastreo directo de disposiciones autonómicas en el **BOJA**.

---

## 1. Resumen Ejecutivo

De las **174 disposiciones** que integran el repositorio tras incorporar las normas sustitutas de 2025 y 2026:

- **160 normas se encuentran plenamente vigentes** (incluyendo las 4 nuevas normas sustitutas incorporadas en esta auditoría: **Ley 2/2026 LEGAM**, **Ley 7/2025 de Patrimonio de Andalucía**, **Real Decreto 847/2026 sobre Amianto** y **Decreto 50/2025 de Calidad Acústica en Andalucía**).
- **9 normas están expresamente derogadas** (`estado_vigencia: "derogada"`), de las cuales **4 han sido derogadas recientemente entre 2025 y octubre de 2026** (entre ellas la **Ley 7/2007 GICA**) y **5 son normas históricas anteriores** que se conservan únicamente porque el texto refundido del CTE (DB-HS 4) o los epígrafes literales del BOJA aún las citan, estando ya acompañadas en la aplicación por la norma vigente que las sustituyó.
- **1 norma se encuentra en *vacatio legis* de derogación (derogación diferida al 7 de abril de 2027)**: la **Ley 14/2007, de 26 de noviembre, del Patrimonio Histórico de Andalucía**, que sigue vigente hoy pero será reemplazada el **07/04/2027** por la ya publicada **Ley 4/2026, de 24 de marzo, de Patrimonio Cultural de Andalucía**.
- **4 decretos autonómicos se encuentran en situación de vigencia parcial o transitoria** (`estado_vigencia: "vigencia_parcial_transitoria"`), al haber sido derogada la ley que desarrollaban o parte de su articulado por normas posteriores de simplificación o de vivienda.

---

## 2. Normas Derogadas Recientemente (2025–2026) y sus Sustitutas Vigentes

### 2.1. Medio Ambiente en Andalucía: Derogación de la GICA (`LGICA-7-2007`) por la LEGAM (`LEGAM-2-2026`)
- **Norma derogada:** *Ley 7/2007, de 9 de julio, de Gestión Integrada de la Calidad Ambiental de Andalucía (GICA)* (`BOE-A-2007-15158`, BOJA núm. 143, de 20/07/2007).
- **Fecha efectiva de derogación:** **20 de junio de 2026**.
- **Norma derogatoria y sustituta vigente (incorporada a la app como `LEGAM-2-2026`):** **Ley 2/2026, de 12 de marzo, para la Gestión Ambiental de Andalucía (LEGAM)** (BOJA núm. 55, de 20 de marzo de 2026; corrección de errores en BOJA núm. 134, de 14 de julio de 2026; `BOE-A-2026-7558`).
- **Alcance y régimen transitorio para el opositor:**
  1. La Disposición Derogatoria Única de la Ley 2/2026 deroga expresamente la Ley 7/2007 (GICA) y el antiguo Reglamento de Calificación Ambiental (Decreto 297/1995).
  2. **Cambios sustantivos clave:**
     - Desaparece la figura de la *Calificación Ambiental (CA)*, que queda sustituida por la **Licencia Ambiental** municipal (plazo máximo de resolución: **3 meses**) y por un catálogo ampliado de actuaciones sujetas a **Declaración Responsable** con efectos inmediatos.
     - Se regula la **Autorización Ambiental Unificada (AAU)** reduciendo su plazo máximo de resolución a **6 meses** y creando la modalidad de **Autorización Ambiental Unificada Simplificada (AAUS)**.
     - Se separa procedimentalmente la evaluación ambiental estratégica de planes/programas respecto de los instrumentos de intervención sobre actividades.
  3. **Vigencia transitoria reglamentaria:** Los reglamentos de desarrollo de la antigua GICA (como el Decreto 356/2010 de AAU o el Decreto 5/2012 de AAI) **mantienen su vigencia transitoria** en todo lo que no se oponga a la Ley 2/2026 hasta que el Consejo de Gobierno apruebe los nuevos desarrollos reglamentarios (plazo máximo de 2 años).

---

### 2.2. Patrimonio de la Comunidad Autónoma: Derogación de la Ley 4/1986 (`LPCA-4-1986`) por la Ley 7/2025 (`LPCA-7-2025`)
- **Norma derogada:** *Ley 4/1986, de 5 de mayo, del Patrimonio de la Comunidad Autónoma de Andalucía* (`BOE-A-1986-12725`, BOJA núm. 40, de 09/05/1986).
- **Fecha efectiva de derogación:** **20 de enero de 2026**.
- **Norma derogatoria y sustituta vigente (incorporada a la app como `LPCA-7-2025`):** **Ley 7/2025, de 22 de diciembre, del Patrimonio de la Comunidad Autónoma de Andalucía** (BOJA núm. 251, de 31 de diciembre de 2025; `BOE-A-2026-944`).
- **Alcance y régimen transitorio para el opositor:**
  1. Deroga íntegramente la histórica Ley 4/1986 tras casi cuarenta años de vigencia.
  2. El *Reglamento para la aplicación de la Ley del Patrimonio de la Comunidad Autónoma de Andalucía* (**Decreto 276/1987, de 11 de noviembre**) conserva vigencia transitoria en cuanto no resulte incompatible con la Ley 7/2025.
  3. Como los programas oficiales publicados en BOJA en 2019–2024 citan nominalmente la Ley 4/1986 en sus epígrafes, la aplicación conserva ambas normas (`LPCA-7-2025` como vigente y `LPCA-4-1986` marcada con alerta de derogación).

---

### 2.3. Seguridad y Salud (Amianto): Derogación del RD 396/2006 (`RD-396-2006`) por el RD 847/2026 (`RD-847-2026`)
- **Norma derogada:** *Real Decreto 396/2006, de 31 de marzo, por el que se establecen las disposiciones mínimas de seguridad y salud aplicables a los trabajos con riesgo de exposición al amianto* (`BOE-A-2006-6474`).
- **Fecha efectiva de derogación:** **24 de octubre de 2026**.
- **Norma derogatoria y sustituta vigente (incorporada a la app como `RD-847-2026`):** **Real Decreto 847/2026, de 21 de octubre** (BOE núm. 255, de 23 de octubre de 2026; `BOE-A-2026-22081`), que transpone la Directiva (UE) 2023/2668.
- **Alcance técnico clave:**
  - Reduce en un **90 %** el Valor Límite Ambiental de Exposición Diaria (**VLA-ED**), pasando de **0,1 fibras/cm³** a **0,01 fibras/cm³** (medido como media ponderada en el tiempo para un período de 8 horas).
  - Refuerza la obligación de identificación previa de materiales con amianto (**MCA**) antes de acometer obras de demolición, rehabilitación o mantenimiento en edificios anteriores a la prohibición del amianto (Orden de 7 de diciembre de 2001).

---

### 2.4. Contaminación Acústica en Andalucía: Derogación del Decreto 6/2012 (`DEC-AND-6-2012`) por el Decreto 50/2025 (`DEC-AND-50-2025`)
- **Norma derogada:** *Decreto 6/2012, de 17 de enero, por el que se aprueba el Reglamento de Protección contra la Contaminación Acústica en Andalucía* (BOJA núm. 24, de 06/02/2012).
- **Fecha efectiva de derogación:** **24 de marzo de 2025**.
- **Norma derogatoria y sustituta vigente (incorporada a la app como `DEC-AND-50-2025`):** **Decreto 50/2025, de 24 de febrero, por el que se aprueba el Reglamento para la preservación de la calidad acústica en Andalucía** (BOJA núm. 42, de 4 de marzo de 2025).

---

## 3. Normas Derogadas con Anterioridad a 2025 que se Conservan como Referencia Cruzada con su Norma Sustituta

Estas 5 disposiciones ya contaban en el repositorio con su correspondiente norma sustituta vigente y ahora quedan además señalizadas visualmente con la etiqueta roja `⚠️ Derogada`:

| ID en la App | Norma Derogada | Fecha de Derogación | ID Sustituta Vigente | Norma Vigente en la App | Motivo por el que se conserva la referencia histórica |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`L-22-2011`** | Ley 22/2011, de 28 de julio, de residuos y suelos contaminados | 10/04/2022 | **`L-7-2022`** | Ley 7/2022, de 8 de abril, de residuos y suelos contaminados para una economía circular | Citada por el RD 105/2008 de RCD y epígrafes de 2019 |
| **`DEC-AND-60-2010`** | Decreto 60/2010, de 16 de marzo, Reglamento de Disciplina Urbanística de Andalucía | 22/12/2022 | **`DEC-AND-550-2022`** | Decreto 550/2022, de 29 de noviembre, Reglamento General de la LISTA | Antecedente directo del Título VII del RG-LISTA |
| **`RD-140-2003`** | Real Decreto 140/2003, de 7 de febrero, calidad del agua de consumo humano | 12/01/2023 | **`RD-3-2023`** | Real Decreto 3/2023, de 10 de enero, criterios técnico-sanitarios del agua de consumo | Citado literalmente en el texto articulado del CTE DB-HS 4 |
| **`RD-865-2003`** | Real Decreto 865/2003, de 4 de julio, prevención y control de la legionelosis | 02/01/2023 | **`RD-487-2022`** | Real Decreto 487/2022, de 21 de junio, prevención y control de la legionelosis | Citado literalmente en el texto articulado del CTE DB-HS 4 |
| **`RD-1004-1991`** | Real Decreto 1004/1991, de 14 de junio, requisitos mínimos de centros docentes | 13/03/2010 | **`RD-132-2010`** | Real Decreto 132/2010, de 12 de febrero, requisitos mínimos de los centros de 2.º ciclo de Infantil, Primaria y Secundaria | Citado por la Orden andaluza de 24/01/2003 de edificios docentes |

---

## 4. Normas en *Vacatio Legis* de Derogación (Derogación Diferida a 2027)

| ID en la App | Norma Actual (Vigente hoy) | Fecha de Derogación Efectiva | ID Nueva Ley | Norma Sustituta (en *vacatio legis*) | Situación Jurídica Actual |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`LPHA-14-2007`** | Ley 14/2007, de 26 de noviembre, del Patrimonio Histórico de Andalucía (`BOE-A-2008-2494`) | **07/04/2027** | **`LPCA-4-2026`** | Ley 4/2026, de 24 de marzo, de Patrimonio Cultural de Andalucía (BOJA núm. 65, de 07/04/2026; `BOE-A-2026-9798`) | La Ley 14/2007 **sigue plenamente vigente hasta el 7 de abril de 2027** (Disposición Final 5.ª de la Ley 4/2026: entrada en vigor al año de su publicación en BOJA). Ambas leyes están indexadas en la aplicación. |

---

## 5. Reglamentos Autonómicos con Vigencia Parcial o Transitoria

1. **`DEC-AND-204-1995`** (*Decreto 204/1995, de 29 de agosto, por el que se establecen medidas organizativas para los servicios administrativos de atención directa a los ciudadanos*):
   - **Estado:** Vigencia parcial residual.
   - **Detalle:** Sus artículos sobre registros administrativos, presentación de escritos y expedición de copias autenticadas fueron derogados por el **Decreto 622/2019, de 27 de diciembre, de administración electrónica, simplificación de procedimientos y racionalización organizativa de la Junta de Andalucía** (`DEC-AND-622-2019`). Se conserva en el catálogo porque los epígrafes oficiales de los cuerpos `C1.1000` (Tema 19) y `C2.1000` (Tema 12) lo siguen mencionando nominalmente.
2. **`DEC-AND-149-2006`** (*Decreto 149/2006, de 25 de julio, Reglamento de Viviendas Protegidas de la Comunidad Autónoma de Andalucía*) y **`DEC-AND-1-2012`** (*Decreto 1/2012, de 10 de enero, Reglamento Regulador de los Registros Públicos Municipales de Demandantes de Vivienda Protegida*):
   - **Estado:** Vigencia reglamentaria transitoria.
   - **Detalle:** La **Ley 5/2025, de 16 de diciembre, de Vivienda de Andalucía** (`LVA-5-2025`, en vigor desde el 24 de enero de 2026) derogó las anteriores Ley 13/2005 y Ley 1/2010 de Vivienda, pero mantuvo en vigor transitoriamente el Decreto 149/2006 (modificando sus arts. 12, 28, 35, 36, 37 y 44 mediante su Disposición Final 3.ª) y el Decreto 1/2012 en todo lo que no se oponga a la nueva Ley.
3. **`DEC-AND-19-1995`** (*Decreto 19/1995, de 7 de febrero, por el que se aprueba el Reglamento de Protección y Fomento del Patrimonio Histórico de Andalucía*):
   - **Estado:** Vigencia reglamentaria parcial.
   - **Detalle:** Dictado en desarrollo de la antigua Ley 1/1991, subsiste únicamente en los preceptos reglamentarios que no se opongan a la Ley 14/2007 (y, a partir del 7 de abril de 2027, a la Ley 4/2026).

---

## 6. Otras Normas Históricas Derogadas que ya NO están en `leyes.json` porque fueron Reemplazadas Directamente por la Norma Vigente

Para tranquilidad del opositor, las siguientes normas antiguas que a veces aparecen citadas en manuales no actualizados **ya habían sido sustituidas en la aplicación por su norma vigente actual**:

- *Ley 6/1985, de 28 de noviembre, de Ordenación de la Función Pública de la Junta de Andalucía* → Sustituida por la **Ley 5/2023, de 7 de junio, de la Función Pública de Andalucía** (`LFP-ANDALUCIA`).
- *Ley 7/2002, de 17 de diciembre, de Ordenación Urbanística de Andalucía (LOUA)* y *Ley 1/1994 (LOTA)* → Sustituidas por la **Ley 7/2021, de 1 de diciembre, de impulso para la sostenibilidad del territorio de Andalucía (LISTA)** (`LISTA-7-2021`).
- *Ley 13/2005 y Ley 1/2010 de Vivienda de Andalucía* → Sustituidas por la **Ley 5/2025, de 16 de diciembre, de Vivienda de Andalucía** (`LVA-5-2025`).
- *Real Decreto 2267/2004 (RSCIEI 2004)* → Sustituido por el **Real Decreto 164/2025, de 4 de marzo, Reglamento de seguridad contra incendios en los establecimientos industriales** (`RD-164-2025`).
- *Instrucción de Hormigón Estructural EHE-08 (RD 1247/2008)* e *Instrucción de Acero Estructural EAE (RD 751/2011)* → Sustituidas por el **Real Decreto 470/2021, de 29 de junio, Código Estructural** (`RD-470-2021`).
- *Real Decreto 235/2013 (Certificación de eficiencia energética)* → Sustituido por el **Real Decreto 390/2021, de 1 de junio** (`CEE-390-2021`).
- *Real Decreto 88/2013 (ITC AEM 1 Ascensores)* → Sustituido por el **Real Decreto 355/2024, de 2 de abril** (`RD-355-2024`).
- *Orden VIV/561/2010 (Accesibilidad en espacios públicos urbanizados)* → Sustituida por la **Orden TMA/851/2021, de 23 de julio** (`TMA-851-2021`).
