let allServices=[],curPlat='Instagram',curType='all',curSvc=null,userBal=0,creds={username:'',password:''};
let lang='ar';
try{
  const saved=localStorage.getItem('m7_lang');
  lang=(saved==='ar'||saved==='en'||saved==='ku_b')?saved:'ar';
  localStorage.setItem('m7_lang',lang);
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
  ku_b:{lang:"کوردی (بادینی)",dir:"rtl",bal:"باڵانسێ تە",ord:"داواکارییا نوو ⚡",ref:"پڕکرنا باڵانسی 💳",his:"تۆمارێن من 🕒",selP:"پلاتفۆرمی هەلبژێرە:",selT:"جۆرێ خزمەتگوزاریێ:",srch:"🔍 ل ناڤ یان ژمارا خزمەتگوزاریێ بگەڕێ...",cat:"بەش:",loadCat:"بەش دهێنە بارکرن...",loadSvc:"خزمەتگوزاری دهێنە بارکرن...",oTit:"داواکارییەکا نوو چێکە",oSub:"خزمەتگوزاریێ هەلبژێرە و لینکی بنڤیسە",svc:"خزمەتگوزاری:",lnk:"لینک:",lnkPh:"لینکی ل ڤێرێ دانێ \u200Ehttps://...\u200E",qty:"چەنداتی:",st:"دەستپێکرن",stV:"ئێکسەر (0 - 15 خولەک)",wr:"گەرەنتی",yes:"هەیە",noW:"بێ گەرەنتی",mm:"کێمترین / زۆرترین",tot:"کۆمێ گشتی",sub:"پشتڕاستکرنا داواکاریێ ⚡",rTit:"پڕکرنا باڵانسێ هەژمارێ 💳",rSub:"ژمارا QiCard یان ناونیشانێ USDT کۆپی بکە و پارەی فرێکە",cpy:"📋 کۆپی",pay:"ڕێکا پارەدانێ:",rAmt:"بڕێ پڕکرنێ ($):",note:"ژمارا پرۆسێ / ناڤێ هنێرەری:",notePh:"ژمارا حەواڵێ یان ناڤێ خۆ بنڤیسە...",rBtn:"هنارتنا داواکارییا پڕکرنێ 🚀",hEmp:"تۆمارا داواکارییان یا ڤالایە",hSub:"داواکاریێن تە ل ڤێرێ دێ دیار بن",tAll:"هەمی",tFol:"فۆڵۆوەرز",tLik:"لایک",tViw:"بینین",tCom:"کۆمێنت",pIg:"ئینستاگرام",pTt:"تیک تۆک",pTg:"تێلیگرام",pYt:"یوتیوب",pFb:"فەیسبووک",pSc:"سناب چات",pTw:"تویتەر / X",pWa:"واتساب",pAl:"هەمی / گشتی",errFill:"هیڤیدارین لینکی بنڤیسە و خزمەتگوزاریێ هەلبژێرە!",okPend:"⏳ ل هیڤییا ڕەزامەندیێ یە",okOrd:"✅ داواکاری هاتە هنارتن #",errFail:"داواکاری سەرنەکەفت",errConn:"خەلەتی د پەیوەندیێ دا",okRef:"✅ داواکاری هاتە هنارتن!",errRef:"❌ خەلەتی روویدا",stProg:"د قۆناغا جێبەجێکرنێ دایە",stPend:"ل هیڤییا ڕەزامەندیێ یە",stDone:"ب دووماهیک هات"}
};

let TR_CACHE={en:{},ar:{},ku_b:{}};
try{const c=JSON.parse(localStorage.getItem('m7_tr_pure_v1')||'{}');if(c&&c.en)TR_CACHE=Object.assign(TR_CACHE,c);}catch(e){}
function saveTrCache(){try{localStorage.setItem('m7_tr_pure_v1',JSON.stringify(TR_CACHE));}catch(e){}}

// Format: aliases...|English|Arabic|Kurdish_Badini
const RAW=`طفي زر مراجعة المتابعين قبل الطلب|اطفي زر مراجعة المتابعين قبل الطلب|أوقف زر مراجعة المتابعين قبل الطلب|Turn off follower review button before ordering|أوقف زر مراجعة المتابعين قبل الطلب|دوگمەیا پێداچوونا فۆڵۆوەران بگرە بەری داواکاریێ
اذا طلبت و الزر مفعل ف لا نستطيع اصلاح طلبك|اذا طلبت والزر مفعل فلا نستطيع اصلاح طلبك|إذا طلبت والزر مفعل فلا نستطيع إصلاح طلبك|If ordered while active we cannot fix your order|إذا طلبت والزر مفعل فلا نستطيع إصلاح طلبك|ئەگەر تە داواکاری کر و دوگمە یا چالاک بیت نەشێین داواکارییا تە چاک بکەین
لا نستطيع اصلاح طلبك|لا يمكن اصلاح طلبك|We cannot fix your order|لا نستطيع إصلاح طلبك|نەشێین داواکارییا تە چاک بکەین
مراجعة المتابعين|مراجعة متابعين|Follower Review|مراجعة المتابعين|پێداچوونا فۆڵۆوەران
يجب ان يكون الحساب عام|الحساب يجب ان يكون عام|Account must be public|يجب أن يكون الحساب عاماً|پێدڤییە هەژمار یا گشتی بیت
لا تضع اكثر من طلب لنفس الرابط|Do not place multiple orders for the same link|لا تضع أكثر من طلب لنفس الرابط|زێدەتر ژ داواکارییەکێ بۆ هەمان لینکی دانەنێ
امكانية الالغاء|امكانيه الالغاء|قابل للالغاء|Cancellable|إمكانية الإلغاء|شیانا هەڵوەشاندنێ
غير قابل للالغاء|لا يمكن الالغاء|Non-Cancellable|غير قابل للإلغاء|نەشێت بهێتە هەڵوەشاندن
خدمات مصغرة احترافية|خزمەتگوزاری المصغرة الاحترافيه|خزمەتگوزاری المصغرة الاحترافية|Professional Micro Services|خدمات مصغرة احترافية|خزمەتگوزاریێن بچووک یێن پیشەیی
المصغرة الاحترافية|مصغرة احترافية|Professional Micro|المصغرة الاحترافية|بچووکێن پیشەیی
تثبيت تطبيقات الهاتف|تثبيت تطبيقات|تحميل تطبيقات|Mobile App Installs|تثبيت تطبيقات الهاتف|دامەزراندنا ئەپێن مۆبایلێ
زوار لموقعك|زوار موقعك|زوار موقع|Website Visitors|زوار لموقعك|سەرەدانکەرێن مالپەڕێ تە
زوار للمواقع|زوار مواقع|زيارات مواقع|زيارات موقع|ترافيك|Website Traffic|زوار للمواقع|سەرەدانێن مالپەڕان
رفع حساب اكسبلور|رفع هەژمار ئێكسپلۆر|رفع اكسبلور|Boost Account to Explore|رفع حساب إكسبلور|بلندکرنا هەژماری بۆ ئێکسپلۆر
ارخص مبيعا اليوم|ارخص مبيعا يوم|Cheapest Best Sellers Today|الأرخص مبيعاً اليوم|ئەرزانترین فرۆتنا ئەڤرۆ
اكثر مبيعا اليوم|اكثر مبيعا يوم|Best Sellers Today|الأكثر مبيعاً اليوم|زۆرترین فرۆتنا ئەڤرۆ
اكثر مبيعا|اكثر طلبا|Best Sellers|الأكثر مبيعاً|زۆرترین فرۆتن
تعمل علي تحديث جديد|يعمل علي تحديث جديد|تعمل على التحديث الجديد|يعمل على التحديث الجديد|Working on New Update|تعمل على التحديث الجديد|کار دکەت ل سەر نووکرنا نوو
يعمل بعد تحديث|تعمل بعد تحديث|شغال بعد تحديث|شغالة بعد تحديث|Working After Update|يعمل بعد التحديث|پشتی نووکرنێ کار دکەت
تعمل علي|يعمل علي|Working on|تعمل على|کار دکەت ل سەر
تحديث جديد|New Update|تحديث جديد|نووکرنا نوو
ضمان مدي حياة|Lifetime Guarantee|ضمان مدى الحياة|گەرەنتی هەتاهەتایی
مدي حياة|Lifetime|مدى الحياة|هەتاهەتایی
اعادة نشر|ري بوست|ريبوست|Repost|إعادة نشر|دووبارە بەلاڤکرن
اعادة تغريد|ريتويت|Retweet|إعادة تغريد|ڕیتویت
تعويض تلقائي|Auto Refill|تعويض تلقائي|قەرەبووکرنا خودکار
زر تعويض|Refill Button|زر التعويض|دوگمەیا قەرەبووکرنێ
اعادة تعبئة|Refill|إعادة تعبئة|قەرەبووکرن
بدون ضمان|لا يوجد ضمان|بدون تعويض|لا يوجد تعويض|غير مضمون|غير مضمونة|بلا ضمان|No Refill|بدون ضمان|بێ گەرەنتی
بدون نقص|بدون نزول|بدون هبوط|عدم نقص|لا ينقص|بي نزول|no drop|non drop|non-drop|Non-Drop|بدون نقص|بێ کێمبوون
نقص قليل|نزول قليل|نقص منخفض|قليل نقص|هبوط قليل|Low Drop|نقص قليل|کێمبوونا کێم
نقص متوسط|نزول متوسط|هبوط متوسط|Medium Drop|نقص متوسط|کێمبوونا ناڤنجی
نقص عالي|نزول عالي|هبوط عالي|High Drop|نقص عالي|کێمبوونا زۆر
بدء فوري|بداية فورية|سريع بدء|تشغيل فوري|Instant Start|بدء فوري|دەستپێکرنا ئێکسەر
سريع جدا|سريعة جدا|فائق سرعة|سرعة فائقة|Super Fast|سريع جداً|گەلەک بلەز
جودة عالية|عالية جودة|High Quality|جودة عالية|کوالێتی بلند
جودة متوسطة|متوسطة جودة|Medium Quality|جودة متوسطة|کوالێتی ناڤنجی
جودة منخفضة|منخفضة جودة|Low Quality|جودة منخفضة|کوالێتی نزم
جودة حقيقية|حقيقية جودة|Real Quality|جودة حقيقية|کوالێتی ڕاستەقینە
مشاهدات بوست صورة|مشاهدات منشور صورة|Photo Post Views|مشاهدات منشور صورة|بینینا پۆستێ وێنەی
بوست صورة|منشور صورة|Photo Post|منشور صورة|پۆستێ وێنەی
مشاهدات ستوري|مشاهدات استوري|Story Views|مشاهدات ستوري|بینینا ستۆری
مشاهدات ريلز|Reels Views|مشاهدات ريلز|بینینا ڕیلز
مشاهدات فيديو|مشاهدات مقاطع|Video Views|مشاهدات فيديو|بینینا ڤیدیۆیێ
مشاهدات بث مباشر|مشاهدات لايف|بث مباشر|Live Stream|بث مباشر|بینینا لایڤی
ساعات مشاهدة|Watch Hours|ساعات مشاهدة|دەمژمێرێن بینینێ
دقائق مشاهدة|Watch Minutes|دقائق مشاهدة|خولەکێن بینینێ
لايكات صفحة|لايكات بيج|Page Likes|لايكات صفحة|لایکێن پەیجی
لايكات تعليق|لايكات كومنت|Comment Likes|لايكات تعليق|لایکێن کۆمێنتێ
اعضاء قناة|Channel Members|أعضاء قناة|ئەندامێن کەنالی
اعضاء مجموعة|اعضاء جروب|اعضاء كروب|Group Members|أعضاء مجموعة|ئەندامێن گرووپی
تعليقات مخصصة|Custom Comments|تعليقات مخصصة|کۆمێنتێن تایبەت
تعليقات عشوائية|Random Comments|تعليقات عشوائية|کۆمێنتێن هەڕەمەکی
تعليقات ايموجي|Emoji Comments|تعليقات إيموجي|کۆمێنتێن ئیمۆجی
حسابات حقيقية|Real Accounts|حسابات حقيقية|هەژمارێن ڕاستەقینە
حسابات قديمة|Old Accounts|حسابات قديمة|هەژمارێن کەڤن
زيارات ملف شخصي|زيارات بروفايل|Profile Visits|زيارات بروفايل|سەرەدانێن پڕۆفایلی
حفظ منشور|حفظ بوست|Post Saves|حفظ المنشور|پاشەکەوتکرنا پۆستی
عروض خاصة|عرض خاص|Special Offers|عروض خاصة|ئۆفەرێن تایبەت
خدمات مجانية|خدمات مجاني|Free Services|خدمات مجانية|خزمەتگوزاری بێ بەرامبەر
خدمات مسوقيين|خدمات مسوقين|Marketers Services|خدمات المسوقين|خزمەتگوزاری بازاڕکەران
خدمات موزعين|Resellers Services|خدمات الموزعين|خزمەتگوزاری بەلاڤکەران
بكجات منوعة|بکچات منوعة|باقات متنوعة|Mixed Packages|باقات متنوعة|پاکێجێن جۆراوجۆر
دعم ممول|Sponsored Boost|الدعم الممول|پشتەڤانییا سپۆنسەرکری
تحقيق ربح|تفعيل ربح|شروط ربح|Monetization|تحقيق الربح|چالاککرنا قازانجی
حملات اعلانية|حملة اعلانية|Ad Campaigns|حملات إعلانية|کەمپینێن ڕیکلامێ
تفاعلات ايجابية|Positive Reactions|تفاعلات إيجابية|کارڤەدانێن ئەرێنی
تفاعلات سلبية|Negative Reactions|تفاعلات سلبية|کارڤەدانێن نەرێنی
انت تكتبها|أنت تكتبها|تكتبها انت|من كتابتك|You Write Them|أنت تكتبها|تو دنڤیسی
مدة تنفيذ|مدة التنفيذ|وقت التنفيذ|فترة التنفيذ|Execution Time|مدة التنفيذ|دەمێ جێبەجێکرنێ
حركة اكسبلور|حركة إكسبلور|Explore Traffic|حركة الإكسبلور|لڤینا ئێکسپلۆر
نقاط تحديثات|نقاط التحديثات|Update Points|نقاط التحديثات|خاڵێن نویکرنێ
جوجل بلاي|قوقل بلاي|Play Store|Google Play|جوجل بلاي|گۆگڵ پلەی
اب ستور|آب ستور|App Store|آب ستور|ئەپ ستۆر
خرائط جوجل|Google Maps|خرائط جوجل|نەخشێن گۆگڵی
حد اقصي|Minimum|Max|الحد الأقصى|زۆرترین
حد ادني|Maximum|Min|الحد الأدنى|کێمترین
باليوم|في يوم|يوميا|Daily|Per Day|يومياً|د ڕۆژێ دا
بالساعة|في ساعة|Hourly|Per Hour|بالساعة|د دەمژمێرێ دا
انستقرام|انستغرام|انستجرام|Instagram|إنستغرام|ئینستاگرام
تيك توك|تيكتوك|TikTok|تيك توك|تیک تۆک
تيليجرام|تليجرام|تلجرام|Telegram|تيليجرام|تێلیگرام
يوتيوب|YouTube|يوتيوب|یوتیوب
فيسبوك|فيس بوك|Facebook|فيسبوك|فەیسبووک
سناب شات|سنابشات|Snapchat|سناب شات|سناب چات
تويتر|اكس|Twitter / X|تويتر|تویتەر
واتساب|واتس اب|WhatsApp|واتساب|واتساب
ثريدز|Threads|ثريدز|سرێدز
سبوتيفاي|Spotify|سبوتيفاي|سپۆتیفای
ديسكورد|Discord|ديسكورد|دیسکۆرد
تويتش|Twitch|تويتش|تویچ
كواي|Kwai|كواي|کوای
كيك|Kick|كيك|کیک
جاكو|Jaco|جاكو|جاکۆ
لينكد ان|لينكدان|LinkedIn|لينكد إن|لینکدئین
بنترست|Pinterest|بنترست|پینتەرێست
ساوند كلاود|SoundCloud|ساوند كلاود|ساوند کلاود
كلوب هاوس|Clubhouse|كلوب هاوس|کلەب هاوس
ريديت|Reddit|ريديت|ڕێدیت
لايكي|Likee|لايكي|لایکی
بيجو لايف|Bigo Live|بيجو لايف|بیگۆ لایڤ
جوجل|قوقل|Google|جوجل|گۆگڵ
عيراقية|عراقية|عراقيين|عراقي|عراق|Iraqi|العراق|عیراق
سعودية|سعوديين|سعودي|Saudi|السعودية|سعودی
اماراتية|اماراتيين|اماراتي|امارات|UAE|الإمارات|ئیمارات
كويتية|كويتيين|كويتي|كويت|Kuwait|الكويت|کوێت
قطرية|قطريين|قطري|قطر|Qatar|قطر|قەتەر
بحرينية|بحرينيين|بحريني|بحرين|Bahrain|البحرين|بەحرەین
عمانية|عمانيين|عماني|عمان|Oman|عمان|عومان
اردنية|اردنيين|اردني|اردن|Jordan|الأردن|ئوردن
لبنانية|لبنانيين|لبناني|لبنان|Lebanon|لبنان|لوبنان
سورية|سوريين|سوري|سوريا|Syria|سوريا|سوریا
فلسطينية|فلسطينيين|فلسطيني|فلسطين|Palestine|فلسطين|فەلەستین
يمنية|يمنيين|يمني|يمن|Yemen|اليمن|یەمەن
مصرية|مصريين|مصري|مصر|Egyptian|مصر|مسر
مغربية|مغربيين|مغربي|مغرب|Morocco|المغرب|مەغریب
جزائرية|جزائريين|جزائري|جزائر|Algeria|الجزائر|جەزائیر
تونسية|تونسيين|تونسي|تونس|Tunisia|تونس|تونس
ليبية|ليبيين|ليبي|ليبيا|Libya|ليبيا|لیبیا
سودانية|سودانيين|سوداني|سودان|Sudan|السودان|سودان
تركية|اتراك|تركي|تركيا|Turkish|تركيا|تورکیا
ايرانية|ايرانيين|ايراني|ايران|Iran|إيران|ئیران
امريكية|امريكيين|امريكي|امريكا|USA|أمريكي|ئەمریکا
بريطانية|بريطانيين|بريطاني|بريطانيا|UK|بريطانيا|بەریتانیا
كندية|كنديين|كندي|كندا|Canada|كندا|کەنەدا
المانية|المانيين|الماني|المانيا|Germany|ألمانيا|ئەلمانیا
فرنسية|فرنسيين|فرنسي|فرنسا|France|فرنسا|فەڕەنسا
ايطالية|ايطاليين|ايطالي|ايطاليا|Italy|إيطاليا|ئیتالیا
اسبانية|اسبانيين|اسباني|اسبانيا|Spain|إسبانيا|ئیسپانیا
روسية|روسيين|روسي|روسيا|Russia|روسيا|رووسیا
اوكرانية|اوكرانيين|اوكراني|اوكرانيا|Ukraine|أوكرانيا|ئۆکرانیا
هندية|هنديين|هندي|هند|India|الهند|هیند
باكستانية|باكستانيين|باكستاني|باكستان|Pakistan|باكستان|پاکستان
برازيلية|برازيليين|برازيلي|برازيل|Brazil|البرازيل|بەرازیل
كورية|كوريين|كوري|كوريا|Korea|كوريا|کۆریا
يابانية|يابانيين|ياباني|يابان|Japan|اليابان|ژاپۆن
صينية|صينيين|صيني|صين|China|الصين|چین
اندونيسية|اندونيسيين|اندونيسي|اندونيسيا|Indonesia|إندونيسيا|ئەندەنوسیا
اوروبية|اوروبيين|اوروبي|اوروبا|Europe|أوروبا|ئەوروپا
اسيوية|اسيوي|اسيا|Asia|آسيا|ئاسیا
خليجيين|خليجية|خليجي|خليج|Gulf|خليجي|کەنداوی
عربية|عربي|عرب|Arab|عربي|عەرەبی
عالميين|عالمية|عالمي|اجانب|اجنبي|دولي|دولية|Worldwide|عالمي|جیهانی
انطباعات|انطباع|Impressions|انطباعات|دەرکەفتن
وصول|Reach|وصول|گەهشتن
تصويتات|تصويت|استطلاعات|استطلاع|Polls|تصويت|دەنگدان
اشتراكات|اشتراك|Subscriptions|اشتراكات|بەشداربوون
بلاغات|بلاغ|ريبورتات|ريبورت|تقرير|Reports|بلاغات|ڕیپۆرت
عروض|عرض|Offers|عروض|ئۆفەر
استوري|استوريات|ستوريات|ستوري|قصص|قصة|Stories|ستوري|ستۆری
منشورات|منشور|بوستات|بوست|Posts|منشورات|پۆست
فيديوهات|فيديو|مقاطع|مقطع|Videos|فيديوهات|ڤیدیۆ
ريلز|ريل|Reels|ريلز|ڕیلز
شورتس|شورت|Shorts|شورتس|شۆرتس
متابعين|متابع|Followers|متابعين|فۆڵۆوەرز
مشتركين|مشترك|Subscribers|مشتركين|سەبسکرایب
اعضاء|عضو|Members|أعضاء|ئەندام
لايكات|اعجابات|لايك|اعجاب|Likes|لايكات|لایک
مشاهدات|مشاهدة|Views|مشاهدات|بینین
تعليقات|تعليق|كومنتات|كومنت|Comments|تعليقات|کۆمێنت
مشاركات|مشاركة|شير|Shares|مشاركات|بەلاڤکرن
حفظ|تخزين|Saves|حفظ|پاشەکەوتکرن
تفاعلات|تفاعل|رياكشنات|رياكشن|Reactions|تفاعلات|کارڤەدان
تفاعلية|تفاعلي|Interactive|تفاعلية|کارلێککەر
تكبيسات|تكبيس|Taps|تكبيسات|کلیکێن لایڤی
حركة|Traffic|حركة|لڤین
نقاط|Points|نقاط|خاڵ
تحديثات|Updates|تحديثات|نویکرن
السكور|سكور|Score|السكور|سکۆر
اكسبلور|Explore|اكسبلور|ئێکسپلۆر
زيارات|زيارة|Visits|زيارات|سەرەدان
زوار|زائرين|زائر|Visitors|زوار|سەرەدانکەر
مواقع|موقع|Websites|Website|مواقع|مالپەڕ
تثبيت|تحميل|تنزيل|Install|Installs|تثبيت|دامەزراندن
تطبيقات|تطبيق|App|Apps|تطبيقات|ئەپ
مصغرة|مصغر|Micro|مصغرة|بچووک
احترافية|احترافي|محترفين|Pro|Professional|احترافية|پیشەیی
تصميم|تصاميم|Design|تصميم|دیزاین
مونتاج|Editing|مونتاج|مۆنتاژ
شعار|شعارات|لوجو|Logo|شعار|لۆگۆ
توثيق|Verification|توثيق|پشتڕاستکرن
رفع|تصدر|Boost|رفع|بلندکرن
نمو|تكبير|Growth|نمو|گەشەپێدان
استماع|استماعات|تشغيل|تشغيلات|Streams|Plays|استماعات|گوهداریکرن
موسيقى|اغاني|اغنية|Tracks|Music|موسيقى|میوزیک
بودكاست|Podcast|بودكاست|پۆدکاست
بريميوم|Premium|بريميوم|پریمیۆم
نجوم|Stars|نجوم|ستێر
تعزيزات|تعزيز|Boosts|تعزيزات|بەهێزکرن
مسابقات|مسابقة|Contest|مسابقات|پێشبڕکێ
ديسلايك|عدم اعجاب|Dislikes|ديسلايك|دیسلایک
مقترح|مقترحات|Suggested|مقترح|پێشنیارکری
مفضلة|Favorites|المفضلة|دڵخواز
تغريدات|تغريدة|Tweets|تغريدات|تویت
ردود|رد|Replies|ردود|بەرسڤ
اصدقاء|صديق|Friends|أصدقاء|هەڤال
شخصي|شخصية|Personal|شخصي|کەسی
تقييمات|تقييم|مراجعات|مراجعة|Ratings|تقييمات|هەلسەنگاندن
منشن|اشارة|Mentions|منشن|مێنشن
حسابات|حساب|Accounts|حسابات|هەژمار
صفحات|صفحة|بيجات|بيج|Pages|صفحات|پەیج
قنوات|قناة|Channels|قنوات|کەنال
مجموعات|مجموعة|جروبات|جروب|كروبات|كروب|Groups|مجموعات|گرووپ
روابط|رابط|Links|روابط|لینک
يوزرات|يوزر|اسم مستخدم|Username|يوزر|ناڤێ بکارهێنەری
بروفايلات|بروفايل|ملف شخصي|Profile|بروفايل|پڕۆفایل
بث|لايف|Live|بث مباشر|لایڤ
صورة|صور|Photo|صورة|وێنە
نشر|تنزيل|Publish|نشر|بەلاڤکرن
مبيعا|مبيع|Sales|مبيعاً|فرۆتن
طلبا|طلبت|طلبك|طلب|طلبات|Orders|طلبات|داواکاری
ضمان|تعويض|Refill|ضمان|گەرەنتی
بدون|لا يوجد|No|بدون|بێ
ثابتة|مستقرة|ثابت|مستقر|Stable|ثابت|جێگیر
فورية|فوري|Instant|فوري|ئێکسەر
سريعة|سريع|Fast|سريع|بلەز
بطيئة|بطيء|بطيي|Slow|بطيء|هێدی
متوسطة|متوسط|Medium|متوسط|ناڤنجی
منخفضة|منخفض|Low|منخفض|نزم
عالية|عالي|High|عالية|بلند
سرعة|Speed|السرعة|لەزاتی
حقيقيين|حقيقية|حقيقي|Real|حقيقي|ڕاستەقینە
نشطين|نشطة|متفاعلين|متفاعل|Active|نشط|چالاک
وهميين|وهمية|وهمي|بوتات|بوت|Bots|بوتات|بۆت
مكس|مختلطة|مختلط|Mixed|مكس|تێکەل
بنات|نساء|فتيات|اناث|Female|بنات|کچ
شباب|ذكور|رجال|Male|شباب|کوڕ
موثقة|موثق|توثيق|Verified|موثق|پشتڕاستکری
ارخص|رخيصة|رخيص|Cheapest|الأرخص|ئەرزانترین
افضل|ممتازة|ممتاز|Best|الأفضل|باشترین
اسرع|Fastest|الأسرع|بلەزترین
اقوى|قوية|قوي|Strong|قوي|بهێز
جديدة|جديد|New|جديد|نوو
قديمة|قديم|Old|قديم|کەڤن
حصرية|حصري|Exclusive|حصري|تایبەت
مميزة|مميز|Featured|مميز|تایبەت
خاصة|خاص|Special|خاص|تایبەت
عامة|عام|General|عام|گشتی
سيرفرات|سيرفر|Server|سيرفر|سێرڤەر
خدمات|خدمة|Services|خدمات|خزمەتگوزاری
اقسام|قسم|Category|أقسام|بەش
مسوقيين|مسوقين|مسوقون|مسوق|Marketers|المسوقين|بازاڕکەران
موزعين|موزعون|موزع|Resellers|الموزعين|بەلاڤکەران
بكجات|بکچات|باقات|باكجات|پکجات|بكج|باقة|Packages|باقات|پاکێج
منوعة|متنوعة|منوع|متنوع|Assorted|متنوعة|جۆراوجۆر
ممولة|ممول|Sponsored|ممول|سپۆنسەرکری
دعم|Boost|دعم|پشتەڤانی
ترويج|اعلانات|اعلان|Ads|ترويج|ڕیکلام
مجانية|مجاني|مجانا|Free|مجاني|بێ بەرامبەر
طوارئ|طواري|طوارء|Emergency|طوارئ|تەنگاڤی
دائما|دايما|دايم|طوال وقت|Always|دائماً|هەردەم
شغالة|شغال|يعمل|تعمل|Working|شغال|کار دکەت
متوقف|صيانة|Maintenance|صيانة|چاککرن
تحديث|محدث|Updated|تحديث|نووکری
فقط|Only|فقط|بتنێ
شاملة|شامل|كاملة|كامل|Full|كامل|تەواو
مباشرة|مباشر|Direct|مباشر|ڕاستەوخۆ
تلقائية|تلقايي|تلقائي|Auto|تلقائي|خودکار
يدوية|يدوي|Manual|يدوي|دەستی
مخصصة|مخصص|Custom|مخصص|تایبەت
عشوائية|عشوايي|عشوائي|Random|عشوائي|هەڕەمەکی
نقص|نزول|هبوط|Drop|نقص|کێمبوون
بدء|بداية|Start|بدء|دەستپێکرن
تدريجي|تدريجية|Drip-Feed|تدريجي|هێدی هێدی
اصلي|اصلية|Original|أصلي|ڕەسەن
مضمون|مضمونة|Guaranteed|مضمون|گەرەنتیکری
محدود|محدودة|Limited|محدود|سنوردار
متاح|متاحة|متوفر|متوفرة|Available|متوفر|بەردەستە
تجريبي|تجريبية|تجربة|Trial|تجريبي|تاقیکرن
طفي|اطفي|اغلق|Turn off|أوقف|بگرە
زر|Button|زر|دوگمە
مفعل|مفعلة|Active|مفعل|چالاک
نستطيع|يمكن|نقدر|We can|نستطيع|دشێین
اصلاح|تعديل|Fix|إصلاح|چاککرن
عبر|خلال|Via|عبر|ب ڕێکا
يوم|ايام|يومي|يومية|Days|يوم|ڕۆژ
ساعات|ساعة|Hours|ساعة|دەمژمێر
دقائق|دقايق|دقيقة|Minutes|دقيقة|خولەک
شهر|اشهر|شهور|شهري|Months|شهر|هەیڤ
سنة|سنوات|سنوي|Years|سنة|ساڵ
كل|جميع|All|الكل|هەمی
اذا|لو|If|إذا|ئەگەر
مع|With|مع|دگەل
من|From|من|ژ
الي|الى|To|إلى|بۆ
في|In|في|د
علي|على|On|على|ل سەر
بعد|After|بعد|پشتی
قبل|Before|قبل|بەری
او|Or|أو|یان
لا|No|لا|نە`;

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
  const v=[p[p.length-3],p[p.length-2],p[p.length-1]]; // [en, ar, ku_b]
  const al=[...new Set([...p.slice(0,-3),...v])].sort((a,b)=>b.length-a.length);
  const mx=Math.max(...al.map(x=>x.length));
  const a=al.map(arPhrase);
  return{mx,re:new RegExp('(^|'+DELIM+')('+a.join('|')+')(?=$|'+DELIM+')','gi'),v};
}).sort((a,b)=>b.mx-a.mx);

function scrubM7(raw){
  return String(raw||'')
    .replace(/[\u064B-\u065F\u0670\u0640\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g,'')
    .replace(/\[?\(?\s*(?:kd1s(?:\.com)?|kd\s*1s|s\d{1,2}|srv\s*\d*|api\s*\d*)\s*\)?\]?\s*[-:|•]?\s*/gi,' ')
    .replace(/\b20\d{2}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/g,'')
    .replace(/(\d+)\s*ك(?=$|[^a-zA-Z0-9\u0600-\u06FF])/g,'$1K')
    .replace(/\|\s*\|+/g,'|')
    .replace(/^[\s\-:|•]+|[\s\-:|•]+$/g,'')
    .replace(/\s+/g,' ')
    .trim();
}

function toBadiniPure(s){
  return s
    .replace(/خزم[هە]\s*تگوزاری/g,'خزمەتگوزاری')
    .replace(/\u06D5\s+(?=[\u0621-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06C6\u06CE\u06D5])/g,'\u06D5')
    .replace(/ناتوانین/g,'نەشێین').replace(/ناتوانیت/g,'نەشێی').replace(/دەتوانین/g,'دشێین').replace(/دەتوانیت/g,'دشێی')
    .replace(/داواکارییەکەت/g,'داواکارییا تە').replace(/هەژمارەکەت/g,'هەژمارا تە').replace(/لینکەکەت/g,'لینکێ تە')
    .replace(/پێداچوونەوەی/g,'پێداچوونا').replace(/پێداچوونەوە/g,'پێداچوون')
    .replace(/هەڵوەشاندنەوەی/g,'هەڵوەشاندنا').replace(/هەڵوەشاندنەوە/g,'هەڵوەشاندن')
    .replace(/چاک بکەینەوە/g,'چاک بکەین').replace(/بکوژێنەوە/g,'بگرە').replace(/بیکوژێنەوە/g,'بگرە')
    .replace(/فۆڵۆوەرەکان/g,'فۆڵۆوەران').replace(/لایکەکان/g,'لایکان').replace(/کۆمێنتەکان/g,'کۆمێنتان')
    .replace(/بەکارهێنەران/g,'بکارهێنەران').replace(/بەکارهێنەر/g,'بکارهێنەر')
    .replace(/دەکات/g,'دکەت').replace(/دەکەن/g,'دکەن').replace(/دەبێت/g,'دبیت').replace(/نابێت/g,'نابیت')
    .replace(/کردنەوەی/g,'کرنا').replace(/کردنی/g,'کرنا').replace(/کردن/g,'کرن')
    .replace(/هەموو/g,'هەمی').replace(/کەمترین/g,'کێمترین').replace(/بەخۆڕایی/g,'بێ بەرامبەر')
    .replace(/لەسەر/g,'ل سەر').replace(/لەگەڵ/g,'دگەل').replace(/لەناو/g,'د ناڤ')
    .replace(/لە ڕێگەی/g,'ب ڕێکا').replace(/لەڕێگەی/g,'ب ڕێکا').replace(/بەبێ/g,'بێ')
    .replace(/تکایە/g,'هیڤیدارین').replace(/پێش/g,'بەری').replace(/دوای/g,'پشتی')
    .replace(/ئێستا/g,'نوکە').replace(/ئەمڕۆ/g,'ئەڤرۆ').replace(/پێویستە/g,'پێدڤییە')
    .replace(/(^|\s)لە(?=\s)/g,'$1ژ');
}

function trBase(s,targetLang){
  if(!s)return s;
  const idx=targetLang==='en'?0:(targetLang==='ar'?1:2);
  let o=scrubM7(s);
  const rngFrom=targetLang==='en'?'From':(targetLang==='ar'?'من':'ژ');
  const rngTo=targetLang==='en'?'to':(targetLang==='ar'?'إلى':'بۆ');
  o=o.replace(/(^|[^a-zA-Z0-9\u0600-\u06FF])(?:من|لە|له|ژ)\s*(\d[\d.,KMBkmb]*)\s*(?:الى|إلى|بۆ|لـ|حتى)\s*(\d[\d.,KMBkmb]*)/g,'$1'+rngFrom+' $2 '+rngTo+' $3');
  for(let i=0;i<RULES.length;i++)o=o.replace(RULES[i].re,(m,p1)=>p1+RULES[i].v[idx]);
  if(targetLang==='ku_b')o=toBadiniPure(o);
  return o
    .replace(/\s*\|\s*/g,' • ')
    .replace(/(?:•\s*){2,}/g,'• ')
    .replace(/^•\s*|\s*•$/g,'')
    .replace(/\s+/g,' ')
    .trim()
    .replace(/(^|\s)(\S+)(?:\s+\2)+(?=\s|$)/gi,'$1$2');
}

function tr(s){
  if(!s)return s;
  let o=trBase(s,lang);
  if(TR_CACHE[lang]){
    o=o.split(/(\s*•\s*|\s+-\s+|\(|\))/).map(seg=>{
      const k=seg.trim();
      if(k&&TR_CACHE[lang][k])return seg.replace(k,TR_CACHE[lang][k]);
      return seg;
    }).join('');
  }
  return o;
}

function needsPurityFix(seg,targetLang){
  if(!seg||!/[a-zA-Z\u0600-\u06FF]/.test(seg))return false;
  if(/^[\d\s.,:$%+\-*/\\|•()[\]KMBkmb]+$/.test(seg))return false;
  if(targetLang==='en')return/[\u0600-\u06FF]/.test(seg);
  if(targetLang==='ar')return/[a-zA-Z]{2,}|[\u067E\u0686\u0698\u06A9\u06AF\u06C6\u06CE\u06D5]/.test(seg);
  return/[a-zA-Z]{2,}|[ةثذظضصطغ]|(?:^|\s)(?:ال|لل|من|في|على|الى|بدون|لا|اذا)(?=\s|$)/.test(seg);
}

let bgBusy=false;
async function ensurePureLanguage(){
  if(bgBusy||!allServices.length)return;
  bgBusy=true;
  const target=lang;
  const tl=target==='en'?'en':(target==='ar'?'ar':'ckb');
  if(!TR_CACHE[target])TR_CACHE[target]={};
  const missing=new Set();
  allServices.forEach(s=>{
    [s.cleanCat,s.cleanName].forEach(txt=>{
      trBase(txt,target).split(/(\s*•\s*|\s+-\s+|\(|\))/).forEach(seg=>{
        const k=seg.trim();
        if(k&&needsPurityFix(k,target)&&!TR_CACHE[target][k])missing.add(k);
      });
    });
  });
  const list=[...missing];
  let changed=false;
  for(let i=0;i<list.length;i+=25){
    if(lang!==target)break;
    const chunk=list.slice(i,i+25);
    try{
      const r=await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl='+tl+'&dt=t&q='+encodeURIComponent(chunk.join('\n')));
      const d=await r.json();
      if(Array.isArray(d)&&Array.isArray(d[0])){
        const lines=d[0].map(c=>c&&c[0]?c[0]:'').join('').split('\n');
        if(lines.length===chunk.length){
          chunk.forEach((src,idx)=>{
            let out=(lines[idx]||src).trim();
            if(target==='ku_b')out=toBadiniPure(out);
            TR_CACHE[target][src]=out;
          });
          changed=true;
          saveTrCache();
        }
      }
    }catch(e){break;}
  }
  bgBusy=false;
  if(changed&&lang===target){
    const cEl=document.getElementById('categorySelect'),sEl=document.getElementById('serviceSelect');
    if(document.activeElement!==cEl&&document.activeElement!==sEl)renderCats();
  }
}

function setLang(l){
  lang=T[l]?l:'ar';
  try{localStorage.setItem('m7_lang',lang);}catch(e){}
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
  if(allServices.length){renderCats();ensurePureLanguage();}
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

function mapServices(rawList){
  return rawList.map(s=>{
    const cat=scrubM7(s.category||'General')||'General';
    const name=scrubM7(s.name||'');
    return Object.assign({},s,{cleanCat:cat,cleanName:name,plat:detPlat(cat,name),tp:detType(cat,name)});
  });
}

try{
  const cachedSvcs=JSON.parse(localStorage.getItem('m7_svcs_v1')||'null');
  if(Array.isArray(cachedSvcs)&&cachedSvcs.length)allServices=mapServices(cachedSvcs);
}catch(e){}

async function fetchServices(){
  const sEl=document.getElementById('serviceSelect'),cEl=document.getElementById('categorySelect');
  try{
    const res=await fetch('/api/services');const txt=await res.text();let data;
    try{data=JSON.parse(txt);}catch(e){if(!allServices.length){setOpt(cEl,'API Error');setOpt(sEl,'API Error');}return;}
    if(!data||!data.success||!Array.isArray(data.services)){if(!allServices.length){const e=(data&&data.error)||'Failed';setOpt(cEl,e);setOpt(sEl,e);}return;}
    try{localStorage.setItem('m7_svcs_v1',JSON.stringify(data.services));}catch(e){}
    allServices=mapServices(data.services);
    if(document.activeElement!==cEl&&document.activeElement!==sEl)renderCats();
    ensurePureLanguage();
  }catch(e){if(!allServices.length){setOpt(cEl,'Error: '+e.message);setOpt(sEl,'Error');}}
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
  if(!list.length)setOpt(sEl,'---');else{
    list.forEach(s=>{
      const o=document.createElement('option');
      o.value=s.service||s.id;
      o.textContent='\u200EM7-'+(s.service||s.id)+'\u200E • '+tr(s.cleanName)+' • \u200E$'+parseFloat(s.rate||0).toFixed(3)+'\u200E';
      sEl.appendChild(o);
    });
    if(list.some(s=>String(s.service||s.id)===String(prev)))sEl.value=prev;
  }
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
  try{const r=await fetch('/api/orders/'+telegramId);const d=await r.json();const box=document.getElementById('historyBox');if(d&&d.orders&&d.orders.length)box.innerHTML=d.orders.map(o=>{const st=o.status==='Pending Approval'?t.stPend:(o.status==='Completed'?t.stDone:t.stProg);return'<div class="history-item"><b>#M7-'+(o.orderId||o.serviceId)+'</b>'+(o.serviceName?' ('+tr(o.serviceName)+')':'')+' - '+st+'<br><small>'+o.link+'</small></div>';}).join('');}catch(e){}
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
