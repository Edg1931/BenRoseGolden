import type { Localized } from "./content";

/**
 * CLIENT-SAFE translations of day-test questions and options, keyed by question
 * id. Contains NO answer keys — scoring stays server-side in lib/learn/quiz.ts.
 * Option arrays MUST stay in the same order as the source banks so the chosen
 * index still maps to the right answer.
 */
export interface QuizI18n {
  question: Localized;
  options: Localized[];
}

export const QUIZ_I18N: Record<string, QuizI18n> = {
  // ── Day 1: budgeting ──────────────────────────────────────────────────────
  "budgeting-1": {
    question: {
      en: "A monthly budget is best described as a plan that…",
      es: "Un presupuesto mensual se describe mejor como un plan que…",
      ar: "تُوصَف الميزانية الشهرية على أفضل وجه بأنها خطة…",
    },
    options: [
      { en: "Tracks only your debts", es: "Solo registra tus deudas", ar: "تتعقّب ديونك فقط" },
      {
        en: "Gives every dollar of income a job across spending, saving, and debt",
        es: "Le da una tarea a cada dólar de ingreso entre gastos, ahorros y deudas",
        ar: "تُعطي كل دولار من الدخل مهمة بين الإنفاق والادخار وسداد الديون",
      },
      {
        en: "Is only needed when you fall behind on bills",
        es: "Solo se necesita cuando te atrasas en las cuentas",
        ar: "لا تلزم إلا عندما تتأخر عن سداد الفواتير",
      },
      {
        en: "Replaces the need for an emergency fund",
        es: "Reemplaza la necesidad de un fondo de emergencia",
        ar: "تُغني عن الحاجة إلى صندوق طوارئ",
      },
    ],
  },
  "budgeting-2": {
    question: {
      en: "Which expense is a FIXED cost in most household budgets?",
      es: "¿Qué gasto es un costo FIJO en la mayoría de los presupuestos del hogar?",
      ar: "أي مصروف يُعدّ تكلفة ثابتة في معظم ميزانيات الأسرة؟",
    },
    options: [
      { en: "Groceries", es: "Comida del supermercado", ar: "مشتريات البقالة" },
      { en: "Rent or mortgage payment", es: "Pago de alquiler o hipoteca", ar: "دفعة الإيجار أو الرهن العقاري" },
      { en: "Dining out", es: "Comer fuera", ar: "تناول الطعام في الخارج" },
      { en: "Gas for the car", es: "Gasolina para el auto", ar: "وقود السيارة" },
    ],
  },
  "budgeting-3": {
    question: {
      en: "A common guideline for keeping housing affordable is to spend no more than about…",
      es: "Una guía común para mantener la vivienda accesible es no gastar más de aproximadamente…",
      ar: "من القواعد الشائعة لإبقاء السكن في حدود القدرة المالية ألّا تُنفق أكثر من نحو…",
    },
    options: [
      { en: "10% of gross monthly income on housing", es: "10% del ingreso mensual bruto en vivienda", ar: "10% من الدخل الشهري الإجمالي على السكن" },
      { en: "30% of gross monthly income on housing", es: "30% del ingreso mensual bruto en vivienda", ar: "30% من الدخل الشهري الإجمالي على السكن" },
      { en: "60% of gross monthly income on housing", es: "60% del ingreso mensual bruto en vivienda", ar: "60% من الدخل الشهري الإجمالي على السكن" },
      { en: "There is no guideline", es: "No hay ninguna guía", ar: "لا توجد قاعدة" },
    ],
  },
  "budgeting-4": {
    question: {
      en: "The first step when your expenses are higher than your income is to…",
      es: "El primer paso cuando tus gastos son mayores que tus ingresos es…",
      ar: "الخطوة الأولى عندما تكون مصروفاتك أعلى من دخلك هي…",
    },
    options: [
      { en: "Take out a payday loan", es: "Sacar un préstamo de día de pago", ar: "الحصول على قرض حتى يوم الراتب" },
      { en: "Ignore it until next month", es: "Ignorarlo hasta el próximo mes", ar: "تجاهل الأمر حتى الشهر التالي" },
      {
        en: "Track spending to find and cut non-essential costs",
        es: "Registrar los gastos para encontrar y recortar costos no esenciales",
        ar: "تتبّع الإنفاق لاكتشاف التكاليف غير الضرورية وتقليصها",
      },
      { en: "Stop paying your rent", es: "Dejar de pagar el alquiler", ar: "التوقف عن دفع الإيجار" },
    ],
  },

  // ── Day 1: credit ─────────────────────────────────────────────────────────
  "credit-basics-1": {
    question: {
      en: "Which factor has the LARGEST impact on a typical credit score?",
      es: "¿Qué factor tiene el MAYOR impacto en un puntaje de crédito típico?",
      ar: "أي عامل له الأثر الأكبر في الدرجة الائتمانية المعتادة؟",
    },
    options: [
      { en: "Payment history", es: "Historial de pagos", ar: "سجلّ المدفوعات" },
      { en: "Number of credit cards", es: "Cantidad de tarjetas de crédito", ar: "عدد البطاقات الائتمانية" },
      { en: "Your income", es: "Tus ingresos", ar: "دخلك" },
      { en: "Your age", es: "Tu edad", ar: "عمرك" },
    ],
  },
  "credit-basics-2": {
    question: {
      en: "Credit utilization refers to…",
      es: "El uso del crédito se refiere a…",
      ar: "يشير معدّل استخدام الائتمان إلى…",
    },
    options: [
      { en: "How long you've had credit", es: "Cuánto tiempo has tenido crédito", ar: "مدّة امتلاكك للائتمان" },
      {
        en: "The share of your available revolving credit you're using",
        es: "La parte de tu crédito rotativo disponible que estás usando",
        ar: "نسبة ما تستخدمه من ائتمانك المتجدّد المتاح",
      },
      { en: "How many times you check your score", es: "Cuántas veces revisas tu puntaje", ar: "عدد مرات اطّلاعك على درجتك" },
      { en: "The interest rate on your loans", es: "La tasa de interés de tus préstamos", ar: "سعر الفائدة على قروضك" },
    ],
  },
  "credit-basics-3": {
    question: {
      en: "How often can you get a free copy of your credit report from each major bureau?",
      es: "¿Con qué frecuencia puedes obtener una copia gratis de tu informe de crédito de cada agencia principal?",
      ar: "كم مرة يمكنك الحصول على نسخة مجانية من تقرير ائتمانك من كل وكالة رئيسية؟",
    },
    options: [
      { en: "Never", es: "Nunca", ar: "أبداً" },
      { en: "Only if you pay", es: "Solo si pagas", ar: "فقط إذا دفعت" },
      { en: "At least once a year", es: "Al menos una vez al año", ar: "مرة واحدة سنوياً على الأقل" },
      { en: "Once every five years", es: "Una vez cada cinco años", ar: "مرة كل خمس سنوات" },
    ],
  },
  "credit-basics-4": {
    question: {
      en: "The best way to keep utilization low and protect your score is to…",
      es: "La mejor manera de mantener bajo el uso del crédito y proteger tu puntaje es…",
      ar: "أفضل طريقة لإبقاء معدّل الاستخدام منخفضاً وحماية درجتك هي…",
    },
    options: [
      { en: "Close old accounts", es: "Cerrar las cuentas antiguas", ar: "إغلاق الحسابات القديمة" },
      { en: "Max out one card and pay the others", es: "Llenar una tarjeta al máximo y pagar las demás", ar: "استنفاد بطاقة واحدة بالكامل ودفع البقية" },
      {
        en: "Keep balances well below your limits and pay on time",
        es: "Mantener los saldos muy por debajo de tus límites y pagar a tiempo",
        ar: "إبقاء الأرصدة أدنى بكثير من حدودك والدفع في الموعد",
      },
      { en: "Apply for several new cards at once", es: "Solicitar varias tarjetas nuevas a la vez", ar: "التقدّم بطلب عدة بطاقات جديدة دفعة واحدة" },
    ],
  },

  // ── Day 2: mortgages ──────────────────────────────────────────────────────
  "mortgages-1": {
    question: {
      en: "In a fixed-rate mortgage, the interest rate…",
      es: "En una hipoteca de tasa fija, la tasa de interés…",
      ar: "في الرهن العقاري ذي الفائدة الثابتة، فإن سعر الفائدة…",
    },
    options: [
      { en: "Changes every year", es: "Cambia cada año", ar: "يتغير كل عام" },
      { en: "Stays the same for the life of the loan", es: "Se mantiene igual durante toda la vida del préstamo", ar: "يبقى كما هو طوال مدة القرض" },
      { en: "Is set by the buyer", es: "La fija el comprador", ar: "يحدده المشتري" },
      { en: "Only applies for the first month", es: "Solo aplica el primer mes", ar: "يسري في الشهر الأول فقط" },
    ],
  },
  "mortgages-2": {
    question: {
      en: "Private mortgage insurance (PMI) is typically required when a buyer…",
      es: "El seguro hipotecario privado (PMI) normalmente se exige cuando el comprador…",
      ar: "يُطلب تأمين الرهن الخاص (PMI) عادةً عندما يقوم المشتري بـ…",
    },
    options: [
      { en: "Puts down less than 20%", es: "Da menos del 20% de pago inicial", ar: "دفع أقل من 20% دفعة أولى" },
      { en: "Has a perfect credit score", es: "Tiene un puntaje de crédito perfecto", ar: "امتلاك درجة ائتمانية مثالية" },
      { en: "Buys a home in cash", es: "Compra la casa en efectivo", ar: "شراء منزل نقداً" },
      { en: "Uses a 15-year loan", es: "Usa un préstamo a 15 años", ar: "استخدام قرض لمدة 15 عاماً" },
    ],
  },
  "mortgages-3": {
    question: {
      en: "A mortgage pre-approval is valuable because it…",
      es: "La preaprobación hipotecaria es valiosa porque…",
      ar: "الموافقة المبدئية على الرهن قيّمة لأنها…",
    },
    options: [
      { en: "Guarantees the lowest rate forever", es: "Garantiza la tasa más baja para siempre", ar: "تضمن أدنى سعر فائدة إلى الأبد" },
      {
        en: "Shows sellers you're a serious, qualified buyer",
        es: "Muestra a los vendedores que eres un comprador serio y calificado",
        ar: "تُظهر للبائعين أنك مشترٍ جاد ومؤهل",
      },
      { en: "Is required to attend an open house", es: "Se exige para visitar una casa abierta", ar: "مطلوبة لحضور جولة منزل مفتوح" },
      { en: "Replaces the home inspection", es: "Reemplaza la inspección de la casa", ar: "تحل محل فحص المنزل" },
    ],
  },
  "mortgages-4": {
    question: {
      en: "Which of these is part of a typical monthly mortgage payment (PITI)?",
      es: "¿Qué forma parte de un pago hipotecario mensual típico (PITI)?",
      ar: "أيٌّ مما يلي جزء من دفعة الرهن الشهرية المعتادة (PITI)؟",
    },
    options: [
      {
        en: "Principal, interest, taxes, and insurance",
        es: "Principal, interés, impuestos y seguro",
        ar: "أصل القرض والفائدة والضرائب والتأمين",
      },
      { en: "Only principal and interest", es: "Solo principal e interés", ar: "أصل القرض والفائدة فقط" },
      { en: "Utilities and internet", es: "Servicios e internet", ar: "الخدمات والإنترنت" },
      { en: "Real-estate agent commission", es: "La comisión del agente inmobiliario", ar: "عمولة الوكيل العقاري" },
    ],
  },

  // ── Day 3: shopping + closing ─────────────────────────────────────────────
  "shopping-1": {
    question: {
      en: "A buyer's agent primarily represents…",
      es: "El agente del comprador representa principalmente…",
      ar: "وكيل المشتري يمثّل في المقام الأول…",
    },
    options: [
      { en: "The seller's interests", es: "Los intereses del vendedor", ar: "مصالح البائع" },
      { en: "The lender's interests", es: "Los intereses del prestamista", ar: "مصالح المُقرض" },
      { en: "The buyer's interests in the transaction", es: "Los intereses del comprador en la transacción", ar: "مصالح المشتري في الصفقة" },
      { en: "The county tax office", es: "La oficina de impuestos del condado", ar: "مكتب ضرائب المقاطعة" },
    ],
  },
  "shopping-2": {
    question: {
      en: "Why is a professional home inspection important before buying?",
      es: "¿Por qué es importante una inspección profesional antes de comprar?",
      ar: "لماذا يُعدّ فحص المنزل الاحترافي مهماً قبل الشراء؟",
    },
    options: [
      { en: "It sets the sale price", es: "Fija el precio de venta", ar: "يحدد سعر البيع" },
      {
        en: "It identifies condition issues and needed repairs",
        es: "Identifica problemas de estado y reparaciones necesarias",
        ar: "يكشف مشاكل الحالة والإصلاحات اللازمة",
      },
      { en: "It is required to get a library card", es: "Se exige para sacar una tarjeta de biblioteca", ar: "مطلوب للحصول على بطاقة مكتبة" },
      { en: "It replaces homeowners insurance", es: "Reemplaza el seguro de vivienda", ar: "يحل محل تأمين المنزل" },
    ],
  },
  "shopping-3": {
    question: {
      en: "An earnest money deposit is…",
      es: "El depósito de buena fe es…",
      ar: "العربون هو…",
    },
    options: [
      { en: "A fee paid to the inspector", es: "Un pago al inspector", ar: "رسم يُدفع للفاحص" },
      {
        en: "A good-faith deposit showing you're serious about an offer",
        es: "Un depósito de buena fe que muestra que tu oferta va en serio",
        ar: "وديعة حسن نية تُظهر جدّيتك في العرض",
      },
      { en: "The same as your down payment tip", es: "Lo mismo que una propina del pago inicial", ar: "نفسه إكرامية الدفعة الأولى" },
      { en: "A penalty for viewing too many homes", es: "Una multa por ver demasiadas casas", ar: "غرامة على مشاهدة منازل كثيرة" },
    ],
  },
  "closing-1": {
    question: {
      en: "A Closing Disclosure must be provided to the buyer at least…",
      es: "La Divulgación de Cierre debe entregarse al comprador al menos…",
      ar: "يجب تسليم إفصاح الإتمام للمشتري قبل…",
    },
    options: [
      { en: "On the day of closing", es: "El día del cierre", ar: "في يوم الإتمام" },
      { en: "Three business days before closing", es: "Tres días hábiles antes del cierre", ar: "ثلاثة أيام عمل من الإتمام" },
      { en: "One year before closing", es: "Un año antes del cierre", ar: "سنة من الإتمام" },
      { en: "It is optional", es: "Es opcional", ar: "هو اختياري" },
    ],
  },
  "closing-2": {
    question: {
      en: "Closing costs typically include…",
      es: "Los costos de cierre normalmente incluyen…",
      ar: "تشمل تكاليف الإتمام عادةً…",
    },
    options: [
      { en: "Only the down payment", es: "Solo el pago inicial", ar: "الدفعة الأولى فقط" },
      {
        en: "Lender fees, title charges, and prepaid taxes/insurance",
        es: "Cargos del prestamista, del título e impuestos/seguros prepagados",
        ar: "رسوم المُقرض ورسوم الملكية والضرائب/التأمين المدفوعة مقدماً",
      },
      { en: "Your monthly utility bills", es: "Tus facturas mensuales de servicios", ar: "فواتير خدماتك الشهرية" },
      { en: "Furniture for the new home", es: "Muebles para la casa nueva", ar: "أثاث المنزل الجديد" },
    ],
  },
  "closing-3": {
    question: {
      en: "At the final walkthrough before closing, the buyer should…",
      es: "En el recorrido final antes del cierre, el comprador debe…",
      ar: "في الجولة الأخيرة قبل الإتمام، على المشتري أن…",
    },
    options: [
      { en: "Sign the loan immediately without looking", es: "Firmar el préstamo de inmediato sin mirar", ar: "يوقّع القرض فوراً دون نظر" },
      {
        en: "Confirm the home's condition and agreed repairs are done",
        es: "Confirmar el estado de la casa y que las reparaciones acordadas estén hechas",
        ar: "يتأكد من حالة المنزل وإتمام الإصلاحات المتفق عليها",
      },
      { en: "Negotiate a brand-new price", es: "Negociar un precio totalmente nuevo", ar: "يتفاوض على سعر جديد كلياً" },
      { en: "Skip it to save time", es: "Saltársela para ahorrar tiempo", ar: "يتخطاها لتوفير الوقت" },
    ],
  },

  // ── Day 4: insurance & maintenance ────────────────────────────────────────
  "day4-1": {
    question: {
      en: "Your lender requires homeowner's insurance because…",
      es: "Tu prestamista exige el seguro de vivienda porque…",
      ar: "يشترط مُقرضك تأمين المنزل لأن…",
    },
    options: [
      { en: "It makes the house look nicer", es: "Hace que la casa se vea mejor", ar: "يجعل المنزل يبدو أجمل" },
      {
        en: "The home is the loan's collateral, so it must be protected",
        es: "La casa es la garantía del préstamo y debe protegerse",
        ar: "المنزل هو ضمانة القرض ويجب حمايته",
      },
      { en: "It replaces the home inspection", es: "Reemplaza la inspección", ar: "يحل محل فحص المنزل" },
      { en: "It is optional in Ohio", es: "Es opcional en Ohio", ar: "هو اختياري في أوهايو" },
    ],
  },
  "day4-2": {
    question: {
      en: "Flood damage to your home is typically…",
      es: "El daño por inundación en tu casa normalmente está…",
      ar: "أضرار الفيضان في منزلك عادةً…",
    },
    options: [
      { en: "Covered by every standard policy", es: "Cubierto por toda póliza estándar", ar: "تغطيها كل وثيقة قياسية" },
      {
        en: "Only covered with separate flood coverage",
        es: "Cubierto solo con una cobertura de inundación aparte",
        ar: "لا تُغطى إلا بتغطية فيضان منفصلة",
      },
      { en: "Covered if you have a mortgage", es: "Cubierto si tienes hipoteca", ar: "تُغطى إذا كان لديك رهن" },
      { en: "Never insurable", es: "Imposible de asegurar", ar: "غير قابلة للتأمين أبداً" },
    ],
  },
  "day4-3": {
    question: {
      en: "Choosing a higher insurance deductible generally means…",
      es: "Elegir un deducible más alto generalmente significa…",
      ar: "اختيار مبلغ تحمّل أعلى يعني عموماً…",
    },
    options: [
      {
        en: "A lower premium, but more out-of-pocket if you file a claim",
        es: "Una prima más baja, pero más gasto de bolsillo si haces un reclamo",
        ar: "قسطاً أقل، لكن دفعاً أكبر من جيبك عند تقديم مطالبة",
      },
      { en: "A higher premium", es: "Una prima más alta", ar: "قسطاً أعلى" },
      { en: "No change in cost", es: "Ningún cambio en el costo", ar: "لا تغيير في التكلفة" },
      { en: "The lender pays the difference", es: "El prestamista paga la diferencia", ar: "يدفع المُقرض الفرق" },
    ],
  },
  "day4-4": {
    question: {
      en: "Hot/cold spots, pests, mold, or a sudden jump in utility bills are…",
      es: "Zonas frías o calientes, plagas, moho o un salto en las facturas son…",
      ar: "المناطق الحارة/الباردة والآفات والعفن والقفزة المفاجئة في الفواتير هي…",
    },
    options: [
      { en: "Normal — every home has them, ignore them", es: "Normales: toda casa los tiene, ignóralos", ar: "طبيعية - كل منزل فيه ذلك، تجاهلها" },
      {
        en: "Warning signs of fixable problems like insulation gaps or moisture",
        es: "Señales de alerta de problemas reparables como aislamiento o humedad",
        ar: "علامات تحذير لمشاكل قابلة للإصلاح كفجوات العزل أو الرطوبة",
      },
      { en: "Reasons to file an insurance claim immediately", es: "Razones para reclamar al seguro de inmediato", ar: "أسباب لتقديم مطالبة تأمين فوراً" },
      { en: "Only a problem in old homes", es: "Solo un problema de casas viejas", ar: "مشكلة في المنازل القديمة فقط" },
    ],
  },
  // ── Day 1 (new lessons) ──────────────────────────────────────────────────
  "day1-1": {
    question: {
      en: "A good guideline for credit utilization is to keep it…",
      es: "Una buena guía para el uso del crédito es mantenerlo…",
      ar: "من القواعد الجيدة لمعدّل استخدام الائتمان أن تُبقيه…",
    },
    options: [
      { en: "Above 50% of your limits", es: "Por encima del 50% de tus límites", ar: "أعلى من 50% من حدودك" },
      { en: "Under about 30% of your limits", es: "Por debajo de cerca del 30% de tus límites", ar: "أقل من نحو 30% من حدودك" },
      { en: "At exactly 100%", es: "Exactamente en 100%", ar: "عند 100% بالضبط" },
      { en: "It doesn't matter", es: "No importa", ar: "لا يهم" },
    ],
  },
  "day1-2": {
    question: {
      en: "A SMART savings goal is best described as…",
      es: "Una meta de ahorro SMART se describe mejor como…",
      ar: "هدف الادخار SMART يُوصف على أفضل وجه بأنه…",
    },
    options: [
      { en: "'Save more money someday'", es: "'Ahorrar más dinero algún día'", ar: "«ادّخار المزيد يوماً ما»" },
      { en: "Specific, Measurable, Achievable, Relevant, and Time-bound", es: "Específica, medible, alcanzable, relevante y con plazo", ar: "محدد وقابل للقياس وقابل للتحقيق وذو صلة ومحدّد بوقت" },
      { en: "Only about cutting out all spending", es: "Solo sobre eliminar todo gasto", ar: "فقط عن إلغاء كل الإنفاق" },
      { en: "A loan you take from the bank", es: "Un préstamo que tomas del banco", ar: "قرض تأخذه من البنك" },
    ],
  },
  "day1-3": {
    question: {
      en: "If you spot an error on your credit report, the best move is to…",
      es: "Si detectas un error en tu informe de crédito, lo mejor es…",
      ar: "إذا اكتشفت خطأً في تقرير ائتمانك، فالأفضل أن…",
    },
    options: [
      { en: "Ignore it", es: "Ignorarlo", ar: "تتجاهله" },
      { en: "Dispute it with the credit bureau", es: "Disputarlo con la agencia de crédito", ar: "تعترض عليه لدى وكالة الائتمان" },
      { en: "Close all your accounts", es: "Cerrar todas tus cuentas", ar: "تغلق كل حساباتك" },
      { en: "Open a new credit card to offset it", es: "Abrir una tarjeta nueva para compensarlo", ar: "تفتح بطاقة جديدة لتعويضه" },
    ],
  },
  "day1-4": {
    question: {
      en: "Before pouring savings into a down payment, it's smart to first build…",
      es: "Antes de volcar ahorros en el pago inicial, es inteligente primero crear…",
      ar: "قبل توجيه المدّخرات إلى الدفعة الأولى، من الذكاء أن تبني أولاً…",
    },
    options: [
      { en: "A small emergency fund", es: "Un pequeño fondo de emergencia", ar: "صندوق طوارئ صغيراً" },
      { en: "A bigger entertainment budget", es: "Un presupuesto de entretenimiento más grande", ar: "ميزانية ترفيه أكبر" },
      { en: "A second car loan", es: "Un segundo préstamo de auto", ar: "قرض سيارة ثانياً" },
      { en: "Nothing — put every dollar toward the home", es: "Nada: pon cada dólar en la casa", ar: "لا شيء - وجّه كل دولار للمنزل" },
    ],
  },
  // ── Day 2 (new lessons + FHA) ────────────────────────────────────────────
  "day2m-1": {
    question: {
      en: "With a credit score of 580 or higher, the minimum FHA down payment is…",
      es: "Con un puntaje de 580 o más, el pago inicial mínimo de FHA es…",
      ar: "بدرجة ائتمانية 580 أو أعلى، الحد الأدنى لدفعة FHA الأولى هو…",
    },
    options: [
      { en: "0%", es: "0%", ar: "0%" },
      { en: "3.5%", es: "3.5%", ar: "3.5%" },
      { en: "10%", es: "10%", ar: "10%" },
      { en: "20%", es: "20%", ar: "20%" },
    ],
  },
  "day2m-2": {
    question: {
      en: "FHA loans charge an upfront mortgage insurance premium (UFMIP) of about…",
      es: "Los préstamos FHA cobran una prima inicial de seguro hipotecario (UFMIP) de cerca de…",
      ar: "تفرض قروض FHA قسط تأمين رهن مقدّماً (UFMIP) بنحو…",
    },
    options: [
      { en: "0.25% of the loan", es: "0.25% del préstamo", ar: "0.25% من القرض" },
      { en: "1.75% of the loan", es: "1.75% del préstamo", ar: "1.75% من القرض" },
      { en: "10% of the loan", es: "10% del préstamo", ar: "10% من القرض" },
      { en: "There is no upfront premium", es: "No hay prima inicial", ar: "لا يوجد قسط مقدّم" },
    ],
  },
  "day2m-3": {
    question: {
      en: "When the housing ratio and the debt-to-income ratio give different limits, a lender uses…",
      es: "Cuando la proporción de vivienda y la de deuda-ingreso dan límites distintos, el prestamista usa…",
      ar: "عندما تعطي نسبة السكن ونسبة الدين إلى الدخل حدّين مختلفين، يستخدم المُقرض…",
    },
    options: [
      { en: "The higher of the two", es: "El mayor de los dos", ar: "الأعلى منهما" },
      { en: "The lower of the two", es: "El menor de los dos", ar: "الأقل منهما" },
      { en: "Only the housing ratio", es: "Solo la proporción de vivienda", ar: "نسبة السكن فقط" },
      { en: "Neither — only your credit score", es: "Ninguna: solo tu puntaje", ar: "لا شيء - درجتك فقط" },
    ],
  },
  "day2m-4": {
    question: {
      en: "A VA loan is notable because eligible veterans often pay…",
      es: "Un préstamo VA destaca porque los veteranos elegibles a menudo pagan…",
      ar: "قرض VA مميز لأن المحاربين المؤهلين غالباً يدفعون…",
    },
    options: [
      { en: "A 20% down payment", es: "Un pago inicial del 20%", ar: "دفعة أولى 20%" },
      { en: "0% down with no monthly mortgage insurance", es: "0% inicial sin seguro hipotecario mensual", ar: "دفعة 0% بلا تأمين رهن شهري" },
      { en: "Double the interest rate", es: "El doble de la tasa de interés", ar: "ضعف سعر الفائدة" },
      { en: "An extra inspection fee", es: "Una tarifa extra de inspección", ar: "رسم فحص إضافي" },
    ],
  },
  "day2m-5": {
    question: {
      en: "A common guideline for annual home-maintenance savings is about…",
      es: "Una guía común para el ahorro anual de mantenimiento es cerca de…",
      ar: "من القواعد الشائعة للادخار السنوي لصيانة المنزل نحو…",
    },
    options: [
      { en: "1% of the home's value per year", es: "1% del valor de la casa al año", ar: "1% من قيمة المنزل سنوياً" },
      { en: "50% of your income", es: "50% de tu ingreso", ar: "50% من دخلك" },
      { en: "Nothing — repairs are rare", es: "Nada: las reparaciones son raras", ar: "لا شيء - الإصلاحات نادرة" },
      { en: "10% of the home's value every month", es: "10% del valor de la casa cada mes", ar: "10% من قيمة المنزل كل شهر" },
    ],
  },
  // ── Day 3 (new lessons) ──────────────────────────────────────────────────
  "day3-1": {
    question: {
      en: "A dual agent in a real estate deal represents…",
      es: "Un agente dual en una operación inmobiliaria representa…",
      ar: "الوكيل المزدوج في صفقة عقارية يمثّل…",
    },
    options: [
      { en: "Only the buyer", es: "Solo al comprador", ar: "المشتري فقط" },
      { en: "Only the seller", es: "Solo al vendedor", ar: "البائع فقط" },
      { en: "Both the buyer and the seller", es: "Tanto al comprador como al vendedor", ar: "المشتري والبائع معاً" },
      { en: "The bank", es: "Al banco", ar: "البنك" },
    ],
  },
  "day3-2": {
    question: {
      en: "Under the current rules, the Buyer Representation Agreement is signed…",
      es: "Con las reglas actuales, el Acuerdo de Representación del Comprador se firma…",
      ar: "وفق القواعد الحالية، تُوقَّع اتفاقية تمثيل المشتري…",
    },
    options: [
      { en: "After closing", es: "Después del cierre", ar: "بعد الإتمام" },
      { en: "Before the agent provides services", es: "Antes de que el agente preste servicios", ar: "قبل أن يقدّم الوكيل الخدمات" },
      { en: "Only if you buy a foreclosure", es: "Solo si compras una ejecución hipotecaria", ar: "فقط إذا اشتريت عقاراً محبوس الرهن" },
      { en: "Never — it's optional", es: "Nunca: es opcional", ar: "أبداً - فهي اختيارية" },
    ],
  },
  "day3-3": {
    question: {
      en: "While touring a home, fresh paint in just one spot may…",
      es: "Al recorrer una casa, pintura fresca en un solo lugar puede…",
      ar: "أثناء تفقّد منزل، طلاء جديد في بقعة واحدة قد…",
    },
    options: [
      { en: "Always be meaningless", es: "Siempre no significar nada", ar: "لا يعني شيئاً دائماً" },
      { en: "Hide a problem like a water stain — worth asking about", es: "Ocultar un problema como una mancha de agua — vale preguntar", ar: "يخفي مشكلة كبقعة ماء - يستحق السؤال" },
      { en: "Mean the home is brand new", es: "Significar que la casa es nueva", ar: "يعني أن المنزل جديد تماماً" },
      { en: "Automatically lower the price", es: "Bajar el precio automáticamente", ar: "يخفّض السعر تلقائياً" },
    ],
  },
  // ── Day 4 (new lessons) ──────────────────────────────────────────────────
  "day4-5": {
    question: {
      en: "Replacement-cost coverage pays…",
      es: "La cobertura de costo de reposición paga…",
      ar: "تغطية تكلفة الإحلال تدفع…",
    },
    options: [
      { en: "Only the depreciated value of an item", es: "Solo el valor depreciado de un artículo", ar: "القيمة المُستهلَكة للغرض فقط" },
      { en: "Enough to buy the item new today", es: "Lo suficiente para comprar el artículo nuevo hoy", ar: "ما يكفي لشراء الغرض جديداً اليوم" },
      { en: "Nothing for electronics", es: "Nada por electrónicos", ar: "لا شيء للإلكترونيات" },
      { en: "Only for the structure, never belongings", es: "Solo la estructura, nunca las pertenencias", ar: "الهيكل فقط، لا الممتلكات" },
    ],
  },
  "day4-6": {
    question: {
      en: "In Ohio, owning a dog the state classifies as 'vicious' requires liability coverage of at least…",
      es: "En Ohio, tener un perro que el estado clasifica como 'peligroso' exige cobertura de responsabilidad de al menos…",
      ar: "في أوهايو، امتلاك كلب تصنّفه الولاية 'شرساً' يتطلب تغطية مسؤولية لا تقل عن…",
    },
    options: [
      { en: "$1,000", es: "$1,000", ar: "1,000 دولار" },
      { en: "$10,000", es: "$10,000", ar: "10,000 دولار" },
      { en: "$100,000", es: "$100,000", ar: "100,000 دولار" },
      { en: "No coverage is required", es: "No se exige cobertura", ar: "لا تُطلب تغطية" },
    ],
  },
  "day4-7": {
    question: {
      en: "The best time to line up homeowner's insurance is…",
      es: "El mejor momento para contratar el seguro de vivienda es…",
      ar: "أفضل وقت لترتيب تأمين المنزل هو…",
    },
    options: [
      { en: "A year after moving in", es: "Un año después de mudarte", ar: "بعد عام من الانتقال" },
      { en: "As soon as you sign the purchase contract", es: "En cuanto firmes el contrato de compra", ar: "بمجرد توقيع عقد الشراء" },
      { en: "Only after a disaster", es: "Solo después de un desastre", ar: "فقط بعد كارثة" },
      { en: "It's optional, so never", es: "Es opcional, así que nunca", ar: "اختياري، فلا داعي أبداً" },
    ],
  },
  "day4-8": {
    question: {
      en: "A simple, low-cost habit that prevents some of the most expensive home repairs is…",
      es: "Un hábito sencillo y económico que evita algunas de las reparaciones más costosas es…",
      ar: "عادة بسيطة ومنخفضة التكلفة تمنع بعض أغلى إصلاحات المنزل هي…",
    },
    options: [
      {
        en: "Cleaning gutters and directing water away from the foundation",
        es: "Limpiar las canaletas y alejar el agua de los cimientos",
        ar: "تنظيف المزاريب وتوجيه المياه بعيداً عن الأساس",
      },
      {
        en: "Repainting the whole house every year",
        es: "Repintar toda la casa cada año",
        ar: "إعادة طلاء المنزل بالكامل كل عام",
      },
      {
        en: "Turning the heat off all winter",
        es: "Apagar la calefacción todo el invierno",
        ar: "إطفاء التدفئة طوال الشتاء",
      },
      {
        en: "Never changing the furnace filter",
        es: "Nunca cambiar el filtro de la calefacción",
        ar: "عدم تغيير فلتر الفرن أبداً",
      },
    ],
  },
};
