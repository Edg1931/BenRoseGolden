/**
 * Day 1 learner content spine — "Money Management & Understanding Credit".
 *
 * This is the single source the learner experience renders from. Every format
 * (on-screen lesson, audiobook via text-to-speech, translated module) is just a
 * different view of this same structured content, so new formats and languages
 * don't require re-authoring the material.
 *
 * Day 1 maps to two curriculum modules: `budgeting` + `credit-basics`
 * (see lib/participants/curriculum.ts). Lessons below are grouped by that
 * `section` so progress and quizzes stay aligned with the existing engine.
 */

export const LEARN_LANGS = ["en", "es", "ar"] as const;
export type LearnLang = (typeof LEARN_LANGS)[number];

export const LEARN_LANG_LABELS: Record<LearnLang, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
};

/** Text direction per language — Arabic is right-to-left. */
export function dirFor(lang: LearnLang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

/** A string provided in every supported language. */
export type Localized = Record<LearnLang, string>;

export interface KeyTerm {
  term: Localized;
  def: Localized;
}

/** Inline, ungraded knowledge check with instant feedback (Rise/Genially-style).
 *  Low-stakes by design, so shipping the answer to the client is fine — the
 *  graded day test stays server-scored. */
export interface InlineCheck {
  question: Localized;
  options: Localized[];
  correctIndex: number;
  explain: Localized;
}

/** Put-the-steps-in-order activity; `steps` are authored in the correct order
 *  and shuffled for play. */
export interface SorterBlock {
  title: Localized;
  steps: Localized[];
}

export interface Lesson {
  id: string;
  /** Section id within the day (drives the kicker label + podcast mapping). */
  section: string;
  title: Localized;
  /** Teaching paragraphs, in order. */
  body: Localized[];
  keyTerms: KeyTerm[];
  whyItMatters: Localized;
  /** Optional interactive blocks rendered inside the lesson. */
  check?: InlineCheck;
  sorter?: SorterBlock;
  calculator?: "budget" | "affordability" | "budget-planner" | "credit-simulator";
  /** Named hands-on activity widget rendered inside the lesson. */
  activity?: "expense-classifier";
}

export const DAY1_SECTIONS: Record<string, Localized> = {
  budgeting: {
    en: "Money Management & Budgeting",
    es: "Manejo del dinero y presupuesto",
    ar: "إدارة المال ووضع الميزانية",
  },
  "credit-basics": {
    en: "Understanding Credit",
    es: "Cómo entender el crédito",
    ar: "فهم الائتمان",
  },
};

export const DAY1_LESSONS: Lesson[] = [
  // ── Money Management & Budgeting ──────────────────────────────────────────
  {
    id: "budgeting-spending-plan",
    section: "budgeting",
    calculator: "budget-planner",
    title: {
      en: "Your Spending Plan (Budget)",
      es: "Tu plan de gastos (presupuesto)",
      ar: "خطة الإنفاق (الميزانية)",
    },
    body: [
      {
        en: "A budget — also called a spending plan — is simply a plan for your money. It gives every dollar of income a job: covering needs, paying bills, saving, and reducing debt, before the month even begins.",
        es: "Un presupuesto —también llamado plan de gastos— es simplemente un plan para tu dinero. Le da una tarea a cada dólar de ingreso: cubrir necesidades, pagar cuentas, ahorrar y reducir deudas, antes de que comience el mes.",
        ar: "الميزانية - وتُسمى أيضاً خطة الإنفاق - هي ببساطة خطة لأموالك. فهي تُعطي كل دولار من دخلك مهمة محددة: تغطية الاحتياجات، ودفع الفواتير، والادخار، وتقليل الديون، حتى قبل أن يبدأ الشهر.",
      },
      {
        en: "A good budget starts with two numbers: the money coming in (income) and the money going out (expenses). When you know both, you control your money instead of wondering where it went.",
        es: "Un buen presupuesto empieza con dos números: el dinero que entra (ingresos) y el dinero que sale (gastos). Cuando conoces ambos, controlas tu dinero en lugar de preguntarte a dónde se fue.",
        ar: "تبدأ الميزانية الجيدة برقمين: المال الداخل (الدخل) والمال الخارج (المصروفات). عندما تعرف كليهما، فإنك تتحكم في أموالك بدلاً من التساؤل أين ذهبت.",
      },
      {
        en: "Budgeting is the foundation of buying a home. Lenders want to see that you manage money steadily, and a budget is how you free up cash for a down payment.",
        es: "El presupuesto es la base para comprar una casa. Los prestamistas quieren ver que manejas el dinero de forma constante, y el presupuesto es la manera de liberar dinero para el pago inicial.",
        ar: "وضع الميزانية هو أساس شراء المنزل. يريد المُقرضون أن يروا أنك تُدير أموالك بثبات، والميزانية هي الطريقة التي توفّر بها المال للدفعة الأولى.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Spending plan", es: "Plan de gastos", ar: "خطة الإنفاق" },
        def: {
          en: "Another name for a budget — a plan that gives every dollar a purpose.",
          es: "Otro nombre para el presupuesto: un plan que le da un propósito a cada dólar.",
          ar: "اسم آخر للميزانية - خطة تُعطي كل دولار غرضاً محدداً.",
        },
      },
      {
        term: { en: "Income", es: "Ingresos", ar: "الدخل" },
        def: {
          en: "All the money you receive, such as wages, before expenses are paid.",
          es: "Todo el dinero que recibes, como el salario, antes de pagar gastos.",
          ar: "كل المال الذي تحصل عليه، مثل الأجور، قبل دفع المصروفات.",
        },
      },
    ],
    whyItMatters: {
      en: "Every step toward homeownership — saving a down payment, qualifying for a loan — starts with a working budget.",
      es: "Cada paso hacia ser dueño de tu casa —ahorrar el pago inicial, calificar para un préstamo— comienza con un presupuesto que funcione.",
      ar: "كل خطوة نحو امتلاك منزل - ادخار الدفعة الأولى، والتأهل للحصول على قرض - تبدأ بميزانية فعّالة.",
    },
  },
  {
    id: "budgeting-know-expenses",
    section: "budgeting",
    activity: "expense-classifier",
    title: {
      en: "Know Your Expenses",
      es: "Conoce tus gastos",
      ar: "اعرف مصروفاتك",
    },
    body: [
      {
        en: "Expenses come in different shapes. Fixed expenses stay the same each month — rent or a mortgage, a car payment, insurance. Variable expenses change month to month — groceries, gas, and utilities.",
        es: "Los gastos tienen distintas formas. Los gastos fijos son iguales cada mes —el alquiler o la hipoteca, el pago del auto, el seguro—. Los gastos variables cambian de un mes a otro —comida, gasolina y servicios—.",
        ar: "تأتي المصروفات بأشكال مختلفة. المصروفات الثابتة تبقى كما هي كل شهر - الإيجار أو الرهن العقاري، وقسط السيارة، والتأمين. أما المصروفات المتغيرة فتتغير من شهر لآخر - البقالة والوقود والخدمات.",
      },
      {
        en: "Some costs are regular (you expect them monthly) and some are irregular (they surprise you — a car repair, a medical bill). A Monthly Expense Worksheet helps you list all four kinds so nothing is missed.",
        es: "Algunos costos son regulares (los esperas cada mes) y otros son irregulares (te sorprenden —una reparación del auto, una factura médica—). Una Hoja de Gastos Mensuales te ayuda a anotar los cuatro tipos para que nada se te escape.",
        ar: "بعض التكاليف منتظمة (تتوقعها شهرياً) وبعضها غير منتظم (تفاجئك - إصلاح سيارة، فاتورة طبية). تساعدك ورقة المصروفات الشهرية على تدوين الأنواع الأربعة جميعها حتى لا يفوتك شيء.",
      },
      {
        en: "Writing down every expense, even small ones, shows the true picture. Most people are surprised how much small, regular spending adds up over a month.",
        es: "Anotar cada gasto, incluso los pequeños, muestra la imagen real. A la mayoría le sorprende cuánto suman los gastos pequeños y frecuentes a lo largo de un mes.",
        ar: "تدوين كل مصروف، حتى الصغير منه، يُظهر الصورة الحقيقية. يُفاجأ معظم الناس بحجم ما تتراكم إليه النفقات الصغيرة المتكررة على مدار الشهر.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Fixed expense", es: "Gasto fijo", ar: "مصروف ثابت" },
        def: {
          en: "A cost that stays the same each month, like rent or a car payment.",
          es: "Un costo que es igual cada mes, como el alquiler o el pago del auto.",
          ar: "تكلفة تبقى ثابتة كل شهر، مثل الإيجار أو قسط السيارة.",
        },
      },
      {
        term: { en: "Variable expense", es: "Gasto variable", ar: "مصروف متغيّر" },
        def: {
          en: "A cost that changes month to month, like groceries or gas.",
          es: "Un costo que cambia de mes a mes, como la comida o la gasolina.",
          ar: "تكلفة تتغير من شهر لآخر، مثل البقالة أو الوقود.",
        },
      },
    ],
    whyItMatters: {
      en: "You can't manage what you don't measure — listing expenses is how you find money to save.",
      es: "No puedes manejar lo que no mides: anotar los gastos es como encuentras dinero para ahorrar.",
      ar: "لا يمكنك إدارة ما لا تقيسه - تدوين المصروفات هو كيف تجد مالاً لتدّخره.",
    },
  },
  {
    id: "budgeting-good-habits",
    section: "budgeting",
    title: {
      en: "Building Good Spending Habits",
      es: "Crear buenos hábitos de gasto",
      ar: "بناء عادات إنفاق جيدة",
    },
    body: [
      {
        en: "Good habits make a budget stick. Live on your budget, practice gratitude for what you have, and research before you shop so you don't overspend on impulse.",
        es: "Los buenos hábitos hacen que el presupuesto funcione. Vive según tu presupuesto, agradece lo que tienes e investiga antes de comprar para no gastar de más por impulso.",
        ar: "العادات الجيدة تجعل الميزانية تدوم. عِش وفق ميزانيتك، ومارس الامتنان لما لديك، وابحث قبل أن تتسوّق حتى لا تُفرط في الإنفاق باندفاع.",
      },
      {
        en: "Know your spending triggers — stress, boredom, or a good sale — and make a plan to avoid them. An accountability partner, someone who checks in on your goals, makes a real difference.",
        es: "Conoce lo que dispara tus gastos —el estrés, el aburrimiento o una buena oferta— y haz un plan para evitarlo. Una persona que te apoye y revise tus metas hace una verdadera diferencia.",
        ar: "اعرف محفّزات إنفاقك - التوتر أو الملل أو عرض مغرٍ - وضع خطة لتجنّبها. وجود شريك مساءلة يتابع أهدافك معك يُحدث فرقاً حقيقياً.",
      },
      {
        en: "Small everyday choices save real money: use a shopping list, use coupons and sales, eat in and take lunch to work, comparison shop, buy from resale stores, and trade services with friends.",
        es: "Las pequeñas decisiones diarias ahorran dinero real: usa una lista de compras, usa cupones y ofertas, come en casa y lleva el almuerzo al trabajo, compara precios, compra en tiendas de reventa e intercambia servicios con amistades.",
        ar: "الخيارات اليومية الصغيرة توفّر مالاً حقيقياً: استخدم قائمة تسوّق، واستفد من القسائم والتخفيضات، وتناول الطعام في المنزل وخذ غداءك إلى العمل، وقارن الأسعار، واشترِ من متاجر البيع المُستعمَل، وتبادل الخدمات مع الأصدقاء.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Spending trigger", es: "Disparador de gasto", ar: "محفّز الإنفاق" },
        def: {
          en: "A feeling or situation that makes you want to spend, like stress or a sale.",
          es: "Una emoción o situación que te dan ganas de gastar, como el estrés o una oferta.",
          ar: "شعور أو موقف يدفعك إلى الإنفاق، مثل التوتر أو التخفيضات.",
        },
      },
      {
        term: {
          en: "Accountability partner",
          es: "Compañero de apoyo",
          ar: "شريك المساءلة",
        },
        def: {
          en: "Someone who helps you stay on track with your money goals.",
          es: "Alguien que te ayuda a mantenerte enfocado en tus metas de dinero.",
          ar: "شخص يساعدك على الالتزام بأهدافك المالية.",
        },
      },
    ],
    whyItMatters: {
      en: "Habits, not income alone, decide whether you reach your savings goal.",
      es: "Los hábitos, no solo los ingresos, deciden si alcanzas tu meta de ahorro.",
      ar: "العادات، وليس الدخل وحده، هي ما يُقرّر إن كنت ستبلغ هدف ادّخارك.",
    },
  },
  {
    id: "budgeting-money-tight",
    section: "budgeting",
    calculator: "budget",
    title: {
      en: "When Money Is Tight",
      es: "Cuando el dinero escasea",
      ar: "عندما يكون المال شحيحاً",
    },
    body: [
      {
        en: "If your expenses are higher than your income, don't ignore it — that's how debt grows. The first step is to track your spending and cut non-essential costs.",
        es: "Si tus gastos son mayores que tus ingresos, no lo ignores: así crece la deuda. El primer paso es registrar tus gastos y recortar los costos no esenciales.",
        ar: "إذا كانت مصروفاتك أعلى من دخلك، فلا تتجاهل الأمر - فهكذا تنمو الديون. الخطوة الأولى هي تتبّع إنفاقك وتقليص التكاليف غير الضرورية.",
      },
      {
        en: "A common guideline is to keep housing costs at about 30% of your gross monthly income. Staying near that line keeps the rest of your budget healthy.",
        es: "Una guía común es mantener el costo de la vivienda en cerca del 30% de tu ingreso mensual bruto. Mantenerte cerca de ese límite conserva sano el resto de tu presupuesto.",
        ar: "من القواعد الشائعة إبقاء تكاليف السكن عند نحو 30% من دخلك الشهري الإجمالي. البقاء قرب هذا الحد يُبقي بقية ميزانيتك سليمة.",
      },
      {
        en: "If you're stuck, free financial counseling can help you build a plan. Asking for help early is a sign of strength, not failure.",
        es: "Si te sientes atascado, la asesoría financiera gratuita puede ayudarte a armar un plan. Pedir ayuda a tiempo es señal de fortaleza, no de fracaso.",
        ar: "إذا تعثّرت، يمكن للاستشارة المالية المجانية أن تساعدك في وضع خطة. طلب المساعدة مبكراً علامة قوة، لا فشل.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Gross income", es: "Ingreso bruto", ar: "الدخل الإجمالي" },
        def: {
          en: "Your total pay before taxes and other deductions are taken out.",
          es: "Tu pago total antes de descontar impuestos y otras deducciones.",
          ar: "إجمالي أجرك قبل خصم الضرائب والاقتطاعات الأخرى.",
        },
      },
      {
        term: {
          en: "Financial counseling",
          es: "Asesoría financiera",
          ar: "الاستشارة المالية",
        },
        def: {
          en: "Free, expert help to build a budget and a plan to reach your goals.",
          es: "Ayuda gratuita y experta para crear un presupuesto y un plan para tus metas.",
          ar: "مساعدة مجانية من خبراء لوضع ميزانية وخطة لتحقيق أهدافك.",
        },
      },
    ],
    whyItMatters: {
      en: "Catching a shortfall early protects your credit and keeps your home goal on track.",
      es: "Detectar un faltante a tiempo protege tu crédito y mantiene en marcha tu meta de tener casa.",
      ar: "اكتشاف العجز مبكراً يحمي ائتمانك ويُبقي هدف امتلاك المنزل على مساره.",
    },
  },

  {
    id: "budgeting-make-it-easier",
    section: "budgeting",
    title: {
      en: "Make Money Management Easier",
      es: "Haz más fácil el manejo del dinero",
      ar: "اجعل إدارة المال أسهل",
    },
    body: [
      {
        en: "Small systems beat willpower. Know when every bill is due and set up autopay or reminders. Ask your utilities about 'level' or 'budget' billing so the gas and electric cost the same each month instead of spiking in winter.",
        es: "Los pequeños sistemas le ganan a la fuerza de voluntad. Sabe cuándo vence cada cuenta y activa el pago automático o recordatorios. Pregunta a tus servicios por la facturación 'nivelada' para que el gas y la luz cuesten igual cada mes en vez de dispararse en invierno.",
        ar: "الأنظمة الصغيرة تتغلّب على قوة الإرادة. اعرف موعد كل فاتورة وفعّل الدفع التلقائي أو التذكيرات. واسأل شركات الخدمات عن الفوترة 'المستوية' ليكون الغاز والكهرباء بالتكلفة نفسها كل شهر بدل أن ترتفع في الشتاء.",
      },
      {
        en: "Make your money flow automatically: use direct deposit, send a set amount to savings the day you get paid, and consider a separate account just for your home-savings goal so you're not tempted to spend it.",
        es: "Haz que tu dinero fluya solo: usa el depósito directo, envía una cantidad fija al ahorro el día que cobras y considera una cuenta separada solo para tu meta de casa, para no caer en la tentación de gastarla.",
        ar: "اجعل أموالك تتدفق تلقائياً: استخدم الإيداع المباشر، وحوّل مبلغاً ثابتاً إلى الادخار يوم استلام راتبك، وفكّر في حساب منفصل مخصّص لهدف منزلك حتى لا تُغريك نفسك بإنفاقه.",
      },
      {
        en: "Control day-to-day spending: carry as little cash as possible, buy only what's on your list, and keep a visual reminder of your goal — a photo of a house, your target number — where you'll see it when you're tempted.",
        es: "Controla el gasto diario: lleva el menor efectivo posible, compra solo lo de tu lista y ten un recordatorio visual de tu meta —la foto de una casa, tu número objetivo— donde lo veas cuando tengas tentación.",
        ar: "تحكّم في الإنفاق اليومي: احمل أقل قدر ممكن من النقد، واشترِ فقط ما في قائمتك، واحتفظ بتذكير بصري لهدفك - صورة منزل، أو رقمك المستهدف - حيث تراه عند الإغراء.",
      },
      {
        en: "And remember why you're doing this: down-payment assistance is real. Ohio programs, Grants for Grads, lender programs, and your city or county can all help — and Benjamin Rose counselors (216-791-8000) help you find and stack them.",
        es: "Y recuerda por qué lo haces: la ayuda para el pago inicial es real. Programas de Ohio, Grants for Grads, programas de prestamistas y tu ciudad o condado pueden ayudar, y los asesores de Benjamin Rose (216-791-8000) te ayudan a encontrarlos y combinarlos.",
        ar: "وتذكّر لماذا تفعل هذا: المساعدة في الدفعة الأولى حقيقية. برامج أوهايو، ومنح الخريجين، وبرامج المُقرضين، ومدينتك أو مقاطعتك يمكن أن تساعد - ومستشارو Benjamin Rose (هاتف 216-791-8000) يساعدونك على إيجادها وتجميعها.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Level billing", es: "Facturación nivelada", ar: "الفوترة المستوية" },
        def: {
          en: "A utility option that averages your bill so you pay the same amount each month.",
          es: "Una opción del servicio que promedia tu factura para pagar lo mismo cada mes.",
          ar: "خيار من شركة الخدمة يُوزّع فاتورتك لتدفع المبلغ نفسه كل شهر.",
        },
      },
      {
        term: { en: "Automatic savings", es: "Ahorro automático", ar: "الادخار التلقائي" },
        def: {
          en: "Moving money to savings automatically on payday, before you can spend it.",
          es: "Mover dinero al ahorro automáticamente el día de pago, antes de gastarlo.",
          ar: "تحويل المال إلى الادخار تلقائياً يوم الراتب قبل أن تنفقه.",
        },
      },
    ],
    whyItMatters: {
      en: "The buyers who reach their down payment aren't the ones with the most income — they're the ones who automated good habits.",
      es: "Los compradores que logran su pago inicial no son los de mayor ingreso, son los que automatizaron buenos hábitos.",
      ar: "المشترون الذين يبلغون دفعتهم الأولى ليسوا أصحاب أعلى دخل - بل من أتمتوا العادات الجيدة.",
    },
    check: {
      question: {
        en: "Quick check: the best way to make sure you save every month is to…",
        es: "Repaso rápido: la mejor forma de asegurarte de ahorrar cada mes es…",
        ar: "مراجعة سريعة: أفضل طريقة لتضمن الادخار كل شهر هي…",
      },
      options: [
        {
          en: "Save whatever is left at the end of the month",
          es: "Ahorrar lo que sobre al final del mes",
          ar: "ادّخار ما يتبقّى في نهاية الشهر",
        },
        {
          en: "Automatically move money to savings on payday",
          es: "Mover dinero al ahorro automáticamente el día de pago",
          ar: "تحويل المال تلقائياً إلى الادخار يوم الراتب",
        },
        {
          en: "Keep all your cash in your wallet",
          es: "Tener todo tu efectivo en la cartera",
          ar: "إبقاء كل نقدك في محفظتك",
        },
      ],
      correctIndex: 1,
      explain: {
        en: "Right — 'pay yourself first' with automatic transfers beats hoping money is left over.",
        es: "Correcto: 'págate a ti primero' con transferencias automáticas vence a esperar que sobre dinero.",
        ar: "صحيح - 'ادفع لنفسك أولاً' بالتحويلات التلقائية أفضل من انتظار أن يتبقّى مال.",
      },
    },
  },

  // ── Understanding Credit ──────────────────────────────────────────────────
  {
    id: "credit-what-is-report",
    section: "credit-basics",
    title: {
      en: "What Is a Credit Report?",
      es: "¿Qué es un informe de crédito?",
      ar: "ما هو تقرير الائتمان؟",
    },
    body: [
      {
        en: "A credit report is a record of how you've borrowed and repaid money. It lists your loans, credit cards, payment history, and balances.",
        es: "Un informe de crédito es un registro de cómo has pedido prestado y pagado dinero. Incluye tus préstamos, tarjetas de crédito, historial de pagos y saldos.",
        ar: "تقرير الائتمان هو سجلّ لكيفية اقتراضك للمال وسدادك له. وهو يُدرج قروضك وبطاقاتك الائتمانية وسجلّ مدفوعاتك وأرصدتك.",
      },
      {
        en: "Three major credit bureaus collect this information: Equifax, Experian, and TransUnion. Lenders check these reports to decide whether to lend to you.",
        es: "Tres grandes agencias de crédito recopilan esta información: Equifax, Experian y TransUnion. Los prestamistas revisan estos informes para decidir si te prestan.",
        ar: "تجمع هذه المعلومات ثلاث وكالات ائتمان رئيسية: إكويفاكس، وإكسبيريان، وترانس يونيون. ويطّلع المُقرضون على هذه التقارير ليُقرّروا ما إذا كانوا سيُقرضونك.",
      },
      {
        en: "You can get a free copy of your report from each bureau at least once a year at AnnualCreditReport.com. Checking your own report does not hurt your score.",
        es: "Puedes obtener una copia gratis de tu informe de cada agencia al menos una vez al año en AnnualCreditReport.com. Revisar tu propio informe no daña tu puntaje.",
        ar: "يمكنك الحصول على نسخة مجانية من تقريرك من كل وكالة مرة واحدة سنوياً على الأقل عبر AnnualCreditReport.com. والاطّلاع على تقريرك بنفسك لا يضرّ بدرجتك الائتمانية.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Credit report", es: "Informe de crédito", ar: "تقرير الائتمان" },
        def: {
          en: "A detailed record of your borrowing and repayment history.",
          es: "Un registro detallado de tu historial de préstamos y pagos.",
          ar: "سجلّ مفصّل لتاريخك في الاقتراض والسداد.",
        },
      },
      {
        term: { en: "Credit bureau", es: "Agencia de crédito", ar: "وكالة الائتمان" },
        def: {
          en: "A company that collects credit information: Equifax, Experian, TransUnion.",
          es: "Una empresa que recopila información de crédito: Equifax, Experian, TransUnion.",
          ar: "شركة تجمع معلومات الائتمان: إكويفاكس، إكسبيريان، ترانس يونيون.",
        },
      },
    ],
    whyItMatters: {
      en: "Your credit report is the first thing a mortgage lender looks at — knowing it puts you in control.",
      es: "Tu informe de crédito es lo primero que mira un prestamista hipotecario; conocerlo te da el control.",
      ar: "تقرير ائتمانك هو أول ما يطّلع عليه مُقرض الرهن العقاري - ومعرفته تضعك في موضع التحكّم.",
    },
  },
  {
    id: "credit-whats-in-report",
    section: "credit-basics",
    title: {
      en: "What's In a Credit Report",
      es: "Qué contiene un informe de crédito",
      ar: "ماذا يحتوي تقرير الائتمان",
    },
    body: [
      {
        en: "Your report includes personal information, a list of your credit accounts, and their payment history. It shows which accounts are open, your balances, and whether you pay on time.",
        es: "Tu informe incluye información personal, una lista de tus cuentas de crédito y su historial de pagos. Muestra qué cuentas están abiertas, tus saldos y si pagas a tiempo.",
        ar: "يتضمن تقريرك معلومات شخصية، وقائمة بحساباتك الائتمانية، وسجلّ مدفوعاتها. ويُظهر الحسابات المفتوحة، وأرصدتك، وما إذا كنت تدفع في الوقت المحدد.",
      },
      {
        en: "It also lists inquiries (when someone checks your credit) and public records like collections. Errors can appear here, which is why reviewing it matters.",
        es: "También incluye consultas (cuando alguien revisa tu crédito) y registros públicos como cobranzas. Aquí pueden aparecer errores, por eso es importante revisarlo.",
        ar: "كما يُدرج الاستعلامات (عندما يطّلع أحدهم على ائتمانك) والسجلّات العامة مثل ديون التحصيل. وقد تظهر هنا أخطاء، ولهذا تكون مراجعته مهمة.",
      },
      {
        en: "Your report does NOT include your income, race, or religion — and those cannot be used to judge your credit. Lenders look only at how you handle credit.",
        es: "Tu informe NO incluye tus ingresos, raza ni religión, y eso no se puede usar para juzgar tu crédito. Los prestamistas solo ven cómo manejas el crédito.",
        ar: "لا يتضمن تقريرك دخلك أو عِرقك أو دينك - ولا يجوز استخدام ذلك للحكم على ائتمانك. ينظر المُقرضون فقط إلى كيفية إدارتك للائتمان.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Inquiry", es: "Consulta", ar: "استعلام" },
        def: {
          en: "A record showing that someone checked your credit report.",
          es: "Un registro que muestra que alguien revisó tu informe de crédito.",
          ar: "سجلّ يُظهر أن أحدهم اطّلع على تقرير ائتمانك.",
        },
      },
      {
        term: { en: "Collection", es: "Cobranza", ar: "دين تحصيل" },
        def: {
          en: "An unpaid debt that has been sent to a collection agency.",
          es: "Una deuda no pagada que se envió a una agencia de cobranza.",
          ar: "دَين غير مسدَّد جرى تحويله إلى وكالة تحصيل.",
        },
      },
    ],
    whyItMatters: {
      en: "Reviewing your report lets you catch and fix errors before they cost you a loan.",
      es: "Revisar tu informe te permite detectar y corregir errores antes de que te cuesten un préstamo.",
      ar: "مراجعة تقريرك تتيح لك اكتشاف الأخطاء وتصحيحها قبل أن تُكلّفك قرضاً.",
    },
  },
  {
    id: "credit-why-matters",
    section: "credit-basics",
    title: {
      en: "Why Good Credit Matters",
      es: "Por qué importa el buen crédito",
      ar: "لماذا يهمّ الائتمان الجيد",
    },
    body: [
      {
        en: "Credit touches far more than mortgages. Good credit helps you rent or buy what you need, get a lower interest rate (which saves you real money), and even land a job, lease an apartment, turn on utilities, or get cheaper insurance.",
        es: "El crédito influye en mucho más que las hipotecas. El buen crédito te ayuda a rentar o comprar lo que necesitas, obtener una tasa de interés más baja (que ahorra dinero real) e incluso conseguir empleo, rentar departamento, activar servicios o pagar menos por seguros.",
        ar: "الائتمان يمسّ أكثر بكثير من الرهن العقاري. فالائتمان الجيد يساعدك على استئجار أو شراء ما تحتاجه، والحصول على فائدة أقل (توفّر مالاً حقيقياً)، بل وحتى الحصول على وظيفة، أو استئجار شقة، أو تشغيل الخدمات، أو تأمين أرخص.",
      },
      {
        en: "Lenders translate your report into a score, usually on a 300–850 scale. Roughly: 800+ is excellent, 740–799 very good, 670–739 good, 580–669 fair, and below 580 needs work. Higher score, lower risk to the lender, better rate for you.",
        es: "Los prestamistas convierten tu informe en un puntaje, normalmente de 300 a 850. A grandes rasgos: 800+ es excelente, 740–799 muy bueno, 670–739 bueno, 580–669 regular y menos de 580 necesita trabajo. Mayor puntaje, menor riesgo y mejor tasa para ti.",
        ar: "يحوّل المُقرضون تقريرك إلى درجة، عادةً على مقياس 300–850. تقريباً: 800+ ممتاز، و740–799 جيد جداً، و670–739 جيد، و580–669 مقبول، وأقل من 580 يحتاج عملاً. كلما ارتفعت الدرجة، قلّت المخاطرة وتحسّن سعرك.",
      },
      {
        en: "Here's the money part: on a 30-year mortgage, the gap between 'fair' and 'very good' credit can be a full percentage point or more — that's often tens of thousands of dollars over the life of the loan. Your score is worth working on.",
        es: "La parte del dinero: en una hipoteca a 30 años, la diferencia entre crédito 'regular' y 'muy bueno' puede ser un punto porcentual completo o más, a menudo decenas de miles de dólares en la vida del préstamo. Vale la pena trabajar tu puntaje.",
        ar: "أما الجانب المالي: في رهن لثلاثين عاماً، قد يكون الفارق بين ائتمان 'مقبول' و'جيد جداً' نقطة مئوية كاملة أو أكثر - وغالباً عشرات الآلاف من الدولارات على مدى القرض. درجتك تستحق العمل عليها.",
      },
    ],
    keyTerms: [
      {
        term: { en: "FICO score", es: "Puntaje FICO", ar: "درجة فايكو" },
        def: {
          en: "The most common credit score, from 300 to 850; higher means lower lending risk.",
          es: "El puntaje de crédito más común, de 300 a 850; más alto significa menor riesgo.",
          ar: "أكثر درجات الائتمان شيوعاً، من 300 إلى 850؛ الأعلى يعني مخاطرة أقل.",
        },
      },
      {
        term: { en: "Interest rate", es: "Tasa de interés", ar: "سعر الفائدة" },
        def: {
          en: "The yearly cost of borrowing — a better score earns a lower rate.",
          es: "El costo anual de pedir prestado; un mejor puntaje gana una tasa más baja.",
          ar: "التكلفة السنوية للاقتراض - الدرجة الأفضل تكسب سعراً أقل.",
        },
      },
    ],
    whyItMatters: {
      en: "Your credit score quietly sets the price of almost everything you finance — raising it is one of the highest-paying things you can do.",
      es: "Tu puntaje de crédito fija calladamente el precio de casi todo lo que financias; subirlo es de lo más rentable que puedes hacer.",
      ar: "درجة ائتمانك تُحدّد بهدوء سعر كل ما تموّله تقريباً - ورفعها من أكثر ما تفعله مردوداً.",
    },
    check: {
      question: {
        en: "Quick check: which credit score range is considered 'good'?",
        es: "Repaso rápido: ¿qué rango de puntaje se considera 'bueno'?",
        ar: "مراجعة سريعة: أي نطاق درجات يُعدّ 'جيداً'؟",
      },
      options: [
        { en: "300–579", es: "300–579", ar: "300–579" },
        { en: "670–739", es: "670–739", ar: "670–739" },
        { en: "It doesn't matter", es: "No importa", ar: "لا يهمّ" },
      ],
      correctIndex: 1,
      explain: {
        en: "Yes — 670–739 is 'good,' and most assistance programs want at least the high-600s.",
        es: "Sí: 670–739 es 'bueno', y la mayoría de los programas piden al menos cerca de 670.",
        ar: "نعم - 670–739 'جيد'، ومعظم برامج الدعم تطلب نحو أواخر الـ600 على الأقل.",
      },
    },
  },
  {
    id: "credit-score-factors",
    section: "credit-basics",
    calculator: "credit-simulator",
    title: {
      en: "What Your Credit Score Is Based On",
      es: "En qué se basa tu puntaje de crédito",
      ar: "على ماذا تستند درجتك الائتمانية",
    },
    body: [
      {
        en: "Your credit score is a number that summarizes your report. The biggest factor, by far, is payment history — paying every bill on time.",
        es: "Tu puntaje de crédito es un número que resume tu informe. El factor más importante, por mucho, es el historial de pagos: pagar cada cuenta a tiempo.",
        ar: "درجتك الائتمانية رقم يُلخّص تقريرك. والعامل الأكبر إلى حدّ بعيد هو سجلّ المدفوعات - أي دفع كل فاتورة في موعدها.",
      },
      {
        en: "Next is credit utilization: how much of your available credit you're using. Keeping balances well below your limits helps your score.",
        es: "Le sigue el uso del crédito: cuánto de tu crédito disponible estás usando. Mantener los saldos bien por debajo de tus límites ayuda a tu puntaje.",
        ar: "يليه معدّل استخدام الائتمان: أي مقدار ما تستخدمه من ائتمانك المتاح. وإبقاء الأرصدة أدنى بكثير من حدودك يُفيد درجتك.",
      },
      {
        en: "Other factors are the length of your credit history, your mix of credit types, and recent inquiries. Your income and age are NOT part of your score.",
        es: "Otros factores son la antigüedad de tu historial de crédito, la variedad de tipos de crédito y las consultas recientes. Tus ingresos y tu edad NO forman parte de tu puntaje.",
        ar: "من العوامل الأخرى طول تاريخك الائتماني، وتنوّع أنواع ائتمانك، والاستعلامات الحديثة. أما دخلك وعمرك فليسا جزءاً من درجتك.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Credit score", es: "Puntaje de crédito", ar: "الدرجة الائتمانية" },
        def: {
          en: "A number, often 300–850, that summarizes how you manage credit.",
          es: "Un número, a menudo de 300 a 850, que resume cómo manejas el crédito.",
          ar: "رقم، غالباً من 300 إلى 850، يُلخّص كيفية إدارتك للائتمان.",
        },
      },
      {
        term: {
          en: "Credit utilization",
          es: "Uso del crédito",
          ar: "معدّل استخدام الائتمان",
        },
        def: {
          en: "The share of your available revolving credit that you're using.",
          es: "La parte de tu crédito rotativo disponible que estás usando.",
          ar: "نسبة ما تستخدمه من ائتمانك المتجدّد المتاح.",
        },
      },
    ],
    whyItMatters: {
      en: "Knowing what moves your score tells you exactly what to work on to qualify for a mortgage.",
      es: "Saber qué afecta tu puntaje te dice exactamente en qué trabajar para calificar a una hipoteca.",
      ar: "معرفة ما يُحرّك درجتك يُخبرك تماماً بما عليك العمل عليه للتأهّل لرهن عقاري.",
    },
  },
  {
    id: "credit-build-protect",
    section: "credit-basics",
    title: {
      en: "Building and Protecting Your Credit",
      es: "Construir y proteger tu crédito",
      ar: "بناء ائتمانك وحمايته",
    },
    body: [
      {
        en: "The most reliable way to build credit is simple: pay every bill on time, every time. Set up reminders or autopay so you never miss.",
        es: "La forma más confiable de construir crédito es simple: paga cada cuenta a tiempo, siempre. Configura recordatorios o pago automático para nunca olvidarte.",
        ar: "أكثر الطرق موثوقية لبناء الائتمان بسيطة: ادفع كل فاتورة في موعدها، في كل مرة. فعّل التذكيرات أو الدفع التلقائي حتى لا يفوتك موعد.",
      },
      {
        en: "Keep your credit utilization low, limit how often you apply for new credit, and keep older accounts open to lengthen your history.",
        es: "Mantén bajo el uso de tu crédito, limita la frecuencia con que solicitas crédito nuevo y mantén abiertas las cuentas antiguas para alargar tu historial.",
        ar: "أبقِ معدّل استخدام ائتمانك منخفضاً، وقلّل من تكرار طلبك لائتمان جديد، وأبقِ الحسابات القديمة مفتوحة لإطالة تاريخك الائتماني.",
      },
      {
        en: "Check your report regularly and dispute any inaccuracies with the bureau. Monitoring your credit protects you from errors and fraud.",
        es: "Revisa tu informe con regularidad y disputa cualquier inexactitud con la agencia. Vigilar tu crédito te protege de errores y fraudes.",
        ar: "راجع تقريرك بانتظام واعترض على أي معلومات غير دقيقة لدى الوكالة. مراقبة ائتمانك تحميك من الأخطاء والاحتيال.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Dispute", es: "Disputa", ar: "اعتراض" },
        def: {
          en: "A formal request to a bureau to correct an error on your report.",
          es: "Una solicitud formal a una agencia para corregir un error en tu informe.",
          ar: "طلب رسمي إلى الوكالة لتصحيح خطأ في تقريرك.",
        },
      },
      {
        term: { en: "Autopay", es: "Pago automático", ar: "الدفع التلقائي" },
        def: {
          en: "Setting bills to pay automatically so you never miss a due date.",
          es: "Programar las cuentas para que se paguen solas y nunca falte un pago.",
          ar: "ضبط الفواتير لتُدفع تلقائياً حتى لا يفوتك موعد استحقاق.",
        },
      },
    ],
    whyItMatters: {
      en: "Many down-payment-assistance programs require a score around 620–640 — steady habits get you there.",
      es: "Muchos programas de ayuda para el pago inicial requieren un puntaje cercano a 620–640; los hábitos constantes te llevan ahí.",
      ar: "تتطلّب كثير من برامج المساعدة في الدفعة الأولى درجة قرابة 620–640 - والعادات الثابتة توصلك إلى هناك.",
    },
  },
];

/** Lessons in display order for a given Day 1 section. */
export function lessonsForSection(section: Lesson["section"]): Lesson[] {
  return DAY1_LESSONS.filter((l) => l.section === section);
}
