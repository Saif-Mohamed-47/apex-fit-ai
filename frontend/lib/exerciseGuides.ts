export interface ExerciseAlternativeItem {
  id: string;
  title: string;
  arabic_title: string;
  category: 'dumbbell' | 'machine' | 'cable' | 'bodyweight';
  category_label: string;
  image: string;
  target_muscle: string;
  why_choose: string;
  steps: {
    phase: string;
    description: string;
  }[];
  mistakes: string[];
  safety_note: string;
}

export interface ExerciseGuide {
  name: string;
  arabic_name: string;
  image: string;
  target_muscle: string;
  secondary_muscles: string;
  tempo: string;
  alternative: string;
  alternatives_list: ExerciseAlternativeItem[];
  steps: {
    phase: string;
    description: string;
  }[];
  mistakes: string[];
  safety_note: string;
  breathing: string;
}

export const EXERCISE_GUIDES: Record<string, ExerciseGuide> = {
  // ==================== PUSH DAY EXERCISES ====================
  'Bench Press': {
    name: 'Flat Barbell Bench Press',
    arabic_name: 'بنش برس مستوي بالبار (Flat Bench Press)',
    image: '/images/exercises/bench_press.jpg',
    target_muscle: 'عضلات الصدر الوسطى والكبرى (Pectoralis Major)',
    secondary_muscles: 'الكتف الأمامي (Anterior Deltoid) والترايسبس (Triceps)',
    tempo: '2.5 ثانية نزول سلس - ثانية لمس الصدر - ثانية دفع قوية',
    alternative: 'Dumbbell Flat Bench Press أو Chest Press Machine',
    alternatives_list: [
      {
        id: 'bench_dumbbell',
        title: 'Dumbbell Flat Bench Press',
        arabic_title: 'بنش مستوي بالدمبل (Dumbbell Bench Press)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_db_bench.png',
        target_muscle: 'عضلات الصدر مع حرية حركة كاملة للمفصل',
        why_choose: 'لو البار محجوز، أو لو بتعاني من آلام في الكتف ومحتاج مدى حركي أعمق ومرن.',
        steps: [
          {
            phase: '1. وضع البداية والتجهيز',
            description: 'اجلس على الدكة وضع الدمبلين فوق ركبتيك. ارجع بظهرك واستخدم ركبتيك لدفع الدمبلين لمستوى الصدر، مع ثبات القدمين وضم لوحي الكتف للخلف.'
          },
          {
            phase: '2. مسار النزول والإطالة',
            description: 'انزل بالدمبلين بتحكم وهدوء حتى مستوى الصدر، مع إبقاء الكوعين بزاوية 45-60 درجة لتحقيق استطالة آمنة لألياف الصدر.'
          },
          {
            phase: '3. الدفع وقوس الحركة',
            description: 'ادفع الدمبلين للأعلى وللداخل في قوس خفيف واعتصر الصدر في القمة دون خبط الدمبلين ببعضهما.'
          }
        ],
        mistakes: [
          'خبط الدمبلين ببعضهما في القمة يفقد التوتر العضلي.',
          'النزول الزائد عن الحد أسفل مستوى الصدر مما يجهد محفظة مفصل الكتف.',
          'فتح الكوعين بزاوية 90 درجة مع الرقبة.'
        ],
        safety_note: 'عند الانتهاء، ارفع ركبتيك واعد الدمبلين فوقهما لتنهض بأمان دون إلقاء الوزن على الأرض.'
      },
      {
        id: 'bench_machine',
        title: 'Chest Press Machine',
        arabic_title: 'جهاز دفع الصدر (Chest Press Machine)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_machine_chest_press.jpg',
        target_muscle: 'عزل الصدر بمسار موجه وآمن 100%',
        why_choose: 'لو مفيش حد يسندك (Spotter)، أو لو عايز توصل للفشل العضلي بأمان تام وبدون خوف من سقوط الوزن.',
        steps: [
          {
            phase: '1. ضبط الجهاز والجلوس',
            description: 'اضبط ارتفاع الكرسي ليكون المقبض بمحاذاة منتصف الصدر تماماً، مع إلصاق الظهر ولوحي الكتف بالمسند.'
          },
          {
            phase: '2. الدفع للأمام',
            description: 'ادفع المقابض للأمام بقوة عبر عضلات الصدر واعتصر في نهاية المدى دون قفل مفصل الكوع بعنف.'
          },
          {
            phase: '3. الرجوع السلبي المحكوم',
            description: 'ارجع بالمقابض ببطء لمدة 3 ثواني حتى تشعر بإطالة مريحة بالصدر قبل أن تصطدم أوزان الجهاز ببعضها.'
          }
        ],
        mistakes: [
          'رفع الأكتاف للأعلى باتجاه الأذنين أثناء الدفع.',
          'ترك الأوزان تصطدم بعنف بين كل تكرار والآخر.'
        ],
        safety_note: 'مسار الجهاز ثابت، فركز 100% على عصر الصدر والإحساس العضلي (Mind-Muscle Connection).'
      }
    ],
    steps: [
      {
        phase: '1. التثبيت ووضعية الظهر',
        description: 'استلقِ على الدكة مع ثبات القدمين بالكامل على الأرض. ضم لوحي الكتف للخلف ولأسفل (Retract Scapula) لعمل قوس طبيعي خفيف بأسفل الظهر.'
      },
      {
        phase: '2. مسار النزول (Bar Path)',
        description: 'امسك البار بقبضة أوسع قليلاً من الكتفين. انزل بالبار بمسار مقوس خفيف نحو خط أسفل الصدر/الحلمتين مع إبقاء الكوعين بزاوية 45-60 درجة مع الجذع.'
      },
      {
        phase: '3. الدفع والاستقرار',
        description: 'المس الصدر بخفة دون ضرب البار بالقفص الصدري، ثم ادفع البار للأعلى وللخلف قليلاً فوق الكتفين مع الحفاظ على ثبات لوحي الكتف ملتصقين بالدكة.'
      }
    ],
    mistakes: [
      'فتح الكوعين للخارج بزاوية 90 درجة (يسبب تمزق أوتار الكتف).',
      'رفع المقعدة أو القدمين عن الأرض أثناء الدفع.',
      'ارتداد البار وارتطامه بالقفص الصدري (Bounce).'
    ],
    safety_note: 'تأكد دائماً من وجود قفل الأوزان وشخص يساعدك (Spotter) عند تجربة أوزان ثقيلة.',
    breathing: 'شهيق مع نزول البار ← زفير مع دفع البار للأعلى عند نقطة المقاومة.'
  },

  'Incline Dumbbell Press': {
    name: 'Incline Dumbbell Press',
    arabic_name: 'بنش مائل بالدمبل للصدر العلوي (Incline DB Press)',
    image: '/images/exercises/incline_press.jpg',
    target_muscle: 'عضلات الصدر العلوي (Upper Chest / Clavicular Head)',
    secondary_muscles: 'الكتف الأمامي والترايسبس',
    tempo: '3 ثواني نزول - ثانية إطالة - ثانية دفع',
    alternative: 'Incline Barbell / Smith Press أو Incline Chest Machine',
    alternatives_list: [
      {
        id: 'incline_smith',
        title: 'Incline Barbell / Smith Press',
        arabic_title: 'بنش مائل بالسميث / بار (Incline Smith Press)',
        category: 'machine',
        category_label: 'بديل بالسميث / البار',
        image: '/images/exercises/alternatives/alt_incline_smith.jpg',
        target_muscle: 'الصدر العلوي مع إمكانية زيادة الأحمال التكيفية',
        why_choose: 'لو عايز ترفع أوزان أثقل بزيادة تدريجية في القوة العضلية بأمان.',
        steps: [
          {
            phase: '1. زاوية الدكة والتمركز',
            description: 'اضبط الدكة على زاوية 30 درجة وضعها تحت بار السميث بحيث ينزل البار أسفل الترقوة مباشرة.'
          },
          {
            phase: '2. النزول المحكوم',
            description: 'انزل بالبار حتى يقترب من أعلى الصدر مع إبقاء الكوعين بزاوية 45 درجة.'
          },
          {
            phase: '3. الدفع للأعلى',
            description: 'ادفع البار لأعلى واعتصر الصدر العلوي مع ثبات لوحي الكتف ملتصقين بالدكة.'
          }
        ],
        mistakes: ['ضبط الدكة بزاوية 60 درجة مما ينقل الحمل بالكامل للأكتاف.'],
        safety_note: 'زاوية 30 درجة هي الزاوية الذهبية لتفعيل ألياف الصدر العلوي دون إجهاد الأكتاف.'
      },
      {
        id: 'incline_machine',
        title: 'Incline Chest Machine Press',
        arabic_title: 'جهاز الصدر العلوي (Incline Chest Machine)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_machine_chest_press.jpg',
        target_muscle: 'عزل فائق لفصوص الصدر العلوية',
        why_choose: 'توفير مقاومة متصلة ومريحة جداً للمفاصل لعصر العضلة بأعلى تركيز.',
        steps: [
          {
            phase: '1. ضبط الكرسي',
            description: 'اضبط الكرسي ليكون المقبض عند مستوى الصدر العلوي.'
          },
          {
            phase: '2. الدفع للأعلى وللأمام',
            description: 'ادفع المقابض بسلاسة واعتصر في نهاية المدى الحركي.'
          },
          {
            phase: '3. الرجوع الهادئ',
            description: 'اهبط بالوزن ببطء لتحقيق استطالة كاملة.'
          }
        ],
        mistakes: ['تقديم الأكتاف للأمام عند نهاية الدفع.'],
        safety_note: 'حافظ على صدرك بارزاً للأمام طوال المجموعة.'
      }
    ],
    steps: [
      {
        phase: '1. ضبط زاوية الدكة',
        description: 'اضبط الدكة على زاوية 30 إلى 45 درجة كحد أقصى (الزاوية الأعلى ستنقل الحمل للأكتاف).'
      },
      {
        phase: '2. مسار الحركة',
        description: 'انزل بالدمبلز بتحكم حتى تشعر بإطالة كاملة في عضلات الصدر العلوي بجوار الإبطين.'
      },
      {
        phase: '3. العصر في القمة',
        description: 'ادفع الدمبلز للأعلى في قوس خفيف للداخل دون تصادم الدمبلين ببعضهما للحفاظ على التوتر العضلي.'
      }
    ],
    mistakes: [
      'خبط الدمبلين ببعضهما في القمة يفقد العضلة التوتر.',
      'ضبط الدكة على زاوية 60 درجة مما يجهد مفصل الكتف.'
    ],
    safety_note: 'استخدم ركبتيك لرفع الدمبلز لبداية الحركة لحماية مفصل الكتف من الالتواء.',
    breathing: 'شهيق أثناء الإطالة، زفير مع العصر للأعلى.'
  },

  'Cable Chest Flyes': {
    name: 'Cable Chest Flyes',
    arabic_name: 'تفتيح كابل للصدر (Cable Chest Flyes)',
    image: '/images/exercises/cable_flyes.jpg',
    target_muscle: 'عضلات الصدر بالكامل وعصر الفصوص الداخلية (Chest Flyes)',
    secondary_muscles: 'الكتف الأمامي والكور لتثبيت الوقفة',
    tempo: '2.5 ثانية فتح وإطالة - ثانيتان عصر كامل في المنتصف - ثانية غلق',
    alternative: 'Dumbbell Chest Flyes أو Pec Deck Machine Fly',
    alternatives_list: [
      {
        id: 'fly_dumbbell',
        title: 'Dumbbell Flat Bench Flyes',
        arabic_title: 'تفتيح بالدمبل مستوي (Dumbbell Flyes)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_db_flyes.jpg',
        target_muscle: 'إطالة ألياف الصدر العميقة وبناء المرونة',
        why_choose: 'لو جهاز الكابل مشغول، وعايز تمرين كلاسيكي رائع لإطالة الصدر.',
        steps: [
          {
            phase: '1. وضع البداية',
            description: 'استلقِ على الدكة وامسك الدمبلين فوق صدرك مع ثني طفيف وثابت في الكوعين.'
          },
          {
            phase: '2. الفتح العريض',
            description: 'افتح ذراعيك جانباً ببطء كأنك تعانق برميلاً كبيراً حتى مستوى الصدر فقط.'
          },
          {
            phase: '3. الضم والعصر',
            description: 'اجمع الدمبلين للأعلى واعتصر الصدر مع الحفاظ على ثني الكوع دون فرده.'
          }
        ],
        mistakes: ['فرد الكوعين 180 درجة مما يضع حملاً خطيراً على أوتار البايسبس والكتف.'],
        safety_note: 'استخدم وزناً خفيفاً للتحكم؛ التفتيح تمرين إطالة وعزل وليس تمرين قوة.'
      },
      {
        id: 'fly_pecdeck',
        title: 'Pec Deck Machine Fly',
        arabic_title: 'جهاز الفراشة للصدر (Pec Deck Fly)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_pec_deck.jpg',
        target_muscle: 'عزل فصوص الصدر وعصرها بأمان 100%',
        why_choose: 'تثبيت مسار الحركة تماماً والوصول لأقصى عصر بدون إجهاد الكوع أو المعصم.',
        steps: [
          {
            phase: '1. ضبط الجهاز',
            description: 'اجلس وألصق ظهرك بالمسند، واضبط وسائد الذراعين لتكون بمحاذاة منتصف الصدر.'
          },
          {
            phase: '2. ضم الذراعين',
            description: 'اجمع المقبضين أمام صدرك واعتصر بشدة لثانيتين كاملتين في القمة.'
          },
          {
            phase: '3. الفتح البطيء',
            description: 'افتح ذراعيك بهدوء لتحقيق إطالة ممتازة دون تجاوز خط الكتف.'
          }
        ],
        mistakes: ['ترك الأوزان تصطدم بسرعة وفقدان التوتر العضلي.'],
        safety_note: 'حافظ على صدرك شامخاً ومرفوعاً ولا تحنِ ظهرك للأمام أثناء الضم.'
      }
    ],
    steps: [
      {
        phase: '1. الوقفة والتثبيت',
        description: 'اضبط بكرات الكابل على مستوى الصدر أو أعلى قليلاً. تقدم خطوة للأمام مع ميل خفيف بالجذع وثني طفيف وثابت في الكوعين.'
      },
      {
        phase: '2. ضم الذراعين والعصر',
        description: 'اجمع المقبضين أمام منتصف صدرك واعتصر عضلات الصدر بشدة لمدة ثانيتين.'
      },
      {
        phase: '3. الإطالة العكسية المحكومة',
        description: 'افتح ذراعيك للخلف ببطء حتى تشعر بإطالة مريحة في عضلات الصدر دون تجاوز خط الكتف.'
      }
    ],
    mistakes: [
      'فرد الكوعين بالكامل بزاوية 180 درجة.',
      'استخدام وزن ثقيل يحول الحركة لتمرين دفع (Press).'
    ],
    safety_note: 'الحفاظ على ثني الكوع بزاوية 15 درجة طوال مسار الحركة يحمي أوتار البايسبس والكتف.',
    breathing: 'شهيق أثناء فتح الذراعين، زفير مع ضم اليدين وعصر الصدر.'
  },

  'Arnold Press': {
    name: 'Arnold Dumbbell Press',
    arabic_name: 'أرنولد بريس للكتف بالدمبل (Arnold Press)',
    image: '/images/exercises/arnold_press.jpg',
    target_muscle: 'الكتف الأمامي والجانبي مع تفعيل التدوير (Anterior & Lateral Deltoids)',
    secondary_muscles: 'الترابيس العليا والترايسبس وعضلات الروتاتور كاف',
    tempo: 'ثانية دفع وتدوير - ثانية ثبات في القمة - ثانيتان نزول وتدوير داخلي',
    alternative: 'Seated Dumbbell Shoulder Press أو Machine Shoulder Press',
    alternatives_list: [
      {
        id: 'arnold_db_seated',
        title: 'Seated Dumbbell Shoulder Press',
        arabic_title: 'دفع كتف جالس بالدمبل (Seated DB Press)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_seated_db_press.png',
        target_muscle: 'الكتف الأمامي في مسار دفع رأسي مباشر',
        why_choose: 'لو بتعاني من حساسية أو طقطقة في مفصل الكتف عند تدوير المعصم.',
        steps: [
          {
            phase: '1. وضع البداية',
            description: 'اجلس على دكة مستقيمة الظهر مع رفع الدمبلين لمستوى الأذنين وراحتي يديك للأمام.'
          },
          {
            phase: '2. الدفع الرأسي',
            description: 'ادفع الدمبلين عمودياً للأعلى حتى تقترب ذراعاك من الاستقامة دون قفل الكوع بعنف.'
          },
          {
            phase: '3. الهبوط المحكوم',
            description: 'انزل بالدمبلين ببطء لمستوى الأذنين مرة أخرى للحفاظ على التوتر.'
          }
        ],
        mistakes: ['تقويس أسفل الظهر للأمام بسبب ثقل الوزن.'],
        safety_note: 'حافظ على استقامة العمود الفقري ملتصقاً بمسند الدكة.'
      },
      {
        id: 'arnold_machine',
        title: 'Machine Shoulder Press',
        arabic_title: 'جهاز دفع الأكتاف (Machine Shoulder Press)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_machine_shoulder_press.jpg',
        target_muscle: 'عزل فصوص الكتف الأمامية بثبات وأمان فائق',
        why_choose: 'لو عايز تتمرن بأوزان جيدة بدون تشتيت توازن الدمبلز وبأمان تام على الرقبة.',
        steps: [
          {
            phase: '1. ضبط المقعد',
            description: 'اضبط الكرسي ليكون المقبض بمحاذاة شحمة الأذن عند بداية الحركة.'
          },
          {
            phase: '2. الدفع للأعلى',
            description: 'ادفع المقابض للأعلى بقوة الكتفين واعتصر في القمة.'
          },
          {
            phase: '3. الهبوط الهادئ',
            description: 'انزل بالأوزان بتحكم دون أن تصطدم ببعضها.'
          }
        ],
        mistakes: ['إمالة الرأس للأمام بشكل مبالغ فيه.'],
        safety_note: 'ثبات الجذع على المسند يلغي أي ضغط زائد على الفقرات القطنية.'
      }
    ],
    steps: [
      {
        phase: '1. وضع البداية (وضع أرنولد الأصلي)',
        description: 'اجلس على دكة مستقيمة الظهر. امسك الدمبلز أمام صدرك على مستوى الذقن مع توجيه راحتي يديك نحو وجهك (كما في قمة تمرين البايسبس).'
      },
      {
        phase: '2. الدوران والدفع للأعلى',
        description: 'ادفع الدمبلز للأعلى وفي نفس الوقت قم بتدوير معصميك للخارج 180 درجة بحيث تصبح راحتا يديك للأمام عند وصول الدمبلز لأعلى نقطة.'
      },
      {
        phase: '3. النزول والدوران العكسي',
        description: 'انزل بالدمبلز ببطء مع عكس مسار الدوران حتى تعود راحتا يديك لمواجهة وجهك أمام الصدر.'
      }
    ],
    mistakes: [
      'التسرع في الدوران مما يخل بتوازن المفصل.',
      'تقويس أسفل الظهر للأمام بسبب ثقل الوزن.',
      'ضرب الدمبلين في قمة الحركة.'
    ],
    safety_note: 'ابتكره أرنولد شوارزنيجر لتحفيز الرأس الأمامي والجانبي في حركة واحدة متكاملة؛ استخدم وزناً متوسطاً وتحكماً فائقاً.',
    breathing: 'شهيق قبل الدفع، زفير مع تدوير ودفع الدمبلز للأعلى.'
  },

  'Lateral Raises': {
    name: 'Dumbbell Lateral Raises',
    arabic_name: 'رفرفة كتف جانبي بالدمبل (Lateral Raises)',
    image: '/images/exercises/lateral_raises.jpg',
    target_muscle: 'عضلة الكتف الجانبية لتدوير وتوسيع الأكتاف (Lateral Deltoid)',
    secondary_muscles: 'الترابيس العليا والكور للتثبيت',
    tempo: 'ثانية رفع - ثانية ثبات كامل في القمة - ثانيتان نزول هادئ',
    alternative: 'Cable Lateral Raises أو Machine Lateral Raises',
    alternatives_list: [
      {
        id: 'lat_cable',
        title: 'Cable Lateral Raises',
        arabic_title: 'رفرفة جانبي بالكابل (Cable Lateral Raises)',
        category: 'cable',
        category_label: 'بديل بالكابل (Cable)',
        image: '/images/exercises/alternatives/alt_cable_lateral_raise.jpg',
        target_muscle: 'الكتف الجانبي مع توتر عضلي مستمر من بداية الحركة',
        why_choose: 'أفضل تمرين للكتف الجانبي على الإطلاق لأن الكابل يعطي مقاومة حتى عندما تكون يدك أسفل فخذك.',
        steps: [
          {
            phase: '1. التجهيز والوقفة',
            description: 'اضبط بكرة الكابل في أسفل نقطة وامسك المقبض بيدك البعيدة مع الميل قليلاً للخارج.'
          },
          {
            phase: '2. الرفع بالكوع',
            description: 'ارفع الكابل جانباً بقيادة الكوع حتى يوازي كتفك مع الحفاظ على ثني طفيف في المفصل.'
          },
          {
            phase: '3. الثبات والنزول',
            description: 'اثبت ثانية في القمة وانزل ببطء شديد لمقاومة سحب الكابل.'
          }
        ],
        mistakes: ['استخدام عزم الجسم أو رفع اليد أعلى من مستوى الكتف.'],
        safety_note: 'ركز على قيادة الحركة من خلال الكوع وليس الرسغ.'
      },
      {
        id: 'lat_machine',
        title: 'Machine Lateral Raises',
        arabic_title: 'جهاز الرفرفة الجانبي (Lateral Raise Machine)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_machine_shoulder_press.jpg',
        target_muscle: 'عزل فائق للكتف الجانبي بدون إشراك القبضة أو الرسغ',
        why_choose: 'لو بتعاني من تعب في قبضة اليد أو الساعد وعايز عزل نقي 100% للكتف.',
        steps: [
          {
            phase: '1. ضبط الارتفاع',
            description: 'اجلس وضع وسائد الجهاز على منتصف ذراعك العلوي بمحاذاة محور دوران الكتف.'
          },
          {
            phase: '2. الدفع للخارج',
            description: 'ادفع الوسائد للخارج وللأعلى حتى توازي الأرض واعتصر لثانية.'
          },
          {
            phase: '3. الهبوط',
            description: 'اهبط ببطء لتحقيق المدى الكامل.'
          }
        ],
        mistakes: ['رفع الكتفين للأعلى باتجاه الأذنين.'],
        safety_note: 'ثبت جذعك واعتمد كلياً على عضلات الدلتويد الجانبية.'
      }
    ],
    steps: [
      {
        phase: '1. الوقفة والمسكة',
        description: 'قف بقدمين بعرض الحوض مع ميل طفيف بالجذع للأمام (5-10 درجات) وثني طفيف في الكوعين.'
      },
      {
        phase: '2. الرفع بالأكواع وليس بالرسغ',
        description: 'ارفع الدمبلز للأطراف مع توجيه الحركة من الكوع وليس الرسغ حتى يصل الكوع لمستوى الكتف فقط.'
      },
      {
        phase: '3. النزول السلبي المحكوم',
        description: 'انزل بالدمبلز ببطء لمقاومة الجاذبية، وتوقف قبل أن يلمس الدمبلان فخذيك للحفاظ على التوتر العضلي.'
      }
    ],
    mistakes: [
      'أرجحة الظهر واستخدام أوزان ثقيلة.',
      'رفع الأيدي أعلى من مستوى الكتف مما يسبب احتكاكاً مؤلماً في المفصل.'
    ],
    safety_note: 'السر في تدوير الكتف الجانبي هو الوزن الخفيف (2-5 كجم) والتركيز والعزل التام.',
    breathing: 'زفير مع الرفع، شهيق مع النزول.'
  },

  'Triceps Pushdowns': {
    name: 'Cable Triceps Rope Pushdowns',
    arabic_name: 'سحب ترايسبس بالحبل على الكابل (Triceps Rope)',
    image: '/images/exercises/triceps_pushdown.jpg',
    target_muscle: 'عضلات الترايسبس - الرأس الجانبية والطويلة (Triceps Lateral & Long Head)',
    secondary_muscles: 'الساعد وعضلات الكور',
    tempo: 'ثانية دفع وفرد كامل - ثانية عصر وتفريق الحبل - ثانيتان صعود محكوم',
    alternative: 'Overhead Dumbbell Extension أو Straight Bar Cable Pushdown',
    alternatives_list: [
      {
        id: 'tri_db_overhead',
        title: 'Overhead Dumbbell Triceps Extension',
        arabic_title: 'تراي دمبل خلف الرأس (Overhead DB Triceps)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_overhead_triceps_db.jpg',
        target_muscle: 'الرأس الطويلة للترايسبس بأقصى استطالة ممكنة',
        why_choose: 'لو جهاز الكابل محجوز، وعايز تركز على تضخيم سمك الذراع الخلفي.',
        steps: [
          {
            phase: '1. الإمساك بالدمبل',
            description: 'اجلس على دكة مستنداً بظهرك. امسك دمبل بكلتا يديك تحت الحافة العلوية وافرد ذراعيك فوق رأسك.'
          },
          {
            phase: '2. النزول خلف الرأس',
            description: 'انزل بالدمبل ببطء خلف رأسك مع الحفاظ على الكوعين موجهين للسقف ولا تفتحهما للخارج.'
          },
          {
            phase: '3. الفرد للأعلى',
            description: 'ادفع الدمبل للأعلى حتى فرد الذراع بالكامل واعتصر الترايسبس.'
          }
        ],
        mistakes: ['فتح الكوعين للخارج بشكل مفرط مما يجهد المفصل.'],
        safety_note: 'تأكد من إحكام قبضة يديك حول الدمبل لتجنب انزلاقه خلف الرأس.'
      },
      {
        id: 'tri_straight_bar',
        title: 'Straight Bar Cable Pushdown',
        arabic_title: 'سحب تراي بالمسطرة (Straight Bar Pushdown)',
        category: 'cable',
        category_label: 'بديل بالكابل/المسطرة',
        image: '/images/exercises/alternatives/alt_straight_bar_pushdown.jpg',
        target_muscle: 'الرأس الخارجية والجانبية للترايسبس بأوزان أعلى',
        why_choose: 'المسطرة تتيح لك حمل أوزان أثقل وثبات أعلى من الحبل لبناء كتلة ضخمة.',
        steps: [
          {
            phase: '1. التثبيت',
            description: 'امسك المسطرة بقبضة علوية وثبت كوعيك بجانب جذعك تماماً.'
          },
          {
            phase: '2. الدفع لأسفل',
            description: 'ادفع المسطرة لأسفل حتى فرد الكوعين بالكامل واثبت ثانية.'
          },
          {
            phase: '3. الصعود لزاوية 90',
            description: 'اصعد بالمسطرة بهدوء حتى مستوى الصدر فقط دون تحريك الكوعين.'
          }
        ],
        mistakes: ['تحريك الكوعين للأمام وللخلف أثناء التكرارات.'],
        safety_note: 'عزل تام للترايسبس؛ لا تحرك سوى مفصل الكوع فقط.'
      }
    ],
    steps: [
      {
        phase: '1. التثبيت والوقفة',
        description: 'قف مواجهاً لجهاز الكابل مع ميل طفيف للأمام. ثبت كوعيك بجانب ضلوعك كالمفصلة المثبتة بالحائط.'
      },
      {
        phase: '2. الدفع وفصل طرفي الحبل',
        description: 'ادفع الحبل للأسفل حتى فرد الذراع بالكامل، ثم افرق طرفي الحبل للخارج عند نهاية الحركة لشد الرأس الخارجية للترايسبس.'
      },
      {
        phase: '3. الرجوع بزاوية 90 درجة',
        description: 'دع الساعد يصعد للأعلى حتى زاوية 90 درجة مع بقاء الكوعين ثابتين في موضعهما تماماً دون حركة للأمام.'
      }
    ],
    mistakes: [
      'تحريك الكوعين للأمام وللخلف أثناء التكرارات مما يشرك الأكتاف واللاتس.',
      'استخدام وزن زائد والانحناء بالوزن فوق الحبل.'
    ],
    safety_note: 'عزل تام للترايسبس؛ لا تحرك سوى مفصل الكوع فقط.',
    breathing: 'زفير عند فرد الذراع وعصر الترايسبس، شهيق عند الصعود.'
  },

  'Skull Crushers': {
    name: 'Lying Triceps Extensions (Skull Crushers)',
    arabic_name: 'ترايسبس فرنساوي بالبار الزجزاج (Skull Crushers)',
    image: '/images/exercises/skull_crushers.jpg',
    target_muscle: 'الرأس الطويلة لعضلة الترايسبس لتضخيم سمك الذراع (Long Head Triceps)',
    secondary_muscles: 'الساعد والكتف للتثبيت',
    tempo: '2.5 ثانية نزول هادئ خلف الرأس - ثانية دفع وانقباض',
    alternative: 'Dumbbell Skull Crushers أو Cable Overhead Extension',
    alternatives_list: [
      {
        id: 'skull_db',
        title: 'Dumbbell Skull Crushers',
        arabic_title: 'فرنساوي بالدمبلين على الدكة (Dumbbell Skull Crushers)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_db_skull_crushers.jpg',
        target_muscle: 'الرأس الطويلة مع راحة أكبر لمعصم وكوع اليد',
        why_choose: 'لو بار الزجزاج بيسبب لك وجع في المعصم، الدمبلز بتعطيك مسكة حيادية مريحة جداً.',
        steps: [
          {
            phase: '1. وضع البداية',
            description: 'استلقِ على الدكة وامسك دمبل في كل يد مع توجيه راحتي اليدين لبعضهما وثني الذراع للخلف قليلاً.'
          },
          {
            phase: '2. النزول بجانب الأذنين',
            description: 'انزل بالدمبلين بهدوء حتى يصلا بجانب أذنيك مع بقاء الكوعين متجهين للأعلى.'
          },
          {
            phase: '3. الفرد للأعلى',
            description: 'ادفع للأعلى بالاعتماد على الترايسبس حتى تستقيم الذراعان.'
          }
        ],
        mistakes: ['تحريك الكوعين للأمام أثناء الصعود.'],
        safety_note: 'تمرين ممتاز يريح أوتار المعصم بنسبة 100% مقارنة بالبار الثابت.'
      },
      {
        id: 'skull_cable',
        title: 'Cable Overhead Triceps Extension',
        arabic_title: 'تراي كابل خلف الرأس بالحبل (Cable Overhead Triceps)',
        category: 'cable',
        category_label: 'بديل بالكابل (Cable)',
        image: '/images/exercises/alternatives/alt_straight_bar_pushdown.jpg',
        target_muscle: 'إطالة وتوتر متصل في الرأس الطويلة للترايسبس',
        why_choose: 'أمان كامل من سقوط الأوزان على الوجه مع توتر عضلي دائم.',
        steps: [
          {
            phase: '1. التجهيز',
            description: 'اضبط الكابل على مستوى منخفض أو متوسط، تقدم خطوة للأمام وادفع الحبل فوق رأسك.'
          },
          {
            phase: '2. الانثناء والإطالة',
            description: 'دع يديك تنثنيان للخلف خلف رقبتك للشعور بإطالة عميقة في الترايسبس.'
          },
          {
            phase: '3. الفرد للأمام وللأعلى',
            description: 'افرد ذراعيك للأمام وللأعلى وافرق طرفي الحبل.'
          }
        ],
        mistakes: ['التأرجح بالجسم للأمام وللخلف.'],
        safety_note: 'ثبت قدميك جيداً في وضعية الطعن لتحقيق توازن صلب.'
      }
    ],
    steps: [
      {
        phase: '1. الاستلقاء والإمساك بالبار',
        description: 'استلقِ على دكة مستوية وامسك بار الزجزاج (EZ-Bar) بقبضة ضيقة مع فرد الذراعين بزاوية مائلة قليلاً للخلف نحو الرأس.'
      },
      {
        phase: '2. النزول نحو الجبهة / خلف الرأس',
        description: 'اثنِ الكوعين ببطء لتنزيل البار نحو قمة الجبهة أو خلف الرأس مباشرة مع الحفاظ على الكوعين متجهين للسقف دون فتح للخارج.'
      },
      {
        phase: '3. الفرد والعصر',
        description: 'ادفع البار للأعلى بالاعتماد كلياً على عضلات الترايسبس حتى تستقيم الذراعان دون قفل عنيف لمفصل الكوع.'
      }
    ],
    mistakes: [
      'فتح الكوعين للخارج بزاوية واسعة (يسبب التهاب أوتار الكوع).',
      'تحريك الذراع العلوي بالكامل بدلاً من ثني الساعد فقط.'
    ],
    safety_note: 'احرص على أداء التمرين ببار خفيف حتى تتقن المسار وتتجنب ملامسة البار لرأسك.',
    breathing: 'شهيق أثناء نزول البار خلف الرأس، زفير مع الدفع للأعلى.'
  },

  // ==================== PULL DAY EXERCISES ====================
  'Lat Pulldowns': {
    name: 'Wide-Grip Lat Pulldowns',
    arabic_name: 'سحب عالي واسع للمجنص (Lat Pulldowns)',
    image: '/images/exercises/lat_pulldown.jpg',
    target_muscle: 'عضلة الظهر العريضة والمجنص لتوسيع الظهر (Latissimus Dorsi)',
    secondary_muscles: 'عضلات الظهر الوسطى والترابيس والبايسبس والكتف الخلفي',
    tempo: 'ثانية سحب قوية - ثانية عصر أسفل الصدر - ثانيتان صعود محكوم',
    alternative: 'Wide-Grip Pull-Ups أو Machine Lat Pulldown',
    alternatives_list: [
      {
        id: 'lat_pullups',
        title: 'Wide-Grip Pull-Ups',
        arabic_title: 'عقلة واسعة بوزن الجسم (Wide-Grip Pull-Ups)',
        category: 'bodyweight',
        category_label: 'بديل بالوزن الحر/العقلة',
        image: '/images/exercises/alternatives/alt_pullups.jpg',
        target_muscle: 'بناء عرض الظهر العلوي وقوة السحب الوظيفية',
        why_choose: 'أقوى تمرين لبناء القوة البدنية الحقيقية والتحكم في وزن الجسم.',
        steps: [
          {
            phase: '1. التعلق والتثبيت',
            description: 'تعلق ببار العقلة بقبضة واسعة مع تفعيل لوحي الكتف للأسفل.'
          },
          {
            phase: '2. السحب بالصدر',
            description: 'اسحب صدرك باتجاه البار مع توجيه الكوعين للأسفل حتى يتجاوز ذقنك البار.'
          },
          {
            phase: '3. الهبوط الكامل',
            description: 'اهبط ببطء لتحقيق استطالة كاملة لألياف اللاتس.'
          }
        ],
        mistakes: ['التأرجح بأرجحة الأرجل بدون سيطرة عضلية.'],
        safety_note: 'استخدم أستك مساعدة إذا كنت مبتدئاً لبناء التكرارات بأمان.'
      },
      {
        id: 'lat_machine',
        title: 'Machine Lat Pulldown',
        arabic_title: 'جهاز سحب المجنص (Machine Lat Pulldown)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/lat_pulldown.jpg',
        target_muscle: 'عزل اللاتس بمسار ثابت',
        why_choose: 'مسار محدد يلغي أي اهتزاز أو تأرجح بالجسم لعزل العضلة 100%.',
        steps: [
          {
            phase: '1. التثبيت بالوسائد',
            description: 'اضبط وسائد الفخذين واجلس بصدر مفتوح للأعلى.'
          },
          {
            phase: '2. السحب للأسفل',
            description: 'اسحب المقابض للأسفل بتوجيه الكوعين لجيوب البنطال.'
          },
          {
            phase: '3. الرجوع المحكوم',
            description: 'اترك المقابض تصعد بهدوء للشعور بإطالة الظهر.'
          }
        ],
        mistakes: ['الانحناء الشديد للخلف أثناء السحب.'],
        safety_note: 'حافظ على ميل خفيف 10 درجات فقط وركز على سحب الأكواع.'
      }
    ],
    steps: [
      {
        phase: '1. التثبيت والمسكة',
        description: 'اضبط وسائد الفخذين لتثبيت جسمك بإحكام. امسك البار بقبضة أوسع من الكتفين بقليل مع ميل خفيف جداً للخلف (10-15 درجة) وصدر مفتوح.'
      },
      {
        phase: '2. حركة السحب الصحيحة',
        description: 'اسحب البار نحو أعلى عظمة الصدر عن طريق توجيه كوعيك للأسفل وللداخل باتجاه جيوب بنطالك مع اعتصار عضلات الظهر.'
      },
      {
        phase: '3. الإطالة العلوية الكاملة',
        description: 'اترك البار يصعد للأعلى ببطء وتحكم حتى تشعر بإطالة كاملة في عضلات اللاتس دون رفع المقعدة عن المقعد.'
      }
    ],
    mistakes: [
      'السحب خلف الرقبة (يسبب ضغطاً خطيراً على فقرات الرقبة وتمزق الكتف).',
      'التأرجح الشديد بالجسم واستخدام قوة الاندفاع.'
    ],
    safety_note: 'قُد الحركة دائماً بأكواعك للأسفل وليس بسحب يديك.',
    breathing: 'زفير أثناء سحب البار للصدر ← شهيق أثناء تركه يصعد للأعلى بتحكم.'
  },

  'Barbell Rows': {
    name: 'Bent-Over Barbell Rows',
    arabic_name: 'تجديف بالبار منحني لسمك الظهر (Barbell Rows)',
    image: '/images/exercises/barbell_rows.jpg',
    target_muscle: 'عضلات الظهر الوسطى والسمك العضلي (Rhomboids, Lats, Mid-Back)',
    secondary_muscles: 'الترابيس والبايسبس والقطنية والقبضة',
    tempo: 'ثانية سحب قوية - ثانية عصر في البطن - ثانيتان نزول محكوم',
    alternative: 'One-Arm Dumbbell Row أو T-Bar Row Machine',
    alternatives_list: [
      {
        id: 'row_dumbbell',
        title: 'One-Arm Dumbbell Row',
        arabic_title: 'تجديف دمبل فردي على الدكة (One-Arm DB Row)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_db_row.jpg',
        target_muscle: 'سمك الظهر واللاتس مع حماية كاملة لأسفل الظهر',
        why_choose: 'إسناد الركبة واليد على الدكة يلغي أي ضغط على الفقرات القطنية تماماً.',
        steps: [
          {
            phase: '1. الوقفة والتثبيت',
            description: 'ضع ركبة ويداً واحدة على الدكة، واجعل ظهرك موازياً للأرض مع إمساك دمبل باليد الحرة.'
          },
          {
            phase: '2. مسار السحب القوسي',
            description: 'اسحب الدمبل في مسار قوسي نحو جيب البنطال مع توجيه الكوع للأعلى والخلف واعتصار اللاتس.'
          },
          {
            phase: '3. الإطالة في القاع',
            description: 'انزل بالدمبل ببطء لتحقيق إطالة ممتازة دون تدوير الجذع.'
          }
        ],
        mistakes: ['تدوير الجذع لأعلى لرفع وزن زائد بالقصور الذاتي.'],
        safety_note: 'حافظ على استواء كتفيك بالتوازي مع الأرض طوال التكرارات.'
      },
      {
        id: 'row_tbar',
        title: 'T-Bar Row Machine',
        arabic_title: 'جهاز التي بار (T-Bar Row Machine)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_tbar_row.jpg',
        target_muscle: 'بناء سمك الظهر الأوسط بأوزان جبارة',
        why_choose: 'مسند الصدر أو المسار الثابت يتيح حمل أوزان ممتازة دون خوف من انحناء الظهر.',
        steps: [
          {
            phase: '1. التمركز',
            description: 'قف على منصة التي بار مع ثني الركبتين واستقامة الظهر وامسك المقابض.'
          },
          {
            phase: '2. السحب للصدر',
            description: 'اسحب المقابض نحو أسفل صدرك واعتصر لوحي الكتف معاً بقوة.'
          },
          {
            phase: '3. الهبوط المحكوم',
            description: 'انزل بالوزن بهدوء دون أن تدع كتفيك يستديران للأمام.'
          }
        ],
        mistakes: ['الوقوف مستقيماً والارتداد بالوزن.'],
        safety_note: 'اثبت في زاوية الانحناء ودع عضلات الظهر تقوم بكل العمل.'
      }
    ],
    steps: [
      {
        phase: '1. زاوية الانحناء والعمود الفقري',
        description: 'قف بعرض الحوض، انحنِ بجذعك للأمام بزاوية 45 درجة مع ثني طفيف في الركبتين واستقامة تامة في العمود الفقري والرقبة.'
      },
      {
        phase: '2. مسار السحب',
        description: 'اسحب البار نحو أسفل السرة مع توجيه الكوعين للخلف واعتصار لوحي الكتف معاً بقوة.'
      },
      {
        phase: '3. الهبوط المحكوم',
        description: 'انزل بالبار بهدوء حتى استطالة الظهر دون ترك كتفيك يتدليان للأمام أو يتقوس ظهرك.'
      }
    ],
    mistakes: [
      'تقوس أسفل الظهر أثناء السحب مما يحمل وزناً خطيراً على الفقرات القطنية.',
      'الوقوف مستقيماً أثناء الحركة واستخدام النفضة لرفع الوزن.'
    ],
    safety_note: 'اثبت كالصخرة في زاوية الانحناء؛ الحركة تأتي من المرفقين واللوحين فقط.',
    breathing: 'شهيق عند أسفل الحركة، زفير قوي مع سحب البار للبطن.'
  },

  'Seated Cable Rows': {
    name: 'Seated Cable Rows',
    arabic_name: 'سحب أرضي ضيق بالكابل لمنتصف الظهر (Seated Cable Row)',
    image: '/images/exercises/seated_cable_rows.jpg',
    target_muscle: 'عضلات الظهر الوسطى والترابيس الوسطى والسفلية (Mid-Back & Rhomboids)',
    secondary_muscles: 'اللاتس والكتف الخلفي والبايسبس',
    tempo: 'ثانية سحب - ثانيتان عصر لوحي الكتف - ثانيتان رجوع بإطالة كاملة',
    alternative: 'Chest-Supported Dumbbell Row أو Machine Seated Row',
    alternatives_list: [
      {
        id: 'cable_row_db',
        title: 'Chest-Supported Dumbbell Rows',
        arabic_title: 'تجديف دمبل مسنود بالصدر (Chest-Supported DB Row)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_chest_supported_row.jpg',
        target_muscle: 'الظهر الأوسط بدون أي إمكانية للغش أو التأرجح',
        why_choose: 'الاستناد على دكة مائلة 45 درجة يعزل الظهر تماماً ويحمي العمود الفقري 100%.',
        steps: [
          {
            phase: '1. الاستلقاء على الدكة',
            description: 'استلقِ بصدرك على دكة مائلة 45 درجة مع تدلي الذراعين بحرية وأنت ممسك بالدمبلين.'
          },
          {
            phase: '2. السحب للخلف',
            description: 'اسحب الدمبلين للخلف وللأعلى واعتصر لوحي الكتف معاً كالكماشة.'
          },
          {
            phase: '3. الهبوط',
            description: 'انزل بالدمبلين ببطء حتى استطالة الظهر.'
          }
        ],
        mistakes: ['رفع الصدر عن الدكة أثناء السحب.'],
        safety_note: 'حافظ على التصاق صدرك بالدكة طوال مدة الجولة.'
      },
      {
        id: 'cable_row_machine',
        title: 'Machine Seated Row',
        arabic_title: 'جهاز السحب الأفقي المدعوم (Machine Seated Row)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_cable_seated_row.png',
        target_muscle: 'عزل فائق لمنتصف الظهر بمسار نقي',
        why_choose: 'مسار موجه وثابت يركز على عضلات الرومبويدز والترابيس الوسطى.',
        steps: [
          {
            phase: '1. ضبط المسند',
            description: 'اضبط المسند ليلامس صدرك مع إمكانية الوصول للمقابض براحة.'
          },
          {
            phase: '2. السحب والعصر',
            description: 'اسحب المقابض للخلف مع إبراز الصدر للأمام وضم لوحي الكتف.'
          },
          {
            phase: '3. الإطالة',
            description: 'ارجع ببطء لتحقيق إطالة ممتازة.'
          }
        ],
        mistakes: ['رفع الأكتاف للأعلى باتجاه الأذنين.'],
        safety_note: 'قُد الحركة دائماً بالكوعين للخلف.'
      }
    ],
    steps: [
      {
        phase: '1. الجلوس والتجهيز',
        description: 'اجلس مع وضع القدمين على المنصة وثني طفيف في الركبتين. اسحب المقبض واجلس بظهر مفرود عمودي تماماً وصدر مرفوع.'
      },
      {
        phase: '2. السحب والعصر',
        description: 'اسحب المقبض نحو أسفل البطن مع رجوع الكوعين للخلف وضم لوحي الكتف معاً كالكماشة.'
      },
      {
        phase: '3. الإطالة دون انحناء',
        description: 'اترك الكابل يسحب ذراعيك للأمام ببطء لتحقيق إطالة ممتازة لعضلات الظهر دون ثني العمود الفقري للأمام.'
      }
    ],
    mistakes: [
      'التأرجح بالظهر للأمام وللخلف مثل التجديف بالقارب.',
      'رفع الأكتاف للأعلى باتجاه الأذنين.'
    ],
    safety_note: 'حافظ على ثبات الجذع مستقيماً بنسبة 90% ودع لوحي الكتف يقومان بالعمل.',
    breathing: 'زفير مع السحب للبطن، شهيق مع الرجوع للأمام.'
  },

  'Face Pulls': {
    name: 'Cable Face Pulls',
    arabic_name: 'فيس بول بالحبل للكتف الخلفي (Face Pulls)',
    image: '/images/exercises/face_pulls.jpg',
    target_muscle: 'الكتف الخلفي والترابيس الوسطى والروتاتور كاف (Rear Delts & Rotator Cuff)',
    secondary_muscles: 'عضلات أعلى الظهر والرقبة لتصحيح وضعية القوام',
    tempo: 'ثانية سحب وتدوير خارجي - ثانيتان ثبات في القمة - ثانيتان رجوع',
    alternative: 'Bent-Over Rear Delt Dumbbell Flyes أو Reverse Pec Deck Machine',
    alternatives_list: [
      {
        id: 'face_db',
        title: 'Bent-Over Rear Delt Dumbbell Flyes',
        arabic_title: 'رفرفة خلفي بالدمبل منحنياً (Bent-Over DB Rear Fly)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_db_flyes.jpg',
        target_muscle: 'عزل فصوص الكتف الخلفية بأوزان خفيفة',
        why_choose: 'لو جهاز الكابل محجوز، تمرين حر فعال جداً لعزل الكتف الخلفي.',
        steps: [
          {
            phase: '1. وضع الانحناء',
            description: 'انحنِ بجذعك للأمام حتى يقترب من التوازي مع الأرض، وامسك دمبلين خفيفين مع ثني طفيف في الكوعين.'
          },
          {
            phase: '2. الرفع للأطراف',
            description: 'ارفع الدمبلين جانباً كالأجنحة بالاعتماد على الكتف الخلفي حتى يوازيا الأرض.'
          },
          {
            phase: '3. الهبوط الهادئ',
            description: 'اهبط ببطء شديد دون أن تترك الدمبلين يرتطمان ببعضهما.'
          }
        ],
        mistakes: ['أرجحة الجذع للأعلى لرفع وزن ثقيل.'],
        safety_note: 'استخدم وزناً خفيفاً جداً (2-5 كجم) لعزل الكتف الخلفي دون تشغيل الظهر.'
      },
      {
        id: 'face_machine',
        title: 'Reverse Pec Deck Fly Machine',
        arabic_title: 'رفرفة خلفي على جهاز الفراشة (Reverse Pec Deck)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_reverse_pec_deck.jpg',
        target_muscle: 'أفضل عزل على الإطلاق للكتف الخلفي',
        why_choose: 'إلغاء أي إمكانية للغش وتثبيت الصدر على المسند لتركيز 100% على الكتف الخلفي.',
        steps: [
          {
            phase: '1. الجلوس والمسكة',
            description: 'اجلس مواجهاً لمسند جهاز الفراشة واضبط المقابض على مستوى الكتف.'
          },
          {
            phase: '2. الفتح للخلف',
            description: 'ادفع المقابض للخلف باستخدام كوعيك واعتصر الكتف الخلفي لثانيتين.'
          },
          {
            phase: '3. الرجوع البطيء',
            description: 'ارجع ببطء مع الحفاظ على التوتر العضلي.'
          }
        ],
        mistakes: ['ثني وفرد الكوعين أثناء التكرار؛ يجب تثبيت زاوية الكوع.'],
        safety_note: 'قُد الحركة من الأكواع وليس من المعصمين.'
      }
    ],
    steps: [
      {
        phase: '1. ضبط الكابل والمسكة',
        description: 'اضبط بكرة الكابل على مستوى العينين أو أعلى قليلاً. امسك طرفي الحبل بقبضة إبهامك للخلف (Thumb-Back Grip).'
      },
      {
        phase: '2. السحب نحو الوجه وتدوير اليدين',
        description: 'تراجع خطوة واسحب الحبل نحو مستوى عينيك وأنفك مع رفع الكوعين للأعلى وتدوير اليدين للخارج لتشكيل علامة (W) بذراعيك.'
      },
      {
        phase: '3. الثبات والرجوع',
        description: 'اثبت لثانيتين مع عصر الكتف الخلفي بقوة، ثم ارجع بالوزن ببطء وتحكم.'
      }
    ],
    mistakes: [
      'استخدام أوزان ثقيلة وسحب الحبل نحو الصدر بدلاً من الوجه.',
      'سقوط الكوعين لأسفل مما ينقل الحمل للظهر بدلاً من الكتف الخلفي.'
    ],
    safety_note: 'أهم تمرين لصحة الكتف وتعديل انحناء الظهر المكتبي (Forward Head Posture).',
    breathing: 'زفير مع سحب الحبل للوجه، شهيق مع العودة.'
  },

  'Bicep Curls': {
    name: 'Incline Dumbbell / Barbell Bicep Curls',
    arabic_name: 'تبادل بايسبس بالدمبل (Bicep Curls)',
    image: '/images/exercises/bicep_curls.jpg',
    target_muscle: 'عضلة البايسبس ذات الرأسين (Biceps Brachii)',
    secondary_muscles: 'عضلات الساعد والقبضة (Brachioradialis)',
    tempo: 'ثانية رفع مع عصر البايسبس - ثانيتان نزول سلبي هادئ',
    alternative: 'Barbell EZ-Curl أو Cable Bicep Curls',
    alternatives_list: [
      {
        id: 'curl_barbell',
        title: 'Barbell EZ-Curl',
        arabic_title: 'بايسبس بالبار الزجزاج (Barbell EZ-Curl)',
        category: 'dumbbell',
        category_label: 'بديل بالبار الزجزاج',
        image: '/images/exercises/alternatives/alt_ez_bar_curl.jpg',
        target_muscle: 'بناء كتلة عضلية ضخمة للبايسبس بأوزان أكبر',
        why_choose: 'انحناءات البار الزجزاج تحمي معصم اليد وتتيح رفع أوزان ممتازة.',
        steps: [
          {
            phase: '1. الوقفة والتثبيت',
            description: 'قف مستقيماً وثبت كوعيك بجانب ضلوعك مع إمساك البار بقبضة عرض الكتفين.'
          },
          {
            phase: '2. الثني للأعلى',
            description: 'اثنِ ذراعيك للأعلى بقوة واعتصر البايسبس في القمة دون تحريك الكوعين للأمام.'
          },
          {
            phase: '3. الهبوط السلبي',
            description: 'اهبط بالبار ببطء شديد حتى فرد الذراع بالكامل.'
          }
        ],
        mistakes: ['التأرجح بالظهر لرفع الوزن.'],
        safety_note: 'ثبت ظهرك كالحائط واجعل كل الحركة من مفصل الكوع فقط.'
      },
      {
        id: 'curl_cable',
        title: 'Cable Bicep Curls',
        arabic_title: 'بايسبس على الكابل (Cable Bicep Curls)',
        category: 'cable',
        category_label: 'بديل بالكابل (Cable)',
        image: '/images/exercises/alternatives/alt_cable_curl.jpg',
        target_muscle: 'توتر متصل في كامل المدى الحركي للبايسبس',
        why_choose: 'الكابل لا يفقد المقاومة أبداً حتى في قمة الحركة، مما يعطي ضخ دم خرافي (Pump).',
        steps: [
          {
            phase: '1. التمركز',
            description: 'قف أمام بكرة الكابل السفلية وامسك المسطرة أو المقابض.'
          },
          {
            phase: '2. الثني والعصر',
            description: 'اثنِ ذراعيك للأعلى واعتصر قمة البايسبس لثانية كاملة.'
          },
          {
            phase: '3. الرجوع',
            description: 'انزل بالوزن ببطء وتحكم.'
          }
        ],
        mistakes: ['ترك الكوعين يتحركان للأمام.'],
        safety_note: 'حافظ على ثبات الكوعين ملاصقين للخصر تماماً.'
      }
    ],
    steps: [
      {
        phase: '1. التثبيت والمسكة',
        description: 'قف أو اجلس مع إسناد الظهر. امسك الدمبلز بجانب جسمك مع ثبات الكوعين ملاصقين للخصر تماماً.'
      },
      {
        phase: '2. الرفع والتدوير (Supination)',
        description: 'اثنِ ذراعيك للأعلى مع تدوير المعصم للخارج بحيث يشير إبهامك للخارج في قمة الحركة لعصر قمة البايسبس.'
      },
      {
        phase: '3. النزول السلبي الكامل',
        description: 'انزل بالدمبلز ببطء حتى فرد الذراع بالكامل لتحقيق أقصى استطالة عضلية.'
      }
    ],
    mistakes: [
      'أرجحة الظهر واستخدام عزم الاندفاع لرفع الوزن.',
      'تحريك الكوعين للأمام مما يشرك الكتف الأمامي ويسلب الحمل من البايسبس.'
    ],
    safety_note: 'ثبت كوعيك كالمفصلة المثبتة بالحائط، كل الحركة يجب أن تكون من الساعد فقط.',
    breathing: 'زفير مع رفع الدمبلز، شهيق مع النزول.'
  },

  'Hammer Curls': {
    name: 'Dumbbell Hammer Curls',
    arabic_name: 'شاكوش بالدمبل لسمك الذراع والساعد (Hammer Curls)',
    image: '/images/exercises/hammer_curls.jpg',
    target_muscle: 'عضلة البراكياليس والساعد لتوسيع سمك الذراع (Brachialis & Forearms)',
    secondary_muscles: 'الرأس الطويلة للبايسبس والقبضة',
    tempo: 'ثانية رفع - ثانية ثبات في القمة - ثانيتان نزول محكوم',
    alternative: 'Cable Rope Hammer Curls أو Preacher Hammer Curls',
    alternatives_list: [
      {
        id: 'hammer_cable',
        title: 'Cable Rope Hammer Curls',
        arabic_title: 'شاكوش بالحبل على الكابل (Cable Rope Hammer)',
        category: 'cable',
        category_label: 'بديل بالكابل (Cable)',
        image: '/images/exercises/alternatives/alt_cable_rope_hammer.jpg',
        target_muscle: 'عضلة البراكياليس والساعد بمقاومة مستمرة',
        why_choose: 'سحب الحبل بمسكة رأسية يعطي توتراً مستمراً لتفجير سمك الذراع.',
        steps: [
          {
            phase: '1. المسكة',
            description: 'امسك طرفي الحبل بمسكة رأسية وثبت كوعيك بجوار الخصر.'
          },
          {
            phase: '2. السحب للأعلى',
            description: 'اسحب الحبل للأعلى وافرقه قليلاً في القمة مع عصر الساعد والبراكياليس.'
          },
          {
            phase: '3. النزول',
            description: 'اهبط ببطء لتحقيق استطالة كاملة.'
          }
        ],
        mistakes: ['تحريك الأكواع للأمام.'],
        safety_note: 'عزل تام؛ لا تحرك سوى الساعد فقط.'
      },
      {
        id: 'hammer_incline',
        title: 'Incline Dumbbell Hammer Curls',
        arabic_title: 'شاكوش بالدمبل على دكة مائلة (Incline DB Hammer)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/hammer_curls.jpg',
        target_muscle: 'الرأس الطويلة للبايسبس مع استطالة استثنائية',
        why_choose: 'إسناد الظهر على دكة مائلة يضع الذراع خلف الجسم مما يزيد من استطالة العضلة.',
        steps: [
          {
            phase: '1. الاستناد',
            description: 'اجلس على دكة مائلة 60 درجة ودع ذراعيك تتدليان بمسكة الشاكوش.'
          },
          {
            phase: '2. الرفع',
            description: 'ارفع الدمبلين للأعلى مع ثبات الكوعين للخلف.'
          },
          {
            phase: '3. الهبوط',
            description: 'انزل ببطء وتحكم كامل.'
          }
        ],
        mistakes: ['رفع الرأس عن الدكة.'],
        safety_note: 'حافظ على استرخاء رقبتك وثبات ظهرك.'
      }
    ],
    steps: [
      {
        phase: '1. المسكة الحيادية (Neutral Grip)',
        description: 'امسك الدمبلز بحيث تكون راحتا يديك متقابلتين كأنك تمسك شاكوشاً، مع استقامة الجذع وثبات الكوعين بجوار الخصر.'
      },
      {
        phase: '2. الرفع والعصر',
        description: 'ارفع الدمبلز للأعلى مع الحفاظ على المسكة الرأسية حتى تقترب من مستوى الكتف، واعتصر عضلات الساعد والبراكياليس.'
      },
      {
        phase: '3. النزول المحكوم',
        description: 'انزل بالدمبلز ببطء وتحكم حتى استقامة الذراع بالكامل.'
      }
    ],
    mistakes: [
      'تحريك الأكتاف للأمام لرفع وزن أثقل من طاقتك.',
      'التأرجح بالجسم للخلف.'
    ],
    safety_note: 'تمرين أساسي لمن يريد ذراعاً عريضاً ومفصل ساعد حديدياً.',
    breathing: 'زفير أثناء رفع الدمبل، شهيق أثناء النزول.'
  },

  // ==================== LEGS DAY EXERCISES ====================
  'Squats': {
    name: 'Barbell Back Squats',
    arabic_name: 'سكوات بالبار - ملك تمارين الأرجل (Barbell Squat)',
    image: '/images/exercises/squat.jpg',
    target_muscle: 'عضلات الفخذ الأمامية (Quads) والمؤخرة (Glutes)',
    secondary_muscles: 'أوتار الركبة (Hamstrings) والكور والعمود الفقري',
    tempo: '3 ثواني نزول هادئ - ثانية ثبات في القاع - ثانية صعود انفجاري',
    alternative: 'Goblet Squats أو Leg Press Machine',
    alternatives_list: [
      {
        id: 'squat_goblet',
        title: 'Goblet Dumbbell Squats',
        arabic_title: 'جوبلت سكوات بالدمبل (Goblet Squats)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_goblet_squat.jpg',
        target_muscle: 'عضلات الفخذ الأمامية والأرداف مع أمان 100% للظهر',
        why_choose: 'تمرين ممتاز للمبتدئين ولأي شخص يعاني من آلام في الرقبة أو أسفل الظهر من حمل البار.',
        steps: [
          {
            phase: '1. مسكة الدمبل والوقفة',
            description: 'امسك دمبل بشكل رأسي ملتصقاً بمنتصف صدرك بكلتا اليدين مع قف بعرض الكتفين وفتح أطراف القدمين للخارج.'
          },
          {
            phase: '2. النزول العميق',
            description: 'انزل بمؤخرتك لأسفل بين ساقيك مع إبقاء كوعيك للداخل وصدرك شامخاً حتى يتجاوز فخذك زاوية 90 درجة.'
          },
          {
            phase: '3. الدفع والصعود',
            description: 'ادفع الأرض بكعبيك للأعلى واعتصر الأرداف في القمة.'
          }
        ],
        mistakes: ['إبعاد الدمبل عن الصدر مما يحمل وزناً زائداً على أسفل الظهر.'],
        safety_note: 'الدمبل أمام الصدر يجبر عمودك الفقري تلقائياً على الاستقامة الطبيعية.'
      },
      {
        id: 'squat_legpress',
        title: 'Leg Press Machine',
        arabic_title: 'مكبس الأرجل (Leg Press Machine)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_leg_press.jpg',
        target_muscle: 'تفجير عضلات الكوادز بأوزان ثقيلة بدون أي ضغط على العمود الفقري',
        why_choose: 'لو عايز تبني كتلة ضخمة في الفخذ الأمامي بدون أي تحميل على فقرات الظهر أو خطر فقدان التوازن.',
        steps: [
          {
            phase: '1. التمركز على المنصة',
            description: 'اجلس وألصق ظهرك بالمسند، وضع قدميك بعرض الكتفين في منتصف منصة المكبس.'
          },
          {
            phase: '2. النزول المحكوم',
            description: 'فك الأمان وانزل بالمنصة ببطء حتى تشكل ركبتاك زاوية 90 درجة دون أن ترتفع مقعدتك عن المقعد.'
          },
          {
            phase: '3. الدفع بالكعبين',
            description: 'ادفع المنصة للأعلى بكعبيك بقوة دون قفل مفصل الركبة بعنف في القمة.'
          }
        ],
        mistakes: ['قفل مفصل الركبة بالكامل بعنف في نهاية الدفع (Hyperextension) يسبب إصابات خطيرة.'],
        safety_note: 'اترك ثنياً طفيفاً جداً غير مقفول في الركبة في قمة الحركة لحماية المفصل.'
      }
    ],
    steps: [
      {
        phase: '1. وضع البداية والوقوف',
        description: 'ضع البار على عضلات الترابيس وليس على فقرات الرقبة. قف بعرض الكتفين مع توجيه أصابع القدمين للخارج بزاوية 15-30 درجة.'
      },
      {
        phase: '2. النزول المحكوم (المدى الحركي)',
        description: 'خذ نفساً عميقاً واحبسه في بطنك (Brace Core). انزل بمؤخرتك للخلف ولأسفل مع فتح الركبتين باتجاه أصابع القدمين حتى يتوازى فخذك مع الأرض (زاوية 90 درجة).'
      },
      {
        phase: '3. الدفع والصعود للأعلى',
        description: 'ادفع الأرض بكعبي قدميك مع إبقاء صدرك مرفوعاً وعينيك للأمام، واخرج الزفير عند الاقتراب من الوقوف الكامل.'
      }
    ],
    mistakes: [
      'ميل الركبتين للداخل (Knee Valgus) أثناء الصعود.',
      'انحناء أسفل الظهر عند النزول لعمق زيادة عن مرونة الحوض.',
      'رفع الكعبين عن الأرض.'
    ],
    safety_note: 'ابدأ بوزن خفيف وبار فاضي لتتقن توازن ظهرك وركبتيك قبل زيادة الأحمال.',
    breathing: 'شهيق عميق قبل النزول لحماية العمود الفقري ← زفير قوي عند دفع الوزن للأعلى.'
  },

  'Bulgarian Split Squats': {
    name: 'Bulgarian Split Squats',
    arabic_name: 'بلغاريان سبليت سكوات (Bulgarian Split Squats)',
    image: '/images/exercises/bulgarian_split_squat.jpg',
    target_muscle: 'عضلات الفخذ الأمامية والأرداف بحركة أحادية (Quads & Glutes)',
    secondary_muscles: 'أوتار الركبة وعضلات الاتزان الداخلي',
    tempo: '3 ثواني نزول هادئ - ثانية صعود',
    alternative: 'Walking Dumbbell Lunges أو Smith Machine Split Squats',
    alternatives_list: [
      {
        id: 'split_lunges',
        title: 'Walking Dumbbell Lunges',
        arabic_title: 'طعنات المشي بالدمبلز (Walking Lunges)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_walking_lunges.jpg',
        target_muscle: 'نحت وتناسق الأرداف والفخذين بحركة ديناميكية',
        why_choose: 'أسهل في التوازن للمبتدئين من وضع القدم الخلفية على الدكة.',
        steps: [
          {
            phase: '1. الخطوة للأمام',
            description: 'احمل دمبل في كل يد، وتقدم بخطوة واسعة متزنة للأمام.'
          },
          {
            phase: '2. الهبوط',
            description: 'اهبط بركبتك الخلفية بهدوء حتى تقترب من الأرض مع بقاء ركبتك الأمامية بزاوية 90 درجة.'
          },
          {
            phase: '3. الدفع والخطوة التالية',
            description: 'ادفع بكعب قدمك الأمامية لتستقيم وتنتقل للخطوة التالية بالقدم الأخرى.'
          }
        ],
        mistakes: ['ارتطام الركبة الخلفية بالأرض بقوة.'],
        safety_note: 'حافظ على استقامة جذعك وصدرك شامخاً للأمام.'
      },
      {
        id: 'split_smith',
        title: 'Smith Machine Split Squats',
        arabic_title: 'سبليت سكوات على السميث (Smith Split Squats)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_leg_press.jpg',
        target_muscle: 'عزل فائق لعضلات الرجل الواحدة مع ثبات المسار',
        why_choose: 'لو بتعاني من فقدان التوازن بالدمبلز، جهاز السميث يضمن لك مساراً رأسياً مستقراً.',
        steps: [
          {
            phase: '1. التمركز',
            description: 'ضع البار على عضلات الترابيس وقدم واحدة للأمام والأخرى على الدكة وراءك.'
          },
          {
            phase: '2. النزول',
            description: 'انزل لأسفل مع ميل خفيف بالجذع للأمام لتركيز الحمل على الأرداف.'
          },
          {
            phase: '3. الدفع',
            description: 'ادفع بالقدم الأمامية للأعلى.'
          }
        ],
        mistakes: ['تحميل الوزن على القدم الخلفية بدلاً من الأمامية.'],
        safety_note: '80% من وزنك يجب أن يكون مرتكزاً على كعب القدم الأمامية.'
      }
    ],
    steps: [
      {
        phase: '1. التجهيز والوقفة',
        description: 'ضع مشط قدمك الخلفية على دكة وراءك، وتقدم بالقدم الأمامية خطوة كبيرة متوازنة بعرض الحوض.'
      },
      {
        phase: '2. النزول بزاوية التركيز',
        description: 'انزل لأسفل مع ميل خفيف بالجذع للأمام (بزاوية 15 درجة) لنقل التركيز العضلي بالكامل على الأرداف والفخذ الأمامي.'
      },
      {
        phase: '3. الدفع بالقدم الأمامية',
        description: 'ادفع بكعب القدم الأمامية بالكامل للأعلى دون تحميل الوزن على القدم الخلفية.'
      }
    ],
    mistakes: [
      'استخدام القدم الخلفية في الدفع بدلاً من الأمامية.',
      'فقدان التوازن بسبب وضع القدمين على خط واحد بدلاً من عرض الحوض.'
    ],
    safety_note: 'أقوى تمرين لعلاج عدم التماثل العضلي بين الساقين؛ ابدأ بوزن الجسم أولاً.',
    breathing: 'شهيق عند النزول، زفير عند الصعود.'
  },

  'Romanian Deadlifts': {
    name: 'Romanian Deadlifts (RDL)',
    arabic_name: 'ديدليفت روماني للهامسترنج والأرداف (Romanian Deadlift)',
    image: '/images/exercises/deadlift.jpg',
    target_muscle: 'أوتار الركبة الخلفية (Hamstrings) والأرداف (Glutes)',
    secondary_muscles: 'عضلات أسفل الظهر والترابيس والقبضة',
    tempo: '3 ثواني نزول مع إطالة هادئة - ثانية ثبات - ثانية صعود',
    alternative: 'Dumbbell Romanian Deadlift أو Smith Machine RDL',
    alternatives_list: [
      {
        id: 'rdl_dumbbell',
        title: 'Dumbbell Romanian Deadlift',
        arabic_title: 'ديدليفت روماني بالدمبلز (Dumbbell RDL)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_db_rdl.jpg',
        target_muscle: 'أوتار الركبة والأرداف بمسار حركة طبيعي ومريح',
        why_choose: 'الدمبلز تتيح لك إبقاء الأوزان بجانب ساقيك مباشرة، مما يريح أسفل الظهر مقارنة بالبار.',
        steps: [
          {
            phase: '1. الوقفة والتجهيز',
            description: 'قف بعرض الحوض وامسك دمبل في كل يد أمام فخذيك مع ثني طفيف وثابت في الركبتين.'
          },
          {
            phase: '2. حركة مفصل الحوض للخلف',
            description: 'ادفع حوضك ومؤخرتك للخلف كأنك تغلق باباً وراءك مع إبقاء الدمبلين ملاصقين لساقيك وظهرك مستقيماً كالمسطرة.'
          },
          {
            phase: '3. الدفع للأمام',
            description: 'توقف عند منتصف الساق وادفع حوضك للأمام واعتصر الأرداف في القمة.'
          }
        ],
        mistakes: ['ثني الركبتين وتحويل التمرين لسكوات، أو انحناء وتقوس الظهر.'],
        safety_note: 'الحركة بالكامل من مفصل الحوض (Hip Hinge) وليس من الركبتين.'
      },
      {
        id: 'rdl_smith',
        title: 'Smith Machine Romanian Deadlift',
        arabic_title: 'ديدليفت روماني على السميث (Smith Machine RDL)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/deadlift.jpg',
        target_muscle: 'أوتار الركبة بمسار رأسي موجه',
        why_choose: 'مسار بار السميث المستقيم يمنع البار من الابتعاد عن الساقين ويحمي الفقرات القطنية.',
        steps: [
          {
            phase: '1. التمركز',
            description: 'قف ملاصقاً لبار السميث وامسكه بقبضة عرض الكتفين.'
          },
          {
            phase: '2. دفع الحوض للخلف',
            description: 'ادفع مؤخرتك للخلف وانزل بالبار ملاصقاً للقصبة.'
          },
          {
            phase: '3. الصعود',
            description: 'ادفع للأمام واعتصر عضلات الهامسترنج والأرداف.'
          }
        ],
        mistakes: ['إبعاد البار عن الساقين.'],
        safety_note: 'حافظ على البار ملاصقاً لقدميك كالفرشاة.'
      }
    ],
    steps: [
      {
        phase: '1. الوقفة والتثبيت',
        description: 'قف بعرض الحوض مع إمساك البار أو الدمبلز أمام الفخذين. اسحب لوحي الكتف للخلف، مع ثني طفيف غير متحرك في مفصل الركبة (Soft Knees).'
      },
      {
        phase: '2. حركة مفصل الحوض (Hip Hinge)',
        description: 'ادفع حوضك ومؤخرتك للخلف كأنك تغلق باباً خلفك بمؤخرتك، مع إبقاء البار ملتصقاً بساقيك وموازياً للعمود الفقري المستقيم دون تقوس.'
      },
      {
        phase: '3. المدى وإعادة الصعود',
        description: 'توقف عندما تشعر بإطالة قوية في العضلات الخلفية (عادة عند منتصف الساق)، ثم ادفع الحوض للأمام واعتصر الأرداف للعودة للوقوف.'
      }
    ],
    mistakes: [
      'انحناء أو تقوس الظهر (Cat Back) - أكبر سبب لإصابات الانزلاق الغضروفي.',
      'ثني الركبتين وتحويل التمرين لسكوات.',
      'إبعاد البار عن الساقين مما يخلق ضغطاً خطيراً على الفقرات القطنية.'
    ],
    safety_note: 'حافظ على البار ملاصقاً لساقيك كالفرشاة واحتفظ بظهرك مفروداً كالمسطرة.',
    breathing: 'شهيق مع دفع الحوض للخلف ← زفير مع دفع الحوض للأمام واستقامة الجسم.'
  },

  'Lying Leg Curls': {
    name: 'Lying Hamstring Leg Curls',
    arabic_name: 'عزل خلفيات على الجهاز نائماً (Lying Leg Curls)',
    image: '/images/exercises/leg_curls.jpg',
    target_muscle: 'عزل كامل لأوتار الركبة الخلفية (Hamstrings Isolation)',
    secondary_muscles: 'السمانة والأرداف',
    tempo: 'ثانية سحب وعصر - ثانية ثبات في القمة - ثانيتان فرد هادئ',
    alternative: 'Seated Leg Curl Machine أو Dumbbell Lying Leg Curl',
    alternatives_list: [
      {
        id: 'curl_seated',
        title: 'Seated Leg Curl Machine',
        arabic_title: 'جهاز ثني الأرجل جالساً (Seated Leg Curl)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_seated_leg_curl.jpg',
        target_muscle: 'أوتار الركبة الخلفية مع إطالة أكبر بفضل انثناء الحوض',
        why_choose: 'أثبتت الأبحاث العلمية الحديثة أن ثني الأرجل جالساً يبني عضلات هامسترنج أكبر من النائم بفضل زاوية الحوض.',
        steps: [
          {
            phase: '1. ضبط الوسادة',
            description: 'اجلس واضبط وسادة الفخذين لتضغط بإحكام على فخذيك، وضع وسادة الكاحل خلف أسفل السمانة.'
          },
          {
            phase: '2. الثني لأسفل',
            description: 'اثنِ ساقيك لأسفل وللخلف واعتصر أوتار الركبة بشدة لمدة ثانية في القاع.'
          },
          {
            phase: '3. الرجوع البطيء',
            description: 'اترك الساقين ترتفعان ببطء وتحكم لتحقيق أقصى إطالة.'
          }
        ],
        mistakes: ['عدم تثبيت وسادة الفخذين بإحكام مما يجعل الجسم يرتفع عن المقعد.'],
        safety_note: 'أفضل جهاز لعزل أوتار الركبة الخلفية دون أي إجهاد لأسفل الظهر.'
      },
      {
        id: 'curl_db',
        title: 'Dumbbell Lying Hamstring Curl',
        arabic_title: 'ثني خلفيات نائماً بالدمبل (Dumbbell Leg Curl)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/leg_curls.jpg',
        target_muscle: 'عزل الهامسترنج بحرية على أي دكة عادية',
        why_choose: 'لو أجهزة الأرجل محجوزة بالجيم أو بتتمرن في جيم منزلي.',
        steps: [
          {
            phase: '1. التمركز',
            description: 'استلقِ على بطنك على دكة وثبت دمبل خفيف رأسياً بين باطني قدميك.'
          },
          {
            phase: '2. الثني للأعلى',
            description: 'اثنِ ركبتيك للأعلى حتى تقترب قدماك من المؤخرة واعتصر العضلة.'
          },
          {
            phase: '3. الهبوط',
            description: 'اهبط ببطء شديد مع الحفاظ على إمساك الدمبل بقدميك.'
          }
        ],
        mistakes: ['استخدام وزن ثقيل قد يسقط من بين القدمين.'],
        safety_note: 'ابدأ بوزن خفيف جداً واطلب من زميلك وضع الدمبل بين قدميك في البداية.'
      }
    ],
    steps: [
      {
        phase: '1. الضبط والاستلقاء',
        description: 'استلقِ على بطنك مع ضبط وسادة الكاحل أسفل عضلة السمانة مباشرة وأعلى الكعب. امسك المقابض بإحكام لتثبيت حوضك ملتصقاً بالبادة.'
      },
      {
        phase: '2. الثني والعصر',
        description: 'اثنِ ساقيك للأعلى بقوة حتى تقترب الوسادة من مؤخرتك واعتصر أوتار الركبة بشدة لمدة ثانية.'
      },
      {
        phase: '3. النزول السلبي',
        description: 'انزل بالوزن ببطء وتحكم حتى تفرد ساقيك بالكامل دون أن تترك الأوزان تصطدم ببعضها.'
      }
    ],
    mistakes: [
      'رفع الحوض وأسفل الظهر عن الدكة لتوليد قوة دفع زائفة.',
      'التسرع في فرد الساقين وفقدان التوتر العضلي.'
    ],
    safety_note: 'حافظ على حوضك ملتصقاً بالدكة لتضمن وصول الحمل 100% لأوتار الركبة.',
    breathing: 'زفير أثناء ثني الساقين للأعلى، شهيق أثناء الفرد لأسفل.'
  },

  'Calf Raises': {
    name: 'Standing Calf Raises',
    arabic_name: 'رفع السمانة واقفاً (Standing Calf Raises)',
    image: '/images/exercises/calf_raises.jpg',
    target_muscle: 'عضلات السمانة - الجاستروكنيميوس (Gastrocnemius & Soleus)',
    secondary_muscles: 'عضلات الكاحل والاتزان',
    tempo: 'ثانية رفع - ثانيتان ثبات في القمة - 3 ثواني إطالة كاملة في القاع',
    alternative: 'Single-Leg Dumbbell Calf Raises أو Seated Calf Raise Machine',
    alternatives_list: [
      {
        id: 'calf_db',
        title: 'Single-Leg Dumbbell Calf Raises',
        arabic_title: 'سمانة فردية بالدمبل على درجة (Single-Leg DB Calves)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/calf_raises.jpg',
        target_muscle: 'عزل كل سمانة على حدة لعلاج التباين العضلي',
        why_choose: 'لو جهاز السمانة محجوز، أو لو عندك سمانة أضعف من الثانية وعايز تساويهم في القوة.',
        steps: [
          {
            phase: '1. الوقوف على الحافة',
            description: 'قف بمشط قدم واحدة على حافة درجة مع حمل دمبل في نفس اليد والإمساك بحائط باليد الأخرى للاتزان.'
          },
          {
            phase: '2. الإطالة العميقة',
            description: 'اهبط بكعبك لأسفل مستوى الدرجة واثبت ثانية للشعور بأقصى إطالة.'
          },
          {
            phase: '3. الرفع والعصر',
            description: 'ارفع جسمك لأعلى نقطة على مشط قدمك واعتصر السمانة لثانيتين.'
          }
        ],
        mistakes: ['القفز السريع واستخدام ارتداد وتر أكيلس.'],
        safety_note: 'الثبات في القاع وفي القمة هو السر الحقيقي لبناء عضلات السمانة.'
      },
      {
        id: 'calf_machine',
        title: 'Seated Calf Raise Machine',
        arabic_title: 'جهاز السمانة جالساً (Seated Calf Machine)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_seated_calf_machine.jpg',
        target_muscle: 'عضلة السوليوس (Soleus) المسؤولة عن عرض وتضخيم السمانة جانبياً',
        why_choose: 'انثناء الركبة بزاوية 90 درجة يعزل عضلة السوليوس العميقة التي تعطي السمانة مظهراً عريضاً.',
        steps: [
          {
            phase: '1. التمركز',
            description: 'اجلس مع وضع مشطي القدمين على المنصة وضبط الوسادة فوق أسفل الفخذين.'
          },
          {
            phase: '2. الهبوط للإطالة',
            description: 'انزل بالكعبين لأسفل نقطة ممكنة.'
          },
          {
            phase: '3. الرفع لأعلى',
            description: 'ادفع بمشطي القدمين لأعلى واعتصر العضلة.'
          }
        ],
        mistakes: ['السرعة الزائدة في الأداء.'],
        safety_note: 'أداء بطيء وثابت يعطي أفضل نتائج ممكنة لعضلة السوليوس.'
      }
    ],
    steps: [
      {
        phase: '1. الوقفة',
        description: 'قف على حافة درجة بمشطي القدمين مع ترك الكعبين يتدليان بحرية واستقامة الركبتين دون قفل عنيف.'
      },
      {
        phase: '2. الرفع والعصر',
        description: 'ارفع جسمك لأعلى نقطة ممكنة على مشطي القدمين واعتصر عضلات السمانة لثانيتين كاملتين.'
      },
      {
        phase: '3. الإطالة العميقة',
        description: 'انزل بكعبيك لأسفل مستوى الدرجة لتحصل على أقصى إطالة عضلية ممكنة واثبت ثانية في القاع.'
      }
    ],
    mistakes: [
      'القفز السريع واستخدام مرونة وتر أكيلس بدلاً من عضلات السمانة.',
      'ثني الركبتين أثناء الحركة.'
    ],
    safety_note: 'السر في تفجير عضلات السمانة هو التوقف ثانية كاملة في أقصى إطالة بالأسفل وثانيتين بالقمة.',
    breathing: 'زفير عند الرفع للأعلى، شهيق عند النزول والإطالة.'
  },

  'Hanging Leg Raises': {
    name: 'Hanging Leg Raises',
    arabic_name: 'رفع الأرجل لشد عضلات البطن والكور (Hanging Leg Raises)',
    image: '/images/exercises/hanging_leg_raises.jpg',
    target_muscle: 'عضلات البطن السفلية والكور والخاصرة (Lower Abs & Core)',
    secondary_muscles: 'عضلات الحوض والقبضة واللاتس للتعلق',
    tempo: 'ثانية رفع وعصر - ثانية ثبات - ثانيتان نزول هادئ',
    alternative: 'Floor Leg Raises & Planks أو Cable Abdominal Crunches',
    alternatives_list: [
      {
        id: 'abs_floor',
        title: 'Floor Leg Raises & Core Plank',
        arabic_title: 'رفع الأرجل على الأرض مع بلانك (Floor Leg Raises)',
        category: 'bodyweight',
        category_label: 'بديل بوزن الجسم على الأرض',
        image: '/images/exercises/hanging_leg_raises.jpg',
        target_muscle: 'عضلات البطن السفلية بدون إجهاد قبضة اليدين',
        why_choose: 'لو مفيش عقلة أو بتتعب من التعلق بقبضتك، التمرين على الأرض مريح وفعال جداً.',
        steps: [
          {
            phase: '1. الاستلقاء والتثبيت',
            description: 'استلقِ على ظهرك على سجادة التمرين وضع يديك تحت حوضك مع إلصاق أسفل الظهر بالأرض تماماً.'
          },
          {
            phase: '2. الرفع والعصر',
            description: 'ارفع ساقيك للأعلى حتى زاوية 90 درجة مع رفع الحوض قليلاً في القمة لعصر البطن.'
          },
          {
            phase: '3. الهبوط دون لمس الأرض',
            description: 'اهبط بساقيك ببطء وتوقف قبل أن تلمسا الأرض للحفاظ على التوتر.'
          }
        ],
        mistakes: ['تقوس أسفل الظهر عن الأرض أثناء النزول.'],
        safety_note: 'اضغط أسفل ظهرك على الأرض بإحكام طوال مدة التكرار.'
      },
      {
        id: 'abs_cable',
        title: 'Cable Abdominal Crunches',
        arabic_title: 'طحن البطن بالكابل راكعاً (Cable Ab Crunches)',
        category: 'cable',
        category_label: 'بديل بالكابل (Cable)',
        image: '/images/exercises/alternatives/alt_cable_crunch.jpg',
        target_muscle: 'تضخيم وبروز عضلات السكس باك بزيادة الأحمال',
        why_choose: 'يسمح بتطبيق الزيادة التدريجية في الأحمال بالأوزان على عضلات البطن مثل أي عضلة أخرى.',
        steps: [
          {
            phase: '1. الركوع والإمساك بالحبل',
            description: 'اركع أمام جهاز الكابل المرتفع وامسك طرفي الحبل بجانب أذنيك.'
          },
          {
            phase: '2. الطحن للأسفل',
            description: 'اثنِ عمودك الفقري وقرّب كوعيك من فخذيك واعتصر عضلات البطن بشدة.'
          },
          {
            phase: '3. الرجوع البطيء',
            description: 'ارجع للأعلى ببطء دون تحريك حوضك للخلف.'
          }
        ],
        mistakes: ['استخدام حركة الحوض بدلاً من ثني البطن.'],
        safety_note: 'ثبت حوضك واجعل كل الانثناء من عضلات البطن كأنك تطوي بطنك للداخل.'
      }
    ],
    steps: [
      {
        phase: '1. التعلق والتثبيت',
        description: 'تعلق بالبار بقبضة محكمة مع تثبيت عضلات الكتف واللاتس لمنع أي تأرجح بالجسم.'
      },
      {
        phase: '2. رفع الحوض والأرجل',
        description: 'ارفع ساقيك للأعلى مع لف الحوض للأعلى نحو الصدر (Posterior Pelvic Tilt) لعصر البطن بالكامل وليس مجرد رفع الفخذين.'
      },
      {
        phase: '3. الهبوط السلبي المحكوم',
        description: 'انزل بساقيك ببطء وتحكم دون ترك جسمك يتأرجح للأمام وللخلف كالبندول.'
      }
    ],
    mistakes: [
      'التأرجح واستخدام عزم الاندفاع لرفع الساقين.',
      'رفع الأرجل دون لف الحوض للأعلى مما يحصر التمرين في عضلات الفخذ الأمامية (Hip Flexors).'
    ],
    safety_note: 'إذا كنت مبتدئاً، اثنِ ركبتيك (Hanging Knee Raises) حتى تتقن التحكم في الحوض.',
    breathing: 'زفير قوي عند رفع الساقين وعصر البطن، شهيق عند النزول.'
  },

  // ==================== FEMALE SCULPT SPECIFIC ====================
  'Hip Thrusts': {
    name: 'Barbell Hip Thrusts',
    arabic_name: 'هيب ثرست بالبار لنحت الأرداف (Barbell Hip Thrust)',
    image: '/images/exercises/hip_thrust.jpg',
    target_muscle: 'عضلة المؤخرة الكبرى (Gluteus Maximus)',
    secondary_muscles: 'أوتار الركبة (Hamstrings) وأسفل الظهر والكور',
    tempo: '2 ثانية نزول - ثانيتان عصر كامل في القمة - ثانية دفع',
    alternative: 'Dumbbell Hip Thrust / Glute Bridge أو Smith Machine Hip Thrust',
    alternatives_list: [
      {
        id: 'hip_bridge_db',
        title: 'Dumbbell Glute Bridge',
        arabic_title: 'جلوت بريدج بالدمبل على الأرض (Dumbbell Glute Bridge)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_glute_bridge.jpg',
        target_muscle: 'عصر وتدوير الأرداف على الأرض بدون إجهاد الظهر',
        why_choose: 'تمرين أرضي مريح وسهل التجهيز جداً ولا يحتاج دكة أو بار.',
        steps: [
          {
            phase: '1. الاستلقاء والتجهيز',
            description: 'استلقِ على سجادة التمرين واثنِ ركبتيك مع تثبيت الكعبين على الأرض ووضع دمبل فوق الحوض.'
          },
          {
            phase: '2. الرفع والعصر',
            description: 'ادفع الأرض بكعبيك وارفع حوضك لأعلى نقطة واعتصري الأرداف بشدة لثانيتين.'
          },
          {
            phase: '3. الهبوط',
            description: 'اهبطي بحوضك بهدوء دون أن تلمس مؤخرتك الأرض تماماً بين التكرارات.'
          }
        ],
        mistakes: ['تقويس أسفل الظهر زيادة عن اللازم.'],
        safety_note: 'حافظي على ثبات الرقبة على الأرض ووجهي الدفع من الكعبين.'
      },
      {
        id: 'hip_smith',
        title: 'Smith Machine Hip Thrust',
        arabic_title: 'هيب ثرست على جهاز السميث (Smith Hip Thrust)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/hip_thrust.jpg',
        target_muscle: 'عضلات الأرداف بأوزان ثقيلة ومسار موجه آمن',
        why_choose: 'جهاز السميث يثبت مسار البار ويلغي الحاجة لموازنة البار الحر.',
        steps: [
          {
            phase: '1. وضع البادة والدكة',
            description: 'ضعي دكة خلف بار السميث واستخدمي البادة الإسفنجية فوق عظام الحوض.'
          },
          {
            phase: '2. فك الأمان والدفع',
            description: 'ادفعي البار للأعلى واعتصري الأرداف في القمة مع تثبيت الذقن على الصدر.'
          },
          {
            phase: '3. النزول المحكوم',
            description: 'انزلي بنصف المسافة لتحقيق توتر عضلي مستمر.'
          }
        ],
        mistakes: ['النظر للسقف وتقويس الرقبة.'],
        safety_note: 'ثبتي نظرك للأمام واعتصري الأرداف في أعلى نقطة.'
      }
    ],
    steps: [
      {
        phase: '1. التمركز والوقفة',
        description: 'اجلسي على الأرض مع إسناد منتصف الظهر (أسفل لوحي الكتف مباشرة) على حافة الدكة. ضعي البار مع البادة الإسفنجية فوق عظمة الحوض مباشرة.'
      },
      {
        phase: '2. زاوية الركبتين والأقدام',
        description: 'اثني ركبتيك بحيث تكون الساق عمودية بزاوية 90 درجة مع الأرض عند الصعود لأعلى نقطة. أقدامك بعرض الحوض وأصابعك مائلة للخارج قليلاً.'
      },
      {
        phase: '3. الرفع وعصر العضلة',
        description: 'ادفعي الأرض بكعبيك وارفعي حوضك للأعلى حتى يصبح جسمك خطاً مستقيماً من الركبة للكتف. اثني ذقنك لأسفل وانظري للأمام، واعتصري عضلات الأرداف لمدة ثانيتين كاملتين في القمة.'
      }
    ],
    mistakes: [
      'النظر للسقف وتقويس أسفل الظهر بدلاً من استخدام الحوض.',
      'وضع القدمين بعيداً جداً أو قريباً جداً.',
      'عدم الوصول للمدى الكامل.'
    ],
    safety_note: 'احرصي دائماً على استخدام بادة إسفنجية سميكة (Barbell Pad) لتجنب كدمات عظام الحوض.',
    breathing: 'شهيق عند نزول الحوض ← زفير قوي وعصر للأرداف في أعلى نقطة.'
  }
};

export function getExerciseGuide(exerciseName: string): ExerciseGuide {
  if (EXERCISE_GUIDES[exerciseName]) {
    return EXERCISE_GUIDES[exerciseName];
  }

  // Fallback for custom or partial matches
  for (const key of Object.keys(EXERCISE_GUIDES)) {
    if (exerciseName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(exerciseName.toLowerCase())) {
      return EXERCISE_GUIDES[key];
    }
  }

  // Generic guidance
  return {
    name: exerciseName,
    arabic_name: `${exerciseName} - تكنيك الأمان`,
    image: '/images/exercises/bench_press.jpg',
    target_muscle: 'العضلات المستهدفة بالتمرين',
    secondary_muscles: 'عضلات التثبيت والكور',
    tempo: 'ثانيتان نزول متحكم به - ثانية صعود',
    alternative: 'تمرين بديل بوزن حر أو على جهاز مخصص',
    alternatives_list: [
      {
        id: 'generic_db',
        title: 'بديل بالدمبل (Dumbbell Alternative)',
        arabic_title: 'بديل بالدمبل (Dumbbell)',
        category: 'dumbbell',
        category_label: 'بديل بالدمبل (Dumbbell)',
        image: '/images/exercises/alternatives/alt_db_bench.png',
        target_muscle: 'نفس العضلة المستهدفة مع حرية المفصل',
        why_choose: 'أداء نفس النمط الحركي باستخدام الدمبلز لحرية المفصل.',
        steps: [
          {
            phase: '1. وضع البداية',
            description: 'امسك الدمبلز بمسكة مريحة وثبت عمودك الفقري.'
          },
          {
            phase: '2. الحركة',
            description: 'قم بأداء الحركة بمدى حركي كامل وهادئ.'
          },
          {
            phase: '3. الانقباض',
            description: 'اعتصر العضلة في القمة وتحكم في النزول.'
          }
        ],
        mistakes: ['استخدام وزن ثقيل يخل بالتوازن.'],
        safety_note: 'تحكم بالوزن وحافظ على ثبات الجذع.'
      },
      {
        id: 'generic_machine',
        title: 'بديل بالجهاز (Machine Alternative)',
        arabic_title: 'بديل بالجهاز (Machine)',
        category: 'machine',
        category_label: 'بديل بالجهاز (Machine)',
        image: '/images/exercises/alternatives/alt_machine_chest_press.jpg',
        target_muscle: 'نفس العضلة المستهدفة بمسار ثابت',
        why_choose: 'أداء الحركة على جهاز مخصص لمسار ثابت وأمان تام.',
        steps: [
          {
            phase: '1. ضبط المقعد',
            description: 'اضبط الكرسي بما يناسب طولك ومستوى مفاصلك.'
          },
          {
            phase: '2. الدفع أو السحب',
            description: 'قم بالحركة بسلاسة واعتصر في نهاية المدى.'
          },
          {
            phase: '3. الرجوع',
            description: 'ارجع ببطء دون ارتطام الأوزان.'
          }
        ],
        mistakes: ['السرعة المفرطة وإهمال التحكم السلبي.'],
        safety_note: 'اضبط الجهاز بما يناسب جسمك لنتائج ممتازة.'
      }
    ],
    steps: [
      {
        phase: '1. وضع البداية والتجهيز',
        description: 'اضبط الوزن المناسب، ثبت العمود الفقري والكتفين في وضعية طبيعية مريحة دون انحناء.'
      },
      {
        phase: '2. مسار الحركة والمدى الكامل',
        description: 'قم بأداء الحركة بمدى حركي كامل دون سرعة مفرطة، مع التركيز على العضلة المستهدفة.'
      },
      {
        phase: '3. التنفس والتكرار',
        description: 'خذ شهيقاً في مرحلة المقاومة وزفيراً مع مرحلة الدفع أو السحب.'
      }
    ],
    mistakes: ['استخدام أوزان ثقيلة تضر بالتكنيك.', 'انعدام التركيز على العضلة المستهدفة.'],
    safety_note: 'ابدأ دائماً بوزن خفيف لتسجيل التوافق العصبي العضلي قبل زيادة الأحمال.',
    breathing: 'شهيق عند النزول، زفير مع المجهود.'
  };
}
