let allServices=[],curPlat='Instagram',curType='all',curSvc=null,userBal=0,creds={username:'',password:''};
let lang='ar';
try{
  lang=localStorage.getItem('m7_lang')||'ar';
  ['m7_trc','m7_trc_v2','m7_trc_v3'].forEach(k=>localStorage.removeItem(k));
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

let TR_CACHE={en:{},ar:{},ku_b:{},ku_s:{}};
try{const saved=JSON.parse(localStorage.getItem('m7_tr_v4')||'{}');if(saved&&saved.en)TR_CACHE=Object.assign(TR_CACHE,saved);}catch(e){}
function saveTrCache(){try{localStorage.setItem('m7_tr_v4',JSON.stringify(TR_CACHE));}catch(e){}}

const SMM_EXACT={
  "الارخص مبيعا اليوم":["Cheapest Best Sellers Today","الأرخص مبيعاً اليوم","ئەرزانترین فرۆتنا ئەڤرۆ","هەرزانترین فرۆشی ئەمڕۆ"],
  "ارخص مبيعا اليوم":["Cheapest Best Sellers Today","الأرخص مبيعاً اليوم","ئەرزانترین فرۆتنا ئەڤرۆ","هەرزانترین فرۆشی ئەمڕۆ"],
  "الارخص مبيعا يوم":["Cheapest Best Sellers Today","الأرخص مبيعاً اليوم","ئەرزانترین فرۆتنا ئەڤرۆ","هەرزانترین فرۆشی ئەمڕۆ"],
  "الاكثر مبيعا":["Best Sellers","الأكثر مبيعاً","زۆرترین فرۆتن","زۆرترین فرۆش"],
  "اكثر مبيعا":["Best Sellers","الأكثر مبيعاً","زۆرترین فرۆتن","زۆرترین فرۆش"],
  "خدمات مجانية":["Free Services","خدمات مجانية","خزمەتگوزاری بێ بەرامبەر","خزمەتگوزاری بەخۆڕایی"],
  "خدمات مسوقين":["Marketers Services","خدمات المسوقين","خزمەتگوزاری بازاڕکەران","خزمەتگوزاری بەبازاڕکەران"],
  "خدمات المسوقين":["Marketers Services","خدمات المسوقين","خزمەتگوزاری بازاڕکەران","خزمەتگوزاری بەبازاڕکەران"],
  "خدمات المسوقيين":["Marketers Services","خدمات المسوقين","خزمەتگوزاری بازاڕکەران","خزمەتگوزاری بەبازاڕکەران"],
  "خدمات موزعين":["Resellers Services","خدمات الموزعين","خزمەتگوزاری بەلاڤکەران","خزمەتگوزاری دابەشکاران"],
  "خدمات الموزعين":["Resellers Services","خدمات الموزعين","خزمەتگوزاری بەلاڤکەران","خزمەتگوزاری دابەشکاران"],
  "بكجات منوعة":["Mixed Packages","باقات متنوعة","پاکێجێن جۆراوجۆر","پاکێجی جۆراوجۆر"],
  "باقات متنوعة":["Mixed Packages","باقات متنوعة","پاکێجێن جۆراوجۆر","پاکێجی جۆراوجۆر"],
  "الدعم الممول":["Sponsored Boost","الدعم الممول","پشتەڤانییا سپۆنسەرکری","پشتگیری سپۆنسەرکراو"],
  "دعم ممول":["Sponsored Boost","الدعم الممول","پشتەڤانییا سپۆنسەرکری","پشتگیری سپۆنسەرکراو"],
  "عروض خاصة":["Special Offers","عروض خاصة","ئۆفەرێن تایبەت","ئۆفەرە تایبەتەکان"],
  "عروض":["Offers","عروض","ئۆفەر","ئۆفەر"],
  "زوار للمواقع":["Website Visitors","زوار للمواقع","سەرەدانکەرێن مالپەڕان","سەردانکەرانی ماڵپەڕەکان"],
  "بدون ضمان":["No Refill","بدون ضمان","بێ گەرەنتی","بێ گەرەنتی"],
  "بدون تعويض":["No Refill","بدون تعويض","بێ گەرەنتی","بێ گەرەنتی"],
  "تعويض تلقائي":["Auto Refill","تعويض تلقائي","قەرەبووکرنا خودکار","قەرەبووکردنەوەی خۆکار"],
  "اعادة تعبئة":["Refill","إعادة تعبئة","قەرەبووکرن","قەرەبووکردنەوە"],
  "بدون نقص":["Non-Drop","بدون نقص","بێ کێمبوون","بێ کەمبوون"],
  "بدون نزول":["Non-Drop","بدون نزول","بێ کێمبوون","بێ کەمبوون"],
  "بي نزول":["Non-Drop","بدون نزول","بێ کێمبوون","بێ کەمبوون"],
  "امكانية الالغاء":["Cancellable","إمكانية الإلغاء","شیانا هەڵوەشاندنێ","توانای هەڵوەشاندنەوە"],
  "بدء فوري":["Instant Start","بدء فوري","دەستپێکرنا ئێکسەر","دەستپێکردنی دەستبەجێ"],
  "سريع جدا":["Super Fast","سريع جداً","گەلەک بلەز","زۆر خێرا"],
  "جديد":["New","جديد","نوو","نوێ"],
  "حقيقي":["Real","حقيقي","ڕاستەقینە","ڕاستەقینە"],
  "حقيقية":["Real","حقيقية","ڕاستەقینە","ڕاستەقینە"],
  "نشط":["Active","نشط","چالاک","چالاک"],
  "انستقرام":["Instagram","إنستغرام","ئینستاگرام","ئینستاگرام"],
  "إنستغرام":["Instagram","إنستغرام","ئینستاگرام","ئینستاگرام"],
  "تيك توك":["TikTok","تيك توك","تیک تۆک","تیک تۆک"],
  "تيليجرام":["Telegram","تيليجرام","تێلیگرام","تێلیگرام"],
  "يوتيوب":["YouTube","يوتيوب","یوتیوب","یوتیوب"],
  "فيسبوك":["Facebook","فيسبوك","فەیسبووک","فەیسبووک"],
  "سناب شات":["Snapchat","سناب شات","سناب چات","سناب چات"],
  "تويتر":["Twitter / X","تويتر","تویتەر","تویتەر"],
  "واتساب":["WhatsApp","واتساب","واتساب","واتساب"],
  "ثريدز":["Threads","ثريدز","سرێدز","سرێدز"],
  "متابعين":["Followers","متابعين","فۆڵۆوەرز","فۆڵۆوەرز"],
  "فولورز":["Followers","متابعين","فۆڵۆوەرز","فۆڵۆوەرز"],
  "لايكات":["Likes","لايكات","لایک","لایک"],
  "مشاهدات":["Views","مشاهدات","بینین","بینین"],
  "تعليقات":["Comments","تعليقات","کۆمێنت","کۆمێنت"],
  "مشاركات":["Shares","مشاركات","بەلاڤکرن","بڵاوکردنەوە"],
  "اعادة نشر":["Repost","إعادة نشر","دووبارە بەلاڤکرن","دووبارە بڵاوکردنەوە"],
  "حفظ":["Saves","حفظ","پاشەکەوتکرن","پاشەکەوتکردن"],
  "تفاعلات":["Reactions","تفاعلات","کارڤەدان","کاردانەوە"],
  "انطباعات":["Impressions","انطباعات","دەرکەفتن","دەرکەوتن"],
  "وصول":["Reach","وصول","گەهشتن","گەیشتن"],
  "اشتراكات":["Subscriptions","اشتراكات","بەشداربوون","بەشداریکردن"],
  "تصويتات":["Polls","تصويتات","دەنگدان","دەنگدان"],
  "لايف":["Live","بث مباشر","لایڤ","پەخش"],
  "بث مباشر":["Live Stream","بث مباشر","لایڤ","پەخشی ڕاستەوخۆ"],
  "ستوري":["Stories","ستوري","ستۆری","ستۆری"],
  "ريلز":["Reels","ريلز","ڕیلز","ڕیڵز"],
  "اكسبلور":["Explore","إكسبلور","ئێکسپلۆر","ئێکسپلۆر"],
  "عراقي":["Iraqi","عراقي","عیراقی","عێراقی"],
  "عراق":["Iraq","العراق","عیراق","عێراق"],
  "عيراق":["Iraq","العراق","عیراق","عێراق"],
  "عربي":["Arab","عربي","عەرەبی","عەرەبی"],
  "عربية":["Arab","عربية","عەرەبی","عەرەبی"],
  "عالمي":["Worldwide","عالمي","جیهانی","جیهانی"],
  "سعودي":["Saudi","سعودي","سعودی","سعودی"],
  "تركي":["Turkish","تركي","تورکی","تورکی"],
  "امريكي":["USA","أمريكي","ئەمریکی","ئەمریکی"],
  "كوريا":["Korea","كوريا","کۆریا","کۆریا"]
};

function normKey(s){
  return s.replace(/[\u064B-\u065F\u0670\u0640]/g,'')
    .replace(/[أإآٱ]/g,'ا').replace(/[ىيیېئ]/g,'ي').replace(/[ةهۀ]/g,'ة').replace(/[كک]/g,'ك').replace(/[ووؤۆ]/g,'و').replace(/[ررڕ]/g,'ر').replace(/[للڵ]/g,'ل')
    .replace(/\s+/g,' ').trim().toLowerCase();
}

const EXACT_LOOKUP={};
Object.keys(SMM_EXACT).forEach(k=>{EXACT_LOOKUP[normKey(k)]=SMM_EXACT[k];});

function cleanSorani(s){
  return s.replace(/خزم[هە]\s+تگوزاری/g,'خزمەتگوزاری')
    .replace(/هه\s+رزانترین/g,'هەرزانترین')
    .replace(/قەره\s+بووکردنه\s+وه/g,'قەرەبووکردنەوە')
    .replace(/\u06D5\s+(?=[\u0621-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06C6\u06CE\u06D5])/g,'\u06D5')
    .replace(/^هه\s+/g,'هە');
}

function toBadini(s){
  let o=cleanSorani(s);
  const pairs=[
    [/ناتوانین/g,'نەشێین'],[/ناتوانیت/g,'نەشێی'],[/ناتوانێت/g,'نەشێت'],
    [/دەتوانین/g,'دشێین'],[/دەتوانیت/g,'دشێی'],[/دەتوانێت/g,'دشێت'],
    [/داواکارییەکەت/g,'داواکارییا تە'],[/داواکارییەکان/g,'داواکارییان'],[/داواکارییەکە/g,'داواکارییێ'],
    [/هەژمارەکەت/g,'هەژمارا تە'],[/لینکەکەت/g,'لینکێ تە'],[/پەڕەکەت/g,'پەیجێ تە'],
    [/پێداچوونەوەی/g,'پێداچوونا'],[/پێداچوونەوە/g,'پێداچوون'],
    [/هەڵوەشاندنەوەی/g,'هەڵوەشاندنا'],[/هەڵوەشاندنەوە/g,'هەڵوەشاندن'],
    [/چاک بکەینەوە/g,'چاک بکەین'],[/چاکبکەینەوە/g,'چاک بکەین'],
    [/بکوژێنەوە/g,'بگرە'],[/بیکوژێنەوە/g,'بگرە'],
    [/فۆڵۆوەرەکان/g,'فۆڵۆوەران'],[/لایکەکان/g,'لایکان'],[/بینەرەکان/g,'بینەران'],[/کۆمێنتەکان/g,'کۆمێنتان'],
    [/بەکارهێنەران/g,'بکارهێنەران'],[/بەکارهێنەر/g,'بکارهێنەر'],
    [/دەکات/g,'دکەت'],[/دەکەن/g,'دکەن'],[/دەبێت/g,'دبیت'],[/نابێت/g,'نابیت'],
    [/کردنەوەی/g,'کرنا'],[/کردنی/g,'کرنا'],[/کردن/g,'کرن'],
    [/هەموو/g,'هەمی'],[/کەمترین/g,'کێمترین'],[/بەخۆڕایی/g,'بێ بەرامبەر'],
    [/لەسەر/g,'ل سەر'],[/لەگەڵ/g,'دگەل'],[/لەناو/g,'د ناڤ'],[/لە ڕێگەی/g,'ب ڕێکا'],[/لەڕێگەی/g,'ب ڕێکا'],[/بەبێ/g,'بێ'],
    [/تکایە/g,'هیڤیدارین'],[/پێش/g,'بەری'],[/دوای/g,'پشتی'],[/ئێستا/g,'نوکە'],[/ئەمڕۆ/g,'ئەڤرۆ'],
    [/چالاک بوو/g,'چالاک بیت'],[/چالاک کراوە/g,'چالاک کرییە'],[/ئەوا /g,''],
    [/بۆ /g,'بۆ '],[/لە /g,'ژ ']
  ];
  for(let i=0;i<pairs.length;i++)o=o.replace(pairs[i][0],pairs[i][1]);
  return o.replace(/\s+/g,' ').trim();
}

function cleanRaw(s){
  return String(s||'')
    .replace(/[\u064B-\u065F\u0670\u0640\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g,'')
    .replace(/(\d+)\s*ك(?=\s|$|\||\]|\)|\/)/g,'$1K')
    .replace(/\s+/g,' ').trim();
}

function needsRemoteTr(seg,targetLang){
  if(!seg||!/[a-zA-Z\u0600-\u06FF]/.test(seg))return false;
  if(/^[\d\s.,:$%+\-*/\\|()[\]KMBkmb]+$/.test(seg))return false;
  if(targetLang==='en')return/[\u0600-\u06FF]/.test(seg);
  if(targetLang==='ar')return/[a-zA-Z]{2,}|[\u067E\u0686\u0698\u06A9\u06AF\u06C6\u06CE\u06D5]/.test(seg);
  if(targetLang==='ku_b'||targetLang==='ku_s'){
    if(/[a-zA-Z]{2,}/.test(seg))return true;
    if(/[ةثذظضصطغ]/.test(seg))return true;
    if(/(?:^|\s)(?:ال|لل|بدون|لا|في|من|الى|على|اذا|قبل|بعد|طفي|زر|مراجعة|اصلاح|نستطيع|امكانية|نزول|زوار|مواقع|خدمات|مسوقين|مبيعا|عروض|رفع|تحديث|يعمل|تعمل)(?=\s|$)/.test(seg))return true;
  }
  return false;
}

const PENDING_SET=new Set();
let trTimer=null,trInFlight=false;

function queueTr(seg){
  if(!seg||!needsRemoteTr(seg,lang))return;
  if(TR_CACHE[lang]&&TR_CACHE[lang][seg])return;
  PENDING_SET.add(seg);
  if(!trTimer&&!trInFlight)trTimer=setTimeout(flushTrQueue,60);
}

async function fetchGtxBatch(items,tl){
  const joined=items.map(x=>x.replace(/[\r\n]+/g,' ')).join('\n');
  const url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl='+tl+'&dt=t&q='+encodeURIComponent(joined);
  const r=await fetch(url);
  const d=await r.json();
  if(!Array.isArray(d)||!Array.isArray(d[0]))return null;
  const full=d[0].map(c=>c&&c[0]?c[0]:'').join('');
  const lines=full.split('\n');
  return lines.length===items.length?lines:null;
}

async function flushTrQueue(){
  trTimer=null;
  if(trInFlight||!PENDING_SET.size)return;
  trInFlight=true;
  const target=lang;
  const tl=target==='en'?'en':(target==='ar'?'ar':'ckb');
  const batch=[];let chars=0;
  for(const item of PENDING_SET){
    if(batch.length>=22||chars+item.length>1500)break;
    batch.push(item);chars+=item.length+1;
  }
  batch.forEach(x=>PENDING_SET.delete(x));
  try{
    let out=await fetchGtxBatch(batch,tl);
    if(!out){
      out=[];
      for(const it of batch){
        const one=await fetchGtxBatch([it],tl);
        out.push(one&&one[0]?one[0]:it);
      }
    }
    if(!TR_CACHE[target])TR_CACHE[target]={};
    batch.forEach((src,i)=>{
      let res=(out[i]||src).trim();
      if(target==='ku_b')res=toBadini(res);
      else if(target==='ku_s')res=cleanSorani(res);
      TR_CACHE[target][src]=res;
    });
    saveTrCache();
  }catch(e){}
  trInFlight=false;
  if(allServices.length){renderCatsOnly();renderSvcsOnly();}
  if(PENDING_SET.size)trTimer=setTimeout(flushTrQueue,80);
}

function trSeg(rawSeg){
  const seg=cleanRaw(rawSeg);
  if(!seg)return seg;
  const idx=lang==='en'?0:(lang==='ar'?1:(lang==='ku_b'?2:3));
  const m=seg.match(/^([^\w\u0600-\u06FF]*)(.*?)([^\w\u0600-\u06FF]*)$/);
  const pre=m?m[1]:'',core=m?m[2].trim():seg,post=m?m[3]:'';
  if(!core)return seg;
  const ex=EXACT_LOOKUP[normKey(core)];
  if(ex)return pre+ex[idx]+post;
  if(TR_CACHE[lang]&&TR_CACHE[lang][core])return pre+TR_CACHE[lang][core]+post;
  if(needsRemoteTr(core,lang)){
    queueTr(core);
    return pre+(lang==='ku_b'?toBadini(core):(lang==='ku_s'?cleanSorani(core):core))+post;
  }
  return pre+(lang==='ku_b'?toBadini(core):(lang==='ku_s'?cleanSorani(core):core))+post;
}

function tr(s){
  if(!s)return s;
  const cleaned=cleanRaw(s);
  const parts=cleaned.split(/(\s*\|\s*|\s+-\s+|\(|\))/);
  return parts.map(p=>{
    if(!p||/^\s*\|\s*$/.test(p)||/^\s+-\s+$/.test(p)||p==='('||p===')')return p;
    return trSeg(p);
  }).join('').replace(/\s+/g,' ').trim();
}

function setLang(l){
  lang=T[l]?l:'ar';try{localStorage.setItem('m7_lang',lang);}catch(e){}
  PENDING_SET.clear();
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

function renderCatsOnly(){
  const cEl=document.getElementById('categorySelect');if(!cEl)return;
  Array.from(cEl.options).forEach(o=>{if(o.value)o.textContent=tr(o.value);});
}

function renderSvcsOnly(){
  const sEl=document.getElementById('serviceSelect');if(!sEl)return;
  Array.from(sEl.options).forEach(o=>{
    if(!o.value)return;
    const s=allServices.find(x=>String(x.service||x.id)===String(o.value));
    if(s)o.textContent='#'+(s.service||s.id)+' - '+tr(s.cleanName)+' \u2066($'+parseFloat(s.rate||0).toFixed(3)+')\u2069';
  });
}

function renderCats(){
  const cEl=document.getElementById('categorySelect'),prev=cEl.value,cats=[...new Set(getFiltered().map(s=>s.cleanCat))];cEl.innerHTML='';
  if(!cats.length)setOpt(cEl,'---');else{cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=tr(c);cEl.appendChild(o);});if(cats.includes(prev))cEl.value=prev;}
  renderSvcs();
}

function renderSvcs(){
  const sEl=document.getElementById('serviceSelect'),prev=sEl.value,cat=document.getElementById('categorySelect').value,list=getFiltered().filter(s=>!cat||s.cleanCat===cat);sEl.innerHTML='';
  if(!list.length)setOpt(sEl,'---');else{list.forEach(s=>{const o=document.createElement('option');o.value=s.service||s.id;o.textContent='#'+(s.service||s.id)+' - '+tr(s.cleanName)+' \u2066($'+parseFloat(s.rate||0).toFixed(3)+')\u2069';sEl.appendChild(o);});if(list.some(s=>String(s.service||s.id)===String(prev)))sEl.value=prev;}
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
