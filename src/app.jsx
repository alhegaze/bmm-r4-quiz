import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Award, BookOpen, Brain, Target, Clock, Lock } from 'lucide-react';

// ==================== GOOGLE SHEETS CONFIG ====================
// ⚠️ هتحط هنا بيانات الـ Google Sheets API
const GOOGLE_SHEETS_CONFIG = {
  apiKey: 'YOUR_API_KEY_HERE', // هتحطها من Google Cloud Console
  spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE', // هتجيبها من رابط الشيت
  range: 'Sheet1!A:Z', // اسم الشيت والـ range
};

// Web App URL (من Google Apps Script)
const WEB_APP_URL = 'YOUR_WEB_APP_URL_HERE';

// ==================== MAIN COMPONENT ====================
export default function MarketingMindsetExam() {
  const [currentSection, setCurrentSection] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [examStartTime, setExamStartTime] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  // Attempt Tracking
  const [lastAttemptTime, setLastAttemptTime] = useState(null);
  const [canRetake, setCanRetake] = useState(true);
  const [retakeTimeLeft, setRetakeTimeLeft] = useState(0);

  // ==================== LOCAL STORAGE KEYS ====================
  const getStorageKey = (email) => `exam_attempt_${email}`;
  const getTimeKey = (email) => `exam_time_${email}`;

  // ==================== CHECK ATTEMPT ELIGIBILITY ====================
  useEffect(() => {
    if (studentEmail) {
      const lastAttempt = localStorage.getItem(getStorageKey(studentEmail));
      if (lastAttempt) {
        const lastTime = parseInt(lastAttempt);
        const now = Date.now();
        const hoursPassed = (now - lastTime) / (1000 * 60 * 60);
        
        if (hoursPassed < 6) {
          setCanRetake(false);
          setLastAttemptTime(lastTime);
          const remainingTime = Math.ceil((6 * 60 * 60 * 1000) - (now - lastTime));
          setRetakeTimeLeft(remainingTime);
        }
      }
    }
  }, [studentEmail]);

  // ==================== RETAKE COUNTDOWN ====================
  useEffect(() => {
    if (!canRetake && retakeTimeLeft > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.ceil((6 * 60 * 60 * 1000) - (now - lastAttemptTime));
        
        if (remaining <= 0) {
          setCanRetake(true);
          setRetakeTimeLeft(0);
          clearInterval(interval);
        } else {
          setRetakeTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [canRetake, retakeTimeLeft, lastAttemptTime]);

  // ==================== TIMER LOGIC ====================
  useEffect(() => {
    if (currentSection === 'exam' && !isTimeUp) {
      // Check if there's saved time in localStorage
      const savedTime = localStorage.getItem(getTimeKey(studentEmail));
      const savedStartTime = localStorage.getItem(`exam_start_${studentEmail}`);
      
      if (savedTime && savedStartTime) {
        const elapsed = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
        const remaining = parseInt(savedTime) - elapsed;
        
        if (remaining > 0) {
          setTimeLeft(remaining);
          setExamStartTime(parseInt(savedStartTime));
        } else {
          setIsTimeUp(true);
          setTimeLeft(0);
        }
      } else {
        // First time starting exam
        const startTime = Date.now();
        setExamStartTime(startTime);
        localStorage.setItem(`exam_start_${studentEmail}`, startTime.toString());
        localStorage.setItem(getTimeKey(studentEmail), '3600');
      }

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimeUp(true);
            clearInterval(timer);
            // Auto-submit when time is up
            handleSubmit(true);
            return 0;
          }
          
          // Save current time to localStorage
          localStorage.setItem(getTimeKey(studentEmail), (prev - 1).toString());
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentSection, isTimeUp, studentEmail]);

  // ==================== FORMAT TIME ====================
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRetakeTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // ==================== QUESTIONS DATA ====================
  const essayQuestions = [
    {
      id: 'e1',
      question: 'شركة ناشئة في مجال التعليم الإلكتروني جاتلك وطالبة منك كامبين على السوشيال ميديا. قبل ما تبدأ، إيه الـ 5 أسئلة الأساسية اللي لازم تسألهم؟ ولكل سؤال، وضح ليه السؤال ده مهم.',
      criteria: ['أسئلة عن البيزنس والأهداف', 'أسئلة عن الجمهور المستهدف', 'أسئلة عن المنافسين', 'أسئلة عن المقاييس', 'شرح "ليه" كل سؤال مهم']
    },
    {
      id: 'e2',
      question: 'كامبين إعلانية كلفت 50,000 جنيه وجابت 200 عميل جديد، لكن المدير مش راضي ويقول إن الكامبين فشلت. إيه الأسئلة اللي هتسألها عشان تفهم إذا كانت الكامبين فعلاً فشلت ولا لأ؟ وإزاي هتحلل الموقف بعقلية ماركتير مش منفذ؟',
      criteria: ['السؤال عن CLV', 'السؤال عن الهدف الأصلي', 'المقارنة بالـ benchmark', 'تحليل الـ Quality', 'التفكير الاستراتيجي الواضح']
    },
    {
      id: 'e3',
      question: 'عميل طلب منك كامبين "زي اللي المنافس عامله بالظبط" لأنها نجحت معاهم. إزاي ترد عليه بطريقة توضح ليه ده مش الحل الأمثل؟ واقترح بديل يوضح عقليتك التسويقية.',
      criteria: ['شرح ليه الـ copy-paste مش الحل', 'ذكر أسباب نجاح المنافس', 'اقتراح بديل مخصص', 'توضيح دور الماركتير']
    },
    {
      id: 'e4',
      question: 'اكتب موقف حصل معاك في الشغل أو الدراسة كان عندك فيه Fixed Mindset (عقلية ثابتة) وبعدين اكتشفت إنك كان لازم تتعامل معاه بـ Growth Mindset. إيه اللي كان هيختلف لو كنت فكرت بعقلية النمو من البداية؟',
      criteria: ['موقف حقيقي وشخصي', 'تحديد الـ Fixed Mindset', 'تحديد الـ Growth Alternative', 'Self-awareness', 'فهم الفرق']
    },
    {
      id: 'e5',
      question: 'في رأيك، إيه الفرق الجوهري بين الماركتير اللي "بيعمل شغله كويس" والماركتير اللي "بيصنع فرق في البيزنس"؟ اشرح بمثال من السوق المصري أو العربي.',
      criteria: ['الفرق الواضح بين الاتنين', 'مثال من السوق المحلي', 'ذكر التأثير على البيزنس', 'ربط بالعقليات']
    },
    {
      id: 'e6',
      question: 'عندك meeting بكرة مع الـ CEO وعاوز تشرح له ليه الماركتينج مش "مصروف" لكنه "استثمار". إزاي هتبني الحجة دي بطريقة مبنية على عقلية استراتيجية وليس عاطفية؟',
      criteria: ['استخدام أرقام ومفاهيم', 'ربط بنمو البيزنس', 'أمثلة حقيقية', 'منطق مش عاطفة', 'تفكير طويل المدى']
    },
    {
      id: 'e7',
      question: 'لو عندك ميزانية محدودة جداً (5,000 جنيه مثلاً) وعاوز تعمل أقصى impact ممكن، إيه الـ Framework أو طريقة التفكير اللي هتستخدمها عشان تقرر تصرف الفلوس دي فين؟ وضح خطوات تفكيرك.',
      criteria: ['تحديد الهدف أولاً', 'تحليل القنوات', 'التفكير في organic', 'ذكر الـ 80/20', 'القياس والتعديل']
    },
    {
      id: 'e8',
      question: 'اشرح بالتفصيل موقف واحد توضح فيه الفرق بين "Customer-Centric Thinking" و"Product-Centric Thinking". استخدم مثال من brand حقيقي تعرفه.',
      criteria: ['الفرق الواضح', 'مثال من brand حقيقي', 'فهم الـ customer perspective', 'توضيح الـ impact']
    },
    {
      id: 'e9',
      question: 'ماركتير جديد جاي يسألك: "أنا عاوز أبقى ماركتير قوي، أتعلم إيه الأول؟" — اكتب له خطة تعلم لمدة 3 شهور توضح فيها أولوياتك وليه رتبتهم بالترتيب ده.',
      criteria: ['Mindset قبل Skillset', 'السيكولوجيا والسلوك', 'التفكير الاستراتيجي', 'Case studies', 'التجريب العملي']
    },
    {
      id: 'e10',
      question: 'لو عندك كامبين نجحت بشكل كبير، إيه الـ 5 حاجات اللي لازم تعملهم بعد النجاح ده عشان تضمن إنك فعلاً اتعلمت منها وتقدر تكررها؟',
      criteria: ['Post-Campaign Analysis', 'توثيق الـ Learnings', 'المشاركة مع الفريق', 'تحديد Success Factors', 'التفكير في التحسين']
    }
  ];

  const mcqQuestions = [
    {
      id: 'm1',
      question: 'شركة ناشئة عاوزة تزوّد الـ brand awareness بسرعة. أنهي من الاستراتيجيات دي بتعكس تفكير استراتيجي أكثر؟',
      options: [
        'نعمل إعلانات على كل القنوات المتاحة ونشوف أنهي واحدة تنجح',
        'ندرس فين جمهورنا المستهدف موجود فعلاً، ونركز كل الميزانية على القناة دي مع content strategy واضحة',
        'نستني لحد ما يكون عندنا ميزانية أكبر عشان نعمل كامبين كبيرة',
        'نعمل giveaways كتير عشان نزوّد الـ engagement بسرعة'
      ],
      correct: 1
    },
    {
      id: 'm2',
      question: 'أنهي موقف من دول بيعكس Growth Mindset حقيقي؟',
      options: [
        'الكامبين فشلت، قلت "المنتج مش كويس والسوق صعب"',
        'الكامبين فشلت، قلت "أنا مش شاطر في الماركتينج، لازم أسيب المجال ده"',
        'الكامبين فشلت، حللت الأخطاء وكتبتها وحطيت خطة للتحسين في المرة الجاية',
        'الكامبين فشلت، قررت أجرب نفس الفكرة تاني بدون تغيير لأن "المرة الجاية هتنجح"'
      ],
      correct: 2
    },
    {
      id: 'm3',
      question: 'إيه أهم سؤال لازم تسأله قبل ما تبدأ أي كامبين؟',
      options: [
        'إيه الأداة الأفضل للاستخدام؟',
        'إيه المشكلة الحقيقية اللي بنحلها للعميل؟',
        'إيه الميزانية المتاحة؟',
        'إيه اللي المنافسين بيعملوه؟'
      ],
      correct: 1
    },
    {
      id: 'm4',
      question: 'عميل قالك "عاوز post كل يوم على الفيسبوك". إيه أفضل رد يعكس عقلية ماركتير مش منفذ؟',
      options: [
        'حاضر، هبدأ أنفذ من بكرة',
        'ده كتير، ممكن نقلل لـ 3 مرات في الأسبوع؟',
        'تمام، بس قبلها محتاجين نتفق على الهدف من الـ posts دي — عاوزين نحقق إيه بالظبط؟ ومين الجمهور المستهدف؟',
        'الفيسبوك مبقاش بينفع دلوقتي، لازم نركز على TikTok'
      ],
      correct: 2
    },
    {
      id: 'm5',
      question: 'شركة بتبيع منتج premium سعره عالي. أنهي رسالة تسويقية أقرب للـ Customer-Centric Thinking؟',
      options: [
        'منتجنا مصنوع من أفخم الخامات ومستورد من الخارج',
        'استثمر في جودة حياتك — تستحق الأفضل',
        'احنا الشركة الرائدة في المجال ده من 20 سنة',
        'منتجنا حاصل على 10 جوايز دولية'
      ],
      correct: 1
    },
    {
      id: 'm6',
      question: 'أنهي scenario بيعكس Agile & Experimental Mindset؟',
      options: [
        'اشتغلت على الكامبين 3 شهور عشان تطلع perfect، بعدين لانشتها',
        'عملت minimum viable campaign، لانشتها، قست النتايج أول بأول، وعدلت based on data',
        'جربت كل الأفكار اللي عندي في نفس الوقت عشان أشوف أنهي واحدة أحسن',
        'عملت خطة سنوية كاملة والتزمت بيها حتى لو الظروف اتغيرت'
      ],
      correct: 1
    },
    {
      id: 'm7',
      question: 'في رأيك، أنهي مقياس من دول يعكس نجاح حقيقي لكامبين على السوشيال ميديا لبراند e-commerce؟',
      options: [
        'عدد الـ likes والتعليقات',
        'عدد الـ followers الجديدة',
        'الـ conversion rate والـ ROI من الكامبين',
        'عدد الـ shares'
      ],
      correct: 2
    },
    {
      id: 'm8',
      question: 'أنهي تعريف أدق للماركتينج؟',
      options: [
        'الماركتينج هو الإعلانات والبوستات والكامبينز',
        'الماركتينج هو فن إقناع الناس يشتروا منتجك',
        'الماركتينج هو فهم احتياجات العميل وبناء قيمة حقيقية وإيصالها بطريقة تؤثر على قراره',
        'الماركتينج هو زيادة الـ brand awareness'
      ],
      correct: 2
    },
    {
      id: 'm9',
      question: 'شركة صغيرة عندها منافس كبير بميزانية ضخمة. أنهي استراتيجية بتعكس تفكير استراتيجي؟',
      options: [
        'نحاول ننافسهم في كل حاجة',
        'نستسلم لأن الميزانية مش كفاية',
        'نلاقي niche محدد ونبقى الأفضل فيه بدل ما نحاول نبقى كل حاجة لكل الناس',
        'ننزّل السعر أقل منهم عشان نجذب عملاء'
      ],
      correct: 2
    },
    {
      id: 'm10',
      question: 'أنهي موقف بيوضح الفرق بين Data-Driven و Data-Informed Thinking؟',
      options: [
        'الداتا قالت إن الـ post الأحمر أحسن من الأزرق، فقررت أعمل كل حاجة حمرا',
        'الداتا قالت إن الـ engagement قل، لكن أنا شايف إن ده بسبب التوقيت مش المحتوى، فحللت أكثر',
        'مبصش على الداتا خالص وبعتمد على حدسي',
        'بتابع كل الأرقام بالتفصيل لكن مبعملش حاجة بيها'
      ],
      correct: 1
    },
    {
      id: 'm11',
      question: 'إيه الفرق الأساسي بين الـ Insight والـ Observation؟',
      options: [
        'مفيش فرق، نفس المعنى',
        'الـ Observation هي ملاحظة سطحية، الـ Insight هو فهم عميق لليه الناس بتتصرف كده',
        'الـ Insight هو رأيك الشخصي، الـ Observation هو الحقيقة',
        'الـ Observation للماركتينج، الـ Insight للمبيعات'
      ],
      correct: 1
    },
    {
      id: 'm12',
      question: 'شركة قالتلك "محتاجين viral campaign". إيه أكثر رد بيعكس فهم استراتيجي؟',
      options: [
        'تمام، هعمل محتوى مضحك وننشره على كل القنوات',
        'Viral مش استراتيجية، هو نتيجة. لازم نتفق على الهدف الحقيقي اللي ورا رغبتكم في الـ virality',
        'Viral صعب، ممكن نركز على حاجة تانية؟',
        'محتاجين ميزانية كبيرة عشان نعمل viral'
      ],
      correct: 1
    },
    {
      id: 'm13',
      question: 'أنهي principle من دول مش من المبادئ النفسية اللي بتأثر على قرار الشراء؟',
      options: [
        'Social Proof',
        'Scarcity',
        'Color Psychology',
        'Technical Specifications'
      ],
      correct: 3
    },
    {
      id: 'm14',
      question: 'كامبين نجحت بشكل كبير. أنهي خطوة من دول الأهم بعد النجاح؟',
      options: [
        'احتفل بالنجاح وخلاص',
        'وثّق الـ learnings والـ success factors عشان تقدر تكررها',
        'قول للمدير إنك محتاج ميزانية أكبر المرة الجاية',
        'انشر النجاح على LinkedIn'
      ],
      correct: 1
    },
    {
      id: 'm15',
      question: 'أنهي من دول يعتبر "Fixed Mindset" في الماركتينج؟',
      options: [
        '"أنا مش شاطر في الـ data analysis، ده مش مجالي"',
        '"أنا مش شاطر في الـ data analysis دلوقتي، لكن ممكن أتعلمه"',
        '"فشلت في الكامبين دي، لازم أفهم ليه"',
        '"المنافس أحسن مني، محتاج أتعلم منه"'
      ],
      correct: 0
    },
    {
      id: 'm16',
      question: 'إيه أول خطوة في الـ Marketing Planning Process؟',
      options: [
        'اختيار القنوات التسويقية',
        'فهم السوق والعميل والمنافسين (Market Analysis)',
        'تحديد الميزانية',
        'عمل creative concepts'
      ],
      correct: 1
    },
    {
      id: 'm17',
      question: 'شركة عندها product ممتاز لكن مفيش sales. أنهي سؤال الأهم؟',
      options: [
        'هل السعر غالي؟',
        'هل الناس فعلاً عارفة إن المنتج ده موجود ومحتاجاه؟',
        'هل الإعلانات كافية؟',
        'هل المنتج محتاج تطوير؟'
      ],
      correct: 1
    },
    {
      id: 'm18',
      question: 'إيه الفرق بين الـ Strategy والـ Tactic؟',
      options: [
        'Strategy هي الخطة الكبيرة والاتجاه، Tactic هي التنفيذ والأدوات',
        'Strategy للشركات الكبيرة، Tactic للشركات الصغيرة',
        'Strategy طويلة المدى، Tactic قصيرة المدى',
        'مفيش فرق، نفس المعنى'
      ],
      correct: 0
    },
    {
      id: 'm19',
      question: 'أنهي سيناريو بيعكس Customer-Centric Mindset حقيقي؟',
      options: [
        'عملنا survey للعملاء ومعملناش حاجة بالنتايج',
        'بنشتغل على المنتج بناءً على رأينا احنا مش رأي العملاء',
        'بنقرأ complaints العملاء ونحللها ونستخدمها في تحسين كل حاجة من المنتج للماركتينج',
        'بنعمل customer service كويس وخلاص'
      ],
      correct: 2
    },
    {
      id: 'm20',
      question: 'إيه أهم مهارة لازم يتقنها الماركتير في 2026؟',
      options: [
        'استخدام أدوات الـ AI',
        'التفكير الاستراتيجي وحل المشكلات',
        'التصميم الجرافيكي',
        'كتابة الكود'
      ],
      correct: 1
    }
  ];

  const allQuestions = [...essayQuestions, ...mcqQuestions];
  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // ==================== SUBMIT TO GOOGLE SHEETS ====================
  const submitToGoogleSheets = async (submissionData) => {
    try {
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      console.log('Data submitted to Google Sheets');
      return true;
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      return false;
    }
  };

  // ==================== HANDLE SUBMIT ====================
  const handleSubmit = async (autoSubmit = false) => {
    const mcqScore = calculateMCQScore();
    const mcqPercentage = getMCQPercentage();
    
    const submissionData = {
      timestamp: new Date().toISOString(),
      name: studentName,
      email: studentEmail,
      timeSpent: formatTime(3600 - timeLeft),
      autoSubmitted: autoSubmit,
      mcqScore: mcqScore,
      mcqTotal: mcqQuestions.length,
      mcqPercentage: mcqPercentage.toFixed(2),
      essayAnswers: essayQuestions.map(q => ({
        question: q.question,
        answer: answers[q.id] || ''
      })),
      mcqAnswers: mcqQuestions.map(q => ({
        question: q.question,
        selectedOption: q.options[answers[q.id]] || 'لم يتم الإجابة',
        correctOption: q.options[q.correct],
        isCorrect: answers[q.id] === q.correct
      }))
    };

    // Submit to Google Sheets
    await submitToGoogleSheets(submissionData);

    // Save attempt time
    localStorage.setItem(getStorageKey(studentEmail), Date.now().toString());
    
    // Clear exam data
    localStorage.removeItem(getTimeKey(studentEmail));
    localStorage.removeItem(`exam_start_${studentEmail}`);
    
    setShowResults(true);
  };

  // ==================== ANSWER HANDLERS ====================
  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateMCQScore = () => {
    let correct = 0;
    mcqQuestions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  const getMCQPercentage = () => {
    return (calculateMCQScore() / mcqQuestions.length) * 100;
  };

  const getEssayCompletionCount = () => {
    return essayQuestions.filter(q => answers[q.id] && answers[q.id].trim().length > 50).length;
  };

  const currentQ = allQuestions[currentQuestion];
  const isEssay = currentQuestion < essayQuestions.length;
  const isAnswered = answers[currentQ?.id];

  // ==================== INTRO SCREEN ====================
  if (currentSection === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8" dir="rtl">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-t-4 border-blue-600">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-600 p-4 rounded-xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">اختبار الموديول الأول</h1>
                <p className="text-gray-600 mt-1">كورس بناء عقلية المسوق</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 معلومات الاختبار</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">30 سؤال (10 مقالي + 20 اختيار من متعدد)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 font-bold">الوقت المتاح: 60 دقيقة</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">قياس العقلية التسويقية والانتقال للمستوى الثاني</span>
                </div>
              </div>
            </div>

            {!canRetake && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-red-900 mb-2">⏳ يجب الانتظار قبل إعادة المحاولة</h3>
                    <p className="text-red-800 mb-3">لقد أكملت الاختبار بالفعل. يمكنك إعادة المحاولة بعد 6 ساعات.</p>
                    <div className="bg-red-100 rounded-lg p-4">
                      <p className="text-2xl font-bold text-red-900 text-center">
                        {formatRetakeTime(retakeTimeLeft)}
                      </p>
                      <p className="text-sm text-red-700 text-center mt-1">الوقت المتبقي</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                ملاحظات مهمة
              </h3>
              <ul className="space-y-2 text-amber-900 text-sm">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>بمجرد البدء، سيبدأ العداد التنازلي (60 دقيقة)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>سيتم إرسال الإجابات تلقائياً عند انتهاء الوقت</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>يمكنك إعادة المحاولة بعد 6 ساعات من آخر محاولة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>الأسئلة تتطلب تفكير استراتيجي وليس حفظ</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل *</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="اكتب اسمك الكامل"
                  required
                  disabled={!canRetake}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني *</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@email.com"
                  required
                  disabled={!canRetake}
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (studentName.trim() && studentEmail.trim() && canRetake) {
                  setCurrentSection('exam');
                } else if (!canRetake) {
                  alert('يجب الانتظار قبل إعادة المحاولة');
                } else {
                  alert('برجاء إدخال الاسم والبريد الإلكتروني');
                }
              }}
              disabled={!canRetake}
              className={`w-full font-bold py-4 rounded-xl transition-all ${
                canRetake
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canRetake ? 'ابدأ الاختبار 🚀' : '🔒 غير متاح حالياً'}
            </button>
          </div>

          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">"الاختبار ده مش عشان يختبر حفظك — عشان يختبر عقليتك"</p>
            <p className="font-bold">— عبد الرحمن الحجازي، الباشماركتير</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== RESULTS SCREEN ====================
  if (showResults) {
    const mcqScore = calculateMCQScore();
    const mcqPercentage = getMCQPercentage();
    const essayCount = getEssayCompletionCount();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8" dir="rtl">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-green-100 p-6 rounded-full mb-4">
                <Award className="w-16 h-16 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">تم إرسال الإجابات بنجاح!</h1>
              <p className="text-gray-600">شكراً {studentName} على إكمال الاختبار</p>
              {isTimeUp && (
                <p className="text-amber-600 font-bold mt-2">⏰ تم إرسال الإجابات تلقائياً بعد انتهاء الوقت</p>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📊 نتيجة الاختيار من متعدد</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">الإجابات الصحيحة</span>
                  <span className="text-2xl font-bold text-blue-600">{mcqScore} / {mcqQuestions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${mcqPercentage}%` }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-gray-900">{mcqPercentage.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">✍️ الأسئلة المقالية</h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">عدد الأسئلة المجابة</span>
                <span className="text-2xl font-bold text-amber-600">{essayCount} / {essayQuestions.length}</span>
              </div>
              <p className="text-sm text-amber-700 mt-3">
                * سيتم مراجعة إجاباتك المقالية وتقييمها من قبل المدرب
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-gray-900 mb-4">التقييم العام (اختيار من متعدد)</h3>
              <div className="space-y-3">
                {mcqPercentage >= 85 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-bold">🌟 ممتاز — جاهز للمستوى الثاني بقوة!</p>
                  </div>
                )}
                {mcqPercentage >= 75 && mcqPercentage < 85 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-bold">✅ جيد جداً — جاهز للمستوى الثاني</p>
                  </div>
                )}
                {mcqPercentage >= 65 && mcqPercentage < 75 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-bold">⚠️ جيد — يُنصح بمراجعة بعض المفاهيم</p>
                  </div>
                )}
                {mcqPercentage < 65 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-bold">📚 يحتاج مراجعة شاملة قبل الانتقال</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-bold text-purple-900 mb-3">⏰ معلومات إعادة المحاولة</h3>
              <p className="text-purple-800">
                يمكنك إعادة الاختبار بعد <span className="font-bold">6 ساعات</span> من الآن.
              </p>
              <p className="text-sm text-purple-700 mt-2">
                سيتم إرسال النتيجة النهائية (بعد تقييم الأسئلة المقالية) على البريد الإلكتروني
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== EXAM SCREEN ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Timer Warning */}
        {timeLeft < 300 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4 animate-pulse">
            <div className="flex items-center gap-3 justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <span className="text-red-800 font-bold">
                تنبيه: تبقى أقل من 5 دقائق!
              </span>
            </div>
          </div>
        )}

        {/* Timer + Progress */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Clock className={`w-6 h-6 ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`} />
              <span className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-700">
              السؤال {currentQuestion + 1} من {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
              isEssay 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {isEssay ? '✍️ سؤال مقالي' : '☑️ اختيار من متعدد'}
            </span>
            {isEssay && (
              <span className="mr-3 text-sm text-gray-600">
                (50 كلمة على الأقل)
              </span>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {isEssay ? (
            <div>
              <textarea
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="اكتب إجابتك هنا... كن محدداً وواضحاً في تفكيرك"
                disabled={isTimeUp}
              />
              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {(answers[currentQ.id] || '').split(' ').filter(w => w.length > 0).length} كلمة
                </span>
                {currentQ.criteria && (
                  <button
                    onClick={() => {
                      const criteriaText = '📋 معايير التقييم:\n\n' + currentQ.criteria.map((c, i) => `${i+1}. ${c}`).join('\n');
                      alert(criteriaText);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    📋 عرض معايير التقييم
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                const isSelected = answers[currentQ.id] === index;
                return (
                  <button
                    key={index}
                    onClick={() => !isTimeUp && handleAnswer(currentQ.id, index)}
                    disabled={isTimeUp}
                    className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    } ${isTimeUp ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className={`text-base md:text-lg ${
                        isSelected ? 'font-bold text-gray-900' : 'text-gray-700'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isTimeUp}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              currentQuestion === 0 || isTimeUp
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
            }`}
          >
            ← السابق
          </button>
          <button
            onClick={handleNext}
            disabled={isTimeUp}
            className={`flex-1 font-bold py-4 rounded-xl transition-all ${
              isTimeUp
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
            }`}
          >
            {currentQuestion === totalQuestions - 1 ? 'إرسال الإجابات ✓' : 'التالي →'}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>💡 يمكنك العودة لأي سؤال سابق لتعديل إجابتك</p>
        </div>
      </div>
    </div>
  );
}
