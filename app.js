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
  ar:{lang:"العربية",dir:"rtl",bal:"رصيدك",ord:"طلب جديد ⚡",ref:"شحن رصيد 💳",his:"سجلاتي 🕒",selP:"اختر المنصة:",selT:"اختر نوع الخدمة:",srch:"🔍 ابحث باسم الخدمة أو الرقم...",cat:"القسم:",loadCat:"جاري التحميل...",loadSvc:"جاري التحميل...",oTit:"إنشاء طلب جديد",oSub:"اختر الخدمة واكتب الرابط الخاص بك",svc:"الخدمة:",lnk:"الرابط:",lnkPh:"ضع الرابط هنا \u200Ehttps://...\u200E",qty:"الكمية:",st:"البدء",stV:"فوري (0 - 15 د)",wr:"الضمان",yes:"متوفر",noW:"بدون ضمان",mm:"الحد الأدنى / الأقصى",tot:"الإجمالي",sub:"تأكيد الطلب ⚡",rTit:"شحن رصيد الحساب 💳",rSub:"انسخ رقم QiCard أو عنوان USDT وأرسل المبلغ",cpy:"📋 نسخ",pay:"طريقة الدفع:",rAmt:"مبلغ الشحن ($):",note:"رقم العملية / اسم المرسل:",notePh:"اكتب رقم الحوالة أو اسم المرسل...",rBtn:"إرسال طلب الشحن 🚀",hEmp:"سجل الطلبات فارغ",hSub:"الطلبات التي تقوم بتثبيتها ستظهر هنا",tAll:"الكل",tFol:"متابعين",tLik:"لايكات",tViw:"مشاهدات",tCom:"تعليقات",pIg:"إنستغرام",pTt:"تيك توك",pTg:"تيليجرام",pYt:"يوتيوب",pFb:"فيسبوك",pSc:"سناب شات",pTw:"تويتر / X",pWa:"واتساب",pAl:"الكل / عام",errFill:"يرجى إدخال الرابط واختيار الخدمة!",okPend:"⏳ بانتظار الموافقة",okOrd:"✅ تم تنفيذ الطلب #",errFail:"فشل تنفيذ الطلب",errConn:"خطأ في الاتصال",okRef:"✅ تم الإرسال بنجاح!",errRef:"❌ خطأ في الإرسال",stProg:"قيد التنفيذ",stPend:"بانتظار الموافقة",stDone:"مكتمل"},
  en:{lang:"English",dir:"ltr",bal:"Balance",ord:"New Order ⚡",ref:"Top Up 💳",his:"History 🕒",selP:"Select Platform:",selT:"Service Type:",srch:"🔍 Search service name or ID...",cat:"Category:",loadCat:"Loading...",loadSvc:"Loading...",oTit:"Create New Order",oSub:"Select a service and enter your link",svc:"Service:",lnk:"Link:",lnkPh:"Paste link here https://...",qty:"Quantity:",st:"Start",stV:"Instant (0 - 15m)",wr:"Guarantee",yes:"Available",noW:"No Refill",mm:"Min / Max",tot:"Total",sub:"Submit Order ⚡",rTit:"Top Up Balance 💳",rSub:"Copy QiCard or USDT (TRC20) and send payment",cpy:"📋 Copy",pay:"Payment Method:",rAmt:"Amount ($):",note:"Transaction ID / Sender Name:",notePh:"Enter transaction ID or sender name...",rBtn:"Send Top-Up Request 🚀",hEmp:"Order history is empty",hSub:"Your submitted orders will appear here",tAll:"All",tFol:"Followers",tLik:"Likes",tViw:"Views",tCom:"Comments",pIg:"Instagram",pTt:"TikTok",pTg:"Telegram",pYt:"YouTube",pFb:"Facebook",pSc:"Snapchat",pTw:"Twitter / X",pWa:"WhatsApp",pAl:"All / General",errFill:"Please enter link and select a service!",okPend:"⏳ Pending Approval",okOrd:"✅ Order #",errFail:"Order Failed",errConn:"Connection Error",okRef:"✅ Request Sent!",errRef:"❌ Error",stProg:"In Progress",stPend:"Pending Approval",stDone:"Completed"},
  ku_b:{lang:"کوردی (بادینی)",dir:"rtl",bal:"باڵانسێ تە",ord:"داواکارییا نوو ⚡",ref:"پڕکرنا باڵانسی 💳",his:"تۆمارێن من 🕒",selP:"پلاتفۆرمی هەلبژێرە:",selT:"جۆرێ خزمەتگوزاریێ:",srch:"🔍 ل ناڤ یان ژمارا خزمەتگوزاریێ بگەڕێ...",cat:"بەش:",loadCat:"بارکرن...",loadSvc:"بارکرن...",oTit:"داواکارییەکا نوو چێکە",oSub:"خزمەتگوزاریێ هەلبژێرە و لینکی بنڤیسە",svc:"خزمەتگوزاری:",lnk:"لینک:",lnkPh:"لینکی ل ڤێرێ دانێ \u200Ehttps://...\u200E",qty:"چەنداتی:",st:"دەستپێکرن",stV:"ئێکسەر (0 - 15 خولەک)",wr:"گەرەنتی",yes:"هەیە",noW:"بێ گەرەنتی",mm:"کێمترین / زۆرترین",tot:"کۆمێ گشتی",sub:"پشتڕاستکرنا داواکاریێ ⚡",rTit:"پڕکرنا باڵانسێ هەژمارێ 💳",rSub:"ژمارا QiCard یان ناونیشانێ USDT کۆپی بکە و پارەی فرێکە",cpy:"📋 کۆپی",pay:"ڕێکا پارەدانێ:",rAmt:"بڕێ پڕکرنێ ($):",note:"ژمارا پرۆسێ / ناڤێ هنێرەری:",notePh:"ژمارا حەواڵێ یان ناڤێ خۆ بنڤیسە...",rBtn:"هنارتنا داواکارییا پڕکرنێ 🚀",hEmp:"تۆمارا داواکارییان یا ڤالایە",hSub:"داواکاریێن تە ل ڤێرێ دێ دیار بن",tAll:"هەمی",tFol:"فۆڵۆوەرز",tLik:"لایک",tViw:"بینین",tCom:"کۆمێنت",pIg:"ئینستاگرام",pTt:"تیک تۆک",pTg:"تێلیگرام",pYt:"یوتیوب",pFb:"فەیسبووک",pSc:"سناب چات",pTw:"تویتەر / X",pWa:"واتساب",pAl:"هەمی / گشتی",errFill:"هیڤیدارین لینکی بنڤیسە و خزمەتگوزاریێ هەلبژێرە!",okPend:"⏳ ل هیڤییا ڕەزامەندیێ یە",okOrd:"✅ داواکاری هاتە هنارتن #",errFail:"داواکاری سەرنەکەفت",errConn:"خەلەتی د پەیوەندیێ دا",okRef:"✅ داواکاری هاتە هنارتن!",errRef:"❌ خەلەتی روویدا",stProg:"د قۆناغا جێبەجێکرنێ دایە",stPend:"ل هیڤییا ڕەزامەندیێ یە",stDone:"ب دووماهیک هات"}
};

// Comprehensive Multi-Word Phrases [normalized_source, English, Arabic, Kurdish_Badini]
const PHRASES=[
  ["طفي زر مراجعة المتابعين قبل الطلب","Turn off follower review button before ordering","أوقف زر مراجعة المتابعين قبل الطلب","دوگمەیا پێداچوونا فۆڵۆوەران بگرە بەری داواکاریێ"],
  ["اطفي زر مراجعة المتابعين قبل الطلب","Turn off follower review button before ordering","أوقف زر مراجعة المتابعين قبل الطلب","دوگمەیا پێداچوونا فۆڵۆوەران بگرە بەری داواکاریێ"],
  ["اذا طلبت و الزر مفعل ف لا نستطيع اصلاح طلبك","If ordered while active we cannot fix your order","إذا طلبت والزر مفعل فلا نستطيع إصلاح طلبك","ئەگەر تە داواکاری کر و دوگمە چالاک بیت نەشێین داواکارییا تە چاک بکەین"],
  ["اذا طلبت والزر مفعل فلا نستطيع اصلاح طلبك","If ordered while active we cannot fix your order","إذا طلبت والزر مفعل فلا نستطيع إصلاح طلبك","ئەگەر تە داواکاری کر و دوگمە چالاک بیت نەشێین داواکارییا تە چاک بکەین"],
  ["يجب ان يكون الحساب عام","Account must be public","يجب أن يكون الحساب عاماً","پێدڤییە هەژمار یا گشتی بیت"],
  ["يجب ان تكون القناة عامة","Channel must be public","يجب أن تكون القناة عامة","پێدڤییە کەنال یێ گشتی بیت"],
  ["لا تضع اكثر من طلب لنفس الرابط","Do not place multiple orders for the same link","لا تضع أكثر من طلب لنفس الرابط","زێدەتر ژ داواکارییەکێ بۆ هەمان لینکی دانەنێ"],
  ["لا تطلب لنفس الرابط قبل انتهاء الطلب","Do not order same link before completion","لا تطلب لنفس الرابط قبل انتهاء الطلب","بەری ب دووماهیک هاتنا داواکاریێ بۆ هەمان لینکی داوا نەکە"],
  ["خدمات الدعم الممول","Sponsored Boost Services","خدمات الدعم الممول","خزمەتگوزاریێن پشتەڤانییا سپۆنسەرکری"],
  ["الدعم الممول","Sponsored Boost","الدعم الممول","پشتەڤانییا سپۆنسەرکری"],
  ["دعم ممول","Sponsored Boost","الدعم الممول","پشتەڤانییا سپۆنسەرکری"],
  ["خدمات مصغرة احترافية","Professional Micro Services","خدمات مصغرة احترافية","خزمەتگوزاریێن بچووک یێن پیشەیی"],
  ["المصغرة الاحترافية","Professional Micro","المصغرة الاحترافية","بچووکێن پیشەیی"],
  ["خدمات احترافية","Professional Services","خدمات احترافية","خزمەتگوزاریێن پیشەیی"],
  ["تثبيت تطبيقات الهاتف","Mobile App Installs","تثبيت تطبيقات الهاتف","دامەزراندنا ئەپێن مۆبایلێ"],
  ["رفع حساب اكسبلور","Boost Account to Explore","رفع حساب إكسبلور","بلندکرنا هەژماری بۆ ئێکسپلۆر"],
  ["الارخص مبيعا اليوم","Cheapest Best Sellers Today","الأرخص مبيعاً اليوم","ئەرزانترین فرۆتنا ئەڤرۆ"],
  ["ارخص مبيعا اليوم","Cheapest Best Sellers Today","الأرخص مبيعاً اليوم","ئەرزانترین فرۆتنا ئەڤرۆ"],
  ["الاكثر مبيعا اليوم","Best Sellers Today","الأكثر مبيعاً اليوم","زۆرترین فرۆتنا ئەڤرۆ"],
  ["اكثر مبيعا اليوم","Best Sellers Today","الأكثر مبيعاً اليوم","زۆرترین فرۆتنا ئەڤرۆ"],
  ["الاكثر مبيعا","Best Sellers","الأكثر مبيعاً","زۆرترین فرۆتن"],
  ["اكثر مبيعا","Best Sellers","الأكثر مبيعاً","زۆرترین فرۆتن"],
  ["الاكثر طلبا","Most Ordered","الأكثر طلباً","زۆرترین داواکاری"],
  ["اكثر طلبا","Most Ordered","الأكثر طلباً","زۆرترین داواکاری"],
  ["تعمل علي التحديث الجديد","Working After New Update","تعمل على التحديث الجديد","پشتی ئەپدەیتا نوو کار دکەن"],
  ["يعمل علي التحديث الجديد","Working After New Update","يعمل على التحديث الجديد","پشتی ئەپدەیتا نوو کار دکەن"],
  ["تعمل علي تحديث جديد","Working After New Update","تعمل على التحديث الجديد","پشتی ئەپدەیتا نوو کار دکەن"],
  ["يعمل علي تحديث جديد","Working After New Update","يعمل على التحديث الجديد","پشتی ئەپدەیتا نوو کار دکەن"],
  ["تعمل بعد التحديث","Working After Update","تعمل بعد التحديث","پشتی ئەپدەیتێ کار دکەن"],
  ["يعمل بعد التحديث","Working After Update","يعمل بعد التحديث","پشتی ئەپدەیتێ کار دکەن"],
  ["تعمل بعد تحديث","Working After Update","تعمل بعد التحديث","پشتی ئەپدەیتێ کار دکەن"],
  ["يعمل بعد تحديث","Working After Update","يعمل بعد التحديث","پشتی ئەپدەیتێ کار دکەن"],
  ["تعمل دائما","Always Working","تعمل دائماً","هەردەم کار دکەت"],
  ["يعمل دائما","Always Working","يعمل دائماً","هەردەم کار دکەت"],
  ["الضمان الذهبي","Golden Guarantee","الضمان الذهبي","گەرەنتییا زێڕین"],
  ["ضمان ذهبي","Golden Guarantee","ضمان ذهبي","گەرەنتییا زێڕین"],
  ["ضمان مدي الحياة","Lifetime Guarantee","ضمان مدى الحياة","گەرەنتی هەتاهەتایی"],
  ["ضمان مدي حياة","Lifetime Guarantee","ضمان مدى الحياة","گەرەنتی هەتاهەتایی"],
  ["مدي الحياة","Lifetime","مدى الحياة","هەتاهەتایی"],
  ["مدي حياة","Lifetime","مدى الحياة","هەتاهەتایی"],
  ["تعويض تلقائي","Auto Refill","تعويض تلقائي","قەرەبووکرنا خودکار"],
  ["تعويض يدوي","Manual Refill","تعويض يدوي","قەرەبووکرنا دەستی"],
  ["زر التعويض","Refill Button","زر التعويض","دوگمەیا قەرەبووکرنێ"],
  ["زر تعويض","Refill Button","زر التعويض","دوگمەیا قەرەبووکرنێ"],
  ["بدون ضمان","No Refill","بدون ضمان","بێ گەرەنتی"],
  ["لا يوجد ضمان","No Refill","بدون ضمان","بێ گەرەنتی"],
  ["بدون تعويض","No Refill","بدون ضمان","بێ گەرەنتی"],
  ["لا يوجد تعويض","No Refill","بدون ضمان","بێ گەرەنتی"],
  ["غير مضمون","No Refill","بدون ضمان","بێ گەرەنتی"],
  ["غير مضمونة","No Refill","بدون ضمان","بێ گەرەنتی"],
  ["بدون نقص","Non-Drop","بدون نقص","بێ کێمبوون"],
  ["بدون نزول","Non-Drop","بدون نقص","بێ کێمبوون"],
  ["بدون انخفاض","Non-Drop","بدون نقص","بێ کێمبوون"],
  ["بدون هبوط","Non-Drop","بدون نقص","بێ کێمبوون"],
  ["عدم نقص","Non-Drop","بدون نقص","بێ کێمبوون"],
  ["non drop","Non-Drop","بدون نقص","بێ کێمبوون"],
  ["no drop","Non-Drop","بدون نقص","بێ کێمبوون"],
  ["نقص قليل","Low Drop","نقص قليل","کێمبوونا کێم"],
  ["نزول قليل","Low Drop","نقص قليل","کێمبوونا کێم"],
  ["نقص متوسط","Medium Drop","نقص متوسط","کێمبوونا ناڤنجی"],
  ["نقص عالي","High Drop","نقص عالي","کێمبوونا زۆر"],
  ["بدء فوري","Instant Start","بدء فوري","دەستپێکرنا ئێکسەر"],
  ["بدء سريع","Fast Start","بدء سريع","دەستپێکرنا بلەز"],
  ["فائق السرعة","Super Fast","فائق السرعة","گەلەک بلەز"],
  ["سريع جدا","Super Fast","سريع جداً","گەلەک بلەز"],
  ["سريعة جدا","Super Fast","سريع جداً","گەلەک بلەز"],
  ["جودة عالية","High Quality","جودة عالية","کوالێتی بلند"],
  ["جودة ممتازة","Excellent Quality","جودة ممتازة","کوالێتی نایاب"],
  ["جودة متوسطة","Medium Quality","جودة متوسطة","کوالێتی ناڤنجی"],
  ["جودة منخفضة","Low Quality","جودة منخفضة","کوالێتی نزم"],
  ["جودة حقيقية","Real Quality","جودة حقيقية","کوالێتی ڕاستەقینە"],
  ["مشاهدات بوست صورة","Photo Post Views","مشاهدات منشور صورة","بینینا پۆستێ وێنەی"],
  ["مشاهدات منشور صورة","Photo Post Views","مشاهدات منشور صورة","بینینا پۆستێ وێنەی"],
  ["مشاهدات ستوري","Story Views","مشاهدات ستوري","بینینا ستۆری"],
  ["مشاهدات ريلز","Reels Views","مشاهدات ريلز","بینینا ڕیلز"],
  ["مشاهدات فيديو","Video Views","مشاهدات فيديو","بینینا ڤیدیۆیێ"],
  ["مشاهدات بث مباشر","Live Stream Views","مشاهدات بث مباشر","بینینا لایڤی"],
  ["بث مباشر","Live Stream","بث مباشر","لایڤ"],
  ["ساعات مشاهدة","Watch Hours","ساعات مشاهدة","دەمژمێرێن بینینێ"],
  ["دقائق مشاهدة","Watch Minutes","دقائق مشاهدة","خولەکێن بینینێ"],
  ["لايكات صفحة","Page Likes","لايكات صفحة","لایکێن پەیجی"],
  ["لايكات تعليق","Comment Likes","لايكات تعليق","لایکێن کۆمێنتێ"],
  ["لايكات منشور","Post Likes","لايكات منشور","لایکێن پۆستی"],
  ["اعضاء قناة","Channel Members","أعضاء قناة","ئەندامێن کەنالی"],
  ["اعضاء مجموعة","Group Members","أعضاء مجموعة","ئەندامێن گرووپی"],
  ["تعليقات مخصصة","Custom Comments","تعليقات مخصصة","کۆمێنتێن تایبەت"],
  ["تعليقات عشوائية","Random Comments","تعليقات عشوائية","کۆمێنتێن هەڕەمەکی"],
  ["تعليقات ايموجي","Emoji Comments","تعليقات إيموجي","کۆمێنتێن ئیمۆجی"],
  ["حسابات حقيقية","Real Accounts","حسابات حقيقية","هەژمارێن ڕاستەقینە"],
  ["حسابات قديمة","Old Accounts","حسابات قديمة","هەژمارێن کەڤن"],
  ["حسابات موثقة","Verified Accounts","حسابات موثقة","هەژمارێن پشتڕاستکری"],
  ["زيارات ملف شخصي","Profile Visits","زيارات بروفايل","سەرەدانێن پڕۆفایلی"],
  ["حفظ منشور","Post Saves","حفظ المنشور","پاشەکەوتکرنا پۆستی"],
  ["عروض خاصة","Special Offers","عروض خاصة","ئۆفەرێن تایبەت"],
  ["خدمات مجانية","Free Services","خدمات مجانية","خزمەتگوزاری بێ بەرامبەر"],
  ["خدمات مسوقين","Marketers Services","خدمات المسوقين","خزمەتگوزاری بازاڕکەران"],
  ["خدمات موزعين","Resellers Services","خدمات الموزعين","خزمەتگوزاری بەلاڤکەران"],
  ["بكجات منوعة","Mixed Packages","باقات متنوعة","پاکێجێن جۆراوجۆر"],
  ["باقات متنوعة","Mixed Packages","باقات متنوعة","پاکێجێن جۆراوجۆر"],
  ["تحقيق الربح","Monetization","تحقيق الربح","چالاککرنا قازانجی"],
  ["تحقيق ربح","Monetization","تحقيق الربح","چالاککرنا قازانجی"],
  ["انت تكتبها","You Write Them","أنت تكتبها","تو دنڤیسی"],
  ["في اليوم","Per Day","يومياً","د ڕۆژێ دا"],
  ["في الساعة","Per Hour","بالساعة","د دەمژمێرێ دا"],
  ["تحديث جديد","New Update","تحديث جديد","ئەپدەیتا نوو"],
  ["حركة اكسبلور","Explore Traffic","حركة الإكسبلور","لڤینا ئێکسپلۆر"],
  ["نقاط تحديثات","Update Points","نقاط التحديثات","خاڵێن ئەپدەیتان"],
  ["جوجل بلاي","Google Play","جوجل بلاي","گۆگڵ پلەی"],
  ["اب ستور","App Store","آب ستور","ئەپ ستۆر"],
  ["خرائط جوجل","Google Maps","خرائط جوجل","نەخشێن گۆگڵی"],
  ["تفعيل الربح","Enable Monetization","تفعيل الربح","چالاککرنا قازانجی"],
  ["توثيق حساب","Account Verification","توثيق حساب","پشتڕاستکرنا هەژمارێ"],
  ["اعادة تعبئة","Refill","إعادة تعبئة","پڕکرنەڤە"],
  ["بلا حدود","Unlimited","بلا حدود","بێ سنوور"],
  ["تلقائيا","Automatically","تلقائياً","ب شێوەیێ خودکار"],
  ["نسخ الرابط","Copy Link","نسخ الرابط","کۆپیکرنا لینکی"],
  ["الاكثر تفاعلا","Most Engaging","الأكثر تفاعلاً","زۆرترین کارڤەدان"]
];

// Exhaustive Single-Word Dictionary [English, Arabic, Kurdish_Badini]
const WORDS={
  "instagram":["Instagram","إنستغرام","ئینستاگرام"],"انستقرام":["Instagram","إنستغرام","ئینستاگرام"],"انستغرام":["Instagram","إنستغرام","ئینستاگرام"],"انستجرام":["Instagram","إنستغرام","ئینستاگرام"],
  "tiktok":["TikTok","تيك توك","تیک تۆک"],"تيك توك":["TikTok","تيك توك","تیک تۆک"],"تيكتوك":["TikTok","تيك توك","تیک تۆک"],
  "telegram":["Telegram","تيليجرام","تێلیگرام"],"تيليجرام":["Telegram","تيليجرام","تێلیگرام"],"تليجرام":["Telegram","تيليجرام","تێلیگرام"],"تلجرام":["Telegram","تيليجرام","تێلیگرام"],
  "youtube":["YouTube","يوتيوب","یوتیوب"],"يوتيوب":["YouTube","يوتيوب","یوتیوب"],
  "facebook":["Facebook","فيسبوك","فەیسبووک"],"فيسبوك":["Facebook","فيسبوك","فەیسبووک"],"فيس بوك":["Facebook","فيسبوك","فەیسبووک"],
  "snapchat":["Snapchat","سناب شات","سناب چات"],"سناب شات":["Snapchat","سناب شات","سناب چات"],"سنابشات":["Snapchat","سناب شات","سناب چات"],
  "twitter":["Twitter / X","تويتر / X","تویتەر / X"],"تويتر":["Twitter / X","تويتر / X","تویتەر / X"],"اكس":["Twitter / X","تويتر / X","تویتەر / X"],
  "whatsapp":["WhatsApp","واتساب","واتساب"],"واتساب":["WhatsApp","واتساب","واتساب"],"واتس اب":["WhatsApp","واتساب","واتساب"],
  "threads":["Threads","ثريدز","سرێدز"],"ثريدز":["Threads","ثريدز","سرێدز"],
  "spotify":["Spotify","سبوتيفاي","سپۆتیفای"],"سبوتيفاي":["Spotify","سبوتيفاي","سپۆتیفای"],
  "discord":["Discord","ديسكورد","دیسکۆرد"],"ديسكورد":["Discord","ديسكورد","دیسکۆرد"],
  "twitch":["Twitch","تويتش","تویچ"],"تويتش":["Twitch","تويتش","تویچ"],
  "kwai":["Kwai","كواي","کوای"],"كواي":["Kwai","كواي","کوای"],
  "kick":["Kick","كيك","کیک"],"كيك":["Kick","كيك","کیک"],
  "jaco":["Jaco","جاكو","جاکۆ"],"جاكو":["Jaco","جاكو","جاکۆ"],
  "linkedin":["LinkedIn","لينكد إن","لینکدئین"],"لينكد ان":["LinkedIn","لينكد إن","لینکدئین"],
  "pinterest":["Pinterest","بنترست","پینتەرێست"],"بنترست":["Pinterest","بنترست","پینتەرێست"],
  "soundcloud":["SoundCloud","ساوند كلاود","ساوند کلاود"],"ساوند كلاود":["SoundCloud","ساوند كلاود","ساوند کلاود"],
  "clubhouse":["Clubhouse","كلوب هاوس","کلەب هاوس"],"كلوب هاوس":["Clubhouse","كلوب هاوس","کلەب هاوس"],
  "reddit":["Reddit","ريديت","ڕێدیت"],"ريديت":["Reddit","ريديت","ڕێدیت"],
  "likee":["Likee","لايكي","لایکی"],"لايكي":["Likee","لايكي","لایکی"],
  "google":["Google","جوجل","گۆگڵ"],"جوجل":["Google","جوجل","گۆگڵ"],"قوقل":["Google","جوجل","گۆگڵ"],
  "apple":["Apple","آبل","ئەپڵ"],"ابل":["Apple","آبل","ئەپڵ"],
  "followers":["Followers","متابعين","فۆڵۆوەرز"],"متابعين":["Followers","متابعين","فۆڵۆوەرز"],"متابع":["Followers","متابعين","فۆڵۆوەرز"],
  "subscribers":["Subscribers","مشتركين","سەبسکرایب"],"مشتركين":["Subscribers","مشتركين","سەبسکرایب"],"مشترك":["Subscribers","مشتركين","سەبسکرایب"],
  "subscriptions":["Subscriptions","اشتراكات","بەشداربوون"],"اشتراكات":["Subscriptions","اشتراكات","بەشداربوون"],"اشتراك":["Subscription","اشتراك","بەشداربوون"],
  "members":["Members","أعضاء","ئەندام"],"اعضاء":["Members","أعضاء","ئەندام"],"عضو":["Members","أعضاء","ئەندام"],
  "likes":["Likes","لايكات","لایک"],"لايكات":["Likes","لايكات","لایک"],"لايك":["Likes","لايكات","لایک"],"اعجابات":["Likes","لايكات","لایک"],"اعجاب":["Likes","لايكات","لایک"],
  "views":["Views","مشاهدات","بینین"],"مشاهدات":["Views","مشاهدات","بینین"],"مشاهدة":["Views","مشاهدات","بینین"],
  "comments":["Comments","تعليقات","کۆمێنت"],"تعليقات":["Comments","تعليقات","کۆمێنت"],"تعليق":["Comments","تعليقات","کۆمێنت"],"كومنتات":["Comments","تعليقات","کۆمێنت"],"كومنت":["Comments","تعليقات","کۆمێنت"],
  "replies":["Replies","ردود","بەرسڤ"],"ردود":["Replies","ردود","بەرسڤ"],"رد":["Reply","رد","بەرسڤ"],
  "shares":["Shares","مشاركات","بەلاڤکرن"],"مشاركات":["Shares","مشاركات","بەلاڤکرن"],"مشاركة":["Shares","مشاركات","بەلاڤکرن"],"شير":["Shares","مشاركات","بەلاڤکرن"],
  "publish":["Publish","نشر","بەلاڤکرن"],"نشر":["Publish","نشر","بەلاڤکرن"],
  "repost":["Repost","إعادة نشر","دووبارە پۆستکرن"],"ريبوست":["Repost","إعادة نشر","دووبارە پۆستکرن"],
  "retweet":["Retweet","ريتويت","ڕیتویت"],"ريتويت":["Retweet","ريتويت","ڕیتویت"],
  "saves":["Saves","حفظ","پاشەکەوتکرن"],"حفظ":["Saves","حفظ","پاشەکەوتکرن"],"تخزين":["Saves","حفظ","پاشەکەوتکرن"],
  "bookmarks":["Bookmarks","إشارات مرجعية","نیشانکرن"],"بوك مارك":["Bookmarks","إشارات مرجعية","نیشانکرن"],
  "reactions":["Reactions","تفاعلات","کارڤەدان"],"تفاعلات":["Reactions","تفاعلات","کارڤەدان"],"تفاعل":["Reactions","تفاعلات","کارڤەدان"],"رياكشنات":["Reactions","تفاعلات","کارڤەدان"],"رياكشن":["Reactions","تفاعلات","کارڤەدان"],
  "stories":["Stories","ستوري","ستۆری"],"ستوري":["Stories","ستوري","ستۆری"],"استوري":["Stories","ستوري","ستۆری"],"قصص":["Stories","ستوري","ستۆری"],
  "reels":["Reels","ريلز","ڕیلز"],"ريلز":["Reels","ريلز","ڕیلز"],"ريل":["Reels","ريلز","ڕیلز"],
  "shorts":["Shorts","شورتس","شۆرتس"],"شورتس":["Shorts","شورتس","شۆرتس"],
  "videos":["Videos","فيديوهات","ڤیدیۆ"],"فيديوهات":["Videos","فيديوهات","ڤیدیۆ"],"فيديو":["Videos","فيديوهات","ڤیدیۆ"],"مقاطع":["Videos","فيديوهات","ڤیدیۆ"],
  "posts":["Posts","منشورات","پۆست"],"منشورات":["Posts","منشورات","پۆست"],"منشور":["Posts","منشورات","پۆست"],"بوستات":["Posts","منشورات","پۆست"],"بوست":["Posts","منشورات","پۆست"],
  "photos":["Photos","صور","وێنە"],"صور":["Photos","صور","وێنە"],"صورة":["Photo","صورة","وێنە"],
  "live":["Live","بث مباشر","لایڤ"],"لايف":["Live","بث مباشر","لایڤ"],"بث":["Live","بث مباشر","لایڤ"],
  "impressions":["Impressions","انطباعات","دەرکەفتن"],"انطباعات":["Impressions","انطباعات","دەرکەفتن"],
  "reach":["Reach","وصول","گەهشتن"],"وصول":["Reach","وصول","گەهشتن"],
  "polls":["Polls","تصويتات","دەنگدان"],"تصويتات":["Polls","تصويتات","دەنگدان"],"تصويت":["Polls","تصويتات","دەنگدان"],"استطلاعات":["Polls","تصويتات","دەنگدان"],
  "votes":["Votes","أصوات","دەنگ"],"اصوات":["Votes","أصوات","دەنگ"],"صوت":["Vote","صوت","دەنگ"],
  "visits":["Visits","زيارات","سەرەدان"],"زيارات":["Visits","زيارات","سەرەدان"],"زيارة":["Visits","زيارات","سەرەدان"],"زوار":["Visitors","زوار","سەرەدانکەر"],
  "traffic":["Traffic","زيارات","سەرەدان"],"ترافيك":["Traffic","زيارات","سەرەدان"],
  "clicks":["Clicks","نقرات","کلیک"],"نقرات":["Clicks","نقرات","کلیک"],
  "explore":["Explore","إكسبلور","ئێکسپلۆر"],"اكسبلور":["Explore","إكسبلور","ئێکسپلۆر"],
  "boost_up":["Boost","رفع","بلندکرن"],"رفع":["Boost","رفع","بلندکرن"],
  "trends":["Trends","ترند","ترێند"],"ترند":["Trends","ترند","ترێند"],
  "channel":["Channel","قناة","کەنال"],"قناة":["Channel","قناة","کەنال"],"قنوات":["Channels","قنوات","کەنال"],
  "group":["Group","مجموعة","گرووپ"],"مجموعة":["Group","مجموعة","گرووپ"],"مجموعات":["Groups","مجموعات","گرووپ"],"جروب":["Group","مجموعة","گرووپ"],"كروب":["Group","مجموعة","گرووپ"],
  "page":["Page","صفحة","پەیج"],"صفحة":["Page","صفحة","پەیج"],"صفحات":["Pages","صفحات","پەیج"],"بيج":["Page","صفحة","پەیج"],
  "profile":["Profile","ملف شخصي","پڕۆفایل"],"بروفايل":["Profile","ملف شخصي","پڕۆفایل"],
  "account":["Account","حساب","هەژمار"],"حساب":["Account","حساب","هەژمار"],"حسابات":["Accounts","حسابات","هەژمار"],
  "users":["Users","مستخدمين","بکارهێنەر"],"مستخدمين":["Users","مستخدمين","بکارهێنەر"],
  "real":["Real","حقيقي","ڕاستەقینە"],"حقيقي":["Real","حقيقي","ڕاستەقینە"],"حقيقية":["Real","حقيقي","ڕاستەقینە"],"حقيقيين":["Real","حقيقي","ڕاستەقینە"],
  "active":["Active","نشط","چالاک"],"نشط":["Active","نشط","چالاک"],"نشطين":["Active","نشط","چالاک"],"متفاعلين":["Active","نشط","چالاک"],
  "bots":["Bots","وهمي","بۆت"],"وهمي":["Bots","وهمي","بۆت"],"وهمية":["Bots","وهمي","بۆت"],"وهميين":["Bots","وهمي","بۆت"],"بوتات":["Bots","وهمي","بۆت"],"بوت":["Bots","وهمي","بۆت"],
  "mixed":["Mixed","مختلط","تێکەل"],"مكس":["Mixed","مختلط","تێکەل"],"مختلط":["Mixed","مختلط","تێکەل"],"مختلطة":["Mixed","مختلط","تێکەل"],
  "female":["Female","بنات","کچ"],"بنات":["Female","بنات","کچ"],"نساء":["Female","بنات","کچ"],"اناث":["Female","بنات","کچ"],
  "male":["Male","شباب","کوڕ"],"شباب":["Male","شباب","کوڕ"],"رجال":["Male","شباب","کوڕ"],"ذكور":["Male","شباب","کوڕ"],
  "verified":["Verified","موثق","پشتڕاستکری"],"موثق":["Verified","موثق","پشتڕاستکری"],"موثقة":["Verified","موثق","پشتڕاستکری"],"توثيق":["Verification","توثيق","پشتڕاستکرن"],
  "professional":["Professional","احترافية","پیشەیی"],"احترافية":["Professional","احترافية","پیشەیی"],"احترافي":["Professional","احترافي","پیشەیی"],
  "always":["Always","دائماً","هەردەم"],"دائما":["Always","دائماً","هەردەم"],"دايما":["Always","دائماً","هەردەم"],
  "instant":["Instant","فوري","ئێکسەر"],"فوري":["Instant","فوري","ئێکسەر"],"فورية":["Instant","فوري","ئێکسەر"],
  "fast":["Fast","سريع","بلەز"],"سريع":["Fast","سريع","بلەز"],"سريعة":["Fast","سريع","بلەز"],
  "slow":["Slow","بطيء","هێدی"],"بطيء":["Slow","بطيء","هێدی"],"بطيئة":["Slow","بطيء","هێدی"],
  "stable":["Stable","ثابت","جێگیر"],"ثابت":["Stable","ثابت","جێگیر"],"ثابتة":["Stable","ثابت","جێگیر"],"مستقر":["Stable","مستقر","جێگیر"],
  "quality":["Quality","جودة","کوالێتی"],"جودة":["Quality","جودة","کوالێتی"],
  "high":["High","عالية","بلند"],"عالية":["High","عالية","بلند"],"عالي":["High","عالي","بلند"],
  "medium":["Medium","متوسطة","ناڤنجی"],"متوسطة":["Medium","متوسطة","ناڤنجی"],"متوسط":["Medium","متوسط","ناڤنجی"],
  "low":["Low","منخفضة","نزم"],"منخفضة":["Low","منخفضة","نزم"],"منخفض":["Low","منخفضة","نزم"],
  "refill":["Refill","ضمان","گەرەنتی"],"ضمان":["Refill","ضمان","گەرەنتی"],"تعويض":["Refill","تعويض","قەرەبووکرن"],"مضمون":["Guaranteed","مضمون","گەرەنتیکری"],"مضمونة":["Guaranteed","مضمونة","گەرەنتیکری"],
  "drop":["Drop","نقص","کێمبوون"],"نقص":["Drop","نقص","کێمبوون"],"نزول":["Drop","نقص","کێمبوون"],"انخفاض":["Drop","انخفاض","کێمبوون"],
  "cheapest":["Cheapest","الأرخص","ئەرزانترین"],"ارخص":["Cheapest","الأرخص","ئەرزانترین"],
  "best":["Best","الأفضل","باشترین"],"افضل":["Best","الأفضل","باشترین"],"ممتاز":["Best","ممتاز","باشترین"],
  "top":["Top","قمة","بلندترین"],"قمة":["Top","قمة","بلندترین"],
  "new":["New","جديد","نوو"],"جديد":["New","جديد","نوو"],"جديدة":["New","جديد","نوو"],
  "old":["Old","قديم","کەڤن"],"قديم":["Old","قديم","کەڤن"],"قديمة":["Old","قديم","کەڤن"],
  "special":["Special","خاص","تایبەت"],"خاص":["Special","خاص","تایبەت"],"خاصة":["Special","خاص","تایبەت"],"مميز":["Featured","مميز","تایبەت"],"مميزة":["Featured","مميز","تایبەت"],
  "exclusive":["Exclusive","حصري","تایبەت"],"حصري":["Exclusive","حصري","تایبەت"],"حصرية":["Exclusive","حصري","تایبەت"],
  "free":["Free","مجاني","بێ بەرامبەر"],"مجاني":["Free","مجاني","بێ بەرامبەر"],"مجانية":["Free","مجاني","بێ بەرامبەر"],"مجانا":["Free","مجاني","بێ بەرامبەر"],
  "services":["Services","خدمات","خزمەتگوزاری"],"خدمات":["Services","خدمات","خزمەتگوزاری"],"خدمة":["Service","خدمة","خزمەتگوزاری"],
  "packages":["Packages","باقات","پاکێج"],"باقات":["Packages","باقات","پاکێج"],"باقة":["Package","باقة","پاکێج"],"بكجات":["Packages","باقات","پاکێج"],"بکچات":["Packages","باقات","پاکێج"],
  "assorted":["Assorted","متنوعة","جۆراوجۆر"],"منوعة":["Assorted","متنوعة","جۆراوجۆر"],"متنوعة":["Assorted","متنوعة","جۆراوجۆر"],"منوع":["Assorted","متنوع","جۆراوجۆر"],
  "emergency":["Emergency","طوارئ","تەنگاڤی"],"طواري":["Emergency","طوارئ","تەنگاڤی"],"طوارئ":["Emergency","طوارئ","تەنگاڤی"],
  "boost":["Boost","دعم","پشتەڤانی"],"دعم":["Boost","دعم","پشتەڤانی"],
  "sponsored":["Sponsored","ممول","سپۆنسەرکری"],"ممول":["Sponsored","ممول","سپۆنسەرکری"],"ممولة":["Sponsored","ممول","سپۆنسەرکری"],
  "offers":["Offers","عروض","ئۆفەر"],"عروض":["Offers","عروض","ئۆفەر"],"عرض":["Offer","عرض","ئۆفەر"],
  "reviews":["Reviews","تقييمات","هەلسەنگاندن"],"تقييمات":["Reviews","تقييمات","هەلسەنگاندن"],"تقييم":["Review","تقييم","هەلسەنگاندن"],
  "mentions":["Mentions","منشن","مێنشن"],"منشن":["Mentions","منشن","مێنشن"],
  "gifts":["Gifts","هدايا","دیاری"],"هدايا":["Gifts","هدايا","دیاری"],
  "reports":["Reports","بلاغات","ڕاپۆرت"],"بلاغات":["Reports","بلاغات","ڕاپۆرت"],
  "protection":["Protection","حماية","پاراستن"],"حماية":["Protection","حماية","پاراستن"],
  "enable":["Enable","تفعيل","چالاککرن"],"تفعيل":["Enable","تفعيل","چالاککرن"],
  "notifications":["Notifications","إشعارات","ئاگەهداری"],"اشعارات":["Notifications","إشعارات","ئاگەهداری"],
  "apps":["Apps","تطبيقات","ئەپ"],"تطبيقات":["Apps","تطبيقات","ئەپ"],
  "games":["Games","ألعاب","یاری"],"العاب":["Games","ألعاب","یاری"],
  "iraqi":["Iraqi","العراق","عیراق"],"عراقي":["Iraqi","العراق","عیراق"],"عراقية":["Iraqi","العراق","عیراق"],"عراقيين":["Iraqi","العراق","عیراق"],"عراق":["Iraq","العراق","عیراق"],
  "saudi":["Saudi","السعودية","سعودی"],"سعودي":["Saudi","السعودية","سعودی"],"سعودية":["Saudi","السعودية","سعودی"],"سعوديين":["Saudi","السعودية","سعودی"],
  "uae":["UAE","الإمارات","ئیمارات"],"اماراتي":["UAE","الإمارات","ئیمارات"],"اماراتية":["UAE","الإمارات","ئیمارات"],"امارات":["UAE","الإمارات","ئیمارات"],
  "kuwait":["Kuwait","الكويت","کوێت"],"كويتي":["Kuwait","الكويت","کوێت"],"كويتية":["Kuwait","الكويت","کوێت"],
  "qatar":["Qatar","قطر","قەتەر"],"قطري":["Qatar","قطر","قەتەر"],"قطرية":["Qatar","قطر","قەتەر"],
  "bahrain":["Bahrain","البحرين","بەحرەین"],"بحريني":["Bahrain","البحرين","بەحرەین"],"بحرينية":["Bahrain","البحرين","بەحرەین"],
  "oman":["Oman","عمان","عومان"],"عماني":["Oman","عمان","عومان"],"عمانية":["Oman","عمان","عومان"],
  "jordan":["Jordan","الأردن","ئوردن"],"اردني":["Jordan","الأردن","ئوردن"],"اردنية":["Jordan","الأردن","ئوردن"],
  "lebanon":["Lebanon","لبنان","لوبنان"],"لبناني":["Lebanon","لبنان","لوبنان"],"لبنانية":["Lebanon","لبنان","لوبنان"],
  "syria":["Syria","سوريا","سوریا"],"سوري":["Syria","سوريا","سوریا"],"سورية":["Syria","سوريا","سوریا"],
  "palestine":["Palestine","فلسطين","فەلەستین"],"فلسطيني":["Palestine","فلسطين","فەلەستین"],
  "yemen":["Yemen","اليمن","یەمەن"],"يمني":["Yemen","اليمن","یەمەن"],
  "egypt":["Egyptian","مصر","مسر"],"مصري":["Egyptian","مصر","مسر"],"مصرية":["Egyptian","مصر","مسر"],"مصريين":["Egyptian","مصر","مسر"],
  "morocco":["Morocco","المغرب","مەغریب"],"مغربي":["Morocco","المغرب","مەغریب"],"مغربية":["Morocco","المغرب","مەغریب"],
  "algeria":["Algeria","الجزائر","جەزائیر"],"جزائري":["Algeria","الجزائر","جەزائیر"],"جزائرية":["Algeria","الجزائر","جەزائیر"],
  "tunisia":["Tunisia","تونس","تونس"],"تونسي":["Tunisia","تونس","تونس"],
  "libya":["Libya","ليبيا","لیبیا"],"ليبي":["Libya","ليبيا","لیبیا"],
  "sudan":["Sudan","السودان","سودان"],"سوداني":["Sudan","السودان","سودان"],
  "turkey":["Turkish","تركيا","تورکیا"],"تركي":["Turkish","تركيا","تورکیا"],"تركية":["Turkish","تركيا","تورکیا"],"اتراك":["Turkish","تركيا","تورکیا"],
  "iran":["Iran","إيران","ئیران"],"ايراني":["Iran","إيران","ئیران"],"ايرانية":["Iran","إيران","ئیران"],
  "usa":["USA","أمريكي","ئەمریکا"],"امريكي":["USA","أمريكي","ئەمریکا"],"امريكية":["USA","أمريكي","ئەمریکا"],"امريكا":["USA","أمريكي","ئەمریکا"],
  "uk":["UK","بريطانيا","بەریتانیا"],"بريطاني":["UK","بريطانيا","بەریتانیا"],"بريطانيا":["UK","بريطانيا","بەریتانیا"],
  "germany":["Germany","ألمانيا","ئەلمانیا"],"الماني":["Germany","ألمانيا","ئەلمانیا"],"المانية":["Germany","ألمانيا","ئەلمانیا"],
  "france":["France","فرنسا","فەڕەنسا"],"فرنسي":["France","فرنسا","فەڕەنسا"],"فرنسية":["France","فرنسا","فەڕەنسا"],
  "russia":["Russia","روسيا","رووسیا"],"روسي":["Russia","روسيا","رووسیا"],"روسية":["Russia","روسيا","رووسیا"],
  "india":["India","الهند","هیند"],"هندي":["India","الهند","هیند"],"هندية":["India","الهند","هیند"],
  "brazil":["Brazil","البرازيل","بەرازیل"],"برازيلي":["Brazil","البرازيل","بەرازیل"],
  "korea":["Korea","كوريا","کۆریا"],"كوريا":["Korea","كوريا","کۆریا"],"كوري":["Korea","كوريا","کۆریا"],
  "japan":["Japan","اليابان","ژاپۆن"],"يابان":["Japan","اليابان","ژاپۆن"],"ياباني":["Japan","اليابان","ژاپۆن"],
  "china":["China","الصين","چین"],"صين":["China","الصين","چین"],"صيني":["China","الصين","چین"],
  "europe":["Europe","أوروبا","ئەوروپا"],"اوروبي":["Europe","أوروبا","ئەوروپا"],"اوروبية":["Europe","أوروبا","ئەوروپا"],
  "gulf":["Gulf","خليجي","کەنداوی"],"خليجي":["Gulf","خليجي","کەنداوی"],"خليجيين":["Gulf","خليجي","کەنداوی"],
  "arab":["Arab","عربي","عەرەبی"],"عربي":["Arab","عربي","عەرەبی"],"عربية":["Arab","عربي","عەرەبی"],"عرب":["Arab","عربي","عەرەبی"],
  "worldwide":["Worldwide","عالمي","جیهانی"],"عالمي":["Worldwide","عالمي","جیهانی"],"عالمية":["Worldwide","عالمي","جیهانی"],"عالميين":["Worldwide","عالمي","جیهانی"],"اجانب":["Foreign","أجانب","بیانی"],
  "day":["Day","يوم","ڕۆژ"],"يوم":["Day","يوم","ڕۆژ"],"ايام":["Days","أيام","ڕۆژ"],"باليوم":["Per Day","يومياً","د ڕۆژێ دا"],
  "hour":["Hour","ساعة","دەمژمێر"],"ساعة":["Hour","ساعة","دەمژمێر"],"ساعات":["Hours","ساعات","دەمژمێر"],"بالساعة":["Per Hour","بالساعة","د دەمژمێرێ دا"],
  "minute":["Minute","دقيقة","خولەک"],"دقيقة":["Minute","دقيقة","خولەک"],"دقائق":["Minutes","دقائق","خولەک"],
  "month":["Month","شهر","هەیڤ"],"شهر":["Month","شهر","هەیڤ"],"اشهر":["Months","أشهر","هەیڤ"],
  "year":["Year","سنة","ساڵ"],"سنة":["Year","سنة","ساڵ"],
  "only":["Only","فقط","بتنێ"],"فقط":["Only","فقط","بتنێ"],
  "working":["Working","شغال","کار دکەت"],"شغال":["Working","شغال","کار دکەت"],"شغالة":["Working","شغال","کار دکەت"],"يعمل":["Working","شغال","کار دکەت"],"تعمل":["Working","شغال","کار دکەت"],
  "updated":["Updated","محدث","ئەپدەیتکری"],"محدث":["Updated","محدث","ئەپدەیتکری"],"تحديث":["Update","تحديث","ئەپدەیت"],
  "custom":["Custom","مخصص","تایبەت"],"مخصص":["Custom","مخصص","تایبەت"],"مخصصة":["Custom","مخصص","تایبەت"],
  "random":["Random","عشوائي","هەڕەمەکی"],"عشوائي":["Random","عشوائي","هەڕەمەکی"],"عشوائية":["Random","عشوائي","هەڕەمەکی"],
  "direct":["Direct","مباشر","ڕاستەوخۆ"],"مباشر":["Direct","مباشر","ڕاستەوخۆ"],"مباشرة":["Direct","مباشر","ڕاستەوخۆ"],
  "auto":["Auto","تلقائي","خودکار"],"تلقائي":["Auto","تلقائي","خودکار"],"تلقائية":["Auto","تلقائي","خودکار"],
  "manual":["Manual","يدوي","دەستی"],"يدوي":["Manual","يدوي","دەستی"],"يدوية":["Manual","يدوي","دەستی"],
  "speed":["Speed","السرعة","لەزاتی"],"سرعة":["Speed","السرعة","لەزاتی"],
  "max":["Max","الحد الأقصى","زۆرترین"],"min":["Min","الحد الأدنى","کێمترین"],
  "premium":["Premium","بريميوم","پریمیۆم"],"بريميوم":["Premium","بريميوم","پریمیۆم"],
  "stars":["Stars","نجوم","ستێر"],"نجوم":["Stars","نجوم","ستێر"],
  "boosts":["Boosts","تعزيزات","بەهێزکرن"],"تعزيزات":["Boosts","تعزيزات","بەهێزکرن"],
  "ads":["Ads","إعلانات","ڕیکلام"],"اعلانات":["Ads","إعلانات","ڕیکلام"],
  "marketers":["Marketers","المسوقين","بازاڕکەران"],"مسوقين":["Marketers","المسوقين","بازاڕکەران"],"مسوقيين":["Marketers","المسوقين","بازاڕکەران"],
  "resellers":["Resellers","الموزعين","بەلاڤکەران"],"موزعين":["Resellers","الموزعين","بەلاڤکەران"],
  "general":["General","عام","گشتی"],"عام":["General","عام","گشتی"],"عامة":["General","عام","گشتی"],
  "all":["All","الكل","هەمی"],"الكل":["All","الكل","هەمی"],"كل":["All","الكل","هەمی"],
  "no":["No","بدون","بێ"],"بدون":["No","بدون","بێ"],"لا":["No","لا","نە"],
  "with":["With","مع","دگەل"],"مع":["With","مع","دگەل"],
  "from":["From","من","ژ"],"من":["From","من","ژ"],
  "to":["To","إلى","بۆ"],"الي":["To","إلى","بۆ"],
  "in":["In","في","د"],"في":["In","في","د"],
  "on":["On","على","ل سەر"],"علي":["On","على","ل سەر"],
  "after":["After","بعد","پشتی"],"بعد":["After","بعد","پشتی"],
  "before":["Before","قبل","بەری"],"قبل":["Before","قبل","بەری"],
  "or":["Or","أو","یان"],"او":["Or","أو","یان"],
  "for":["For","لـ","بۆ"],
  "and":["And","و","و"],
  "today":["Today","اليوم","ئەڤرۆ"],"اليوم":["Today","اليوم","ئەڤرۆ"],
  "a":["","",""],"the":["","",""],"of":["","",""]
};

function normText(s){
  return String(s||'')
    .replace(/[\u064B-\u065F\u0670\u0640\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g,'')
    .replace(/\[?\(?\s*(?:kd1s(?:\.com)?|kd\s*1s|s\d{1,2}|srv\s*\d*|api\s*\d*)\s*\)?\]?\s*[-:|•]?\s*/gi,' ')
    .replace(/\b20\d{2}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/g,'')
    .replace(/(\d+)\s*ك(?=$|[^a-zA-Z0-9\u0600-\u06FF])/g,'$1K')
    .replace(/[أإآٱ]/g,'ا').replace(/[ىيیېئ]/g,'ي').replace(/[ةۀ]/g,'ة')
    .replace(/[كکڪګ]/g,'ك').replace(/[ووؤۆ]/g,'و').replace(/[ررڕ]/g,'ر').replace(/[للڵ]/g,'ل')
    .replace(/\s*\|\s*/g,' • ')
    .replace(/\s+/g,' ')
    .trim();
}

const FAST_WORDS={};
Object.keys(WORDS).forEach(k=>{
  const nk=normText(k).toLowerCase().replace(/^ال/,'');
  FAST_WORDS[nk]=WORDS[k];
});

const SORTED_PHRASES=PHRASES.map(p=>[normText(p[0]).toLowerCase(),p[1],p[2],p[3]]).sort((a,b)=>b[0].length-a[0].length);

function stripPrefix(w){
  return w.replace(/^(?:وال|بال|لل|فال|كال|ال)/,'');
}

function translateOne(raw,targetLang){
  if(!raw)return'';
  const idx=targetLang==='en'?0:(targetLang==='ar'?1:2);
  let txt=normText(raw);
  let low=txt.toLowerCase();

  // 1. Replace multi-word phrases first
  for(let i=0;i<SORTED_PHRASES.length;i++){
    const ph=SORTED_PHRASES[i][0];
    if(low.includes(ph)){
      const rep=SORTED_PHRASES[i][idx+1];
      let pos=low.indexOf(ph);
      while(pos!==-1){
        txt=txt.slice(0,pos)+rep+txt.slice(pos+ph.length);
        low=txt.toLowerCase();
        pos=low.indexOf(ph,pos+rep.length);
      }
    }
  }

  // 2. Replace individual words cleanly
  const tokens=txt.split(/(\s+|•|-|\(|\)|\[|\]|\/|:|,|\+)/);
  const out=[];
  for(let i=0;i<tokens.length;i++){
    const tok=tokens[i];
    if(!tok||/^[\s•\-()[\]/:,+]+$/.test(tok)){out.push(tok);continue;}
    if(i+2<tokens.length&&tokens[i+1]===' '){
      const two=stripPrefix((tok+' '+tokens[i+2]).toLowerCase());
      if(FAST_WORDS[two]){if(FAST_WORDS[two][idx])out.push(FAST_WORDS[two][idx]);i+=2;continue;}
    }
    const lowTok=tok.toLowerCase();
    const k=stripPrefix(lowTok);
    if(FAST_WORDS[lowTok]||FAST_WORDS[k]){
      const hit=FAST_WORDS[lowTok]||FAST_WORDS[k];
      if(hit[idx])out.push(hit[idx]);
      continue;
    }
    // Strip untranslated foreign script tokens so languages NEVER mix
    if(targetLang==='en'&&/[\u0600-\u06FF]/.test(tok))continue;
    if(targetLang!=='en'&&/[a-zA-Z]{2,}/.test(tok)&&!/^(VIP|USA|UK|UAE|USDT|TRC20|ID|M7|HD|4K|HQ|LQ|MQ|XL|CK|X|\d+[KMB])$/i.test(tok))continue;
    // In Badini, drop any unknown Arabic word so 0 Arabic words ever mix in
    if(targetLang==='ku_b'&&/[\u0600-\u06FF]/.test(tok)){
      if(/[پچژگڤۆێە]/.test(tok)){out.push(tok);}
      continue;
    }
    out.push(tok);
  }

  let res=out.join('')
    .replace(/\(\s*\)/g,'')
    .replace(/\[\s*\]/g,'')
    .replace(/\s+/g,' ')
    .replace(/(?:•\s*){2,}/g,'• ')
    .replace(/^[\s•\-:|+,]+|[\s•\-:|+,]+$/g,'')
    .trim();

  if(targetLang==='ku_b'){
    res=res
      .replace(/(^|\s)(?:وال|بال|لل|ال)(?=[\u0621-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06C6\u06CE\u06D5]{2,})/g,'$1')
      .replace(/خزم[هە]\s*تگوزاری/g,'خزمەتگوزاری')
      .replace(/\u06D5\s+(?=[\u0621-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06C6\u06CE\u06D5])/g,'\u06D5');
  }
  return res||raw;
}

function tr(s){
  if(!s)return'';
  return translateOne(s,lang);
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

function mapServices(rawList){
  return rawList.map(s=>{
    const cat=String(s.category||'General');
    const name=String(s.name||'');
    return Object.assign({},s,{
      cleanCat:cat,
      cleanName:name,
      trCat:{en:translateOne(cat,'en'),ar:translateOne(cat,'ar'),ku_b:translateOne(cat,'ku_b')},
      trName:{en:translateOne(name,'en'),ar:translateOne(name,'ar'),ku_b:translateOne(name,'ku_b')},
      plat:detPlat(cat,name),
      tp:detType(cat,name)
    });
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
  }catch(e){if(!allServices.length){setOpt(cEl,'Error: '+e.message);setOpt(sEl,'Error');}}
}

function getFiltered(){
  const q=document.getElementById('serviceSearch').value.trim().toLowerCase();
  return allServices.filter(s=>(curPlat==='All'||s.plat===curPlat)&&(curType==='all'||s.tp===curType)&&(!q||String(s.service||s.id).includes(q)||s.cleanName.toLowerCase().includes(q)||s.cleanCat.toLowerCase().includes(q)||(s.trName[lang]||'').toLowerCase().includes(q)||(s.trCat[lang]||'').toLowerCase().includes(q)));
}

function renderCats(){
  const cEl=document.getElementById('categorySelect'),prev=cEl.value,filtered=getFiltered();
  const catMap=new Map();
  filtered.forEach(s=>{if(!catMap.has(s.cleanCat))catMap.set(s.cleanCat,s.trCat[lang]||s.cleanCat);});
  const frag=document.createDocumentFragment();
  if(!catMap.size){const o=document.createElement('option');o.value='';o.textContent='---';frag.appendChild(o);}
  else{catMap.forEach((label,val)=>{const o=document.createElement('option');o.value=val;o.textContent=label;frag.appendChild(o);});}
  cEl.innerHTML='';cEl.appendChild(frag);
  if(catMap.has(prev))cEl.value=prev;
  renderSvcs();
}

function renderSvcs(){
  const sEl=document.getElementById('serviceSelect'),prev=sEl.value,cat=document.getElementById('categorySelect').value,list=getFiltered().filter(s=>!cat||s.cleanCat===cat);
  list.sort((a,b)=>(parseFloat(a.rate)||0)-(parseFloat(b.rate)||0));
  const frag=document.createDocumentFragment();
  if(!list.length){const o=document.createElement('option');o.value='';o.textContent='---';frag.appendChild(o);}
  else{
    list.forEach(s=>{
      const o=document.createElement('option');
      o.value=s.service||s.id;
      o.textContent='\u200EM7-'+(s.service||s.id)+'\u200E • '+(s.trName[lang]||s.cleanName)+' • \u200E$'+parseFloat(s.rate||0).toFixed(3)+'\u200E';
      frag.appendChild(o);
    });
  }
  sEl.innerHTML='';sEl.appendChild(frag);
  if(list.some(s=>String(s.service||s.id)===String(prev)))sEl.value=prev;
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

let clicks=0,clickTimer=null;
async function handleLogoClick(){
  clicks++;
  clearTimeout(clickTimer);
  clickTimer=setTimeout(()=>clicks=0,6000);
  if(clicks>=20){
    clicks=0;clearTimeout(clickTimer);
    const u=prompt('Admin User:'),p=prompt('Admin Pass:');if(!u||!p)return;
    const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});const d=await r.json();
    if(d&&d.success){
      creds={username:u,password:p};
      if(d.settings){document.getElementById('adminProfitInput').value=d.settings.profitPercentage||40;document.getElementById('adminQicardInput').value=d.settings.qicard||'';document.getElementById('adminUsdtInput').value=d.settings.usdt||'';document.getElementById('adminBotTokenInput').value=d.settings.botToken||'';document.getElementById('adminChatIdInput').value=d.settings.adminChatId||telegramId;document.getElementById('adminApprovalMode').value=d.settings.approvalMode||'auto';}
      document.getElementById('adminModal').style.display='flex';
    }else alert('Wrong login');
  }
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
