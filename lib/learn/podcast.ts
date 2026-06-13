import type { Localized } from "./content";

/**
 * Interactive podcast scripts — two friendly hosts (Maya & Devon) talk through
 * each day conversationally. Every line is authored in all three course
 * languages, so the episode plays in the learner's language with matching
 * speech-synthesis voices. The learner can pause at any line and ask the AI
 * Coach (NotebookLM-style), then resume.
 */

export type Host = "maya" | "devon";

export interface PodcastLine {
  speaker: Host;
  text: Localized;
}

export interface PodcastEpisode {
  daySlug: string;
  title: Localized;
  lines: PodcastLine[];
}

export const HOST_LABELS: Record<Host, string> = {
  maya: "Maya",
  devon: "Devon",
};

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    daySlug: "day-1",
    title: {
      en: "Money & Credit, explained like a friend would",
      es: "Dinero y crédito, explicados como entre amigos",
      ar: "المال والائتمان، بشرح صديق",
    },
    lines: [
      {
        speaker: "maya",
        text: {
          en: "Welcome to Home Ready! I'm Maya, and today Devon and I are talking about the foundation of buying a home: money management and credit.",
          es: "¡Bienvenidos a Home Ready! Soy Maya, y hoy Devon y yo hablamos de la base para comprar casa: el manejo del dinero y el crédito.",
          ar: "أهلاً بكم في «جاهز للمنزل»! أنا مايا، واليوم نتحدث أنا وديفون عن أساس شراء المنزل: إدارة المال والائتمان.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Let's start with the budget. People tense up at that word, but a budget is just a spending plan — it gives every dollar a job before the month begins.",
          es: "Empecemos con el presupuesto. La palabra asusta, pero es solo un plan de gastos: le da una tarea a cada dólar antes de que empiece el mes.",
          ar: "لنبدأ بالميزانية. يتوتر الناس من هذه الكلمة، لكنها مجرد خطة إنفاق - تعطي كل دولار مهمة قبل أن يبدأ الشهر.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "And expenses come in flavors: fixed ones like rent that never change, and variable ones like groceries that move around. The surprises — car repairs, medical bills — are the ones that wreck budgets.",
          es: "Y los gastos tienen tipos: fijos como el alquiler, que no cambian, y variables como la comida. Las sorpresas —reparaciones, gastos médicos— son las que arruinan presupuestos.",
          ar: "وللمصروفات أنواع: ثابتة كالإيجار لا تتغير، ومتغيرة كالبقالة. أما المفاجآت - إصلاح سيارة أو فاتورة طبية - فهي ما يخرّب الميزانيات.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Here's the number to remember: keep housing near thirty percent of your gross monthly income. That keeps the rest of your life affordable.",
          es: "El número para recordar: mantén la vivienda cerca del treinta por ciento de tu ingreso bruto mensual. Así el resto de tu vida sigue siendo pagable.",
          ar: "إليك الرقم الذي يجب تذكره: أبقِ تكلفة السكن قرب ثلاثين بالمئة من دخلك الشهري الإجمالي. هكذا تبقى بقية حياتك ميسورة.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Now credit. Your credit report is the story of how you've borrowed and repaid. Three bureaus keep it — Equifax, Experian, and TransUnion — and you can check each one free every year.",
          es: "Ahora el crédito. Tu informe es la historia de cómo has pedido y pagado. Tres agencias lo guardan —Equifax, Experian y TransUnion— y puedes revisarlo gratis cada año.",
          ar: "الآن الائتمان. تقريرك الائتماني هو قصة اقتراضك وسدادك. تحفظه ثلاث وكالات - إكويفاكس وإكسبيريان وترانس يونيون - ويمكنك فحص كل منها مجاناً سنوياً.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "And checking your own report never hurts your score. What moves the score most? Payment history. Paying every bill on time is the whole game.",
          es: "Y revisar tu propio informe nunca baja tu puntaje. ¿Qué lo mueve más? El historial de pagos. Pagar todo a tiempo es la clave.",
          ar: "وفحصك لتقريرك بنفسك لا يضر درجتك أبداً. ما الذي يحرّك الدرجة أكثر؟ سجل المدفوعات. دفع كل فاتورة في موعدها هو كل شيء.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Second is utilization — how much of your available credit you're using. Keep balances well below your limits, keep old accounts open, and don't apply for lots of new credit at once.",
          es: "Lo segundo es el uso del crédito: cuánto de tu límite estás usando. Mantén saldos bajos, conserva cuentas antiguas y no pidas mucho crédito nuevo a la vez.",
          ar: "ثانياً معدل الاستخدام - كم تستعمل من ائتمانك المتاح. أبقِ الأرصدة منخفضة، واحتفظ بالحسابات القديمة مفتوحة، ولا تطلب ائتماناً جديداً كثيراً دفعة واحدة.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Why does it matter? Many down-payment-assistance programs want a score around six-twenty to six-forty. Steady habits get you there.",
          es: "¿Por qué importa? Muchos programas de ayuda para el pago inicial piden un puntaje de unos 620 a 640. Los hábitos constantes te llevan ahí.",
          ar: "لماذا يهم هذا؟ كثير من برامج المساعدة في الدفعة الأولى تطلب درجة بين 620 و640 تقريباً. والعادات الثابتة توصلك إلى هناك.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Got a question? Pause us and ask the Coach — then come back. When you're ready, take the Day 1 test and earn that certificate!",
          es: "¿Tienes una duda? Pausa y pregúntale al Coach, y luego vuelve. Cuando estés listo, haz la prueba del Día 1 ¡y gana tu certificado!",
          ar: "عندك سؤال؟ أوقفنا مؤقتاً واسأل المدرب - ثم عُد. وعندما تكون مستعداً، أدِّ اختبار اليوم الأول واحصل على شهادتك!",
        },
      },
    ],
  },
  {
    daySlug: "day-2",
    title: {
      en: "Mortgages without the mystery",
      es: "Hipotecas sin misterio",
      ar: "الرهن العقاري بلا غموض",
    },
    lines: [
      {
        speaker: "devon",
        text: {
          en: "Day 2! Today it's mortgages. Maya, give it to me straight — what IS a mortgage?",
          es: "¡Día 2! Hoy tocan las hipotecas. Maya, dímelo claro: ¿qué ES una hipoteca?",
          ar: "اليوم الثاني! اليوم نتحدث عن الرهن العقاري. مايا، قوليها لي بصراحة - ما هو الرهن العقاري؟",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "A loan to buy a property — and it's a secured loan. The home itself is the collateral. Stop paying, and the lender can take the home through foreclosure.",
          es: "Un préstamo para comprar una propiedad, y es garantizado. La propia casa es la garantía. Si dejas de pagar, el prestamista puede tomarla mediante la ejecución hipotecaria.",
          ar: "قرض لشراء عقار - وهو قرض مضمون. المنزل نفسه هو الضمانة. توقف عن السداد، ويمكن للمقرض أخذ المنزل عبر حبس الرهن.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Fixed versus ARM: a fixed rate never changes — predictable for thirty years. An adjustable rate can rise over time. For most first-time buyers, predictable wins.",
          es: "Fija versus ARM: la tasa fija nunca cambia, predecible por treinta años. La ajustable puede subir. Para la mayoría de los compradores primerizos, gana lo predecible.",
          ar: "الثابتة مقابل المتغيرة: الفائدة الثابتة لا تتغير أبداً - متوقعة لثلاثين عاماً. والمتغيرة قد ترتفع مع الوقت. ولمعظم المشترين الجدد، الثبات هو الأفضل.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "And PMI — private mortgage insurance — usually applies when you put down less than twenty percent. It protects the lender, and you can ask to remove it once you reach about twenty percent equity.",
          es: "Y el PMI —el seguro hipotecario privado— suele aplicar cuando das menos del veinte por ciento inicial. Protege al prestamista, y puedes pedir quitarlo al llegar a veinte por ciento de plusvalía.",
          ar: "وتأمين PMI - تأمين الرهن الخاص - يُطبق عادة عند دفعة أولى أقل من عشرين بالمئة. يحمي المقرض، ويمكنك طلب إزالته عند بلوغ نحو عشرين بالمئة من الملكية.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Now the magic numbers: twenty-nine and forty-one. Housing should stay near twenty-nine percent of gross monthly income, and housing plus all debts under about forty-one percent.",
          es: "Ahora los números mágicos: veintinueve y cuarenta y uno. La vivienda cerca del veintinueve por ciento del ingreso bruto, y vivienda más deudas bajo el cuarenta y uno.",
          ar: "والآن الرقمان السحريان: تسعة وعشرون وواحد وأربعون. السكن قرب تسعة وعشرين بالمئة من الدخل الإجمالي، والسكن مع كل الديون تحت واحد وأربعين بالمئة تقريباً.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "That's exactly how the Murphy family in our class worksheet figured out what they could afford before falling in love with a house they couldn't.",
          es: "Así fue exactamente como la familia Murphy de nuestra clase calculó lo que podía pagar antes de enamorarse de una casa fuera de su alcance.",
          ar: "هكذا تماماً عرفت عائلة ميرفي في ورقة عمل صفنا ما تستطيع تحمله قبل أن تقع في حب منزل لا تقدر عليه.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Know your rights too. The Closing Disclosure must reach you at least three business days before closing, and fair-lending laws make discrimination illegal. If a deal pressures you to sign fast — walk away.",
          es: "Conoce también tus derechos. La Divulgación de Cierre debe llegarte al menos tres días hábiles antes del cierre, y las leyes de préstamos justos prohíben la discriminación. Si te presionan a firmar rápido, retírate.",
          ar: "اعرف حقوقك أيضاً. يجب أن يصلك إفصاح الإتمام قبل ثلاثة أيام عمل على الأقل، وقوانين الإقراض العادل تجرّم التمييز. إذا ضغط عليك أحد للتوقيع بسرعة - فانسحب.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Try the affordability calculator in the lesson, and quiz yourself when you're ready. Questions? Pause and ask the Coach!",
          es: "Prueba la calculadora de capacidad de pago en la lección y haz la prueba cuando estés listo. ¿Dudas? ¡Pausa y pregunta al Coach!",
          ar: "جرّب حاسبة القدرة على التحمل في الدرس، واختبر نفسك عندما تستعد. أسئلة؟ أوقف مؤقتاً واسأل المدرب!",
        },
      },
    ],
  },
  {
    daySlug: "day-3",
    title: {
      en: "Shopping smart & the inspection that saves you",
      es: "Comprar con cabeza y la inspección que te salva",
      ar: "التسوق الذكي والفحص الذي ينقذك",
    },
    lines: [
      {
        speaker: "maya",
        text: {
          en: "Day 3 — the fun part! House hunting. But before you tour anything, Devon, what's the homework?",
          es: "Día 3, ¡la parte divertida! Buscar casa. Pero antes de visitar nada, Devon, ¿cuál es la tarea?",
          ar: "اليوم الثالث - الجزء الممتع! البحث عن منزل. لكن قبل أن تزور أي شيء، ديفون، ما الواجب؟",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Two lists: needs and wants. Needs are non-negotiable — bedrooms, location, a price inside your pre-approval. Wants are the granite countertops.",
          es: "Dos listas: necesidades y deseos. Las necesidades no se negocian: habitaciones, zona, un precio dentro de tu preaprobación. Los deseos son las encimeras de granito.",
          ar: "قائمتان: احتياجات ورغبات. الاحتياجات لا تُناقش - غرف النوم، الموقع، سعر ضمن موافقتك المبدئية. أما الرغبات فهي أسطح الغرانيت.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "When you find the one, you make a written offer with contingencies — escape hatches that protect you, like passing the inspection and getting your financing.",
          es: "Cuando encuentras la indicada, haces una oferta escrita con contingencias: salidas de emergencia que te protegen, como pasar la inspección y obtener el financiamiento.",
          ar: "عندما تجد المنزل المنشود، تقدّم عرضاً مكتوباً مع شروط وقائية - مخارج أمان تحميك، مثل اجتياز الفحص والحصول على التمويل.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "You'll include earnest money — a good-faith deposit held in escrow, a neutral account. It shows the seller you're serious, and it comes back to you at closing.",
          es: "Incluirás el depósito de buena fe, guardado en escrow, una cuenta neutral. Muestra al vendedor que vas en serio y se te devuelve en el cierre.",
          ar: "سترفق العربون - وديعة حسن نية تُحفظ في حساب ضمان محايد. تُظهر للبائع جدّيتك، وتعود إليك عند الإتمام.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Golden rule while you're in escrow: no big purchases, no new credit. Lenders re-check your credit right before closing, and a new car loan can sink the whole deal.",
          es: "Regla de oro en escrow: ni compras grandes ni crédito nuevo. Los prestamistas revisan tu crédito justo antes del cierre, y un préstamo de auto puede hundir todo.",
          ar: "القاعدة الذهبية أثناء الضمان: لا مشتريات كبيرة ولا ائتمان جديد. يعيد المقرضون فحص ائتمانك قبيل الإتمام، وقرض سيارة جديد قد يُغرق الصفقة كلها.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "And the inspection — never skip it. A few hundred dollars buys you a top-to-bottom report on the roof, foundation, plumbing, and electric. The inspector works for YOU.",
          es: "Y la inspección: nunca la saltes. Unos cientos de dólares te compran un informe completo del techo, cimientos, plomería y electricidad. El inspector trabaja para TI.",
          ar: "والفحص - لا تتخطاه أبداً. بضع مئات من الدولارات تشتري لك تقريراً شاملاً عن السقف والأساسات والسباكة والكهرباء. الفاحص يعمل لصالحك أنت.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "If it finds real problems, your contingency gives you options: ask for repairs, negotiate the price, or walk away with your earnest money. That's power.",
          es: "Si encuentra problemas reales, tu contingencia te da opciones: pedir reparaciones, negociar el precio o retirarte con tu depósito. Eso es poder.",
          ar: "إذا وجد مشاكل حقيقية، يمنحك الشرط الوقائي خيارات: اطلب الإصلاح، أو فاوض على السعر، أو انسحب مع عربونك. هذه هي القوة.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Try the put-the-steps-in-order game in this lesson, then take the Day 3 test. And remember — pause and ask the Coach anytime.",
          es: "Juega a ordenar los pasos en esta lección y luego haz la prueba del Día 3. Y recuerda: pausa y pregunta al Coach cuando quieras.",
          ar: "جرّب لعبة ترتيب الخطوات في هذا الدرس، ثم أدِّ اختبار اليوم الثالث. وتذكر - أوقف مؤقتاً واسأل المدرب في أي وقت.",
        },
      },
    ],
  },
  {
    daySlug: "day-4",
    title: {
      en: "Protecting the biggest purchase of your life",
      es: "Proteger la compra más grande de tu vida",
      ar: "حماية أكبر عملية شراء في حياتك",
    },
    lines: [
      {
        speaker: "devon",
        text: {
          en: "Final day! You bought the house — now let's keep it. Maya, why does the lender insist on homeowner's insurance?",
          es: "¡Último día! Compraste la casa, ahora hay que conservarla. Maya, ¿por qué el prestamista insiste en el seguro de vivienda?",
          ar: "اليوم الأخير! اشتريت المنزل - والآن لنحافظ عليه. مايا، لماذا يصرّ المقرض على تأمين المنزل؟",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Because the home is the loan's collateral. A standard policy covers the structure, your belongings, liability if someone's hurt, and living expenses if a covered disaster forces you out.",
          es: "Porque la casa es la garantía del préstamo. Una póliza estándar cubre la estructura, tus pertenencias, la responsabilidad civil y los gastos de vivienda si un desastre cubierto te obliga a salir.",
          ar: "لأن المنزل هو ضمانة القرض. الوثيقة القياسية تغطي الهيكل وممتلكاتك والمسؤولية إذا أُصيب أحد، ونفقات المعيشة إذا أجبرتك كارثة مغطاة على الخروج.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Watch the exclusions though — floods and earthquakes usually need separate coverage. And insure for replacement cost, what it takes to rebuild today.",
          es: "Pero ojo con las exclusiones: inundaciones y terremotos suelen necesitar cobertura aparte. Y asegura por el costo de reposición, lo que cuesta reconstruir hoy.",
          ar: "لكن انتبه للاستثناءات - الفيضانات والزلازل تحتاج عادة تغطية منفصلة. وأمِّن بتكلفة الإحلال، أي ما يكلفه إعادة البناء اليوم.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Your deductible is a dial: higher deductible, lower premium, more risk. Set it where your emergency fund can actually reach. And shop quotes every year or two — loyalty rarely pays.",
          es: "El deducible es una perilla: más alto, prima más baja, más riesgo. Ponlo donde tu fondo de emergencia llegue. Y compara cotizaciones cada uno o dos años: la lealtad rara vez paga.",
          ar: "مبلغ التحمل مثل المقبض: كلما ارتفع انخفض القسط وزادت المخاطرة. اضبطه حيث يستطيع صندوق طوارئك الوصول. وقارن العروض كل سنة أو سنتين - فالولاء نادراً ما يُجزى.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Now maintenance. It's a yearly cycle — gutters and roof in spring, cooling in summer, furnace and sealing in fall, pipes and detectors in winter.",
          es: "Ahora el mantenimiento. Es un ciclo anual: canaletas y techo en primavera, aire en verano, calefacción y sellado en otoño, tuberías y detectores en invierno.",
          ar: "الآن الصيانة. إنها دورة سنوية - المزاريب والسقف في الربيع، والتبريد في الصيف، والمدفأة وسد الفجوات في الخريف، والأنابيب وأجهزة الكشف في الشتاء.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "And your home talks to you: hot and cold spots, pests, mold, utility bills jumping. Those are warning signs of fixable problems — and mold and pests are health issues too.",
          es: "Y tu casa te habla: zonas frías y calientes, plagas, moho, facturas que saltan. Son señales de problemas reparables, y el moho y las plagas también afectan la salud.",
          ar: "ومنزلك يتحدث إليك: مناطق حارة وباردة، آفات، عفن، فواتير تقفز. هذه علامات تحذير لمشاكل قابلة للإصلاح - والعفن والآفات مشاكل صحية أيضاً.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Last money tip: ask your agent about tax abatement where you're buying — it can save you thousands in property taxes. And improvements that add living space add real value.",
          es: "Último consejo: pregunta a tu agente por la reducción de impuestos donde compras; puede ahorrarte miles. Y las mejoras que agregan espacio habitable agregan valor real.",
          ar: "نصيحة مالية أخيرة: اسأل وكيلك عن الإعفاء الضريبي حيث تشتري - قد يوفر لك آلافاً من ضرائب العقار. والتحسينات التي تضيف مساحة معيشية تضيف قيمة حقيقية.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Pass the Day 4 test and you've finished the whole course — every day, every certificate. We're proud of you. Now go find that assistance and get those keys!",
          es: "Aprueba la prueba del Día 4 y habrás terminado todo el curso: cada día, cada certificado. Estamos orgullosos de ti. ¡Ahora busca tu ayuda y consigue esas llaves!",
          ar: "اجتز اختبار اليوم الرابع وتكون قد أنهيت الدورة كاملة - كل يوم وكل شهادة. نحن فخورون بك. الآن اذهب وابحث عن المساعدة واحصل على تلك المفاتيح!",
        },
      },
    ],
  },
];

export function episodeForDay(daySlug: string): PodcastEpisode | undefined {
  return PODCAST_EPISODES.find((e) => e.daySlug === daySlug);
}
