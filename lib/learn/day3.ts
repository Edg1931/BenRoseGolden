import type { Lesson, Localized } from "./content";

/**
 * Day 3 learner content — "Shopping for a Home & Home Inspection", authored
 * from the Day 3 class deck: house-hunting with needs vs wants, offers and
 * escrow, and what the home inspection protects you from.
 */

export const DAY3_SECTIONS: Record<string, Localized> = {
  shopping: {
    en: "Shopping for a Home",
    es: "Buscando tu casa",
    ar: "البحث عن منزل",
  },
  inspection: {
    en: "The Home Inspection",
    es: "La inspección de la vivienda",
    ar: "فحص المنزل",
  },
  closing: {
    en: "Appraisal, Title & Closing",
    es: "Avalúo, título y cierre",
    ar: "التقييم والملكية والإتمام",
  },
};

export const DAY3_LESSONS: Lesson[] = [
  {
    id: "shopping-needs-wants",
    section: "shopping",
    title: {
      en: "House Hunting: Needs vs. Wants",
      es: "Buscar casa: necesidades vs. deseos",
      ar: "البحث عن منزل: الاحتياجات مقابل الرغبات",
    },
    body: [
      {
        en: "Before you tour a single home, write two lists. Needs are non-negotiable: enough bedrooms, a safe location, a commute you can live with, a price inside your pre-approval. Wants are nice-to-haves: a big yard, a finished basement, a certain style.",
        es: "Antes de visitar una sola casa, escribe dos listas. Las necesidades no son negociables: suficientes habitaciones, una zona segura, un trayecto razonable, un precio dentro de tu preaprobación. Los deseos son extras: un patio grande, un sótano terminado, cierto estilo.",
        ar: "قبل أن تزور أي منزل، اكتب قائمتين. الاحتياجات غير قابلة للتفاوض: عدد كافٍ من غرف النوم، وموقع آمن، ومسافة تنقّل مقبولة، وسعر ضمن موافقتك المبدئية. أما الرغبات فهي كماليات: فناء كبير، قبو مكتمل، طراز معيّن.",
      },
      {
        en: "Shop with your head, not just your heart. A home that strains your budget every month will steal the joy of owning it. Your budget from Day 1 and your 29/41 numbers from Day 2 are the guardrails.",
        es: "Compra con la cabeza, no solo con el corazón. Una casa que aprieta tu presupuesto cada mes te robará la alegría de tenerla. Tu presupuesto del Día 1 y tus números 29/41 del Día 2 son las barreras de protección.",
        ar: "تسوّق بعقلك لا بقلبك فقط. المنزل الذي يُرهق ميزانيتك كل شهر سيسلبك فرحة امتلاكه. ميزانيتك من اليوم الأول وأرقام 29/41 من اليوم الثاني هي حواجز الأمان.",
      },
      {
        en: "Visit at different times of day, talk to neighbors, and check the basics yourself: water pressure, windows, signs of moisture. Take photos and notes — homes blur together after the third showing.",
        es: "Visita a distintas horas, habla con los vecinos y revisa lo básico tú mismo: presión de agua, ventanas, señales de humedad. Toma fotos y notas: las casas se confunden después de la tercera visita.",
        ar: "زُر المنزل في أوقات مختلفة من اليوم، وتحدث إلى الجيران، وافحص الأساسيات بنفسك: ضغط الماء، والنوافذ، وعلامات الرطوبة. التقط صوراً ودوّن ملاحظات - فالمنازل تختلط ببعضها بعد الجولة الثالثة.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Needs list", es: "Lista de necesidades", ar: "قائمة الاحتياجات" },
        def: {
          en: "The features a home must have for your household — your non-negotiables.",
          es: "Lo que la casa debe tener para tu hogar: lo no negociable.",
          ar: "الميزات التي يجب أن يوفرها المنزل لأسرتك - ما لا يقبل التفاوض.",
        },
      },
      {
        term: { en: "Buyer's agent", es: "Agente del comprador", ar: "وكيل المشتري" },
        def: {
          en: "A real estate agent who represents YOUR interests in the purchase.",
          es: "Un agente inmobiliario que representa TUS intereses en la compra.",
          ar: "وكيل عقاري يمثل مصالحك أنت في عملية الشراء.",
        },
      },
    ],
    whyItMatters: {
      en: "A clear needs list keeps a hot market from talking you into the wrong house.",
      es: "Una lista clara de necesidades evita que un mercado agitado te convenza de la casa equivocada.",
      ar: "قائمة احتياجات واضحة تمنع السوق المحموم من إقناعك بالمنزل الخطأ.",
    },
    check: {
      question: {
        en: "Quick check: which belongs on a NEEDS list?",
        es: "Repaso rápido: ¿qué pertenece a la lista de NECESIDADES?",
        ar: "مراجعة سريعة: أيٌّ من التالي ينتمي إلى قائمة الاحتياجات؟",
      },
      options: [
        {
          en: "A price within your pre-approval",
          es: "Un precio dentro de tu preaprobación",
          ar: "سعر ضمن موافقتك المبدئية",
        },
        {
          en: "A swimming pool",
          es: "Una piscina",
          ar: "حمام سباحة",
        },
        {
          en: "Granite countertops",
          es: "Encimeras de granito",
          ar: "أسطح من الغرانيت",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Right — staying inside your approved budget is a need; finishes and extras are wants.",
        es: "Correcto: mantenerte dentro de tu presupuesto aprobado es una necesidad; los acabados son deseos.",
        ar: "صحيح - البقاء ضمن ميزانيتك المعتمدة احتياج؛ أما التشطيبات والكماليات فهي رغبات.",
      },
    },
  },
  {
    id: "shopping-offer-escrow",
    section: "shopping",
    title: {
      en: "Making an Offer & Escrow",
      es: "Hacer una oferta y el depósito en garantía",
      ar: "تقديم العرض والضمان (الإسكرو)",
    },
    body: [
      {
        en: "When you find the right home, your agent helps you make a written offer: the price, what stays with the house, and contingencies — conditions that protect you, like passing an inspection and getting your financing approved.",
        es: "Cuando encuentras la casa correcta, tu agente te ayuda a hacer una oferta por escrito: el precio, lo que se queda en la casa y las contingencias, condiciones que te protegen, como pasar la inspección y obtener el financiamiento.",
        ar: "عندما تجد المنزل المناسب، يساعدك وكيلك على تقديم عرض مكتوب: السعر، وما يبقى مع المنزل، والشروط الوقائية - وهي بنود تحميك، مثل اجتياز الفحص والحصول على الموافقة على التمويل.",
      },
      {
        en: "With your offer you'll include earnest money — a good-faith deposit (often around 1%) showing the seller you're serious. It's held safely in escrow, a neutral account managed by a third party, and is credited back to you at closing.",
        es: "Con tu oferta incluirás el depósito de buena fe (a menudo cerca del 1%) que muestra al vendedor que vas en serio. Se guarda en un depósito en garantía (escrow), una cuenta neutral de un tercero, y se te acredita en el cierre.",
        ar: "مع عرضك ستقدّم عربوناً - وديعة حسن نية (غالباً نحو 1%) تُظهر للبائع جدّيتك. ويُحفَظ بأمان في حساب ضمان (إسكرو) محايد يديره طرف ثالث، ثم يُحتسب لصالحك عند الإتمام.",
      },
      {
        en: "Once the seller accepts, you're \"in escrow\": the clock starts on your inspection, appraisal, and final loan approval. Don't make big purchases or open new credit during this window — it can sink your loan.",
        es: "Cuando el vendedor acepta, estás \"en escrow\": empieza el plazo de la inspección, la tasación y la aprobación final. No hagas compras grandes ni abras crédito nuevo en esta etapa: puede hundir tu préstamo.",
        ar: "بمجرد قبول البائع تكون «في مرحلة الضمان»: يبدأ العد التنازلي للفحص والتثمين والموافقة النهائية على القرض. لا تقم بمشتريات كبيرة ولا تفتح ائتماناً جديداً في هذه الفترة - فقد يُفشل ذلك قرضك.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Earnest money", es: "Depósito de buena fe", ar: "العربون" },
        def: {
          en: "A deposit sent with your offer to show you're serious; credited back at closing.",
          es: "Un depósito que acompaña tu oferta para mostrar seriedad; se acredita en el cierre.",
          ar: "وديعة تُرفق بعرضك لإظهار الجدية؛ وتُحتسب لصالحك عند الإتمام.",
        },
      },
      {
        term: { en: "Contingency", es: "Contingencia", ar: "الشرط الوقائي" },
        def: {
          en: "A condition in your offer that lets you exit safely — e.g., if the inspection fails.",
          es: "Una condición en tu oferta que te permite salir con seguridad, por ejemplo si falla la inspección.",
          ar: "بند في عرضك يتيح لك الانسحاب بأمان - مثلاً إذا أخفق الفحص.",
        },
      },
    ],
    whyItMatters: {
      en: "Contingencies and escrow exist to protect your money — used well, they let you commit without being trapped.",
      es: "Las contingencias y el escrow existen para proteger tu dinero: bien usados, te permiten comprometerte sin quedar atrapado.",
      ar: "الشروط الوقائية والضمان وُجدا لحماية أموالك - وعند استخدامهما جيداً يتيحان لك الالتزام دون أن تقع في فخ.",
    },
    check: {
      question: {
        en: "Quick check: while you're in escrow, you should…",
        es: "Repaso rápido: mientras estás en escrow, debes…",
        ar: "مراجعة سريعة: أثناء وجودك في مرحلة الضمان، عليك أن…",
      },
      options: [
        {
          en: "Finance a new car for the new driveway",
          es: "Financiar un auto nuevo para la nueva cochera",
          ar: "تموّل سيارة جديدة للمدخل الجديد",
        },
        {
          en: "Avoid big purchases and new credit",
          es: "Evitar compras grandes y crédito nuevo",
          ar: "تتجنب المشتريات الكبيرة والائتمان الجديد",
        },
        {
          en: "Skip the inspection to close faster",
          es: "Saltarte la inspección para cerrar más rápido",
          ar: "تتخطى الفحص لإتمام الصفقة أسرع",
        },
      ],
      correctIndex: 1,
      explain: {
        en: "Yes — lenders re-check your credit before closing; new debt can cancel your approval.",
        es: "Sí: los prestamistas vuelven a revisar tu crédito antes del cierre; una deuda nueva puede cancelar tu aprobación.",
        ar: "نعم - يعيد المُقرضون فحص ائتمانك قبل الإتمام؛ والدين الجديد قد يلغي موافقتك.",
      },
    },
  },
  {
    id: "inspection-what-it-covers",
    section: "inspection",
    activity: "inspection-checklist",
    title: {
      en: "What the Inspection Protects You From",
      es: "De qué te protege la inspección",
      ar: "ممَّ يحميك فحص المنزل",
    },
    body: [
      {
        en: "A professional home inspection is a top-to-bottom checkup of the home's condition: roof, foundation, electrical, plumbing, heating and cooling, windows, attic, and basement. It typically costs a few hundred dollars — and routinely saves buyers thousands.",
        es: "La inspección profesional es un chequeo completo del estado de la casa: techo, cimientos, electricidad, plomería, calefacción y aire, ventanas, ático y sótano. Suele costar unos cientos de dólares y a menudo ahorra miles a los compradores.",
        ar: "فحص المنزل الاحترافي هو كشف شامل لحالة المنزل من أعلاه إلى أسفله: السقف، والأساسات، والكهرباء، والسباكة، والتدفئة والتبريد، والنوافذ، والعلّية، والقبو. يكلف عادةً بضع مئات من الدولارات - ويوفّر على المشترين آلافاً بانتظام.",
      },
      {
        en: "The inspector works for YOU, not the seller. Attend the inspection if you can: you'll learn where the shut-offs are, what needs attention soon, and what's cosmetic versus serious.",
        es: "El inspector trabaja para TI, no para el vendedor. Asiste a la inspección si puedes: aprenderás dónde están las llaves de paso, qué necesita atención pronto y qué es cosmético versus serio.",
        ar: "الفاحص يعمل لصالحك أنت، لا لصالح البائع. احضر الفحص إن استطعت: ستتعلم أين تقع صمامات الإغلاق، وما يحتاج إلى عناية قريباً، وما هو شكلي مقابل ما هو خطير.",
      },
      {
        en: "If the report finds real problems, your inspection contingency gives you options: ask the seller to repair, negotiate the price down, or walk away with your earnest money. That's the protection you paid for.",
        es: "Si el informe encuentra problemas reales, tu contingencia de inspección te da opciones: pedir reparaciones al vendedor, negociar el precio o retirarte con tu depósito. Esa es la protección que pagaste.",
        ar: "إذا كشف التقرير مشاكل حقيقية، يمنحك شرط الفحص خيارات: أن تطلب من البائع الإصلاح، أو تتفاوض على خفض السعر، أو تنسحب مع استرداد عربونك. هذه هي الحماية التي دفعت ثمنها.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Home inspection", es: "Inspección de la vivienda", ar: "فحص المنزل" },
        def: {
          en: "A professional review of a home's condition before you buy — your early-warning system.",
          es: "Una revisión profesional del estado de la casa antes de comprar: tu sistema de alerta temprana.",
          ar: "مراجعة احترافية لحالة المنزل قبل الشراء - نظام الإنذار المبكر الخاص بك.",
        },
      },
      {
        term: { en: "Inspection contingency", es: "Contingencia de inspección", ar: "شرط الفحص" },
        def: {
          en: "The clause that lets you renegotiate or exit if the inspection finds serious issues.",
          es: "La cláusula que te permite renegociar o salir si la inspección encuentra problemas serios.",
          ar: "البند الذي يتيح لك إعادة التفاوض أو الانسحاب إذا كشف الفحص مشاكل خطيرة.",
        },
      },
    ],
    whyItMatters: {
      en: "Skipping the inspection to \"win\" a house is how buyers inherit a $15,000 roof — never waive it lightly.",
      es: "Saltarse la inspección para \"ganar\" una casa es como los compradores heredan un techo de $15,000; nunca la renuncies a la ligera.",
      ar: "تخطّي الفحص «للفوز» بالمنزل هو كيف يرث المشترون سقفاً بـ15,000 دولار - فلا تتنازل عنه باستخفاف أبداً.",
    },
    sorter: {
      title: {
        en: "Order the offer-to-keys journey",
        es: "Ordena el camino de la oferta a las llaves",
        ar: "رتّب الرحلة من العرض إلى المفاتيح",
      },
      steps: [
        { en: "Make a written offer with contingencies", es: "Hacer una oferta escrita con contingencias", ar: "تقديم عرض مكتوب مع شروط وقائية" },
        { en: "Deposit earnest money into escrow", es: "Depositar la buena fe en escrow", ar: "إيداع العربون في حساب الضمان" },
        { en: "Order the home inspection", es: "Ordenar la inspección", ar: "طلب فحص المنزل" },
        { en: "Negotiate repairs or price if needed", es: "Negociar reparaciones o precio si hace falta", ar: "التفاوض على الإصلاحات أو السعر عند الحاجة" },
        { en: "Final loan approval", es: "Aprobación final del préstamo", ar: "الموافقة النهائية على القرض" },
        { en: "Close and get the keys!", es: "¡Cerrar y recibir las llaves!", ar: "الإتمام واستلام المفاتيح!" },
      ],
    },
  },
  {
    id: "inspection-negotiate",
    section: "inspection",
    title: {
      en: "Negotiating After the Inspection",
      es: "Negociar después de la inspección",
      ar: "التفاوض بعد الفحص",
    },
    body: [
      {
        en: "An inspection report almost always finds something — that's normal. The question is whether it's cosmetic (a cracked tile) or serious (a failing roof, old wiring, water in the basement). Focus your energy on the costly, safety, and structural items.",
        es: "Un informe de inspección casi siempre encuentra algo: es normal. La pregunta es si es cosmético (una loseta rota) o serio (un techo en mal estado, cableado viejo, agua en el sótano). Concentra tu energía en lo costoso, lo de seguridad y lo estructural.",
        ar: "تقرير الفحص يجد شيئاً دائماً تقريباً - وهذا طبيعي. والسؤال هل هو شكلي (بلاطة متشقّقة) أم خطير (سقف متهالك، أسلاك قديمة، ماء في القبو). ركّز طاقتك على البنود المكلفة والمتعلّقة بالسلامة والهيكل.",
      },
      {
        en: "You generally have three options: ask the seller to make repairs before closing, ask for a price reduction or a closing-cost credit so you can fix it yourself, or — if it's bad enough — use your inspection contingency to walk away and get your earnest money back.",
        es: "Por lo general tienes tres opciones: pedir al vendedor que repare antes del cierre, pedir una rebaja de precio o un crédito para los costos de cierre y arreglarlo tú, o —si es grave— usar tu contingencia de inspección para retirarte y recuperar tu depósito.",
        ar: "لديك عموماً ثلاثة خيارات: أن تطلب من البائع الإصلاح قبل الإتمام، أو أن تطلب خفض السعر أو رصيداً لتكاليف الإتمام لتُصلحه بنفسك، أو - إن كان سيئاً بما يكفي - أن تستخدم شرط الفحص للانسحاب واسترداد عربونك.",
      },
      {
        en: "Get repair estimates so your ask is grounded in real numbers, and put everything in writing through your agent. A credit is often cleaner than seller repairs, because you control the quality of the work.",
        es: "Consigue presupuestos de reparación para que tu pedido se base en números reales, y pon todo por escrito mediante tu agente. Un crédito suele ser más limpio que las reparaciones del vendedor, porque tú controlas la calidad del trabajo.",
        ar: "احصل على تقديرات إصلاح ليكون طلبك مبنياً على أرقام حقيقية، ودوّن كل شيء كتابياً عبر وكيلك. والرصيد غالباً أنظف من إصلاحات البائع، لأنك تتحكّم في جودة العمل.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Repair credit", es: "Crédito por reparaciones", ar: "رصيد الإصلاح" },
        def: {
          en: "Money the seller credits you at closing instead of doing repairs themselves.",
          es: "Dinero que el vendedor te acredita al cierre en vez de hacer las reparaciones.",
          ar: "مال يمنحك إياه البائع عند الإتمام بدلاً من القيام بالإصلاحات بنفسه.",
        },
      },
      {
        term: { en: "Material defect", es: "Defecto material", ar: "عيب جوهري" },
        def: {
          en: "A significant problem affecting safety, value, or the home's structure.",
          es: "Un problema importante que afecta la seguridad, el valor o la estructura.",
          ar: "مشكلة كبيرة تؤثر في السلامة أو القيمة أو هيكل المنزل.",
        },
      },
    ],
    whyItMatters: {
      en: "The inspection isn't just a pass/fail — it's your last, strongest chance to adjust the deal in your favor.",
      es: "La inspección no es solo aprobar o reprobar: es tu última y más fuerte oportunidad de ajustar el trato a tu favor.",
      ar: "الفحص ليس مجرد نجاح أو رسوب - بل فرصتك الأخيرة والأقوى لتعديل الصفقة لصالحك.",
    },
    check: {
      question: {
        en: "Quick check: a serious inspection finding lets you…",
        es: "Repaso rápido: un hallazgo serio en la inspección te permite…",
        ar: "مراجعة سريعة: اكتشاف خطير في الفحص يتيح لك…",
      },
      options: [
        {
          en: "Renegotiate repairs/price, or walk away with your deposit",
          es: "Renegociar reparaciones/precio o retirarte con tu depósito",
          ar: "إعادة التفاوض على الإصلاحات/السعر، أو الانسحاب مع عربونك",
        },
        {
          en: "Nothing — the price is final",
          es: "Nada: el precio es final",
          ar: "لا شيء - السعر نهائي",
        },
        {
          en: "Automatically lower your interest rate",
          es: "Bajar automáticamente tu tasa de interés",
          ar: "خفض سعر فائدتك تلقائياً",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Right — your inspection contingency gives you real leverage to fix the deal or exit safely.",
        es: "Correcto: tu contingencia de inspección te da poder real para ajustar el trato o salir con seguridad.",
        ar: "صحيح - شرط الفحص يمنحك نفوذاً حقيقياً لتعديل الصفقة أو الخروج بأمان.",
      },
    },
  },
  {
    id: "appraisal-title",
    section: "closing",
    title: {
      en: "The Appraisal & Title",
      es: "El avalúo y el título",
      ar: "التقييم والملكية",
    },
    body: [
      {
        en: "Before your loan is final, the lender orders an appraisal — an independent expert confirms the home is worth at least what you're paying. It protects the lender (and you) from overpaying. If it comes in low, you can renegotiate the price, pay the gap, or sometimes walk away.",
        es: "Antes de finalizar tu préstamo, el prestamista ordena un avalúo: un experto independiente confirma que la casa vale al menos lo que pagas. Protege al prestamista (y a ti) de pagar de más. Si sale bajo, puedes renegociar el precio, pagar la diferencia o, a veces, retirarte.",
        ar: "قبل أن يُنهى قرضك، يطلب المُقرض تقييماً - خبير مستقل يؤكد أن المنزل يساوي على الأقل ما تدفعه. وهو يحمي المُقرض (وأنت) من الدفع الزائد. وإن جاء منخفضاً، يمكنك إعادة التفاوض على السعر أو دفع الفرق أو أحياناً الانسحاب.",
      },
      {
        en: "Meanwhile, a title company searches public records to make sure the seller really owns the home and there are no surprise claims — unpaid taxes, old liens, or other people on the deed. A clean title means you'll truly own it free and clear.",
        es: "Mientras tanto, una compañía de títulos busca en los registros públicos para asegurar que el vendedor de verdad es dueño y que no hay reclamos sorpresa: impuestos sin pagar, gravámenes viejos u otras personas en la escritura. Un título limpio significa que serás dueño sin problemas.",
        ar: "في الأثناء، تبحث شركة الملكية في السجلات العامة للتأكد أن البائع يملك المنزل فعلاً وأنه لا توجد مطالبات مفاجئة - ضرائب غير مدفوعة أو امتيازات قديمة أو أشخاص آخرون في سند الملكية. والملكية النظيفة تعني أنك ستملكه خالصاً.",
      },
      {
        en: "You'll buy title insurance at closing — a one-time cost that protects you if a hidden claim ever surfaces. It's part of your closing costs, and it's worth it: it defends the biggest purchase of your life.",
        es: "Comprarás un seguro de título al cierre: un costo único que te protege si alguna vez aparece un reclamo oculto. Es parte de tus costos de cierre y vale la pena: defiende la compra más grande de tu vida.",
        ar: "ستشتري تأمين ملكية عند الإتمام - تكلفة لمرة واحدة تحميك إن ظهرت مطالبة خفية يوماً ما. وهو جزء من تكاليف إتمامك ويستحق ذلك: فهو يدافع عن أكبر عملية شراء في حياتك.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Appraisal", es: "Avalúo", ar: "التقييم" },
        def: {
          en: "An independent estimate of the home's value, required by your lender.",
          es: "Una estimación independiente del valor de la casa, exigida por tu prestamista.",
          ar: "تقدير مستقل لقيمة المنزل، يطلبه مُقرضك.",
        },
      },
      {
        term: { en: "Title insurance", es: "Seguro de título", ar: "تأمين الملكية" },
        def: {
          en: "A one-time policy protecting your ownership if a hidden claim appears later.",
          es: "Una póliza única que protege tu propiedad si aparece un reclamo oculto después.",
          ar: "وثيقة لمرة واحدة تحمي ملكيتك إن ظهرت مطالبة خفية لاحقاً.",
        },
      },
    ],
    whyItMatters: {
      en: "The appraisal keeps you from overpaying; the title search keeps the home truly yours. Both quietly protect your money.",
      es: "El avalúo evita que pagues de más; la búsqueda de título mantiene la casa realmente tuya. Ambos protegen tu dinero.",
      ar: "التقييم يمنعك من الدفع الزائد؛ والبحث في الملكية يُبقي المنزل لك حقاً. وكلاهما يحمي مالك بهدوء.",
    },
  },
  {
    id: "closing-day",
    section: "closing",
    title: {
      en: "Closing Day & the Final Walkthrough",
      es: "El día del cierre y el recorrido final",
      ar: "يوم الإتمام والجولة الأخيرة",
    },
    body: [
      {
        en: "A day or two before closing, you'll do a final walkthrough. This isn't a formality — confirm the home is in the agreed condition, any negotiated repairs are done, the seller's belongings are out, and everything that's supposed to stay (appliances, fixtures) is still there and working.",
        es: "Uno o dos días antes del cierre harás un recorrido final. No es una formalidad: confirma que la casa esté en la condición acordada, que las reparaciones negociadas estén hechas, que las cosas del vendedor ya no estén y que todo lo que debe quedarse (electrodomésticos, accesorios) siga ahí y funcione.",
        ar: "قبل الإتمام بيوم أو يومين ستقوم بجولة أخيرة. وهي ليست شكليّة - تأكّد أن المنزل بالحالة المتفق عليها، وأن الإصلاحات المتفاوض عليها تمّت، وأن أغراض البائع خرجت، وأن كل ما يُفترض بقاؤه (أجهزة، تجهيزات) ما زال موجوداً ويعمل.",
      },
      {
        en: "At closing you'll review and sign the documents — your Closing Disclosure (compare it to your Loan Estimate!), the mortgage note, and the mortgage. Bring a government photo ID and a cashier's check or wire for your cash-to-close. Read before you sign; ask about anything unclear.",
        es: "En el cierre revisarás y firmarás los documentos: tu Divulgación de Cierre (¡compárala con tu Estimación de Préstamo!), el pagaré y la hipoteca. Lleva una identificación oficial con foto y un cheque de caja o transferencia para tu efectivo de cierre. Lee antes de firmar; pregunta lo que no esté claro.",
        ar: "عند الإتمام ستراجع وتوقّع المستندات - إفصاح الإتمام (قارنه بتقدير قرضك!)، وسند الرهن، والرهن. أحضِر هوية حكومية بصورة وشيكاً مصرفياً أو حوالة لمبلغ نقدك عند الإتمام. اقرأ قبل التوقيع؛ واسأل عن أي شيء غير واضح.",
      },
      {
        en: "Then you get the keys. Congratulations — you're a homeowner. Keep every document in a safe place; you'll want them for taxes, insurance, and the day you sell. And remember Day 4: protecting this home is the next chapter.",
        es: "Luego recibes las llaves. ¡Felicidades, eres propietario! Guarda cada documento en un lugar seguro; los querrás para impuestos, seguro y el día que vendas. Y recuerda el Día 4: proteger esta casa es el siguiente capítulo.",
        ar: "ثم تحصل على المفاتيح. تهانينا - أنت الآن مالك منزل. احتفظ بكل مستند في مكان آمن؛ ستحتاجه للضرائب والتأمين ويوم تبيع. وتذكّر اليوم الرابع: حماية هذا المنزل هي الفصل التالي.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Final walkthrough", es: "Recorrido final", ar: "الجولة الأخيرة" },
        def: {
          en: "Your last check of the home's condition just before closing.",
          es: "Tu última revisión del estado de la casa justo antes del cierre.",
          ar: "آخر تحقّق لك من حالة المنزل قبيل الإتمام.",
        },
      },
      {
        term: { en: "Cash to close", es: "Efectivo de cierre", ar: "النقد عند الإتمام" },
        def: {
          en: "The total money you bring to closing — down payment plus closing costs, minus deposits.",
          es: "El dinero total que llevas al cierre: inicial más costos de cierre, menos depósitos.",
          ar: "إجمالي المال الذي تُحضره عند الإتمام - الدفعة الأولى مع تكاليف الإتمام، ناقص العرابين.",
        },
      },
    ],
    whyItMatters: {
      en: "The walkthrough and a careful read of your documents are your last safeguards before the home — and the loan — are yours.",
      es: "El recorrido y una lectura cuidadosa de tus documentos son tus últimas protecciones antes de que la casa —y el préstamo— sean tuyos.",
      ar: "الجولة وقراءة مستنداتك بعناية هما آخر ضماناتك قبل أن يصبح المنزل - والقرض - لك.",
    },
    check: {
      question: {
        en: "Quick check: at the closing table you should…",
        es: "Repaso rápido: en la mesa de cierre debes…",
        ar: "مراجعة سريعة: على طاولة الإتمام عليك أن…",
      },
      options: [
        {
          en: "Compare the Closing Disclosure to your Loan Estimate and read before signing",
          es: "Comparar la Divulgación de Cierre con tu Estimación y leer antes de firmar",
          ar: "تقارن إفصاح الإتمام بتقدير قرضك وتقرأ قبل التوقيع",
        },
        {
          en: "Sign everything quickly without reading",
          es: "Firmar todo rápido sin leer",
          ar: "توقّع كل شيء بسرعة دون قراءة",
        },
        {
          en: "Skip the final walkthrough",
          es: "Saltarte el recorrido final",
          ar: "تتخطّى الجولة الأخيرة",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Yes — your numbers should match your Loan Estimate, and you have the right to read every page.",
        es: "Sí: tus números deben coincidir con tu Estimación, y tienes derecho a leer cada página.",
        ar: "نعم - يجب أن تطابق أرقامك تقدير قرضك، ولك الحق في قراءة كل صفحة.",
      },
    },
  },
  {
    id: "shopping-professionals",
    section: "shopping",
    title: {
      en: "Real Estate Professionals & Who They Represent",
      es: "Profesionales inmobiliarios y a quién representan",
      ar: "محترفو العقارات ومن يمثّلون",
    },
    body: [
      {
        en: "The titles can be confusing. A real estate agent is licensed by the state and works under a broker (every firm must have one). An agent who belongs to the National Association of Realtors can use the term Realtor®; a member of the National Association of Real Estate Brokers — the oldest minority real estate trade group — may be called a Realtist®.",
        es: "Los títulos confunden. Un agente inmobiliario tiene licencia del estado y trabaja bajo un corredor (toda empresa debe tener uno). Un agente miembro de la Asociación Nacional de Realtors puede usar el término Realtor®; un miembro de la Asociación Nacional de Corredores de Bienes Raíces —el grupo de minorías más antiguo— puede llamarse Realtist®.",
        ar: "قد تكون الألقاب مربكة. الوكيل العقاري مرخّص من الولاية ويعمل تحت وسيط (على كل شركة أن يكون لديها واحد). والوكيل المنتمي إلى الجمعية الوطنية للوكلاء العقاريين يمكنه استخدام لقب Realtor®؛ وعضو الجمعية الوطنية لوسطاء العقارات - أقدم مجموعة عقارية للأقليات - قد يُسمى Realtist®.",
      },
      {
        en: "What matters most is who the agent represents. A seller's (listing) agent works only for the seller. A buyer's agent works only for you. A dual agent represents BOTH sides in the same deal — which means no one is fully on your side. Always know which one you're working with.",
        es: "Lo que más importa es a quién representa el agente. Un agente del vendedor (de listado) trabaja solo para el vendedor. Un agente del comprador trabaja solo para ti. Un agente dual representa a AMBAS partes en el mismo trato, lo que significa que nadie está totalmente de tu lado. Siempre sabe con cuál trabajas.",
        ar: "الأهم هو من يمثّله الوكيل. وكيل البائع (وكيل الإدراج) يعمل للبائع فقط. ووكيل المشتري يعمل لك أنت فقط. أما الوكيل المزدوج فيمثّل الطرفين في الصفقة نفسها - ما يعني أن لا أحد في صفّك تماماً. اعرف دائماً مع من تعمل.",
      },
      {
        en: "For a first-time buyer, a dedicated buyer's agent is usually the right choice: they help you set your wants and needs, share neighborhood information, find homes in your price range, prepare your offer, negotiate for you, and review every piece of paperwork. Interview a few — ask how long they've been licensed and whether they mostly work with buyers.",
        es: "Para un comprador primerizo, un agente del comprador dedicado suele ser lo correcto: te ayuda a fijar tus necesidades, comparte información del vecindario, busca casas en tu rango, prepara tu oferta, negocia por ti y revisa cada documento. Entrevista a varios: pregunta cuánto tiempo llevan con licencia y si trabajan sobre todo con compradores.",
        ar: "للمشتري لأول مرة، عادةً ما يكون وكيل المشتري المتخصص هو الخيار الصحيح: يساعدك على تحديد احتياجاتك، ويشاركك معلومات الحي، ويجد منازل ضمن نطاقك، ويُعدّ عرضك، ويتفاوض عنك، ويراجع كل ورقة. قابِل عدة وكلاء - اسأل منذ متى لديهم ترخيص وهل يعملون غالباً مع المشترين.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Buyer's agent", es: "Agente del comprador", ar: "وكيل المشتري" },
        def: {
          en: "An agent who represents only your interests in the purchase.",
          es: "Un agente que representa solo tus intereses en la compra.",
          ar: "وكيل يمثّل مصالحك أنت فقط في عملية الشراء.",
        },
      },
      {
        term: { en: "Dual agent", es: "Agente dual", ar: "الوكيل المزدوج" },
        def: {
          en: "One agent representing both buyer and seller — neither side is fully represented.",
          es: "Un agente que representa a comprador y vendedor; ninguna parte está plenamente representada.",
          ar: "وكيل واحد يمثّل المشتري والبائع - لا طرف ممثَّل تماماً.",
        },
      },
    ],
    whyItMatters: {
      en: "Knowing who your agent actually works for protects you in the biggest negotiation of your life.",
      es: "Saber para quién trabaja realmente tu agente te protege en la negociación más grande de tu vida.",
      ar: "معرفة لمن يعمل وكيلك فعلاً تحميك في أكبر مفاوضة في حياتك.",
    },
    check: {
      question: {
        en: "Quick check: a buyer's agent represents…",
        es: "Repaso rápido: un agente del comprador representa…",
        ar: "مراجعة سريعة: وكيل المشتري يمثّل…",
      },
      options: [
        { en: "Only you, the buyer", es: "Solo a ti, el comprador", ar: "أنت فقط، المشتري" },
        { en: "Only the seller", es: "Solo al vendedor", ar: "البائع فقط" },
        { en: "The bank", es: "Al banco", ar: "البنك" },
      ],
      correctIndex: 0,
      explain: {
        en: "Right — a buyer's agent is on your side alone; a dual agent is not.",
        es: "Correcto: el agente del comprador está solo de tu lado; el dual no.",
        ar: "صحيح - وكيل المشتري في صفّك وحدك؛ أما المزدوج فلا.",
      },
    },
  },
  {
    id: "shopping-agent-pay",
    section: "shopping",
    title: {
      en: "How Agents Get Paid (New Rules)",
      es: "Cómo se les paga a los agentes (reglas nuevas)",
      ar: "كيف يتقاضى الوكلاء أجورهم (قواعد جديدة)",
    },
    body: [
      {
        en: "Real estate agents are paid by commission — a percentage based on the home's price, paid at closing. A separate brokerage fee doesn't go to the agent. As of recent national rule changes, commissions are openly negotiable, and you'll sign paperwork that spells out exactly how your agent is paid before they start working for you.",
        es: "Los agentes cobran por comisión: un porcentaje según el precio de la casa, pagado en el cierre. Una cuota de corretaje aparte no va al agente. Con los cambios recientes en las reglas nacionales, las comisiones son abiertamente negociables y firmarás documentos que explican exactamente cómo se le paga a tu agente antes de que empiece a trabajar para ti.",
        ar: "يتقاضى الوكلاء العقاريون عمولة - نسبة مئوية حسب سعر المنزل، تُدفع عند الإتمام. ورسم الوساطة المنفصل لا يذهب للوكيل. ومع التغييرات الأخيرة في القواعد الوطنية، أصبحت العمولات قابلة للتفاوض علناً، وستوقّع أوراقاً تبيّن تماماً كيف يتقاضى وكيلك أجره قبل أن يبدأ العمل لك.",
      },
      {
        en: "That document is the Buyer Representation Agreement — a written contract between you and your agent. It must clearly outline how the agent will be paid AND their duties to you, signed before they provide services. The goal of the change is transparency: you know the cost and the commitment up front.",
        es: "Ese documento es el Acuerdo de Representación del Comprador: un contrato escrito entre tú y tu agente. Debe explicar con claridad cómo se le pagará Y sus deberes hacia ti, firmado antes de prestar servicios. El objetivo del cambio es la transparencia: conoces el costo y el compromiso por adelantado.",
        ar: "تلك الوثيقة هي اتفاقية تمثيل المشتري - عقد مكتوب بينك وبين وكيلك. يجب أن يوضّح كيف سيُدفع له وواجباته تجاهك، موقَّعاً قبل تقديم الخدمات. والهدف من التغيير هو الشفافية: تعرف التكلفة والالتزام مقدماً.",
      },
      {
        en: "Read it before you sign. Contracts can differ between brokerages — check the commission rate, how long the agreement lasts, and whether you can cancel. It's your money and your decision; a good agent will walk you through every line.",
        es: "Léelo antes de firmar. Los contratos varían entre corredurías: revisa la tasa de comisión, cuánto dura el acuerdo y si puedes cancelarlo. Es tu dinero y tu decisión; un buen agente te explicará cada línea.",
        ar: "اقرأها قبل التوقيع. تختلف العقود بين الوساطات - تحقّق من نسبة العمولة، ومدة الاتفاقية، وهل يمكنك إلغاؤها. إنه مالك وقرارك؛ والوكيل الجيد سيشرح لك كل سطر.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Commission", es: "Comisión", ar: "العمولة" },
        def: {
          en: "The agent's pay — a percentage of the sale price, paid at closing.",
          es: "El pago del agente: un porcentaje del precio de venta, pagado en el cierre.",
          ar: "أجر الوكيل - نسبة من سعر البيع، تُدفع عند الإتمام.",
        },
      },
      {
        term: { en: "Buyer Representation Agreement", es: "Acuerdo de Representación del Comprador", ar: "اتفاقية تمثيل المشتري" },
        def: {
          en: "A written contract setting your agent's pay and duties — signed before they work for you.",
          es: "Un contrato escrito que fija el pago y los deberes del agente, firmado antes de trabajar para ti.",
          ar: "عقد مكتوب يحدّد أجر وكيلك وواجباته - يُوقَّع قبل أن يعمل لك.",
        },
      },
    ],
    whyItMatters: {
      en: "Commissions are negotiable and now spelled out up front — knowing that can save you real money.",
      es: "Las comisiones son negociables y ahora se detallan por adelantado; saberlo puede ahorrarte dinero real.",
      ar: "العمولات قابلة للتفاوض وتُوضَّح الآن مقدماً - ومعرفة ذلك قد توفّر عليك مالاً حقيقياً.",
    },
    check: {
      question: {
        en: "Quick check: the Buyer Representation Agreement must be signed…",
        es: "Repaso rápido: el Acuerdo de Representación del Comprador debe firmarse…",
        ar: "مراجعة سريعة: يجب توقيع اتفاقية تمثيل المشتري…",
      },
      options: [
        {
          en: "Before the agent provides services",
          es: "Antes de que el agente preste servicios",
          ar: "قبل أن يقدّم الوكيل الخدمات",
        },
        {
          en: "After closing",
          es: "Después del cierre",
          ar: "بعد الإتمام",
        },
        {
          en: "Never — it's optional",
          es: "Nunca: es opcional",
          ar: "أبداً - فهي اختيارية",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Right — it's signed up front and spells out pay and duties, for transparency.",
        es: "Correcto: se firma por adelantado y detalla pago y deberes, por transparencia.",
        ar: "صحيح - تُوقَّع مقدماً وتبيّن الأجر والواجبات، تحقيقاً للشفافية.",
      },
    },
  },
  {
    id: "shopping-neighborhood",
    section: "shopping",
    title: {
      en: "Choosing a Home & a Neighborhood",
      es: "Elegir una casa y un vecindario",
      ar: "اختيار المنزل والحي",
    },
    body: [
      {
        en: "You're not just buying a house — you're buying a neighborhood and a daily life. Visit at different times of day and on weekends; traffic, noise, and parking change. Drive your actual commute to work. Walk around, chat with neighbors, and check local crime statistics with the police department.",
        es: "No solo compras una casa: compras un vecindario y una vida diaria. Visita a distintas horas y los fines de semana; el tráfico, el ruido y el estacionamiento cambian. Maneja tu trayecto real al trabajo. Camina, habla con los vecinos y consulta las estadísticas de criminalidad con la policía.",
        ar: "أنت لا تشتري منزلاً فقط - بل تشتري حياً وحياة يومية. زُر في أوقات مختلفة وفي عطلات الأسبوع؛ فحركة المرور والضوضاء ومواقف السيارات تتغير. اقطع طريق عملك الفعلي. تجوّل، وتحدّث مع الجيران، وراجع إحصاءات الجريمة مع قسم الشرطة.",
      },
      {
        en: "Think ahead, too: will this home fit your household in five years? Check the schools and daycare, even if you don't have kids yet — good schools protect your home's value. Look at the other homes on the street; are neighbors keeping them up?",
        es: "Piensa también a futuro: ¿esta casa servirá a tu hogar en cinco años? Revisa las escuelas y guarderías, aunque aún no tengas hijos; las buenas escuelas protegen el valor de tu casa. Observa las otras casas de la calle: ¿los vecinos las cuidan?",
        ar: "فكّر للمستقبل أيضاً: هل سيناسب هذا المنزل أسرتك بعد خمس سنوات؟ افحص المدارس ودور الحضانة، حتى لو لم يكن لديك أطفال بعد - فالمدارس الجيدة تحمي قيمة منزلك. وانظر إلى منازل الشارع الأخرى؛ هل يعتني بها الجيران؟",
      },
      {
        en: "When you tour the home itself, look past the cosmetics. Check the floors, windows, and switches; test the water pressure; look for water in the basement, cracks in the walls, odd smells, and fresh paint that might be hiding a problem. Note the roof, the trees, the electrical and plumbing, and any signs of pests. Paint is cheap to fix — a roof or foundation is not.",
        es: "Cuando recorras la casa, mira más allá de lo cosmético. Revisa pisos, ventanas e interruptores; prueba la presión del agua; busca agua en el sótano, grietas en las paredes, olores raros y pintura fresca que pueda ocultar un problema. Nota el techo, los árboles, la electricidad y la plomería, y señales de plagas. La pintura es barata de arreglar; un techo o cimientos no.",
        ar: "عندما تتجول في المنزل، انظر إلى ما هو أبعد من الشكليات. افحص الأرضيات والنوافذ والمفاتيح؛ واختبر ضغط الماء؛ وابحث عن ماء في القبو، وشقوق في الجدران، وروائح غريبة، وطلاء جديد قد يخفي مشكلة. لاحظ السقف والأشجار والكهرباء والسباكة وأي علامات آفات. الطلاء رخيص الإصلاح؛ أما السقف أو الأساسات فلا.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Due diligence", es: "Debida diligencia", ar: "العناية الواجبة" },
        def: {
          en: "Doing your homework on a home and area before you commit.",
          es: "Investigar bien una casa y la zona antes de comprometerte.",
          ar: "بحثك الجيد عن المنزل والمنطقة قبل الالتزام.",
        },
      },
      {
        term: { en: "Cosmetic vs. structural", es: "Cosmético vs. estructural", ar: "شكلي مقابل هيكلي" },
        def: {
          en: "Cheap surface fixes (paint) versus costly bones (roof, foundation).",
          es: "Arreglos baratos de superficie (pintura) versus lo costoso de fondo (techo, cimientos).",
          ar: "إصلاحات سطحية رخيصة (طلاء) مقابل بنية مكلفة (سقف، أساسات).",
        },
      },
    ],
    whyItMatters: {
      en: "A great house in the wrong neighborhood — or hiding an expensive flaw — is a mistake an afternoon of looking can prevent.",
      es: "Una gran casa en el vecindario equivocado —o que oculta un defecto caro— es un error que una tarde de observación puede evitar.",
      ar: "منزل رائع في حيّ خاطئ - أو يخفي عيباً مكلفاً - خطأ يمكن لظهيرة من التفقّد أن تمنعه.",
    },
    check: {
      question: {
        en: "Quick check: fresh paint in just one spot might be…",
        es: "Repaso rápido: pintura fresca en un solo lugar podría ser…",
        ar: "مراجعة سريعة: طلاء جديد في بقعة واحدة فقط قد يكون…",
      },
      options: [
        {
          en: "A possible sign of a hidden problem to ask about",
          es: "Una posible señal de un problema oculto que debes preguntar",
          ar: "علامة محتملة على مشكلة مخفية ينبغي السؤال عنها",
        },
        {
          en: "Always meaningless",
          es: "Siempre sin importancia",
          ar: "دائماً بلا معنى",
        },
        {
          en: "A reason to pay more",
          es: "Una razón para pagar más",
          ar: "سبب لدفع المزيد",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Right — patch-painting can hide water stains or cracks; ask, and let the inspector check.",
        es: "Correcto: pintar por partes puede ocultar manchas de agua o grietas; pregunta y deja que el inspector revise.",
        ar: "صحيح - الطلاء الجزئي قد يخفي بقع ماء أو شقوقاً؛ اسأل ودع الفاحص يتحقق.",
      },
    },
  },
];
