# ✅ قائمة التحقق النهائية قبل النشر

## 🔴 ضروري جداً - لازم تعمله!

### 1. تحديث Web App URL

**الملف:** `src/App.jsx`  
**السطر:** 12

```javascript
// ❌ قبل التعديل
const WEB_APP_URL = 'YOUR_WEB_APP_URL_HERE';

// ✅ بعد التعديل
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

**كيف تحصل على الـ URL:**
1. افتح Google Sheet
2. Extensions → Apps Script
3. Deploy → New deployment → Web app
4. انسخ الـ URL

---

## 🟡 مهم - يُنصح بعمله

### 2. تحديث معلومات المشروع في README.md

**الملف:** `README.md`

**غيّر:**
```markdown
# في السطور 50-55 تقريباً
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**إلى:**
```markdown
git clone https://github.com/your-actual-username/marketing-mindset-exam.git
```

---

### 3. تحديث معلومات المطور (اختياري)

**الملف:** `README.md`  
**السطر:** 90+

```markdown
**عبد الرحمن الحجازي (الباشماركتير)**
- كورس بناء عقلية المسوق
- [WhatsApp](https://api.whatsapp.com/send/?phone=201030923612)
```

غيّرها لمعلوماتك إذا أردت.

---

## 🟢 اختياري - حسب احتياجك

### 4. إضافة Favicon

**المكان:** `public/`

1. ضع ملف `favicon.ico` في مجلد `public/`
2. أو استخدم موقع مثل [favicon.io](https://favicon.io) لتوليده

---

### 5. تحديث Meta Tags

**الملف:** `index.html`

```html
<meta name="description" content="اختبار الموديول الأول - كورس بناء عقلية المسوق" />
<meta name="author" content="عبد الرحمن الحجازي - الباشماركتير" />
```

غيّرها حسب احتياجك.

---

### 6. Custom Domain (إذا كان لديك)

**الملف:** لا يوجد تعديل في الكود

**الخطوات:**
1. من Vercel Dashboard
2. Settings → Domains
3. أضف الدومين

**راجع:** `VERCEL_DEPLOYMENT_GUIDE.md` - قسم Custom Domain

---

## 📋 Checklist سريع

قبل ما تعمل `git push`:

- [ ] ✅ حدثت `WEB_APP_URL` في `src/App.jsx`
- [ ] ✅ اختبرت المشروع محلياً (`npm run dev`)
- [ ] ✅ عملت `npm run build` بنجاح
- [ ] ⚠️ حدثت `README.md` (اختياري)
- [ ] ⚠️ أضفت favicon (اختياري)
- [ ] ✅ تأكدت من وجود `.gitignore`
- [ ] ✅ جاهز للرفع على GitHub

---

## 🚀 الخطوة التالية

بعد ما تتأكد من كل حاجة:

```bash
git add .
git commit -m "Ready for deployment"
git push
```

ثم اتبع `VERCEL_DEPLOYMENT_GUIDE.md` للنشر.

---

## ⚠️ تنبيه مهم

**لا ترفع على GitHub قبل تحديث `WEB_APP_URL`!**

وإلا الاختبار لن يعمل على الموقع المنشور.

---

## 📞 محتاج مساعدة؟

- 📖 اقرأ `START_HERE.md` - الدليل الشامل
- 🚀 اقرأ `VERCEL_DEPLOYMENT_GUIDE.md` - دليل النشر
- 🏗️ اقرأ `PROJECT_STRUCTURE.md` - شرح الملفات

---

**✅ جاهز؟ اتبع الخطوات في `START_HERE.md`**
