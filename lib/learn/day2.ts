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
];
