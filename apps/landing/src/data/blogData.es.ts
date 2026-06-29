import type { Article } from './blogData'

// ─────────────────────────────────────────────────────────────────
// Spanish (es) translations of blog content — Approach A: parallel map.
// Only translated slugs appear here; ArticleDetail falls back to the
// English ARTICLES map for anything not yet translated.
// Structure mirrors blogData.ts exactly (same slugs, same block order,
// same internal-link targets and CTA pages — only the text is translated).
// ─────────────────────────────────────────────────────────────────

export const ARTICLES_ES: Record<string, Article> = {

  // ════════════════════════════════════════════════════════════════
  // ¿Pueden los estadounidenses comprar en la RD?
  // ════════════════════════════════════════════════════════════════
  'can-americans-buy': {
    catKey: 'Buying', catLabel: 'Guía del Comprador', read: '14 min', reads: '—', date: '29 de junio de 2026',
    author: 'iLoveDRRealty Team', role: 'Expertos en bienes raíces de la República Dominicana', initials: 'DR',
    title: '¿Pueden los estadounidenses comprar propiedades en la República Dominicana? (Guía 2026)',
    lede: 'Sí — y es más sencillo de lo que la mayoría de los compradores estadounidenses esperan. Aquí tienes exactamente cómo funciona la propiedad para extranjeros, el proceso paso a paso, los costos reales y los errores que sorprenden a los recién llegados.',
    metaTitle: '¿Pueden los estadounidenses comprar propiedades en la República Dominicana? (2026)',
    metaDescription: 'Sí, los estadounidenses pueden comprar propiedades en la República Dominicana con los mismos derechos que los locales — sin necesidad de residencia. Guía 2026: proceso, costos, impuestos y errores clave.',
    keywords: ['pueden los estadounidenses comprar propiedad en república dominicana', 'extranjeros comprando propiedad república dominicana', 'comprar bienes raíces república dominicana', 'propiedad república dominicana para extranjeros'],
    facts: [['Mismos derechos', 'Los extranjeros son dueños plenos (Ley 16-95)'], ['No requerida', 'Residencia para comprar'], ['3%', 'Impuesto único de transferencia'], ['Pasaporte', 'Identificación principal']],
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', 'La respuesta corta es sí. Los ciudadanos estadounidenses pueden comprar propiedades en la República Dominicana con exactamente los mismos derechos que los dominicanos. No hay permiso especial, no se exige un socio local y no es necesario ser residente. Puedes entrar como turista, firmar un contrato de compra y poner el título a tu nombre.'],
      ['p', 'Dicho esto, "puedes hacerlo" y "hacerlo a ciegas" son cosas muy distintas. La RD no utiliza el sistema de seguro de título ni de empresas de custodia (escrow) al que están acostumbrados los estadounidenses — aquí, tu abogado es tu protección. Esta guía explica cómo funciona realmente la propiedad para extranjeros, el proceso completo de compra, cuánto cuesta todo incluido y los errores concretos que cometen los compradores estadounidenses.'],

      ['h', '¿De verdad tienen los estadounidenses los mismos derechos de propiedad?'],
      ['p', 'Sí. Bajo la ley de inversión extranjera de la RD (Ley 16-95), los compradores internacionales reciben el mismo trato que los inversores nacionales. En la práctica, eso significa que puedes ser dueño de terrenos, condominios, villas y propiedades comerciales en pleno dominio — sin restricción por el tipo o la ubicación, incluida la primera línea de playa.'],
      ['p', 'Tampoco hay control de divisas que te impida sacar tu dinero. Los ingresos por alquiler y el producto de una eventual venta se pueden repatriar. Esta es una de las razones por las que la RD se ha convertido en un imán para los compradores norteamericanos, frente a países que restringen la propiedad extranjera cerca de la costa o exigen estructuras fiduciarias complejas.'],
      ['tip', 'No necesitas una empresa dominicana para comprar una vivienda de uso personal. A veces se usan empresas por motivos fiscales o de planificación patrimonial en carteras de inversión — pero para una sola villa o condominio, la propiedad individual a tu nombre suele ser más simple y económica. Consulta con un abogado antes de optar por una estructura corporativa.'],

      ['h', '¿Necesitas residencia o visa para comprar?'],
      ['p', 'No. Este es el malentendido más común. La residencia y la propiedad son vías completamente separadas. Puedes comprar como turista no residente, y muchos propietarios nunca llegan a ser residentes — simplemente visitan con entradas de turista y alquilan la propiedad el resto del año.'],
      ['p', 'La residencia sí importa por otra razón: vivir a largo plazo y los impuestos. Si planeas mudarte realmente a la RD, las vías de inversor y jubilado — incluidos los conocidos incentivos de la Ley 171-07 — pueden ofrecer décadas de exenciones fiscales. Pero eso es una decisión de estilo de vida que se suma a la propiedad, no un requisito previo. Si la residencia está en tus planes, [[nuestro equipo bilingüe puede orientarte sobre la mejor vía|contact]] según tu situación.'],

      ['h', 'El proceso de compra paso a paso'],
      ['p', 'A grandes rasgos, una compra dominicana avanza por seis etapas. Calcula entre 30 y 60 días desde una oferta aceptada hasta un título registrado, siendo la debida diligencia la fase individual más larga.'],
      ['ol', [
        'Define tu objetivo y haz una lista corta. Decide si se trata de una vivienda de estilo de vida, una inversión de alquiler pura, o ambas — eso cambia qué región y tipo de propiedad encajan. Empieza a filtrar con nuestra [[búsqueda de propiedades|search]].',
        'Haz una oferta. Una vez acordado el precio, tu abogado prepara (o revisa) una carta de intención o acuerdo de reserva, normalmente con un pequeño depósito reembolsable para retirar la propiedad del mercado.',
        'Debida diligencia. Tu abogado realiza una búsqueda de título en el Registro Inmobiliario (Conservaduría de Hipotecas) para confirmar la propiedad limpia, sin gravámenes ni hipotecas, los límites correctos y que los impuestos estén al día. Esta es la etapa que te protege — nunca la omitas ni la apresures.',
        'Promesa de Venta. Un contrato bilingüe y vinculante que establece precio, calendario de pagos, fecha de cierre y penalidades. En este punto normalmente colocas entre el 10% y el 30% en custodia (escrow).',
        'Reúne el saldo. Paga en efectivo (lo más común para extranjeros) o cierra con financiamiento. Existen hipotecas de bancos locales para no residentes, pero son limitadas y con tasas más altas.',
        'Cierre y transferencia. El Contrato de Venta final se firma ante un Notario, se paga el impuesto de transferencia y se inscribe el título en el Registro para que la propiedad quede a tu nombre.',
      ]],

      ['h', '¿Qué documentos necesitan los estadounidenses?'],
      ['p', 'La carga de papeleo para el comprador es ligera comparada con una compra en EE. UU. Como mínimo, prepárate para aportar:'],
      ['ul', [
        'Un pasaporte vigente (tu identificación principal durante toda la transacción).',
        'Una segunda forma de identificación en muchos casos — el Registro Inmobiliario solicita documentos de identidad, no prueba de residencia.',
        'Un número de identificación tributaria local (RNC), que tu abogado puede gestionar para que la compra y cualquier ingreso por alquiler queden debidamente registrados.',
        'Documentación del origen de los fondos de tu banco si transfieres una suma grande, para cumplir con los controles contra el lavado de dinero en ambos extremos.',
      ]],
      ['p', 'Observa lo que no está en la lista: residencia, historial crediticio dominicano o un patrocinador local. La fricción es mucho menor de lo que esperan los compradores.'],

      ['h', '¿Cuánto cuesta comprar?'],
      ['p', 'Además del precio de compra, prevé alrededor de un 4% a 5% en costos de cierre únicos. Las dos partidas grandes son el impuesto de transferencia del 3% y los honorarios de tu abogado. Este es el desglose típico:'],
      ['table', {
        headers: ['Costo', 'Monto típico', 'Notas'],
        rows: [
          ['Impuesto de transferencia', '3% del valor', 'Se paga al cierre; sobre el mayor entre precio o valor tasado por la DGII'],
          ['Honorarios del abogado', '~1% – 1.5%', 'Cubre debida diligencia, contratos y cierre; el dinero más importante que gastas'],
          ['Notaría y registro', '~0.25% – 1%', 'Notarización del contrato más inscripción en el Registro Inmobiliario'],
          ['Impuesto anual (IPI)', '1% / año', 'Solo sobre el valor superior al umbral de exención; muchas viviendas quedan por debajo'],
        ],
      }],
      ['p', 'Desglosamos cada uno de estos — con un ejemplo completo sobre un precio de compra real — en nuestra guía de [[costos de cierre en la RD|article|closing-costs-dr]]. Y si una propiedad forma parte de un proyecto turístico aprobado por CONFOTUR, el impuesto de transferencia y varios años de impuesto sobre la propiedad pueden eximirse por completo, lo que cambia mucho las cuentas.'],
      ['cta', { label: 'Calcula tus costos totales en la calculadora de ROI', page: 'calculator' }],

      ['h', '¿Pueden los estadounidenses obtener una hipoteca en la RD?'],
      ['p', 'La mayoría de los compradores extranjeros paga en efectivo, y el mercado está construido en torno a eso. Los bancos locales sí prestan a no residentes, pero con relaciones préstamo-valor más bajas (a menudo 50%–70%), tasas más altas que en EE. UU. y un proceso de aprobación más lento y exigente en documentos. Algunos compradores liberan capital en casa — por ejemplo, mediante una línea de crédito sobre una propiedad en EE. UU. — y llegan como compradores en efectivo, lo que también fortalece su poder de negociación.'],
      ['tip', 'Si el financiamiento es esencial para tu plan, obtén una precalificación antes de enamorarte de una propiedad concreta. Conocer tu presupuesto real — incluyendo las tasas más altas y los plazos más cortos habituales aquí — evita decepciones y mantiene tu oferta creíble.'],

      ['h', '¿Es seguro? Los riesgos reales (y cómo evitarlos)'],
      ['p', 'La RD es un lugar seguro para tener propiedad — los riesgos que realmente perjudican a los compradores extranjeros casi nunca tienen que ver con la delincuencia. Tienen que ver con el título y el proceso. Como no hay empresas de seguro de título que hagan la verificación por ti, la responsabilidad recae en tu abogado. Las formas más comunes en que la gente sale perjudicada:'],
      ['ul', [
        'Prescindir de un abogado independiente y confiar en el abogado del vendedor o del desarrollador — un claro conflicto de interés.',
        'Pagar un depósito antes de completar una búsqueda de título limpia. El dinero debe quedar en custodia (escrow), liberándose contra hitos verificados.',
        'Comprar terreno o sobre plano sin confirmar el título, los permisos y el historial de entrega del desarrollador.',
        'Confiar en un límite verbal en lugar de un deslinde registrado, y luego descubrir que el lote es más pequeño de lo anunciado.',
      ]],
      ['p', 'Cada uno de estos es evitable con una debida diligencia adecuada. Por eso también verificamos las propiedades de nuestra plataforma y trabajamos con una red de abogados bilingües de confianza — para que el proceso te proteja en lugar de ponerte a prueba. Cuando estés listo, [[explora propiedades verificadas|search]] o [[habla con nuestro equipo|contact]] para empezar con seguridad.'],

      ['h', 'Errores que cometen con más frecuencia los compradores estadounidenses'],
      ['ol', [
        'Asumir que aplica el proceso de cierre de EE. UU. No hay empresa de escrow ni aseguradora de título por defecto — tu abogado cumple ese rol, así que elegir bien es la decisión más importante.',
        'Subestimar los costos de cierre. Incluye ese 4%–5% desde el principio en lugar de llevarte una sorpresa al firmar.',
        'Confundir residencia con propiedad y sobrecargar una estructura corporativa que no necesitan.',
        'Comprar puramente por la emoción de las vacaciones. La villa que parece mágica en febrero igual tiene que tener sentido como activo durante todo el año.',
      ]],

      ['h', 'En resumen'],
      ['p', 'Los estadounidenses pueden, sin duda, comprar propiedades en la República Dominicana — con plenos derechos de propiedad, sin requisito de residencia y con un proceso que, bien hecho, es más limpio de lo que muchos esperan. La diferencia entre una gran compra y una lección costosa se reduce a dos cosas: un abogado independiente y una debida diligencia real antes de mover cualquier dinero.'],
      ['cta', { label: 'Explora propiedades verificadas', page: 'search' }],
    ],
    faqs: [
      { q: '¿Puede un ciudadano estadounidense ser dueño pleno de una propiedad en la RD?', a: 'Sí. Bajo la Ley 16-95, los extranjeros — incluidos los ciudadanos estadounidenses — tienen los mismos derechos de propiedad que los dominicanos y pueden poner el título de terrenos, condominios y villas a su nombre sin necesidad de un socio local.' },
      { q: '¿Necesito ser residente para comprar una propiedad en la RD?', a: 'No. La residencia y la propiedad son cosas separadas. Puedes comprar como turista no residente y nunca convertirte en residente. La residencia solo importa si planeas vivir en el país a largo plazo o acceder a programas de incentivos fiscales.' },
      { q: '¿Cuánto cuestan los costos de cierre para un comprador extranjero?', a: 'Prevé alrededor del 4%–5% del precio de compra en costos únicos, dominados por el impuesto de transferencia del 3% y los honorarios del abogado de aproximadamente 1%–1.5%. Los proyectos aprobados por CONFOTUR pueden eximir gran parte de esto.' },
      { q: '¿Pueden los estadounidenses obtener una hipoteca en la República Dominicana?', a: 'Sí, pero la mayoría de los compradores extranjeros paga en efectivo. Los bancos locales prestan a no residentes con relaciones préstamo-valor más bajas y tasas más altas que en EE. UU., con un proceso de aprobación más lento y exigente en documentos.' },
      { q: '¿Es seguro comprar propiedad en la RD?', a: 'Sí, cuando se hace correctamente. Los principales riesgos tienen que ver con el título y el proceso, no con la delincuencia. Usa un abogado independiente, mantén los depósitos en custodia y completa una búsqueda de título completa antes de pagar — y la transacción es muy segura.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // Costos de cierre en la RD
  // ════════════════════════════════════════════════════════════════
  'closing-costs-dr': {
    catKey: 'Buying', catLabel: 'Costos e Impuestos', read: '11 min', reads: '—', date: '29 de junio de 2026',
    author: 'iLoveDRRealty Team', role: 'Expertos en bienes raíces de la República Dominicana', initials: 'DR',
    title: 'Costos de cierre en la República Dominicana, explicados a fondo (2026)',
    lede: 'Antes de firmar, deberías conocer tu número real, todo incluido. Aquí tienes cada costo de cierre que paga un comprador extranjero — impuesto de transferencia, abogado, notaría e impuestos anuales — con un ejemplo completo.',
    metaTitle: 'Costos de cierre en República Dominicana (2026) — Desglose completo',
    metaDescription: 'Un desglose completo de los costos de cierre al comprar propiedad en la República Dominicana: el impuesto de transferencia del 3%, honorarios del abogado, notaría, impuesto IPI y un ejemplo práctico.',
    keywords: ['costos de cierre república dominicana', 'impuesto de transferencia república dominicana', 'costo de comprar propiedad república dominicana', 'impuesto ipi república dominicana'],
    facts: [['~4–5%', 'Costos de cierre totales típicos'], ['3%', 'Impuesto de transferencia'], ['1–1.5%', 'Honorarios del abogado'], ['1% / año', 'IPI sobre el excedente']],
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', 'La mayoría de los compradores se fija únicamente en el precio de lista y se lleva una sorpresa en la mesa de cierre. En la República Dominicana, tu costo real todo incluido es el precio de compra más alrededor de un 4% a 5% en costos de cierre únicos — a veces mucho menos si la propiedad califica para una exención de CONFOTUR. Esta guía desglosa cada partida para que no haya sorpresas.'],

      ['h', 'El impuesto de transferencia del 3% (Impuesto de Transferencia)'],
      ['p', 'Este es el mayor costo de cierre individual. El gobierno cobra un impuesto de transferencia del 3% para inscribir la venta y emitir un nuevo título a tu nombre. Un matiz importante: el 3% se calcula sobre el mayor entre el precio de compra acordado o el valor tasado oficial de la propiedad según la autoridad tributaria (DGII). En la mayoría de las transacciones a precio de mercado el valor tasado está en o por debajo del precio, pero conviene confirmarlo durante la debida diligencia para que el número no te sorprenda.'],
      ['p', 'El impuesto de transferencia normalmente lo paga el comprador, y vence al momento de presentar la transferencia de título — no se reparte en cuotas. Presupuéstalo como efectivo que necesitas disponible al cierre.'],

      ['h', 'Honorarios del abogado — el dinero más importante que gastas'],
      ['p', 'Como la RD no utiliza empresas de seguro de título, tu abogado cumple el papel que en EE. UU. se reparten una empresa de escrow, una aseguradora de título y un agente de cierre. Espera honorarios de aproximadamente 1% a 1.5% del precio de compra, a veces con un mínimo en propiedades de menor valor. Por ese honorario, tu abogado debería:'],
      ['ul', [
        'Realizar una búsqueda de título completa en el Registro Inmobiliario para confirmar la propiedad limpia y sin gravámenes.',
        'Verificar los límites, que los impuestos estén al día y que no haya cargas.',
        'Redactar o revisar la Promesa de Venta y el Contrato de Venta final.',
        'Mantener los depósitos en custodia (escrow) y gestionar el cierre y la inscripción del título.',
      ]],
      ['tip', 'Este no es el lugar para buscar gangas. Un abogado un poco más barato que pasa por alto un gravamen o un problema de límites puede costarte muchas veces lo que ahorraste. Elige por su rigor y claridad bilingüe, no por la cotización más baja.'],

      ['h', 'Costos de notaría y registro'],
      ['p', 'El Contrato de Venta debe ser notarizado, y los notarios dominicanos son abogados que cobran por autenticar el documento — comúnmente una fracción de un por ciento del precio. Además, la inscripción de la transferencia en el Registro Inmobiliario conlleva tasas de registro y sellos. En conjunto, esto suele situarse entre el 0.25% y el 1%, según el valor de la propiedad y los profesionales involucrados.'],

      ['h', 'Costos anuales que debes prever'],
      ['p', 'Los costos de cierre son únicos, pero dos costos recurrentes importan para tu presupuesto:'],
      ['ul', [
        'Impuesto IPI: un impuesto anual del 1%, pero solo sobre la parte del valor de una propiedad que supera el umbral de exención (que se ajusta periódicamente). Muchas viviendas de precio moderado quedan por completo bajo el umbral y no deben nada; las propiedades de mayor valor pagan el 1% sobre el excedente. Confirma siempre el umbral vigente del año en que compras.',
        'Cuotas de HOA / condominio: si compras en una comunidad cerrada o un edificio de condominios, las cuotas mensuales de mantenimiento financian seguridad, jardinería, piscinas y amenidades. Varían mucho — confirma la cifra exacta antes de comprometerte, sobre todo para un análisis de inversión de alquiler.',
      ]],

      ['h', 'La exención de CONFOTUR — cómo pagar mucho menos'],
      ['p', 'Si tu propiedad forma parte de un proyecto aprobado bajo la ley de incentivo turístico CONFOTUR, los beneficios son significativos: el impuesto de transferencia del 3% puede eximirse, y el impuesto anual IPI puede quedar exento durante varios años. Para un comprador, eso puede eliminar la mayor parte de los costos de cierre y reducir los costos de mantenimiento durante años.'],
      ['p', 'La clave es que la exención se vincula al proyecto, no a ti personalmente — así que verificar el estatus CONFOTUR de un desarrollo es parte de la debida diligencia. Verificamos la elegibilidad de CONFOTUR en las propiedades que califican precisamente porque puede cambiar tanto el número final.'],

      ['h', 'Un ejemplo práctico'],
      ['p', 'Así se ven los números en un condominio de US$250,000 comprado para uso personal, pagado en efectivo, en una transacción estándar (sin CONFOTUR):'],
      ['table', {
        headers: ['Partida', 'Tasa', 'Monto (USD)'],
        rows: [
          ['Precio de compra', '—', '$250,000'],
          ['Impuesto de transferencia', '3%', '$7,500'],
          ['Honorarios del abogado', '~1.25%', '$3,125'],
          ['Notaría y registro', '~0.5%', '$1,250'],
          ['Total de costos de cierre únicos', '~4.75%', '≈ $11,875'],
          ['Efectivo total necesario', '—', '≈ $261,875'],
        ],
      }],
      ['p', 'Ahora corre la misma propiedad como parte de un desarrollo aprobado por CONFOTUR: el impuesto de transferencia de $7,500 puede desaparecer, y el IPI anual puede estar exento durante años — convirtiendo un costo de cierre de ~4.75% en algo mucho menor. Ese único factor es por qué dos condominios de apariencia similar pueden tener costos reales muy distintos.'],
      ['cta', { label: 'Modela tus números exactos en la calculadora de ROI', page: 'calculator' }],

      ['h', '¿Quién paga qué?'],
      ['p', 'Como regla general en la RD: el comprador paga el impuesto de transferencia, su propio abogado y los costos de notaría/registro. El vendedor normalmente cubre cualquier impuesto sobre ganancias de capital adeudado por su utilidad y la comisión del agente inmobiliario. Esto es lo habitual, no algo absoluto — todo puede negociarse y plasmarse en la Promesa de Venta, que es exactamente por lo que ese contrato importa.'],

      ['h', 'En resumen'],
      ['p', 'Para una compra estándar, presupuesta de 4% a 5% sobre el precio y estarás cubierto. Las dos palancas que más cambian el panorama son el estatus CONFOTUR (que puede recortar costos) y tu elección de abogado (que protege toda la inversión). Confirma ambos a tiempo y no habrá sorpresas en la mesa.'],
      ['cta', { label: 'Ve cómo encaja en el proceso completo de compra', page: 'article', slug: 'can-americans-buy' }],
    ],
    faqs: [
      { q: '¿Cuáles son los costos de cierre totales al comprar propiedad en la República Dominicana?', a: 'Generalmente alrededor del 4%–5% del precio de compra en una transacción estándar, compuestos principalmente por el impuesto de transferencia del 3% y honorarios del abogado de cerca del 1%–1.5%, más costos de notaría y registro. Los proyectos aprobados por CONFOTUR pueden eximir gran parte.' },
      { q: '¿Quién paga el impuesto de transferencia en la RD?', a: 'El comprador suele pagar el impuesto de transferencia del 3%, calculado sobre el mayor entre el precio de compra o el valor tasado oficial, y vence cuando se presenta la transferencia de título.' },
      { q: '¿Qué es el impuesto IPI?', a: 'El IPI es un impuesto anual del 1% que se cobra solo sobre el valor tasado superior a un umbral de exención que se ajusta periódicamente. Muchas viviendas de menor precio quedan bajo el umbral y no deben nada; las propiedades de mayor valor pagan el 1% sobre el excedente.' },
      { q: '¿Se pueden reducir los costos de cierre?', a: 'Sí. Las propiedades en desarrollos aprobados por CONFOTUR pueden tener exento el impuesto de transferencia del 3% y el IPI anual durante varios años, reduciendo drásticamente tanto los costos de cierre como los de mantenimiento.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // ROI de Airbnb en Punta Cana
  // ════════════════════════════════════════════════════════════════
  'punta-cana-airbnb-roi': {
    catKey: 'Investing', catLabel: 'Inteligencia de Inversión', read: '13 min', reads: '—', date: '29 de junio de 2026',
    author: 'iLoveDRRealty Team', role: 'Expertos en bienes raíces de la República Dominicana', initials: 'DR',
    title: 'Inversión en Airbnb en Punta Cana: cifras reales de ROI para 2026',
    lede: 'Olvida el bombo. Esto es lo que realmente genera un alquiler a corto plazo en Punta Cana en 2026 — ocupación, tarifas por noche y rendimientos netos — además de los costos que hacen o deshacen un negocio.',
    metaTitle: 'Inversión Airbnb en Punta Cana 2026 — Cifras reales de ROI y rendimientos',
    metaDescription: 'Datos honestos de 2026 sobre la inversión en Airbnb en Punta Cana: tasas de ocupación, tarifas por noche, rendimientos netos de alquiler, la prima de primera línea de playa y cómo modelar un ROI realista.',
    keywords: ['inversión airbnb punta cana', 'roi bienes raíces república dominicana', 'rendimiento de alquiler punta cana', 'mejor inversión airbnb república dominicana'],
    facts: [['~7%', 'Rendimiento neto promedio'], ['$120–158', 'Tarifa diaria típica (USD)'], ['40–60%', 'Prima de primera línea de playa'], ['CONFOTUR', 'Puede eximir impuestos']],
    img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', 'Punta Cana es el mercado de alquiler a corto plazo más buscado del Caribe, y el atractivo es seductor: sol todo el año, millones de turistas y tarifas por noche en dólares. Pero una buena inversión se construye con números, no con sensaciones. Esto es lo que muestran realmente los datos del mercado de 2026 — y cómo convertirlos en un análisis realista antes de comprar.'],

      ['h', '¿Cuánto genera realmente un alquiler en Punta Cana?'],
      ['p', 'Los datos recientes del mercado pintan un panorama claro, aunque aleccionador. En el conjunto del mercado de Punta Cana en 2025–2026, un alquiler a corto plazo típico tiene una ocupación promedio entre el 30% bajo y alto, tarifas diarias promedio de alrededor de US$150–158 e ingresos anuales promedio agrupados en cifras de cinco dígitos bajos. El desempeño mediano supera lo que sugiere el promedio, porque una larga cola de listados mal gestionados o mal ubicados arrastra la media hacia abajo.'],
      ['p', 'La cifra que más les importa a los inversores: una propiedad representativa modelada en torno a una adquisición de US$290,000 ha mostrado un rendimiento neto antes de impuestos en el entorno del 7%. Es un número genuinamente fuerte frente a los principales mercados costeros de EE. UU., donde los rendimientos de alquiler a corto plazo se han comprimido a un dígito bajo — pero es un promedio, y los promedios ocultan la brecha entre los mejores operadores y el resto.'],
      ['tip', 'Los listados de mejor desempeño alcanzan un 60%–70% de ocupación, mientras que el promedio del mercado se sitúa muy por debajo. La diferencia rara vez es suerte — es ubicación, gestión profesional, precios dinámicos y calidad de reseñas. Modela con la ocupación promedio y luego trata una buena gestión como la palanca que te acerca a la parte alta del rango.'],

      ['h', 'La prima de primera línea de playa es el mayor factor'],
      ['p', 'Si hay un factor que separa de forma consistente a los de alto desempeño del resto, es la cercanía al agua. Las propiedades a distancia caminable de la playa imponen tarifas por noche aproximadamente 40%–60% más altas que unidades comparables tierra adentro, y convierten mejor porque "caminando a la playa" es lo que los huéspedes realmente buscan. Esa prima se compone: una tarifa más alta más una ocupación más alta sobre la misma base de costos es lo que convierte un rendimiento promedio en uno fuerte.'],

      ['h', 'Dónde comprar para un buen desempeño de alquiler'],
      ['p', 'No todo Punta Cana rinde igual. Los submercados de alquiler a corto plazo más fuertes suelen ser:'],
      ['ul', [
        'Cap Cana — el enclave de lujo: las tarifas por noche más altas, seguridad cerrada, marina y golf, y la mayor prima para producto de primera línea y de marca de resort.',
        'Bávaro — el denso núcleo turístico: la demanda de huéspedes más constante y las propiedades más fáciles de mantener ocupadas todo el año.',
        'Uvero Alto — corredor de crecimiento más nuevo y tranquilo, liderado por resorts, con tarifas fuertes para inventario de primera línea bien posicionado.',
      ]],
      ['p', 'Comparar regiones más allá de Punta Cana también importa — Las Terrenas y Cabarete ofrecen precios de entrada más bajos con sus propios perfiles de demanda. Empieza a mapear opciones en nuestra [[búsqueda de propiedades|search]] y filtra por las zonas que encajan con tu estrategia.'],

      ['h', 'La ventaja fiscal de CONFOTUR para inversores'],
      ['p', 'Punta Cana tiene una gran oferta de desarrollos aprobados por CONFOTUR, y para un inversor el impacto es directo: un impuesto de transferencia del 3% exento al comprar y varios años de exención del impuesto anual IPI. Costos de adquisición y mantenimiento más bajos alimentan directamente el rendimiento neto. Cuando comparas dos unidades similares, el estatus CONFOTUR puede ser la diferencia entre un retorno promedio y uno fuerte — consulta nuestro desglose completo de [[costos de cierre y CONFOTUR|article|closing-costs-dr]].'],

      ['h', 'Los costos que no aparecen en el folleto'],
      ['p', 'Los ingresos brutos por alquiler no son lo que te quedas. Un análisis realista de Punta Cana tiene que restar:'],
      ['ul', [
        'Gestión profesional: típicamente 20%–30% de los ingresos por alquiler para una gestión completa de alquiler a corto plazo (comunicación con huéspedes, coordinación de limpieza, precios, mantenimiento). Autogestionar desde el extranjero rara vez es realista.',
        'Cuotas de HOA / comunidad: las comunidades cerradas de resort cobran cuotas mensuales por seguridad y amenidades — confirma el número exacto, ya que varía mucho e impacta directamente el rendimiento neto.',
        'Amueblado y puesta a punto: un paquete de amueblado listo para alquilar es un costo inicial real que afecta tanto tu tarifa por noche como tu retorno del primer año.',
        'Servicios, internet, mantenimiento de piscina y jardín, y una reserva para vacancia/mantenimiento.',
        'Comisiones de plataforma y oscilaciones de precios por temporada — la temporada alta de invierno subsidia una temporada baja mucho más lenta.',
      ]],

      ['h', 'Un modelo de ROI realista'],
      ['p', 'Así es como un inversor disciplinado plantearía un negocio representativo. Trata cada cifra como un dato a verificar, no como una promesa:'],
      ['table', {
        headers: ['Variable', 'Conservador', 'Fuerte (primer nivel)'],
        rows: [
          ['Ocupación', '~35%', '60–70%'],
          ['Tarifa diaria promedio', '$130', '$180+'],
          ['Comisión de gestión', '25% de ingresos', '20% de ingresos'],
          ['Rendimiento neto indicativo', '~5–6%', '~9–10%'],
          ['Más revalorización', 'Según el mercado', 'Según el mercado'],
        ],
      }],
      ['p', 'La distancia entre esas columnas es todo el juego. El mismo edificio, al mismo precio, puede dar un retorno mediocre o excelente según la ubicación dentro del resort, la calidad de la gestión y si compraste exento de CONFOTUR. Ese es exactamente el tipo de escenario que nuestra calculadora de ROI está diseñada para modelar.'],
      ['cta', { label: 'Calcula tus propios números en la calculadora de ROI', page: 'calculator' }],

      ['h', 'Errores que cometen los inversores en Punta Cana'],
      ['ol', [
        'Modelar con la parte alta del rango. Modela primero una ocupación conservadora; deja que una buena gestión sea el potencial al alza, no tu caso base.',
        'Ignorar el costo de gestión. Una comisión del 25% es la diferencia entre un año bueno y uno excelente — inclúyela desde el día uno.',
        'Comprar tierra adentro para ahorrar y luego perder la prima de primera línea que impulsa tanto la tarifa como la ocupación.',
        'Pasar por alto el estatus CONFOTUR y pagar de más en impuestos que una unidad exenta vecina evita.',
        'Olvidar la estacionalidad. Los picos de invierno son reales, pero también los meses lentos de temporada — anualiza, no extrapoles desde la semana pico.',
      ]],

      ['h', '¿Es un Airbnb en Punta Cana una buena inversión en 2026?'],
      ['p', 'Para la propiedad correcta, gestionada de la forma correcta, sí. Rendimientos netos en torno al 7% con ingresos en dólares, fundamentos turísticos sólidos y beneficios fiscales de CONFOTUR hacen de Punta Cana uno de los mercados de alquiler a corto plazo más atractivos de la región. El riesgo es comprar por emoción y modelar con el folleto. Compra cerca de la playa, verifica CONFOTUR, presupuesta con honestidad la gestión y modela con ocupación conservadora — entonces una buena operación se convierte en potencial al alza en lugar de un plan de rescate.'],
      ['cta', { label: 'Explora propiedades de inversión', page: 'search' }],
    ],
    faqs: [
      { q: '¿Qué ROI puedo esperar de un Airbnb en Punta Cana?', a: 'Los datos del mercado apuntan a un rendimiento neto promedio antes de impuestos de alrededor del 7%, con propiedades conservadoras más cerca del 5%–6% y unidades de primera línea bien gestionadas alcanzando 9%–10%, antes de cualquier revalorización. La ubicación, la calidad de la gestión y el estatus CONFOTUR marcan la diferencia.' },
      { q: '¿Cuál es la ocupación y la tarifa por noche promedio en Punta Cana?', a: 'La ocupación promedio en el conjunto del mercado se sitúa entre el 30% bajo y alto, con tarifas diarias promedio de alrededor de $150, mientras que los de mejor desempeño alcanzan 60%–70% de ocupación y tarifas más altas. La cercanía a la playa impone una prima de tarifa del 40%–60%.' },
      { q: '¿Cuánto cuesta la gestión de propiedades?', a: 'La gestión completa de alquiler a corto plazo suele costar 20%–30% de los ingresos por alquiler, cubriendo comunicación con huéspedes, coordinación de limpieza, precios dinámicos y mantenimiento. Es esencial para propietarios que viven en el extranjero y debe estar en todo análisis.' },
      { q: '¿Ayuda CONFOTUR a los inversores de alquiler a corto plazo?', a: 'Sí. Los desarrollos aprobados por CONFOTUR pueden eximir el impuesto de transferencia del 3% y eximir el impuesto anual IPI durante varios años, reduciendo tanto los costos de adquisición como los de mantenimiento y mejorando directamente el rendimiento neto.' },
    ],
  },
}

// ─────────────────────────────────────────────────────────────────
// Spanish card text for the blog index (featured + editor picks + grid),
// keyed by slug. Only the translated posts appear; Blog.tsx falls back
// to the English card text for everything else.
// ─────────────────────────────────────────────────────────────────
export const CARDS_ES: Record<string, { title: string; desc: string; tag?: string; read?: string; role?: string }> = {
  'can-americans-buy': {
    title: '¿Pueden los estadounidenses comprar propiedades en la RD?',
    desc: 'Tus derechos legales como extranjero, si necesitas residencia, el proceso completo, los costos reales y los errores que cometen los compradores estadounidenses.',
    tag: 'GUÍA DEL COMPRADOR · 2026',
    read: '14 min de lectura',
    role: 'Expertos en bienes raíces de la RD',
  },
  'closing-costs-dr': {
    title: 'Costos de cierre en la RD, explicados a fondo',
    desc: 'El impuesto de transferencia del 3%, honorarios de abogado y notaría, el IPI anual y el ahorro de CONFOTUR — con un ejemplo completo.',
  },
  'punta-cana-airbnb-roi': {
    title: 'Inversión Airbnb en Punta Cana: cifras reales de ROI',
    desc: 'Ocupación, tarifas por noche y rendimientos netos reales, la prima de primera línea de playa y cómo modelar un negocio en lugar de adivinar.',
  },
}
