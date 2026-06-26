import type { Lesson, Localized } from "./content";

/**
 * Day 2 learner content — "Obtaining a Mortgage & Know Your Rights", authored
 * from the Day 2 class deck: secured loans, PMI, fixed vs ARM, affordability
 * ratios (the Murphy case study), the homebuying steps & team, and borrower
 * rights/documents.
 */

export const DAY2_SECTIONS: Record<string, Localized> = {
  mortgages: {
    en: "Understanding Mortgages",
    es: "Cómo entender las hipotecas",
    ar: "فهم الرهن العقاري",
  },
  process: {
    en: "The Homebuying Process",
    es: "El proceso de compra de vivienda",
    ar: "عملية شراء المنزل",
  },
  rights: {
    en: "Know Your Rights",
    es: "Conoce tus derechos",
    ar: "اعرف حقوقك",
  },
};

export const DAY2_LESSONS: Lesson[] = [
  {
    id: "mortgage-what-is",
    section: "mortgages",
    title: {
      en: "What Is a Mortgage?",
      es: "¿Qué es una hipoteca?",
      ar: "ما هو الرهن العقاري؟",
    },
    body: [
      {
        en: "A mortgage is a type of loan used to finance a property. It is a \"secured\" loan: the borrower promises collateral to the lender in case they stop making payments — and the collateral is the home itself.",
        es: "Una hipoteca es un tipo de préstamo que se usa para financiar una propiedad. Es un préstamo \"garantizado\": el comprador promete una garantía al prestamista por si deja de pagar, y esa garantía es la propia casa.",
        ar: "الرهن العقاري نوع من القروض يُستخدم لتمويل عقار. وهو قرض «مضمون»: يَعِد المقترض المُقرض بضمانة في حال توقفه عن السداد - والضمانة هي المنزل نفسه.",
      },
      {
        en: "Because the home is collateral, if you stop making payments the lender can take possession of your home through a process called foreclosure. That's why an affordable, sustainable payment matters more than the biggest loan you can get.",
        es: "Como la casa es la garantía, si dejas de pagar el prestamista puede quedarse con tu casa mediante un proceso llamado ejecución hipotecaria. Por eso importa más un pago sostenible que el préstamo más grande posible.",
        ar: "ولأن المنزل هو الضمانة، إذا توقفت عن السداد يمكن للمُقرض أن يستولي على منزلك عبر إجراء يُسمى حبس الرهن. لهذا فإن الدفعة الميسورة المستدامة أهم من أكبر قرض يمكنك الحصول عليه.",
      },
      {
        en: "Your monthly payment usually includes four parts, called PITI: Principal (paying down the loan), Interest (the cost of borrowing), Taxes (property taxes), and Insurance (homeowner's insurance).",
        es: "Tu pago mensual suele incluir cuatro partes, llamadas PITI: Principal (abonar al préstamo), Interés (el costo de pedir prestado), Impuestos (sobre la propiedad) y Seguro (de la vivienda).",
        ar: "تشمل دفعتك الشهرية عادةً أربعة أجزاء تُعرف بـ PITI: أصل القرض (سداد القرض)، والفائدة (تكلفة الاقتراض)، والضرائب (ضرائب العقار)، والتأمين (تأمين المنزل).",
      },
    ],
    keyTerms: [
      {
        term: { en: "Collateral", es: "Garantía", ar: "الضمانة" },
        def: {
          en: "Something of value the lender can take if the loan isn't repaid — for a mortgage, the home.",
          es: "Algo de valor que el prestamista puede tomar si no se paga el préstamo; en una hipoteca, la casa.",
          ar: "شيء ذو قيمة يمكن للمُقرض أخذه إذا لم يُسدَّد القرض - وفي الرهن العقاري هو المنزل.",
        },
      },
      {
        term: { en: "Foreclosure", es: "Ejecución hipotecaria", ar: "حبس الرهن" },
        def: {
          en: "The legal process where a lender takes a home after payments stop.",
          es: "El proceso legal por el que un prestamista toma una casa cuando se dejan de hacer los pagos.",
          ar: "الإجراء القانوني الذي يستولي به المُقرض على المنزل بعد توقف المدفوعات.",
        },
      },
    ],
    whyItMatters: {
      en: "Understanding that your home backs the loan is the foundation for every safe borrowing decision you'll make.",
      es: "Entender que tu casa respalda el préstamo es la base de cada decisión segura de endeudamiento.",
      ar: "إدراك أن منزلك هو ضمان القرض هو الأساس لكل قرار اقتراض آمن ستتخذه.",
    },
    check: {
      question: {
        en: "Quick check: a mortgage is a \"secured\" loan because…",
        es: "Repaso rápido: una hipoteca es un préstamo \"garantizado\" porque…",
        ar: "مراجعة سريعة: الرهن العقاري قرض «مضمون» لأن…",
      },
      options: [
        {
          en: "The interest rate never changes",
          es: "La tasa de interés nunca cambia",
          ar: "سعر الفائدة لا يتغير أبداً",
        },
        {
          en: "The home itself is the collateral",
          es: "La propia casa es la garantía",
          ar: "المنزل نفسه هو الضمانة",
        },
        {
          en: "The government guarantees it",
          es: "El gobierno lo garantiza",
          ar: "الحكومة تضمنه",
        },
      ],
      correctIndex: 1,
      explain: {
        en: "Right — the home is the collateral. If payments stop, the lender can foreclose.",
        es: "Correcto: la casa es la garantía. Si los pagos se detienen, el prestamista puede ejecutar la hipoteca.",
        ar: "صحيح - المنزل هو الضمانة. إذا توقفت المدفوعات يمكن للمُقرض حبس الرهن.",
      },
    },
  },
  {
    id: "mortgage-types-pmi",
    section: "mortgages",
    title: {
      en: "Fixed, ARM, and PMI",
      es: "Tasa fija, ARM y PMI",
      ar: "الفائدة الثابتة والمتغيرة وتأمين PMI",
    },
    body: [
      {
        en: "With a fixed-rate mortgage, your interest rate stays the same for the life of the loan — your payment is predictable for 15 or 30 years. With an adjustable-rate mortgage (ARM), the rate can change over time, so payments may rise.",
        es: "Con una hipoteca de tasa fija, el interés es el mismo durante toda la vida del préstamo: tu pago es predecible por 15 o 30 años. Con una hipoteca de tasa ajustable (ARM), la tasa puede cambiar con el tiempo y los pagos pueden subir.",
        ar: "في الرهن ذي الفائدة الثابتة، يبقى سعر الفائدة كما هو طوال مدة القرض - دفعتك متوقعة لمدة 15 أو 30 عاماً. أما الرهن ذو الفائدة المتغيرة (ARM) فيمكن أن يتغير سعره مع الوقت، وقد ترتفع الدفعات.",
      },
      {
        en: "Private Mortgage Insurance (PMI) is typically required when your down payment is less than 20% of the home's price. It protects the lender, not you — and it's added to your monthly payment.",
        es: "El seguro hipotecario privado (PMI) suele exigirse cuando tu pago inicial es menos del 20% del precio de la casa. Protege al prestamista, no a ti, y se suma a tu pago mensual.",
        ar: "يُطلب تأمين الرهن الخاص (PMI) عادةً عندما تكون دفعتك الأولى أقل من 20% من سعر المنزل. وهو يحمي المُقرض لا أنت - ويُضاف إلى دفعتك الشهرية.",
      },
      {
        en: "The good news: PMI doesn't last forever. Once you've built enough equity (usually 20%+), you can request to have it removed — lowering your monthly payment.",
        es: "La buena noticia: el PMI no dura para siempre. Cuando acumulas suficiente plusvalía (normalmente 20% o más), puedes pedir que lo quiten y bajar tu pago mensual.",
        ar: "الخبر السار: تأمين PMI لا يدوم إلى الأبد. فبمجرد أن تبني ملكية كافية (عادةً 20% أو أكثر) يمكنك طلب إزالته - فتنخفض دفعتك الشهرية.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Fixed-rate mortgage", es: "Hipoteca de tasa fija", ar: "رهن بفائدة ثابتة" },
        def: {
          en: "A loan whose interest rate never changes, so the payment stays predictable.",
          es: "Un préstamo cuya tasa de interés nunca cambia, así el pago es predecible.",
          ar: "قرض لا يتغير سعر فائدته أبداً، فتبقى الدفعة متوقعة.",
        },
      },
      {
        term: { en: "PMI", es: "PMI", ar: "تأمين PMI" },
        def: {
          en: "Private Mortgage Insurance — usually required with less than 20% down; protects the lender.",
          es: "Seguro hipotecario privado: se exige con menos del 20% de pago inicial; protege al prestamista.",
          ar: "تأمين الرهن الخاص - يُطلب عادةً عند دفعة أولى أقل من 20%؛ ويحمي المُقرض.",
        },
      },
    ],
    whyItMatters: {
      en: "Choosing the right loan type — and knowing when PMI applies — can save you tens of thousands over the life of the loan.",
      es: "Elegir el tipo de préstamo correcto, y saber cuándo aplica el PMI, puede ahorrarte decenas de miles durante la vida del préstamo.",
      ar: "اختيار نوع القرض الصحيح - ومعرفة متى يُطبَّق تأمين PMI - يمكن أن يوفّر عليك عشرات الآلاف على مدى عمر القرض.",
    },
    check: {
      question: {
        en: "Quick check: PMI is usually required when…",
        es: "Repaso rápido: el PMI normalmente se exige cuando…",
        ar: "مراجعة سريعة: يُطلب تأمين PMI عادةً عندما…",
      },
      options: [
        {
          en: "You put down less than 20%",
          es: "Das menos del 20% de pago inicial",
          ar: "تدفع أقل من 20% دفعة أولى",
        },
        {
          en: "You choose a fixed-rate loan",
          es: "Eliges un préstamo de tasa fija",
          ar: "تختار قرضاً بفائدة ثابتة",
        },
        {
          en: "You buy your second home",
          es: "Compras tu segunda casa",
          ar: "تشتري منزلك الثاني",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Exactly — under 20% down usually means PMI, and you can request removal once you reach ~20% equity.",
        es: "Exacto: menos del 20% inicial suele significar PMI, y puedes pedir quitarlo al llegar a ~20% de plusvalía.",
        ar: "تماماً - أقل من 20% دفعة أولى يعني عادةً تأمين PMI، ويمكنك طلب إزالته عند بلوغ نحو 20% من الملكية.",
      },
    },
  },
  {
    id: "mortgage-affordability",
    section: "mortgages",
    calculator: "affordability",
    title: {
      en: "What Can You Afford? The 29/41 Rule",
      es: "¿Cuánto puedes pagar? La regla 29/41",
      ar: "ما الذي يمكنك تحمّله؟ قاعدة 29/41",
    },
    body: [
      {
        en: "Lenders use two ratios to judge affordability. The housing ratio says your monthly housing cost should be at most about 29% of your gross monthly income. The debt-to-income (DTI) ratio says housing PLUS all other debt payments should stay under about 41%.",
        es: "Los prestamistas usan dos proporciones para medir la capacidad de pago. La proporción de vivienda dice que tu costo mensual de vivienda debe ser como máximo cerca del 29% de tu ingreso mensual bruto. La proporción deuda-ingreso (DTI) dice que la vivienda MÁS las demás deudas deben quedar bajo el 41%.",
        ar: "يستخدم المُقرضون نسبتين لتقدير القدrة على التحمّل. نسبة السكن تقول إن تكلفة سكنك الشهرية يجب ألا تتجاوز نحو 29% من دخلك الشهري الإجمالي. ونسبة الدين إلى الدخل (DTI) تقول إن السكن بالإضافة إلى كل أقساط الديون الأخرى يجب أن تبقى تحت نحو 41%.",
      },
      {
        en: "Meet the Murphys: Terrance and Wilma live with two kids in a crowded apartment. They've saved $1,200 toward a down payment and found a 30-year loan at 8% with a 29% housing ratio and 41% DTI. Those two percentages — applied to THEIR income — tell them exactly what monthly payment a lender would approve.",
        es: "Conoce a los Murphy: Terrance y Wilma viven con dos hijos en un apartamento pequeño. Ahorraron $1,200 para el pago inicial y encontraron un préstamo a 30 años al 8% con proporción de vivienda de 29% y DTI de 41%. Esos dos porcentajes —aplicados a SU ingreso— les dicen exactamente qué pago mensual aprobaría un prestamista.",
        ar: "تعرّف على عائلة ميرفي: يعيش تيرانس وويلما مع طفليهما في شقة مزدحمة. ادّخرا 1,200 دولار للدفعة الأولى ووجدا قرضاً لثلاثين عاماً بفائدة 8% بنسبة سكن 29% ونسبة دين إلى دخل 41%. هاتان النسبتان - مطبقتين على دخلهما - تخبرانهما تماماً بالدفعة الشهرية التي سيوافق عليها المُقرض.",
      },
      {
        en: "Try it yourself with the calculator below: enter your household's monthly income and your current debt payments, and see your own 29% and 41% lines. This is the same math a lender will do.",
        es: "Pruébalo tú con la calculadora de abajo: escribe el ingreso mensual de tu hogar y tus pagos de deudas actuales, y verás tus propias líneas del 29% y el 41%. Es el mismo cálculo que hará el prestamista.",
        ar: "جرّبها بنفسك بالحاسبة أدناه: أدخل دخل أسرتك الشهري وأقساط ديونك الحالية، وسترى خطّي 29% و41% الخاصين بك. هذا هو نفس الحساب الذي سيجريه المُقرض.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Housing ratio", es: "Proporción de vivienda", ar: "نسبة السكن" },
        def: {
          en: "Monthly housing cost ÷ gross monthly income — keep it near 29% or below.",
          es: "Costo mensual de vivienda ÷ ingreso mensual bruto: mantenlo cerca o debajo del 29%.",
          ar: "تكلفة السكن الشهرية ÷ الدخل الشهري الإجمالي - أبقها قرب 29% أو أقل.",
        },
      },
      {
        term: { en: "Debt-to-income (DTI)", es: "Deuda-ingreso (DTI)", ar: "نسبة الدين إلى الدخل" },
        def: {
          en: "All monthly debt payments ÷ gross monthly income — lenders look for about 41% or less.",
          es: "Todos los pagos mensuales de deudas ÷ ingreso mensual bruto: los prestamistas buscan 41% o menos.",
          ar: "جميع أقساط الديون الشهرية ÷ الدخل الشهري الإجمالي - يبحث المُقرضون عن نحو 41% أو أقل.",
        },
      },
    ],
    whyItMatters: {
      en: "Knowing your numbers before you shop means you look at homes you can actually win — and keep.",
      es: "Conocer tus números antes de buscar significa ver casas que realmente puedes conseguir y mantener.",
      ar: "معرفة أرقامك قبل البحث تعني أن تنظر إلى منازل يمكنك فعلاً الفوز بها - والاحتفاظ بها.",
    },
  },
  {
    id: "process-steps-team",
    section: "process",
    title: {
      en: "The Steps — and the Team Around You",
      es: "Los pasos y el equipo que te acompaña",
      ar: "الخطوات - والفريق من حولك",
    },
    body: [
      {
        en: "Buying a home follows a clear sequence: review your finances and build a budget; save for a down payment; get pre-approved BEFORE you shop; find a home and make an offer; submit your loan application; order a home inspection; shop for homeowner's insurance; receive final approval; and close on your home.",
        es: "Comprar una casa sigue una secuencia clara: revisa tus finanzas y haz un presupuesto; ahorra para el pago inicial; obtén la preaprobación ANTES de buscar; encuentra una casa y haz una oferta; presenta la solicitud del préstamo; ordena la inspección; busca el seguro de vivienda; recibe la aprobación final; y cierra la compra.",
        ar: "يتبع شراء المنزل تسلسلاً واضحاً: راجع أموالك وضع ميزانية؛ ادّخر للدفعة الأولى؛ احصل على الموافقة المبدئية قبل البحث؛ جد منزلاً وقدّم عرضاً؛ قدّم طلب القرض؛ اطلب فحص المنزل؛ ابحث عن تأمين المنزل؛ احصل على الموافقة النهائية؛ ثم أتمم الشراء.",
      },
      {
        en: "You won't do it alone. Your team includes a real estate agent (finds homes, negotiates for you), a lender (funds the loan), an appraiser (confirms the home's value), a home inspector (checks its condition), an insurance agent, and a closing agent who handles the final paperwork.",
        es: "No lo harás solo. Tu equipo incluye un agente inmobiliario (busca casas y negocia por ti), un prestamista (financia el préstamo), un tasador (confirma el valor), un inspector (revisa el estado de la casa), un agente de seguros y un agente de cierre que maneja los documentos finales.",
        ar: "لن تفعل ذلك وحدك. يضم فريقك وكيلاً عقارياً (يجد المنازل ويتفاوض عنك)، ومُقرضاً (يموّل القرض)، ومُثمّناً (يؤكد قيمة المنزل)، وفاحص منازل (يتحقق من حالته)، ووكيل تأمين، ووكيل إتمام يتولى الأوراق النهائية.",
      },
      {
        en: "The order matters. Pre-approval before shopping keeps you realistic and makes sellers take your offer seriously. The inspection before closing protects you from expensive surprises.",
        es: "El orden importa. La preaprobación antes de buscar te mantiene realista y hace que los vendedores tomen en serio tu oferta. La inspección antes del cierre te protege de sorpresas caras.",
        ar: "الترتيب مهم. الموافقة المبدئية قبل البحث تُبقيك واقعياً وتجعل البائعين يأخذون عرضك على محمل الجد. والفحص قبل الإتمام يحميك من المفاجآت المكلفة.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Pre-approval", es: "Preaprobación", ar: "الموافقة المبدئية" },
        def: {
          en: "A lender's written estimate of how much you can borrow — get it before you shop.",
          es: "Una estimación escrita del prestamista de cuánto puedes pedir; obtenla antes de buscar casa.",
          ar: "تقدير كتابي من المُقرض لمقدار ما يمكنك اقتراضه - احصل عليه قبل البحث عن منزل.",
        },
      },
      {
        term: { en: "Appraiser", es: "Tasador", ar: "المُثمّن" },
        def: {
          en: "A neutral professional who confirms the home is worth the price being paid.",
          es: "Un profesional neutral que confirma que la casa vale el precio que se paga.",
          ar: "مهني محايد يؤكد أن المنزل يساوي الثمن المدفوع.",
        },
      },
    ],
    whyItMatters: {
      en: "Knowing the sequence — and who does what — keeps you in control instead of being rushed through the biggest purchase of your life.",
      es: "Conocer la secuencia, y quién hace qué, te mantiene en control en la compra más grande de tu vida.",
      ar: "معرفة التسلسل - ومن يفعل ماذا - تُبقيك مسيطراً بدلاً من أن تُستعجل في أكبر عملية شراء في حياتك.",
    },
    sorter: {
      title: {
        en: "Put the homebuying steps in order",
        es: "Ordena los pasos de la compra",
        ar: "رتّب خطوات شراء المنزل",
      },
      steps: [
        { en: "Review finances & build a budget", es: "Revisar finanzas y hacer presupuesto", ar: "مراجعة الأموال ووضع ميزانية" },
        { en: "Get pre-approved", es: "Obtener la preaprobación", ar: "الحصول على الموافقة المبدئية" },
        { en: "Find a home & make an offer", es: "Encontrar casa y hacer una oferta", ar: "إيجاد منزل وتقديم عرض" },
        { en: "Order the home inspection", es: "Ordenar la inspección", ar: "طلب فحص المنزل" },
        { en: "Get homeowner's insurance", es: "Conseguir el seguro de vivienda", ar: "الحصول على تأمين المنزل" },
        { en: "Close on your home!", es: "¡Cerrar la compra!", ar: "إتمام شراء منزلك!" },
      ],
    },
  },
  {
    id: "rights-documents",
    section: "rights",
    activity: "loan-estimate",
    title: {
      en: "Your Documents and Your Rights",
      es: "Tus documentos y tus derechos",
      ar: "مستنداتك وحقوقك",
    },
    body: [
      {
        en: "Two documents protect you most. The Loan Estimate shows the loan's terms and costs up front, so you can compare lenders. The Closing Disclosure lists the final numbers — and you must receive it at least three business days before closing, so you have time to review.",
        es: "Dos documentos te protegen más. La Estimación del Préstamo muestra los términos y costos por adelantado para comparar prestamistas. La Divulgación de Cierre muestra las cifras finales, y debes recibirla al menos tres días hábiles antes del cierre para revisarla con tiempo.",
        ar: "هناك وثيقتان تحميانك أكثر من غيرهما. تقدير القرض يُظهر شروط القرض وتكاليفه مقدماً لتتمكن من مقارنة المُقرضين. وإفصاح الإتمام يعرض الأرقام النهائية - ويجب أن تستلمه قبل ثلاثة أيام عمل على الأقل من الإتمام ليكون لديك وقت للمراجعة.",
      },
      {
        en: "At closing you'll also sign the mortgage note (your promise to repay) and the mortgage itself (the lien on the home). Never sign documents you don't understand — ask questions until the answers are clear.",
        es: "En el cierre también firmarás el pagaré (tu promesa de pagar) y la hipoteca (el gravamen sobre la casa). Nunca firmes documentos que no entiendas: pregunta hasta que todo esté claro.",
        ar: "عند الإتمام ستوقّع أيضاً سند الرهن (وعدك بالسداد) والرهن نفسه (الحق على المنزل). لا توقّع أبداً مستندات لا تفهمها - اسأل حتى تتضح الإجابات.",
      },
      {
        en: "The law is on your side: fair-lending laws make it illegal to deny or price a loan based on race, color, religion, national origin, sex, family status, disability, or age. If a deal feels predatory — pressure to sign fast, fees that keep changing, promises that aren't in writing — walk away and call a HUD-approved counselor.",
        es: "La ley está de tu lado: las leyes de préstamos justos prohíben negar o encarecer un préstamo por raza, color, religión, origen nacional, sexo, situación familiar, discapacidad o edad. Si un trato parece abusivo —presión para firmar rápido, cargos que cambian, promesas que no están por escrito— retírate y llama a un asesor aprobado por HUD.",
        ar: "القانون في صفك: قوانين الإقراض العادل تجعل من غير القانوني رفض قرض أو رفع سعره بسبب العِرق أو اللون أو الدين أو الأصل القومي أو الجنس أو الحالة الأسرية أو الإعاقة أو العمر. إذا بدا لك العرض استغلالياً - ضغط للتوقيع بسرعة، رسوم تتغير باستمرار، وعود غير مكتوبة - فانسحب واتصل بمستشار معتمد من HUD.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Closing Disclosure", es: "Divulgación de Cierre", ar: "إفصاح الإتمام" },
        def: {
          en: "The final loan terms and costs — yours at least 3 business days before closing.",
          es: "Los términos y costos finales del préstamo; debes tenerla al menos 3 días hábiles antes del cierre.",
          ar: "شروط القرض وتكاليفه النهائية - تستلمها قبل 3 أيام عمل على الأقل من الإتمام.",
        },
      },
      {
        term: { en: "Predatory lending", es: "Préstamo abusivo", ar: "الإقراض الاستغلالي" },
        def: {
          en: "Unfair loan practices: pressure, hidden fees, or terms designed to strip your equity.",
          es: "Prácticas injustas: presión, cargos ocultos o condiciones diseñadas para quitarte tu plusvalía.",
          ar: "ممارسات إقراض غير عادلة: ضغط أو رسوم خفية أو شروط مصممة لتجريدك من ملكيتك.",
        },
      },
    ],
    whyItMatters: {
      en: "The 3-day rule and fair-lending laws exist because buyers were rushed and discriminated against — knowing them is your shield.",
      es: "La regla de 3 días y las leyes de préstamos justos existen porque a los compradores los apuraban y discriminaban; conocerlas es tu escudo.",
      ar: "قاعدة الأيام الثلاثة وقوانين الإقراض العادل وُجدت لأن المشترين كانوا يُستعجلون ويتعرضون للتمييز - ومعرفتها هي درعك.",
    },
    check: {
      question: {
        en: "Quick check: when must you receive the Closing Disclosure?",
        es: "Repaso rápido: ¿cuándo debes recibir la Divulgación de Cierre?",
        ar: "مراجعة سريعة: متى يجب أن تستلم إفصاح الإتمام؟",
      },
      options: [
        {
          en: "On the day of closing",
          es: "El día del cierre",
          ar: "في يوم الإتمام",
        },
        {
          en: "At least 3 business days before closing",
          es: "Al menos 3 días hábiles antes del cierre",
          ar: "قبل 3 أيام عمل على الأقل من الإتمام",
        },
        {
          en: "Whenever the lender chooses",
          es: "Cuando el prestamista quiera",
          ar: "متى شاء المُقرض",
        },
      ],
      correctIndex: 1,
      explain: {
        en: "Yes — the 3-business-day rule gives you time to review every final number before you sign.",
        es: "Sí: la regla de 3 días hábiles te da tiempo para revisar cada cifra final antes de firmar.",
        ar: "نعم - قاعدة أيام العمل الثلاثة تمنحك وقتاً لمراجعة كل رقم نهائي قبل التوقيع.",
      },
    },
  },
  {
    id: "loan-types",
    section: "mortgages",
    activity: "loan-matcher",
    title: {
      en: "Types of Loans: FHA, VA, USDA & Conventional",
      es: "Tipos de préstamos: FHA, VA, USDA y convencional",
      ar: "أنواع القروض: FHA وVA وUSDA والتقليدي",
    },
    body: [
      {
        en: "There's more than one kind of mortgage, and the right one depends on you. A conventional loan isn't government-backed; it often wants slightly stronger credit but can allow as little as 3% down and lets you drop PMI once you reach 20% equity.",
        es: "Hay más de un tipo de hipoteca, y la correcta depende de ti. Un préstamo convencional no está respaldado por el gobierno; suele pedir un crédito un poco más fuerte, pero puede permitir tan poco como 3% de inicial y dejar el PMI al llegar al 20% de plusvalía.",
        ar: "هناك أكثر من نوع للرهن، والمناسب يعتمد عليك. القرض التقليدي ليس مدعوماً من الحكومة؛ وغالباً يطلب ائتماناً أقوى قليلاً لكنه قد يسمح بدفعة أولى لا تتجاوز 3% ويتيح إلغاء تأمين PMI عند بلوغ 20% من الملكية.",
      },
      {
        en: "Government-backed loans open more doors. FHA allows 3.5% down with flexible credit. VA loans — for veterans and service members — often need 0% down and no monthly mortgage insurance. USDA loans cover many rural and some suburban areas with 0% down and income limits.",
        es: "Los préstamos respaldados por el gobierno abren más puertas. FHA permite 3.5% de inicial con crédito flexible. Los VA —para veteranos y militares— a menudo no requieren inicial ni seguro hipotecario mensual. Los USDA cubren muchas zonas rurales y algunas suburbanas con 0% de inicial y límites de ingreso.",
        ar: "القروض المدعومة حكومياً تفتح أبواباً أكثر. قرض FHA يسمح بدفعة 3.5% بائتمان مرن. وقروض VA - للمحاربين القدامى والعسكريين - غالباً بلا دفعة أولى ولا تأمين رهن شهري. وقروض USDA تغطي كثيراً من المناطق الريفية وبعض الضواحي بدفعة 0% وبحدود دخل.",
      },
      {
        en: "Each has trade-offs in down payment, mortgage insurance, and who qualifies — and many down-payment-assistance programs pair with specific loan types. A HUD-approved counselor or a good loan officer can match you to the best fit; you don't have to figure it out alone.",
        es: "Cada uno tiene ventajas y desventajas en inicial, seguro hipotecario y quién califica, y muchos programas de ayuda se combinan con tipos de préstamo específicos. Un asesor aprobado por HUD o un buen oficial de préstamos puede emparejarte con el mejor; no tienes que resolverlo solo.",
        ar: "لكلٍّ مزايا ومقايضات في الدفعة الأولى وتأمين الرهن ومن يتأهل - وكثير من برامج الدعم ترتبط بأنواع قروض محددة. ويمكن لمستشار معتمد من HUD أو موظف قروض جيد أن يوفّق لك الأنسب؛ لست مضطراً لاكتشاف ذلك وحدك.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Conventional loan", es: "Préstamo convencional", ar: "قرض تقليدي" },
        def: {
          en: "A mortgage not backed by a government program; PMI can be removed at 20% equity.",
          es: "Una hipoteca no respaldada por el gobierno; el PMI se puede quitar al 20% de plusvalía.",
          ar: "رهن غير مدعوم ببرنامج حكومي؛ ويمكن إلغاء تأمين PMI عند 20% ملكية.",
        },
      },
      {
        term: { en: "FHA / VA / USDA loans", es: "Préstamos FHA / VA / USDA", ar: "قروض FHA / VA / USDA" },
        def: {
          en: "Government-backed loans with low or no down payment for buyers who qualify.",
          es: "Préstamos respaldados por el gobierno con poco o ningún pago inicial para quienes califican.",
          ar: "قروض مدعومة حكومياً بدفعة أولى منخفضة أو معدومة لمن يتأهل.",
        },
      },
    ],
    whyItMatters: {
      en: "Picking the right loan type can mean a far smaller down payment — and which assistance you can stack on top.",
      es: "Elegir el tipo de préstamo correcto puede significar un pago inicial mucho menor, y qué ayuda puedes sumar.",
      ar: "اختيار نوع القرض الصحيح قد يعني دفعة أولى أصغر بكثير - وأي دعم يمكنك إضافته فوقه.",
    },
    check: {
      question: {
        en: "Quick check: which loan often allows 0% down for veterans and service members?",
        es: "Repaso rápido: ¿qué préstamo suele permitir 0% inicial para veteranos y militares?",
        ar: "مراجعة سريعة: أي قرض غالباً يسمح بدفعة 0% للمحاربين القدامى والعسكريين؟",
      },
      options: [
        { en: "A VA loan", es: "Un préstamo VA", ar: "قرض VA" },
        { en: "A conventional loan", es: "Un préstamo convencional", ar: "قرض تقليدي" },
        { en: "A payday loan", es: "Un préstamo de día de pago", ar: "قرض حتى يوم الراتب" },
      ],
      correctIndex: 0,
      explain: {
        en: "Right — VA loans reward military service with often-zero down and no monthly mortgage insurance.",
        es: "Correcto: los préstamos VA premian el servicio militar, a menudo sin inicial ni seguro hipotecario mensual.",
        ar: "صحيح - قروض VA تكافئ الخدمة العسكرية، وغالباً بلا دفعة أولى ولا تأمين رهن شهري.",
      },
    },
  },
  {
    id: "mortgage-upfront-monthly",
    section: "mortgages",
    calculator: "mortgage",
    title: {
      en: "What It Costs: Upfront & Monthly",
      es: "Lo que cuesta: inicial y mensual",
      ar: "كم يكلّف: مقدّماً وشهرياً",
    },
    body: [
      {
        en: "Two money questions decide what you can buy: what you need upfront, and what you'll pay each month. Upfront means your down payment (3.5%–20%), closing costs (1%–6% — appraisal, title, recording, loan origination), and earnest money (1%–3%, credited back at closing).",
        es: "Dos preguntas de dinero deciden qué puedes comprar: lo que necesitas al inicio y lo que pagarás cada mes. Al inicio: el pago inicial (3.5%–20%), los costos de cierre (1%–6%: avalúo, título, registro, originación) y el depósito de buena fe (1%–3%, que se acredita al cierre).",
        ar: "سؤالان ماليان يحدّدان ما يمكنك شراؤه: ما تحتاجه مقدماً، وما ستدفعه كل شهر. المقدّم يعني دفعتك الأولى (3.5%–20%)، وتكاليف الإتمام (1%–6%: تقييم، ملكية، تسجيل، إنشاء القرض)، والعربون (1%–3%، يُحتسب لك عند الإتمام).",
      },
      {
        en: "Monthly means PITI: principal, interest, taxes, and insurance — plus PMI if you put less than 20% down. Your lender usually collects the taxes and insurance into an 'escrow' account and pays those bills for you, so your one payment covers everything.",
        es: "El mensual es PITI: capital, interés, impuestos y seguro, más el PMI si das menos del 20%. El prestamista suele juntar impuestos y seguro en una cuenta 'escrow' y paga esas cuentas por ti, así un solo pago cubre todo.",
        ar: "الشهري يعني PITI: أصل القرض والفائدة والضرائب والتأمين - بالإضافة إلى تأمين PMI إن دفعت أقل من 20%. وعادةً يجمع مُقرضك الضرائب والتأمين في حساب 'ضمان' ويدفع تلك الفواتير عنك، فتغطّي دفعةٌ واحدة كل شيء.",
      },
      {
        en: "Play with the calculator below. Notice how a bigger down payment or a 15-year term cuts your interest but raises the upfront or monthly cost — and how taxes and insurance quietly add hundreds. The goal isn't the biggest loan; it's the payment you can keep making.",
        es: "Juega con la calculadora de abajo. Nota cómo un mayor inicial o un plazo de 15 años reduce el interés pero sube el costo inicial o mensual, y cómo impuestos y seguro suman cientos sin que lo notes. La meta no es el préstamo más grande, sino el pago que puedas seguir haciendo.",
        ar: "جرّب الحاسبة أدناه. لاحظ كيف تخفّض دفعة أولى أكبر أو مدة 15 عاماً فائدتك لكنها ترفع التكلفة المقدّمة أو الشهرية، وكيف تضيف الضرائب والتأمين مئات بهدوء. الهدف ليس أكبر قرض؛ بل الدفعة التي تستطيع الاستمرار في سدادها.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Escrow account", es: "Cuenta de escrow", ar: "حساب الضمان" },
        def: {
          en: "An account your lender uses to collect and pay your property taxes and insurance.",
          es: "Una cuenta que el prestamista usa para juntar y pagar tus impuestos y seguro.",
          ar: "حساب يستخدمه مُقرضك لتحصيل ودفع ضرائب عقارك وتأمينك.",
        },
      },
      {
        term: { en: "PITI", es: "PITI", ar: "PITI" },
        def: {
          en: "Principal, Interest, Taxes, Insurance — the four parts of a typical monthly payment.",
          es: "Capital, interés, impuestos, seguro: las cuatro partes del pago mensual típico.",
          ar: "أصل القرض والفائدة والضرائب والتأمين - الأجزاء الأربعة للدفعة الشهرية المعتادة.",
        },
      },
    ],
    whyItMatters: {
      en: "Knowing both numbers — upfront and monthly — is how you avoid being 'house poor' after you move in.",
      es: "Conocer ambos números —inicial y mensual— es como evitas quedar 'pobre por la casa' al mudarte.",
      ar: "معرفة الرقمين - المقدّم والشهري - هي كيف تتجنّب أن تصبح 'فقيراً بسبب المنزل' بعد انتقالك.",
    },
  },
  {
    id: "process-preapproval",
    section: "process",
    title: {
      en: "Get Pre-Approved & Shop Lenders",
      es: "Obtén preaprobación y compara prestamistas",
      ar: "احصل على موافقة مبدئية وقارن المُقرضين",
    },
    body: [
      {
        en: "Pre-qualification is a quick estimate. Pre-approval is the real thing: the lender verifies your income, credit, and savings and commits, in writing, to a loan amount. Get pre-approved BEFORE you shop — it tells you your true budget and makes sellers take your offer seriously.",
        es: "La precalificación es una estimación rápida. La preaprobación es lo real: el prestamista verifica tus ingresos, crédito y ahorros y se compromete, por escrito, a un monto. Obtén la preaprobación ANTES de buscar: te dice tu presupuesto real y hace que los vendedores tomen en serio tu oferta.",
        ar: "التأهيل المبدئي تقدير سريع. أما الموافقة المبدئية فهي الحقيقية: يتحقّق المُقرض من دخلك وائتمانك ومدّخراتك ويلتزم كتابياً بمبلغ. احصل عليها قبل البحث - فهي تُخبرك بميزانيتك الحقيقية وتجعل البائعين يأخذون عرضك بجدية.",
      },
      {
        en: "Shop lenders like any big purchase. Get Loan Estimates from at least two or three within about two weeks — bunching the applications keeps the credit-inquiry impact tiny — and compare the APR, the fees, and how they treat you, not just the headline rate.",
        es: "Compara prestamistas como cualquier compra grande. Obtén Estimaciones de al menos dos o tres en unas dos semanas —juntar las solicitudes mantiene mínimo el impacto en tu crédito— y compara el APR, las comisiones y cómo te tratan, no solo la tasa anunciada.",
        ar: "قارن المُقرضين كأي عملية شراء كبيرة. احصل على تقديرات قرض من اثنين أو ثلاثة على الأقل خلال نحو أسبوعين - فتجميع الطلبات يُبقي أثر الاستعلام ضئيلاً - وقارن APR والرسوم وكيفية معاملتهم لك، لا السعر المُعلَن فقط.",
      },
      {
        en: "Bring your pre-approval letter to every showing. It turns you from a browser into a buyer — and pairs with the Loan Estimate you'll learn to read in this class so you can pick the best, safest offer.",
        es: "Lleva tu carta de preaprobación a cada visita. Te convierte de curioso en comprador, y se combina con la Estimación de Préstamo que aprenderás a leer en esta clase para elegir la mejor y más segura oferta.",
        ar: "اصطحب خطاب موافقتك المبدئية إلى كل معاينة. فهو يحوّلك من متصفّح إلى مشترٍ - ويقترن بتقدير القرض الذي ستتعلّم قراءته في هذا الدرس لتختار أفضل عرض وأكثره أماناً.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Pre-approval", es: "Preaprobación", ar: "الموافقة المبدئية" },
        def: {
          en: "A lender's verified, written commitment to a loan amount — get it before you shop.",
          es: "El compromiso escrito y verificado de un prestamista a un monto; obtenlo antes de buscar.",
          ar: "التزام كتابي مُتحقَّق منه من المُقرض بمبلغ قرض - احصل عليه قبل البحث.",
        },
      },
      {
        term: { en: "Loan officer", es: "Oficial de préstamos", ar: "موظف القروض" },
        def: {
          en: "The lender's representative who guides your application and explains your options.",
          es: "El representante del prestamista que guía tu solicitud y explica tus opciones.",
          ar: "ممثل المُقرض الذي يوجّه طلبك ويشرح خياراتك.",
        },
      },
    ],
    whyItMatters: {
      en: "Pre-approval plus a few competing Loan Estimates is the single best way to save money and shop with confidence.",
      es: "La preaprobación más algunas Estimaciones que compitan es la mejor forma de ahorrar y comprar con confianza.",
      ar: "الموافقة المبدئية مع بضعة تقديرات قروض متنافسة هي أفضل طريقة لتوفير المال والتسوّق بثقة.",
    },
    check: {
      question: {
        en: "Quick check: how is pre-approval different from pre-qualification?",
        es: "Repaso rápido: ¿en qué se diferencia la preaprobación de la precalificación?",
        ar: "مراجعة سريعة: كيف تختلف الموافقة المبدئية عن التأهيل المبدئي؟",
      },
      options: [
        {
          en: "Pre-approval is verified and in writing; pre-qualification is a quick estimate",
          es: "La preaprobación es verificada y por escrito; la precalificación es una estimación rápida",
          ar: "الموافقة المبدئية مُتحقَّق منها وكتابية؛ والتأهيل المبدئي تقدير سريع",
        },
        {
          en: "They're exactly the same",
          es: "Son exactamente lo mismo",
          ar: "هما متطابقان تماماً",
        },
        {
          en: "Pre-qualification guarantees your loan",
          es: "La precalificación garantiza tu préstamo",
          ar: "التأهيل المبدئي يضمن قرضك",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Yes — pre-approval means the lender checked your numbers and committed in writing.",
        es: "Sí: la preaprobación significa que el prestamista revisó tus números y se comprometió por escrito.",
        ar: "نعم - الموافقة المبدئية تعني أن المُقرض تحقّق من أرقامك والتزم كتابياً.",
      },
    },
  },
  {
    id: "mortgage-murphy",
    section: "mortgages",
    title: {
      en: "Worked Example: Meet the Murphys",
      es: "Ejemplo práctico: la familia Murphy",
      ar: "مثال محلول: عائلة ميرفي",
    },
    body: [
      {
        en: "Terrance and Wilma Murphy live with their two kids in a crowded apartment and want to buy a home. Their combined gross income is $2,890 a month, they've saved $1,200, and they have six debts — store cards, furniture, two car loans — that add up to about $506 in monthly payments. A lender offers a 30-year fixed loan with a 29% housing ratio and a 41% debt-to-income ratio.",
        es: "Terrance y Wilma Murphy viven con sus dos hijos en un apartamento pequeño y quieren comprar casa. Su ingreso bruto combinado es de $2,890 al mes, ahorraron $1,200 y tienen seis deudas —tarjetas de tienda, muebles, dos autos— que suman unos $506 de pagos mensuales. Un prestamista ofrece un préstamo fijo a 30 años con proporción de vivienda de 29% y DTI de 41%.",
        ar: "يعيش تيرانس وويلما ميرفي مع طفليهما في شقة مزدحمة ويريدان شراء منزل. دخلهما الإجمالي المشترك 2,890 دولاراً شهرياً، ادّخرا 1,200 دولار، ولديهما ستة ديون - بطاقات متاجر، أثاث، قرضا سيارتين - تبلغ نحو 506 دولارات أقساط شهرية. يعرض مُقرض قرضاً ثابتاً لثلاثين عاماً بنسبة سكن 29% ونسبة دين إلى دخل 41%.",
      },
      {
        en: "Run the two ratios. The housing rule: 29% of $2,890 = about $838 a month for housing. The debt-to-income rule: 41% of $2,890 = about $1,185 for housing PLUS all debt — minus their $506 in existing debt leaves about $679 for housing. The lender uses the LOWER of the two, so the Murphys can support roughly $679 a month in house payment (PITI).",
        es: "Aplica las dos proporciones. Vivienda: 29% de $2,890 = unos $838 al mes. DTI: 41% de $2,890 = unos $1,185 para vivienda MÁS todas las deudas; menos sus $506 de deudas quedan unos $679 para vivienda. El prestamista usa el MENOR de los dos, así que los Murphy pueden sostener cerca de $679 al mes de pago (PITI).",
        ar: "طبّق النسبتين. السكن: 29% من 2,890 = نحو 838 دولاراً شهرياً. ونسبة الدين إلى الدخل: 41% من 2,890 = نحو 1,185 للسكن مع كل الديون؛ ناقص 506 دولارات ديونهم يتبقى نحو 679 للسكن. يستخدم المُقرض الأقل من الرقمين، فيمكن لعائلة ميرفي تحمّل نحو 679 دولاراً شهرياً للدفعة (PITI).",
      },
      {
        en: "See what their debt did? Those $506 in monthly payments cut their housing budget from $838 down to $679 — about $160 a month, which is real buying power. That's exactly why Day 1 pushed paying down debt: every dollar of monthly debt you clear is a dollar more you can put toward a home. Try their numbers in the affordability calculator on the next lesson.",
        es: "¿Ves lo que hizo su deuda? Esos $506 mensuales redujeron su presupuesto de vivienda de $838 a $679 —unos $160 al mes—, que es poder de compra real. Por eso el Día 1 insistió en pagar deudas: cada dólar de deuda mensual que liquidas es un dólar más para tu casa. Prueba sus números en la calculadora de la siguiente lección.",
        ar: "أرأيت ما فعله دينهم؟ تلك الـ506 دولارات الشهرية خفّضت ميزانية سكنهم من 838 إلى 679 - نحو 160 دولاراً شهرياً، وهي قوة شرائية حقيقية. لهذا شدّد اليوم الأول على سداد الديون: كل دولار من الدين الشهري تسدّده هو دولار إضافي لمنزلك. جرّب أرقامهم في حاسبة القدرة في الدرس التالي.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Front-end ratio", es: "Proporción inicial", ar: "النسبة الأمامية" },
        def: {
          en: "Housing cost ÷ gross income — the Murphys' was capped at 29%.",
          es: "Costo de vivienda ÷ ingreso bruto; el de los Murphy se limitó al 29%.",
          ar: "تكلفة السكن ÷ الدخل الإجمالي - وقد حُدّت نسبة عائلة ميرفي عند 29%.",
        },
      },
      {
        term: { en: "Back-end ratio", es: "Proporción final", ar: "النسبة الخلفية" },
        def: {
          en: "Housing plus ALL debt ÷ gross income — capped at 41% in this example.",
          es: "Vivienda más TODAS las deudas ÷ ingreso bruto; limitado al 41% aquí.",
          ar: "السكن مع كل الديون ÷ الدخل الإجمالي - محدود عند 41% في هذا المثال.",
        },
      },
    ],
    whyItMatters: {
      en: "Seeing real numbers makes the ratios click — and shows exactly how debt shrinks the home you can buy.",
      es: "Ver números reales hace que las proporciones tengan sentido y muestra cómo la deuda reduce la casa que puedes comprar.",
      ar: "رؤية أرقام حقيقية تجعل النسب مفهومة - وتُظهر تماماً كيف يُقلّص الدين المنزل الذي يمكنك شراؤه.",
    },
    check: {
      question: {
        en: "Quick check: lenders qualify you using…",
        es: "Repaso rápido: los prestamistas te califican usando…",
        ar: "مراجعة سريعة: يؤهّلك المُقرضون باستخدام…",
      },
      options: [
        {
          en: "The lower of the two ratio results",
          es: "El menor de los dos resultados de las proporciones",
          ar: "الأقل من نتيجتي النسبتين",
        },
        {
          en: "The higher of the two, always",
          es: "El mayor de los dos, siempre",
          ar: "الأعلى من النسبتين دائماً",
        },
        {
          en: "Only your income, ignoring debt",
          es: "Solo tu ingreso, ignorando la deuda",
          ar: "دخلك فقط متجاهلين الدين",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Right — the lower limit governs, which is why reducing monthly debt raises what you can afford.",
        es: "Correcto: gobierna el límite menor, por eso reducir la deuda mensual sube lo que puedes pagar.",
        ar: "صحيح - الحد الأدنى هو الحاكم، ولهذا فإن تقليل الدين الشهري يرفع ما تستطيع تحمّله.",
      },
    },
  },
  {
    id: "process-true-cost",
    section: "process",
    calculator: "rent-vs-buy",
    title: {
      en: "The True Cost of Owning a Home",
      es: "El costo real de tener casa",
      ar: "التكلفة الحقيقية لامتلاك منزل",
    },
    body: [
      {
        en: "The mortgage payment is only part of the story. Upfront, beyond your down payment, plan for the home inspection fee, closing costs, moving costs, and the furnishings, appliances, and small repairs every new place needs. Lenders also like to see cash reserves left over — so don't drain every dollar to close.",
        es: "El pago hipotecario es solo parte de la historia. Por adelantado, además del pago inicial, considera la inspección, los costos de cierre, la mudanza y los muebles, electrodomésticos y reparaciones pequeñas que toda casa nueva necesita. A los prestamistas les gusta ver reservas de efectivo, así que no gastes hasta el último dólar al cerrar.",
        ar: "دفعة الرهن ليست سوى جزء من القصة. مقدماً، إضافةً إلى دفعتك الأولى، خطّط لرسوم فحص المنزل، وتكاليف الإتمام، والانتقال، والأثاث والأجهزة والإصلاحات الصغيرة التي يحتاجها كل منزل جديد. ويحب المُقرضون رؤية احتياطي نقدي متبقٍّ - فلا تستنزف كل دولار عند الإتمام.",
      },
      {
        en: "Then come the ongoing costs that renters never paid: utilities (often higher in a house than an apartment), routine maintenance, and the inevitable repairs — a water heater, a roof, an appliance. A good rule is to set aside about 1% of the home's value each year just for upkeep. On a $200,000 home, that's about $2,000 a year, or $165 a month.",
        es: "Luego vienen los costos continuos que un inquilino nunca pagó: servicios (a menudo más altos en una casa que en un apartamento), mantenimiento de rutina y las reparaciones inevitables —un calentador, un techo, un electrodoméstico—. Una buena regla es apartar cerca del 1% del valor de la casa al año solo para el cuidado. En una casa de $200,000, son unos $2,000 al año, o $165 al mes.",
        ar: "ثم تأتي التكاليف المستمرة التي لم يدفعها المستأجر قط: الخدمات (غالباً أعلى في المنزل منها في الشقة)، والصيانة الدورية، والإصلاحات الحتمية - سخان ماء، سقف، جهاز. وقاعدة جيدة أن تخصّص نحو 1% من قيمة المنزل سنوياً للعناية فقط. في منزل بـ200,000 دولار، هذا نحو 2,000 دولار سنوياً، أو 165 شهرياً.",
      },
      {
        en: "Build all of this into the budget from Day 1 before you decide what you can afford. Owners who plan for the full cost keep their homes and their peace of mind; those who only budget the mortgage are the ones a single repair can push into debt.",
        es: "Incluye todo esto en el presupuesto del Día 1 antes de decidir cuánto puedes pagar. Los dueños que planean el costo completo conservan su casa y su tranquilidad; los que solo presupuestan la hipoteca son los que una sola reparación puede endeudar.",
        ar: "أدرج كل هذا في ميزانية اليوم الأول قبل أن تقرّر ما تستطيع تحمّله. الملّاك الذين يخطّطون للتكلفة الكاملة يحتفظون بمنازلهم وراحة بالهم؛ أما من يضع ميزانية للرهن فقط فهم من قد يدفعهم إصلاح واحد إلى الدين.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Cash reserves", es: "Reservas de efectivo", ar: "الاحتياطي النقدي" },
        def: {
          en: "Money left in the bank after closing — lenders and smart buyers want a cushion.",
          es: "Dinero que queda en el banco tras el cierre; los prestamistas y compradores listos quieren un colchón.",
          ar: "مال يبقى في البنك بعد الإتمام - يريده المُقرضون والمشترون الأذكياء كوسادة.",
        },
      },
      {
        term: { en: "Maintenance reserve", es: "Reserva de mantenimiento", ar: "احتياطي الصيانة" },
        def: {
          en: "Savings set aside for upkeep — about 1% of the home's value per year.",
          es: "Ahorro apartado para el cuidado: cerca del 1% del valor de la casa al año.",
          ar: "مدّخرات للعناية - نحو 1% من قيمة المنزل سنوياً.",
        },
      },
    ],
    whyItMatters: {
      en: "Budgeting only the mortgage is the most common way new owners get into trouble — the full cost is the real number.",
      es: "Presupuestar solo la hipoteca es la forma más común en que los nuevos dueños se meten en problemas; el costo completo es el número real.",
      ar: "وضع ميزانية للرهن فقط هو أكثر أسباب وقوع الملّاك الجدد في المشاكل - التكلفة الكاملة هي الرقم الحقيقي.",
    },
    check: {
      question: {
        en: "Quick check: a common guideline for yearly home maintenance savings is…",
        es: "Repaso rápido: una guía común de ahorro anual para mantenimiento es…",
        ar: "مراجعة سريعة: من القواعد الشائعة للادخار السنوي للصيانة…",
      },
      options: [
        { en: "About 1% of the home's value", es: "Cerca del 1% del valor de la casa", ar: "نحو 1% من قيمة المنزل" },
        { en: "Nothing — repairs are rare", es: "Nada: las reparaciones son raras", ar: "لا شيء - الإصلاحات نادرة" },
        { en: "50% of your income", es: "El 50% de tu ingreso", ar: "50% من دخلك" },
      ],
      correctIndex: 0,
      explain: {
        en: "Yes — about 1% a year keeps a repair from becoming a crisis.",
        es: "Sí: cerca del 1% al año evita que una reparación se vuelva una crisis.",
        ar: "نعم - نحو 1% سنوياً يمنع أن يتحوّل الإصلاح إلى أزمة.",
      },
    },
  },
  {
    id: "loan-fha-ohio",
    section: "mortgages",
    title: {
      en: "FHA Loans & OHFA in Ohio",
      es: "Préstamos FHA y OHFA en Ohio",
      ar: "قروض FHA وOHFA في أوهايو",
    },
    body: [
      {
        en: "The FHA loan — insured by the Federal Housing Administration — is one of the most popular paths for first-time and lower-credit buyers. The headline numbers: you can put down just 3.5% with a credit score of 580 or higher (if your score is 500–579, the minimum is 10%). FHA is also more forgiving on debt, often allowing a back-end DTI around 43%, and higher with strong compensating factors.",
        es: "El préstamo FHA —asegurado por la Administración Federal de Vivienda— es uno de los caminos más populares para compradores primerizos o con crédito más bajo. Los números clave: puedes dar solo 3.5% con un puntaje de 580 o más (si es 500–579, el mínimo es 10%). FHA también es más flexible con la deuda, a menudo permitiendo un DTI cercano al 43%, y más con factores compensatorios fuertes.",
        ar: "قرض FHA - المؤمَّن من الإدارة الفيدرالية للإسكان - من أكثر المسارات شيوعاً للمشترين لأول مرة أو ذوي الائتمان الأقل. الأرقام الأساسية: يمكنك دفع 3.5% فقط بدرجة ائتمانية 580 أو أعلى (وإن كانت 500–579 فالحد الأدنى 10%). وFHA أكثر تسامحاً مع الديون، إذ يسمح غالباً بنسبة دين إلى دخل قرابة 43%، وأعلى مع عوامل تعويضية قوية.",
      },
      {
        en: "The trade-off is mortgage insurance, called MIP. You pay an upfront premium of about 1.75% of the loan (usually rolled into the loan) plus an annual premium (commonly around 0.55%, paid monthly). Important: if you put down less than 10%, that annual MIP lasts the life of the loan — many owners later refinance to a conventional loan to shed it once they have 20% equity. With 10% down, the MIP drops off after 11 years.",
        es: "El intercambio es el seguro hipotecario, llamado MIP. Pagas una prima inicial de cerca del 1.75% del préstamo (normalmente incluida en el préstamo) más una prima anual (comúnmente cerca del 0.55%, pagada mensual). Importante: si das menos del 10%, ese MIP anual dura toda la vida del préstamo —muchos luego refinancian a un convencional para quitarlo al llegar al 20% de plusvalía—. Con 10% de inicial, el MIP termina a los 11 años.",
        ar: "المقابل هو تأمين الرهن، ويُسمى MIP. تدفع قسطاً مقدماً بنحو 1.75% من القرض (يُدمج عادةً في القرض) إضافةً إلى قسط سنوي (غالباً نحو 0.55%، يُدفع شهرياً). المهم: إن دفعت أقل من 10%، يدوم هذا القسط السنوي طوال عمر القرض - وكثيرون يعيدون التمويل لاحقاً إلى قرض تقليدي للتخلّص منه عند بلوغ 20% ملكية. وبدفعة 10% ينتهي التأمين بعد 11 عاماً.",
      },
      {
        en: "FHA sets a maximum loan amount by county. For 2025, most Ohio counties use the national 'floor' of about $524,000 for a single-family home, with higher-cost areas (like the Columbus metro) somewhat higher — always check the current limit for your county. The big Ohio advantage: FHA pairs with OHFA (Ohio Housing Finance Agency) down-payment assistance and its mortgage tax credit. OHFA generally looks for about a 640 score (650 for FHA). An OHFA-approved lender or a Benjamin Rose counselor (216-791-8000) can help you stack these.",
        es: "FHA fija un monto máximo de préstamo por condado. Para 2025, la mayoría de los condados de Ohio usan el 'piso' nacional de cerca de $524,000 para una casa unifamiliar, con zonas de mayor costo (como el área de Columbus) algo más altas; revisa siempre el límite actual de tu condado. La gran ventaja en Ohio: FHA se combina con la ayuda para el pago inicial de OHFA (Agencia de Financiamiento de Vivienda de Ohio) y su crédito fiscal hipotecario. OHFA busca cerca de 640 de puntaje (650 para FHA). Un prestamista aprobado por OHFA o un asesor de Benjamin Rose (216-791-8000) puede ayudarte a combinarlos.",
        ar: "يحدّد FHA حداً أقصى للقرض حسب المقاطعة. وفي 2025، تستخدم معظم مقاطعات أوهايو 'الحد الأدنى' الوطني البالغ نحو 524,000 دولار للمنزل المفرد، مع كون المناطق الأعلى تكلفة (كمنطقة كولومبوس) أعلى قليلاً - تحقّق دائماً من الحد الحالي لمقاطعتك. والميزة الكبرى في أوهايو: يقترن FHA بمساعدة الدفعة الأولى من OHFA (وكالة تمويل الإسكان في أوهايو) وائتمانها الضريبي العقاري. وتبحث OHFA عن درجة قرابة 640 (650 لـFHA). ويمكن لمُقرض معتمد من OHFA أو مستشار من Benjamin Rose (216-791-8000) مساعدتك على تجميعها.",
      },
    ],
    keyTerms: [
      {
        term: { en: "MIP (Mortgage Insurance Premium)", es: "MIP (prima de seguro hipotecario)", ar: "MIP (قسط تأمين الرهن)" },
        def: {
          en: "FHA's insurance — a 1.75% upfront premium plus an annual premium paid monthly.",
          es: "El seguro de FHA: una prima inicial del 1.75% más una prima anual pagada mensual.",
          ar: "تأمين FHA - قسط مقدّم 1.75% إضافةً إلى قسط سنوي يُدفع شهرياً.",
        },
      },
      {
        term: { en: "FHA loan limit", es: "Límite de préstamo FHA", ar: "حد قرض FHA" },
        def: {
          en: "The most FHA will insure in your county — about $524,000 in most of Ohio for 2025.",
          es: "Lo máximo que FHA asegura en tu condado: cerca de $524,000 en gran parte de Ohio en 2025.",
          ar: "أقصى ما يؤمّنه FHA في مقاطعتك - نحو 524,000 دولار في معظم أوهايو لعام 2025.",
        },
      },
    ],
    whyItMatters: {
      en: "FHA paired with OHFA assistance is the most common path to a home for Ohio first-time buyers with modest savings and growing credit.",
      es: "FHA combinado con la ayuda de OHFA es el camino más común a una casa para compradores primerizos de Ohio con ahorros modestos y crédito en crecimiento.",
      ar: "FHA مع مساعدة OHFA هو المسار الأكثر شيوعاً نحو منزل لمشتري أوهايو لأول مرة بمدّخرات متواضعة وائتمان متنامٍ.",
    },
    check: {
      question: {
        en: "Quick check: with a 580+ credit score, the minimum FHA down payment is…",
        es: "Repaso rápido: con un puntaje de 580+, el pago inicial mínimo de FHA es…",
        ar: "مراجعة سريعة: بدرجة 580+، الحد الأدنى لدفعة FHA الأولى هو…",
      },
      options: [
        { en: "3.5%", es: "3.5%", ar: "3.5%" },
        { en: "20%", es: "20%", ar: "20%" },
        { en: "0%", es: "0%", ar: "0%" },
      ],
      correctIndex: 0,
      explain: {
        en: "Right — 3.5% down at 580+, or 10% down for scores of 500–579.",
        es: "Correcto: 3.5% con 580+, o 10% para puntajes de 500–579.",
        ar: "صحيح - 3.5% عند 580+، أو 10% للدرجات بين 500–579.",
      },
    },
  },
];
