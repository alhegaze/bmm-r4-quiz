# 🧠 اختبار الموديول الأول - كورس بناء عقلية المسوق

اختبار تفاعلي شامل لقياس العقلية التسويقية للطلاب قبل الانتقال للمستوى الثاني من الكورس.

## ✨ المميزات

- ⏰ تايمر 60 دقيقة مع عد تنازلي
- 🔒 منع إعادة المحاولة لمدة 6 ساعات
- 📊 ربط تلقائي بـ Google Sheets
- 📱 تصميم متجاوب (Responsive)
- 🌙 واجهة RTL احترافية
- 📤 إرسال تلقائي عند انتهاء الوقت
- 💾 حفظ تلقائي للإجابات

## 🚀 التشغيل المحلي

### المتطلبات
- Node.js 16+ 
- npm أو yarn

### التثبيت

```bash
# نسخ المشروع
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# تثبيت المكتبات
npm install

# تشغيل السيرفر المحلي
npm run dev
```

سيفتح المشروع على `http://localhost:3000`

## 📦 البناء للإنتاج

```bash
npm run build
```

سيتم إنشاء مجلد `dist` يحتوي على الملفات الجاهزة للنشر.

## 🌐 النشر على Vercel

1. سجل دخول على [Vercel](https://vercel.com)
2. اربط حسابك بـ GitHub
3. اختر المشروع
4. اضغط Deploy

الإعدادات ستُطبق تلقائياً من ملف `vercel.json`

## ⚙️ الإعداد

### ربط Google Sheets

1. أنشئ Google Sheet جديد
2. افتح Extensions → Apps Script
3. انسخ الكود من `google_apps_script.js`
4. انشر كـ Web App
5. انسخ الـ URL وضعه في `src/App.jsx`:

```javascript
const WEB_APP_URL = 'YOUR_WEB_APP_URL_HERE';
```

## 📁 هيكل المشروع

```
.
├── src/
│   ├── App.jsx           # المكون الرئيسي
│   ├── main.jsx          # نقطة الدخول
│   └── index.css         # Styles
├── public/               # الملفات الثابتة
├── index.html            # HTML الرئيسي
├── package.json          # المكتبات
├── vite.config.js        # إعدادات Vite
├── tailwind.config.js    # إعدادات Tailwind
└── vercel.json           # إعدادات Vercel
```

## 🛠️ التقنيات المستخدمة

- ⚛️ React 18
- ⚡ Vite
- 🎨 Tailwind CSS
- 🎯 Lucide React Icons
- 📊 Google Sheets API

## 📝 الترخيص

جميع الحقوق محفوظة © 2026 عبد الرحمن الحجازي - الباشماركتير

## 👨‍💻 المطور

**عبد الرحمن الحجازي (الباشماركتير)**
- كورس بناء عقلية المسوق
- [WhatsApp](https://api.whatsapp.com/send/?phone=201030923612)

---

تم التطوير بمساعدة Claude AI
