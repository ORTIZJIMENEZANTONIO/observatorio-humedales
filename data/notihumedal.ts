import type { ArticuloNotihumedal } from '~/types'

export const articulos: ArticuloNotihumedal[] = [
  {
    id: 1,
    slug: 'segundo-humedal-aragon-2020',
    titulo: 'Inauguran segundo humedal artificial en el Bosque de Aragón',
    fecha: '2020-11-15',
    resumen: 'La Facultad de Química de la UNAM, a través del grupo GAIA, inauguró el segundo humedal artificial de flujo subsuperficial en el Bosque de San Juan de Aragón con capacidad de 140 m³/día.',
    contenido: `<p>El Grupo Académico Interdisciplinario Ambiental (GAIA) de la Facultad de Química, UNAM, inauguró un segundo sistema de humedales artificiales en el Bosque de San Juan de Aragón, Gustavo A. Madero (DGCS-UNAM, Boletín 150/2020).</p>
<p>El nuevo sistema cuenta con una superficie de 3,108 m² y una capacidad de tratamiento de 140,000 litros diarios (140 m³/d). Incluye un humedal artificial de flujo subsuperficial (HAFSS), un humedal de flujo superficial (HAFS), filtro de agregados calizos, tanque sedimentador y muro gavión filtrante (Facultad de Química, UNAM, 2020).</p>
<p>Con este segundo humedal, el Bosque de Aragón se consolida como el sitio con mayor infraestructura de humedales artificiales para tratamiento de agua en la Ciudad de México, con dos sistemas que en conjunto tratan hasta 390 m³/día (Fundación UNAM, 2020).</p>
<p><strong>Fuentes:</strong></p>
<ul>
  <li>DGCS-UNAM (2020). <a href="https://www.dgcs.unam.mx/boletin/bdboletin/2020_150.html" target="_blank" rel="noopener noreferrer">Desarrollan universitarios humedal artificial en el Bosque de Aragón</a>. Boletín UNAM-DGCS-150.</li>
  <li>Fundación UNAM (2020). <a href="https://www.fundacionunam.org.mx/donde-paso/unam-inaugura-humedal-artificial-en-el-bosque-de-san-juan-de-aragon/" target="_blank" rel="noopener noreferrer">UNAM inaugura humedal artificial en el Bosque de San Juan de Aragón</a>.</li>
  <li>Facultad de Química, UNAM (2020). <a href="https://quimica.unam.mx/inauguran-humedal-artificial-bosque-de-aragon/" target="_blank" rel="noopener noreferrer">Inauguran nuevo Humedal Artificial en el Bosque de Aragón</a>.</li>
</ul>`,
    imagen: '/images/humedales/aragon.jpg',
    fuenteImagen: 'Gaceta UNAM / Facultad de Química, UNAM',
    autor: 'Observatorio de Humedales Artificiales CDMX',
    tags: ['Aragón', 'GAIA', 'UNAM', 'flujo subsuperficial'],
  },
  {
    id: 2,
    slug: 'humedales-cdmx-politica-publica',
    titulo: 'Humedales de la CDMX: generadores de agua y refugio de biodiversidad',
    fecha: '2023-02-02',
    resumen: 'La Ciudad de México alberga humedales que registran 397 especies de aves y capturan hasta 10 veces más carbono que las selvas tropicales, según la CONABIO.',
    contenido: `<p>Con motivo del Día Mundial de los Humedales, diversas instituciones presentaron un balance del estado de los humedales en la Ciudad de México. Según datos de la CONABIO a través del Sistema de Monitoreo de Humedales (<a href="https://www.biodiversidad.gob.mx/monitoreo/simoh-mx" target="_blank" rel="noopener noreferrer">SIMOH-Mx</a>), los humedales capturan hasta 10 veces más carbono que las selvas tropicales.</p>
<p>Entre los humedales artificiales documentados se encuentran el Sistema de Tratamiento a base de Humedales Artificiales (STHA) del Bosque de Aragón, desarrollado por la UNAM desde 2012 (Luna-Pabello & Aburto-Castañeda, 2014), y el Parque Ecológico Cuitláhuac en Iztapalapa, que funciona como sistema de tratamiento de aguas a escala urbana (Gobierno de la CDMX, 2021).</p>
<p>A nivel de registro de biodiversidad, se han documentado 397 especies de aves en los humedales de la CDMX, un incremento respecto a las 355 registradas previamente. En el Bosque de Aragón, la Playa de Aves alberga 50 especies de aves acuáticas, el doble de las registradas en 2009 (Gobierno de la CDMX, 2021).</p>
<p><strong>Fuentes:</strong></p>
<ul>
  <li>CONABIO. <a href="https://www.biodiversidad.gob.mx/monitoreo/simoh-mx" target="_blank" rel="noopener noreferrer">Sistema de Monitoreo de Humedales en México (SIMOH-Mx)</a>.</li>
  <li>Luna-Pabello, V.M. y Aburto-Castañeda, S. (2014). <a href="https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1405-888X2014000100003" target="_blank" rel="noopener noreferrer">Sistema de humedales artificiales para el control de la eutroficación del lago del Bosque de San Juan de Aragón</a>. <em>TIP Rev.</em>, 17(1).</li>
  <li>Gobierno de la CDMX (2021). <a href="https://gobierno.cdmx.gob.mx/noticias/playa-de-aves-en-bosque-de-aragon/" target="_blank" rel="noopener noreferrer">Playa de aves en Bosque de Aragón</a>.</li>
</ul>`,
    imagen: '/images/humedales/playa-aves.jpg',
    fuenteImagen: 'Gobierno de la CDMX',
    autor: 'Observatorio de Humedales Artificiales CDMX',
    tags: ['CONABIO', 'política pública', 'biodiversidad'],
  },
  {
    id: 3,
    slug: 'luna-pabello-stha-aragon-2014',
    titulo: 'Artículo científico: STHA del Bosque de Aragón — 30 años de investigación',
    fecha: '2014-06-01',
    resumen: 'Luna-Pabello y Aburto-Castañeda publican en TIP Revista el diseño y resultados del Sistema de Tratamiento a base de Humedales Artificiales (STHA) del lago del Bosque de Aragón.',
    contenido: `<p>En la revista <em>TIP Revista Especializada en Ciencias Químico-Biológicas</em>, volumen 17, número 1, los investigadores de la Facultad de Química de la UNAM documentan el diseño, construcción y evaluación del STHA (Luna-Pabello & Aburto-Castañeda, 2014).</p>
<p>El sistema, inaugurado en noviembre de 2012, combina un humedal de flujo subsuperficial (HAFSS, 2,351 m²) con un humedal de flujo superficial (HAFS, 5,734 m²) para controlar la eutroficación del lago. Los autores reportan una remoción del 80% de contaminantes generales y más del 90% de coliformes fecales, cumpliendo los límites de la NOM-001-SEMARNAT-2021 y la NOM-003-SEMARNAT-1997.</p>
<p><strong>Referencia:</strong> Luna-Pabello, V.M. y Aburto-Castañeda, S. (2014). Sistema de humedales artificiales para el control de la eutroficación del lago del Bosque de San Juan de Aragón. <em>TIP Rev. Esp. Ciencias Químico-Biológicas</em>, 17(1). <a href="https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1405-888X2014000100003" target="_blank" rel="noopener noreferrer">Artículo completo en SciELO</a>.</p>`,
    imagen: '/images/humedales/aragon.jpg',
    fuenteImagen: 'Gaceta UNAM / GAIA — Facultad de Química, UNAM',
    autor: 'Luna-Pabello, V.M. / GAIA-UNAM',
    tags: ['investigación', 'UNAM', 'Aragón', 'HAFSS', 'HAFS'],
  },
]
