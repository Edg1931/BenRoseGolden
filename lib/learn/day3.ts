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
];
