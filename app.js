let allServices=[],curPlat='Instagram',curType='all',curSvc=null,userBal=0,creds={username:'',password:''};
let lang='ar';try{lang=localStorage.getItem('m7_lang')||'ar';}catch(e){}
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
document.getElementById('userIdDisplay').innerText=telegramId?('ID: '+telegramId+' 📋'):'ID: Guest';
document.getElementById('userNameDisplay').innerText=firstName;

window.onclick=function(e){if(!e.target.closest('.lang-wrap'))document.getElementById('langMenu').classList.remove('show');};
function copyText(t,btn){if(!t)return;if(navigator.clipboard)navigator.clipboard.writeText(t.trim()).catch(()=>{});if(btn){const o=btn.innerText;btn.innerText='✅';setTimeout(()=>btn.innerText=o,1400);}}
function fmtBal(n){const v=parseFloat(n)||0;if(v===0)return'$0.00';const s=v.toFixed(4).replace(/0+$/,'').replace(/\.$/,'');const p=s.split('.');return!p[1]?'$'+p[0]+'.00':(p[1].length===1?'$'+s+'0':'$'+s);}

const T={
  ar:{lang:"العربية",dir:"rtl",bal:"رصيدك",ord:"طلب جديد ⚡",ref:"شحن رصيد 💳",his:"سجلاتي 🕒",selP:"اختر المنصة:",selT:"اختر نوع الخدمة:",srch:"🔍 ابحث باسم الخدمة أو الرقم...",cat:"القسم (Category):",oTit:"إنشاء طلب جديد",oSub:"اختر الخدمة واكتب الرابط الخاص بك",svc:"الخدمة (Service):",lnk:"الرابط (Link):",lnkPh:"ضع الرابط هنا https://...",qty:"الكمية (Quantity):",st:"البدء",stV:"فوري (0 - 15 د)",wr:"الضمان",yes:"متوفر",noW:"بدون ضمان",mm:"الحد الأدنى / الأقصى",tot:"الإجمالي",sub:"تأكيد الطلب ⚡",rTit:"شحن رصيد الحساب 💳",rSub:"انسخ رقم QiCard أو عنوان USDT وأرسل المبلغ",cpy:"📋 نسخ",pay:"طريقة الدفع:",rAmt:"مبلغ الشحن ($):",note:"رقم العملية / اسم المرسل:",notePh:"اكتب رقم الحوالة أو اسم المرسل...",rBtn:"إرسال طلب الشحن 🚀",hEmp:"سجل الطلبات فارغ",hSub:"الطلبات التي تقوم بتثبيتها ستظهر هنا",tAll:"الكل",tFol:"متابعين",tLik:"لايكات",tViw:"مشاهدات",tCom:"تعليقات",pIg:"إنستغرام",pTt:"تيك توك",pTg:"تيليجرام",pYt:"يوتيوب",pFb:"فيسبوك",pSc:"سناب شات",pTw:"تويتر / X",pWa:"واتساب",pAl:"الكل / عام",okPend:"⏳ بانتظار الموافقة",okOrd:"✅ تم تنفيذ الطلب #",errFail:"فشل تنفيذ الطلب",errConn:"خطأ في الاتصال",okRef:"✅ تم الإرسال بنجاح!",errRef:"❌ خطأ في الإرسال",stProg:"قيد التنفيذ",stPend:"بانتظار الموافقة",stDone:"مكتمل"},
  en:{lang:"English",dir:"ltr",bal:"Balance",ord:"New Order ⚡",ref:"Top Up 💳",his:"History 🕒",selP:"Select Platform:",selT:"Service Type:",srch:"🔍 Search service name or ID...",cat:"Category:",oTit:"Create New Order",oSub:"Select a service and enter your link",svc:"Service:",lnk:"Link:",lnkPh:"Paste link here https://...",qty:"Quantity:",st:"Start",stV:"Instant (0 - 15m)",wr:"Guarantee",yes:"Available",noW:"No Refill",mm:"Min / Max",tot:"Total",sub:"Submit Order ⚡",rTit:"Top Up Balance 💳",rSub:"Copy QiCard or USDT (TRC20) and send payment",cpy:"📋 Copy",pay:"Payment Method:",rAmt:"Amount ($):",note:"Transaction ID / Sender Name:",notePh:"Enter transaction ID or sender name...",rBtn:"Send Top-Up Request 🚀",hEmp:"Order history is empty",hSub:"Your submitted orders will appear here",tAll:"All",tFol:"Followers",tLik:"Likes",tViw:"Views",tCom:"Comments",pIg:"Instagram",pTt:"TikTok",pTg:"Telegram",pYt:"YouTube",pFb:"Facebook",pSc:"Snapchat",pTw:"Twitter / X",pWa:"WhatsApp",pAl:"All / General",okPend:"⏳ Pending Approval",okOrd:"✅ Order #",errFail:"Order Failed",errConn:"Connection Error",okRef:"✅ Request Sent!",errRef:"❌ Error",stProg:"In Progress",stPend:"Pending Approval",stDone:"Completed"},
  ku_b:{lang:"کوردی (بادینی)",dir:"rtl",bal:"باڵانسێ تە",ord:"داواکارییا نوو ⚡",ref:"پڕکرنا باڵانسی 💳",his:"تۆمارێن من 🕒",selP:"پلاتفۆرمی هەلبژێرە:",selT:"جۆرێ خزمەتگوزاریێ:",srch:"🔍 ل ناڤ یان ژمارا خزمەتگوزاریێ بگەڕێ...",cat:"بەش (Category):",oTit:"داواکارییەکا نوو چێکە",oSub:"خزمەتگوزاریێ هەلبژێرە و لینکی بنڤیسە",svc:"خزمەتگوزاری:",lnk:"لینک (Link):",lnkPh:"لینکی ل ڤێرێ دانێ https://...",qty:"چەنداتی (Quantity):",st:"دەستپێکرن",stV:"ئێکسەر (0 - 15 خولەک)",wr:"گەرەنتی",yes:"هەیە",noW:"بێ گەرەنتی",mm:"کێمترین / زۆرترین",tot:"کۆمێ گشتی",sub:"پشتڕاستکرنا داواکاریێ ⚡",rTit:"پڕکرنا باڵانسێ هەژمارێ 💳",rSub:"ژمارا QiCard یان ناونیشانێ USDT کۆپی بکە و پارەی فرێکە",cpy:"📋 کۆپی",pay:"ڕێکا پارەدانێ:",rAmt:"بڕێ پڕکرنێ ($):",note:"ژمارا پرۆسێ / ناڤێ هنێرەری:",notePh:"ژمارا حەواڵێ یان ناڤێ خۆ بنڤیسە...",rBtn:"هنارتنا داواکارییا پڕکرنێ 🚀",hEmp:"تۆمارا داواکارییان یا ڤالایە",hSub:"داواکاریێن تە ل ڤێرێ دێ دیار بن",tAll:"هەمی",tFol:"فۆڵۆوەرز",tLik:"لایک",tViw:"بینین",tCom:"کۆمێنت",pIg:"ئینستاگرام",pTt:"تیک تۆک",pTg:"تێلیگرام",pYt:"یوتیوب",pFb:"فەیسبووک",pSc:"سناب چات",pTw:"تویتەر / X",pWa:"واتساب",pAl:"هەمی / گشتی",okPend:"⏳ ل هیڤییا ڕەزامەندیێ یە",okOrd:"✅ داواکاری هاتە هنارتن #",errFail:"داواکاری سەرنەکەفت",errConn:"خەلەتی د پەیوەندیێ دا",okRef:"✅ داواکاری هاتە هنارتن!",errRef:"❌ خەلەتی روویدا",stProg:"د قۆناغا جێبەجێکرنێ دایە",stPend:"ل هیڤییا ڕەزامەندیێ یە",stDone:"ب دووماهیک هات"},
  ku_s:{lang:"کوردی (سۆرانی)",dir:"rtl",bal:"باڵانسەکەت",ord:"داواکاری نوێ ⚡",ref:"پڕکردنەوەی باڵانس 💳",his:"تۆمارەکانم 🕒",selP:"پلاتفۆرم هەڵبژێرە:",selT:"جۆری خزمەتگوزاری:",srch:"🔍 گەڕان بە ناو یان ژمارەی خزمەتگوزاری...",cat:"بەش (Category):",oTit:"دروستکردنی داواکاری نوێ",oSub:"خزمەتگوزاری هەڵبژێرە و لینکەکەت بنووسە",svc:"خزمەتگوزاری:",lnk:"لینک (Link):",lnkPh:"لینکەکە لێرە دابنێ https://...",qty:"بڕ (Quantity):",st:"دەستپێکردن",stV:"دەستبەجێ (0 - 15 خولەک)",wr:"گەرەنتی",yes:"هەیە",noW:"بێ گەرەنتی",mm:"کەمترین / زۆرترین",tot:"کۆی گشتی",sub:"تەواوکردنی داواکاری ⚡",rTit:"پڕکردنەوەی باڵانسی هەژمار 💳",rSub:"ژمارەی QiCard یان ناونیشانی USDT کۆپی بکە و پارەکە بنێرە",cpy:"📋 کۆپی",pay:"شێوازی پارەدان:",rAmt:"بڕی پڕکردنەوە ($):",note:"ژمارەی مامەڵە / ناوی نێرەر:",notePh:"ژمارەی حەواڵە یان ناوی نێرەر بنووسە...",rBtn:"ناردنی داواکاری پڕکردنەوە 🚀",hEmp:"تۆماری داواکارییەکان بەتاڵە",hSub:"داواکارییەکانت لێرە دەردەکەون",tAll:"هەموو",tFol:"فۆڵۆوەرز",tLik:"لایک",tViw:"بینین",tCom:"کۆمێنت",pIg:"ئینستاگرام",pTt:"تیک تۆک",pTg:"تێلیگرام",pYt:"یوتیوب",pFb:"فەیسبووک",pSc:"سناب چات",pTw:"تویتەر / X",pWa:"واتساب",pAl:"هەموو / گشتی",okPend:"⏳ چاوەڕێی پەسەندکردنە",okOrd:"✅ داواکاری نێردرا #",errFail:"داواکاری سەرکەوتوو نەبوو",errConn:"هەڵە لە پەیوەندیکردن",okRef:"✅ داواکاری نێردرا!",errRef:"❌ هەڵە ڕوویدا",stProg:"لە جێبەجێکردندایە",stPend:"چاوەڕێی پەسەندکردنە",stDone:"تەواوبوو"}
};

const RAW=`الارخص مبيعا اليوم|Cheapest Best Sellers Today|الأرخص مبيعاً اليوم|ئەرزانترین فرۆتنا ئەڤرۆ|هەرزانترین فرۆشی ئەمڕۆ
الاكثر مبيعا|Best Sellers|الأكثر مبيعاً|زۆرترین فرۆتن|زۆرترین فرۆش
تعويض تلقائي|Auto Refill|تعويض تلقائي|قەرەبووکرنا خودکار|قەرەبووکردنەوەی خۆکار
زر التعويض|Refill Button|زر التعويض|دوگمەیا قەرەبووکرنێ|دوگمەی قەرەبووکردنەوە
ضمان مدي الحياه|Lifetime Guarantee|ضمان مدى الحياة|گەرەنتی هەتاهەتایی|گەرەنتی هەمیشەیی
بدون ضمان|لا يوجد ضمان|بدون تعويض|no refill|No Refill|بدون ضمان|بێ گەرەنتی|بێ گەرەنتی
بدون نقص|عدم النقص|non-drop|non drop|Non-Drop|بدون نقص|بێ کێمبوون|بێ کەمبوون
نقص قليل|نقص منخفض|Low Drop|نقص قليل|کێمبوونا کێم|کەمبوونی کەم
بدء فوري|بداية|بدايه فوريه|instant start|Instant Start|بدء فوري|دەستپێکرنا ئێکسەر|دەستپێکردنی دەستبەجێ
سريع جدا|super fast|Super Fast|سريع جداً|گەلەک بلەز|زۆر خێرا
جودة عالية|جوده عاليه|عالية الجودة|عاليه الجوده|high quality|hq|High Quality|جودة عالية|کوالێتی بلند|کوالێتی بەرز
جودة متوسطة|جوده متوسطه|Medium Quality|جودة متوسطة|کوالێتی ناڤنجی|کوالێتی مامناوەند
مشاهدات ستوري|مشاهدات الستوري|story views|story view|Story Views|مشاهدات ستوري|بینینا ستۆری|بینینی ستۆری
مشاهدات ريلز|مشاهدات الريلز|reels views|reel views|Reels Views|مشاهدات ريلز|بینینا ڕیلز|بینینی ڕیڵز
مشاهدات فيديو|video views|Video Views|مشاهدات فيديو|بینینا ڤیدیۆیێ|بینینی ڤیدیۆ
بث مباشر|live stream|Live Stream|بث مباشر|لایڤ|پەخشی ڕاستەوخۆ
ساعات مشاهدة|ساعات مشاهده|watch time|Watch Hours|ساعات مشاهدة|دەمژمێرێن بینینێ|کاتژمێری بینین
لايكات صفحة|لايكات صفحه|page likes|Page Likes|لايكات صفحة|لایکێن پەیجی|لایکی پەیج
اعضاء قناة|اعضاء قناه|channel members|Channel Members|أعضاء قناة|ئەندامێن کەنالی|ئەندامانی کەناڵ
اعضاء مجموعة|اعضاء مجموعه|اعضاء جروب|group members|Group Members|أعضاء مجموعة|ئەندامێن گرووپی|ئەندامانی گرووپ
تعليقات مخصصة|تعليقات مخصصه|custom comments|Custom Comments|تعليقات مخصصة|کۆمێنتێن تایبەت|کۆمێنتی تایبەت
تعليقات عشوائية|تعليقات عشوائيه|random comments|Random Comments|تعليقات عشوائية|کۆمێنتێن هەڕەمەکی|کۆمێنتی هەڕەمەکی
حسابات حقيقية|حسابات حقيقيه|real accounts|Real Accounts|حسابات حقيقية|هەژمارێن ڕاستەقینە|هەژماری ڕاستەقینە
حسابات قديمة|حسابات قديمه|old accounts|Old Accounts|حسابات قديمة|هەژمارێن کەڤن|هەژماری کۆن
زيارات الملف الشخصي|profile visits|Profile Visits|زيارات بروفايل|سەرەدانێن پڕۆفایلی|سەردانی پڕۆفایل
يعمل بعد التحديث|Working After Update|يعمل بعد التحديث|پشتی نووکرنێ کار دکەت|دوای نوێکردنەوە کار دەکات
عروض خاصة|عروض خاصه|Special Offers|عروض خاصة|ئۆفەرێن تایبەت|ئۆفەری تایبەت
الحد الاقصي|Max|الحد الأقصى|زۆرترین|زۆرترین
الحد الادني|Min|الحد الأدنى|کێمترین|کەمترین
باليوم|في اليوم|يوميا|/Day|يومياً|د ڕۆژێ دا|لە ڕۆژێکدا
انستقرام|انستغرام|instagram|Instagram|إنستغرام|ئینستاگرام|ئینستاگرام
تيك توك|تيكتوك|tiktok|TikTok|تيك توك|تیک تۆک|تیک تۆک
تيليجرام|تليجرام|تلجرام|telegram|Telegram|تيليجرام|تێلیگرام|تێلیگرام
يوتيوب|youtube|YouTube|يوتيوب|یوتیوب|یوتیوب
فيسبوك|فيس بوك|facebook|Facebook|فيسبوك|فەیسبووک|فەیسبووک
سناب شات|سنابشات|snapchat|Snapchat|سناب شات|سناب چات|سناب چات
تويتر|twitter|Twitter|تويتر|تویتەر|تویتەر
واتساب|واتس اب|whatsapp|WhatsApp|واتساب|واتساب|واتساب
ثريدز|threads|Threads|ثريدز|سرێدز|سرێدز
متابعين|متابع|followers|follower|Followers|متابعين|فۆڵۆوەرز|فۆڵۆوەرز
مشتركين|مشترك|subscribers|subscriber|Subscribers|مشتركين|سەبسکرایب|سەبسکرایب
اعضاء|عضو|members|member|Members|أعضاء|ئەندام|ئەندام
لايكات|اعجابات|لايك|likes|like|Likes|لايكات|لایک|لایک
مشاهدات|مشاهدة|مشاهده|views|view|Views|مشاهدات|بینین|بینین
تعليقات|تعليق|كومنتات|comments|comment|Comments|تعليقات|کۆمێنت|کۆمێنت
مشاركات|مشاركة|مشاركه|shares|share|Shares|مشاركات|بەلاڤکرن|بڵاوکردنەوە
حفظ|saves|save|Saves|حفظ|پاشەکەوتکرن|پاشەکەوتکردن
تفاعلات|تفاعل|رياكشن|reactions|reaction|Reactions|تفاعلات|کارڤەدان|کاردانەوە
اكسبلور|explore|Explore|اكسبلور|ئێکسپلۆر|ئێکسپلۆر
ريتويت|retweets|retweet|Retweets|ريتويت|ڕیتویت|ڕیتویت
زيارات|زيارة|زياره|visits|visit|Visits|زيارات|سەرەدان|سەردان
مع ضمان|بضمان|ضمان|تعويض|guaranteed|guarantee|refill|Refill|ضمان|گەرەنتی|گەرەنتی
ثابت|ثابتة|ثابته|مستقر|stable|Stable|ثابت|جێگیر|جێگیر
فوري|فورية|فوريه|instant|Instant|فوري|ئێکسەر|دەستبەجێ
سريع|سريعة|سريعه|fast|Fast|سريع|بلەز|خێرا
بطيء|بطيئة|بطيئه|slow|Slow|بطيء|هێدی|هێواش
متوسط|متوسطة|متوسطه|medium|Medium|متوسط|ناڤنجی|مامناوەند
السرعة|السرعه|سرعة|سرعه|speed|Speed|السرعة|لەزاتی|خێرایی
حقيقيين|حقيقي|حقيقية|حقيقيه|real|Real|حقيقي|ڕاستەقینە|ڕاستەقینە
نشطين|نشط|متفاعلين|active|Active|نشط|چالاک|چالاک
وهميين|وهمي|بوتات|بوت|bots|bot|Bot|بوتات|بۆت|بۆت
مكس|مختلط|mixed|Mixed|مكس|تێکەل|تێکەڵ
عالميين|عالمي|اجانب|worldwide|global|Worldwide|عالمي|جیهانی|جیهانی
عرب|عربي|عربية|عربيه|arab|Arab|عربي|عەرەبی|عەرەبی
خليجيين|خليجي|gulf|Gulf|خليجي|کەنداوی|کەنداوی
العراق|عراقيين|عراقي|iraq|Iraq|العراق|عیراق|عێراق
السعودية|السعوديه|سعودي|saudi|Saudi|السعودية|سعودی|سعودی
مصر|مصري|egypt|Egypt|مصر|مسری|میسری
تركيا|تركي|turkey|Turkey|تركيا|تورکی|تورکی
امريكي|usa|USA|أمريكي|ئەمریکی|ئەمریکی
روسي|روسيا|russia|Russia|روسيا|رووسی|ڕووسی
بنات|نساء|female|Female|بنات|کچ|کچ
شباب|ذكور|male|Male|شباب|کوڕ|کوڕ
موثق|توثيق|verified|Verified|موثق|پشتڕاستکری|پشتڕاستکراو
الارخص|ارخص|رخيص|cheapest|Cheapest|الأرخص|ئەرزانترین|هەرزانترین
الافضل|افضل|ممتاز|best|Best|الأفضل|باشترین|باشترین
الاسرع|اسرع|fastest|Fastest|الأسرع|بلەزترین|خێراترین
جديد|جديدة|جديده|new|New|جديد|نوو|نوێ
حصري|حصرية|حصريه|exclusive|Exclusive|حصري|تایبەت|تایبەت
مميز|featured|Featured|مميز|تایبەت|تایبەت
سيرفرات|سيرفر|servers|server|Server|سيرفر|سێرڤەر|سێرڤەر
خدمات|خدمة|خدمه|services|service|Services|خدمات|خزمەتگوزاری|خزمەتگوزاری
اليوم|today|Today|اليوم|ئەڤرۆ|ئەمڕۆ
ايام|يوم|days|day|Days|يوم|ڕۆژ|ڕۆژ
ساعات|ساعة|ساعه|hours|hour|Hours|ساعة|دەمژمێر|کاتژمێر
دقائق|دقيقة|دقيقه|minutes|minute|Minutes|دقيقة|خولەک|خولەک
شغال|يعمل|working|Working|شغال|کار دکەت|کار دەکات
تحديث|updated|update|Updated|تحديث|نووکری|نوێکراوە
فقط|only|Only|فقط|بتنێ|تەنها`;

const RULES=RAW.trim().split('\n').map(l=>{const p=l.split('|'),a=p.slice(0,-4).map(x=>/^[a-z0-9 -]+$/i.test(x)?'\\b'+x+'\\b':x);return[new RegExp(a.join('|'),'gi'),p[p.length-4],p[p.length-3],p[p.length-2],p[p.length-1]];});
function tr(s){if(!s)return s;const idx=lang==='en'?1:(lang==='ar'?2:(lang==='ku_b'?3:4));let o=String(s).replace(/[\u064B-\u065F]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي');for(let i=0;i<RULES.length;i++)o=o.replace(RULES[i][0],RULES[i][idx]);return o;}

function setLang(l){
  lang=T[l]?l:'ar';try{localStorage.setItem('m7_lang',lang);}catch(e){}
  document.getElementById('langMenu').classList.remove('show');
  const t=T[lang];
  document.getElementById('htmlRoot').dir=t.dir;
  document.getElementById('currentLangTitle').innerText=t.lang;
  document.getElementById('txtBalance').innerText=t.bal;
  document.getElementById('btnNewOrder').innerText=t.ord;
  document.getElementById('btnRefill').innerText=t.ref;
  document.getElementById('btnHistory').innerText=t.his;
  document.getElementById('txtSelectPlatform').innerText=t.selP;
  document.getElementById('txtSelectType').innerText=t.selT;
  document.getElementById('serviceSearch').placeholder=t.srch;
  document.getElementById('txtCategoryLabel').innerText=t.cat;
  document.getElementById('txtNewOrderTitle').innerText=t.oTit;
  document.getElementById('txtNewOrderSub').innerText=t.oSub;
  document.getElementById('txtServiceLabel').innerText=t.svc;
  document.getElementById('txtLinkLabel').innerText=t.lnk;
  document.getElementById('orderLink').placeholder=t.lnkPh;
  document.getElementById('txtQtyLabel').innerText=t.qty;
  document.getElementById('txtStart').innerText=t.st;
  document.getElementById('infoStart').innerText=t.stV;
  document.getElementById('txtWarranty').innerText=t.wr;
  document.getElementById('txtMinMax').innerText=t.mm;
  document.getElementById('submitBtnText').innerText=t.sub;
  document.getElementById('txtRefillTitle').innerText=t.rTit;
  document.getElementById('txtRefillSub').innerText=t.rSub;
  document.getElementById('txtPayMethodLabel').innerText=t.pay;
  document.getElementById('txtRefillLabel').innerText=t.rAmt;
  document.getElementById('txtRefillNoteLabel').innerText=t.note;
  document.getElementById('refillNote').placeholder=t.notePh;
  document.getElementById('txtRefillBtn').innerText=t.rBtn;
  document.querySelectorAll('.copy-btn').forEach(b=>b.innerText=t.cpy);
  const he=document.getElementById('txtHistEmpty'),hs=document.getElementById('txtHistSub');
  if(he)he.innerText=t.hEmp;if(hs)hs.innerText=t.hSub;
  document.getElementById('pInsta').innerText=t.pIg;document.getElementById('pTiktok').innerText=t.pTt;
  document.getElementById('pTelegram').innerText=t.pTg;document.getElementById('pYoutube').innerText=t.pYt;
  document.getElementById('pFacebook').innerText=t.pFb;document.getElementById('pSnapchat').innerText=t.pSc;
  document.getElementById('pTwitter').innerText=t.pTw;document.getElementById('pWhatsapp').innerText=t.pWa;
  document.getElementById('pAll').innerText=t.pAl;
  renderPills();if(allServices.length)renderCats();else updateInfo();
}

function renderPills(){
  const t=T[lang],box=document.getElementById('typesContainer');box.innerHTML='';
  [{id:'all',n:t.tAll},{id:'follower',n:t.tFol},{id:'like',n:t.tLik},{id:'view',n:t.tViw},{id:'comment',n:t.tCom}].forEach(x=>{
    const d=document.createElement('div');d.className='type-pill'+(curType===x.id?' selected':'');d.textContent=x.n;
    d.onclick=()=>{curType=x.id;renderPills();renderCats();};box.appendChild(d);
  });
}

function switchTab(t){
  ['btnNewOrder','btnRefill','btnHistory'].forEach(i=>document.getElementById(i).classList.remove('active'));
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
  if(f.includes('insta')||f.includes('انست')||f.includes('إنست'))return'Instagram';
  if(f.includes('tiktok')||f.includes('تيك'))return'TikTok';
  if(f.includes('telegram')||f.includes('تيلي')||f.includes('تليجرام')||f.includes('تلجرام'))return'Telegram';
  if(f.includes('youtube')||f.includes('يوتيوب'))return'YouTube';
  if(f.includes('facebook')||f.includes('فيس'))return'Facebook';
  if(f.includes('snap')||f.includes('سناب'))return'Snapchat';
  if(f.includes('twitter')||f.includes('تويتر')||/\bx\b/.test(f))return'Twitter';
  if(f.includes('whatsapp')||f.includes('واتس'))return'WhatsApp';
  return'All';
}

function detType(c,n){
  const f=(c+' '+n).toLowerCase();
  if(f.includes('follower')||f.includes('متابع')||f.includes('مشترك')||f.includes('member')||f.includes('أعضاء')||f.includes('اعضاء'))return'follower';
  if(f.includes('like')||f.includes('لايك')||f.includes('اعجاب')||f.includes('إعجاب')||f.includes('تفاعل'))return'like';
  if(f.includes('view')||f.includes('مشاهد')||f.includes('story')||f.includes('ستوري')||f.includes('reel')||f.includes('ريلز'))return'view';
  if(f.includes('comment')||f.includes('تعليق')||f.includes('كومنت'))return'comment';
  return'other';
}

function setOpt(el,txt){el.innerHTML='';const o=document.createElement('option');o.value='';o.textContent=txt;el.appendChild(o);}

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
  if(!list.length)setOpt(sEl,'---');else{list.forEach(s=>{const o=document.createElement('option');o.value=s.service||s.id;o.textContent='#'+(s.service||s.id)+' - '+tr(s.cleanName)+' ($'+parseFloat(s.rate||0).toFixed(3)+')';sEl.appendChild(o);});if(list.some(s=>String(s.service||s.id)===String(prev)))sEl.value=prev;}
  updateInfo();
}

function updateInfo(){
  const id=document.getElementById('serviceSelect').value,t=T[lang];
  curSvc=allServices.find(s=>String(s.service||s.id)===String(id));
  if(curSvc){
    document.getElementById('infoMinMax').innerText=(curSvc.min||50)+' - '+(curSvc.max||200000);
    document.getElementById('orderQuantity').value=curSvc.min||100;
    const low=(curSvc.cleanName+' '+curSvc.cleanCat).toLowerCase(),noW=curSvc.refill===false||low.includes('no refill')||low.includes('بدون ضمان')||low.includes('بدون تعويض')||low.includes('لا يوجد ضمان');
    const wEl=document.getElementById('txtYes');wEl.innerText=noW?t.noW:t.yes;wEl.style.color=noW?'#ef4444':'var(--ok)';
  }
  calcTotal();
}

function calcTotal(){
  const w=T[lang].tot;if(!curSvc){document.getElementById('orderCost').innerText=w+': $0.00';return;}
  const q=Math.max(0,parseFloat(document.getElementById('orderQuantity').value)||0);
  document.getElementById('orderCost').innerText=w+': $'+((q/1000)*parseFloat(curSvc.rate||0)).toFixed(4);
}

async function syncUser(){
  if(!telegramId)return;
  try{
    const r=await fetch('/api/user',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telegramId,username,firstName})});
    const d=await r.json();
    if(d&&d.success){userBal=parseFloat(d.balance)||0;document.getElementById('userBalance').innerText=fmtBal(userBal);if(d.settings){if(d.settings.qicard)document.getElementById('displayQicard').innerText=d.settings.qicard;if(d.settings.usdt)document.getElementById('displayUsdt').innerText=d.settings.usdt;}}
  }catch(e){}
}

async function submitOrder(){
  const link=document.getElementById('orderLink').value.trim(),quantity=parseInt(document.getElementById('orderQuantity').value,10),msg=document.getElementById('msg'),t=T[lang];
  if(!link||!curSvc){msg.style.color='#ef4444';msg.innerText=t.errFill;return;}
  msg.style.color='#38bdf8';msg.innerText='...';
  try{
    const r=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telegramId,username,serviceId:curSvc.service||curSvc.id,link,quantity})});
    const d=await r.json();
    if(d&&d.success){if(d.newBalance!==undefined){userBal=parseFloat(d.newBalance);document.getElementById('userBalance').innerText=fmtBal(userBal);}msg.style.color='#10b981';msg.innerText=d.pending?t.okPend:(t.okOrd+(d.orderId||'')+' 🎉');document.getElementById('orderLink').value='';}
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
