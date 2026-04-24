export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  audioUrl?: string; // رابط ملف الصوت (اختياري)
  imageUrl?: string; // رابط الصورة (اختياري)
  isPresenterOnly?: boolean; // هل السؤال للمقدم فقط؟
  answerText?: string; // نص الإجابة للمقدم
  team?: 'X' | 'O'; // الفريق المستهدف (اختياري)
}

export const questions: Question[] = [
  {
    id: 1,
    text: "ما هو أسرع حيوان بري؟",
    options: ["الأسد", "الفهد", "النمر", "الفيل"],
    correctIndex: 1,
  },
  {
    id: 2,
    text: "من هو أول خليفة في الإسلام؟",
    options: ["عمر بن الخطاب", "أبو بكر الصديق", "عثمان بن عفان", "علي بن أبي طالب"],
    correctIndex: 1,
  },
  {
    id: 3,
    text: "ما هو الغاز الذي تحتاجه النباتات لصنع غذائها؟",
    options: ["الأكسجين", "ثاني أكسيد الكربون", "النيتروجين", "الهيدروجين"],
    correctIndex: 1,
  },
  {
    id: 4,
    text: "ما اسم الغار الذي اختبأ فيه النبي ﷺ؟",
    options: ["غار حراء", "غار ثور", "غار أحد", "غار النور"],
    correctIndex: 1,
  },
  {
    id: 5,
    text: "كم عدد الأسنان عند الإنسان البالغ؟",
    options: ["28", "30", "32", "34"],
    correctIndex: 2,
  },
  {
    id: 6,
    text: "ما هي السورة التي تسمى قلب القرآن؟",
    options: ["البقرة", "يس", "الرحمن", "الفاتحة"],
    correctIndex: 1,
  },
  {
    id: 7,
    text: "ما هي عاصمة إيطاليا؟",
    options: ["ميلان", "روما", "نابولي", "فلورنسا"],
    correctIndex: 1,
  },
  {
    id: 8,
    text: "من هو النبي الذي كلمه الله مباشرة؟",
    options: ["إبراهيم عليه السلام", "موسى عليه السلام", "عيسى عليه السلام", "نوح عليه السلام"],
    correctIndex: 1,
  },
  {
    id: 9,
    text: "كم عدد القارات في العالم؟",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
  },
  {
    id: 10,
    text: "ما هي أول قبلة للمسلمين؟",
    options: ["الكعبة", "المسجد الأقصى", "المسجد النبوي", "مسجد قباء"],
    correctIndex: 1,
  },
  {
    id: 11,
    text: "من هو مكتشف قانون الجاذبية؟",
    options: ["ألبرت أينشتاين", "إسحاق نيوتن", "غاليليو", "نيكولا تسلا"],
    correctIndex: 1,
  },
  {
    id: 12,
    text: "ما هي السورة التي لا تبدأ بالبسملة؟",
    options: ["الأنفال", "التوبة", "يوسف", "الكهف"],
    correctIndex: 1,
  },
  {
    id: 13,
    text: "ما هو البحر الذي يفصل بين السعودية ومصر؟",
    options: ["البحر الأبيض المتوسط", "البحر الأحمر", "بحر العرب", "الخليج العربي"],
    correctIndex: 1,
  },
  {
    id: 14,
    text: "من هو أول مؤذن في الإسلام؟",
    options: ["أبو هريرة", "بلال بن رباح", "زيد بن ثابت", "عبد الله بن مسعود"],
    correctIndex: 1,
  },
  {
    id: 15,
    text: "ما هو المعدن المستخدم في صناعة الأسلاك الكهربائية؟",
    options: ["الحديد", "النحاس", "الألمنيوم", "الذهب"],
    correctIndex: 1,
  },
  {
    id: 16,
    text: "من هو الصحابي الذي لقب بالفاروق؟",
    options: ["علي بن أبي طالب", "عمر بن الخطاب", "خالد بن الوليد", "أبو عبيدة بن الجراح"],
    correctIndex: 1,
  },
  {
    id: 17,
    text: "ما اسم المجرة التي نعيش فيها؟",
    options: ["أندروميدا", "درب التبانة", "مجرة الحلزون", "مجرة القوس"],
    correctIndex: 1,
  },
  {
    id: 18,
    text: "ما هي السورة التي تعدل ثلث القرآن؟",
    options: ["الفلق", "الإخلاص", "الناس", "الكوثر"],
    correctIndex: 1,
  },
  {
    id: 19,
    text: "كم عدد أجزاء القرآن الكريم؟",
    options: ["25", "30", "35", "40"],
    correctIndex: 1,
  },
  {
    id: 20,
    text: "ما هو أسرع طائر في العالم؟",
    options: ["النسر", "الصقر", "الحمام", "البومة"],
    correctIndex: 1,
  },
  {
    id: 21,
    text: "ما اسم المدينة التي هاجر إليها النبي ﷺ؟",
    options: ["مكة", "المدينة المنورة", "الطائف", "جدة"],
    correctIndex: 1,
  },
  {
    id: 22,
    text: "كم عدد ألوان قوس قزح؟",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
  },
  {
    id: 23,
    text: "ما اسم والد النبي ﷺ؟",
    options: ["أبو طالب", "عبد الله", "عبد المطلب", "حمزة"],
    correctIndex: 1,
  },
  {
    id: 24,
    text: "ما هي اللغة الرسمية في البرازيل؟",
    options: ["الإسبانية", "البرتغالية", "الفرنسية", "الإنجليزية"],
    correctIndex: 1,
  },
  {
    id: 25,
    text: "من هو النبي الذي بُعث إلى قوم عاد؟",
    options: ["صالح عليه السلام", "هود عليه السلام", "شعيب عليه السلام", "لوط عليه السلام"],
    correctIndex: 1,
  },
  {
    id: 26,
    text: "ما هو الحيوان الذي يلقب بسفينة الصحراء؟",
    options: ["الحصان", "الجمل", "الغزال", "الحمار"],
    correctIndex: 1,
  },
  {
    id: 27,
    text: "ما اسم زوجة فرعون التي آمنت؟",
    options: ["خديجة", "آسيا", "عائشة", "حفصة"],
    correctIndex: 1,
  },
  {
    id: 28,
    text: "ما هو ناتج 12 ÷ 3؟",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
  },
  {
    id: 29,
    text: "ما اسم أطول آية في القرآن؟",
    options: ["آية الكرسي", "آية الدين", "آية النور", "آية الصيام"],
    correctIndex: 1,
  },
  {
    id: 30,
    text: "طائر لا يستطيع الطيران؟",
    options: ["البطريق", "النعامة", "الدجاجة", "الكيوي"],
    correctIndex: 1,
  },
  {
    id: 31,
    text: "ما اسم الغزوة التي سميت بالأحزاب؟",
    options: ["بدر", "أحد", "الخندق", "حنين"],
    correctIndex: 2,
  },
  {
    id: 32,
    text: "ما هو اللون الرسمي لسجاد استقبال ضيوف الدولة في السعودية؟",
    options: ["الأحمر", "الأخضر", "الموف", "الأزرق"],
    correctIndex: 2,
  },
  {
    id: 33,
    text: "كم عدد العظام في جسم الإنسان البالغ؟",
    options: ["180", "206", "220", "250"],
    correctIndex: 1,
  },
  {
    id: 34,
    text: "من هو الصحابي الذي نام في فراش النبي ليلة الهجرة؟",
    options: ["عمر بن الخطاب", "علي بن أبي طالب", "الزبير بن العوام", "سعد بن أبي وقاص"],
    correctIndex: 1,
  },
  {
    id: 35,
    text: "ما هو أول عنصر في الجدول الدوري؟",
    options: ["الأكسجين", "الهيدروجين", "الكربون", "الهيليوم"],
    correctIndex: 1,
  },
  {
    id: 36,
    text: "ما اسم الجبل الذي نزل عليه الوحي؟",
    options: ["جبل أحد", "جبل النور", "جبل عرفات", "جبل ثور"],
    correctIndex: 1,
  },
  {
    id: 37,
    text: "من هو الرسام الذي رسم لوحة الموناليزا؟",
    options: ["بيكاسو", "ليوناردو دافنشي", "فان جوخ", "رامبرانت"],
    correctIndex: 1,
  },
  {
    id: 38,
    text: "كم عدد أبواب الجنة؟",
    options: ["6", "7", "8", "9"],
    correctIndex: 2,
  },
  {
    id: 39,
    text: "ما هو أكبر محيط في العالم؟",
    options: ["الأطلسي", "الهندي", "الهادئ", "المتجمد الشمالي"],
    correctIndex: 2,
  },
  {
    id: 40,
    text: "ما هي أول آية نزلت من القرآن؟",
    options: ["المدثر", "اقرأ باسم ربك الذي خلق", "الفاتحة", "القلم"],
    correctIndex: 1,
  },
  {
    id: 41,
    text: "ما هي المادة التي تتجمد عند 0 درجة مئوية؟",
    options: ["الزيت", "الماء", "الكحول", "الزئبق"],
    correctIndex: 1,
  },
  {
    id: 42,
    text: "ما هو أطول عظم في جسم الإنسان؟",
    options: ["عظم الذراع", "عظم الفخذ", "عظم الساق", "عظم الترقوة"],
    correctIndex: 1,
  },
  {
    id: 43,
    text: "ما هي وحدة قياس شدة التيار الكهربائي؟",
    options: ["الفولت", "الأمبير", "الواط", "الأوم"],
    correctIndex: 1,
  },
  {
    id: 44,
    text: "ما اسم الغزوة التي انتصر فيها المسلمون رغم قلة عددهم؟",
    options: ["أحد", "بدر", "الخندق", "تبوك"],
    correctIndex: 1,
  },
  {
    id: 45,
    text: "اسم نبي إذا غيرت حرفًا أصبح اسم دولة عربية؟",
    options: ["يونس", "نوح", "موسى", "لوط"],
    correctIndex: 0,
  },
  {
    id: 46,
    text: "ما اسم كوكب الأرض بالإنجليزية؟",
    options: ["Erath", "Earth", "Eerth", "Arth"],
    correctIndex: 1,
  },
  {
    id: 47,
    text: "ما هو الاسم العلمي لمرض سرطان الدم؟",
    options: ["اللوكيميا", "الهيموفيليا", "الأنيميا", "السرطان اللمفاوي"],
    correctIndex: 0,
  },
  {
    id: 48,
    text: "بماذا يلقب كوكب نبتون؟",
    options: ["الكوكب الأحمر", "الكوكب الأزرق", "الكوكب البارد", "الكوكب العملاق"],
    correctIndex: 2,
  },
  {
    id: 49,
    text: "ماهي أندر فصيلة دم؟",
    options: ["O سالب", "AB موجب", "AB سالب", "B سالب"],
    correctIndex: 2,
  },
  {
    id: 50,
    text: "ماهو العضو الوحيد في جسم الإنسان القادر على النمو من جديد بعد قطع جزء منه؟",
    options: ["القلب", "الكبد", "الرئة", "الدماغ"],
    correctIndex: 1,
  },
  {
    id: 51,
    text: "ماهو الحيوان الذي يعد من أذكى الحيوانات؟",
    options: ["القرد", "الدولفين", "الفيل", "الكلب"],
    correctIndex: 1,
  },
  {
    id: 52,
    text: "ماهو اللون الناتج عن خلط الأحمر مع الأزرق؟",
    options: ["البرتقالي", "الأخضر", "البنفسجي", "البني"],
    correctIndex: 2,
  },
  {
    id: 53,
    text: "ما اسم الطبقة التي تحمي الأرض من الأشعة الضارة؟",
    options: ["طبقة الأوزون", "الغلاف الجوي", "طبقة النيتروجين", "طبقة السحب"],
    correctIndex: 0,
  },
  {
    id: 54,
    text: "أين توجد أصغر عظمة في جسم الإنسان؟",
    options: ["الأنف", "الأذن", "اليد", "القدم"],
    correctIndex: 1,
  },
  {
    id: 55,
    text: "ماذا تسمى المنطقة في الفضاء التي تمتلك قوة جذب هائلة؟",
    options: ["النجم النيوتروني", "الثقب الأسود", "المجرة", "الكويكب"],
    correctIndex: 1,
  },
  {
    id: 56,
    text: "ماهي القارة التي تُعرف باسم أنتاركتيكا؟",
    options: ["أوروبا", "آسيا", "القارة القطبية الجنوبية", "أمريكا الجنوبية"],
    correctIndex: 2,
  },
  {
    id: 57,
    text: "أي من الأعداد التالية يقبل القسمة على ٣ دون باقي؟",
    options: ["١٢", "٥", "٨", "١٣"],
    correctIndex: 0,
  },
  {
    id: 58,
    text: "أي من الكائنات التالية لا يبيض؟",
    options: ["الخفاش", "الدجاجة", "النعامة", "البطريق"],
    correctIndex: 0,
  },
  {
    id: 59,
    text: "ماذا يُطلق على صوت الأفعى؟",
    options: ["زئير", "نباح", "فحيح", "صهيل"],
    correctIndex: 2,
  },
  {
    id: 60,
    text: "ماهي العملة الرسمية لدولة اليابان؟",
    options: ["اليوان", "الين", "الوون", "الدولار"],
    correctIndex: 1,
  },
  {
    id: 61,
    text: "ماهو لون حجر الزمرد؟",
    options: ["الأزرق", "الأخضر", "الأحمر", "الأصفر"],
    correctIndex: 1,
  },
  {
    id: 62,
    text: "ماهي الدولة التي تُعد الموطن الأصلي لحيوان الكنغر؟",
    options: ["البرازيل", "أستراليا", "الهند", "جنوب أفريقيا"],
    correctIndex: 1,
  },
  {
    id: 63,
    text: "من هو المنتخب الأكثر فوزًا بكأس العالم؟",
    options: ["ألمانيا", "الأرجنتين", "البرازيل", "إيطاليا"],
    correctIndex: 2,
  },
  {
    id: 64,
    text: "ما هو البيت الذي ليس فيه أبواب ولا نوافذ؟",
    options: ["بيت الشعر", "بيت العنكبوت", "بيت النمل", "بيت الدرج"],
    correctIndex: 0,
  },
  {
    id: 65,
    text: "ما هو الشيء الذي يكتب ولا يقرأ؟",
    options: ["الكتاب", "القلم", "الصحيفة", "الرسالة"],
    correctIndex: 1,
  },
  {
    id: 66,
    text: "ما هو الشيء الذي له عين واحدة ولكنه لا يرى؟",
    options: ["الإبرة", "النظارة", "المراة", "الكاميرا"],
    correctIndex: 0,
  },
  {
    id: 67,
    text: "ما هو الشيء الذي يحتوي على مدن بدون بيوت وجبال بدون أشجار وبحار بدون سمك؟",
    options: ["البوصلة", "الساعة", "الخريطة", "التلفاز"],
    correctIndex: 2,
  },
  {
    id: 68,
    text: "ما هو الشيء الذي تذبحه وتبكي عليه؟",
    options: ["الخروف", "البصل", "الدجاج", "السمك"],
    correctIndex: 1,
  },
  {
    id: 69,
    text: "ما هو الشيء الذي يتكلم بكل لغات العالم؟",
    options: ["المترجم", "الصدى", "الراديو", "الكتاب"],
    correctIndex: 1,
  },
  {
    id: 70,
    text: "ما هو الشيء الذي يقرصك ولا تراه؟",
    options: ["البعوضة", "النملة", "الجوع", "البرد"],
    correctIndex: 2,
  },
  {
    id: 71,
    text: "ما هو الشيء الذي يخترق الزجاج ولا يكسره؟",
    options: ["الضوء", "الماء", "الهواء", "الصوت"],
    correctIndex: 0,
  },
  {
    id: 72,
    text: "ما هو الشيء الذي إذا غليته جمد؟",
    options: ["الحليب", "الماء", "البيض", "الزيت"],
    correctIndex: 2,
  },
  {
    id: 73,
    text: "ما هو الشيء الذي له أرجل ولكنه لا يمشي؟",
    options: ["الكرسي", "السرير", "الباب", "النافذة"],
    correctIndex: 0,
  },
  {
    id: 74,
    text: "ما هو الشيء الذي لا يبتل حتى لو دخل الماء؟",
    options: ["السمك", "الضوء", "السفينة", "الصبغة"],
    correctIndex: 1,
  },
  {
    id: 75,
    text: "ما هو الشيء الذي كلما زاد نقص؟",
    options: ["العمر", "المال", "العلم", "القوة"],
    correctIndex: 0,
  },
  {
    id: 76,
    text: "ما هو الشيء الذي يمشي بلا أرجل ويدخل الأذن بلا صوت؟",
    options: ["الهواء", "الصوت", "الماء", "النور"],
    correctIndex: 1,
  },
  {
    id: 77,
    text: "ما هي الشجرة التي ليس لها ظل وليس لها ثمار؟",
    options: ["النخلة", "شجرة العائلة", "شجرة الزيتون", "شجرة السدر"],
    correctIndex: 1,
  },
  {
    id: 78,
    text: "ما هو الشيء الذي يمتلكه الفقير ويحتاجه الغني وإذا أكلته تموت؟",
    options: ["المال", "الذهب", "العدم (لا شيء)", "الصبر"],
    correctIndex: 2,
  },
  {
    id: 79,
    text: "ما هو الشيء الذي يكون أمامك دائماً ولكنك لا تراه؟",
    options: ["المستقبل", "الماضي", "الظل", "الخيال"],
    correctIndex: 0,
  },
  {
    id: 80,
    text: "ما هو الشيء الذي تسمعه وتراه ولا يسمعك ولا يراك؟",
    options: ["الراديو", "التلفاز", "الحائط", "الجبل"],
    correctIndex: 1,
  },
];

export const stage2Questions: Question[] = [
  {
    id: 1,
    text: "من هي الشخصية صاحبة هذا الصوت؟",
    audioUrl: "https://www.dropbox.com/scl/fi/6ceu1jlzpfqgu3xu47epa/.mp3?rlkey=4i8c4wv18j4w46tc7bj163ijg&st=b7eo361c&dl=0",
    options: ["ناصر القصبي", "عبدالله السدحان", "فايز المالكي", "حبيب الحبيب"],
    correctIndex: 0
  }
];

export const stage3Questions: Question[] = [
  {
    id: 301,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/ecc268721nafs6zacqrmq/Photo-17-04-2026-2-45-18-PM-1.png?rlkey=fdoc843l1sq1kltn7rloy8d3q&st=hq0fmgp8&raw=1",
    isPresenterOnly: true,
    answerText: "إيناس",
    team: 'X'
  },
  {
    id: 401,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/1btnl2nc4uvm353xspr91/Photo-17-04-2026-2-54-04-PM-2.png?rlkey=qdn4j1b26423rkupf5rmewttx&st=7le1z6j4&raw=1",
    isPresenterOnly: true,
    answerText: "جريش",
    team: 'X'
  },
  {
    id: 302,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/ogwmyyy858re2e2188c3n/Photo-17-04-2026-2-45-18-PM-2.png?rlkey=z6bmh2xi2i9glirm68rz8wg5j&st=u5wcf6t6&raw=1",
    isPresenterOnly: true,
    answerText: "ترف",
    team: 'X'
  },
  {
    id: 402,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/zfgi6c67tu7vpp6jnfiqn/Photo-17-04-2026-2-54-04-PM-1.png?rlkey=ihiy3cd4eyrwbhlapqjnys2t0&st=xjiglrt6&raw=1",
    isPresenterOnly: true,
    answerText: "كفته",
    team: 'X'
  },
  {
    id: 303,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/dfx61b8x5wf2uh7q2mk2b/Photo-17-04-2026-2-45-18-PM-3.png?rlkey=431dfa76kml9f97zhbddr6l96&st=fy56a7tk&raw=1",
    isPresenterOnly: true,
    answerText: "هتان",
    team: 'X'
  },
  {
    id: 403,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/4jq5ch14o7alto4v8c9ro/Photo-17-04-2026-2-54-04-PM-3.png?rlkey=vstp4i4viqv82b6u41jw3ynm1&st=0gfwtq2f&raw=1",
    isPresenterOnly: true,
    answerText: "كباب",
    team: 'X'
  },
  {
    id: 304,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/v5firoxshkclzvezla63l/Photo-17-04-2026-2-45-18-PM-4.png?rlkey=8t2sg3id89j1kb7vu7fpgiizn&st=tp25635w&raw=1",
    isPresenterOnly: true,
    answerText: "مروج",
    team: 'X'
  },
  {
    id: 404,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/kxf5oj74cvf5ykf1yhnre/Photo-17-04-2026-2-54-04-PM-4.png?rlkey=82cp8dp3lgommqc0wz0heehtn&st=i14pl4ym&raw=1",
    isPresenterOnly: true,
    answerText: "مقلوبة",
    team: 'X'
  },
  {
    id: 305,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/s8vev50k4j3hdpopjp6td/Photo-17-04-2026-2-45-18-PM-5.png?rlkey=vl8gohoppj0tsh24y3dn01tmb&st=ij6l633p&raw=1",
    isPresenterOnly: true,
    answerText: "بلقيس",
    team: 'X'
  },
  {
    id: 405,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/hhlqqbxayv9ge6yk0ojc1/Photo-17-04-2026-2-54-04-PM-5.png?rlkey=1jkytwqp72tc83wyqsy6nw9ol&st=ldbdru7u&raw=1",
    isPresenterOnly: true,
    answerText: "كبسة",
    team: 'X'
  },
  {
    id: 306,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/3ejney674ktljoo1ypax2/Photo-17-04-2026-2-45-19-PM.png?rlkey=kh6lzwugrc06d1vfoixqot35m&st=b53ikimo&raw=1",
    isPresenterOnly: true,
    answerText: "سعود",
    team: 'X'
  },
  {
    id: 406,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/9vv1a7mlmyrbpwm30c2ui/Photo-17-04-2026-2-54-04-PM.png?rlkey=47lup72tfnu4p9in6iszqoqak&st=y029kyxs&raw=1",
    isPresenterOnly: true,
    answerText: "شاورما",
    team: 'X'
  },
  {
    id: 501,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/hkvo68lhetilz5sabjcf8/Photo-17-04-2026-2-59-13-PM-1.png?rlkey=szgobegsu6fpcucxhqjzm79ek&st=jjr17ckr&raw=1",
    isPresenterOnly: true,
    answerText: "أمير",
    team: 'O'
  },
  {
    id: 601,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/afh6e8y938yobuw6g95le/Photo-17-04-2026-3-04-00-PM-1.png?rlkey=dgup7kqlzjf5gtovqz773hhro&st=hiunxkke&raw=1",
    isPresenterOnly: true,
    answerText: "جبن",
    team: 'O'
  },
  {
    id: 502,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/y63o4jt18agbzgs6lm08w/Photo-17-04-2026-2-59-13-PM-2.png?rlkey=61lp4u5pqs91jsojqfbxhc4xu&st=eel6xr16&raw=1",
    isPresenterOnly: true,
    answerText: "نوال",
    team: 'O'
  },
  {
    id: 602,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/ly89m19ajhoy1cpe2bl2o/Photo-17-04-2026-3-04-00-PM-2-1.png?rlkey=a8o0r4vp25hwskfs5t2d3h3df&st=pi076n6h&raw=1",
    isPresenterOnly: true,
    answerText: "كشري",
    team: 'O'
  },
  {
    id: 503,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/5aumlax1yxo6iubg3e2c2/Photo-17-04-2026-2-59-13-PM-3.png?rlkey=d1jky42kuwrjla4g643v71cc4&st=84v5m0l3&raw=1",
    isPresenterOnly: true,
    answerText: "سلطان",
    team: 'O'
  },
  {
    id: 603,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/yny5u593h1o94bb53vdi4/Photo-17-04-2026-3-04-00-PM-2.png?rlkey=ekci6i4k0k7l1lsgudqthjwm8&st=zvbyag4h&raw=1",
    isPresenterOnly: true,
    answerText: "شوفان",
    team: 'O'
  },
  {
    id: 504,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/41bcura61fup0s2cm5s1b/Photo-17-04-2026-2-59-13-PM-4.png?rlkey=d53levvfnh2bmfwmc2oqca7mb&st=26rymnck&raw=1",
    isPresenterOnly: true,
    answerText: "زيد",
    team: 'O'
  },
  {
    id: 604,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/99obtysf9j9armjyqxj0a/Photo-17-04-2026-3-04-00-PM-3.png?rlkey=xa6o4dkzsrmj74btl2zp0dh7m&st=ch6toa2i&raw=1",
    isPresenterOnly: true,
    answerText: "سبانخ",
    team: 'O'
  },
  {
    id: 505,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/f28oe11skdkr5s6psoj0y/Photo-17-04-2026-2-59-13-PM-5.png?rlkey=ajpwrnz9ygj9ufn1ttmo8bfhm&st=3hkwgk8o&raw=1",
    isPresenterOnly: true,
    answerText: "سنان",
    team: 'O'
  },
  {
    id: 605,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/wl20xujdrzp8hzkk7wumx/Photo-17-04-2026-3-04-00-PM-4.png?rlkey=eqknq6ivos7g8fzjs22r8l8jg&st=y4l9j4za&raw=1",
    isPresenterOnly: true,
    answerText: "طاجن",
    team: 'O'
  },
  {
    id: 506,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/xmt1i5y6uvb25aqm8ubt1/Photo-17-04-2026-2-59-13-PM-6.png?rlkey=oh16ishi7dfn2fw5ji293255w&st=ulkmuo5y&raw=1",
    isPresenterOnly: true,
    answerText: "سعد",
    team: 'O'
  },
  {
    id: 606,
    text: "ما اسم هذه الأكلة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/skjoyc7muz2g5ky1782v6/Photo-17-04-2026-3-04-00-PM.png?rlkey=tik9wv68a9yak2kgu09aazr1i&st=4xc5nzc9&raw=1",
    isPresenterOnly: true,
    answerText: "سمك",
    team: 'O'
  },
  {
    id: 507,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/2dk2g2cg9a5fk65gdm9ad/Photo-17-04-2026-2-59-13-PM.png?rlkey=h06xn6beuqfngr6n9rv2rm8pu&st=krappahj&raw=1",
    isPresenterOnly: true,
    answerText: "شاهين",
    team: 'O'
  },
  {
    id: 200,
    text: "من هي الشخصية في الصورة؟",
    options: [],
    correctIndex: -1,
    imageUrl: "https://www.dropbox.com/scl/fi/py88jyzahcmvbnigqaiv0/Photo-15-04-2026-1-27-15-AM.jpg?rlkey=7utb4q3cpmcercrjjojuvevkw&st=tnjzt674&raw=1",
  }
];
