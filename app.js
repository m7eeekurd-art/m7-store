let allServices = [], curPlat = 'Instagram', curType = 'all', curSvc = null, userBal = 0, creds = { username: '', password: '' };
let lang = 'ar';
try { lang = localStorage.getItem('m7_lang') || 'ar'; } catch (e) {}

const tg = window.Telegram && window.Telegram.WebApp;
if (tg) { tg.ready(); tg.expand(); }

function getTgUser() {
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) return tg.initDataUnsafe.user;
  try {
    const raw = new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppData');
    if (raw) { const u = new URLSearchParams(raw).get('user'); if (u) return JSON.parse(u); }
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

const T = {
  ar: { lang: "العربية", dir: "rtl", bal: "رصيدك", ord: "طلب جديد ⚡", ref: "شحن رصيد 💳", his: "سجلاتي 🕒", selP: "اختر المنصة:", selT: "اختر نوع الخدمة:", srch: "🔍 ابحث باسم الخدمة أو الرقم...", cat: "القسم (Category):", oTit: "إنشاء طلب جديد", oSub: "اختر الخدمة واكتب الرابط الخاص بك", svc: "الخدمة (Service):", lnk: "الرابط (Link):", qty: "الكمية (Quantity):", st: "البدء", stV: "فوري (0 - 15 د)", wr: "الضمان", yes: "متوفر", noW: "بدون ضمان", mm: "الحد الأدنى / الأقصى", tot: "الإجمالي", sub: "تأكيد الطلب ⚡", rTit: "شحن رصيد الحساب 💳", rSub: "انسخ رقم QiCard أو عنوان USDT وأرسل المبلغ", pay: "طريقة الدفع:", rAmt: "مبلغ الشحن ($):", note: "رقم العملية / اسم المرسل:", rBtn: "إرسال طلب الشحن 🚀", hEmp: "سجل الطلبات فارغ", hSub: "الطلبات التي تقوم بتثبيتها ستظهر هنا", tAll: "الكل", tFol: "متابعين", tLik: "لايكات", tViw: "مشاهدات", tCom: "تعليقات", pIg: "إنستغرام", pTt: "تيك توك", pTg: "تيليجرام", pYt: "يوتيوب", pFb: "فيسبوك", pSc: "سناب شات", pTw: "تويتر / X", pWa: "واتساب", pAl: "الكل / عام" },
  en: { lang: "English", dir: "ltr", bal: "Balance", ord: "New Order ⚡", ref: "Top Up 💳", his: "History 🕒", selP: "Select Platform:", selT: "Service Type:", srch: "🔍 Search service name or ID...", cat: "Category:", oTit: "Create New Order", oSub: "Select a service and enter your link", svc: "Service:", lnk: "Link:", qty: "Quantity:", st: "Start", stV: "Instant (0 - 15m)", wr: "Guarantee", yes: "Available", noW: "No Refill", mm: "Min / Max", tot: "Total", sub: "Submit Order ⚡", rTit: "Top Up Balance 💳", rSub: "Copy QiCard or USDT (TRC20) and send payment", pay: "Payment Method:", rAmt: "Amount ($):", note: "Transaction ID / Sender Name:", rBtn: "Send Top-Up Request 🚀", hEmp: "Order history is empty", hSub: "Your submitted orders will appear here", tAll: "All", tFol: "Followers", tLik: "Likes", tViw: "Views", tCom: "Comments", pIg: "Instagram", pTt: "TikTok", pTg: "Telegram", pYt: "YouTube", pFb: "Facebook", pSc: "Snapchat", pTw: "Twitter / X", pWa: "WhatsApp", pAl: "All / General" },
  ku_b: { lang: "کوردی (بادینی)", dir: "rtl", bal: "باڵانسێ تە", ord: "داواکارییا نوو ⚡", ref: "پڕکرنا باڵانسی 💳", his: "تۆمارێن من 🕒", selP: "پلاتفۆرمی هەلبژێرە:", selT: "جۆرێ خزمەتگوزاریێ:", srch: "🔍 ل ناڤ یان ژمارا خزمەتگوزاریێ بگەڕێ...", cat: "بەش (Category):", oTit: "داواکارییەکا نوو چێکە", oSub: "خزمەتگوزاریێ هەلبژێرە و لینکی بنڤیسە", svc: "خزمەتگوزاری:", lnk: "لینک (Link):", qty: "چەنداتی (Quantity):", st: "دەستپێکرن", stV: "ئێکسەر (0 - 15 خولەک)", wr: "گەرەنتی", yes: "هەیە", noW: "بێ گەرەنتی", mm: "کێمترین / زۆرترین", tot: "کۆمێ گشتی", sub: "پشتڕاستکرنا داواکاریێ ⚡", rTit: "پڕکرنا باڵانسێ هەژمارێ 💳", rSub: "ژمارا QiCard یان ناونیشانێ USDT کۆپی بکە و پارەی فرێکە", pay: "ڕێکا پارەدانێ:", rAmt: "بڕێ پڕکرنێ ($):", note: "ژمارا پرۆسێ / ناڤێ هنێرەری:", rBtn: "هنارتنا داواکارییا پڕکرنێ 🚀", hEmp: "تۆمارا داواکارییان یا ڤالایە", hSub: "داواکاریێن تە ل ڤێرێ دێ دیار بن", tAll: "هەمی", tFol: "فۆڵۆوەرز", tLik: "لایک", tViw: "بینین", tCom: "کۆمێنت", pIg: "ئینستاگرام", pTt: "تیک تۆک", pTg: "تێلیگرام", pYt: "یوتیوب", pFb: "فەیسبووک", pSc: "سناب چات", pTw: "تویتەر / X", pWa: "واتساب", pAl: "هەمی / گشتی" },
  ku_s: { lang: "کوردی (سۆرانی)", dir: "rtl", bal: "باڵانسەکەت", ord: "داواکاری نوێ ⚡", ref: "پڕکردنەوەی باڵانس 💳", his: "تۆمارەکانم 🕒", selP: "پلاتفۆرم هەڵبژێرە:", selT: "جۆری خزمەتگوزاری:", srch: "🔍 گەڕان بە ناو یان ژمارەی خزمەتگوزاری...", cat: "بەش (Category):", oTit: "دروستکردنی داواکاری نوێ", oSub: "خزمەتگوزاری هەڵبژێرە و لینکەکەت بنووسە", svc: "خزمەتگوزاری:", lnk: "لینک (Link):", qty: "بڕ (Quantity):", st: "دەستپێکردن", stV: "دەستبەجێ (0 - 15 خولەک)", wr: "گەرەنتی", yes: "هەیە", noW: "بێ گەرەنتی", mm: "کەمترین / زۆرترین", tot: "کۆی گشتی", sub: "تەواوکردنی داواکاری ⚡", rTit: "پڕکردنەوەی باڵانسی هەژمار 💳", rSub: "ژمارەی QiCard یان ناونیشانی USDT کۆپی بکە و پارەکە بنێرە", pay: "شێوازی پارەدان:", rAmt: "بڕی پڕکردنەوە ($):", note: "ژمارەی مامەڵە / ناوی نێرەر:", rBtn: "ناردنی داواکاری پڕکردنەوە 🚀", hEmp: "تۆماری داواکارییەکان بەتاڵە", hSub: "داواکارییەکانت لێرە دەردەکەون", tAll: "هەموو", tFol: "فۆڵۆوەرز", tLik: "لایک", tViw: "بینین", tCom: "کۆمێنت", pIg: "ئینستاگرام", pTt: "تیک تۆک", pTg: "تێلیگرام", pYt: "یوتیوب", pFb: "فەیسبووک", pSc: "سناب چات", pTw: "تویتەر / X", pWa: "واتساب", pAl: "هەموو / گشتی" }
};

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
  document.getElementById('txtRefillBtn').innerText = t.rBtn;
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
  updateInfo();
}

function renderPills() {
  const t = T[lang];
  const arr = [{ id: 'all', n: t.tAll }, { id: 'follower', n: t.tFol }, { id: 'like', n: t.tLik }, { id: 'view', n: t.tViw }, { id: 'comment', n: t.tCom }];
  const box = document.getElementById('typesContainer');
  box.innerHTML = '';
  arr.forEach(x => {
    const div = document.createElement('div');
    div.className = 'type-pill' + (curType === x.id ? ' selected' : '');
    div.textContent = x.n;
    div.onclick = () => setType(x.id);
    box.appendChild(div);
  });
}

function switchTab(t) {
  ['btnNewOrder', 'btnRefill', 'btnHistory'].forEach(i => document.getElementById(i).classList.remove('active'));
  document.getElementById('orderSection').style.display = t === 'order' ? 'block' : 'none';
  document.getElementById('refillSection').style.display = t === 'refill' ? 'block' : 'none';
  document.getElementById('historySection').style.display = t === 'history' ? 'block' : 'none';
  if (t === 'order') document.getElementById('btnNewOrder').classList.add('active');
  if (t === 'refill') document.getElementById('btnRefill').classList.add('active');
  if (t === 'history') { document.getElementById('btnHistory').classList.add('active'); loadHistory(); }
}

function selectPlatform(p, el) {
  curPlat = p; curType = 'all';
  document.querySelectorAll('.platform-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  renderPills(); renderCats();
}

function setType(t) { curType = t; renderPills(); renderCats(); }

function detPlat(c, n) {
  const f = (c + ' ' + n).toLowerCase();
  if (f.includes('insta') || f.includes('انست') || f.includes('إنست')) return 'Instagram';
  if (f.includes('tiktok') || f.includes('تيك')) return 'TikTok';
  if (f.includes('telegram') || f.includes('تيلي') || f.includes('تليجرام')) return 'Telegram';
  if (f.includes('youtube') || f.includes('يوتيوب')) return 'YouTube';
  if (f.includes('facebook') || f.includes('فيس')) return 'Facebook';
  if (f.includes('snap') || f.includes('سناب')) return 'Snapchat';
  if (f.includes('twitter') || f.includes('تويتر') || /\bx\b/.test(f)) return 'Twitter';
  if (f.includes('whatsapp') || f.includes('واتس')) return 'WhatsApp';
  return 'All';
}

function detType(c, n) {
  const f = (c + ' ' + n).toLowerCase();
  if (f.includes('follower') || f.includes('متابع') || f.includes('مشترك') || f.includes('member') || f.includes('أعضاء')) return 'follower';
  if (f.includes('like') || f.includes('لايك') || f.includes('اعجاب') || f.includes('تفاعل')) return 'like';
  if (f.includes('view') || f.includes('مشاهد') || f.includes('story') || f.includes('ستوري') || f.includes('reel')) return 'view';
  if (f.includes('comment') || f.includes('تعليق')) return 'comment';
  return 'other';
}

function setSelectMsg(el, text) {
  el.innerHTML = '';
  const opt = document.createElement('option');
  opt.value = '';
  opt.textContent = text;
  el.appendChild(opt);
}

async function fetchServices() {
  const sEl = document.getElementById('serviceSelect');
  const cEl = document.getElementById('categorySelect');
  try {
    const res = await fetch('/api/services');
    const txt = await res.text();
    let data;
    try { data = JSON.parse(txt); } catch (e) {
      setSelectMsg(cEl, 'API Error: Check vercel.json');
      setSelectMsg(sEl, 'API Error');
      return;
    }
    if (!data || !data.success || !Array.isArray(data.services)) {
      const err = (data && data.error) ? data.error : 'Failed to load services';
      setSelectMsg(cEl, err);
      setSelectMsg(sEl, err);
      return;
    }
    allServices = data.services.map(s => {
      const cat = (s.category || 'General').replace(/kd1s/gi, '').trim();
      const name = (s.name || '').replace(/kd1s/gi, '').trim();
      return Object.assign({}, s, { cleanCat: cat, cleanName: name, plat: detPlat(cat, name), tp: detType(cat, name) });
    });
    renderCats();
  } catch (e) {
    setSelectMsg(cEl, 'Network Error: ' + e.message);
    setSelectMsg(sEl, 'Network Error');
  }
}

function getFiltered() {
  const q = document.getElementById('serviceSearch').value.trim().toLowerCase();
  return allServices.filter(s => {
    if (curPlat !== 'All' && s.plat !== curPlat) return false;
    if (curType !== 'all' && s.tp !== curType) return false;
    if (!q) return true;
    return String(s.service || s.id).includes(q) || s.cleanName.toLowerCase().includes(q) || s.cleanCat.toLowerCase().includes(q);
  });
}

function renderCats() {
  const cEl = document.getElementById('categorySelect');
  const list = getFiltered();
  const cats = [...new Set(list.map(s => s.cleanCat))];
  cEl.innerHTML = '';
  if (!cats.length) {
    setSelectMsg(cEl, '---');
  } else {
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      cEl.appendChild(opt);
    });
  }
  renderSvcs();
}

function renderSvcs() {
  const sEl = document.getElementById('serviceSelect');
  const cat = document.getElementById('categorySelect').value;
  const list = getFiltered().filter(s => !cat || s.cleanCat === cat);
  sEl.innerHTML = '';
  if (!list.length) {
    setSelectMsg(sEl, '---');
  } else {
    list.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.service || s.id;
      opt.textContent = '#' + (s.service || s.id) + ' - ' + s.cleanName + ' ($' + parseFloat(s.rate || 0).toFixed(3) + ')';
      sEl.appendChild(opt);
    });
  }
  updateInfo();
}

function updateInfo() {
  const id = document.getElementById('serviceSelect').value;
  const t = T[lang];
  curSvc = allServices.find(s => String(s.service || s.id) === String(id));
  if (curSvc) {
    document.getElementById('infoMinMax').innerText = (curSvc.min || 50) + ' - ' + (curSvc.max || 200000);
    document.getElementById('orderQuantity').value = curSvc.min || 100;
    const low = (curSvc.cleanName + ' ' + curSvc.cleanCat).toLowerCase();
    const noW = curSvc.refill === false || low.includes('no refill') || low.includes('بدون ضمان');
    const wEl = document.getElementById('txtYes');
    wEl.innerText = noW ? t.noW : t.yes;
    wEl.style.color = noW ? '#ef4444' : 'var(--ok)';
  }
  calcTotal();
}

function calcTotal() {
  const w = T[lang].tot;
  if (!curSvc) { document.getElementById('orderCost').innerText = w + ': $0.00'; return; }
  const q = Math.max(0, parseFloat(document.getElementById('orderQuantity').value) || 0);
  const tot = (q / 1000) * parseFloat(curSvc.rate || 0);
  document.getElementById('orderCost').innerText = w + ': $' + tot.toFixed(4);
}

async function syncUser() {
  if (!telegramId) return;
  try {
    const r = await fetch('/api/user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ telegramId, username, firstName }) });
    const d = await r.json();
    if (d && d.success) {
      userBal = parseFloat(d.balance) || 0;
      document.getElementById('userBalance').innerText = '$' + userBal.toFixed(2);
      if (d.settings) {
        if (d.settings.qicard) document.getElementById('displayQicard').innerText = d.settings.qicard;
        if (d.settings.usdt) document.getElementById('displayUsdt').innerText = d.settings.usdt;
      }
    }
  } catch (e) {}
}

async function submitOrder() {
  const link = document.getElementById('orderLink').value.trim();
  const quantity = parseInt(document.getElementById('orderQuantity').value, 10);
  const msg = document.getElementById('msg');
  if (!link || !curSvc) { msg.style.color = '#ef4444'; msg.innerText = '!'; return; }
  msg.style.color = '#38bdf8'; msg.innerText = '...';
  try {
    const r = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ telegramId, username, serviceId: curSvc.service || curSvc.id, link, quantity }) });
    const d = await r.json();
    if (d && d.success) {
      if (d.newBalance !== undefined) { userBal = parseFloat(d.newBalance); document.getElementById('userBalance').innerText = '$' + userBal.toFixed(2); }
      msg.style.color = '#10b981'; msg.innerText = d.pending ? '⏳ Pending Admin Approval' : '✅ Order #' + (d.orderId || '') + ' 🎉';
      document.getElementById('orderLink').value = '';
    } else { msg.style.color = '#ef4444'; msg.innerText = (d && d.error) || 'Failed'; }
  } catch (e) { msg.style.color = '#ef4444'; msg.innerText = 'Connection Error'; }
}

async function submitRefill() {
  const method = document.getElementById('refillMethod').value;
  const amount = parseFloat(document.getElementById('refillAmount').value);
  const note = document.getElementById('refillNote').value.trim();
  const m = document.getElementById('refillMsg');
  if (!amount || amount <= 0) return;
  m.style.color = '#38bdf8'; m.innerText = '...';
  try {
    const r = await fetch('/api/refill-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ telegramId, username, method, amount, note }) });
    const d = await r.json();
    m.style.color = d && d.success ? '#10b981' : '#ef4444';
    m.innerText = d && d.success ? '✅ Sent!' : '❌ Error';
  } catch (e) { m.style.color = '#ef4444'; m.innerText = 'Error'; }
}

async function loadHistory() {
  if (!telegramId) return;
  try {
    const r = await fetch('/api/orders/' + telegramId);
    const d = await r.json();
    const box = document.getElementById('historyBox');
    if (d && d.orders && d.orders.length) {
      box.innerHTML = d.orders.map(o => '<div class="history-item"><b>#' + o.serviceId + '</b> - ' + o.status + '<br><small>' + o.link + '</small></div>').join('');
    }
  } catch (e) {}
}

let clicks = 0;
async function handleLogoClick() {
  clicks++;
  if (clicks >= 5) {
    clicks = 0;
    const u = prompt('Admin User:'), p = prompt('Admin Pass:');
    if (!u || !p) return;
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
    const d = await r.json();
    if (d && d.success) {
      creds = { username: u, password: p };
      if (d.settings) {
        document.getElementById('adminProfitInput').value = d.settings.profitPercentage || 40;
        document.getElementById('adminQicardInput').value = d.settings.qicard || '';
        document.getElementById('adminUsdtInput').value = d.settings.usdt || '';
        document.getElementById('adminBotTokenInput').value = d.settings.botToken || '';
        document.getElementById('adminChatIdInput').value = d.settings.adminChatId || telegramId;
        document.getElementById('adminApprovalMode').value = d.settings.approvalMode || 'auto';
      }
      document.getElementById('adminModal').style.display = 'flex';
    } else alert('Wrong login');
  }
  setTimeout(() => clicks = 0, 3000);
}

async function adminAddBalance() {
  const targetTelegramId = document.getElementById('targetUserId').value.trim();
  const amount = parseFloat(document.getElementById('addBalanceAmount').value);
  const r = await fetch('/api/admin/add-balance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({}, creds, { targetTelegramId, amount })) });
  const d = await r.json();
  if (d && d.success) { alert('Added! New Balance: $' + d.newBalance); syncUser(); } else alert('Failed');
}

async function saveAdminSettings() {
  const payload = Object.assign({}, creds, {
    profitPercentage: parseFloat(document.getElementById('adminProfitInput').value),
    qicard: document.getElementById('adminQicardInput').value.trim(),
    usdt: document.getElementById('adminUsdtInput').value.trim(),
    botToken: document.getElementById('adminBotTokenInput').value.trim(),
    adminChatId: document.getElementById('adminChatIdInput').value.trim(),
    approvalMode: document.getElementById('adminApprovalMode').value
  });
  const r = await fetch('/api/admin/settings', { method: 'POST', headers
