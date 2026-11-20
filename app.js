let allServices=[],curPlat='Instagram',curType='all',curSvc=null,userBal=0,creds={username:'',password:''};
let lang='ar';
try{
  const saved=localStorage.getItem('m7_lang');
  lang=(saved==='ar'||saved==='en'||saved==='ku_b')?saved:'ar';
  localStorage.setItem('m7_lang',lang);
  localStorage.removeItem('m7_tr_pure_v1');
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

// Lightweight ultra-fast lookup dictionary: [English, Arabic, Kurdish Badini]
const LEX={
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
  "followers":["Followers","متابعين","فۆڵۆوەرز"],"متابعين":["Followers","متابعين","فۆڵۆوەرز"],"متابع":["Followers","متابعين","فۆڵۆوەرز"],"المتابعين":["Followers","متابعين","فۆڵۆوەرز"],
  "subscribers":["Subscribers","مشتركين","سەبسکرایب"],"مشتركين":["Subscribers","مشتركين","سەبسکرایب"],"مشترك":["Subscribers","مشتركين","سەبسکرایب"],
  "members":["Members","أعضاء","ئەندام"],"اعضاء":["Members","أعضاء","ئەندام"],"أعضاء":["Members","أعضاء","ئەندام"],"عضو":["Members","أعضاء","ئەندام"],
  "likes":["Likes","لايكات","لایک"],"لايكات":["Likes","لايكات","لایک"],"لايك":["Likes","لايكات","لایک"],"اعجابات":["Likes","لايكات","لایک"],"اعجاب":["Likes","لايكات","لایک"],
  "views":["Views","مشاهدات","بینین"],"مشاهدات":["Views","مشاهدات","بینین"],"مشاهدة":["Views","مشاهدات","بینین"],
  "comments":["Comments","تعليقات","کۆمێنت"],"تعليقات":["Comments","تعليقات","کۆمێنت"],"تعليق":["Comments","تعليقات","کۆمێنت"],"كومنتات":["Comments","تعليقات","کۆمێنت"],"كومنت":["Comments","تعليقات","کۆمێنت"],
  "shares":["Shares","مشاركات","بەلاڤکرن"],"مشاركات":["Shares","مشاركات","بەلاڤکرن"],"مشاركة":["Shares","مشاركات","بەلاڤکرن"],"شير":["Shares","مشاركات","بەلاڤکرن"],
  "saves":["Saves","حفظ","پاشەکەوتکرن"],"حفظ":["Saves","حفظ","پاشەکەوتکرن"],"تخزين":["Saves","حفظ","پاشەکەوتکرن"],
  "reactions":["Reactions","تفاعلات","کارڤەدان"],"تفاعلات":["Reactions","تفاعلات","کارڤەدان"],"تفاعل":["Reactions","تفاعلات","کارڤەدان"],"رياكشنات":["Reactions","تفاعلات","کارڤەدان"],"رياكشن":["Reactions","تفاعلات","کارڤەدان"],
  "stories":["Stories","ستوري","ستۆری"],"ستوري":["Stories","ستوري","ستۆری"],"استوري":["Stories","ستوري","ستۆری"],"قصص":["Stories","ستوري","ستۆری"],
  "reels":["Reels","ريلز","ڕیلز"],"ريلز":["Reels","ريلز","ڕیلز"],"ريل":["Reels","ريلز","ڕیلز"],
  "shorts":["Shorts","شورتس","شۆرتس"],"شورتس":["Shorts","شورتس","شۆرتس"],
  "videos":["Videos","فيديوهات","ڤیدیۆ"],"فيديوهات":["Videos","فيديوهات","ڤیدیۆ"],"فيديو":["Videos","فيديوهات","ڤیدیۆ"],"مقاطع":["Videos","فيديوهات","ڤیدیۆ"],
  "posts":["Posts","منشورات","پۆست"],"منشورات":["Posts","منشورات","پۆست"],"منشور":["Posts","منشورات","پۆست"],"بوستات":["Posts","منشورات","پۆست"],"بوست":["Posts","منشورات","پۆست"],
  "live":["Live Stream","بث مباشر","لایڤ"],"بث مباشر":["Live Stream","بث مباشر","لایڤ"],"لايف":["Live Stream","بث مباشر","لایڤ"],"بث":["Live Stream","بث مباشر","لایڤ"],
  "impressions":["Impressions","انطباعات","دەرکەفتن"],"انطباعات":["Impressions","انطباعات","دەرکەفتن"],
  "reach":["Reach","وصول","گەهشتن"],"وصول":["Reach","وصول","گەهشتن"],
  "polls":["Polls","تصويتات","دەنگدان"],"تصويتات":["Polls","تصويتات","دەنگدان"],"تصويت":["Polls","تصويتات","دەنگدان"],"استطلاعات":["Polls","تصويتات","دەنگدان"],
  "visits":["Visits","زيارات","سەرەدان"],"زيارات":["Visits","زيارات","سەرەدان"],"زيارة":["Visits","زيارات","سەرەدان"],"زوار":["Visitors","زوار","سەرەدانکەر"],
  "traffic":["Traffic","زيارات","سەرەدان"],"ترافيك":["Traffic","زيارات","سەرەدان"],
  "explore":["Explore","إكسبلور","ئێکسپلۆر"],"اكسبلور":["Explore","إكسبلور","ئێکسپلۆر"],
  "channel":["Channel","قناة","کەنال"],"قناة":["Channel","قناة","کەنال"],"قنوات":["Channels","قنوات","کەنال"],
  "group":["Group","مجموعة","گرووپ"],"مجموعة":["Group","مجموعة","گرووپ"],"مجموعات":["Groups","مجموعات","گرووپ"],"جروب":["Group","مجموعة","گرووپ"],"كروب":["Group","مجموعة","گرووپ"],
  "page":["Page","صفحة","پەیج"],"صفحة":["Page","صفحة","پەیج"],"صفحات":["Pages","صفحات","پەیج"],"بيج":["Page","صفحة","پەیج"],
  "profile":["Profile","ملف شخصي","پڕۆفایل"],"بروفايل":["Profile","ملف شخصي","پڕۆفایل"],"ملف شخصي":["Profile","ملف شخصي","پڕۆفایل"],
  "account":["Account","حساب","هەژمار"],"حساب":["Account","حساب","هەژمار"],"حسابات":["Accounts","حسابات","هەژمار"],
  "real":["Real","حقيقي","ڕاستەقینە"],"حقيقي":["Real","حقيقي","ڕاستەقینە"],"حقيقية":["Real","حقيقي","ڕاستەقینە"],"حقيقيين":["Real","حقيقي","ڕاستەقینە"],
  "active":["Active","نشط","چالاک"],"نشط":["Active","نشط","چالاک"],"نشطين":["Active","نشط","چالاک"],"متفاعلين":["Active","نشط","چالاک"],
  "bots":["Bots","وهمي","بۆت"],"وهمي":["Bots","وهمي","بۆت"],"وهمية":["Bots","وهمي","بۆت"],"وهميين":["Bots","وهمي","بۆت"],"بوتات":["Bots","وهمي","بۆت"],"بوت":["Bots","وهمي","بۆت"],
  "mixed":["Mixed","مختلط","تێکەل"],"مكس":["Mixed","مختلط","تێکەل"],"مختلط":["Mixed","مختلط","تێکەل"],"مختلطة":["Mixed","مختلط","تێکەل"],
  "female":["Female","بنات","کچ"],"بنات":["Female","بنات","کچ"],"نساء":["Female","بنات","کچ"],"اناث":["Female","بنات","کچ"],
  "male":["Male","شباب","کوڕ"],"شباب":["Male","شباب","کوڕ"],"رجال":["Male","شباب","کوڕ"],"ذكور":["Male","شباب","کوڕ"],
  "verified":["Verified","موثق","پشتڕاستکری"],"موثق":["Verified","موثق","پشتڕاستکری"],"موثقة":["Verified","موثق","پشتڕاستکری"],"توثيق":["Verification","توثيق","پشتڕاستکرن"],
  "instant":["Instant","فوري","ئێکسەر"],"فوري":["Instant","فوري","ئێکسەر"],"فورية":["Instant","فوري","ئێکسەر"],"بدء فوري":["Instant Start","بدء فوري","دەستپێکرنا ئێکسەر"],
  "fast":["Fast","سريع","بلەز"],"سريع":["Fast","سريع","بلەز"],"سريعة":["Fast","سريع","بلەز"],"سريع جدا":["Super Fast","سريع جداً","گەلەک بلەز"],
  "slow":["Slow","بطيء","هێدی"],"بطيء":["Slow","بطيء","هێدی"],"بطيئة":["Slow","بطيء","هێدی"],
  "stable":["Stable","ثابت","جێگیر"],"ثابت":["Stable","ثابت","جێگیر"],"ثابتة":["Stable","ثابت","جێگیر"],"مستقر":["Stable","مستقر","جێگیر"],
  "high quality":["High Quality","جودة عالية","کوالێتی بلند"],"جودة عالية":["High Quality","جودة عالية","کوالێتی بلند"],
  "medium quality":["Medium Quality","جودة متوسطة","کوالێتی ناڤنجی"],"جودة متوسطة":["Medium Quality","جودة متوسطة","کوالێتی ناڤنجی"],
  "low quality":["Low Quality","جودة منخفضة","کوالێتی نزم"],"جودة منخفضة":["Low Quality","جودة منخفضة","کوالێتی نزم"],
  "quality":["Quality","جودة","کوالێتی"],"جودة":["Quality","جودة","کوالێتی"],"عالية":["High","عالية","بلند"],"متوسطة":["Medium","متوسطة","ناڤنجی"],"منخفضة":["Low","منخفضة","نزم"],
  "no refill":["No Refill","بدون ضمان","بێ گەرەنتی"],"بدون ضمان":["No Refill","بدون ضمان","بێ گەرەنتی"],"بدون تعويض":["No Refill","بدون ضمان","بێ گەرەنتی"],"لا يوجد ضمان":["No Refill","بدون ضمان","بێ گەرەنتی"],
  "refill":["Refill","ضمان","گەرەنتی"],"ضمان":["Refill","ضمان","گەرەنتی"],"تعويض":["Refill","تعويض","قەرەبووکرن"],"مضمون":["Guaranteed","مضمون","گەرەنتیکری"],
  "lifetime":["Lifetime","مدى الحياة","هەتاهەتایی"],"مدى الحياة":["Lifetime","مدى الحياة","هەتاهەتایی"],"مدي حياة":["Lifetime","مدى الحياة","هەتاهەتایی"],
  "non drop":["Non-Drop","بدون نقص","بێ کێمبوون"],"no drop":["Non-Drop","بدون نقص","بێ کێمبوون"],"بدون نقص":["Non-Drop","بدون نقص","بێ کێمبوون"],"بدون نزول":["Non-Drop","بدون نقص","بێ کێمبوون"],"عدم نقص":["Non-Drop","بدون نقص","بێ کێمبوون"],
  "low drop":["Low Drop","نقص قليل","کێمبوونا کێم"],"نقص قليل":["Low Drop","نقص قليل","کێمبوونا کێم"],"نزول قليل":["Low Drop","نقص قليل","کێمبوونا کێم"],
  "drop":["Drop","نقص","کێمبوون"],"نقص":["Drop","نقص","کێمبوون"],"نزول":["Drop","نقص","کێمبوون"],
  "cheapest":["Cheapest","الأرخص","ئەرزانترین"],"ارخص":["Cheapest","الأرخص","ئەرزانترین"],
  "best":["Best","الأفضل","باشترین"],"افضل":["Best","الأفضل","باشترین"],"ممتاز":["Best","ممتاز","باشترین"],
  "new":["New","جديد","نوو"],"جديد":["New","جديد","نوو"],"جديدة":["New","جديد","نوو"],
  "old":["Old","قديم","کەڤن"],"قديم":["Old","قديم","کەڤن"],"قديمة":["Old","قديم","کەڤن"],
  "special":["Special","خاص","تایبەت"],"خاص":["Special","خاص","تایبەت"],"خاصة":["Special","خاص","تایبەت"],"مميز":["Featured","مميز","تایبەت"],"مميزة":["Featured","مميز","تایبەت"],
  "free":["Free","مجاني","بێ بەرامبەر"],"مجاني":["Free","مجاني","بێ بەرامبەر"],"مجانية":["Free","مجاني","بێ بەرامبەر"],"مجانا":["Free","مجاني","بێ بەرامبەر"],
  "services":["Services","خدمات","خزمەتگوزاری"],"خدمات":["Services","خدمات","خزمەتگوزاری"],"خدمة":["Service","خدمة","خزمەتگوزاری"],
  "packages":["Packages","باقات","پاکێج"],"باقات":["Packages","باقات","پاکێج"],"بكجات":["Packages","باقات","پاکێج"],"بکچات":["Packages","باقات","پاکێج"],
  "offers":["Offers","عروض","ئۆفەر"],"عروض":["Offers","عروض","ئۆفەر"],"عرض":["Offer","عرض","ئۆفەر"],
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
  "europe":["Europe","أوروبا","ئەوروپا"],"اوروبي":["Europe","أوروبا","ئەوروپا"],"اوروبية":["Europe","أوروبا","ئەوروپا"],
  "gulf":["Gulf","خليجي","کەنداوی"],"خليجي":["Gulf","خليجي","کەنداوی"],"خليجيين":["Gulf","خليجي","کەنداوی"],
  "arab":["Arab","عربي","عەرەبی"],"عربي":["Arab","عربي","عەرەبی"],"عربية":["Arab","عربي","عەرەبی"],"عرب":["Arab","عربي","عەرەبی"],
  "worldwide":["Worldwide","عالمي","جیهانی"],"عالمي":["Worldwide","عالمي","جیهانی"],"عالمية":["Worldwide","عالمي","جیهانی"],"عالميين":["Worldwide","عالمي","جیهانی"],"اجانب":["Worldwide","عالمي","جیهانی"],
  "day":["Day","يوم","ڕۆژ"],"يوم":["Day","يوم","ڕۆژ"],"ايام":["Days","أيام","ڕۆژ"],
  "hour":["Hour","ساعة","دەمژمێر"],"ساعة":["Hour","ساعة","دەمژمێر"],"ساعات":["Hours","ساعات","دەمژمێر"],
  "minute":["Minute","دقيقة","خولەک"],"دقيقة":["Minute","دقيقة","خولەک"],"دقائق":["Minutes","دقائق","خولەک"],
  "month":["Month","شهر","هەیڤ"],"شهر":["Month","شهر","هەیڤ"],"اشهر":["Months","أشهر","هەیڤ"],
  "year":["Year","سنة","ساڵ"],"سنة":["Year","سنة","ساڵ"],
  "only":["Only","فقط","بتنێ"],"فقط":["Only","فقط","بتنێ"],
  "working":["Working","شغال","کار دکەت"],"شغال":["Working","شغال","کار دکەت"],"يعمل":["Working","شغال","کار دکەت"],"تعمل":["Working","شغال","کار دکەت"],
  "updated":["Updated","محدث","نووکری"],"محدث":["Updated","محدث","نووکری"],"تحديث":["Update","تحديث","نووکرن"],
  "custom":["Custom","مخصص","تایبەت"],"مخصص":["Custom","مخصص","تایبەت"],"مخصصة":["Custom","مخصص","تایبەت"],
  "random":["Random","عشوائي","هەڕەمەکی"],"عشوائي":["Random","عشوائي","هەڕەمەکی"],"عشوائية":["Random","عشوائي","هەڕەمەکی"],
  "direct":["Direct","مباشر","ڕاستەوخۆ"],"مباشر":["Direct","مباشر","ڕاستەوخۆ"],"مباشرة":["Direct","مباشر","ڕاستەوخۆ"],
  "auto":["Auto","تلقائي","خودکار"],"تلقائي":["Auto","تلقائي","خودکار"],"تلقائية":["Auto","تلقائي","خودکار"],
  "speed":["Speed","السرعة","لەزاتی"],"سرعة":["Speed","السرعة","لەزاتی"],
  "max":["Max","الحد الأقصى","زۆرترین"],"min":["Min","الحد الأدنى","کێمترین"],
  "per day":["Per Day","يومياً","د ڕۆژێ دا"],"باليوم":["Per Day","يومياً","د ڕۆژێ دا"],
  "per hour":["Per Hour","بالساعة","د دەمژمێرێ دا"],"بالساعة":["Per Hour","بالساعة","د دەمژمێرێ دا"],
  "premium":["Premium","بريميوم","پریمیۆم"],"بريميوم":["Premium","بريميوم","پریمیۆم"],
  "stars":["Stars","نجوم","ستێر"],"نجوم":["Stars","نجوم","ستێر"],
  "boosts":["Boosts","تعزيزات","بەهێزکرن"],"تعزيزات":["Boosts","تعزيزات","بەهێزکرن"],
  "monetization":["Monetization","تحقيق الربح","چالاککرنا قازانجی"],"تحقيق ربح":["Monetization","تحقيق الربح","چالاککرنا قازانجی"],
  "sponsored":["Sponsored","ممول","سپۆنسەرکری"],"ممول":["Sponsored","ممول","سپۆنسەرکری"],"ممولة":["Sponsored","ممول","سپۆنسەرکری"],
  "ads":["Ads","إعلانات","ڕیکلام"],"اعلانات":["Ads","إعلانات","ڕیکلام"],
  "marketers":["Marketers","المسوقين","بازاڕکەران"],"مسوقين":["Marketers","المسوقين","بازاڕکەران"],"مسوقيين":["Marketers","المسوقين","بازاڕکەران"],
  "resellers":["Resellers","الموزعين","بەلاڤکەران"],"موزعين":["Resellers","الموزعين","بەلاڤکەران"],
  "general":["General","عام","گشتی"],"عام":["General","عام","گشتی"],"عامة":["General","عام","گشتی"],
  "all":["All","الكل","هەمی"],"الكل":["All","الكل","هەمی"],"كل":["All","الكل","هەمی"]
};

function normKey(w){
  return w.toLowerCase()
    .replace(/[أإآٱ]/g,'ا').replace(/[ىيیېئ]/g,'ي').replace(/[ةۀ]/g,'ة')
    .replace(/[كکڪګ]/g,'ك').replace(/[ووؤۆ]/g,'و').replace(/[ررڕ]/g,'ر').replace(/[للڵ]/g,'ل')
    .replace(/^ال/,'').trim();
}

const FAST_MAP={};
Object.keys(LEX).forEach(k=>{FAST_MAP[normKey(k)]=LEX[k];});

function scrubM7(raw){
  return String(raw||'')
    .replace(/[\u064B-\u065F\u0670\u0640\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g,'')
    .replace(/\[?\(?\s*(?:kd1s(?:\.com)?|kd\s*1s|s\d{1,2}|srv\s*\d*|api\s*\d*)\s*\)?\]?\s*[-:|•]?\s*/gi,' ')
    .replace(/\b20\d{2}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/g,'')
    .replace(/(\d+)\s*ك(?=$|[^a-zA-Z0-9\u0600-\u06FF])/g,'$1K')
    .replace(/\s+/g,' ')
    .trim();
}

// Instant O(1) dictionary translator (zero lag, zero regex freezing)
function tr(s){
  if(!s)return s;
  const idx=lang==='en'?0:(lang==='ar'?1:2);
  let txt=scrubM7(s).replace(/\s*\|\s*/g,' • ');
  // Normalize known warning phrases cleanly
  txt=txt
    .replace(/طفي زر مراجعة المتابعين قبل الطلب/g,idx===0?'Turn off follower review before ordering':(idx===1?'أوقف زر مراجعة المتابعين قبل الطلب':'دوگمەیا پێداچوونا فۆڵۆوەران بگرە بەری داواکاریێ'))
    .replace(/اذا طلبت و الزر مفعل ف لا نستطيع اصلاح طلبك/g,idx===0?'Cannot fix if review is active':(idx===1?'لا يمكن الإصلاح إذا كان الزر مفعلاً':'نەشێین چاک بکەین ئەگەر دوگمە چالاک بیت'))
    .replace(/يجب ان يكون الحساب عام/g,idx===0?'Account must be public':(idx===1?'يجب أن يكون الحساب عاماً':'پێدڤییە هەژمار یا گشتی بیت'));

  // Token-level instant replacement
  const tokens=txt.split(/(\s+|•|-|\(|\)|\[|\]|\/|:)/);
  const out=[];
  for(let i=0;i<tokens.length;i++){
    const tok=tokens[i];
    if(!tok||/^[\s•\-()[\]/:]+$/.test(tok)){out.push(tok);continue;}
    // Check 2-word phrase first
    if(i+2<tokens.length&&tokens[i+1]===' '){
      const two=normKey(tok+' '+tokens[i+2]);
      if(FAST_MAP[two]){out.push(FAST_MAP[two][idx]);i+=2;continue;}
    }
    const nk=normKey(tok);
    if(FAST_MAP[nk]){out.push(FAST_MAP[nk][idx]);continue;}
    // Convert standalone Arabic prepositions/numbers cleanly
    if(nk==='من'){out.push(idx===0?'From':(idx===1?'من':'ژ'));continue;}
    if(nk==='الي'){out.push(idx===0?'to':(idx===1?'إلى':'بۆ'));continue;}
    if(nk==='بدون'){out.push(idx===0?'No':(idx===1?'بدون':'بێ'));continue;}
    if(nk==='مع'){out.push(idx===0?'With':(idx===1?'مع':'دگەل'));continue;}
    out.push(tok);
  }
  return out.join('')
    .replace(/(?:•\s*){2,}/g,'• ')
    .replace(/^[\s•\-:|]+|[\s•\-:|]+$/g,'')
    .replace(/\s+/g,' ')
    .trim();
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
  }catch(e){if(!allServices.length){setOpt(cEl,'Error: '+e.message);setOpt(sEl,'Error');}}
}

function getFiltered(){
  const q=document.getElementById('serviceSearch').value.trim().toLowerCase();
  return allServices.filter(s=>(curPlat==='All'||s.plat===curPlat)&&(curType==='all'||s.tp===curType)&&(!q||String(s.service||s.id).includes(q)||s.cleanName.toLowerCase().includes(q)||s.cleanCat.toLowerCase().includes(q)||tr(s.cleanName).toLowerCase().includes(q)||tr(s.cleanCat).toLowerCase().includes(q)));
}

function renderCats(){
  const cEl=document.getElementById('categorySelect'),prev=cEl.value,cats=[...new Set(getFiltered().map(s=>s.cleanCat))];
  const frag=document.createDocumentFragment();
  if(!cats.length){const o=document.createElement('option');o.value='';o.textContent='---';frag.appendChild(o);}
  else{cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=tr(c);frag.appendChild(o);});}
  cEl.innerHTML='';cEl.appendChild(frag);
  if(cats.includes(prev))cEl.value=prev;
  renderSvcs();
}

function renderSvcs(){
  const sEl=document.getElementById('serviceSelect'),prev=sEl.value,cat=document.getElementById('categorySelect').value,list=getFiltered().filter(s=>!cat||s.cleanCat===cat);
  const frag=document.createDocumentFragment();
  if(!list.length){const o=document.createElement('option');o.value='';o.textContent='---';frag.appendChild(o);}
  else{
    list.forEach(s=>{
      const o=document.createElement('option');
      o.value=s.service||s.id;
      o.textContent='\u200EM7-'+(s.service||s.id)+'\u200E • '+tr(s.cleanName)+' • \u200E$'+parseFloat(s.rate||0).toFixed(3)+'\u200E';
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
