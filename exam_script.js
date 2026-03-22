const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, VerticalAlign, PageBreak
} = require('docx');
const fs = require('fs');

const COLORS = {
  primary: "1B3A6B",
  accent: "E8A020",
  lightBg: "EEF3FA",
  accentBg: "FEF6E4",
  greenBg: "E8F5E9",
  redBg: "FDECEA",
  purpleBg: "F3E5F5",
  orangeBg: "FFF3E0",
  border: "CCCCCC",
  darkText: "1A1A2E",
  white: "FFFFFF",
  gray: "F5F5F5",
};

const border = { style: BorderStyle.SINGLE, size: 1, color: COLORS.border };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: COLORS.white };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function rtlPara(children, opts = {}) {
  return new Paragraph({
    ...opts,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    children,
  });
}

function sectionHeader(text, bgColor = COLORS.primary) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: bgColor, type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 200, right: 200 },
            children: [
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text, bold: true, size: 26, color: COLORS.white, font: "Arial" }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function infoBox(children, bgColor = COLORS.lightBg) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: bgColor, type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 240, right: 240 },
            children,
          }),
        ],
      }),
    ],
  });
}

function spacer(lines = 1) {
  return Array.from({ length: lines }, () =>
    new Paragraph({ children: [new TextRun({ text: "", size: 14 })] })
  );
}

function bodyText(text, opts = {}) {
  return rtlPara([
    new TextRun({
      text,
      size: opts.size || 22,
      bold: opts.bold || false,
      color: opts.color || COLORS.darkText,
      font: "Arial",
      italics: opts.italics || false,
    }),
  ], { spacing: { after: opts.after || 100 } });
}

function bulletItem(text, bold = false) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80 },
    children: [
      new TextRun({ text, size: 21, font: "Arial", color: COLORS.darkText, bold }),
    ],
  });
}

// Question box helper
function questionBox(number, text, type = "essay") {
  const bgColor = type === "essay" ? COLORS.accentBg : COLORS.lightBg;
  const typeLabel = type === "essay" ? "مقالي" : "اختيار من متعدد";
  
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: bgColor, type: ShadingType.CLEAR },
            margins: { top: 140, bottom: 140, left: 220, right: 220 },
            children: [
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.RIGHT,
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: `السؤال ${number} — `, bold: true, size: 24, color: COLORS.primary, font: "Arial" }),
                  new TextRun({ text: typeLabel, size: 20, color: "888888", font: "Arial" }),
                ],
              }),
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text, size: 22, font: "Arial", color: COLORS.darkText }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Multiple choice option
function mcOption(letter, text, isCorrect = false) {
  const bgColor = isCorrect ? COLORS.greenBg : COLORS.white;
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { after: 60 },
    children: [
      new TextRun({ 
        text: `${letter}) `,
        bold: true,
        size: 21,
        font: "Arial",
        color: isCorrect ? "1B5E20" : COLORS.primary
      }),
      new TextRun({ 
        text,
        size: 21,
        font: "Arial",
        color: COLORS.darkText,
        bold: isCorrect
      }),
    ],
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 400, hanging: 260 } } } }],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: COLORS.primary },
        paragraph: { spacing: { before: 200, after: 200 }, outlineLevel: 0 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      children: [

        // COVER
        infoBox([
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: "كورس بناء عقلية المسوق", size: 20, color: "888888", font: "Arial" })],
          }),
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [new TextRun({ text: "اختبار الموديول الأول", bold: true, size: 48, color: COLORS.primary, font: "Arial" })],
          }),
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: "قياس العقلية التسويقية والانتقال للمستوى الثاني", size: 24, color: COLORS.darkText, font: "Arial" }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "30 سؤال | 10 مقالي + 20 اختيار من متعدد", size: 20, color: "666666", font: "Arial" }),
            ],
          }),
        ], COLORS.lightBg),

        ...spacer(1),

        // INSTRUCTIONS
        sectionHeader("تعليمات الاختبار"),
        ...spacer(0),

        infoBox([
          bodyText("هذا الاختبار مصمم لقياس فهمك الحقيقي للعقلية التسويقية والمفاهيم الأساسية في الماركتينج.", { bold: true }),
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { before: 100, after: 60 },
            children: [new TextRun({ text: "ملاحظات مهمة:", bold: true, size: 22, color: COLORS.primary, font: "Arial" })],
          }),
          bulletItem("الأسئلة تتطلب تفكير استراتيجي وليس حفظ"),
          bulletItem("لا توجد إجابة 'صح أو غلط' واضحة — الأفضل هو من يفهم السياق"),
          bulletItem("الأسئلة المقالية تحتاج منك شرح تفكيرك وليس فقط الإجابة"),
          bulletItem("خذ وقتك في قراءة كل سؤال بتمعن"),
          bulletItem("الهدف هو قياس عقليتك التسويقية للانتقال للمرحلة العملية"),
        ], COLORS.accentBg),

        ...spacer(1),

        // ═══════════════════════════════════════════
        // PART 1: ESSAY QUESTIONS
        // ═══════════════════════════════════════════
        sectionHeader("القسم الأول: الأسئلة المقالية (10 أسئلة)"),
        ...spacer(1),

        // Q1
        questionBox("01", "شركة ناشئة في مجال التعليم الإلكتروني جاتلك وطالبة منك كامبين على السوشيال ميديا. قبل ما تبدأ، إيه الـ 5 أسئلة الأساسية اللي لازم تسألهم؟ ولكل سؤال، وضح ليه السؤال ده مهم.", "essay"),
        ...spacer(0),
        infoBox([
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 80 },
            children: [new TextRun({ text: "معايير التقييم:", bold: true, size: 20, color: COLORS.primary, font: "Arial" })],
          }),
          bulletItem("هل الأسئلة بتركز على فهم البيزنس مش بس التنفيذ؟"),
          bulletItem("هل فيه سؤال عن الـ Target Audience والـ Pain Points؟"),
          bulletItem("هل فيه سؤال عن المنافسين والسوق؟"),
          bulletItem("هل فيه سؤال عن الأهداف القابلة للقياس؟"),
          bulletItem("هل الطالب شرح 'ليه' كل سؤال مهم؟"),
        ], COLORS.greenBg),

        ...spacer(1),

        // Q2
        questionBox("02", "كامبين إعلانية كلفت 50,000 جنيه وجابت 200 عميل جديد، لكن المدير مش راضي ويقول إن الكامبين فشلت. إيه الأسئلة اللي هتسألها عشان تفهم إذا كانت الكامبين فعلاً فشلت ولا لأ؟ وإزاي هتحلل الموقف بعقلية ماركتير مش منفذ؟", "essay"),
        ...spacer(0),
        infoBox([
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 80 },
            children: [new TextRun({ text: "الإجابة النموذجية تتضمن:", bold: true, size: 20, color: COLORS.primary, font: "Arial" })],
          }),
          bulletItem("السؤال عن الـ Customer Lifetime Value (CLV) — هل الـ 200 عميل دول هيجيبوا أكثر من 50k على المدى الطويل؟"),
          bulletItem("السؤال عن الهدف الأصلي — كان الهدف كام عميل؟ وليه الرقم ده؟"),
          bulletItem("السؤال عن الـ Industry Benchmark — 250 جنيه/عميل ده كويس ولا وحش مقارنة بالسوق؟"),
          bulletItem("تحليل الـ Quality مش بس الـ Quantity — هل العملاء دول qualified ولا random leads؟"),
          bulletItem("الماركتير بيسأل أسئلة عميقة قبل ما يحكم، المنفذ بيشوف الأرقام بس"),
        ], COLORS.greenBg),

        ...spacer(1),

        // Q3
        questionBox("03", "عميل طلب منك كامبين 'زي اللي المنافس عامله بالظبط' لأنها نجحت معاهم. إزاي ترد عليه بطريقة توضح ليه ده مش الحل الأمثل؟ واقترح بديل يوضح عقليتك التسويقية.", "essay"),
        ...spacer(0),
        infoBox([
          bodyText("الإجابة الممتازة توضح:", { bold: true, color: COLORS.primary }),
          bulletItem("إن Copy-Paste الاستراتيجيات مش بيشتغل لأن كل brand ليها positioning وجمهور مختلف"),
          bulletItem("إن المنافس ممكن يكون نجح بسبب timing أو ميزانية أو brand equity مش بس الكامبين"),
          bulletItem("اقتراح بديل: ندرس ليه الكامبين نجحت (الـ Insight ورا النجاح) ونطبقه بطريقتنا"),
          bulletItem("توضيح إن دورك كماركتير إنك تقدم حلول مخصصة مش تقليد"),
        ], COLORS.greenBg),

        ...spacer(1),

        // Q4
        questionBox("04", "اكتب موقف حصل معاك في الشغل أو الدراسة كان عندك فيه Fixed Mindset (عقلية ثابتة) وبعدين اكتشفت إنك كان لازم تتعامل معاه بـ Growth Mindset. إيه اللي كان هيختلف لو كنت فكرت بعقلية النمو من البداية؟", "essay"),
        ...spacer(0),
        infoBox([
          bodyText("السؤال ده بيقيس:", { bold: true, color: COLORS.primary }),
          bulletItem("مدى وعي الطالب بطريقة تفكيره"),
          bulletItem("قدرته على التأمل الذاتي (Self-reflection)"),
          bulletItem("فهمه الحقيقي للفرق بين العقليتين"),
          bulletItem("قدرته على تطبيق المفهوم على حياته الشخصية"),
        ], COLORS.greenBg),

        ...spacer(1),

        // Q5
        questionBox("05", "في رأيك، إيه الفرق الجوهري بين الماركتير اللي 'بيعمل شغله كويس' والماركتير اللي 'بيصنع فرق في البيزنس'؟ اشرح بمثال من السوق المصري أو العربي.", "essay"),
        ...spacer(0),
        infoBox([
          bodyText("الإجابة القوية تركز على:", { bold: true, color: COLORS.primary }),
          bulletItem("الماركتير الكويس بينفذ، الماركتير اللي بيصنع فرق بيفكر استراتيجياً"),
          bulletItem("الماركتير الكويس بيقيس الـ outputs (posts, campaigns)، اللي بيصنع فرق بيقيس الـ business impact"),
          bulletItem("مثال من السوق المحلي يوضح الفرق"),
          bulletItem("ذكر عقلية من العقليات الخمس في الإجابة"),
        ], COLORS.greenBg),

        ...spacer(1),

        // Q6
        questionBox("06", "عندك meeting بكرة مع الـ CEO وعاوز تشرح له ليه الماركتينج مش 'مصروف' لكنه 'استثمار'. إزاي هتبني الحجة دي بطريقة مبنية على عقلية استراتيجية وليس عاطفية؟", "essay"),
        ...spacer(0),
        infoBox([
          bodyText("معايير الإجابة الممتازة:", { bold: true, color: COLORS.primary }),
          bulletItem("استخدام أرقام ومفاهيم زي ROI, CLV, CAC, Brand Equity"),
          bulletItem("ربط الماركتينج بنمو البيزنس على المدى الطويل"),
          bulletItem("ذكر أمثلة لشركات نجحت بسبب استثمارها في الماركتينج"),
          bulletItem("توضيح الفرق بين التفكير قصير المدى وطويل المدى"),
          bulletItem("الحجة مبنية على منطق وبيانات مش عواطف"),
        ], COLORS.greenBg),

        ...spacer(1),

        // Q7
        questionBox("07", "لو عندك ميزانية محدودة جداً (5,000 جنيه مثلاً) وعاوز تعمل أقصى impact ممكن، إيه الـ Framework أو طريقة التفكير اللي هتستخدمها عشان تقرر تصرف الفلوس دي فين؟ وضح خطوات تفكيرك.", "essay"),
        ...spacer(0),
        infoBox([
          bodyText("الإجابة الممتازة تتضمن:", { bold: true, color: COLORS.primary }),
          bulletItem("تحديد الهدف الأهم أولاً (Awareness? Conversion? Retention?)"),
          bulletItem("تحليل القنوات الأكثر فعالية للجمهور المستهدف"),
          bulletItem("التفكير في organic strategies قبل paid"),
          bulletItem("ذكر الـ 80/20 principle (Pareto) — ركز على الـ 20% اللي هيدوا 80% نتيجة"),
          bulletItem("القياس المستمر والـ pivot السريع"),
        ], COLORS.greenBg),

        ...spacer(1),

        // Q8
        questionBox("08", "اشرح بالتفصيل موقف واحد توضح فيه الفرق بين 'Customer-Centric Thinking' و'Product-Centric Thinking'. استخدم مثال من brand حقيقي تعرفه.", "essay"),
        ...spacer(0),
        infoBox([
          bodyText("السؤال يقيس:", { bold: true, color: COLORS.primary }),
          bulletItem("فهم الطالب للفرق بين التفكير من منظور العميل ومن منظور المنتج"),
          bulletItem("قدرته على تطبيق المفهوم على brand حقيقي"),
          bulletItem("فهمه لمفاهيم زي Jobs To Be Done, Pain Points, Customer Journey"),
        ], COLORS.greenBg),

        ...spacer(1),

        // Q9
        questionBox("09", "ماركتير جديد جاي يسألك: 'أنا عاوز أبقى ماركتير قوي، أتعلم إيه الأول؟' — اكتب له خطة تعلم لمدة 3 شهور توضح فيها أولوياتك وليه رتبتهم بالترتيب ده. (مش مطلوب كورسات، مطلوب مجالات ومهارات).", "essay"),
        ...spacer(0),
        infoBox([
          bodyText("الإجابة القوية تركز على:", { bold: true, color: COLORS.primary }),
          bulletItem("بناء الـ Mindset قبل الـ Skillset"),
          bulletItem("فهم أساسيات السيكولوجيا والسلوك البشري"),
          bulletItem("التفكير الاستراتيجي وحل المشكلات"),
          bulletItem("القراءة والتعلم المستمر من case studies حقيقية"),
          bulletItem("التجريب العملي والممارسة"),
        ], COLORS.greenBg),

        ...spacer(1),

        // Q10
        questionBox("10", "لو عندك كامبين نجحت بشكل كبير، إيه الـ 5 حاجات اللي لازم تعملهم بعد النجاح ده عشان تضمن إنك فعلاً اتعلمت منها وتقدر تكررها؟ (مش بس الاحتفال بالنجاح)", "essay"),
        ...spacer(0),
        infoBox([
          bodyText("الإجابة الممتازة تتضمن:", { bold: true, color: COLORS.primary }),
          bulletItem("عمل Post-Campaign Analysis شامل — إيه اللي شتغل وليه"),
          bulletItem("توثيق الـ Insights والـ Learnings"),
          bulletItem("مشاركة الـ Learnings مع الفريق"),
          bulletItem("تحديد الـ Success Factors القابلة للتكرار"),
          bulletItem("التفكير في السؤال: 'إزاي نعمله أحسن المرة الجاية؟' (Growth Mindset)"),
        ], COLORS.greenBg),

        ...spacer(2),

        // ═══════════════════════════════════════════
        // PART 2: MULTIPLE CHOICE
        // ═══════════════════════════════════════════
        new Paragraph({
          pageBreakBefore: true,
          children: [new TextRun({ text: "", size: 1 })],
        }),

        sectionHeader("القسم الثاني: اختيار من متعدد (20 سؤال)"),
        ...spacer(1),

        // MCQ 1
        questionBox("11", "شركة ناشئة عاوزة تزوّد الـ brand awareness بسرعة. أنهي من الاستراتيجيات دي بتعكس تفكير استراتيجي أكثر؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "نعمل إعلانات على كل القنوات المتاحة ونشوف أنهي واحدة تنجح"),
        mcOption("ب", "ندرس فين جمهورنا المستهدف موجود فعلاً، ونركز كل الميزانية على القناة دي مع content strategy واضحة", true),
        mcOption("ج", "نستني لحد ما يكون عندنا ميزانية أكبر عشان نعمل كامبين كبيرة"),
        mcOption("د", "نعمل giveaways كتير عشان نزوّد الـ engagement بسرعة"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("الإجابة ب) صحيحة لأنها بتعكس تفكير استراتيجي: تحديد الهدف → فهم الجمهور → اختيار القناة الصح → بناء استراتيجية محتوى. باقي الإجابات إما reactive أو unfocused."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 2
        questionBox("12", "أنهي موقف من دول بيعكس Growth Mindset حقيقي؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "الكامبين فشلت، قلت 'المنتج مش كويس والسوق صعب'"),
        mcOption("ب", "الكامبين فشلت، قلت 'أنا مش شاطر في الماركتينج، لازم أسيب المجال ده'"),
        mcOption("ج", "الكامبين فشلت، حللت الأخطاء وكتبتها وحطيت خطة للتحسين في المرة الجاية", true),
        mcOption("د", "الكامبين فشلت، قررت أجرب نفس الفكرة تاني بدون تغيير لأن 'المرة الجاية هتنجح'"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ج) الإجابة الصحيحة — Growth Mindset يعني تشوف الفشل كفرصة تعلم، وتحلل وتتعلم وتطبق. أ) و ب) لوم خارجي وداخلي. د) تكرار بدون تعلم."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 3
        questionBox("13", "إيه أهم سؤال لازم تسأله قبل ما تبدأ أي كامبين؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "إيه الأداة الأفضل للاستخدام؟"),
        mcOption("ب", "إيه المشكلة الحقيقية اللي بنحلها للعميل؟", true),
        mcOption("ج", "إيه الميزانية المتاحة؟"),
        mcOption("د", "إيه اللي المنافسين بيعملوه؟"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ب) صحيحة — الماركتينج بيبدأ من فهم المشكلة. باقي الأسئلة مهمة لكن تيجي بعد تحديد المشكلة."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 4
        questionBox("14", "عميل قالك 'عاوز post كل يوم على الفيسبوك'. إيه أفضل رد يعكس عقلية ماركتير مش منفذ؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "حاضر، هبدأ أنفذ من بكرة"),
        mcOption("ب", "ده كتير، ممكن نقلل لـ 3 مرات في الأسبوع؟"),
        mcOption("ج", "تمام، بس قبلها محتاجين نتفق على الهدف من الـ posts دي — عاوزين نحقق إيه بالظبط؟ ومين الجمهور المستهدف؟", true),
        mcOption("د", "الفيسبوك مبقاش بينفع دلوقتي، لازم نركز على TikTok"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ج) صحيحة — الماركتير بيسأل 'ليه' قبل 'إيه'. أ) تنفيذ أعمى. ب) رد منفذ. د) رد مش مبني على فهم احتياج العميل."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 5
        questionBox("15", "شركة بتبيع منتج premium سعره عالي. أنهي رسالة تسويقية أقرب للـ Customer-Centric Thinking؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "منتجنا مصنوع من أفخم الخامات ومستورد من الخارج"),
        mcOption("ب", "استثمر في جودة حياتك — تستحق الأفضل", true),
        mcOption("ج", "احنا الشركة الرائدة في المجال ده من 20 سنة"),
        mcOption("د", "منتجنا حاصل على 10 جوايز دولية"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ب) صحيحة — بتتكلم من منظور العميل ومشاعره (أنت تستحق). باقي الرسائل product-centric (احنا، منتجنا)."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 6
        questionBox("16", "أنهي scenario بيعكس Agile & Experimental Mindset؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "اشتغلت على الكامبين 3 شهور عشان تطلع perfect، بعدين لانشتها"),
        mcOption("ب", "عملت minimum viable campaign، لانشتها، قست النتايج أول بأول، وعدلت based on data", true),
        mcOption("ج", "جربت كل الأفكار اللي عندي في نفس الوقت عشان أشوف أنهي واحدة أحسن"),
        mcOption("د", "عملت خطة سنوية كاملة والتزمت بيها حتى لو الظروف اتغيرت"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ب) صحيحة — Agile معناه launch سريع، قياس، تعلم، تحسين. أ) perfectionism. ج) chaos. د) rigidity."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 7
        questionBox("17", "في رأيك، أنهي مقياس من دول يعكس نجاح حقيقي لكامبين على السوشيال ميديا لبراند e-commerce؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "عدد الـ likes والتعليقات"),
        mcOption("ب", "عدد الـ followers الجديدة"),
        mcOption("ج", "الـ conversion rate والـ ROI من الكامبين", true),
        mcOption("د", "عدد الـ shares"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ج) صحيحة — E-commerce الهدف الأساسي هو المبيعات. باقي المقاييس (vanity metrics) مهمة لكن مش كافية."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 8
        questionBox("18", "أنهي تعريف أدق للماركتينج؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "الماركتينج هو الإعلانات والبوستات والكامبينز"),
        mcOption("ב", "الماركتينج هو فن إقناع الناس يشتروا منتجك"),
        mcOption("ج", "الماركتينج هو فهم احتياجات العميل وبناء قيمة حقيقية وإيصالها بطريقة تؤثر على قراره", true),
        mcOption("د", "الماركتينج هو زيادة الـ brand awareness"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ج) صحيحة — تعريف شامل يغطي الفهم، القيمة، والتأثير. أ) أدوات فقط. ב) manipulation. د) هدف واحد فقط."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 9
        questionBox("19", "شركة صغيرة عندها منافس كبير بميزانية ضخمة. أنهي استراتيجية بتعكس تفكير استراتيجي؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "نحاول ننافسهم في كل حاجة"),
        mcOption("ב", "نستسلم لأن الميزانية مش كفاية"),
        mcOption("ج", "نلاقي niche محدد ونبقى الأفضل فيه بدل ما نحاول نبقى كل حاجة لكل الناس", true),
        mcOption("د", "ننزّل السعر أقل منهم عشان نجذب عملاء"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ج) صحيحة — استراتيجية الـ Niche domination. أ) مستحيل. ב) defeatist. د) race to the bottom."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 10
        questionBox("20", "أنهي موقف بيوضح الفرق بين Data-Driven و Data-Informed Thinking؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "الداتا قالت إن الـ post الأحمر أحسن من الأزرق، فقررت أعمل كل حاجة حمرا"),
        mcOption("ב", "الداتا قالت إن الـ engagement قل، لكن أنا شايف إن ده بسبب التوقيت مش المحتوى، فحللت أكثر", true),
        mcOption("ج", "مبصش على الداتا خالص وبعتمد على حدسي"),
        mcOption("د", "بتابع كل الأرقام بالتفصيل لكن مبعملش حاجة بيها"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ب) صحيحة — Data-Informed يعني تستخدم الداتا كمدخل لكن تستخدم تفكيرك الاستراتيجي. أ) blind following. ج) ignoring data. د) paralysis by analysis."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 11
        questionBox("21", "إيه الفرق الأساسي بين الـ Insight والـ Observation؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "مفيش فرق، نفس المعنى"),
        mcOption("ב", "الـ Observation هي ملاحظة سطحية، الـ Insight هو فهم عميق لليه الناس بتتصرف كده", true),
        mcOption("ج", "الـ Insight هو رأيك الشخصي، الـ Observation هو الحقيقة"),
        mcOption("د", "الـ Observation للماركتينج، الـ Insight للمبيعات"),
        ...spacer(0),
        infoBox([
          bodyText("مثال:", { bold: true, color: COLORS.primary }),
          bodyText("Observation: 'الناس بتشتري قهوة كل يوم'"),
          bodyText("Insight: 'الناس مش بتشتري قهوة، بتشتري لحظة راحة في يوم مزحوم'"),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 12
        questionBox("22", "شركة قالتلك 'محتاجين viral campaign'. إيه أكثر رد بيعكس فهم استراتيجي؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "تمام، هعمل محتوى مضحك وننشره على كل القنوات"),
        mcOption("ב", "Viral مش استراتيجية، هو نتيجة. لازم نتفق على الهدف الحقيقي اللي ورا رغبتكم في الـ virality", true),
        mcOption("ج", "Viral صعب، ممكن نركز على حاجة تانية؟"),
        mcOption("د", "محتاجين ميزانية كبيرة عشان نعمل viral"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ב) صحيحة — Viral هو نتيجة مش هدف. الماركتير الاستراتيجي بيفهم الهدف الحقيقي (awareness? sales? positioning?) ويبني عليه."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 13
        questionBox("23", "أنهي principle من دول مش من المبادئ النفسية اللي بتأثر على قرار الشراء؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "Social Proof"),
        mcOption("ב", "Scarcity"),
        mcOption("ج", "Color Psychology"),
        mcOption("ד", "Technical Specifications", true),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ד) صحيحة — Technical Specifications مهمة لكن مش psychological principle. باقي الاختيارات principles نفسية مؤثرة."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 14
        questionBox("24", "كامبين نجحت بشكل كبير. أنهي خطوة من دول الأهم بعد النجاح؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "احتفل بالنجاح وخلاص"),
        mcOption("ב", "وثّق الـ learnings والـ success factors عشان تقدر تكررها", true),
        mcOption("ج", "قول للمدير إنك محتاج ميزانية أكبر المرة الجاية"),
        mcOption("ד", "انشر النجاح على LinkedIn"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ב) صحيحة — Growth Mindset معناه التعلم المستمر حتى من النجاح."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 15
        questionBox("25", "أنهي من دول يعتبر 'Fixed Mindset' في الماركتينج؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "'أنا مش شاطر في الـ data analysis، ده مش مجالي'", true),
        mcOption("ב", "'أنا مش شاطر في الـ data analysis دلوقتي، لكن ممكن أتعلمه'"),
        mcOption("ג", "'فشلت في الكامبين دي، لازم أفهم ليه'"),
        mcOption("ד", "'المنافس أحسن مني، محتاج أتعلم منه'"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("أ) صحيحة — Fixed Mindset بيفترض إن القدرات ثابتة. باقي الاختيارات Growth Mindset."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 16
        questionBox("26", "إيه أول خطوة في الـ Marketing Planning Process؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "اختيار القنوات التسويقية"),
        mcOption("ב", "فهم السوق والعميل والمنافسين (Market Analysis)", true),
        mcOption("ג", "تحديد الميزانية"),
        mcOption("ד", "عمل creative concepts"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ב) صحيحة — الماركتينج بيبدأ بالفهم قبل التنفيذ. Understanding → Strategy → Execution."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 17
        questionBox("27", "شركة عندها product ممتاز لكن مفيش sales. أنهي سؤال الأهم؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "هل السعر غالي؟"),
        mcOption("ב", "هل الناس فعلاً عارفة إن المنتج ده موجود ومحتاجاه؟", true),
        mcOption("ג", "هل الإعلانات كافية؟"),
        mcOption("ד", "هل المنتج محتاج تطوير؟"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ב) صحيحة — أهم سؤال: هل فيه product-market fit? هل الجمهور عارف ومحتاج؟ باقي الأسئلة تيجي بعدها."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 18
        questionBox("28", "إيه الفرق بين الـ Strategy والـ Tactic؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "Strategy هي الخطة الكبيرة والاتجاه، Tactic هي التنفيذ والأدوات", true),
        mcOption("ב", "Strategy للشركات الكبيرة، Tactic للشركات الصغيرة"),
        mcOption("ג", "Strategy طويلة المدى، Tactic قصيرة المدى"),
        mcOption("ד", "مفيش فرق، نفس المعنى"),
        ...spacer(0),
        infoBox([
          bodyText("مثال:", { bold: true, color: COLORS.primary }),
          bodyText("Strategy: 'نبني brand positioning كـ premium خلال السنة'"),
          bodyText("Tactic: 'نعمل influencer campaign على Instagram'"),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 19
        questionBox("29", "أنهي سيناريو بيعكس Customer-Centric Mindset حقيقي؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "عملنا survey للعملاء ومعملناش حاجة بالنتايج"),
        mcOption("ב", "بنشتغل على المنتج بناءً على رأينا احنا مش رأي العملاء"),
        mcOption("ג", "بنقرأ complaints العملاء ونحللها ونستخدمها في تحسين كل حاجة من المنتج للماركتينج", true),
        mcOption("ד", "بنعمل customer service كويس وخلاص"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ג) صحيحة — Customer-Centric معناه إن كل القرارات مبنية على فهم عميق للعميل ومشاكله."),
        ], COLORS.lightBg),

        ...spacer(1),

        // MCQ 20
        questionBox("30", "إيه أهم مهارة لازم يتقنها الماركتير في 2026؟", "mcq"),
        ...spacer(0),
        mcOption("أ", "استخدام أدوات الـ AI"),
        mcOption("ב", "التفكير الاستراتيجي وحل المشكلات", true),
        mcOption("ג", "التصميم الجرافيكي"),
        mcOption("ד", "كتابة الكود"),
        ...spacer(0),
        infoBox([
          bodyText("التوضيح:", { bold: true, color: COLORS.primary }),
          bodyText("ב) صحيحة — الـ AI ممكن ينفذ، لكن التفكير الاستراتيجي وحل المشكلات هو اللي الماركتير لازم يتميز فيه. باقي المهارات مفيدة لكن مش الأهم."),
        ], COLORS.lightBg),

        ...spacer(2),

        // FOOTER
        infoBox([
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: "انتهى الاختبار", bold: true, size: 28, color: COLORS.primary, font: "Arial" })],
          }),
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [new TextRun({ text: "بالتوفيق في رحلتك لبناء عقلية ماركتير قوي! 🚀", size: 24, color: COLORS.darkText, font: "Arial" })],
          }),
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "— عبد الرحمن الحجازي، الباشماركتير", size: 20, color: "888888", font: "Arial" })],
          }),
        ], COLORS.lightBg),

      ],
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/claude/exam_30q.docx', buffer);
  console.log('Exam document created!');
});
