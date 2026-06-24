import type { Localized } from "./content";

/**
 * Interactive podcast scripts — two hosts (Maya & Devon) talk through each day
 * in a natural, NotebookLM-style back-and-forth: reactions, contractions,
 * everyday analogies, short alternating turns. Every line is authored in all
 * three course languages, so the episode plays in the learner's language with
 * matching speech-synthesis voices. Learners can pause at any line and ask the
 * AI Coach, then resume.
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
          en: "Okay, so if you've ever looked at your bank account and just thought, where did it all go — this episode is for you.",
          es: "Bueno, si alguna vez miraste tu cuenta del banco y pensaste «¿a dónde se fue todo?», este episodio es para ti.",
          ar: "حسناً، إن سبق أن نظرت إلى حسابك البنكي وتساءلت «أين ذهب كل هذا؟» - فهذه الحلقة لك.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Ha, every month, honestly. I'm Devon, that's Maya, and today it's money management and credit — the stuff that actually gets you to a front door.",
          es: "Ja, cada mes, la verdad. Soy Devon, ella es Maya, y hoy hablamos de manejo del dinero y crédito: lo que de verdad te lleva a tu casa.",
          ar: "ها، كل شهر صراحةً. أنا ديفون، وهذه مايا، واليوم موضوعنا إدارة المال والائتمان - الأمور التي توصلك فعلاً إلى باب منزلك.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "So let's kill the scary word first. A budget. It's not a punishment — it's just a plan that tells your money where to go before it disappears.",
          es: "Empecemos por quitarle el miedo a la palabra. Presupuesto. No es un castigo, es solo un plan que le dice a tu dinero a dónde ir antes de que desaparezca.",
          ar: "لنُزِل الخوف من الكلمة أولاً. الميزانية. ليست عقاباً - إنها مجرد خطة تُخبر مالك إلى أين يذهب قبل أن يختفي.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Right, you're the boss giving every dollar a job. And step one is just knowing two numbers: what comes in, and what goes out.",
          es: "Exacto, tú eres el jefe que le da trabajo a cada dólar. Y el primer paso es saber dos números: lo que entra y lo que sale.",
          ar: "صحيح، أنت المدير الذي يعطي كل دولار مهمة. والخطوة الأولى هي معرفة رقمين: ما يدخل وما يخرج.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "And here's a trick — pull up your last bank statement and sort it. Rent and the car payment? Those are fixed, same every month. Groceries and gas? Those move around.",
          es: "Y un truco: abre tu último estado de cuenta y clasifícalo. ¿Renta y pago del auto? Son fijos, iguales cada mes. ¿Comida y gasolina? Esos varían.",
          ar: "وإليك حيلة - افتح آخر كشف حساب بنكي ورتّبه. الإيجار وقسط السيارة؟ ثابتة، نفسها كل شهر. البقالة والوقود؟ تلك تتغير.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "It's the little stuff that gets you. Five bucks here, a subscription there — by the end of the month it's real money.",
          es: "Son las cositas las que te atrapan. Cinco dólares aquí, una suscripción allá, y al final del mes es dinero de verdad.",
          ar: "الأشياء الصغيرة هي ما يوقعك. خمسة دولارات هنا، اشتراك هناك - وبنهاية الشهر يصبح مالاً حقيقياً.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "One number to tattoo on your brain: try to keep housing around thirty percent of your gross monthly income. Stay near that, and everything else breathes.",
          es: "Un número para grabarte: intenta mantener la vivienda en cerca del treinta por ciento de tu ingreso bruto mensual. Cerca de ahí, todo lo demás respira.",
          ar: "رقم احفظه جيداً: حاول إبقاء السكن عند نحو ثلاثين بالمئة من دخلك الشهري الإجمالي. ابقَ قربه، ويتنفس كل شيء آخر.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Okay, switching gears — credit. This is the one that makes people sweat. But your credit report is really just a report card for borrowing.",
          es: "Bien, cambiando de tema: el crédito. Este hace sudar a la gente. Pero tu informe de crédito es solo una boleta de calificaciones de cómo pides prestado.",
          ar: "حسناً، ننتقل إلى الائتمان. هذا ما يجعل الناس يتوترون. لكن تقرير ائتمانك هو في الحقيقة مجرد بطاقة تقييم لطريقة اقتراضك.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "And you can see your own report card for free, once a year, from all three bureaus — Equifax, Experian, TransUnion. Checking it yourself does not hurt your score.",
          es: "Y puedes ver tu boleta gratis, una vez al año, de las tres agencias: Equifax, Experian y TransUnion. Revisarla tú mismo no daña tu puntaje.",
          ar: "ويمكنك رؤية بطاقتك مجاناً، مرة سنوياً، من الوكالات الثلاث - إكويفاكس وإكسبيريان وترانس يونيون. ومراجعتها بنفسك لا تضر درجتك.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "So what actually moves the score? Number one, by a mile — paying your bills on time. That's it. That's the headline.",
          es: "¿Y qué mueve el puntaje? Lo número uno, por mucho: pagar tus cuentas a tiempo. Es eso. Ese es el titular.",
          ar: "إذاً ما الذي يحرّك الدرجة فعلاً؟ الأول بفارق كبير - دفع فواتيرك في موعدها. هذا كل شيء. هذا هو العنوان.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "After that it's how much of your available credit you're using — keep those card balances low. And why do we care so much? Because a lot of down-payment programs want a score around six-twenty to six-forty.",
          es: "Después es cuánto de tu crédito disponible usas: mantén bajos los saldos de las tarjetas. ¿Y por qué nos importa tanto? Porque muchos programas de ayuda piden un puntaje de unos 620 a 640.",
          ar: "بعد ذلك مقدار ما تستخدمه من ائتمانك المتاح - أبقِ أرصدة البطاقات منخفضة. ولماذا نهتم لهذا الحد؟ لأن كثيراً من برامج الدعم تطلب درجة بين 620 و640.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "That score is your ticket to free money for your down payment. Steady habits, that's the whole secret.",
          es: "Ese puntaje es tu boleto al dinero gratis para tu pago inicial. Hábitos constantes, ese es todo el secreto.",
          ar: "تلك الدرجة هي تذكرتك إلى مال مجاني لدفعتك الأولى. عادات ثابتة، هذا هو السر كله.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Hit pause anytime and ask the Coach a question — seriously, that's what it's there for. Otherwise, go crush the Day 1 test. You've got this.",
          es: "Pausa cuando quieras y hazle una pregunta al Coach, en serio, para eso está. Si no, ve y arrasa con la prueba del Día 1. Tú puedes.",
          ar: "أوقف في أي وقت واسأل المدرب سؤالاً - حقاً، لهذا هو موجود. وإلا، اذهب وتفوّق في اختبار اليوم الأول. أنت قادر.",
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
          en: "Alright, today's the big scary one — mortgages. Maya, talk me down. What is a mortgage, really?",
          es: "Muy bien, hoy toca el tema temido: las hipotecas. Maya, tranquilízame. ¿Qué es una hipoteca, de verdad?",
          ar: "حسناً، اليوم الموضوع المخيف - الرهن العقاري. مايا، طمئنّي. ما هو الرهن العقاري حقاً؟",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "It's just a loan to buy a house. The catch is it's secured — meaning the house itself is the collateral. Stop paying, and the lender can take it back. That's foreclosure.",
          es: "Es solo un préstamo para comprar una casa. El detalle es que está garantizado: la casa misma es la garantía. Dejas de pagar y el prestamista la recupera. Eso es la ejecución hipotecaria.",
          ar: "إنه مجرد قرض لشراء منزل. لكن الفارق أنه مضمون - أي أن المنزل نفسه هو الضمانة. توقّف عن الدفع، ويستطيع المُقرض استرجاعه. هذا هو حبس الرهن.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "So the house is basically holding itself hostage. Good motivation to pick a payment you can actually live with.",
          es: "Así que la casa básicamente se toma a sí misma de rehén. Buena motivación para elegir un pago que de verdad puedas sostener.",
          ar: "إذاً المنزل عملياً يحتجز نفسه رهينة. حافز جيد لاختيار دفعة تستطيع تحمّلها فعلاً.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Exactly. Now, fixed versus adjustable. Fixed means your rate never changes — same payment for thirty years. An ARM can go up later. For most first-timers, boring and predictable wins.",
          es: "Exacto. Ahora, fija contra ajustable. Fija quiere decir que tu tasa nunca cambia: el mismo pago por treinta años. Una ARM puede subir después. Para la mayoría de los primerizos, gana lo aburrido y predecible.",
          ar: "تماماً. الآن، الثابتة مقابل المتغيرة. الثابتة تعني أن فائدتك لا تتغير أبداً - نفس الدفعة لثلاثين عاماً. أما المتغيرة فقد ترتفع لاحقاً. ولمعظم المبتدئين، يفوز الممل والمتوقع.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "And PMI — that one surprises people. If you put down less than twenty percent, you usually pay private mortgage insurance. And here's the kicker: it protects the lender, not you.",
          es: "Y el PMI, ese sorprende a la gente. Si das menos del veinte por ciento, normalmente pagas el seguro hipotecario privado. Y lo irónico: protege al prestamista, no a ti.",
          ar: "وتأمين PMI، هذا يفاجئ الناس. إذا دفعت أقل من عشرين بالمئة، تدفع عادةً تأمين الرهن الخاص. والمفارقة: إنه يحمي المُقرض، لا أنت.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "But the good news — it's not forever. Once you've got about twenty percent equity, you can ask to drop it and shrink your payment.",
          es: "Pero la buena noticia: no es para siempre. Cuando tienes cerca del veinte por ciento de plusvalía, puedes pedir quitarlo y bajar tu pago.",
          ar: "لكن الخبر السار: ليس إلى الأبد. بمجرد أن تملك نحو عشرين بالمئة من حقوق الملكية، يمكنك طلب إلغائه وتقليل دفعتك.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Okay, the magic numbers — twenty-nine and forty-one. Where do those come from?",
          es: "Bien, los números mágicos: veintinueve y cuarenta y uno. ¿De dónde salen?",
          ar: "حسناً، الرقمان السحريان - تسعة وعشرون وواحد وأربعون. من أين يأتيان؟",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "It's the lender's math. Housing should be around twenty-nine percent of your gross income, and housing plus all your other debt under forty-one. Plug in your numbers and you'll know your ceiling before you ever tour a house.",
          es: "Es el cálculo del prestamista. La vivienda cerca del veintinueve por ciento de tu ingreso bruto, y la vivienda más tus otras deudas bajo el cuarenta y uno. Pon tus números y sabrás tu tope antes de ver una sola casa.",
          ar: "إنه حساب المُقرض. السكن نحو تسعة وعشرين بالمئة من دخلك الإجمالي، والسكن مع بقية ديونك تحت واحد وأربعين. أدخل أرقامك وستعرف سقفك قبل أن تزور أي منزل.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "There's a calculator right in the lesson for that — play with it. And last thing, your rights: that Closing Disclosure has to be in your hands three business days before closing.",
          es: "Hay una calculadora en la lección para eso, juega con ella. Y lo último, tus derechos: esa Divulgación de Cierre debe estar en tus manos tres días hábiles antes del cierre.",
          ar: "هناك حاسبة في الدرس لذلك - جرّبها. وآخر شيء، حقوقك: يجب أن يكون إفصاح الإتمام بين يديك قبل ثلاثة أيام عمل من الإتمام.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "And nobody — nobody — can deny you a loan based on your race, religion, or where you're from. If a deal feels rushed or shady, walk away and call a counselor.",
          es: "Y nadie, nadie, puede negarte un préstamo por tu raza, religión o de dónde eres. Si un trato se siente apurado o turbio, retírate y llama a un asesor.",
          ar: "ولا أحد - لا أحد - يستطيع رفض قرضك بسبب عِرقك أو دينك أو أصلك. وإن بدا العرض متعجّلاً أو مريباً، انسحب واتصل بمستشار.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Stuck on any of it? Pause and ask the Coach. Then go pass that Day 2 test.",
          es: "¿Te atoraste en algo? Pausa y pregunta al Coach. Luego ve a aprobar la prueba del Día 2.",
          ar: "تعثّرت في شيء؟ أوقف واسأل المدرب. ثم اذهب واجتَز اختبار اليوم الثاني.",
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
          en: "This is the fun part — house hunting! But Devon, confession: this is also where people fall in love and lose their minds a little.",
          es: "¡Esta es la parte divertida, buscar casa! Pero Devon, confesión: aquí también es donde la gente se enamora y pierde un poco la cabeza.",
          ar: "هذا هو الجزء الممتع - البحث عن منزل! لكن يا ديفون، اعتراف: هنا أيضاً يقع الناس في الحب ويفقدون صوابهم قليلاً.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Oh, a hundred percent. So before you fall for the cute kitchen, make two lists: needs and wants. Needs are non-negotiable — enough bedrooms, safe area, a price inside your pre-approval.",
          es: "Ah, cien por ciento. Así que antes de caer por la cocina linda, haz dos listas: necesidades y deseos. Las necesidades no se negocian: suficientes recámaras, zona segura, un precio dentro de tu preaprobación.",
          ar: "آه، مئة بالمئة. لذا قبل أن تقع في حب المطبخ الجميل، اصنع قائمتين: احتياجات ورغبات. الاحتياجات لا تُناقش - غرف نوم كافية، حيّ آمن، سعر ضمن موافقتك المبدئية.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "And wants are the granite countertops and the soaking tub. Nice, but they don't pay the mortgage.",
          es: "Y los deseos son las encimeras de granito y la tina de remojo. Lindos, pero no pagan la hipoteca.",
          ar: "والرغبات هي أسطح الغرانيت وحوض الاستحمام. جميلة، لكنها لا تدفع الرهن.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "When you find the one, you make a written offer — with contingencies. Those are your escape hatches, like 'only if it passes inspection' or 'only if my loan comes through.'",
          es: "Cuando encuentras la indicada, haces una oferta por escrito, con contingencias. Esas son tus salidas de emergencia: «solo si pasa la inspección» o «solo si me aprueban el préstamo».",
          ar: "عندما تجد المنزل المنشود، تقدّم عرضاً مكتوباً - مع شروط وقائية. تلك مخارج أمانك، مثل «فقط إن اجتاز الفحص» أو «فقط إن حصلت على قرضي».",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "And you put down earnest money — a good-faith deposit that just sits safely in escrow until closing. It tells the seller you're serious.",
          es: "Y das un depósito de buena fe que se queda seguro en el escrow hasta el cierre. Le dice al vendedor que vas en serio.",
          ar: "وتدفع عربوناً - وديعة حسن نية تبقى بأمان في حساب الضمان حتى الإتمام. تُخبر البائع أنك جاد.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Okay, this next one is my soapbox. Once you're under contract — do not, I repeat, do not go buy a new car.",
          es: "Bien, este es mi sermón. Una vez bajo contrato, no, repito, no vayas a comprar un auto nuevo.",
          ar: "حسناً، هذه نقطتي التي أكررها. بمجرد توقيع العقد - لا، أكرر، لا تذهب لشراء سيارة جديدة.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Ha, the classic mistake! Lenders re-check your credit right before closing. New debt can literally cancel your loan the week you move in.",
          es: "¡Ja, el error clásico! Los prestamistas revisan tu crédito justo antes del cierre. Una deuda nueva puede cancelar tu préstamo la semana que te mudas.",
          ar: "ها، الخطأ الكلاسيكي! يعيد المُقرضون فحص ائتمانك قبيل الإتمام. والدين الجديد قد يُلغي قرضك حرفياً في أسبوع انتقالك.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "And please, never skip the inspection. A few hundred bucks gets a pro to check the roof, the wiring, the plumbing — and the inspector works for you, not the seller.",
          es: "Y por favor, nunca te saltes la inspección. Unos cientos de dólares hacen que un profesional revise el techo, la instalación eléctrica, la plomería, y el inspector trabaja para ti, no para el vendedor.",
          ar: "وأرجوك، لا تتخطَّ الفحص أبداً. بضع مئات من الدولارات تجعل خبيراً يفحص السقف والأسلاك والسباكة - والفاحص يعمل لصالحك، لا البائع.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "And if it turns up something ugly? Your contingency lets you renegotiate, ask for repairs, or just walk away with your deposit. That's the power you paid for.",
          es: "¿Y si aparece algo feo? Tu contingencia te deja renegociar, pedir reparaciones o simplemente retirarte con tu depósito. Ese es el poder que pagaste.",
          ar: "وإن ظهر شيء سيئ؟ شرطك الوقائي يتيح لك إعادة التفاوض أو طلب الإصلاحات أو الانسحاب مع عربونك. هذه هي القوة التي دفعت ثمنها.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "There's a put-the-steps-in-order game in the lesson — go try it. Questions? Pause and ask the Coach. See you at the Day 3 test.",
          es: "Hay un juego de ordenar los pasos en la lección, ve a probarlo. ¿Dudas? Pausa y pregunta al Coach. Nos vemos en la prueba del Día 3.",
          ar: "هناك لعبة ترتيب الخطوات في الدرس - جرّبها. أسئلة؟ أوقف واسأل المدرب. أراك في اختبار اليوم الثالث.",
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
          en: "Last day! You got the keys. Now the job changes from buying the house to keeping it. Maya, start us with insurance — why is it not optional?",
          es: "¡Último día! Tienes las llaves. Ahora el trabajo cambia de comprar la casa a conservarla. Maya, empieza con el seguro: ¿por qué no es opcional?",
          ar: "اليوم الأخير! حصلت على المفاتيح. الآن تتحوّل المهمة من شراء المنزل إلى الحفاظ عليه. مايا، ابدئي بالتأمين - لماذا ليس اختيارياً؟",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Because the lender won't let you close without it — the house is their collateral too, remember. And a good policy covers the building, your stuff inside, and if someone gets hurt on your property.",
          es: "Porque el prestamista no te deja cerrar sin él: la casa también es su garantía, recuerda. Y una buena póliza cubre la estructura, tus cosas adentro y si alguien se lastima en tu propiedad.",
          ar: "لأن المُقرض لن يدعك تُتمّ دون تأمين - فالمنزل ضمانته أيضاً، تذكّر. والوثيقة الجيدة تغطي المبنى وأغراضك بداخله وإن أُصيب أحد في عقارك.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "But read the fine print, because here's the gotcha — floods and earthquakes usually aren't covered. You need separate policies for those.",
          es: "Pero lee la letra chica, porque aquí está la trampa: las inundaciones y los terremotos normalmente no están cubiertos. Necesitas pólizas aparte para eso.",
          ar: "لكن اقرأ التفاصيل الدقيقة، فهنا المفاجأة - الفيضانات والزلازل عادةً غير مغطاة. تحتاج وثائق منفصلة لها.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "And think of your deductible like a dial. Crank it higher, your monthly premium drops — but you pay more out of pocket if something happens. Set it where your emergency fund can actually reach.",
          es: "Y piensa en tu deducible como una perilla. Súbelo y tu prima mensual baja, pero pagas más de tu bolsillo si pasa algo. Ponlo donde tu fondo de emergencia de verdad alcance.",
          ar: "وفكّر في مبلغ التحمّل كالمقبض. ارفعه فينخفض قسطك الشهري - لكنك تدفع أكثر من جيبك إن حدث شيء. اضبطه حيث يصل إليه صندوق طوارئك فعلاً.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "Pro tip: shop your insurance every year or two. Loyalty doesn't really pay here — three quotes can save you real money.",
          es: "Consejo: compara tu seguro cada uno o dos años. La lealtad no paga aquí, tres cotizaciones pueden ahorrarte dinero de verdad.",
          ar: "نصيحة: قارن تأمينك كل سنة أو سنتين. الولاء لا يُجزى هنا - ثلاثة عروض قد توفّر عليك مالاً حقيقياً.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Okay, maintenance. The trick is to think in seasons — gutters and roof in spring, the AC in summer, furnace in fall, pipes in winter. Little stuff, on a rhythm.",
          es: "Bien, el mantenimiento. El truco es pensar por temporadas: canaletas y techo en primavera, el aire en verano, la calefacción en otoño, las tuberías en invierno. Cositas, con ritmo.",
          ar: "حسناً، الصيانة. الحيلة أن تفكّر بالمواسم - المزاريب والسقف في الربيع، والتكييف في الصيف، والمدفأة في الخريف، والأنابيب في الشتاء. أشياء صغيرة، بإيقاع منتظم.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "And honestly, your house will tell you when something's wrong. Cold drafts, a musty smell, bugs, a utility bill that suddenly spikes — those aren't random. They're clues.",
          es: "Y la verdad, tu casa te avisa cuando algo anda mal. Corrientes frías, olor a humedad, insectos, una factura que de repente se dispara, no son al azar. Son pistas.",
          ar: "وصراحةً، سيُخبرك منزلك عندما يكون هناك خطب. تيارات باردة، رائحة عفن، حشرات، فاتورة تقفز فجأة - تلك ليست عشوائية. إنها أدلّة.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "And mold and pests aren't just gross — they're health issues. Catching moisture early protects your family, not just your wallet. A twenty-dollar tube of caulk beats a two-thousand-dollar repair.",
          es: "Y el moho y las plagas no solo dan asco, son problemas de salud. Atrapar la humedad a tiempo protege a tu familia, no solo tu bolsillo. Un sellador de veinte dólares le gana a una reparación de dos mil.",
          ar: "والعفن والآفات ليست مقززة فقط - إنها مشاكل صحية. معالجة الرطوبة مبكراً تحمي عائلتك، لا محفظتك فقط. أنبوب سدّ بعشرين دولاراً خير من إصلاح بألفي دولار.",
        },
      },
      {
        speaker: "devon",
        text: {
          en: "One last money move: ask your agent about tax abatement where you're buying. In some Ohio cities that's thousands off your property taxes.",
          es: "Un último movimiento de dinero: pregunta a tu agente por la reducción de impuestos donde compras. En algunas ciudades de Ohio son miles menos en impuestos.",
          ar: "خطوة مالية أخيرة: اسأل وكيلك عن الإعفاء الضريبي حيث تشتري. في بعض مدن أوهايو هذا يعني آلافاً أقل من ضرائب العقار.",
        },
      },
      {
        speaker: "maya",
        text: {
          en: "Pass this last test and you've finished the whole course — all four days. Honestly? You now know more than most buyers ever do. Go find your assistance and get those keys. We're rooting for you.",
          es: "Aprueba esta última prueba y habrás terminado todo el curso, los cuatro días. ¿La verdad? Ya sabes más que la mayoría de los compradores. Ve por tu ayuda y consigue esas llaves. Vamos contigo.",
          ar: "اجتَز هذا الاختبار الأخير وتكون قد أنهيت الدورة كاملة - الأيام الأربعة. وبصراحة؟ أنت الآن تعرف أكثر من معظم المشترين. اذهب وابحث عن دعمك واحصل على تلك المفاتيح. نحن نشجّعك.",
        },
      },
    ],
  },
];

export function episodeForDay(daySlug: string): PodcastEpisode | undefined {
  return PODCAST_EPISODES.find((e) => e.daySlug === daySlug);
}
