// START
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
  ar:{lang:"العربية",dir:"rtl",bal:"رصيدك",ord:"طلب جديد ⚡",ref:"شحن رصيد 💳",his:"سجلاتي 🕒",selP:"اختر المنصة:",selT:"اختر نوع الخدمة:",srch:"🔍 ابحث باسم الخدمة أو الرقم...",cat:"القسم (Category):",oTit:"إنشاء طلب جديد",oSub:"اختر الخدمة واكتب الرابط الخاص بك",svc:"الخدمة (Service):",lnk:"الرابط (Link):",lnkPh:"ضع الرابط هنا https://...",qty:"الكمية (Quantity):",st:"البدء",stV:"فوري (0 - 15 د)",wr:"الضمان",yes:"متوفر",noW:"بدون ضمان",mm:"الحد الأدنى / الأقصى",tot:"الإجمالي",sub:"تأكيد الطلب ⚡",rTit:"شحن رصيد الحساب 💳",rSub:"انسخ رقم QiCard أو عنوان USDT وأرسل المبلغ",cpy:"📋 نسخ",pay:"طريقة الدفع:",rAmt:"مبلغ الشحن ($):",note:"رقم العملية / اسم المرسل:",notePh:"اكتب رقم الحوالة أو اسم المرسل...",rBtn:"إرسال طلب الشحن 🚀",hEmp:"سجل الطلبات فارغ",hSub:"الطلبات التي تقوم بتثبيتها ستظهر هنا",tAll:"الكل",tFol:"متابعين",tLik:"لايكات",tViw:"مشاهدات",tCom:"تعليقات",tShr:"مشاركات",pIg:"إنستغرام",pTt:"تيك توك",pTg:"تيليجرام",pYt:"يوتيوب",pFb:"فيسبوك",pSc:"سناب شات",pTw:"تويتر / X",pWa:"واتساب",pAl:"الكل / عام",load:"جاري تحميل الخدمات...",noCat:"لا توجد أقسام",noSvc:"لا توجد خدمات",errFill:"يرجى إدخال الرابط واختيار الخدمة!",errBal:"رصيدك غير كافٍ لإتمام الطلب!",errConn:"خطأ في الاتصال بالسيرفر!",errFail:"فشل تنفيذ الطلب!",okOrd:"✅ تم تنفيذ الطلب بنجاح #",okPend:"⏳ تم إرسال الطلب للإدارة للموافقة",okRef:"✅ تم إرسال طلب شحن الرصيد بنجاح!",errRef:"يرجى إدخال مبلغ صحيح!",stProg:"قيد التنفيذ",stPend:"بانتظار الموافقة",stDone:"مكتمل"},
  en:{lang:"English",dir:"ltr",bal:"Balance",ord:"New Order ⚡",ref:"Top Up 💳",his:"History 🕒",selP:"Select Platform:",selT:"Service Type:",srch:"🔍 Search service name or ID...",cat:"Category:",oTit:"Create New Order",oSub:"Select a service and enter your link",svc:"Service:",lnk:"Link:",lnkPh:"Paste link here https://...",qty:"Quantity:",st:"Start",stV:"Instant (0 - 15m)",wr:"Guarantee",yes:"Available",noW:"No Refill",mm:"Min / Max",tot:"Total",sub:"Submit Order ⚡",rTit:"Top Up Balance 💳",rSub:"Copy QiCard or USDT (TRC20) and send payment",cpy:"📋 Copy",pay:"Payment Method:",rAmt:"Amount ($):",note:"Transaction ID / Sender Name:",notePh:"Enter transaction ID or sender name...",rBtn:"Send Top-Up Request 🚀",hEmp:"Order history is empty",hSub:"Your submitted orders will appear here",tAll:"All",tFol:"Followers",tLik:"Likes",tViw:"Views",tCom:"Comments",tShr:"Shares",pIg:"Instagram",pTt:"TikTok",pTg:"Telegram",pYt:"YouTube",pFb:"Facebook",pSc:"Snapchat",pTw:"Twitter / X",pWa:"WhatsApp",pAl:"All / General",load:"Loading services...",noCat:"No categories found",noSvc:"No services found",errFill:"Please enter link and select a service!",errBal:"Insufficient balance!",errConn:"Server connection error!",errFail:"Order failed!",okOrd:"✅ Order submitted successfully #",okPend:"⏳ Sent for admin approval",okRef:"✅ Top-up request sent successfully!",errRef:"Please enter a valid amount!",stProg:"In Progress",stPend:"Pending Approval",stDone:"Completed"},
  ku_b:{lang:"کوردی (بادینی)",dir:"rtl",bal:"باڵانسێ تە",ord:"داواکارییا نوو ⚡",ref:"پڕکرنا باڵانسی 💳",his:"تۆمارێن من 🕒",selP:"پلاتفۆرمی هەلبژێرە:",selT:"جۆرێ خزمەتگوزاریێ:",srch:"🔍 ل ناڤ یان ژمارا خزمەتگوزاریێ بگەڕێ...",cat:"بەش (Category):",oTit:"داواکارییەکا نوو چێکە",oSub:"خزمەتگوزاریێ هەلبژێرە و لینکی بنڤیسە",svc:"خزمەتگوزاری:",lnk:"لینک (Link):",lnkPh:"لینکی ل ڤێرێ دانێ https://...",qty:"چەنداتی (Quantity):",st:"دەستپێکرن",stV:"ئێکسەر (0 - 15 خولەک)",wr:"گەرەنتی",yes:"هەیە",noW:"بێ گەرەنتی",mm:"کێمترین / زۆرترین",tot:"کۆمێ گشتی",sub:"پشتڕاستکرنا داواکاریێ ⚡",rTit:"پڕکرنا باڵانسێ هەژمارێ 💳",rSub:"ژمارا QiCard یان ناونیشانێ USDT کۆپی بکە و پارەی فرێکە",cpy:"📋 کۆپی",pay:"ڕێکا پارەدانێ:",rAmt:"بڕێ پڕکرنێ ($):",note:"ژمارا پرۆسێ / ناڤێ هنێرەری:",notePh:"ژمارا حەواڵێ یان ناڤێ خۆ بنڤیسە...",rBtn:"هنارتنا داواکارییا پڕکرنێ 🚀",hEmp:"تۆمارا داواکارییان یا ڤالایە",hSub:"داواکاریێن تە ل ڤێرێ دێ دیار بن",tAll:"هەمی",tFol:"فۆڵۆوەرز",tLik:"لایک",tViw:"بینین",tCom:"کۆمێنت",tShr:"بەلاڤکرن",pIg:"ئینستاگرام",pTt:"تیک تۆک",pTg:"تێلیگرام",pYt:"یوتیوب",pFb:"فەیسبووک",pSc:"سناب چات",pTw:"تویتەر / X",pWa:"واتساب",pAl:"هەمی / گشتی",load:"خزمەتگوزاری دهێنە بارکرن...",noCat:"چ بەش نەهاتنە دیتن",noSvc:"چ خزمەتگوزاری نەهاتنە دیتن",errFill:"هیڤیدارین لینکی بنڤیسە و خزمەتگوزاریێ هەلبژێرە!",errBal:"باڵانسێ تە تێرا ڤێ داواکاریێ ناکەت!",errConn:"خەلەتی د پەیوەندییا سێرڤەری دا!",errFail:"داواکاری سەرنەکەفت!",okOrd:"✅ داواکاری ب سەرکەفتیانە هاتە هنارتن #",okPend:"⏳ داواکاری بۆ ئەدمینی هاتە هنارتن",okRef:"✅ داواکارییا پڕکرنا باڵانسی هاتە هنارتن!",errRef:"هیڤیدارین بڕەکێ دروست بنڤیسە!",stProg:"د قۆناغا جێبەجێکرنێ دایە",stPend:"ل هیڤییا ڕەزامەندیێ یە",stDone:"ب دووماهیک هات"},
  ku_s:{lang:"کوردی (سۆرانی)",dir:"rtl",bal:"باڵانسەکەت",ord:"داواکاری نوێ ⚡",ref:"پڕکردنەوەی باڵانس 💳",his:"تۆمارەکانم 🕒",selP:"پلاتفۆرم هەڵبژێرە:",selT:"جۆری خزمەتگوزاری:",srch:"🔍 گەڕان بە ناو یان ژمارەی خزمەتگوزاری...",cat:"بەش (Category):",oTit:"دروستکردنی داواکاری نوێ",oSub:"خزمەتگوزاری هەڵبژێرە و لینکەکەت بنووسە",svc:"خزمەتگوزاری:",lnk:"لینک (Link):",lnkPh:"لینکەکە لێرە دابنێ https://...",qty:"بڕ (Quantity):",st:"دەستپێکردن",stV:"دەستبەجێ (0 - 15 خولەک)",wr:"گەرەنتی",yes:"هەیە",noW:"بێ گەرەنتی",mm:"کەمترین / زۆرترین",tot:"کۆی گشتی",sub:"تەواوکردنی داواکاری ⚡",rTit:"پڕکردنەوەی باڵانسی هەژمار 💳",rSub:"ژمارەی QiCard یان ناونیشانی USDT کۆپی بکە و پارەکە بنێرە",cpy:"📋 کۆپی",pay:"شێوازی پارەدان:",rAmt:"بڕی پڕکردنەوە ($):",note:"ژمارەی مامەڵە / ناوی نێرەر:",notePh:"ژمارەی حەواڵە یان ناوی نێرەر بنووسە...",rBtn:"ناردنی داواکاری پڕکردنەوە 🚀",hEmp:"تۆماری داواکارییەکان بەتاڵە",hSub:"داواکارییەکانت لێرە دەردەکەون",tAll:"هەموو",tFol:"فۆڵۆوەرز",tLik:"لایک",tViw:"بینین",tCom:"کۆمێنت",tShr:"بڵاوکردنەوە",pIg:"ئینستاگرام",pTt:"تیک تۆک",pTg:"تێلیگرام",pYt:"یوتیوب",pFb:"فەیسبووک",pSc:"سناب چات",pTw:"تویتەر / X",pWa:"واتساب",pAl:"هەموو / گشتی",load:"خزمەتگوزارییەکان باردەکرێن...",noCat:"هیچ بەشێک نەدۆزرایەوە",noSvc:"هیچ خزمەتگوزارییەک نەدۆزرایەوە",errFill:"تکایە لینک بنووسە و خزمەتگوزاری هەڵبژێرە!",errBal:"باڵانسەکەت بەشی ئەم داواکارییە ناکات!",errConn:"هەڵە لە پەیوەندیکردن بە سێرڤەر!",errFail:"داواکاری سەرکەوتوو نەبوو!",okOrd:"✅ داواکاری بە سەرکەوتوویی نێردرا #",okPend:"⏳ داواکاری بۆ ئەدمین نێردرا",okRef:"✅ داواکاری پڕکردنەوەی باڵانس نێردرا!",errRef:"تکایە بڕێکی دروست بنووسە!",stProg:"لە جێبەجێکردندایە",stPend:"چاوەڕێی پەسەندکردنە",stDone:"تەواوبوو"}
};

const DICT={
  ar:[[/\bno refill\b/gi,"بدون ضمان"],[/\bnon[- ]?drop\b/gi,"بدون نقص"],[/\bzero drop\b/gi,"بدون نقص"],[/\blifetime guaranteed?\b/gi,"ضمان مدى الحياة"],[/\bguaranteed?\b/gi,"مضمون"],[/\brefill\b/gi,"ضمان تعويض"],[/\bhigh quality\b/gi,"جودة عالية"],[/\bhq\b/gi,"جودة عالية"],[/\breal\b/gi,"حقيقي"],[/\bactive\b/gi,"نشط"],[/\bsuper fast\b/gi,"سريع جداً"],[/\bfast start\b/gi,"بدء سريع"],[/\binstant\b/gi,"فوري"],[/\bfast\b/gi,"سريع"],[/\bslow\b/gi,"بطيء"],[/\bstory views?\b/gi,"مشاهدات ستوري"],[/\breels? views?\b/gi,"مشاهدات ريلز"],[/\blive stream\b/gi,"بث مباشر"],[/\bwatch time\b/gi,"ساعات مشاهدة"],[/\bpage likes?\b/gi,"لايكات صفحة"],[/\bchannel members?\b/gi,"أعضاء قناة"],[/\bgroup members?\b/gi,"أعضاء مجموعة"],[/\bpost views?\b/gi,"مشاهدات منشور"],[/\bsubscribers?\b/gi,"مشتركين"],[/\bfollowers?\b/gi,"متابعين"],[/\bmembers?\b/gi,"أعضاء"],[/\blikes?\b/gi,"لايكات"],[/\bviews?\b/gi,"مشاهدات"],[/\bcomments?\b/gi,"تعليقات"],[/\bshares?\b/gi,"مشاركات"],[/\bsaves?\b/gi,"حفظ"],[/\breactions?\b/gi,"تفاعلات"],[/\binstagram\b/gi,"إنستغرام"],[/\btiktok\b/gi,"تيك توك"],[/\btelegram\b/gi,"تيليجرام"],[/\byoutube\b/gi,"يوتيوب"],[/\bfacebook\b/gi,"فيسبوك"],[/\bsnapchat\b/gi,"سناب شات"],[/\btwitter\b/gi,"تويتر"],[/\bwhatsapp\b/gi,"واتساب"],[/\bworldwide\b/gi,"عالمي"],[/\bglobal\b/gi,"عالمي"],[/\barab\b/gi,"عربي"],[/\biraq\b/gi,"العراق"],[/\bcheapest\b/gi,"الأرخص"],[/\bbest\b/gi,"الأفضل"],[/\baccounts?\b/gi,"حسابات"],[/\bbots?\b/gi,"بوتات"],[/\bspeed\b/gi,"السرعة"],[/\bdays?\b/gi,"يوم"],[/\bhours?\b/gi,"ساعة"],[/\/day\b/gi,"/يوم"],[/\bmax\b/gi,"الحد الأقصى"]],
  ku_b:[[/\bno refill\b/gi,"بێ گەرەنتی"],[/\bnon[- ]?drop\b/gi,"بێ کێمبوون"],[/\bzero drop\b/gi,"بێ کێمبوون"],[/\blifetime guaranteed?\b/gi,"گەرەنتی هەتاهەتایی"],[/\bguaranteed?\b/gi,"ب گەرەنتی"],[/\brefill\b/gi,"گەرەنتی"],[/\bhigh quality\b/gi,"کوالێتی بلند"],[/\bhq\b/gi,"کوالێتی بلند"],[/\breal\b/gi,"ڕاستەقینە"],[/\bactive\b/gi,"چالاک"],[/\bsuper fast\b/gi,"گەلەک بلەز"],[/\bfast start\b/gi,"دەستپێکرنا بلەز"],[/\binstant\b/gi,"ئێکسەر"],[/\bfast\b/gi,"بلەز"],[/\bslow\b/gi,"هێدی"],[/\bstory views?\b/gi,"بینینا ستۆری"],[/\breels? views?\b/gi,"بینینا ڕیلز"],[/\blive stream\b/gi,"لایڤ"],[/\bwatch time\b/gi,"دەمژمێرێن بینینێ"],[/\bpage likes?\b/gi,"لایکێن پەیجی"],[/\bchannel members?\b/gi,"ئەندامێن کەنالی"],[/\bgroup members?\b/gi,"ئەندامێن گرووپی"],[/\bpost views?\b/gi,"بینینا پۆستی"],[/\bsubscribers?\b/gi,"سەبسکرایب"],[/\bfollowers?\b/gi,"فۆڵۆوەرز"],[/\bmembers?\b/gi,"ئەندام"],[/\blikes?\b/gi,"لایک"],[/\bviews?\b/gi,"بینین"],[/\bcomments?\b/gi,"کۆمێنت"],[/\bshares?\b/gi,"بەلاڤکرن"],[/\bsaves?\b/gi,"پاشەکەوتکرن"],[/\breactions?\b/gi,"کارڤەدان"],[/\binstagram\b/gi,"ئینستاگرام"],[/\btiktok\b/gi,"تیک تۆک"],[/\btelegram\b/gi,"تێلیگرام"],[/\byoutube\b/gi,"یوتیوب"],[/\bfacebook\b/gi,"فەیسبووک"],[/\bsnapchat\b/gi,"سناب چات"],[/\btwitter\b/gi,"تویتەر"],[/\bwhatsapp\b/gi,"واتساب"],[/\bworldwide\b/gi,"جیهانی"],[/\bglobal\b/gi,"جیهانی"],[/\barab\b/gi,"عەرەبی"],[/\biraq\b/gi,"عیراق"],[/\bcheapest\b/gi,"ئەرزانترین"],[/\bbest\b/gi,"باشترین"],[/\baccounts?\b/gi,"هەژمار"],[/\bbots?\b/gi,"بۆت"],[/\bspeed\b/gi,"لەزاتی"],[/\bdays?\b/gi,"ڕۆژ"],[/\bhours?\b/gi,"دەمژمێر"],[/\/day\b/gi,"/ڕۆژ"],[/\bmax\b/gi,"زۆرترین"]],
  ku_s:[[/\bno refill\b/gi,"بێ گەرەنتی"],[/\bnon[- ]?drop\b/gi,"بێ کەمبوون"],[/\bzero drop\b/gi,"بێ کەمبوون"],[/\blifetime guaranteed?\b/gi,"گەرەنتی هەمیشەیی"],[/\bguaranteed?\b/gi,"بە گەرەنتی"],[/\brefill\b/gi,"گەرەنتی"],[/\bhigh quality\b/gi,"کوالێتی بەرز"],[/\bhq\b/gi,"کوالێتی بەرز"],[/\breal\b/gi,"ڕاستەقینە"],[/\bactive\b/gi,"چالاک"],[/\bsuper fast\b/gi,"زۆر خێرا"],[/\bfast start\b/gi,"دەستپێکردنی خێرا"],[/\binstant\b/gi,"دەستبەجێ"],[/\bfast\b/gi,"خێرا"],[/\bslow\b/gi,"هێواش"],[/\bstory views?\b/gi,"بینینی ستۆری"],[/\breels? views?\b/gi,"بینینی ڕیڵز"],[/\blive stream\b/gi,"پەخشی ڕاستەوخۆ"],[/\bwatch time\b/gi,"کاتژمێری بینین"],[/\bpage likes?\b/gi,"لایکی پەیج"],[/\bchannel members?\b/gi,"ئەندامانی کەناڵ"],[/\bgroup members?\b/gi,"ئەندامانی گرووپ"],[/\bpost views?\b/gi,"بینینی پۆست"],[/\bsubscribers?\b/gi,"سەبسکرایب"],[/\bfollowers?\b/gi,"فۆڵۆوەرز"],[/\bmembers?\b/gi,"ئەندام"],[/\blikes?\b/gi,"لایک"],[/\bviews?\b/gi,"بینین"],[/\bcomments?\b/gi,"کۆمێنت"],[/\bshares?\b/gi,"بڵاوکردنەوە"],[/\bsaves?\b/gi,"پاشەکەوتکردن"],[/\breactions?\b/gi,"کاردانەوە"],[/\binstagram\b/gi,"ئینستاگرام"],[/\btiktok\b/gi,"تیک تۆک"],[/\btelegram\b/gi,"تێلیگرام"],[/\byoutube\b/gi,"یوتیوب"],[/\bfacebook\b/gi,"فەیسبووک"],[/\bsnapchat\b/gi,"سناب چات"],[/\btwitter\b/gi,"تویتەر"],[/\bwhatsapp\b/gi,"واتساب"],[/\bworldwide\b/gi,"جیهانی"],[/\bglobal\b/gi,"جیهانی"],[/\barab\b/gi,"عەرەبی"],[/\biraq\b/gi,"عێراق"],[/\bcheapest\b/gi,"هەرزانترین"],[/\bbest\b/gi,"باشترین"],[/\baccounts?\b/gi,"هەژمار"],[/\bbots?\b/gi,"بۆت"],[/\bspeed\b/gi,"خێرایی"],[/\bdays?\b/gi,"ڕۆژ"],[/\bhours?\b/gi,"کاتژمێر"],[/\/day\b/gi,"/ڕۆژ"],[/\bmax\b/gi,"زۆرترین"]]
};

function trSmm(str){if(!str||lang==='en'||!DICT[lang])return str;let out=String(str);DICT[lang].forEach(function(p){out=out.replace(p[0],p[1]);});return out;}

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
  if(document.getElementById('historySection').style.display==='block')loadHistory();
}

function renderPills(){
  const t=T[lang],box=document.getElementById('typesContainer');box.innerHTML='';
  [{id:'all',n:t.tAll},{id:'follower',n:t.tFol},{id:'like',n:t.tLik},{id:'view',n:t.tViw},{id:'comment',n:t.tCom},{id:'share',n:t.tShr}].forEach(x=>{
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
  if(f.includes('telegram')||f.includes('تيلي')||f.includes('تليجرام'))return'Telegram';
  if(f.includes('youtube')||f.includes('يوتيوب'))return'YouTube';
  if(f.includes('facebook')||f.includes('فيس'))return'Facebook';
  if(f.includes('snap')||f.includes('سناب'))return'Snapchat';
  if(f.includes('twitter')||f.includes('تويتر')||/\bx\b/.test(f))return'Twitter';
  if(f.includes('whatsapp')||f.includes('واتس'))return'WhatsApp';
  return'All';
}

function detType(c,n){
  const f=(c+' '+n).toLowerCase();
  if(f.includes('follower')||f.includes('متابع')||f.includes('مشترك')||f.includes('member')||f.includes('أعضاء'))return'follower';
  if(f.includes('like')||f.includes('لايك')||f.includes('اعجاب')||f.includes('تفاعل'))return'like';
  if(f.includes('view')||f.includes('مشاهد')||f.includes('story')||f.includes('ستوري')||f.includes('reel'))return'view';
  if(f.includes('comment')||f.includes('تعليق'))return'comment';
  if(f.includes('share')||f.includes('مشارك')||f.includes('retweet'))return'share';
  return'other';
}

function setOpt(el,txt){el.innerHTML='';const o=document.createElement('option');o.value='';o.textContent=txt;el.appendChild(o);}

async function fetchServices(){
  const sEl=document.getElementById('serviceSelect'),cEl=document.getElementById('categorySelect');
  setOpt(cEl,T[lang].load);setOpt(sEl,T[lang].load);
  try{
    const res=await fetch('/api/services');const txt=await res.text();let data;
    try{data=JSON.parse(txt);}catch(e){setOpt(cEl,T[lang].errConn);setOpt(sEl,T[lang].errConn);return;}
    if(!data||!data.success||!Array.isArray(data.services)){const e=(data&&data.error)||T[lang].errFail;setOpt(cEl,e);setOpt(sEl,e);return;}
    allServices=data.services.map(s=>{const cat=(s.category||'General').replace(/kd1s/gi,'').trim(),name=(s.name||'').replace(/kd1s/gi,'').trim();return Object.assign({},s,{cleanCat:cat,cleanName:name,plat:detPlat(cat,name),tp:detType(cat,name)});});
    renderCats();
  }catch(e){setOpt(cEl,T[lang].errConn);setOpt(sEl,T[lang].errConn);}
}

function getFiltered(){
  const q=document.getElementById('serviceSearch').value.trim().toLowerCase();
  return allServices.filter(s=>(curPlat==='All'||s.plat===curPlat)&&(curType==='all'||s.tp===curType)&&(!q||String(s.service||s.id).includes(q)||s.cleanName.toLowerCase().includes(q)||s.cleanCat.toLowerCase().includes(q)||trSmm(s.cleanName).toLowerCase().includes(q)||trSmm(s.cleanCat).toLowerCase().includes(q)));
}

function renderCats(){
  const cEl=document.getElementById('categorySelect'),prev=cEl.value,cats=[...new Set(getFiltered().map(s=>s.cleanCat))];cEl.innerHTML='';
  if(!cats.length)setOpt(cEl,T[lang].noCat);else{cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=trSmm(c);cEl.appendChild(o);});if(cats.includes(prev))cEl.value=prev;}
  renderSvcs();
}

function renderSvcs(){
  const sEl=document.getElementById('serviceSelect'),prev=sEl.value,cat=document.getElementById('categorySelect').value,list=getFiltered().filter(s=>!cat||s.clean
