let allServices=[],curPlat='Instagram',curType='all',curSvc=null,userBal=0,creds={username:'',password:''};
let lang='ar';
try{
  lang=localStorage.getItem('m7_lang')||'ar';
  ['m7_trc','m7_trc_v2','m7_trc_v3','m7_tr_v4'].forEach(k=>localStorage.removeItem(k));
}catch(e){}
const tg=window.Telegram&&window.Telegram.WebApp;
if(tg){tg.ready();tg.expand();}

function getTgUser(){
  if(tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.id)return tg.initDataUnsafe.user;
  try{const r=new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppData');if(r){const u=new URLSearchParams(r).get('user');if(u)return JSON.parse(u);}}catch(e){}
  return null;
}
const uObj=getTgUser();
const telegramId=uObj&&uObj.id?String(uObj.id):'';
const username=(uObj&&(uObj.username||uObj.first_name))||'User';
const firstName=(uObj&&uObj.first_name)||'M7 Store';
const setTxt=(id,v)=>{const el=document.getElementById(id);if(el)el.innerText=v;};
setTxt('userIdDisplay',telegramId?('ID: '+telegramId+' 📋'):'ID: Guest');
setTxt('userNameDisplay',firstName);

window.onclick=function(e){if(!e.target.closest('.lang-wrap')){const m=document.getElementById('langMenu');if(m)m.classList.remove('show');}};
function copyText(t,btn){if(!t)return;if(navigator.clipboard)navigator.clipboard.writeText(t.trim()).catch(()=>{});if(btn){const o=btn.innerText;btn.innerText='✅';setTimeout(()=>btn.innerText=o,1400);}}
function fmtBal(n){const v=parseFloat(n)||0;if(v===0)return'$0.00';const s=v.toFixed(4).replace(/0+$/,'').replace(/\.$/,'');const p=s.split('.');return!p[1]?'$'+p[0]+'.00':(p[1].length===1?'$'+s+'0':'$'+s);}

const T={
  ar:{lang:"العربية",dir:"rtl",bal:"رصيدك",ord:"طلب جديد ⚡",ref:"شحن رصيد 💳",his:"سجلاتي 🕒",selP:"اختر المنصة:",selT:"اختر نوع الخدمة:",srch:"🔍 ابحث باسم الخدمة أو الرقم...",cat:"القسم:",loadCat:"جاري تحميل الأقسام...",loadSvc:"جاري جلب الخدمات...",oTit:"إنشاء طلب جديد",oSub:"اختر الخدمة واكتب الرابط الخاص بك",svc:"الخدمة:",lnk:"الرابط:",lnkPh:"ضع الرابط هنا \u200Ehttps://...\u200E",qty:"الكمية:",st:"البدء",stV:"فوري (0 - 15 د)",wr:"الضمان",yes:"متوفر",noW:"بدون ضمان",mm:"الحد الأدنى / الأقصى",tot:"الإجمالي",sub:"تأكيد الطلب ⚡",rTit:"شحن رصيد الحساب 💳",rSub:"انسخ رقم QiCard أو عنوان USDT وأرسل المبلغ",cpy:"📋 نسخ",pay:"طريقة الدفع:",rAmt:"مبلغ الشحن ($):",note:"رقم العملية / اسم المرسل:",notePh:"اكتب رقم الحوالة أو اسم المرسل...",rBtn:"إرسال طلب الشحن 🚀",hEmp:"سجل الطلبات فارغ",hSub:"الطلبات التي تقوم بتثبيتها ستظهر هنا",tAll:"الكل",tFol:"متابعين",tLik:"لايكات",tViw:"مشاهدات",tCom:"تعليقات",pIg:"إنستغرام",pTt:"تيك توك",pTg:"تيليجرام",pYt:"يوتيوب",pFb:"فيسبوك",pSc:"سناب شات",pTw:"تويتر / X",pWa:"واتساب",pAl:"الكل / عام",errFill:"يرجى إدخال الرابط واختيار الخدمة!",okPend:"⏳ بانتظار الموافقة",okOrd:"✅ تم تنفيذ الطلب #",errFail:"فشل تنفيذ الطلب",errConn:"خطأ في الاتصال",okRef:"✅ تم الإرسال بنجاح!",errRef:"❌ خطأ في الإرسال",stProg:"قيد التنفيذ",stPend:"بانتظار الموافقة",stDone:"مكتمل"},
  en:{lang:"English",dir:"ltr",bal:"Balance",ord:"New Order ⚡",ref:"Top Up 💳",his:"History 🕒",selP:"Select Platform:",selT:"Service Type:",srch:"🔍 Search service name or ID...",cat:"Category:",loadCat:"Loading categories...",loadSvc:"Loading services...",oTit:"Create New Order",oSub:"Select a service and enter your link",svc:"Service:",lnk:"Link:",lnkPh:"Paste link here https://...",qty:"Quantity:",st:"Start",stV:"Instant (0 - 15m)",wr:"Guarantee",yes:"Available",noW:"No Refill",mm:"Min / Max",tot:"Total",sub:"Submit Order ⚡",rTit:"Top Up Balance 💳",rSub:"Copy QiCard or USDT (TRC20) and send payment",cpy:"📋 Copy",pay:"Payment Method:",rAmt:"Amount ($):",note:"Transaction ID / Sender Name:",notePh:"Enter transaction ID or sender name...",rBtn:"Send Top-Up Request 🚀",hEmp:"Order history is empty",hSub:"Your submitted orders will appear here",tAll:"All",tFol:"Followers",tLik:"Likes",tViw:"Views",tCom:"Comments",pIg:"Instagram",pTt:"TikTok",pTg:"Telegram",pYt:"YouTube",pFb:"Facebook",pSc:"Snapchat",pTw:"Twitter / X",pWa:"WhatsApp",pAl:"All / General",errFill:"Please enter link and select a service!",okPend:"⏳ Pending Approval",okOrd:"✅ Order #",errFail:"Order Failed",errConn:"Connection Error",okRef:"✅ Request Sent!",errRef:"❌ Error",stProg:"In Progress",stPend:"Pending Approval",stDone:"Completed"},
  ku_b:{lang:"کوردی (بادینی)",dir:"rtl",bal:"باڵانسێ تە",ord:"داواکارییا نوو ⚡",ref:"پڕکرنا باڵانسی 💳",his:"تۆمارێن من 🕒",selP:"پلاتفۆرمی هەلبژێرە:",selT:"جۆرێ خزمەتگوزاریێ:",srch:"🔍 ل ناڤ یان ژمارا خزمەتگوزاریێ بگەڕێ...",cat:"بەش:",loadCat:"بەش دهێنە بارکرن...",loadSvc:"خزمەتگوزاری دهێنە بارکرن...",oTit:"داواکارییەکا نوو چێکە",oSub:"خزمەتگوزاریێ هەلبژێرە و لینکی بنڤیسە",svc:"خزمەتگوزاری:",lnk:"لینک:",lnkPh:"لینکی ل ڤێرێ دانێ \u200Ehttps://...\u200E",qty:"چەنداتی:",st:"دەستپێکرن",stV:"ئێکسەر (0 - 15 خولەک)",wr:"گەرەنتی",yes:"هەیە",noW:"بێ گەرەنتی",mm:"کێمترین / زۆرترین",tot:"کۆمێ گشتی",sub:"پشتڕاستکرنا داواکاریێ ⚡",rTit:"پڕکرنا باڵانسێ هەژمارێ 💳",rSub:"ژمارا QiCard یان ناونیشانێ USDT کۆپی بکە و پارەی فرێکە",cpy:"📋 کۆپی",pay:"ڕێکا پارەدانێ:",rAmt:"بڕێ پڕکرنێ ($):",note:"ژمارا پرۆسێ / ناڤێ هنێرەری:",notePh:"ژمارا حەواڵێ یان ناڤێ خۆ بنڤیسە...",rBtn:"هنارتنا داواکارییا پڕکرنێ 🚀",hEmp:"تۆمارا داواکارییان یا ڤالایە",hSub:"داواکاریێن تە ل ڤێرێ دێ دیار بن",tAll:"هەمی",tFol:"فۆڵۆوەرز",tLik:"لایک",tViw:"بینین",tCom:"کۆمێنت",pIg:"ئینستاگرام",pTt:"تیک تۆک",pTg:"تێلیگرام",pYt:"یوتیوب",pFb:"فەیسبووک",pSc:"سناب چات",pTw:"تویتەر / X",pWa:"واتساب",pAl:"هەمی / گشتی",errFill:"هیڤیدارین لینکی بنڤیسە و خزمەتگوزاریێ هەلبژێرە!",okPend:"⏳ ل هیڤییا ڕەزامەندیێ یە",okOrd:"✅ داواکاری هاتە هنارتن #",errFail:"داواکاری سەرنەکەفت",errConn:"خەلەتی د پەیوەندیێ دا",okRef:"✅ داواکاری هاتە هنارتن!",errRef:"❌ خەلەتی روویدا",stProg:"د قۆناغا جێبەجێکرنێ دایە",stPend:"ل هیڤییا ڕەزامەندیێ یە",stDone:"ب دووماهیک هات"},
  ku_s:{lang:"کوردی (سۆرانی)",dir:"rtl",bal:"باڵانسەکەت",ord:"داواکاری نوێ ⚡",ref:"پڕکردنەوەی باڵانس 💳",his:"تۆمارەکانم 🕒",selP:"پلاتفۆرم هەڵبژێرە:",selT:"جۆری خزمەتگوزاری:",srch:"🔍 گەڕان بە ناو یان ژمارەی خزمەتگوزاری...",cat:"بەش:",loadCat:"بەشەکان باردەکرێن...",loadSvc:"خزمەتگوزارییەکان باردەکرێن...",oTit:"دروستکردنی داواکاری نوێ",oSub:"خزمەتگوزاری هەڵبژێرە و لینکەکەت بنووسە",svc:"خزمەتگوزاری:",lnk:"لینک:",lnkPh:"لینکەکە لێرە دابنێ \u200Ehttps://...\u200E",qty:"بڕ:",st:"دەستپێکردن",stV:"دەستبەجێ (0 - 15 خولەک)",wr:"گەرەنتی",yes:"هەیە",noW:"بێ گەرەنتی",mm:"کەمترین / زۆرترین",tot:"کۆی گشتی",sub:"تەواوکردنی داواکاری ⚡",rTit:"پڕکردنەوەی باڵانسی هەژمار 💳",rSub:"ژمارەی QiCard یان ناونیشانی USDT کۆپی بکە و پارەکە بنێرە",cpy:"📋 کۆپی",pay:"شێوازی پارەدان:",rAmt:"بڕی پڕکردنەوە ($):",note:"ژمارەی مامەڵە / ناوی نێرەر:",notePh:"ژمارەی حەواڵە یان ناوی نێرەر بنووسە...",rBtn:"ناردنی داواکاری پڕکردنەوە 🚀",hEmp:"تۆماری داواکارییەکان بەتاڵە",hSub:"داواکارییەکانت لێرە دەردەکەون",tAll:"هەموو",tFol:"فۆڵۆوەرز",tLik:"لایک",tViw:"بینین",tCom:"کۆمێنت",pIg:"ئینستاگرام",pTt:"تیک تۆک",pTg:"تێلیگرام",pYt:"یوتیوب",pFb:"فەیسبووک",pSc:"سناب چات",pTw:"تویتەر / X",pWa:"واتساب",pAl:"هەموو / گشتی",errFill:"تکایە لینک بنووسە و خزمەتگوزاری هەڵبژێرە!",okPend:"⏳ چاوەڕێی پەسەندکردنە",okOrd:"✅ داواکاری نێردرا #",errFail:"داواکاری سەرکەوتوو نەبوو",errConn:"هەڵە لە پەیوەندیکردن",okRef:"✅ داواکاری نێردرا!",errRef:"❌ هەڵە ڕوویدا",stProg:"لە جێبەجێکردندایە",stPend:"چاوەڕێی پەسەندکردنە",stDone:"تەواوبوو"}
};

const RAW=`طفي زر مراجعة المتابعين قبل الطلب|اطفي زر مراجعة المتابعين قبل الطلب|أوقف زر مراجعة المتابعين قبل الطلب|Turn off follower review button before ordering|أوقف زر مراجعة المتابعين قبل الطلب|دوگمەیا پێداچوونا فۆڵۆوەران بگرە بەری داواکاریێ|دوگمەی پێداچوونەوەی فۆڵۆوەرز بکوژێنەوە پێش داواکاری
اذا طلبت و الزر مفعل ف لا نستطيع اصلاح طلبك|اذا طلبت والزر مفعل فلا نستطيع اصلاح طلبك|إذا طلبت والزر مفعل فلا نستطيع إصلاح طلبك|If ordered while active we cannot fix your order|إذا طلبت والزر مفعل فلا نستطيع إصلاح طلبك|ئەگەر تە داواکاری کر و دوگمە یا چالاک بیت نەشێین داواکارییا تە چاک بکەین|ئەگەر داواکاریت کرد و دوگمەکە چالاک بوو ناتوانین داواکارییەکەت چاک بکەینەوە
لا نستطيع اصلاح طلبك|لا يمكن اصلاح طلبك|We cannot fix your order|لا نستطيع إصلاح طلبك|نەشێین داواکارییا تە چاک بکەین|ناتوانین داواکارییەکەت چاک بکەینەوە
مراجعة المتابعين|مراجعة متابعين|Follower Review|مراجعة المتابعين|پێداچوونا فۆڵۆوەران|پێداچوونەوەی فۆڵۆوەرز
يجب ان يكون الحساب عام|الحساب يجب ان يكون عام|Account must be public|يجب أن يكون الحساب عاماً|پێدڤییە هەژمار یا گشتی بیت|پێویستە هەژمار گشتی بێت
لا تضع اكثر من طلب لنفس الرابط|Do not place multiple orders for the same link|لا تضع أكثر من طلب لنفس الرابط|زێدەتر ژ داواکارییەکێ بۆ هەمان لینکی دانەنێ|زیاتر لە داواکارییەک بۆ هەمان لینک دامەنێ
امكانية الالغاء|امكانيه الالغاء|قابل للالغاء|Cancellable|إمكانية الإلغاء|شیانا هەڵوەشاندنێ|توانای هەڵوەشاندنەوە
غير قابل للالغاء|لا يمكن الالغاء|Non-Cancellable|غير قابل للإلغاء|نەشێت بهێتە هەڵوەشاندن|ناتوانرێت هەڵبوەشێنرێتەوە
خدمات مصغرة احترافية|خزمەتگوزاری المصغرة الاحترافيه|خزمەتگوزاری المصغرة الاحترافية|Professional Micro Services|خدمات مصغرة احترافية|خزمەتگوزاریێن بچووک یێن پیشەیی|خزمەتگوزارییە بچووکە پیشەییەکان
المصغرة الاحترافية|مصغرة احترافية|Professional Micro|المصغرة الاحترافية|بچووکێن پیشەیی|بچووکە پیشەییەکان
تثبيت تطبيقات الهاتف|تثبيت تطبيقات|تحميل تطبيقات|Mobile App Installs|تثبيت تطبيقات الهاتف|دامەزراندنا ئەپێن مۆبایلێ|دامەزراندنی ئەپی مۆبایل
زوار لموقعك|زوار موقعك|زوار موقع|Website Visitors|زوار لموقعك|سەرەدانکەرێن مالپەڕێ تە|سەردانکەرانی ماڵپەڕەکەت
زوار للمواقع|زوار مواقع|زيارات مواقع|زيارات موقع|ترافيك|Website Traffic|زوار للمواقع|سەرەدانێن مالپەڕان|سەردانی ماڵپەڕەکان
رفع حساب اكسبلور|رفع هەژمار ئێكسپلۆر|رفع اكسبلور|Boost Account to Explore|رفع حساب إكسبلور|بلندکرنا هەژماری بۆ ئێکسپلۆر|بەرزکردنەوەی هەژمار بۆ ئێکسپلۆر
ارخص مبيعا اليوم|ارخص مبيعا يوم|هەرزانترین فرۆشی ئەمڕۆ|ئەرزانترین فرۆتنا ئەڤرۆ|Cheapest Best Sellers Today|الأرخص مبيعاً اليوم|ئەرزانترین فرۆتنا ئەڤرۆ|هەرزانترین فرۆشی ئەمڕۆ
اكثر مبيعا اليوم|اكثر مبيعا يوم|Best Sellers Today|الأكثر مبيعاً اليوم|زۆرترین فرۆتنا ئەڤرۆ|زۆرترین فرۆشی ئەمڕۆ
اكثر مبيعا|اكثر طلبا|زۆرترین فرۆش|زۆرترین فرۆتن|Best Sellers|الأكثر مبيعاً|زۆرترین فرۆتن|زۆرترین فرۆش
تعمل علي تحديث جديد|يعمل علي تحديث جديد|تعمل على التحديث الجديد|يعمل على التحديث الجديد|کار دەکات لەسەر نوێکردنەوەی نوێ|کار دکەت ل سەر نووکرنا نوو|Working on New Update|تعمل على التحديث الجديد|کار دکەت ل سەر نووکرنا نوو|کار دەکات لەسەر نوێکردنەوەی نوێ
يعمل بعد تحديث|تعمل بعد تحديث|شغال بعد تحديث|شغالة بعد تحديث|دوای نوێکردنەوە کار دەکات|پشتی نووکرنێ کار دکەت|Working After Update|يعمل بعد التحديث|پشتی نووکرنێ کار دکەت|دوای نوێکردنەوە کار دەکات
تعمل علي|يعمل علي|کار دەکات لەسەر|کار دکەت ل سەر|Working on|تعمل على|کار دکەت ل سەر|کار دەکات لەسەر
تحديث جديد|نوێکردنەوەی نوێ|نووکرنا نوو|New Update|تحديث جديد|نووکرنا نوو|نوێکردنەوەی نوێ
ضمان مدي حياة|گەرەنتی هەمیشەیی|گەرەنتی هەتاهەتایی|Lifetime Guarantee|ضمان مدى الحياة|گەرەنتی هەتاهەتایی|گەرەنتی هەمیشەیی
مدي حياة|هەمیشەیی|هەتاهەتایی|Lifetime|مدى الحياة|هەتاهەتایی|هەمیشەیی
اعادة نشر|ري بوست|ريبوست|دووبارە بڵاوکردنەوە|دووبارە بەلاڤکرن|Repost|إعادة نشر|دووبارە بەلاڤکرن|دووبارە بڵاوکردنەوە
اعادة تغريد|ريتويت|ڕیتویت|Retweet|إعادة تغريد|ڕیتویت|ڕیتویت
تعويض تلقائي|قەرەبووکردنەوەی خۆکار|قەرەبووکرنا خودکار|Auto Refill|تعويض تلقائي|قەرەبووکرنا خودکار|قەرەبووکردنەوەی خۆکار
زر تعويض|دوگمەی قەرەبووکردنەوە|دوگمەیا قەرەبووکرنێ|Refill Button|زر التعويض|دوگمەیا قەرەبووکرنێ|دوگمەی قەرەبووکردنەوە
اعادة تعبئة|قەرەبووکردنەوەی|قەرەبووکردنەوە|قەرەبووکرنا|قەرەبووکرن|Refill|إعادة تعبئة|قەرەبووکرن|قەرەبووکردنەوە
بدون ضمان|لا يوجد ضمان|بدون تعويض|لا يوجد تعويض|غير مضمون|غير مضمونة|بلا ضمان|بێ گەرەنتی|No Refill|بدون ضمان|بێ گەرەنتی|بێ گەرەنتی
بدون نقص|بدون نزول|بدون هبوط|عدم نقص|لا ينقص|بي نزول|no drop|non drop|non-drop|بێ کەمبوون|بێ کێمبوون|Non-Drop|بدون نقص|بێ کێمبوون|بێ کەمبوون
نقص قليل|نزول قليل|نقص منخفض|قليل نقص|هبوط قليل|کەمبوونی کەم|کێمبوونا کێم|Low Drop|نقص قليل|کێمبوونا کێم|کەمبوونی کەم
نقص متوسط|نزول متوسط|هبوط متوسط|کەمبوونی مامناوەند|کێمبوونا ناڤنجی|Medium Drop|نقص متوسط|کێمبوونا ناڤنجی|کەمبوونی مامناوەند
نقص عالي|نزول عالي|هبوط عالي|کەمبوونی زۆر|کێمبوونا زۆر|High Drop|نقص عالي|کێمبوونا زۆر|کەمبوونی زۆر
بدء فوري|بداية فورية|سريع بدء|تشغيل فوري|دەستپێکردنی دەستبەجێ|دەستپێکرنا ئێکسەر|Instant Start|بدء فوري|دەستپێکرنا ئێکسەر|دەستپێکردنی دەستبەجێ
سريع جدا|سريعة جدا|فائق سرعة|سرعة فائقة|زۆر خێرا|گەلەک بلەز|Super Fast|سريع جداً|گەلەک بلەز|زۆر خێرا
جودة عالية|عالية جودة|کوالێتی بەرز|کوالێتی بلند|High Quality|جودة عالية|کوالێتی بلند|کوالێتی بەرز
جودة متوسطة|متوسطة جودة|کوالێتی مامناوەند|کوالێتی ناڤنجی|Medium Quality|جودة متوسطة|کوالێتی ناڤنجی|کوالێتی مامناوەند
جودة منخفضة|منخفضة جودة|کوالێتی نزم|Low Quality|جودة منخفضة|کوالێتی نزم|کوالێتی نزم
جودة حقيقية|حقيقية جودة|کوالێتی ڕاستەقینە|Real Quality|جودة حقيقية|کوالێتی ڕاستەقینە|کوالێتی ڕاستەقینە
مشاهدات بوست صورة|مشاهدات منشور صورة|بینینی پۆستی وێنە|بینینا پۆستێ وێنەی|Photo Post Views|مشاهدات منشور صورة|بینینا پۆستێ وێنەی|بینینی پۆستی وێنە
بوست صورة|منشور صورة|پۆستی وێنە|پۆستێ وێنەی|Photo Post|منشور صورة|پۆستێ وێنەی|پۆستی وێنە
مشاهدات ستوري|مشاهدات استوري|بینینی ستۆری|بینینا ستۆری|Story Views|مشاهدات ستوري|بینینا ستۆری|بینینی ستۆری
مشاهدات ريلز|بینینی ڕیڵز|بینینا ڕیلز|Reels Views|مشاهدات ريلز|بینینا ڕیلز|بینینی ڕیڵز
مشاهدات فيديو|مشاهدات مقاطع|بینینی ڤیدیۆ|بینینا ڤیدیۆیێ|Video Views|مشاهدات فيديو|بینینا ڤیدیۆیێ|بینینی ڤیدیۆ
مشاهدات بث مباشر|مشاهدات لايف|بث مباشر|پەخشی ڕاستەوخۆ|بینینا لایڤی|Live Stream|بث مباشر|لایڤ|پەخشی ڕاستەوخۆ
ساعات مشاهدة|کاتژمێری بینین|دەمژمێرێن بینینێ|Watch Hours|ساعات مشاهدة|دەمژمێرێن بینینێ|کاتژمێری بینین
دقائق مشاهدة|خولەکی بینین|خولەکێن بینینێ|Watch Minutes|دقائق مشاهدة|خولەکێن بینینێ|خولەکی بینین
لايكات صفحة|لايكات بيج|لایکی پەیج|لایکێن پەیجی|Page Likes|لايكات صفحة|لایکێن پەیجی|لایکی پەیج
لايكات تعليق|لايكات كومنت|لایکی کۆمێنت|لایکێن کۆمێنتێ|Comment Likes|لايكات تعليق|لایکێن کۆمێنتێ|لایکی کۆمێنت
اعضاء قناة|ئەندامانی کەناڵ|ئەندامێن کەنالی|Channel Members|أعضاء قناة|ئەندامێن کەنالی|ئەندامانی کەناڵ
اعضاء مجموعة|اعضاء جروب|اعضاء كروب|ئەندامانی گرووپ|ئەندامێن گرووپی|Group Members|أعضاء مجموعة|ئەندامێن گرووپی|ئەندامانی گرووپ
تعليقات مخصصة|کۆمێنتی تایبەت|کۆمێنتێن تایبەت|Custom Comments|تعليقات مخصصة|کۆمێنتێن تایبەت|کۆمێنتی تایبەت
تعليقات عشوائية|کۆمێنتی هەڕەمەکی|کۆمێنتێن هەڕەمەکی|Random Comments|تعليقات عشوائية|کۆمێنتێن هەڕەمەکی|کۆمێنتی هەڕەمەکی
تعليقات ايموجي|کۆمێنتی ئیمۆجی|کۆمێنتێن ئیمۆجی|Emoji Comments|تعليقات إيموجي|کۆمێنتێن ئیمۆجی|کۆمێنتی ئیمۆجی
حسابات حقيقية|هەژماری ڕاستەقینە|هەژمارێن ڕاستەقینە|Real Accounts|حسابات حقيقية|هەژمارێن ڕاستەقینە|هەژماری ڕاستەقینە
حسابات قديمة|هەژماری کۆن|هەژمارێن کەڤن|Old Accounts|حسابات قديمة|هەژمارێن کەڤن|هەژماری کۆن
زيارات ملف شخصي|زيارات بروفايل|سەردانی پڕۆفایل|سەرەدانێن پڕۆفایلی|Profile Visits|زيارات بروفايل|سەرەدانێن پڕۆفایلی|سەردانی پڕۆفایل
حفظ منشور|حفظ بوست|پاشەکەوتکردنی پۆست|پاشەکەوتکرنا پۆستی|Post Saves|حفظ المنشور|پاشەکەوتکرنا پۆستی|پاشەکەوتکردنی پۆست
عروض خاصة|عرض خاص|ئۆفەرە تایبەتەکان|ئۆفەرێن تایبەت|Special Offers|عروض خاصة|ئۆفەرێن تایبەت|ئۆفەرە تایبەتەکان
خدمات مجانية|خدمات مجاني|خزمەتگوزاری بەخۆڕایی|خزمەتگوزاری بێ بەرامبەر|Free Services|خدمات مجانية|خزمەتگوزاری بێ بەرامبەر|خزمەتگوزاری بەخۆڕایی
خدمات مسوقيين|خدمات مسوقين|خزمەتگوزاری بەبازاڕکەران|خزمەتگوزاری بازاڕکەران|Marketers Services|خدمات المسوقين|خزمەتگوزاری بازاڕکەران|خزمەتگوزاری بەبازاڕکەران
خدمات موزعين|خزمەتگوزاری دابەشکاران|خزمەتگوزاری بەلاڤکەران|Resellers Services|خدمات الموزعين|خزمەتگوزاری بەلاڤکەران|خزمەتگوزاری دابەشکاران
بكجات منوعة|باقات متنوعة|بكجات جوراوجور|بكجات جۆراوجۆر|پاکێجی جۆراوجۆر|پاکێجێن جۆراوجۆر|Mixed Packages|باقات متنوعة|پاکێجێن جۆراوجۆر|پاکێجی جۆراوجۆر
دعم ممول|پشتگیری سپۆنسەرکراو|پشتەڤانییا سپۆنسەرکری|Sponsored Boost|الدعم الممول|پشتەڤانییا سپۆنسەرکری|پشتگیری سپۆنسەرکراو
تحقيق ربح|تفعيل ربح|شروط ربح|چالاککردنی قازانج|چالاککرنا قازانجی|Monetization|تحقيق الربح|چالاککرنا قازانجی|چالاککردنی قازانج
حملات اعلانية|حملة اعلانية|Ad Campaigns|حملات إعلانية|کەمپینێن ڕیکلامێ|کەمپینی ڕیکلام
تفاعلات ايجابية|Positive Reactions|تفاعلات إيجابية|کارڤەدانێن ئەرێنی|کاردانەوەی ئەرێنی
تفاعلات سلبية|Negative Reactions|تفاعلات سلبية|کارڤەدانێن نەرێنی|کاردانەوەی نەرێنی
جوجل بلاي|قوقل بلاي|Play Store|Google Play|جوجل بلاي|گۆگڵ پلەی|گۆگڵ پلەی
اب ستور|آب ستور|App Store|آب ستور|ئەپ ستۆر|ئەپ ستۆر
خرائط جوجل|Google Maps|خرائط جوجل|نەخشێن گۆگڵی|نەخشەی گۆگڵ
حد اقصي|Minimum|Max|الحد الأقصى|زۆرترین|زۆرترین
حد ادني|Maximum|Min|الحد الأدنى|کێمترین|کەمترین
باليوم|في يوم|يوميا|Daily|Per Day|يومياً|د ڕۆژێ دا|لە ڕۆژێکدا
بالساعة|في ساعة|Hourly|Per Hour|بالساعة|د دەمژمێرێ دا|لە کاتژمێرێکدا
انستقرام|انستغرام|انستجرام|ئینستاگرام|Instagram|إنستغرام|ئینستاگرام|ئینستاگرام
تيك توك|تيكتوك|تیک تۆک|TikTok|تيك توك|تیک تۆک|تیک تۆک
تيليجرام|تليجرام|تلجرام|تێلیگرام|Telegram|تيليجرام|تێلیگرام|تێلیگرام
يوتيوب|یوتیوب|YouTube|يوتيوب|یوتیوب|یوتیوب
فيسبوك|فيس بوك|فەیسبووک|Facebook|فيسبوك|فەیسبووک|فەیسبووک
سناب شات|سنابشات|سناب چات|Snapchat|سناب شات|سناب چات|سناب چات
تويتر|اكس|تویتەر|Twitter / X|تويتر|تویتەر|تویتەر
واتساب|واتس اب|واتساب|WhatsApp|واتساب|واتساب|واتساب
ثريدز|سرێدز|Threads|ثريدز|سرێدز|سرێدز
سبوتيفاي|سپۆتیفای|Spotify|سبوتيفاي|سپۆتیفای|سپۆتیفای
ديسكورد|دیسکۆرد|Discord|ديسكورد|دیسکۆرد|دیسکۆرد
تويتش|تویچ|Twitch|تويتش|تویچ|تویچ
كواي|کوای|Kwai|كواي|کوای|کوای
كيك|Kick|كيك|کیک|کیک
جاكو|Jaco|جاكو|جاکۆ|جاکۆ
لينكد ان|لينكدان|لینکدئین|LinkedIn|لينكد إن|لینکدئین|لینکدئین
بنترست|پینتەرێست|Pinterest|بنترست|پینتەرێست|پینتەرێست
ساوند كلاود|SoundCloud|ساوند كلاود|ساوند کلاود|ساوند کلاود
كلوب هاوس|Clubhouse|كلوب هاوس|کلەب هاوس|کلەب هاوس
ريديت|Reddit|ريديت|ڕێدیت|ڕێدیت
لايكي|Likee|لايكي|لایکی|لایکی
بيجو لايف|Bigo Live|بيجو لايف|بیگۆ لایڤ|بیگۆ لایڤ
جوجل|قوقل|Google|جوجل|گۆگڵ|گۆگڵ
عيراقية|عراقية|عراقيين|عراقي|عراق|عێراق|عیراق|Iraqi|العراق|عیراق|عێراق
سعودية|سعوديين|سعودي|سعودی|Saudi|السعودية|سعودی|سعودی
اماراتية|اماراتيين|اماراتي|امارات|ئیمارات|UAE|الإمارات|ئیمارات|ئیمارات
كويتية|كويتيين|كويتي|كويت|کوێت|Kuwait|الكويت|کوێت|کوێت
قطرية|قطريين|قطري|قطر|قەتەر|Qatar|قطر|قەتەر|قەتەر
بحرينية|بحرينيين|بحريني|بحرين|بەحرەین|Bahrain|البحرين|بەحرەین|بەحرەین
عمانية|عمانيين|عماني|عمان|عومان|Oman|عمان|عومان|عومان
اردنية|اردنيين|اردني|اردن|ئوردن|Jordan|الأردن|ئوردن|ئوردن
لبنانية|لبنانيين|لبناني|لبنان|لوبنان|Lebanon|لبنان|لوبنان|لوبنان
سورية|سوريين|سوري|سوريا|سووریا|سوریا|Syria|سوريا|سوریا|سووریا
فلسطينية|فلسطينيين|فلسطيني|فلسطين|فەلەستین|Palestine|فلسطين|فەلەستین|فەلەستین
يمنية|يمنيين|يمني|يمن|یەمەن|Yemen|اليمن|یەمەن|یەمەن
مصرية|مصريين|مصري|مصر|میسر|مسر|Egyptian|مصر|مسر|میسر
مغربية|مغربيين|مغربي|مغرب|مەغریب|Morocco|المغرب|مەغریب|مەغریب
جزائرية|جزائريين|جزائري|جزائر|جەزائیر|Algeria|الجزائر|جەزائیر|جەزائیر
تونسية|تونسيين|تونسي|تونس|توونس|Tunisia|تونس|تونس|توونس
ليبية|ليبيين|ليبي|ليبيا|لیبیا|Libya|ليبيا|لیبیا|لیبیا
سودانية|سودانيين|سوداني|سودان|سوودان|Sudan|السودان|سودان|سوودان
تركية|اتراك|تركي|تركيا|تورکیا|Turkish|تركيا|تورکیا|تورکیا
ايرانية|ايرانيين|ايراني|ايران|ئێران|ئیران|Iran|إيران|ئیران|ئێران
امريكية|امريكيين|امريكي|امريكا|ئەمریکا|USA|أمريكي|ئەمریکا|ئەمریکا
بريطانية|بريطانيين|بريطاني|بريطانيا|بەریتانیا|UK|بريطانيا|بەریتانیا|بەریتانیا
كندية|كنديين|كندي|كندا|کەنەدا|Canada|كندا|کەنەدا|کەنەدا
المانية|المانيين|الماني|المانيا|ئەڵمانیا|ئەلمانیا|Germany|ألمانيا|ئەلمانیا|ئەڵمانیا
فرنسية|فرنسيين|فرنسي|فرنسا|فەڕەنسا|France|فرنسا|فەڕەنسا|فەڕەنسا
ايطالية|ايطاليين|ايطالي|ايطاليا|ئیتاڵیا|ئیتالیا|Italy|إيطاليا|ئیتالیا|ئیتاڵیا
اسبانية|اسبانيين|اسباني|اسبانيا|ئیسپانیا|Spain|إسبانيا|ئیسپانیا|ئیسپانیا
روسية|روسيين|روسي|روسيا|ڕووسیا|رووسیا|Russia|روسيا|رووسیا|ڕووسیا
اوكرانية|اوكرانيين|اوكراني|اوكرانيا|ئۆکرانیا|Ukraine|أوكرانيا|ئۆکرانیا|ئۆکرانیا
هندية|هنديين|هندي|هند|هیند|India|الهند|هیند|هیند
باكستانية|باكستانيين|باكستاني|باكستان|پاکستان|Pakistan|باكستان|پاکستان|پاکستان
برازيلية|برازيليين|برازيلي|برازيل|بەڕازیل|بەرازیل|Brazil|البرازيل|بەرازیل|بەڕازیل
كورية|كوريين|كوري|كوريا|کۆریا|Korea|كوريا|کۆریا|کۆریا
يابانية|يابانيين|ياباني|يابان|ژاپۆن|Japan|اليابان|ژاپۆن|ژاپۆن
صينية|صينيين|صيني|صين|چین|China|الصين|چین|چین
اندونيسية|اندونيسيين|اندونيسي|اندونيسيا|ئەندەنووسیا|ئەندەنوسیا|Indonesia|إندونيسيا|ئەندەنوسیا|ئەندەنووسیا
اوروبية|اوروبيين|اوروبي|اوروبا|ئەورووپا|ئەوروپا|Europe|أوروبا|ئەورووپا|ئەورووپا
اسيوية|اسيوي|اسيا|ئاسیا|Asia|آسيا|ئاسیا|ئاسیا
خليجيين|خليجية|خليجي|خليج|کەنداوی|Gulf|خليجي|کەنداوی|کەنداوی
عربية|عربي|عرب|عەرەبی|Arab|عربي|عەرەبی|عەرەبی
عالميين|عالمية|عالمي|اجانب|اجنبي|دولي|دولية|جیهانی|Worldwide|عالمي|جیهانی|جیهانی
انطباعات|انطباع|دەرکەوتن|دەرکەفتن|Impressions|انطباعات|دەرکەفتن|دەرکەوتن
وصول|گەیشتن|گەهشتن|Reach|وصول|گەهشتن|گەیشتن
تصويتات|تصويت|استطلاعات|استطلاع|دەنگدان|Polls|تصويت|دەنگدان|دەنگدان
اشتراكات|اشتراك|بەشداریکردن|بەشداربوون|Subscriptions|اشتراكات|بەشداربوون|بەشداریکردن
بلاغات|بلاغ|ريبورتات|ريبورت|تقرير|ڕیپۆرت|Reports|بلاغات|ڕیپۆرت|ڕیپۆرت
عروض|عرض|ئۆفەر|Offers|عروض|ئۆفەر|ئۆفەر
استوري|استوريات|ستوريات|ستوري|قصص|قصة|ستۆری|Stories|ستوري|ستۆری|ستۆری
منشورات|منشور|بوستات|بوست|پۆست|Posts|منشورات|پۆست|پۆست
فيديوهات|فيديو|مقاطع|مقطع|ڤیدیۆ|Videos|فيديوهات|ڤیدیۆ|ڤیدیۆ
ريلز|ريل|ڕیڵز|ڕیلز|Reels|ريلز|ڕیلز|ڕیڵز
شورتس|شورت|شۆرتس|Shorts|شورتس|شۆرتس|شۆرتس
متابعين|متابع|فۆڵۆوەرز|Followers|متابعين|فۆڵۆوەرز|فۆڵۆوەرز
مشتركين|مشترك|سەبسکرایب|Subscribers|مشتركين|سەبسکرایب|سەبسکرایب
اعضاء|عضو|ئەندامانی|ئەندامان|ئەندام|Members|أعضاء|ئەندام|ئەندام
لايكات|اعجابات|لايك|اعجاب|لایک|Likes|لايكات|لایک|لایک
مشاهدات|مشاهدة|بینینی|بینین|Views|مشاهدات|بینین|بینین
تعليقات|تعليق|كومنتات|كومنت|کۆمێنت|Comments|تعليقات|کۆمێنت|کۆمێنت
مشاركات|مشاركة|شير|بڵاوکردنەوە|بەلاڤکرن|Shares|مشاركات|بەلاڤکرن|بڵاوکردنەوە
حفظ|تخزين|پاشەکەوتکردن|پاشەکەوتکرن|Saves|حفظ|پاشەکەوتکرن|پاشەکەوتکردن
تفاعلات|تفاعل|رياكشنات|رياكشن|کاردانەوە|کارڤەدان|Reactions|تفاعلات|کارڤەدان|کاردانەوە
اكسبلور|ئێکسپلۆر|Explore|اكسبلور|ئێکسپلۆر|ئێکسپلۆر
زيارات|زيارة|سەردانی|سەردان|سەرەدان|Visits|زيارات|سەرەدان|سەردان
زوار|زائرين|زائر|Visitors|زوار|سەرەدانکەر|سەردانکەران
مواقع|موقع|Websites|Website|مواقع|مالپەڕ|ماڵپەڕ
تثبيت|تحميل|تنزيل|Install|Installs|تثبيت|دامەزراندن|دامەزراندن
تطبيقات|تطبيق|App|Apps|تطبيقات|ئەپ|ئەپ
مصغرة|مصغر|Micro|مصغرة|بچووک|بچووک
احترافية|احترافي|محترفين|Pro|Professional|احترافية|پیشەیی|پیشەیی
تصميم|تصاميم|Design|تصميم|دیزاین|دیزاین
مونتاج|Editing|مونتاج|مۆنتاژ|مۆنتاژ
شعار|شعارات|لوجو|Logo|شعار|لۆگۆ|لۆگۆ
توثيق|Verification|توثيق|پشتڕاستکرن|پشتڕاستکردنەوە
رفع|تصدر|Boost|رفع|بلندکرن|بەرزکردنەوە
نمو|تكبير|Growth|نمو|گەشەپێدان|گەشەپێدان
استماع|استماعات|تشغيل|تشغيلات|Streams|Plays|استماعات|گوهداریکرن|گوێگرتن
موسيقى|اغاني|اغنية|Tracks|Music|موسيقى|میوزیک|میوزیک
بودكاست|Podcast|بودكاست|پۆدکاست|پۆدکاست
بريميوم|Premium|بريميوم|پریمیۆم|پریمیۆم
نجوم|Stars|نجوم|ستێر|ئەستێرە
تعزيزات|تعزيز|Boosts|تعزيزات|بەهێزکرن|بەهێزکردن
مسابقات|مسابقة|Contest|مسابقات|پێشبڕکێ|پێشبڕکێ
ديسلايك|عدم اعجاب|Dislikes|ديسلايك|دیسلایک|دیسلایک
مقترح|مقترحات|Suggested|مقترح|پێشنیارکری|پێشنیارکراو
مفضلة|Favorites|المفضلة|دڵخواز|دڵخوازەکان
تغريدات|تغريدة|Tweets|تغريدات|تویت|تویت
ردود|رد|Replies|ردود|بەرسڤ|وەڵام
اصدقاء|صديق|Friends|أصدقاء|هەڤال|هاوڕێ
شخصي|شخصية|Personal|شخصي|کەسی|کەسی
تقييمات|تقييم|مراجعات|مراجعة|هەڵسەنگاندن|هەلسەنگاندن|Ratings|تقييمات|هەلسەنگاندن|هەڵسەنگاندن
منشن|اشارة|مێنشن|Mentions|منشن|مێنشن|مێنشن
حسابات|حساب|هەژمار|Accounts|حسابات|هەژمار|هەژمار
صفحات|صفحة|بيجات|بيج|پەیج|Pages|صفحات|پەیج|پەیج
قنوات|قناة|کەناڵ|کەنال|Channels|قنوات|کەنال|کەناڵ
مجموعات|مجموعة|جروبات|جروب|كروبات|كروب|گرووپ|Groups|مجموعات|گرووپ|گرووپ
روابط|رابط|لینک|Links|روابط|لینک|لینک
يوزرات|يوزر|اسم مستخدم|ناوی بەکارهێنەر|ناڤێ بکارهێنەری|Username|يوزر|ناڤێ بکارهێنەری|ناوی بەکارهێنەر
بروفايلات|بروفايل|ملف شخصي|پڕۆفایل|Profile|بروفايل|پڕۆفایل|پڕۆفایل
بث|لايف|پەخش|لایڤ|Live|بث مباشر|لایڤ|پەخش
صورة|صور|وێنە|Photo|صورة|وێنە|وێنە
نشر|تنزيل|بڵاوکردنەوە|بەلاڤکرن|Publish|نشر|بەلاڤکرن|بڵاوکردنەوە
مبيعا|مبيع|فرۆشی|فرۆتنا|فرۆتن|Sales|مبيعاً|فرۆتن|فرۆش
طلبا|طلبت|طلبك|طلب|طلبات|داواکاری|Orders|طلبات|داواکاری|داواکاری
ضمان|تعويض|گەرەنتی|Refill|ضمان|گەرەنتی|گەرەنتی
بدون|لا يوجد|بێ|No|بدون|بێ|بێ
ثابتة|مستقرة|ثابت|مستقر|جێگیر|Stable|ثابت|جێگیر|جێگیر
فورية|فوري|دەستبەجێ|ئێکسەر|Instant|فوري|ئێکسەر|دەستبەجێ
سريعة|سريع|خێرا|بلەز|Fast|سريع|بلەز|خێرا
بطيئة|بطيء|بطيي|هێواش|هێدی|Slow|بطيء|هێدی|هێواش
متوسطة|متوسط|مامناوەند|ناڤنجی|Medium|متوسط|ناڤنجی|مامناوەند
منخفضة|منخفض|نزم|Low|منخفض|نزم|نزم
عالية|عالي|بەرز|بلند|High|عالية|بلند|بەرز
سرعة|خێرایی|لەزاتی|Speed|السرعة|لەزاتی|خێرایی
حقيقيين|حقيقية|حقيقي|ڕاستەقینە|Real|حقيقي|ڕاستەقینە|ڕاستەقینە
نشطين|نشطة|متفاعلين|متفاعل|نشط|چالاک|Active|نشط|چالاک|چالاک
وهميين|وهمية|وهمي|بوتات|بوت|بۆت|Bots|بوتات|بۆت|بۆت
مكس|مختلطة|مختلط|تێکەڵ|تێکەل|Mixed|مكس|تێکەل|تێکەڵ
بنات|نساء|فتيات|اناث|کچ|Female|بنات|کچ|کچ
شباب|ذكور|رجال|کوڕ|Male|شباب|کوڕ|کوڕ
موثقة|موثق|توثيق|پشتڕاستکراو|پشتڕاستکری|Verified|موثق|پشتڕاستکری|پشتڕاستکراو
ارخص|رخيصة|رخيص|هەرزانترین|ئەرزانترین|Cheapest|الأرخص|ئەرزانترین|هەرزانترین
افضل|ممتازة|ممتاز|باشترین|Best|الأفضل|باشترین|باشترین
اسرع|خێراترین|بلەزترین|Fastest|الأسرع|بلەزترین|خێراترین
اقوى|قوية|قوي|بەهێز|بهێز|Strong|قوي|بهێز|بەهێز
جديدة|جديد|نوێ|نوو|New|جديد|نوو|نوێ
قديمة|قديم|کۆن|کەڤن|Old|قديم|کەڤن|کۆن
حصرية|حصري|تایبەت|Exclusive|حصري|تایبەت|تایبەت
مميزة|مميز|تایبەت|Featured|مميز|تایبەت|تایبەت
خاصة|خاص|تایبەت|Special|خاص|تایبەت|تایبەت
عامة|عام|گشتی|General|عام|گشتی|گشتی
سيرفرات|سيرفر|سێرڤەر|Server|سيرفر|سێرڤەر|سێرڤەر
خدمات|خدمة|خزمەتگوزاری|Services|خدمات|خزمەتگوزاری|خزمەتگوزاری
اقسام|قسم|بەش|Category|أقسام|بەش|بەش
مسوقيين|مسوقين|مسوقون|مسوق|بەبازاڕکەران|بازاڕکەران|Marketers|المسوقين|بازاڕکەران|بەبازاڕکەران
موزعين|موزعون|موزع|دابەشکاران|بەلاڤکەران|Resellers|الموزعين|بەلاڤکەران|دابەشکاران
بكجات|باقات|باكجات|پکجات|بكج|باقة|پاکێج|Packages|باقات|پاکێج|پاکێج
منوعة|متنوعة|منوع|متنوع|جۆراوجۆر|جوراوجور|Assorted|متنوعة|جۆراوجۆر|جۆراوجۆر
ممولة|ممول|سپۆنسەرکراو|سپۆنسەرکری|Sponsored|ممول|سپۆنسەرکری|سپۆنسەرکراو
دعم|پشتگیری|پشتەڤانی|Boost|دعم|پشتەڤانی|پشتگیری
ترويج|اعلانات|اعلان|ڕیکلام|Ads|ترويج|ڕیکلام|ڕیکلام
مجانية|مجاني|مجانا|بەخۆڕایی|بێ بەرامبەر|Free|مجاني|بێ بەرامبەر|بەخۆڕایی
طوارئ|طواري|طوارء|فریاگوزاری|تەنگاڤی|Emergency|طوارئ|تەنگاڤی|فریاگوزاری
دائما|دايما|دايم|طوال وقت|هەمیشە|هەردەم|Always|دائماً|هەردەم|هەمیشە
شغالة|شغال|يعمل|تعمل|کار دەکات|کار دکەت|Working|شغال|کار دکەت|کار دەکات
متوقف|صيانة|چاککردنەوە|چاککرن|Maintenance|صيانة|چاککرن|چاککردنەوە
تحديث|محدث|نوێکراوە|نووکری|Updated|تحديث|نووکری|نوێکراوە
فقط|تەنها|بتنێ|Only|فقط|بتنێ|تەنها
شاملة|شامل|كاملة|كامل|تەواو|Full|كامل|تەواو|تەواو
مباشرة|مباشر|ڕاستەوخۆ|Direct|مباشر|ڕاستەوخۆ|ڕاستەوخۆ
تلقائية|تلقايي|تلقائي|ئۆتۆماتیکی|خۆکار|خودکار|Auto|تلقائي|خودکار|خۆکار
يدوية|يدوي|دەستی|Manual|يدوي|دەستی|دەستی
مخصصة|مخصص|تایبەت|Custom|مخصص|تایبەت|تایبەت
عشوائية|عشوايي|عشوائي|هەڕەمەکی|Random|عشوائي|هەڕەمەکی|هەڕەمەکی
نقص|نزول|هبوط|کەمبوون|کێمبوون|Drop|نقص|کێمبوون|کەمبوون
بدء|بداية|دەستپێکردن|دەستپێکرن|Start|بدء|دەستپێکرن|دەستپێکردن
تدريجي|تدريجية|Drip-Feed|تدريجي|هێدی هێدی|هێواش هێواش
اصلي|اصلية|Original|أصلي|ڕەسەن|ڕەسەن
مضمون|مضمونة|Guaranteed|مضمون|گەرەنتیکری|گەرەنتیکراو
محدود|محدودة|Limited|محدود|سنوردار|سنووردار
متاح|متاحة|متوفر|متوفرة|Available|متوفر|بەردەستە|بەردەستە
تجريبي|تجريبية|تجربة|Trial|تجريبي|تاقیکرن|تاقیکردنەوە
طفي|اطفي|اغلق|Turn off|أوقف|بگرە|بکوژێنەوە
زر|دوگمە|Button|زر|دوگمە|دوگمە
مفعل|مفعلة|Active|مفعل|چالاک|چالاک
نستطيع|يمكن|نقدر|We can|نستطيع|دشێین|دەتوانین
اصلاح|تعديل|Fix|إصلاح|چاککرن|چاککردنەوە
يوم|ايام|يومي|يومية|ڕۆژ|رۆژ|Days|يوم|ڕۆژ|ڕۆژ
ساعات|ساعة|کاتژمێر|دەمژمێر|Hours|ساعة|دەمژمێر|کاتژمێر
دقائق|دقايق|دقيقة|خولەک|Minutes|دقيقة|خولەک|خولەک
شهر|اشهر|شهور|شهري|مانگ|هەیڤ|Months|شهر|هەیڤ|مانگ
سنة|سنوات|سنوي|ساڵ|Years|سنة|ساڵ|ساڵ
كل|جميع|هەموو|هەمی|All|الكل|هەمی|هەموو
اذا|لو|If|إذا|ئەگەر|ئەگەر
مع|لەگەڵ|دگەل|With|مع|دگەل|لەگەڵ
من|لە|ژ|From|من|ژ|لە
الي|الى|بۆ|To|إلى|بۆ|بۆ
في|لە|د|In|في|د|لە
علي|على|لەسەر|ل سەر|On|على|ل سەر|لەسەر
بعد|دوای|پشتی|After|بعد|پشتی|دوای
قبل|پێش|بەری|Before|قبل|بەری|پێش
او|یان|Or|أو|یان|یان
لا|نە|No|لا|نە|نە`;

function arWord(w){
  const pfx=w.length>=4?'(?:و|ب|ل|ف|ك)?(?:ال|لل)?':(w.length>=3?'(?:ال|لل)?':'');
  const sfx=w.length>=4?'(?:ك|كم|هم|ها)?':'';
  return pfx+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')
    .replace(/ا/g,'[اأإآٱ]')
    .replace(/ي/g,'[يىيیېئ]')
    .replace(/ة/g,'[ةتهۀ]')
    .replace(/ك/g,'[كکڪګ]')
    .replace(/و/g,'[ووؤۆ]')
    .replace(/ر/g,'[ررڕ]')
    .replace(/ل/g,'[للڵ]')+sfx;
}

function arPhrase(nx){
  if(/^[a-z0-9 /-]+$/i.test(nx))return nx.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return nx.split(/\s+/).map(arWord).join('\\s+');
}

const DELIM='[^a-zA-Z0-9\\u0600-\\u06FF]';
const RULES=RAW.trim().split('\n').map(l=>{
  const p=l.split('|');
  const v=[p[p.length-4],p[p.length-3],p[p.length-2],p[p.length-1]];
  const al=[...new Set([...p.slice(0,-4),...v])].sort((a,b)=>b.length-a.length);
  const mx=Math.max(...al.map(x=>x.length));
  const a=al.map(arPhrase);
  return{mx,re:new RegExp('(^|'+DELIM+')('+a.join('|')+')(?=$|'+DELIM+')','gi'),v};
}).sort((a,b)=>b.mx-a.mx);

function tr(s){
  if(!s)return s;
  const idx=lang==='en'?0:(lang==='ar'?1:(lang==='ku_b'?2:3));
  let o=String(s)
    .replace(/[\u064B-\u065F\u0670\u0640\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g,'')
    .replace(/(\d+)\s*ك(?=$|[^a-zA-Z0-9\u0600-\u06FF])/g,'$1K')
    .replace(/خزم[هە]\s*تگوزاری/g,'خزمەتگوزاری')
    .replace(/\u06D5\s+(?=[\u0621-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06C6\u06CE\u06D5])/g,'\u06D5')
    .replace(/^هه\s+/g,'هە');
  for(let i=0;i<RULES.length;i++)o=o.replace(RULES[i].re,(m,p1)=>p1+RULES[i].v[idx]);
  return o.replace(/\s+/g,' ').trim().replace(/(^|\s)(\S+)(?:\s+\2)+(?=\s|$)/gi,'$1$2');
}

function setLang(l){
  lang=T[l]?l:'ar';try{localStorage.setItem('m7_lang',lang);}catch(e){}
  const menu=document.getElementById('langMenu');if(menu)menu.classList.remove('show');
  const t=T[lang];
  const root=document.getElementById('htmlRoot');if(root)root.dir=t.dir;
  setTxt('currentLangTitle',t.lang);
  setTxt('txtBalance',t.bal);
  setTxt('btnNewOrder',t.ord);
  setTxt('btnRefill',t.ref);
  setTxt('btnHistory',t.his);
  setTxt('txtSelectPlatform',t.selP);
  setTxt('txtSelectType',t.selT);
  const sr=document.getElementById('serviceSearch');if(sr)sr.placeholder=t.srch;
  setTxt('txtCategoryLabel',t.cat);
  setTxt('txtNewOrderTitle',t.oTit);
  setTxt('txtNewOrderSub',t.oSub);
  setTxt('txtServiceLabel',t.svc);
  setTxt('txtLinkLabel',t.lnk);
  const ol=document.getElementById('orderLink');if(ol)ol.placeholder=t.lnkPh;
  setTxt('txtQtyLabel',t.qty);
  setTxt('txtStart',t.st);
  setTxt('infoStart',t.stV);
  setTxt('txtWarranty',t.wr);
  setTxt('txtMinMax',t.mm);
  setTxt('submitBtnText',t.sub);
  setTxt('txtRefillTitle',t.rTit);
  setTxt('txtRefillSub',t.rSub);
  setTxt('txtPayMethodLabel',t.pay);
  setTxt('txtRefillLabel',t.rAmt);
  setTxt('txtRefillNoteLabel',t.note);
  const rn=document.getElementById('refillNote');if(rn)rn.placeholder=t.notePh;
  setTxt('txtRefillBtn',t.rBtn);
  document.querySelectorAll('.copy-btn').forEach(b=>b.innerText=t.cpy);
  setTxt('txtHistEmpty',t.hEmp);
  setTxt('txtHistSub',t.hSub);
  setTxt('pInsta',t.pIg);setTxt('pTiktok',t.pTt);setTxt('pTelegram',t.pTg);
  setTxt('pYoutube',t.pYt);setTxt('pFacebook',t.pFb);setTxt('pSnapchat',t.pSc);
  setTxt('pTwitter',t.pTw);setTxt('pWhatsapp',t.pWa);setTxt('pAll',t.pAl);
  renderPills();
  if(allServices.length)renderCats();
  else{setOpt(document.getElementById('categorySelect'),t.loadCat);setOpt(document.getElementById('serviceSelect'),t.loadSvc);updateInfo();}
}

function renderPills(){
  const t=T[lang],box=document.getElementById('typesContainer');if(!box)return;box.innerHTML='';
  [{id:'all',n:t.tAll},{id:'follower',n:t.tFol},{id:'like',n:t.tLik},{id:'view',n:t.tViw},{id:'comment',n:t.tCom}].forEach(x=>{
    const d=document.createElement('div');d.className='type-pill'+(curType===x.id?' selected':'');d.textContent=x.n;
    d.onclick=()=>{curType=x.id;renderPills();renderCats();};box.appendChild(d);
  });
}

function switchTab(t){
  ['btnNewOrder','btnRefill','btnHistory'].forEach(i=>{const el=document.getElementById(i);if(el)el.classList.remove('active');});
  document.getElementById('orderSection').style.display=t==='order'?'block':'none';
  document.getElementById('refillSection').style.display=t==='refill'?'block':'none';
  document.getElementById('historySection').style.display=t==='history'?'block':'none';
  if(t==='order')document.getElementById('btnNewOrder').classList.add('active');
  if(t==='refill')document.getElementById('btnRefill').classList.add('active');
  if(t==='history'){document.getElementById('btnHistory').classList.add('active');loadHistory();}
}

function selectPlatform(p,el){curPlat=p;curType='all';document.querySelectorAll('.platform-card').forEach(c=>c.classList.remove('selected'));el.classList.add('selected');renderPills();renderCats();}

function detPlat(c,n){
  const f=(c+' '+n).toLowerCase();
  if(f.includes('insta')||f.includes('انست')||f.includes('إنست')||f.includes('ئینستا'))return'Instagram';
  if(f.includes('tiktok')||f.includes('تيك')||f.includes('تیک'))return'TikTok';
  if(f.includes('telegram')||f.includes('تيلي')||f.includes('تليجرام')||f.includes('تلجرام')||f.includes('تێلی'))return'Telegram';
  if(f.includes('youtube')||f.includes('يوتيوب')||f.includes('یوتیوب'))return'YouTube';
  if(f.includes('facebook')||f.includes('فيس')||f.includes('فەیسبووک'))return'Facebook';
  if(f.includes('snap')||f.includes('سناب'))return'Snapchat';
  if(f.includes('twitter')||f.includes('تويتر')||f.includes('تویتەر')||/\bx\b/.test(f))return'Twitter';
  if(f.includes('whatsapp')||f.includes('واتس'))return'WhatsApp';
  return'All';
}

function detType(c,n){
  const f=(c+' '+n).toLowerCase();
  if(f.includes('follower')||f.includes('فۆڵۆو')||f.includes('متابع')||f.includes('مشترك')||f.includes('member')||f.includes('أعضاء')||f.includes('اعضاء')||f.includes('ئەندام'))return'follower';
  if(f.includes('like')||f.includes('لايك')||f.includes('لایک')||f.includes('اعجاب')||f.includes('إعجاب')||f.includes('تفاعل'))return'like';
  if(f.includes('view')||f.includes('بینین')||f.includes('مشاهد')||f.includes('story')||f.includes('ستوري')||f.includes('ستۆری')||f.includes('reel')||f.includes('ريلز')||f.includes('ڕیلز')||f.includes('ڕیڵز'))return'view';
  if(f.includes('comment')||f.includes('تعليق')||f.includes('كومنت')||f.includes('کۆمێنت'))return'comment';
  return'other';
}

function setOpt(el,txt){if(!el)return;el.innerHTML='';const o=document.createElement('option');o.value='';o.textContent=txt;el.appendChild(o);}

async function fetchServices(){
  const sEl=document.getElementById('serviceSelect'),cEl=document.getElementById('categorySelect');
  try{
    const res=await fetch('/api/services');const txt=await res.text();let data;
    try{data=JSON.parse(txt);}catch(e){setOpt(cEl,'API Error');setOpt(sEl,'API Error');return;}
    if(!data||!data.success||!Array.isArray(data.services)){const e=(data&&data.error)||'Failed';setOpt(cEl,e);setOpt(sEl,e);return;}
    allServices=data.services.map(s=>{const cat=(s.category||'General').replace(/kd1s/gi,'').trim(),name=(s.name||'').replace(/kd1s/gi,'').trim();return Object.assign({},s,{cleanCat:cat,cleanName:name,plat:detPlat(cat,name),tp:detType(cat,name)});});
    renderCats();
  }catch(e){setOpt(cEl,'Error: '+e.message);setOpt(sEl,'Error');}
}

function getFiltered(){
  const q=document.getElementById('serviceSearch').value.trim().toLowerCase();
  return allServices.filter(s=>(curPlat==='All'||s.plat===curPlat)&&(curType==='all'||s.tp===curType)&&(!q||String(s.service||s.id).includes(q)||s.cleanName.toLowerCase().includes(q)||s.cleanCat.toLowerCase().includes(q)||tr(s.cleanName).toLowerCase().includes(q)||tr(s.cleanCat).toLowerCase().includes(q)));
}

function renderCats(){
  const cEl=document.getElementById('categorySelect'),prev=cEl.value,cats=[...new Set(getFiltered().map(s=>s.cleanCat))];cEl.innerHTML='';
  if(!cats.length)setOpt(cEl,'---');else{cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=tr(c);cEl.appendChild(o);});if(cats.includes(prev))cEl.value=prev;}
  renderSvcs();
}

function renderSvcs(){
  const sEl=document.getElementById('serviceSelect'),prev=sEl.value,cat=document.getElementById('categorySelect').value,list=getFiltered().filter(s=>!cat||s.cleanCat===cat);sEl.innerHTML='';
  if(!list.length)setOpt(sEl,'---');else{list.forEach(s=>{const o=document.createElement('option');o.value=s.service||s.id;o.textContent='#'+(s.service||s.id)+' - '+tr(s.cleanName)+' • $'+parseFloat(s.rate||0).toFixed(3);sEl.appendChild(o);});if(list.some(s=>String(s.service||s.id)===String(prev)))sEl.value=prev;}
  updateInfo();
}

function updateInfo(){
  const id=document.getElementById('serviceSelect').value,t=T[lang];
  curSvc=allServices.find(s=>String(s.service||s.id)===String(id));
  if(curSvc){
    setTxt('infoMinMax',(curSvc.min||50)+' - '+(curSvc.max||200000));
    document.getElementById('orderQuantity').value=curSvc.min||100;
    const low=(curSvc.cleanName+' '+curSvc.cleanCat).toLowerCase(),noW=curSvc.refill===false||low.includes('no refill')||low.includes('بدون ضمان')||low.includes('بدون تعويض')||low.includes('لا يوجد ضمان')||low.includes('بێ گەرەنتی');
    const wEl=document.getElementById('txtYes');if(wEl){wEl.innerText=noW?t.noW:t.yes;wEl.style.color=noW?'#ef4444':'var(--ok)';}
  }
  calcTotal();
}

function calcTotal(){
  const w=T[lang].tot;if(!curSvc){setTxt('orderCost',w+': $0.00');return;}
  const q=Math.max(0,parseFloat(document.getElementById('orderQuantity').value)||0);
  setTxt('orderCost',w+': $'+((q/1000)*parseFloat(curSvc.rate||0)).toFixed(4));
}

async function syncUser(){
  if(!telegramId)return;
  try{
    const r=await fetch('/api/user',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telegramId,username,firstName})});
    const d=await r.json();
    if(d&&d.success){userBal=parseFloat(d.balance)||0;setTxt('userBalance',fmtBal(userBal));if(d.settings){if(d.settings.qicard)setTxt('displayQicard',d.settings.qicard);if(d.settings.usdt)setTxt('displayUsdt',d.settings.usdt);}}
  }catch(e){}
}

async function submitOrder(){
  const link=document.getElementById('orderLink').value.trim(),quantity=parseInt(document.getElementById('orderQuantity').value,10),msg=document.getElementById('msg'),t=T[lang];
  if(!link||!curSvc){msg.style.color='#ef4444';msg.innerText=t.errFill;return;}
  msg.style.color='#38bdf8';msg.innerText='...';
  try{
    const r=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telegramId,username,serviceId:curSvc.service||curSvc.id,link,quantity})});
    const d=await r.json();
    if(d&&d.success){if(d.newBalance!==undefined){userBal=parseFloat(d.newBalance);setTxt('userBalance',fmtBal(userBal));}msg.style.color='#10b981';msg.innerText=d.pending?t.okPend:(t.okOrd+(d.orderId||'')+' 🎉');document.getElementById('orderLink').value='';}
    else{msg.style.color='#ef4444';msg.innerText=(d&&d.error)||t.errFail;}
  }catch(e){msg.style.color='#ef4444';msg.innerText=t.errConn;}
}

async function submitRefill(){
  const method=document.getElementById('refillMethod').value,amount=parseFloat(document.getElementById('refillAmount').value),note=document.getElementById('refillNote').value.trim(),m=document.getElementById('refillMsg'),t=T[lang];
  if(!amount||amount<=0)return;m.style.color='#38bdf8';m.innerText='...';
  try{const r=await fetch('/api/refill-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telegramId,username,method,amount,note})});const d=await r.json();m.style.color=d&&d.success?'#10b981':'#ef4444';m.innerText=d&&d.success?t.okRef:t.errRef;}catch(e){m.style.color='#ef4444';m.innerText=t.errConn;}
}

async function loadHistory(){
  if(!telegramId)return;const t=T[lang];
  try{const r=await fetch('/api/orders/'+telegramId);const d=await r.json();const box=document.getElementById('historyBox');if(d&&d.orders&&d.orders.length)box.innerHTML=d.orders.map(o=>{const st=o.status==='Pending Approval'?t.stPend:(o.status==='Completed'?t.stDone:t.stProg);return'<div class="history-item"><b>#'+(o.orderId||o.serviceId)+'</b>'+(o.serviceName?' ('+tr(o.serviceName)+')':'')+' - '+st+'<br><small>'+o.link+'</small></div>';}).join('');}catch(e){}
}

let clicks=0;
async function handleLogoClick(){
  clicks++;
  if(clicks>=5){
    clicks=0;const u=prompt('Admin User:'),p=prompt('Admin Pass:');if(!u||!p)return;
    const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});const d=await r.json();
    if(d&&d.success){
      creds={username:u,password:p};
      if(d.settings){document.getElementById('adminProfitInput').value=d.settings.profitPercentage||40;document.getElementById('adminQicardInput').value=d.settings.qicard||'';document.getElementById('adminUsdtInput').value=d.settings.usdt||'';document.getElementById('adminBotTokenInput').value=d.settings.botToken||'';document.getElementById('adminChatIdInput').value=d.settings.adminChatId||telegramId;document.getElementById('adminApprovalMode').value=d.settings.approvalMode||'auto';}
      document.getElementById('adminModal').style.display='flex';
    }else alert('Wrong login');
  }
  setTimeout(()=>clicks=0,3000);
}

async function adminAddBalance(){
  const targetTelegramId=document.getElementById('targetUserId').value.trim(),amount=parseFloat(document.getElementById('addBalanceAmount').value);
  const r=await fetch('/api/admin/add-balance',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({},creds,{targetTelegramId,amount}))});const d=await r.json();
  if(d&&d.success){alert('Added! New Balance: '+fmtBal(d.newBalance));syncUser();}else alert('Failed');
}

async function saveAdminSettings(){
  const payload=Object.assign({},creds,{profitPercentage:parseFloat(document.getElementById('adminProfitInput').value),qicard:document.getElementById('adminQicardInput').value.trim(),usdt:document.getElementById('adminUsdtInput').value.trim(),botToken:document.getElementById('adminBotTokenInput').value.trim(),adminChatId:document.getElementById('adminChatIdInput').value.trim(),approvalMode:document.getElementById('adminApprovalMode').value});
  const r=await fetch('/api/admin/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();
  if(d&&d.success){document.getElementById('adminModal').style.display='none';fetchServices();}
}

setLang(lang);syncUser();fetchServices();
// END_M7
