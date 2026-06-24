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
  calculator?:
    | "budget"
    | "affordability"
    | "budget-planner"
    | "credit-simulator"
    | "savings-goal"
    | "debt-payoff"
    | "mortgage"
    | "credit-utilization"
    | "rent-vs-buy";
  /** Named hands-on activity widget rendered inside the lesson. */
  activity?:
    | "expense-classifier"
    | "sample-credit-report"
    | "loan-estimate"
    | "inspection-checklist"
    | "maintenance-planner"
    | "loan-matcher";
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

  {
    id: "budgeting-saving-goal",
    section: "budgeting",
    calculator: "savings-goal",
    title: {
      en: "Saving for Your Home",
      es: "Ahorrar para tu casa",
      ar: "الادّخار لمنزلك",
    },
    body: [
      {
        en: "Buying a home has upfront costs worth planning for: a down payment (usually 3.5%–20% of the price), closing costs (about 1%–6% — appraisal, title, recording, loan fees), and earnest money (1%–3%, a deposit that shows you're serious and counts toward your purchase).",
        es: "Comprar casa tiene costos iniciales que conviene planear: el pago inicial (normalmente 3.5%–20% del precio), los costos de cierre (cerca de 1%–6%: avalúo, título, registro, comisiones del préstamo) y el depósito de buena fe (1%–3%, que muestra seriedad y cuenta para tu compra).",
        ar: "لشراء منزل تكاليف أولية تستحق التخطيط: دفعة أولى (عادةً 3.5%–20% من السعر)، وتكاليف إتمام (نحو 1%–6%: التقييم، الملكية، التسجيل، رسوم القرض)، والعربون (1%–3%، وديعة تُظهر جدّيتك وتُحتسب من ثمن شرائك).",
      },
      {
        en: "Build your savings in the right order. First, a small emergency fund — even $1,000 — so a surprise doesn't wipe out your progress or your new home. Then aim for three to six months of expenses, and pour the rest into your down-payment goal.",
        es: "Ahorra en el orden correcto. Primero, un pequeño fondo de emergencia —aunque sea $1,000— para que una sorpresa no borre tu progreso ni tu nueva casa. Luego apunta a tres a seis meses de gastos y vuelca el resto a tu meta de pago inicial.",
        ar: "ابنِ مدّخراتك بالترتيب الصحيح. أولاً، صندوق طوارئ صغير - حتى 1,000 دولار - حتى لا تمحو مفاجأةٌ تقدّمك أو منزلك الجديد. ثم استهدف نفقات ثلاثة إلى ستة أشهر، ووجّه الباقي إلى هدف دفعتك الأولى.",
      },
      {
        en: "Make your goal concrete and you're far likelier to hit it. Pick a target number, a monthly amount, and a date — then automate it. The planner below does the math; remember down-payment assistance can shrink the number you actually need.",
        es: "Haz tu meta concreta y será mucho más probable lograrla. Elige un número objetivo, un monto mensual y una fecha, y luego automatízalo. La calculadora de abajo hace las cuentas; recuerda que la ayuda puede reducir lo que realmente necesitas.",
        ar: "اجعل هدفك ملموساً وستزيد فرصتك في تحقيقه كثيراً. اختر رقماً مستهدفاً ومبلغاً شهرياً وتاريخاً، ثم أتمته. الحاسبة أدناه تتولّى الحساب؛ وتذكّر أن الدعم قد يُقلّل المبلغ الذي تحتاجه فعلاً.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Closing costs", es: "Costos de cierre", ar: "تكاليف الإتمام" },
        def: {
          en: "Fees to finalize the purchase — about 1%–6% of the price, on top of the down payment.",
          es: "Cargos para finalizar la compra: cerca de 1%–6% del precio, además del pago inicial.",
          ar: "رسوم إنهاء الشراء - نحو 1%–6% من السعر، إضافةً إلى الدفعة الأولى.",
        },
      },
      {
        term: { en: "Emergency fund", es: "Fondo de emergencia", ar: "صندوق الطوارئ" },
        def: {
          en: "Savings set aside for surprises, so an emergency doesn't become debt.",
          es: "Ahorro apartado para imprevistos, para que una emergencia no se vuelva deuda.",
          ar: "مدّخرات مخصّصة للمفاجآت، حتى لا تتحوّل الطارئة إلى دين.",
        },
      },
    ],
    whyItMatters: {
      en: "A clear, automated savings goal — with an emergency cushion first — is what turns 'someday' into a closing date.",
      es: "Una meta de ahorro clara y automática —con un colchón de emergencia primero— convierte el 'algún día' en una fecha de cierre.",
      ar: "هدف ادّخار واضح ومؤتمت - مع وسادة طوارئ أولاً - هو ما يحوّل «يوماً ما» إلى موعد إتمام.",
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
    activity: "sample-credit-report",
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
        en: "Just as important is what's NOT in it: your criminal background, medical information, day-to-day buying habits or transaction data, and your bank account balances are not included. Neither are your income, race, or religion — and none of those can be used to judge your credit.",
        es: "Igual de importante es lo que NO contiene: tu antecedente penal, información médica, hábitos de compra diarios o datos de transacciones, y los saldos de tu cuenta bancaria no se incluyen. Tampoco tus ingresos, raza o religión, y nada de eso puede usarse para juzgar tu crédito.",
        ar: "لا يقلّ أهمية ما لا يتضمّنه: سجلّك الجنائي، ومعلوماتك الطبية، وعاداتك الشرائية اليومية أو بيانات معاملاتك، وأرصدة حسابك البنكي ليست مُدرَجة. وكذلك دخلك أو عِرقك أو دينك - ولا يجوز استخدام أيٍّ من ذلك للحكم على ائتمانك.",
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
    calculator: "credit-utilization",
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
  {
    id: "credit-fix-disputes",
    section: "credit-basics",
    title: {
      en: "Fixing Errors & Building Credit",
      es: "Corregir errores y construir crédito",
      ar: "تصحيح الأخطاء وبناء الائتمان",
    },
    body: [
      {
        en: "Credit reports have mistakes more often than people think — a wrong balance, an account that isn't yours, a paid debt still showing as owed. The Fair Credit Reporting Act gives you the right to dispute them, and fixing an error can raise your score quickly.",
        es: "Los informes de crédito tienen errores más seguido de lo que la gente cree: un saldo equivocado, una cuenta que no es tuya, una deuda pagada que aún aparece. La Ley de Informe Justo de Crédito te da derecho a disputarlos, y corregir un error puede subir tu puntaje rápido.",
        ar: "تحتوي تقارير الائتمان على أخطاء أكثر مما يظن الناس - رصيد خاطئ، أو حساب ليس لك، أو دَين مسدَّد لا يزال يظهر مستحقاً. ويمنحك قانون التقارير الائتمانية العادلة الحق في الاعتراض عليها، وتصحيح خطأ قد يرفع درجتك بسرعة.",
      },
      {
        en: "To dispute, get your free report at AnnualCreditReport.com, circle anything wrong, and file the dispute online with each bureau (Equifax, Experian, TransUnion). They generally must investigate within about 30 days. Keep copies of everything you send.",
        es: "Para disputar, obtén tu informe gratis en AnnualCreditReport.com, marca lo que esté mal y presenta la disputa en línea con cada agencia (Equifax, Experian, TransUnion). Por lo general deben investigar en unos 30 días. Guarda copias de todo lo que envíes.",
        ar: "للاعتراض، احصل على تقريرك المجاني من AnnualCreditReport.com، وضع دائرة حول أي خطأ، وقدّم الاعتراض إلكترونياً لدى كل وكالة (إكويفاكس، إكسبيريان، ترانس يونيون). وعليها عادةً التحقيق خلال نحو 30 يوماً. واحتفظ بنسخ من كل ما ترسله.",
      },
      {
        en: "No credit yet? You can build it. A secured credit card (backed by a small deposit), becoming an authorized user on a trusted family member's card, or a credit-builder loan all create a positive history. Use a little, pay it in full and on time, every month.",
        es: "¿Sin crédito aún? Puedes construirlo. Una tarjeta asegurada (respaldada por un pequeño depósito), ser usuario autorizado en la tarjeta de un familiar de confianza, o un préstamo para construir crédito crean un historial positivo. Usa poco, paga el total y a tiempo, cada mes.",
        ar: "لا ائتمان بعد؟ يمكنك بناؤه. بطاقة مضمونة (مدعومة بوديعة صغيرة)، أو أن تصبح مستخدماً مُصرّحاً على بطاقة فرد موثوق من العائلة، أو قرض بناء ائتمان - كلها تُنشئ سجلاً إيجابياً. استخدم القليل، وسدّد بالكامل وفي الموعد، كل شهر.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Dispute", es: "Disputa", ar: "اعتراض" },
        def: {
          en: "A formal request asking a bureau to correct or remove a reporting error.",
          es: "Una solicitud formal pidiendo a una agencia corregir o quitar un error.",
          ar: "طلب رسمي يطلب من الوكالة تصحيح خطأ في التقرير أو إزالته.",
        },
      },
      {
        term: { en: "Secured credit card", es: "Tarjeta asegurada", ar: "بطاقة ائتمان مضمونة" },
        def: {
          en: "A starter card backed by a refundable deposit, used to build credit safely.",
          es: "Una tarjeta inicial respaldada por un depósito reembolsable, para construir crédito con seguridad.",
          ar: "بطاقة مبتدئة مدعومة بوديعة قابلة للاسترداد، تُستخدم لبناء الائتمان بأمان.",
        },
      },
    ],
    whyItMatters: {
      en: "Whether you're cleaning up errors or starting from zero, you have more control over your score than you think.",
      es: "Ya sea corrigiendo errores o empezando de cero, tienes más control sobre tu puntaje del que crees.",
      ar: "سواء كنت تصحّح أخطاءً أو تبدأ من الصفر، لديك تحكّم في درجتك أكثر مما تظن.",
    },
    check: {
      question: {
        en: "Quick check: a good first card for someone with no credit history is…",
        es: "Repaso rápido: una buena primera tarjeta para alguien sin historial es…",
        ar: "مراجعة سريعة: بطاقة أولى جيدة لمن لا تاريخ ائتماني له هي…",
      },
      options: [
        {
          en: "A secured credit card",
          es: "Una tarjeta de crédito asegurada",
          ar: "بطاقة ائتمان مضمونة",
        },
        {
          en: "A high-limit store card",
          es: "Una tarjeta de tienda de límite alto",
          ar: "بطاقة متجر بحدّ مرتفع",
        },
        {
          en: "A payday loan",
          es: "Un préstamo de día de pago",
          ar: "قرض حتى يوم الراتب",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Yes — a secured card builds history safely with a small refundable deposit.",
        es: "Sí: una tarjeta asegurada construye historial con seguridad usando un pequeño depósito reembolsable.",
        ar: "نعم - البطاقة المضمونة تبني السجلّ بأمان بوديعة صغيرة قابلة للاسترداد.",
      },
    },
  },
  {
    id: "credit-debt-payoff",
    section: "credit-basics",
    calculator: "debt-payoff",
    title: {
      en: "Tackling Debt Before You Buy",
      es: "Atacar la deuda antes de comprar",
      ar: "معالجة الديون قبل الشراء",
    },
    body: [
      {
        en: "Paying down debt does double duty: it lowers your credit utilization (helping your score) and your debt-to-income ratio (helping you qualify). Lenders add up your monthly debts against your income — the less you owe, the more home you can afford.",
        es: "Pagar deudas hace doble trabajo: baja tu utilización de crédito (ayuda a tu puntaje) y tu relación deuda-ingreso (ayuda a calificar). Los prestamistas suman tus deudas mensuales contra tu ingreso: cuanto menos debes, más casa puedes pagar.",
        ar: "سداد الديون يؤدي مهمتين: يخفّض معدّل استخدامك للائتمان (يُفيد درجتك) ونسبة دينك إلى دخلك (يساعدك على التأهّل). يجمع المُقرضون ديونك الشهرية مقابل دخلك - وكلما قلّ ما تدين به، زاد المنزل الذي تتحمّله.",
      },
      {
        en: "Two proven strategies. The avalanche method attacks the highest-interest debt first — mathematically the cheapest. The snowball method clears the smallest balance first — the quick win keeps you motivated. Pick the one you'll actually stick with.",
        es: "Dos estrategias probadas. El método avalancha ataca primero la deuda de mayor interés —lo más barato en matemáticas—. El método bola de nieve liquida primero el saldo más pequeño —la victoria rápida te mantiene motivado—. Elige el que de verdad mantendrás.",
        ar: "استراتيجيتان مُثبتتان. طريقة الانهيار الجليدي تهاجم أعلى الديون فائدةً أولاً - وهي الأرخص حسابياً. وطريقة كرة الثلج تُصفّي أصغر رصيد أولاً - والانتصار السريع يُبقيك متحمساً. اختر ما ستلتزم به فعلاً.",
      },
      {
        en: "Use the calculator below to see how long your debt takes to clear — and how adding even $25 a month shrinks both the time and the interest. Then aim to avoid new debt while you're saving for your home.",
        es: "Usa la calculadora de abajo para ver cuánto tarda en saldarse tu deuda, y cómo agregar aunque sea $25 al mes reduce el tiempo y el interés. Luego evita nuevas deudas mientras ahorras para tu casa.",
        ar: "استخدم الحاسبة أدناه لترى كم يستغرق سداد دينك - وكيف تُقلّص إضافة 25 دولاراً شهرياً الوقت والفائدة معاً. ثم احرص على تجنّب ديون جديدة بينما تدّخر لمنزلك.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Avalanche vs. snowball", es: "Avalancha vs. bola de nieve", ar: "الانهيار مقابل كرة الثلج" },
        def: {
          en: "Two payoff orders: highest-interest first (cheapest), or smallest balance first (most motivating).",
          es: "Dos órdenes de pago: mayor interés primero (más barato) o saldo más pequeño primero (más motivador).",
          ar: "ترتيبان للسداد: الأعلى فائدةً أولاً (الأرخص)، أو الأصغر رصيداً أولاً (الأكثر تحفيزاً).",
        },
      },
      {
        term: { en: "Debt-to-income (DTI)", es: "Deuda-ingreso (DTI)", ar: "الدين إلى الدخل" },
        def: {
          en: "Your monthly debt payments divided by income — lenders want it low to approve a mortgage.",
          es: "Tus pagos mensuales de deudas divididos por tu ingreso; los prestamistas lo quieren bajo.",
          ar: "أقساط ديونك الشهرية مقسومة على دخلك - يريده المُقرضون منخفضاً للموافقة على الرهن.",
        },
      },
    ],
    whyItMatters: {
      en: "Every dollar of debt you clear before applying makes your mortgage easier to get and cheaper to carry.",
      es: "Cada dólar de deuda que liquidas antes de solicitar hace tu hipoteca más fácil de obtener y más barata.",
      ar: "كل دولار من الدين تسدّده قبل التقديم يجعل رهنك أسهل في الحصول عليه وأرخص في تحمّله.",
    },
  },
  {
    id: "budgeting-goals-help",
    section: "budgeting",
    title: {
      en: "Set Goals — and Get Help",
      es: "Fija metas y busca ayuda",
      ar: "حدّد أهدافاً واطلب المساعدة",
    },
    body: [
      {
        en: "A spending plan isn't about restriction — it's about reaching goals. A good plan helps you prepare for large expenses, cushion surprise expenses, encourage saving, spot wasteful spending, and actually accomplish what matters to you, like a home. Name your goal, attach a number and a date, and let your budget point every dollar toward it.",
        es: "Un plan de gastos no se trata de restringir, sino de alcanzar metas. Un buen plan te ayuda a prepararte para gastos grandes, amortiguar gastos sorpresa, fomentar el ahorro, detectar gastos inútiles y lograr lo que te importa, como una casa. Nombra tu meta, ponle un número y una fecha, y deja que tu presupuesto dirija cada dólar hacia ella.",
        ar: "خطة الإنفاق ليست عن الحرمان - بل عن بلوغ الأهداف. الخطة الجيدة تساعدك على الاستعداد للنفقات الكبيرة، وتخفيف النفقات المفاجئة، وتشجيع الادخار، واكتشاف الإنفاق المُهدِر، وتحقيق ما يهمّك فعلاً، كالمنزل. سمِّ هدفك، وأرفق به رقماً وتاريخاً، ودع ميزانيتك توجّه كل دولار نحوه.",
      },
      {
        en: "Make goals SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. 'Save money' is a wish; 'save $7,000 for a down payment in 24 months by setting aside $295 a month' is a plan you can actually follow and check your progress against.",
        es: "Haz metas SMART: específicas, medibles, alcanzables, relevantes y con plazo. 'Ahorrar dinero' es un deseo; 'ahorrar $7,000 para el pago inicial en 24 meses apartando $295 al mes' es un plan que puedes seguir y medir.",
        ar: "اجعل أهدافك SMART: محددة وقابلة للقياس وقابلة للتحقيق وذات صلة ومحدّدة بوقت. 'ادّخار المال' أمنية؛ أما 'ادّخار 7,000 دولار للدفعة الأولى خلال 24 شهراً بتخصيص 295 دولاراً شهرياً' فخطة يمكنك اتّباعها وقياس تقدّمك بها.",
      },
      {
        en: "And you don't have to do it alone. Benjamin Rose offers free financial counseling and coaching, financial education workshops, matched savings programs, a benefits enrollment center, free tax preparation, and the homebuyer education you're in right now — plus help finding down-payment assistance. Call 216-791-8000 to be connected to a counselor.",
        es: "Y no tienes que hacerlo solo. Benjamin Rose ofrece asesoría y coaching financiero gratis, talleres de educación financiera, programas de ahorro con contrapartida, un centro de inscripción a beneficios, preparación de impuestos gratuita y la educación para compradores que tomas ahora, además de ayuda para encontrar asistencia para el pago inicial. Llama al 216-791-8000 para conectarte con un asesor.",
        ar: "ولست مضطراً لفعل ذلك وحدك. تقدّم Benjamin Rose استشارة وتدريباً مالياً مجانياً، وورش تثقيف مالي، وبرامج ادخار مُطابَقة، ومركز تسجيل في الإعانات، وإعداد ضرائب مجانياً، وتعليم مشتري المنازل الذي تتلقاه الآن - إضافةً إلى المساعدة في إيجاد دعم الدفعة الأولى. اتصل على 216-791-8000 للتواصل مع مستشار.",
      },
    ],
    keyTerms: [
      {
        term: { en: "SMART goal", es: "Meta SMART", ar: "هدف SMART" },
        def: {
          en: "A goal that is Specific, Measurable, Achievable, Relevant, and Time-bound.",
          es: "Una meta específica, medible, alcanzable, relevante y con plazo.",
          ar: "هدف محدّد وقابل للقياس وقابل للتحقيق وذو صلة ومحدّد بوقت.",
        },
      },
      {
        term: { en: "Financial counseling", es: "Asesoría financiera", ar: "الاستشارة المالية" },
        def: {
          en: "Free, one-on-one help from Benjamin Rose to build a plan and reach your goals.",
          es: "Ayuda gratuita y personal de Benjamin Rose para crear un plan y alcanzar tus metas.",
          ar: "مساعدة مجانية فردية من Benjamin Rose لوضع خطة وبلوغ أهدافك.",
        },
      },
    ],
    whyItMatters: {
      en: "A clear, written goal — plus free expert help — is what turns wanting a home into a plan that gets you one.",
      es: "Una meta clara y escrita, más ayuda experta gratuita, convierte el querer una casa en un plan que te la consigue.",
      ar: "هدف واضح مكتوب - مع مساعدة خبيرة مجانية - هو ما يحوّل الرغبة في منزل إلى خطة توصلك إليه.",
    },
    check: {
      question: {
        en: "Quick check: which is a SMART savings goal?",
        es: "Repaso rápido: ¿cuál es una meta de ahorro SMART?",
        ar: "مراجعة سريعة: أيٌّ هدف ادخار يُعدّ SMART؟",
      },
      options: [
        {
          en: "Save $7,000 in 24 months by setting aside $295/month",
          es: "Ahorrar $7,000 en 24 meses apartando $295 al mes",
          ar: "ادّخار 7,000 دولار خلال 24 شهراً بتخصيص 295 شهرياً",
        },
        {
          en: "Save more money someday",
          es: "Ahorrar más dinero algún día",
          ar: "ادّخار المزيد يوماً ما",
        },
        {
          en: "Spend less, generally",
          es: "Gastar menos, en general",
          ar: "الإنفاق أقل عموماً",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Right — it's specific, measurable, and time-bound, so you can track it.",
        es: "Correcto: es específica, medible y con plazo, así puedes seguirla.",
        ar: "صحيح - فهو محدد وقابل للقياس ومحدّد بوقت، فيمكنك تتبّعه.",
      },
    },
  },
];

/** Lessons in display order for a given Day 1 section. */
export function lessonsForSection(section: Lesson["section"]): Lesson[] {
  return DAY1_LESSONS.filter((l) => l.section === section);
}
