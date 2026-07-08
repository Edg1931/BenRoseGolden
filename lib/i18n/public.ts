import type { LearnLang } from "@/lib/learn/content";

/**
 * Copy for the PUBLIC funnel (marketing, learner sign-up/sign-in, assistance
 * finder) in English / Spanish / Arabic — so the whole front door speaks the
 * visitor's language, not just the lessons. Keyed strings; use t(lang, key).
 */
export type L = Record<LearnLang, string>;

export const PUB: Record<string, L> = {
  // ── Learner auth ──────────────────────────────────────────────────────────
  authSignupTitle: { en: "Create your free profile", es: "Crea tu perfil gratuito", ar: "أنشئ ملفك المجاني" },
  authSigninTitle: { en: "Welcome back", es: "Bienvenido de nuevo", ar: "مرحباً بعودتك" },
  authSignupSub: {
    en: "Save your progress across all four classes, earn your certificate, and see the down-payment assistance you may qualify for.",
    es: "Guarda tu progreso en las cuatro clases, obtén tu certificado y descubre la ayuda para el pago inicial a la que puedes calificar.",
    ar: "احفظ تقدّمك في الدروس الأربعة، واحصل على شهادتك، واطّلع على المساعدة في الدفعة الأولى التي قد تتأهل لها.",
  },
  authSigninSub: {
    en: "Sign in to pick up your classes where you left off.",
    es: "Inicia sesión para continuar tus clases donde las dejaste.",
    ar: "سجّل الدخول لمتابعة دروسك من حيث توقّفت.",
  },
  firstName: { en: "First name", es: "Nombre", ar: "الاسم الأول" },
  lastName: { en: "Last name", es: "Apellido", ar: "اسم العائلة" },
  email: { en: "Email", es: "Correo electrónico", ar: "البريد الإلكتروني" },
  password: { en: "Password", es: "Contraseña", ar: "كلمة المرور" },
  passwordHint: { en: "At least 8 characters.", es: "Al menos 8 caracteres.", ar: "‎8 أحرف على الأقل." },
  phone: { en: "Phone", es: "Teléfono", ar: "الهاتف" },
  optional: { en: "(optional)", es: "(opcional)", ar: "(اختياري)" },
  language: { en: "Language", es: "Idioma", ar: "اللغة" },
  unlockMatches: {
    en: "Unlock your assistance matches (optional)",
    es: "Desbloquea tus coincidencias de ayuda (opcional)",
    ar: "افتح المساعدات المطابقة لك (اختياري)",
  },
  unlockHelp: {
    en: "Tell us a little and we'll show the down-payment help you may qualify for. You can add this later, too.",
    es: "Cuéntanos un poco y te mostraremos la ayuda para el pago inicial a la que puedes calificar. También puedes agregarlo más tarde.",
    ar: "أخبرنا قليلاً وسنعرض لك المساعدة في الدفعة الأولى التي قد تتأهل لها. ويمكنك إضافتها لاحقاً أيضاً.",
  },
  city: { en: "City", es: "Ciudad", ar: "المدينة" },
  county: { en: "County", es: "Condado", ar: "المقاطعة" },
  householdSize: { en: "Household size", es: "Tamaño del hogar", ar: "عدد أفراد الأسرة" },
  annualIncome: { en: "Annual income", es: "Ingreso anual", ar: "الدخل السنوي" },
  creditEstimate: { en: "Credit (estimate)", es: "Crédito (estimado)", ar: "الائتمان (تقديري)" },
  firstTimeBuyerQ: { en: "First-time buyer?", es: "¿Comprador por primera vez?", ar: "هل تشتري لأول مرة؟" },
  notSure: { en: "Not sure", es: "No estoy seguro", ar: "غير متأكد" },
  yes: { en: "Yes", es: "Sí", ar: "نعم" },
  no: { en: "No", es: "No", ar: "لا" },
  createStart: { en: "Create profile & start →", es: "Crear perfil y empezar →", ar: "أنشئ الملف وابدأ →" },
  signInBtn: { en: "Sign in →", es: "Iniciar sesión →", ar: "تسجيل الدخول →" },
  pleaseWait: { en: "Please wait…", es: "Por favor espera…", ar: "يرجى الانتظار…" },
  haveProfile: { en: "Already have a profile?", es: "¿Ya tienes un perfil?", ar: "هل لديك ملف بالفعل؟" },
  signInLink: { en: "Sign in", es: "Inicia sesión", ar: "سجّل الدخول" },
  newHere: { en: "New here?", es: "¿Eres nuevo?", ar: "أنت جديد هنا؟" },
  createLink: { en: "Create your free profile", es: "Crea tu perfil gratuito", ar: "أنشئ ملفك المجاني" },
  nonprofitNote: {
    en: "Benjamin Rose is a nonprofit. Your information is used to support your housing goals — never sold.",
    es: "Benjamin Rose es una organización sin fines de lucro. Tu información se usa para apoyar tus metas de vivienda, nunca se vende.",
    ar: "Benjamin Rose منظمة غير ربحية. تُستخدم معلوماتك لدعم أهدافك السكنية - ولا تُباع أبداً.",
  },
  somethingWrong: { en: "Something went wrong", es: "Algo salió mal", ar: "حدث خطأ ما" },

  // ── Marketing header / footer ─────────────────────────────────────────────
  navResources: { en: "Resources", es: "Recursos", ar: "موارد" },
  navTakeClasses: { en: "Take the classes", es: "Tomar las clases", ar: "ابدأ الدروس" },
  navStaff: { en: "Staff sign in →", es: "Acceso del personal →", ar: "دخول الموظفين →" },
  footerBlurb: {
    en: "A nonprofit helping Ohioans reach and keep stable housing — serving the community since 1908.",
    es: "Una organización sin fines de lucro que ayuda a los habitantes de Ohio a lograr y mantener una vivienda estable, sirviendo a la comunidad desde 1908.",
    ar: "منظمة غير ربحية تساعد سكان أوهايو على بلوغ سكن مستقر والحفاظ عليه - نخدم المجتمع منذ عام 1908.",
  },
  footerPrograms: { en: "Programs", es: "Programas", ar: "البرامج" },
  footerProgEd: { en: "Homebuyer education", es: "Educación para compradores", ar: "تعليم مشتري المنازل" },
  footerProgDpa: { en: "Down-payment assistance", es: "Ayuda para el pago inicial", ar: "المساعدة في الدفعة الأولى" },
  footerProgResources: { en: "Housing resources", es: "Recursos de vivienda", ar: "موارد سكنية" },
  footerProgPartners: { en: "Lending partners", es: "Socios prestamistas", ar: "شركاء الإقراض" },
  footerProgReviews: { en: "Reviews", es: "Reseñas", ar: "التقييمات" },
  footerPartnership: { en: "Partnership", es: "Alianza", ar: "الشراكة" },
  footerPartnershipBody: {
    en: "In partnership with The Golden Group. HUD-approved housing counseling.",
    es: "En alianza con The Golden Group. Asesoría de vivienda aprobada por HUD.",
    ar: "بالشراكة مع The Golden Group. استشارات سكنية معتمدة من HUD.",
  },

  // ── Homepage ──────────────────────────────────────────────────────────────
  heroKicker: { en: "Free • Nonprofit • HUD-approved", es: "Gratis • Sin fines de lucro • Aprobado por HUD", ar: "مجاني • غير ربحي • معتمد من HUD" },
  heroTitle: {
    en: "A stable home is within reach — and we'll help you get there.",
    es: "Un hogar estable está a tu alcance, y te ayudaremos a lograrlo.",
    ar: "السكن المستقر في متناولك - وسنساعدك على الوصول إليه.",
  },
  heroSub: {
    en: "Benjamin Rose gives Ohioans the education, coaching, and connections to buy a home, keep the one they have, and build lasting financial stability — in your language and the way you learn best.",
    es: "Benjamin Rose ofrece a los habitantes de Ohio la educación, el acompañamiento y las conexiones para comprar una casa, conservar la que tienen y construir estabilidad financiera duradera, en tu idioma y como mejor aprendas.",
    ar: "يقدّم Benjamin Rose لسكان أوهايو التعليم والإرشاد والصلات لشراء منزل، والحفاظ على منزلهم الحالي، وبناء استقرار مالي دائم - بلغتك وبالطريقة التي تتعلّم بها أفضل.",
  },
  heroCtaStart: { en: "Start the free classes →", es: "Comenzar las clases gratis →", ar: "ابدأ الدروس المجانية →" },
  heroCtaSee: { en: "See assistance programs", es: "Ver programas de ayuda", ar: "اطّلع على برامج المساعدة" },
  heroChip1: { en: "✓ Free classes", es: "✓ Clases gratis", ar: "✓ دروس مجانية" },
  heroChip2: { en: "✓ Unlock down-payment help", es: "✓ Desbloquea ayuda inicial", ar: "✓ افتح المساعدة في الدفعة" },
  heroChip3: { en: "✓ One-on-one counseling", es: "✓ Asesoría personalizada", ar: "✓ استشارة فردية" },

  statPrograms: { en: "Ohio assistance programs we track for you", es: "Programas de ayuda de Ohio que seguimos para ti", ar: "برامج مساعدة في أوهايو نتابعها لك" },
  statHelp: { en: "in down-payment help available", es: "en ayuda para el pago inicial disponible", ar: "متاحة كمساعدة في الدفعة الأولى" },
  statEdRequired: { en: "programs require homebuyer education — our classes are the key", es: "programas requieren educación para compradores: nuestras clases son la clave", ar: "برامج تتطلب تعليم مشتري المنازل - دروسنا هي المفتاح" },
  stat1908: { en: "serving the community ever since", es: "sirviendo a la comunidad desde entonces", ar: "نخدم المجتمع منذ ذلك الحين" },

  stepsTitle: { en: "Your path to the front door", es: "Tu camino hacia la puerta de tu casa", ar: "طريقك إلى باب منزلك" },
  step1Title: { en: "Take the free classes", es: "Toma las clases gratis", ar: "خذ الدروس المجانية" },
  step1Body: { en: "Four short, self-paced classes — read or listen, in English, Spanish, or Arabic — with an AI coach to help you prepare.", es: "Cuatro clases breves a tu ritmo —lee o escucha, en inglés, español o árabe— con un coach de IA que te ayuda a prepararte.", ar: "أربعة دروس قصيرة وفق وتيرتك - اقرأ أو استمع، بالإنجليزية أو الإسبانية أو العربية - مع مدرّب ذكاء اصطناعي يساعدك على الاستعداد." },
  step2Title: { en: "Earn your certificate", es: "Obtén tu certificado", ar: "احصل على شهادتك" },
  step2Body: { en: "Pass each class quiz to earn your homebuyer education certificate — the document assistance programs ask for.", es: "Aprueba la prueba de cada clase para obtener tu certificado de educación para compradores, el documento que piden los programas de ayuda.", ar: "اجتَز اختبار كل درس للحصول على شهادة تعليم مشتري المنازل - الوثيقة التي تطلبها برامج المساعدة." },
  step3Title: { en: "Unlock assistance & buy", es: "Desbloquea ayuda y compra", ar: "افتح المساعدة واشترِ" },
  step3Body: { en: "Get matched to the Ohio down-payment programs you qualify for — and connect with a trusted agent.", es: "Encuentra los programas de pago inicial de Ohio para los que calificas y conéctate con un agente de confianza.", ar: "احصل على البرامج المناسبة لك في أوهايو للدفعة الأولى - وتواصل مع وكيل موثوق." },
  beginCta: { en: "Begin Day 1 — it's free →", es: "Comienza el Día 1 — es gratis →", ar: "ابدأ اليوم الأول - مجاناً →" },

  benefitsTitle: { en: "Why thousands of families start with Benjamin Rose", es: "Por qué miles de familias empiezan con Benjamin Rose", ar: "لماذا تبدأ آلاف العائلات مع Benjamin Rose" },
  benefit1Title: { en: "Free homebuyer education", es: "Educación gratuita para compradores", ar: "تعليم مجاني لمشتري المنازل" },
  benefit1Body: { en: "HUD-approved classes that unlock down-payment assistance worth thousands.", es: "Clases aprobadas por HUD que desbloquean miles en ayuda para el pago inicial.", ar: "دروس معتمدة من HUD تفتح آلافاً من المساعدة في الدفعة الأولى." },
  benefit2Title: { en: "Foreclosure prevention", es: "Prevención de ejecución hipotecaria", ar: "منع حبس الرهن" },
  benefit2Body: { en: "One-on-one counseling and a plan to keep you in your home.", es: "Asesoría personalizada y un plan para mantenerte en tu casa.", ar: "استشارة فردية وخطة لإبقائك في منزلك." },
  benefit3Title: { en: "Credit & financial coaching", es: "Coaching de crédito y finanzas", ar: "إرشاد الائتمان والمال" },
  benefit3Body: { en: "Practical steps to raise your score and build savings toward a home.", es: "Pasos prácticos para subir tu puntaje y ahorrar para una casa.", ar: "خطوات عملية لرفع درجتك وبناء مدخرات نحو منزل." },
  benefit4Title: { en: "A trusted partner", es: "Un socio de confianza", ar: "شريك موثوق" },
  benefit4Body: { en: "Graduate and get matched with a Golden Group agent ready to help you buy.", es: "Gradúate y conéctate con un agente de Golden Group listo para ayudarte a comprar.", ar: "تخرّج وتواصل مع وكيل من Golden Group مستعد لمساعدتك على الشراء." },

  tracksTitle: { en: "Wherever you're starting, there's a path", es: "Dondequiera que empieces, hay un camino", ar: "أينما بدأت، هناك طريق" },
  track1Title: { en: "I want to buy my first home", es: "Quiero comprar mi primera casa", ar: "أريد شراء منزلي الأول" },
  track1Body: { en: "Learn the whole process — budgeting, credit, mortgages, and closing — then get matched with assistance programs and an agent.", es: "Aprende todo el proceso —presupuesto, crédito, hipotecas y cierre— y luego conéctate con programas de ayuda y un agente.", ar: "تعلّم العملية كاملة - الميزانية والائتمان والرهن والإتمام - ثم تواصل مع برامج المساعدة ووكيل." },
  track2Title: { en: "I'm worried about losing my home", es: "Me preocupa perder mi casa", ar: "أخشى فقدان منزلي" },
  track2Body: { en: "Talk to a counselor today. We'll review your options with your servicer and build a plan to stay housed.", es: "Habla con un asesor hoy. Revisaremos tus opciones con tu prestamista y crearemos un plan para mantenerte con vivienda.", ar: "تحدّث مع مستشار اليوم. سنراجع خياراتك مع جهة الإقراض ونبني خطة لبقائك في سكنك." },
  track3Title: { en: "I need to fix my credit first", es: "Primero necesito arreglar mi crédito", ar: "أحتاج أولاً إلى إصلاح ائتماني" },
  track3Body: { en: "A coach helps you raise your score step by step, until you're ready to qualify for a mortgage and DPA.", es: "Un coach te ayuda a subir tu puntaje paso a paso, hasta que puedas calificar para una hipoteca y ayuda inicial.", ar: "يساعدك مدرّب على رفع درجتك خطوة بخطوة، حتى تصبح مؤهلاً للرهن والمساعدة في الدفعة." },

  a11yTitle: { en: "Learn the way that works for you", es: "Aprende de la manera que mejor te funcione", ar: "تعلّم بالطريقة التي تناسبك" },
  a11yBody: { en: "Everyone deserves housing information they can actually use. We deliver every module in multiple languages and formats — so you can listen, watch, read, or attend in person and pass each step with confidence.", es: "Todos merecen información de vivienda que realmente puedan usar. Entregamos cada módulo en varios idiomas y formatos, para que puedas escuchar, ver, leer o asistir en persona y avanzar con confianza.", ar: "يستحق الجميع معلومات سكنية يمكنهم استخدامها فعلاً. نقدّم كل وحدة بعدة لغات وصيغ - لتستمع أو تشاهد أو تقرأ أو تحضر شخصياً وتتخطّى كل خطوة بثقة." },
  formatsLabel: { en: "Formats", es: "Formatos", ar: "الصيغ" },
  languagesLabel: { en: "Languages", es: "Idiomas", ar: "اللغات" },

  ctaTitle: { en: "Ready to take the first step?", es: "¿Listo para dar el primer paso?", ar: "مستعد لاتخاذ الخطوة الأولى؟" },
  ctaBody: {
    en: "Ohio assistance programs are waiting — and every one starts with the education you can begin today. Join our newsletter for class schedules and the assistance you may qualify for.",
    es: "Los programas de ayuda de Ohio te esperan, y cada uno comienza con la educación que puedes empezar hoy. Únete a nuestro boletín para conocer horarios de clases y la ayuda a la que puedes calificar.",
    ar: "برامج المساعدة في أوهايو بانتظارك - وكلٌّ منها يبدأ بالتعليم الذي يمكنك بدؤه اليوم. اشترك في نشرتنا لمعرفة مواعيد الدروس والمساعدة التي قد تتأهل لها.",
  },

  // ── Assistance finder ─────────────────────────────────────────────────────
  fStepWhere: { en: "Where", es: "Dónde", ar: "أين" },
  fStepHousehold: { en: "Household", es: "Hogar", ar: "الأسرة" },
  fStepMoney: { en: "Money", es: "Dinero", ar: "المال" },
  fStepAbout: { en: "About you", es: "Sobre ti", ar: "عنك" },
  fBack: { en: "← Back", es: "← Atrás", ar: "→ رجوع" },
  fNext: { en: "Next →", es: "Siguiente →", ar: "التالي →" },

  fWhereTitle: { en: "Where are you looking to buy?", es: "¿Dónde buscas comprar?", ar: "أين تبحث عن الشراء؟" },
  fCounty: { en: "Ohio county", es: "Condado de Ohio", ar: "مقاطعة في أوهايو" },
  fCountyAny: { en: "I'm not sure yet / another county", es: "Aún no estoy seguro / otro condado", ar: "لست متأكداً بعد / مقاطعة أخرى" },
  fCountySuffix: { en: "County", es: "Condado", ar: "مقاطعة" },
  fWhereHelp: {
    en: "Statewide programs apply everywhere in Ohio — picking your county also surfaces local city and county programs, which are often the most generous.",
    es: "Los programas estatales aplican en todo Ohio; elegir tu condado también muestra programas locales de ciudad y condado, que suelen ser los más generosos.",
    ar: "تنطبق البرامج على مستوى الولاية في كل أوهايو - واختيار مقاطعتك يُظهر أيضاً برامج المدينة والمقاطعة المحلية، وهي غالباً الأكثر سخاءً.",
  },
  fHouseholdTitle: { en: "Tell us about your household", es: "Cuéntanos sobre tu hogar", ar: "أخبرنا عن أسرتك" },
  fPeople: { en: "People in your household", es: "Personas en tu hogar", ar: "عدد أفراد أسرتك" },
  fFirstHomeQ: { en: "Is this your first home?", es: "¿Es tu primera casa?", ar: "هل هذا منزلك الأول؟" },
  fFirstYes: { en: "Yes — first-time buyer", es: "Sí — comprador por primera vez", ar: "نعم - مشترٍ لأول مرة" },
  fFirstNo: { en: "No, I've owned before", es: "No, ya he sido propietario", ar: "لا، سبق أن امتلكت منزلاً" },
  fFirstTip: {
    en: "Tip: HUD counts you as “first-time” if you haven't owned a home in the last 3 years.",
    es: "Consejo: HUD te considera “primera vez” si no has tenido casa en los últimos 3 años.",
    ar: "نصيحة: يعدّك HUD “مشترياً لأول مرة” إذا لم تمتلك منزلاً خلال السنوات الثلاث الماضية.",
  },
  fMoneyTitle: { en: "Income & credit", es: "Ingresos y crédito", ar: "الدخل والائتمان" },
  fIncomeLabel: { en: "Total household income (per year, before taxes)", es: "Ingreso total del hogar (anual, antes de impuestos)", ar: "إجمالي دخل الأسرة (سنوياً، قبل الضرائب)" },
  fPerYear: { en: "/ year", es: "/ año", ar: "/ سنة" },
  fIncomeHelp: {
    en: "Leave blank if unsure — we'll show income limits to check instead of filtering you out.",
    es: "Déjalo en blanco si no estás seguro: te mostraremos los límites de ingresos en vez de descartarte.",
    ar: "اتركه فارغاً إن لم تكن متأكداً - سنعرض حدود الدخل لتتحقق بدلاً من استبعادك.",
  },
  fCreditQ: { en: "Your credit score, roughly", es: "Tu puntaje de crédito, aproximadamente", ar: "درجة ائتمانك، تقريباً" },
  fCreditUnsure: { en: "I'm not sure yet", es: "Aún no estoy seguro", ar: "لست متأكداً بعد" },
  fCreditRebuild: { en: "Below 580 (rebuilding)", es: "Menos de 580 (reconstruyendo)", ar: "أقل من 580 (إعادة بناء)" },
  fCreditFair: { en: "580–639 (fair)", es: "580–639 (regular)", ar: "‎580–639 (مقبول)" },
  fCreditGood: { en: "640–699 (good)", es: "640–699 (bueno)", ar: "‎640–699 (جيد)" },
  fCreditStrong: { en: "700+ (strong)", es: "700+ (fuerte)", ar: "‎+700 (قوي)" },
  fAboutTitle: { en: "Last two questions", es: "Últimas dos preguntas", ar: "آخر سؤالين" },
  fOccQ: { en: "Do you work in one of these roles? (some programs give extra help)", es: "¿Trabajas en uno de estos roles? (algunos programas dan ayuda extra)", ar: "هل تعمل في إحدى هذه المهن؟ (بعض البرامج تقدّم مساعدة إضافية)" },
  fOccNone: { en: "No / prefer not to say", es: "No / prefiero no decir", ar: "لا / أفضّل عدم القول" },
  fEdQ: { en: "Have you completed a HUD-approved homebuyer education course?", es: "¿Completaste un curso de educación para compradores aprobado por HUD?", ar: "هل أكملت دورة تعليم مشتري المنازل المعتمدة من HUD؟" },
  fEdYes: { en: "Yes — I have my certificate", es: "Sí — tengo mi certificado", ar: "نعم - لديّ شهادتي" },
  fEdNo: { en: "Not yet", es: "Aún no", ar: "ليس بعد" },
  fEdNote: {
    en: "Most programs require it — and our classes are free.",
    es: "La mayoría de los programas lo requieren, y nuestras clases son gratis.",
    ar: "تتطلبها معظم البرامج - ودروسنا مجانية.",
  },
  fEdNoteLink: { en: "Start Day 1", es: "Comienza el Día 1", ar: "ابدأ اليوم الأول" },
  fEdNoteAfter: { en: "while you explore.", es: "mientras exploras.", ar: "بينما تستكشف." },
  fFindBtn: { en: "Find my programs →", es: "Buscar mis programas →", ar: "ابحث عن برامجي →" },
  fSearching: { en: "Searching…", es: "Buscando…", ar: "جارٍ البحث…" },
  fResultsTitle: { en: "program(s) you may qualify for", es: "programa(s) para los que puedes calificar", ar: "برنامج/برامج قد تتأهل لها" },
  fScreenedFrom: { en: "Screened from {x} tracked Ohio programs · ranked by fit.", es: "Filtrado de {x} programas de Ohio · ordenados por afinidad.", ar: "تمت تصفيتها من {x} برنامجاً في أوهايو · مرتّبة حسب الملاءمة." },
  fChangeAnswers: { en: "Change my answers", es: "Cambiar mis respuestas", ar: "تغيير إجاباتي" },
  fNoMatch: {
    en: "No automatic matches with these answers — that doesn't mean nothing exists. A Benjamin Rose counselor can review programs with flexible or case-by-case terms with you, free.",
    es: "No hay coincidencias automáticas con estas respuestas, pero eso no significa que no exista nada. Un asesor de Benjamin Rose puede revisar contigo programas con términos flexibles, gratis.",
    ar: "لا توجد مطابقات تلقائية بهذه الإجابات - وهذا لا يعني عدم وجود شيء. يمكن لمستشار Benjamin Rose مراجعة برامج بشروط مرنة معك، مجاناً.",
  },
  fBestMatch: { en: "Best match", es: "Mejor coincidencia", ar: "أفضل تطابق" },
  fUnlocked: { en: "🎓 Unlocked by your certificate", es: "🎓 Desbloqueado por tu certificado", ar: "🎓 مفتوح بشهادتك" },
  fQualifyBecause: { en: "You qualify because", es: "Calificas porque", ar: "أنت مؤهل لأن" },
  fCheck: { en: "Check:", es: "Verifica:", ar: "تحقّق:" },
  fRepayment: { en: "Repayment:", es: "Pago:", ar: "السداد:" },
  fNextStep: { en: "Next step:", es: "Siguiente paso:", ar: "الخطوة التالية:" },
  fViewDetails: { en: "View details & how to apply →", es: "Ver detalles y cómo solicitar →", ar: "عرض التفاصيل وكيفية التقديم →" },
  fOfficialPage: { en: "Official page ↗", es: "Página oficial ↗", ar: "الصفحة الرسمية ↗" },
  fTakeToUnlock: { en: "Take the free classes to unlock →", es: "Toma las clases gratis para desbloquear →", ar: "خذ الدروس المجانية لفتحها →" },
  fVerified: { en: "Verified", es: "Verificado", ar: "تم التحقق" },
  fVerifyTitle: { en: "Always verify before you count on funds.", es: "Verifica siempre antes de contar con los fondos.", ar: "تحقّق دائماً قبل الاعتماد على الأموال." },
  fVerifyBody: {
    en: "Program terms and funding change during the year — the dates above show when each was last verified by our team. A Benjamin Rose counselor can confirm current availability and help you apply, free of charge.",
    es: "Los términos y fondos de los programas cambian durante el año; las fechas de arriba muestran la última verificación de nuestro equipo. Un asesor de Benjamin Rose puede confirmar la disponibilidad y ayudarte a solicitar, gratis.",
    ar: "تتغيّر شروط البرامج وتمويلها خلال العام - تُظهر التواريخ أعلاه آخر تحقق أجراه فريقنا. يمكن لمستشار Benjamin Rose تأكيد التوفّر الحالي ومساعدتك على التقديم، مجاناً.",
  },
  fStaffPrint: { en: "🖨 Print client scenario", es: "🖨 Imprimir escenario del cliente", ar: "🖨 طباعة سيناريو العميل" },

  aKicker: { en: "Free • No sign-up needed", es: "Gratis • Sin registro", ar: "مجاني • بدون تسجيل" },
  aTitle: { en: "Find your down-payment assistance", es: "Encuentra tu ayuda para el pago inicial", ar: "اعثر على مساعدتك في الدفعة الأولى" },
  aSubtitle: {
    en: "We track {n} Ohio programs — grants, forgivable loans, and more. Answer a few questions and see what you may qualify for, with plain-language reasons and exact next steps.",
    es: "Seguimos {n} programas de Ohio: subvenciones, préstamos condonables y más. Responde unas preguntas y ve para qué puedes calificar, con razones claras y los pasos exactos a seguir.",
    ar: "نتابع {n} برنامجاً في أوهايو - منح وقروض قابلة للإعفاء وغيرها. أجب عن بضعة أسئلة واطّلع على ما قد تتأهل له، بأسباب واضحة وخطوات تالية محددة.",
  },
  aReviewed: {
    en: "Reviewed regularly · most recent check {date}. Each result shows its own last-verified date.",
    es: "Revisado regularmente · última revisión {date}. Cada resultado muestra su propia fecha de verificación.",
    ar: "تتم مراجعتها بانتظام · آخر فحص {date}. يعرض كل نتيجة تاريخ التحقق الخاص بها.",
  },
};

/** Fill {token} placeholders in a translated string. */
export function fillPub(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function t(lang: LearnLang, key: keyof typeof PUB): string {
  return PUB[key]?.[lang] ?? PUB[key]?.en ?? String(key);
}
