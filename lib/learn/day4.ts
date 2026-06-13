import type { Lesson, Localized } from "./content";

/**
 * Day 4 learner content — "Home Insurance Basics & Home Maintenance", authored
 * from the Day 4 class deck: what homeowner's insurance covers, choosing
 * coverage, the cycle of home maintenance (including home-health issues like
 * mold and pests), and protecting your investment (tax abatement, improvements).
 */

export const DAY4_SECTIONS: Record<string, Localized> = {
  insurance: {
    en: "Home Insurance Basics",
    es: "Conceptos básicos del seguro de vivienda",
    ar: "أساسيات تأمين المنزل",
  },
  maintenance: {
    en: "Home Maintenance",
    es: "Mantenimiento del hogar",
    ar: "صيانة المنزل",
  },
};

export const DAY4_LESSONS: Lesson[] = [
  {
    id: "insurance-basics",
    section: "insurance",
    title: {
      en: "Why You Need Homeowner's Insurance",
      es: "Por qué necesitas el seguro de vivienda",
      ar: "لماذا تحتاج إلى تأمين المنزل",
    },
    body: [
      {
        en: "Homeowner's insurance protects the biggest investment of your life. A standard policy covers the structure, your belongings inside it, liability if someone is hurt on your property, and additional living expenses if a covered disaster makes the home unlivable.",
        es: "El seguro de vivienda protege la inversión más grande de tu vida. Una póliza estándar cubre la estructura, tus pertenencias, la responsabilidad civil si alguien se lastima en tu propiedad y gastos de vivienda adicionales si un desastre cubierto vuelve inhabitable la casa.",
        ar: "يحمي تأمين المنزل أكبر استثمار في حياتك. تغطي الوثيقة القياسية هيكل المنزل، وممتلكاتك داخله، والمسؤولية إذا أُصيب أحد في عقارك، ونفقات معيشة إضافية إذا جعلت كارثةٌ مغطاة المنزلَ غير صالح للسكن.",
      },
      {
        en: "It's not optional: your lender requires proof of insurance before you can close, because the home is the loan's collateral. You'll shop for a policy during the buying process — it's one of the official steps.",
        es: "No es opcional: el prestamista exige prueba del seguro antes del cierre, porque la casa es la garantía del préstamo. Buscarás la póliza durante el proceso de compra: es uno de los pasos oficiales.",
        ar: "وهو ليس اختيارياً: يشترط المُقرض إثبات التأمين قبل الإتمام، لأن المنزل هو ضمانة القرض. ستبحث عن وثيقة التأمين أثناء عملية الشراء - فهي إحدى الخطوات الرسمية.",
      },
      {
        en: "Know what's NOT covered: standard policies usually exclude floods and earthquakes — those need separate coverage. Read the exclusions before you buy, not after a storm.",
        es: "Conoce lo que NO cubre: las pólizas estándar suelen excluir inundaciones y terremotos, que requieren cobertura aparte. Lee las exclusiones antes de comprar, no después de una tormenta.",
        ar: "اعرف ما لا يغطيه التأمين: تستثني الوثائق القياسية عادةً الفيضانات والزلازل - وتلك تحتاج تغطية منفصلة. اقرأ الاستثناءات قبل الشراء، لا بعد العاصفة.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Premium", es: "Prima", ar: "قسط التأمين" },
        def: {
          en: "What you pay for the policy — usually collected monthly with your mortgage payment.",
          es: "Lo que pagas por la póliza; normalmente se cobra cada mes junto con la hipoteca.",
          ar: "ما تدفعه مقابل الوثيقة - يُحصَّل عادةً شهرياً مع دفعة الرهن.",
        },
      },
      {
        term: { en: "Liability coverage", es: "Cobertura de responsabilidad", ar: "تغطية المسؤولية" },
        def: {
          en: "Protects you if someone is injured on your property and you're held responsible.",
          es: "Te protege si alguien se lesiona en tu propiedad y te hacen responsable.",
          ar: "تحميك إذا أُصيب شخص في عقارك وتحمّلت المسؤولية.",
        },
      },
    ],
    whyItMatters: {
      en: "One uninsured disaster can erase a decade of saving — insurance is what makes ownership survivable.",
      es: "Un desastre sin seguro puede borrar una década de ahorro: el seguro hace que ser propietario sea sostenible.",
      ar: "كارثة واحدة بلا تأمين قد تمحو عقداً من الادخار - التأمين هو ما يجعل التملّك قابلاً للاستمرار.",
    },
    check: {
      question: {
        en: "Quick check: which usually needs SEPARATE coverage?",
        es: "Repaso rápido: ¿qué suele necesitar cobertura APARTE?",
        ar: "مراجعة سريعة: أيٌّ مما يلي يحتاج عادةً تغطية منفصلة؟",
      },
      options: [
        { en: "A kitchen fire", es: "Un incendio en la cocina", ar: "حريق في المطبخ" },
        { en: "A flood", es: "Una inundación", ar: "فيضان" },
        { en: "A stolen TV", es: "Un televisor robado", ar: "تلفاز مسروق" },
      ],
      correctIndex: 1,
      explain: {
        en: "Correct — flood (and earthquake) damage is excluded from standard policies and needs its own coverage.",
        es: "Correcto: los daños por inundación (y terremoto) están excluidos de las pólizas estándar y requieren su propia cobertura.",
        ar: "صحيح - أضرار الفيضانات (والزلازل) مستثناة من الوثائق القياسية وتحتاج تغطية خاصة بها.",
      },
    },
  },
  {
    id: "insurance-choosing",
    section: "insurance",
    title: {
      en: "Choosing the Right Coverage",
      es: "Elegir la cobertura correcta",
      ar: "اختيار التغطية المناسبة",
    },
    body: [
      {
        en: "Insure for replacement cost — what it would cost to rebuild today — not just the purchase price. Construction costs change, and being underinsured means paying the difference yourself.",
        es: "Asegura por el costo de reposición —lo que costaría reconstruir hoy— y no solo el precio de compra. Los costos de construcción cambian, y estar subasegurado significa pagar tú la diferencia.",
        ar: "أمِّن بقيمة تكلفة الإحلال - أي ما سيكلفه إعادة البناء اليوم - لا بسعر الشراء فقط. فتكاليف البناء تتغير، ونقص التأمين يعني أن تدفع الفرق من جيبك.",
      },
      {
        en: "Your deductible is what you pay out of pocket before insurance kicks in. A higher deductible lowers your premium but means more risk when something happens — pick a number your emergency fund can actually cover.",
        es: "El deducible es lo que pagas de tu bolsillo antes de que entre el seguro. Un deducible más alto baja la prima pero implica más riesgo: elige una cifra que tu fondo de emergencia realmente pueda cubrir.",
        ar: "التحمّل (الخصم) هو ما تدفعه من جيبك قبل أن يبدأ التأمين بالتغطية. التحمّل الأعلى يخفّض القسط لكنه يعني مخاطرة أكبر عند وقوع حادث - فاختر رقماً يستطيع صندوق طوارئك تغطيته فعلاً.",
      },
      {
        en: "Shop around every year or two: get quotes from at least three insurers, ask about bundling with auto insurance, and ask what discounts apply (alarms, new roof, claim-free history). Loyalty rarely pays in insurance.",
        es: "Compara cada uno o dos años: pide cotizaciones a por lo menos tres aseguradoras, pregunta por combinar con el seguro de auto y por los descuentos (alarmas, techo nuevo, historial sin reclamos). La lealtad rara vez paga en seguros.",
        ar: "قارن الأسعار كل سنة أو سنتين: اطلب عروضاً من ثلاث شركات على الأقل، واسأل عن جمعه مع تأمين السيارة، وعن الخصومات المتاحة (أجهزة الإنذار، السقف الجديد، سجل خالٍ من المطالبات). الولاء نادراً ما يُجزى في التأمين.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Replacement cost", es: "Costo de reposición", ar: "تكلفة الإحلال" },
        def: {
          en: "What it would cost to rebuild your home today — the right amount to insure for.",
          es: "Lo que costaría reconstruir tu casa hoy: la cantidad correcta para asegurar.",
          ar: "ما سيكلفه إعادة بناء منزلك اليوم - وهو المقدار الصحيح للتأمين.",
        },
      },
      {
        term: { en: "Deductible", es: "Deducible", ar: "مبلغ التحمّل" },
        def: {
          en: "Your out-of-pocket share of a claim before insurance pays the rest.",
          es: "Tu parte de un reclamo antes de que el seguro pague el resto.",
          ar: "حصتك من المطالبة قبل أن يدفع التأمين الباقي.",
        },
      },
    ],
    whyItMatters: {
      en: "The right deductible and replacement-cost coverage are the difference between an inconvenience and a catastrophe.",
      es: "El deducible correcto y la cobertura de reposición marcan la diferencia entre un inconveniente y una catástrofe.",
      ar: "مبلغ التحمّل الصحيح وتغطية تكلفة الإحلال هما الفرق بين إزعاج عابر وكارثة.",
    },
    check: {
      question: {
        en: "Quick check: raising your deductible usually…",
        es: "Repaso rápido: subir tu deducible normalmente…",
        ar: "مراجعة سريعة: رفع مبلغ التحمّل عادةً…",
      },
      options: [
        {
          en: "Lowers your premium but raises your out-of-pocket risk",
          es: "Baja tu prima pero sube tu riesgo de bolsillo",
          ar: "يخفّض قسطك لكنه يزيد مخاطرتك من جيبك",
        },
        {
          en: "Raises your premium",
          es: "Sube tu prima",
          ar: "يرفع قسطك",
        },
        {
          en: "Has no effect on cost",
          es: "No afecta el costo",
          ar: "لا يؤثر في التكلفة",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Right — it's a trade-off. Choose a deductible your emergency savings can absorb.",
        es: "Correcto: es un intercambio. Elige un deducible que tus ahorros de emergencia puedan absorber.",
        ar: "صحيح - إنها مقايضة. اختر مبلغ تحمّل يمكن لمدخرات طوارئك استيعابه.",
      },
    },
  },
  {
    id: "maintenance-cycle",
    section: "maintenance",
    title: {
      en: "The Cycle of Home Maintenance",
      es: "El ciclo del mantenimiento del hogar",
      ar: "دورة صيانة المنزل",
    },
    body: [
      {
        en: "Maintenance runs in a yearly cycle: in spring, check the roof, gutters, and drainage after winter; in summer, service the cooling, seal decks, and watch for pests; in fall, clean gutters, service the furnace, and seal gaps; in winter, watch pipes, test detectors, and check for ice dams.",
        es: "El mantenimiento sigue un ciclo anual: en primavera, revisa techo, canaletas y drenaje tras el invierno; en verano, da servicio al aire, sella terrazas y vigila plagas; en otoño, limpia canaletas, da servicio a la calefacción y sella grietas; en invierno, vigila las tuberías, prueba los detectores y revisa el hielo acumulado.",
        ar: "تسير الصيانة في دورة سنوية: في الربيع، افحص السقف والمزاريب والتصريف بعد الشتاء؛ وفي الصيف، اعتنِ بالتبريد وادهن الأسطح الخشبية وراقب الآفات؛ وفي الخريف، نظّف المزاريب واعتنِ بالمدفأة وأغلق الفجوات؛ وفي الشتاء، راقب الأنابيب واختبر أجهزة الكشف وتحقق من تراكم الجليد.",
      },
      {
        en: "Your home talks to you — listen for the warning signs from class: hot and cold spots, bugs and pests, mold, and surprise jumps in utility bills. Each one points to a fixable problem (insulation gaps, moisture, leaks) that gets expensive when ignored.",
        es: "Tu casa te habla: atiende las señales que vimos en clase: zonas calientes y frías, insectos y plagas, moho y saltos repentinos en las facturas de servicios. Cada una apunta a un problema reparable (aislamiento, humedad, fugas) que se vuelve caro si se ignora.",
        ar: "منزلك يتحدث إليك - فأصغِ إلى علامات التحذير من الدرس: مناطق حارة وباردة، وحشرات وآفات، وعفن، وقفزات مفاجئة في فواتير الخدمات. كل واحدة تشير إلى مشكلة قابلة للإصلاح (فجوات العزل، الرطوبة، التسريبات) تصبح مكلفة إذا أُهملت.",
      },
      {
        en: "Mold and pests aren't just property problems — they're health problems, linked to sinus and respiratory issues. Fixing moisture early protects your family, not just your investment. Budget about 1% of your home's value per year for maintenance.",
        es: "El moho y las plagas no son solo problemas de la propiedad: son problemas de salud, vinculados a males respiratorios y de sinusitis. Corregir la humedad a tiempo protege a tu familia, no solo tu inversión. Presupuesta cerca del 1% del valor de tu casa al año para mantenimiento.",
        ar: "العفن والآفات ليسا مجرد مشاكل في العقار - بل مشاكل صحية مرتبطة بمتاعب الجيوب الأنفية والجهاز التنفسي. معالجة الرطوبة مبكراً تحمي أسرتك، لا استثمارك فقط. خصّص نحو 1% من قيمة منزلك سنوياً للصيانة.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Preventive maintenance", es: "Mantenimiento preventivo", ar: "الصيانة الوقائية" },
        def: {
          en: "Small, scheduled upkeep that prevents big, expensive failures.",
          es: "Cuidados pequeños y programados que evitan fallas grandes y caras.",
          ar: "عناية صغيرة منتظمة تمنع الأعطال الكبيرة والمكلفة.",
        },
      },
      {
        term: { en: "Ice dam", es: "Presa de hielo", ar: "سد جليدي" },
        def: {
          en: "Ice buildup at the roof edge that forces melting water under shingles.",
          es: "Acumulación de hielo en el borde del techo que empuja el agua bajo las tejas.",
          ar: "تراكم جليدي عند حافة السقف يدفع المياه الذائبة تحت ألواح السقف.",
        },
      },
    ],
    whyItMatters: {
      en: "A $20 tube of caulk today beats a $2,000 water repair next year — maintenance is how owners keep their equity.",
      es: "Un sellador de $20 hoy vence una reparación de $2,000 el próximo año: el mantenimiento es como los dueños conservan su plusvalía.",
      ar: "أنبوب سدّ شقوق بـ20 دولاراً اليوم خير من إصلاح أضرار مياه بـ2,000 دولار العام القادم - الصيانة هي كيف يحافظ الملّاك على قيمة منازلهم.",
    },
    check: {
      question: {
        en: "Quick check: hot/cold spots, pests, mold, and high bills are…",
        es: "Repaso rápido: zonas frías/calientes, plagas, moho y facturas altas son…",
        ar: "مراجعة سريعة: المناطق الحارة/الباردة والآفات والعفن والفواتير المرتفعة هي…",
      },
      options: [
        {
          en: "Normal in every home — ignore them",
          es: "Normales en toda casa: ignóralas",
          ar: "طبيعية في كل منزل - تجاهلها",
        },
        {
          en: "Warning signs of fixable problems",
          es: "Señales de alerta de problemas reparables",
          ar: "علامات تحذير لمشاكل قابلة للإصلاح",
        },
        {
          en: "Reasons to sell immediately",
          es: "Razones para vender de inmediato",
          ar: "أسباب للبيع فوراً",
        },
      ],
      correctIndex: 1,
      explain: {
        en: "Exactly — they're your home's early-warning system. Investigate early, fix cheap.",
        es: "Exacto: son el sistema de alerta temprana de tu casa. Investiga pronto y repara barato.",
        ar: "تماماً - إنها نظام الإنذار المبكر لمنزلك. تحرَّ مبكراً وأصلح بتكلفة قليلة.",
      },
    },
  },
  {
    id: "maintenance-protect-investment",
    section: "maintenance",
    title: {
      en: "Protecting & Growing Your Investment",
      es: "Proteger y hacer crecer tu inversión",
      ar: "حماية استثمارك وتنميته",
    },
    body: [
      {
        en: "Ask your real estate agent about tax abatement incentives in the city where you want to buy. Abatements can reduce your property taxes substantially for years — in some Ohio cities, that's thousands of dollars saved.",
        es: "Pregunta a tu agente sobre los incentivos de reducción de impuestos (tax abatement) en la ciudad donde quieres comprar. Pueden reducir sustancialmente tus impuestos por años; en algunas ciudades de Ohio son miles de dólares ahorrados.",
        ar: "اسأل وكيلك العقاري عن حوافز الإعفاء الضريبي في المدينة التي تريد الشراء فيها. يمكن للإعفاءات أن تخفّض ضرائب عقارك بشكل كبير لسنوات - وفي بعض مدن أوهايو يعني ذلك توفير آلاف الدولارات.",
      },
      {
        en: "Some improvements add real value: additional living area, a new bathroom, a new porch or garage, finishing the attic or a second-floor room. Others are mostly for your enjoyment — know the difference before you spend.",
        es: "Algunas mejoras agregan valor real: más área habitable, un baño nuevo, un porche o garaje nuevo, terminar el ático o un cuarto del segundo piso. Otras son sobre todo para tu disfrute: conoce la diferencia antes de gastar.",
        ar: "بعض التحسينات تضيف قيمة حقيقية: مساحة معيشة إضافية، أو حمّام جديد، أو شرفة أو مرآب جديد، أو إكمال العلّية أو غرفة في الطابق الثاني. وبعضها الآخر لمتعتك أساساً - فاعرف الفرق قبل أن تنفق.",
      },
      {
        en: "Every payment you make builds equity — your ownership share of the home. Maintenance protects it, smart improvements grow it, and refinancing traps can strip it. You finished all four days: you now know more than most buyers ever learn.",
        es: "Cada pago construye plusvalía: tu parte de la casa. El mantenimiento la protege, las mejoras inteligentes la hacen crecer y las trampas de refinanciamiento pueden quitártela. Terminaste los cuatro días: ya sabes más de lo que la mayoría de los compradores aprende jamás.",
        ar: "كل دفعة تسددها تبني ملكية - حصتك من المنزل. الصيانة تحميها، والتحسينات الذكية تنمّيها، وفخاخ إعادة التمويل قد تجرّدك منها. لقد أتممت الأيام الأربعة: أنت الآن تعرف أكثر مما يتعلمه معظم المشترين على الإطلاق.",
      },
    ],
    keyTerms: [
      {
        term: { en: "Tax abatement", es: "Reducción de impuestos", ar: "الإعفاء الضريبي" },
        def: {
          en: "A city incentive that lowers property taxes for qualifying homes — ask before you buy.",
          es: "Un incentivo municipal que baja los impuestos de propiedades que califican; pregunta antes de comprar.",
          ar: "حافز من المدينة يخفّض ضرائب العقارات المؤهلة - اسأل قبل الشراء.",
        },
      },
      {
        term: { en: "Equity", es: "Plusvalía", ar: "حقوق الملكية" },
        def: {
          en: "The share of the home you truly own: its value minus what you still owe.",
          es: "La parte de la casa que de verdad es tuya: su valor menos lo que aún debes.",
          ar: "الجزء الذي تملكه فعلاً من المنزل: قيمته مطروحاً منها ما لا يزال عليك.",
        },
      },
    ],
    whyItMatters: {
      en: "Homeownership builds generational wealth only when the investment is protected — that's what this whole course has been for.",
      es: "Ser propietario crea riqueza generacional solo cuando la inversión está protegida: para eso ha sido todo este curso.",
      ar: "امتلاك المنزل يبني ثروة للأجيال فقط عندما يكون الاستثمار محمياً - وهذا ما كان هذا الكرس كله من أجله.",
    },
    check: {
      question: {
        en: "Quick check: which improvement most reliably adds home value?",
        es: "Repaso rápido: ¿qué mejora agrega valor de forma más confiable?",
        ar: "مراجعة سريعة: أي تحسين يضيف قيمة للمنزل بشكل أكثر موثوقية؟",
      },
      options: [
        {
          en: "Adding living area or a bathroom",
          es: "Agregar área habitable o un baño",
          ar: "إضافة مساحة معيشة أو حمّام",
        },
        {
          en: "Expensive decorations",
          es: "Decoraciones caras",
          ar: "ديكورات باهظة",
        },
        {
          en: "A bigger TV",
          es: "Un televisor más grande",
          ar: "تلفاز أكبر",
        },
      ],
      correctIndex: 0,
      explain: {
        en: "Yes — added living space (rooms, bathrooms, finished attic, garage) is the classic value-builder from your Day 4 class.",
        es: "Sí: el espacio habitable agregado (cuartos, baños, ático terminado, garaje) es el clásico generador de valor de tu clase del Día 4.",
        ar: "نعم - المساحة المعيشية المضافة (غرف، حمّامات، علّية مكتملة، مرآب) هي البانية الكلاسيكية للقيمة من درس اليوم الرابع.",
      },
    },
  },
];
