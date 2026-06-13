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
};
