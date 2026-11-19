let allServices = [], curPlat = 'Instagram', curType = 'all', curSvc = null, userBal = 0, creds = { username: '', password: '' };
let lang = 'ar';
try { lang = localStorage.getItem('m7_lang') || 'ar'; } catch (e) {}

const tg = window.Telegram && window.Telegram.WebApp;
if (tg) { tg.ready(); tg.expand(); }

function getTgUser() {
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) return tg.initDataUnsafe.user;
  try {
    const r = new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppData');
    if (r) { const u = new URLSearchParams(r).get('user'); if (u) return JSON.parse(u); }
  } catch (e) {}
  return null;
}

const uObj = getTgUser();
const telegramId = uObj && uObj.id ? String(uObj.id) : '';
const username = (uObj && (uObj.username || uObj.first_name)) || 'User';
const firstName = (uObj && uObj.first_name) || 'M7 Store';

document.getElementById('userIdDisplay').innerText = telegramId ? ('ID: ' + telegramId + ' 📋') : 'ID: Guest';
document.getElementById('userNameDisplay').innerText = firstName;

window.onclick = function (e) {
  if (!e.target.closest('.lang-wrap')) document.getElementById('langMenu').classList.remove('show');
};

function copyText(t, btn) {
  if (!t) return;
  if (navigator.clipboard) navigator.clipboard.writeText(t.trim()).catch(() => {});
  if (btn) { const o = btn.innerText; btn.innerText = '✅'; setTimeout(() => btn.innerText = o, 1400); }
}

function fmtBal(n) {
  const v = parseFloat(n) || 0;
  if (v === 0) return '$0.00';
  const s = v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  const p = s.split('.');
  if (!p[1]) return '$' + p[0] + '.00';
  if (p[1].length === 1) return '$' + s + '0';
  return '$' + s;
}

const T = {
  ar: {
    lang: "العربية", dir: "rtl", bal: "رصيدك",
    ord: "طلب جديد ⚡", ref: "شحن رصيد 💳", his: "سجلاتي 🕒",
    selP: "اختر المنصة:", selT: "اختر نوع الخدمة:",
    srch: "🔍 ابحث باسم الخدمة أو الرقم...", cat: "القسم (Category):",
    oTit: "إنشاء طلب جديد", oSub: "اختر الخدمة واكتب الرابط الخاص بك",
    svc: "الخدمة (Service):", lnk: "الرابط (Link):", lnkPh: "ضع الرابط هنا https://...",
    qty: "الكمية (Quantity):", st: "البدء", stV: "فوري (0 - 15 د)",
    wr: "الضمان", yes: "متوفر", noW: "بدون ضمان",
    mm: "الحد الأدنى / الأقصى", tot: "الإجمالي", sub: "تأكيد الطلب ⚡",
    rTit: "شحن رصيد الحساب 💳", rSub: "انسخ رقم QiCard أو عنوان USDT وأرسل المبلغ",
    cpy: "📋 نسخ", pay: "طريقة الدفع:", rAmt: "مبلغ الشحن ($):",
    note: "رقم العملية / اسم المرسل:", notePh: "اكتب رقم الحوالة أو اسم المرسل...",
    rBtn: "إرسال طلب الشحن 🚀",
    hEmp: "سجل الطلبات فارغ", hSub: "الطلبات التي تقوم بتثبيتها ستظهر هنا",
    tAll: "الكل", tFol: "متابعين", tLik: "لايكات", tViw: "مشاهدات", tCom: "تعليقات",
    pIg: "إنستغرام", pTt: "تيك توك", pTg: "تيليجرام", pYt: "يوتيوب", pFb: "فيسبوك",
    pSc: "سناب شات", pTw: "تويتر / X", pWa: "واتساب", pAl: "الكل / عام",
    loadCat: "جاري تحميل الأقسام...", loadSvc: "جاري جلب الخدمات...",
    errFill: "يرجى إدخال الرابط واختيار الخدمة!", okPend: "⏳ بانتظار الموافقة",
    okOrd: "✅ تم تنفيذ الطلب #", errFail: "فشل تنفيذ الطلب", errConn: "خطأ في الاتصال",
    okRef: "✅ تم الإرسال بنجاح!", errRef: "❌ خطأ في الإرسال",
    stProg: "قيد التنفيذ", stPend: "بانتظار الموافقة", stDone: "مكتمل"
  },
  en: {
    lang: "English", dir: "ltr", bal: "Balance",
    ord: "New Order ⚡", ref: "Top Up 💳", his: "History 🕒",
    selP: "Select Platform:", selT: "Service Type:",
    srch: "🔍 Search service name or ID...", cat: "Category:",
    oTit: "Create New Order", oSub: "Select a service and enter your link",
    svc: "Service:", lnk: "Link:", lnkPh: "Paste link here https://...",
    qty: "Quantity:", st: "Start", stV: "Instant (0 - 15m)",
    wr: "Guarantee", yes: "Available", noW: "No Refill",
    mm: "Min / Max", tot: "Total", sub: "Submit Order ⚡",
    rTit: "Top Up Balance 💳", rSub: "Copy QiCard or USDT (TRC20) and send payment",
    cpy: "📋 Copy", pay: "Payment Method:", rAmt: "Amount ($):",
    note: "Transaction ID / Sender Name:", notePh: "Enter transaction ID or sender name...",
    rBtn: "Send Top-Up Request 🚀",
    hEmp: "Order history is empty", hSub: "Your submitted orders will appear here",
    tAll: "All", tFol: "Followers", tLik: "Likes", tViw: "Views", tCom: "Comments",
    pIg: "Instagram", pTt: "TikTok", pTg: "Telegram", pYt: "YouTube", pFb: "Facebook",
    pSc: "Snapchat", pTw: "Twitter / X", pWa: "WhatsApp", pAl: "All / General",
    loadCat: "Loading categories...", loadSvc: "Loading services...",
    errFill: "Please enter link and select a service!", okPend: "⏳ Pending Approval",
    okOrd: "✅ Order #", errFail: "Order Failed", errConn: "Connection Error",
    okRef: "✅ Request Sent!", errRef: "❌ Error",
    stProg: "In Progress", stPend: "Pending Approval", stDone: "Completed"
  },
  ku_b: {
    lang: "کوردی (بادینی)", dir: "rtl", bal: "باڵانسێ تە",
    ord: "داواکارییا نوو ⚡", ref: "پڕکرنا باڵانسی 💳", his: "تۆمارێن من 🕒",
    selP: "پلاتفۆرمی هەلبژێرە:", selT: "جۆرێ خزمەتگوزاریێ:",
    srch: "🔍 ل ناڤ یان ژمارا خزمەتگوزاریێ بگەڕێ...", cat: "بەش (Category):",
    oTit: "داواکارییەکا نوو چێکە", oSub: "خزمەتگوزاریێ هەلبژێرە و لینکی بنڤیسە",
    svc: "خزمەتگوزاری:", lnk: "لینک (Link):", lnkPh: "لینکی ل ڤێرێ دانێ https://...",
    qty: "چەنداتی (Quantity):", st: "دەستپێکرن", stV: "ئێکسەر (0 - 15 خولەک)",
    wr: "گەرەنتی", yes: "هەیە", noW: "بێ گەرەنتی",
    mm: "کێمترین / زۆرترین", tot: "کۆمێ گشتی", sub: "پشتڕاستکرنا داواکاریێ ⚡",
    rTit: "پڕکرنا باڵانسێ هەژمارێ 💳", rSub: "ژمارا QiCard یان ناونیشانێ USDT کۆپی بکە و پارەی فرێکە",
    cpy: "📋 کۆپی", pay: "ڕێکا پارەدانێ:", rAmt: "بڕێ پڕکرنێ ($):",
    note: "ژمارا پرۆسێ / ناڤێ هنێرەری:", notePh: "ژمارا حەواڵێ یان ناڤێ خۆ بنڤیسە...",
    rBtn: "هنارتنا داواکارییا پڕکرنێ 🚀",
    hEmp: "تۆمارا داواکارییان یا ڤالایە", hSub: "داواکاریێن تە ل ڤێرێ دێ دیار بن",
    tAll: "هەمی", tFol: "فۆڵۆوەرز", tLik: "لایک", tViw: "بینین", tCom: "کۆمێنت",
    pIg: "ئینستاگرام", pTt: "تیک تۆک", pTg: "تێلیگرام", pYt: "یوتیوب", pFb: "فەیسبووک",
    pSc: "سناب چات", pTw: "تویتەر / X", pWa: "واتساب", pAl: "هەمی / گشتی",
    loadCat: "بەش دهێنە بارکرن...", loadSvc: "خزمەتگوزاری دهێنە بارکرن...",
    errFill: "هیڤیدارین لینکی بنڤیسە و خزمەتگوزاریێ هەلبژێرە!", okPend: "⏳ ل هیڤییا ڕەزامەندیێ یە",
    okOrd: "✅ داواکاری هاتە هنارتن #", errFail: "داواکاری سەرنەکەفت", errConn: "خەلەتی د پەیوەندیێ دا",
    okRef: "✅ داواکاری هاتە هنارتن!", errRef: "❌ خەلەتی روویدا",
    stProg: "د قۆناغا جێبەجێکرنێ دایە", stPend: "ل هیڤییا ڕەزامەندیێ یە", stDone: "ب دووماهیک هات"
  },
  ku_s: {
    lang: "کوردی (سۆرانی)", dir: "rtl", bal: "باڵانسەکەت",
    ord: "داواکاری نوێ ⚡", ref: "پڕکردنەوەی باڵانس 💳", his: "تۆمارەکانم 🕒",
    selP: "پلاتفۆرم هەڵبژێرە:", selT: "جۆری خزمەتگوزاری:",
    srch: "🔍 گەڕان بە ناو یان ژمارەی خزمەتگوزاری...", cat: "بەش (Category):",
    oTit: "دروستکردنی داواکاری نوێ", oSub: "خزمەتگوزاری هەڵبژێرە و لینکەکەت بنووسە",
    svc: "خزمەتگوزاری:", lnk: "لینک (Link):", lnkPh: "لینکەکە لێرە دابنێ https://...",
    qty: "بڕ (Quantity):", st: "دەستپێکردن", stV: "دەستبەجێ (0 - 15 خولەک)",
    wr: "گەرەنتی", yes: "هەیە", noW: "بێ گەرەنتی",
    mm: "کەمترین / زۆرترین", tot: "کۆی گشتی", sub: "تەواوکردنی داواکاری ⚡",
    rTit: "پڕکردنەوەی باڵانسی هەژمار 💳", rSub: "ژمارەی QiCard یان ناونیشانی USDT کۆپی بکە و پارەکە بنێرە",
    cpy: "📋 کۆپی", pay: "شێوازی پارەدان:", rAmt: "بڕی پڕکردنەوە ($):",
    note: "ژمارەی مامەڵە / ناوی نێرەر:", notePh: "ژمارەی حەواڵە یان ناوی نێرەر بنووسە...",
    rBtn: "ناردنی داواکاری پڕکردنەوە 🚀",
    hEmp: "تۆماری داواکارییەکان بەتاڵە", hSub: "داواکارییەکانت لێرە دەردەکەون",
    tAll: "هەموو", tFol: "فۆڵۆوەرز", tLik: "لایک", tViw: "بینین", tCom: "کۆمێنت",
    pIg: "ئینستاگرام", pTt: "تیک تۆک", pTg: "تێلیگرام", pYt: "یوتیوب", pFb: "فەیسبووک",
    pSc: "سناب چات", pTw: "تویتەر / X", pWa: "واتساب", pAl: "هەموو / گشتی",
    loadCat: "بەشەکان باردەکرێن...", loadSvc: "خزمەتگوزارییەکان باردەکرێن...",
    errFill: "تکایە لینک بنووسە و خزمەتگوزاری هەڵبژێرە!", okPend: "⏳ چاوەڕێی پەسەندکردنە",
    okOrd: "✅ داواکاری نێردرا #", errFail: "داواکاری سەرکەوتوو نەبوو", errConn: "هەڵە لە پەیوەندیکردن",
    okRef: "✅ داواکاری نێردرا!", errRef: "❌ هەڵە ڕوویدا",
    stProg: "لە جێبەجێکردندایە", stPend: "چاوەڕێی پەسەندکردنە", stDone: "تەواوبوو"
  }
};

const PAIRS = [
  [/الأرخص مبيعا اليوم|الارخص مبيعا اليوم/g, "Cheapest Best Sellers Today", "الأرخص مبيعاً اليوم", "ئەرزانترین فرۆتنا ئەڤرۆ", "هەرزانترین فرۆشی ئەمڕۆ"],
  [/الأكثر مبيعا|الاكثر مبيعا/g, "Best Sellers", "الأكثر مبيعاً", "زۆرترین فرۆتن", "زۆرترین فرۆش"],
  [/تعويض تلقائي|تعويض تلقائى/g, "Auto Refill", "تعويض تلقائي", "قەرەبووکرنا خودکار", "قەرەبووکردنەوەی خۆکار"],
  [/زر التعويض|زر تعويض/g, "Refill Button", "زر التعويض", "دوگمەیا قەرەبووکرنێ", "دوگمەی قەرەبووکردنەوە"],
  [/ضمان مدى الحياة/g, "Lifetime Guarantee", "ضمان مدى الحياة", "گەرەنتی هەتاهەتایی", "گەرەنتی هەمیشەیی"],
  [/بدون ضمان|لا يوجد ضمان|بدون تعويض|لا يوجد تعويض|\bno refill\b/gi, "No Refill", "بدون ضمان", "بێ گەرەنتی", "بێ گەرەنتی"],
  [/بدون نقص|لا ينقص|عدم النقص|\bnon[- ]?drop\b/gi, "Non-Drop", "بدون نقص", "بێ کێمبوون", "بێ کەمبوون"],
  [/نقص قليل|نقص منخفض|قليل النقص/g, "Low Drop", "نقص قليل", "کێمبوونا کێم", "کەمبوونی کەم"],
  [/بدء فوري|بداية فورية|\binstant start\b/gi, "Instant Start", "بدء فوري", "دەستپێکرنا ئێکسەر", "دەستپێکردنی دەستبەجێ"],
  [/سريع جدا|\bsuper fast\b/gi, "Super Fast", "سريع جداً", "گەلەک بلەز", "زۆر خێرا"],
  [/جودة عالية|عالية الجودة|\bhigh quality\b|\bhq\b/gi, "High Quality", "جودة عالية", "کوالێتی بلند", "کوالێتی بەرز"],
  [/جودة متوسطة/g, "Medium Quality", "جودة متوسطة", "کوالێتی ناڤنجی", "کوالێتی مامناوەند"],
  [/مشاهدات ستوري|مشاهدات الستوري|\bstory views?\b/gi, "Story Views", "مشاهدات ستوري", "بینینا ستۆری", "بینینی ستۆری"],
  [/مشاهدات ريلز|مشاهدات الريلز|\breels? views?\b/gi, "Reels Views", "مشاهدات ريلز", "بینینا ڕیلز", "بینینی ڕیڵز"],
  [/مشاهدات فيديو|مشاهدات الفيديو|\bvideo views?\b/gi, "Video Views", "مشاهدات فيديو", "بینینا ڤیدیۆیێ", "بینینی ڤیدیۆ"],
  [/مشاهدات بث مباشر|بث مباشر|\blive stream\b/gi, "Live Stream", "بث مباشر", "لایڤ", "پەخشی ڕاستەوخۆ"],
  [/ساعات مشاهدة|\bwatch time\b/gi, "Watch Hours", "ساعات مشاهدة", "دەمژمێرێن بینینێ", "کاتژمێری بینین"],
  [/لايكات صفحة|لايكات بيج|\bpage likes?\b/gi, "Page Likes", "لايكات صفحة", "لایکێن پەیجی", "لایکی پەیج"],
  [/لايكات تعليقات/g, "Comment Likes", "لايكات تعليقات", "لایکێن کۆمێنتان", "لایکی کۆمێنتەکان"],
  [/أعضاء قناة|اعضاء قناة|\bchannel members?\b/gi, "Channel Members", "أعضاء قناة", "ئەندامێن کەنالی", "ئەندامانی کەناڵ"],
  [/أعضاء مجموعة|اعضاء جروب|اعضاء كروب|اعضاء مجموعة|\bgroup members?\b/gi, "Group Members", "أعضاء مجموعة", "ئەندامێن گرووپی", "ئەندامانی گرووپ"],
  [/تعليقات مخصصة|\bcustom comments?\b/gi, "Custom Comments", "تعليقات مخصصة", "کۆمێنتێن تایبەت", "کۆمێنتی تایبەت"],
  [/تعليقات عشوائية|\brandom comments?\b/gi, "Random Comments", "تعليقات عشوائية", "کۆمێنتێن هەڕەمەکی", "کۆمێنتی هەڕەمەکی"],
  [/حسابات حقيقية|\breal accounts?\b/gi, "Real Accounts", "حسابات حقيقية", "هەژمارێن ڕاستەقینە", "هەژماری ڕاستەقینە"],
  [/حسابات قديمة|\bold accounts?\b/gi, "Old Accounts", "حسابات قديمة", "هەژمارێن کەڤن", "هەژماری کۆن"],
  [/زيارات الملف الشخصي|زيارات بروفايل|\bprofile visits?\b/gi, "Profile Visits", "زيارات بروفايل", "سەرەدانێن پڕۆفایلی", "سەردانی پڕۆفایل"],
  [/حفظ المنشور|حفظ البوست/g, "Post Saves", "حفظ المنشور", "پاشەکەوتکرنا پۆستی", "پاشەکەوتکردنی پۆست"],
  [/يعمل بعد التحديث|شغال بعد التحديث/g, "Working After Update", "يعمل بعد التحديث", "پشتی نووکرنێ کار دکەت", "دوای نوێکردنەوە کار دەکات"],
  [/عروض خاصة|عرض خاص/g, "Special Offers", "عروض خاصة", "ئۆفەرێن تایبەت", "ئۆفەری تایبەت"],
  [/الحد الأقصى|الحد الاقصى/g, "Max", "الحد الأقصى", "زۆرترین", "زۆرترین"],
  [/الحد الأدنى|الحد الادنى/g, "Min", "الحد الأدنى", "کێمترین", "کەمترین"],
  [/باليوم|في اليوم|يوميا/g, "/Day", "يومياً", "د ڕۆژێ دا", "لە ڕۆژێکدا"],
  [/انستقرام|إنستغرام|انستغرام|إنستقرام|\binstagram\b/gi, "Instagram", "إنستغرام", "ئینستاگرام", "ئینستاگرام"],
  [/تيك توك|تيكتوك|\btiktok\b/gi, "TikTok", "تيك توك", "تیک تۆک", "تیک تۆک"],
  [/تيليجرام|تليجرام|تلجرام|\btelegram\b/gi, "Telegram", "تيليجرام", "تێلیگرام", "تێلیگرام"],
  [/يوتيوب|\byoutube\b/gi, "YouTube", "يوتيوب", "یوتیوب", "یوتیوب"],
  [/فيسبوك|فيس بوك|\bfacebook\b/gi, "Facebook", "فيسبوك", "فەیسبووک", "فەیسبووک"],
  [/سناب شات|سنابشات|\bsnapchat\b/gi, "Snapchat", "سناب شات", "سناب چات", "سناب چات"],
  [/تويتر|\btwitter\b/gi, "Twitter", "تويتر", "تویتەر", "تویتەر"],
  [/واتساب|واتس اب|\bwhatsapp\b/gi, "WhatsApp", "واتساب", "واتساب", "واتساب"],
  [/ثريدز|\bthreads\b/gi, "Threads", "ثريدز", "سرێدز", "سرێدز"],
  [/سبوتيفاي|\bspotify\b/gi, "Spotify", "سبوتيفاي", "سپۆتیفای", "سپۆتیفای"],
  [/ديسكورد|\bdiscord\b/gi, "Discord", "ديسكورد", "دیسکۆرد", "دیسکۆرد"],
  [/متابعين|متابع|\bfollowers?\b/gi, "Followers", "متابعين", "فۆڵۆوەرز", "فۆڵۆوەرز"],
  [/مشتركين|مشترك|\bsubscribers?\b/gi, "Subscribers", "مشتركين", "سەبسکرایب", "سەبسکرایب"],
  [/أعضاء|اعضاء|عضو|\bmembers?\b/gi, "Members", "أعضاء", "ئەندام", "ئەندام"],
  [/لايكات|إعجابات|اعجابات|لايك|\blikes?\b/gi, "Likes", "لايكات", "لایک", "لایک"],
  [/مشاهدات|مشاهدة|\bviews?\b/gi, "Views", "مشاهدات", "بینین", "بینین"],
  [/تعليقات|تعليق|كومنتات|\bcomments?\b/gi, "Comments", "تعليقات", "کۆمێنت", "کۆمێنت"],
  [/مشاركات|مشاركة|شير|\bshares?\b/gi, "Shares", "مشاركات", "بەلاڤکرن", "بڵاوکردنەوە"],
  [/حفظ|\bsaves?\b/gi, "Saves", "حفظ", "پاشەکەوتکرن", "پاشەکەوتکردن"],
  [/تفاعلات|تفاعل|رياكشنات|رياكشن|\breactions?\b/gi, "Reactions", "تفاعلات", "کارڤەدان", "کاردانەوە"],
  [/اكسبلور|إكسبلور|\bexplore\b/gi, "Explore", "اكسبلور", "ئێکسپلۆر", "ئێکسپلۆر"],
  [/ريتويت|\bretweets?\b/gi, "Retweets", "ريتويت", "ڕیتویت", "ڕیتویت"],
  [/زيارات|زيارة|\bvisits?\b/gi, "Visits", "زيارات", "سەرەدان", "سەردان"],
  [/تقييمات|تقييم|\bratings?\b/gi, "Ratings", "تقييمات", "هەلسەنگاندن", "هەڵسەنگاندن"],
  [/منشورات|منشور|بوستات|\bposts?\b/gi, "Posts", "منشورات", "پۆست", "پۆست"],
  [/فيديوهات|فيديو|\bvideos?\b/gi, "Videos", "فيديوهات", "ڤیدیۆ", "ڤیدیۆ"],
  [/مع ضمان|بضمان|ضمان|تعويض|\bguaranteed?\b|\brefill\b/gi, "Refill", "ضمان", "گەرەنتی", "گەرەنتی"],
  [/ثابت|ثابتة|مستقر|مستقرة|\bstable\b/gi, "Stable", "ثابت", "جێگیر", "جێگیر"],
  [/فوري|فورية|\binstant\b/gi, "Instant", "فوري", "ئێکسەر", "دەستبەجێ"],
  [/سريع|سريعة|\bfast\b/gi, "Fast", "سريع", "بلەز", "خێرا"],
  [/بطيء|بطيئة|\bslow\b/gi, "Slow", "بطيء", "هێدی", "هێواش"],
  [/متوسط|متوسطة|\bmedium\b/gi, "Medium", "متوسط", "ناڤنجی", "مامناوەند"],
  [/السرعة|سرعة|\bspeed\b/gi, "Speed", "السرعة", "لەزاتی", "خێرایی"],
  [/حقيقيين|حقيقي|حقيقية|\breal\b/gi, "Real", "حقيقي", "ڕاستەقینە", "ڕاستەقینە"],
  [/نشطين|نشط|متفاعلين|متفاعل|\bactive\b/gi, "Active", "نشط", "چالاک", "چالاک"],
  [/وهميين|وهمي|وهمية|بوتات|بوت|\bbots?\b/gi, "Bot", "بوتات", "بۆت", "بۆت"],
  [/مكس|مختلط|مختلطة|\bmixed\b/gi, "Mixed", "مكس", "تێکەل", "تێکەڵ"],
  [/عالميين|عالمي|عالمية|أجانب|اجانب|\bworldwide\b|\bglobal\b/gi, "Worldwide", "عالمي", "جیهانی", "جیهانی"],
  [/عرب|عربي|عربية|\barab\b/gi, "Arab", "عربي", "عەرەبی", "عەرەبی"],
  [/خليجيين|خليجي|\bgulf\b/gi, "Gulf", "خليجي", "کەنداوی", "کەنداوی"],
  [/العراق|عراقيين|عراقي|\biraq\b/gi, "Iraq", "العراق", "عیراق", "عێراق"],
  [/السعودية|سعوديين|سعودي|\bsaudi\b/gi, "Saudi", "السعودية", "سعودی", "سعودی"],
  [/مصر|مصريين|مصري|\begypt\b/gi, "Egypt", "مصر", "مسری", "میسری"],
  [/تركيا|اتراك|تركي|\bturkey\b/gi, "Turkey", "تركيا", "تورکی", "تورکی"],
  [/أمريكي|امريكي|\busa\b/gi, "USA", "أمريكي", "ئەمریکی", "ئەمریکی"],
  [/روسي|روسيا|\brussia\b/gi, "Russia", "روسيا", "رووسی", "ڕووسی"],
  [/بنات|نساء|\bfemale\b/gi, "Female", "بنات", "کچ", "کچ"],
  [/شباب|ذكور|\bmale\b/gi, "Male", "شباب", "کوڕ", "کوڕ"],
  [/موثق|توثيق|\bverified\b/gi, "Verified", "موثق", "پشتڕاستکری", "پشتڕاستکراو"],
  [/الأرخص|الارخص|ارخص|رخيص|\bcheapest\b/gi, "Cheapest", "الأرخص", "ئەرزانترین", "هەرزانترین"],
  [/الأفضل|الافضل|افضل|ممتاز|\bbest\b/gi, "Best", "الأفضل", "باشترین", "باشترین"],
  [/الأسرع|الاسرع|اسرع|\bfastest\b/gi, "Fastest", "الأسرع", "بلەزترین", "خێراترین"],
  [/جديد|جديدة|\bnew\b/gi, "New", "جديد", "نوو", "نوێ"],
  [/حصري|حصرية|\bexclusive\b/gi, "Exclusive", "حصري", "تایبەت", "تایبەت"],
  [/مميز|مميزة|\bfeatured\b/gi, "Featured", "مميز", "تایبەت", "تایبەت"],
  [/سيرفرات|سيرفر|\bservers?\b/gi, "Server", "سيرفر", "سێرڤەر", "سێرڤەر"],
  [/خدمات|خدمة|\bservices?\b/gi, "Services", "خدمات", "خزمەتگوزاری", "خزمەتگوزاری"],
  [/اليوم|\btoday\b/gi, "Today", "اليوم", "ئەڤرۆ", "ئەمڕۆ"],
  [/أيام|ايام|يوم|\bdays?\b/gi, "Days", "يوم", "ڕۆژ", "ڕۆژ"],
  [/ساعات|ساعة|\bhours?\b/gi, "Hours", "ساعة", "دەمژمێر", "کاتژمێر"],
  [/دقائق|دقيقة|\bminutes?\b/gi, "Minutes", "دقيقة", "خولەک", "خولەک"],
  [/شغال|يعمل|\bworking\b/gi, "Working", "شغال", "کار دکەت", "کار دەکات"],
  [/تحديث|\bupdated?\b/gi, "Updated", "تحديث", "نووکری", "نوێکراوە"],
  [/فقط|\bonly\b/gi, "Only", "فقط", "بتنێ", "تەنها"]
];

function tr(s) {
  if (!s) return s;
  const idx = lang === 'en' ? 1 : (lang === 'ar' ? 2 : (lang === 'ku_b' ? 3 : 4));
  let o = String(s).replace(/[\u064B-\u065F]/g, '');
  for (let i = 0; i < PAIRS.length; i++) {
    o = o.replace(PAIRS[i][0], PAIRS[i][idx]);
  }
  return o;
}

function setLang(l) {
  lang = T[l] ? l : 'ar';
  try { localStorage.setItem('m7_lang', lang); } catch (e) {}
  document.getElementById('langMenu').classList.remove('show');
  const t = T[lang];
  document.getElementById('htmlRoot').dir = t.dir;
  document.getElementById('currentLangTitle').innerText = t.lang;
  document.getElementById('txtBalance').innerText = t.bal;
  document.getElementById('btnNewOrder').innerText = t.ord;
  document.getElementById('btnRefill').innerText = t.ref;
  document.getElementById('btnHistory').innerText = t.his;
  document.getElementById('txtSelectPlatform').innerText = t.selP;
  document.getElementById('txtSelectType').innerText = t.selT;
  document.getElementById('serviceSearch').placeholder = t.srch;
  document.getElementById('txtCategoryLabel').innerText = t.cat;
  document.getElementById('txtNewOrderTitle').innerText = t.oTit;
  document.getElementById('txtNewOrderSub').innerText = t.oSub;
  document.getElementById('txtServiceLabel').innerText = t.svc;
  document.getElementById('txtLinkLabel').innerText = t.lnk;
  document.getElementById('orderLink').placeholder = t.lnkPh;
  document.getElementById('txtQtyLabel').innerText = t.qty;
  document.getElementById('txtStart').innerText = t.st;
  document.getElementById('infoStart').innerText = t.stV;
  document.getElementById('txtWarranty').innerText = t.wr;
  document.getElementById('txtMinMax').innerText = t.mm;
  document.getElementById('submitBtnText').innerText = t.sub;
  document.getElementById('txtRefillTitle').innerText = t.rTit;
  document.getElementById('txtRefillSub').innerText = t.rSub;
  document.getElementById('txtPayMethodLabel').innerText = t.pay;
  document.getElementById('txtRefillLabel').innerText = t.rAmt;
  document.getElementById('txtRefillNoteLabel').innerText = t.note;
  document.getElementById('refillNote').placeholder = t.notePh;
  document.getElementById('txtRefillBtn').innerText = t.rBtn;
  document.querySelectorAll('.copy-btn').forEach(b => b.innerText = t.cpy);
  const he = document.getElementById('txtHistEmpty'), hs = document.getElementById('txtHistSub');
  if (he) he.innerText = t.hEmp;
  if (hs) hs.innerText = t.hSub;
  document.getElementById('pInsta').innerText = t.pIg;
  document.getElementById('pTiktok').innerText = t.pTt;
  document.getElementById('pTelegram').innerText = t.pTg;
  document.getElementById('pYoutube').innerText = t.pYt;
  document.getElementById('pFacebook').innerText = t.pFb;
  document.getElementById('pSnapchat').innerText = t.pSc;
  document.getElementById('pTwitter').innerText = t.pTw;
  document.getElementById('pWhatsapp').innerText = t.pWa;
  document.getElementById('pAll').innerText = t.pAl;
  renderPills();
  if (allServices.length) renderCats();
  else {
    setOpt(document.getElementById('categorySelect'), t.loadCat);
    setOpt(document.getElementById('serviceSelect'), t.loadSvc);
    updateInfo();
  }
}

function renderPills() {
  const t = T[lang], box = document.getE
