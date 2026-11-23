let mongoose;
try { mongoose = require('mongoose'); } catch (_) {}

let models = null;
async function connectDB() {
  const uri = (process.env.MONGO_URI || '').trim();
  if (!mongoose || !uri) return null;
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  }
  if (!models) {
    models = {
      User: mongoose.models.User || mongoose.model('User', new mongoose.Schema({
        telegramId: { type: String, unique: true },
        username: String,
        firstName: String,
        balance: { type: Number, default: 0 }
      })),
      Settings: mongoose.models.Settings || mongoose.model('Settings', new mongoose.Schema({
        key: { type: String, unique: true },
        profitPercentage: { type: Number, default: 40 },
        qicard: { type: String, default: '0000000000' },
        usdt: { type: String, default: 'TYourAdminWalletAddressHere...' },
        botToken: { type: String, default: '' },
        adminChatId: { type: String, default: '' },
        approvalMode: { type: String, default: 'auto' }
      })),
      Order: mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
        telegramId: String,
        username: String,
        orderId: String,
        serviceId: String,
        serviceName: String,
        link: String,
        quantity: Number,
        cost: Number,
        status: { type: String, default: 'In Progress' },
        createdAt: { type: Date, default: Date.now }
      })),
      Refill: mongoose.models.Refill || mongoose.model('Refill', new mongoose.Schema({
        telegramId: String,
        username: String,
        method: String,
        amount: Number,
        note: String,
        txid: { type: String, sparse: true },
        status: { type: String, default: 'Pending' },
        createdAt: { type: Date, default: Date.now }
      }))
    };
  }
  return models;
}

async function kd1sPost(params) {
  const res = await fetch('https://kd1s.com/api/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString()
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch (_) { return { error: 'KD1S Error: ' + text.slice(0, 60) }; }
}

async function sendAlert(db, text) {
  try {
    const s = db ? await db.Settings.findOne({ key: 'main' }) : null;
    const token = (process.env.BOT_TOKEN || (s && s.botToken) || '').trim();
    const chatId = (process.env.ADMIN_CHAT_ID || (s && s.adminChatId) || '').trim();
    if (!token || !chatId) return;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });
  } catch (_) {}
}

// پشکنینا داواکارییان د kd1s دا و زڤڕاندنا پارەی ب شێوەیێ ئۆتۆماتیکی
async function syncUserOrders(db, tid) {
  const orders = await db.Order.find({ telegramId: tid }).sort({ createdAt: -1 }).limit(20);
  const apiKey = (process.env.KD1S_API_KEY || '').trim();
  const activeIds = orders.filter(o => o.orderId && o.status === 'In Progress').map(o => o.orderId);
  let newBalance;

  if (apiKey && activeIds.length > 0) {
    try {
      const stData = await kd1sPost({ key: apiKey, action: 'status', orders: activeIds.join(',') });
      if (stData && typeof stData === 'object' && !stData.error) {
        let refundTotal = 0;
        for (const o of orders) {
          const info = stData[o.orderId];
          if (!info || !info.status) continue;
          const stLow = String(info.status).toLowerCase();
          if (stLow === 'completed') {
            o.status = 'Completed';
            await o.save();
          } else if (stLow === 'canceled' || stLow === 'refunded') {
            o.status = 'Refunded';
            await o.save();
            refundTotal += parseFloat(o.cost || 0);
          } else if (stLow === 'partial' && o.quantity > 0) {
            const remains = Math.min(o.quantity, Math.max(0, parseFloat(info.remains || 0)));
            o.status = 'Refunded';
            await o.save();
            refundTotal += parseFloat(((remains / o.quantity) * (o.cost || 0)).toFixed(4));
          }
        }
        if (refundTotal > 0) {
          const user = await db.User.findOne({ telegramId: tid });
          if (user) {
            user.balance = parseFloat((user.balance + refundTotal).toFixed(4));
            await user.save();
            newBalance = user.balance;
          }
        }
      }
    } catch (_) {}
  }
  return { orders, newBalance };
}

// پشکنینا حەواڵا USDT (TRC20) ب شێوەیێ ئۆتۆماتیکی
async function verifyUsdtTrc20(txid, expectedWallet) {
  try {
    const cleanWallet = String(expectedWallet || '').trim();
    if (!cleanWallet || cleanWallet.startsWith('TYourAdmin')) return null;
    const res = await fetch(`https://apilist.tronscanapi.com/api/transaction-info?hash=${txid}`);
    if (!res.ok) return null;
    const info = await res.json();
    if (!info || info.contractRet !== 'SUCCESS' || !info.confirmed) return { valid: false, reason: 'Transaction not confirmed yet' };

    const transfers = Array.isArray(info.trc20TransferInfo) ? info.trc20TransferInfo : [];
    const usdtContract = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
    const match = transfers.find(t =>
      String(t.contract_address || '') === usdtContract &&
      String(t.to_address || '').toLowerCase() === cleanWallet.toLowerCase()
    );
    if (!match) return { valid: false, reason: 'Wallet address or USDT token mismatch' };

    const decimals = Number(match.decimals || 6);
    const amountUsdt = parseFloat(match.amount_str || '0') / Math.pow(10, decimals);
    if (!amountUsdt || amountUsdt <= 0) return { valid: false, reason: 'Invalid amount' };
    return { valid: true, amount: parseFloat(amountUsdt.toFixed(4)) };
  } catch (_) {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = (req.url || '').split('?')[0];
  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }

  try {
    // وەلامدانا /start د تێلیگرامی دا ب دوگما مینی ئەپێ
    if (path === '/api/telegram-webhook') {
      const msg = body && body.message;
      if (msg && msg.text && msg.text.trim().startsWith('/start')) {
        const db = await connectDB();
        const s = db ? await db.Settings.findOne({ key: 'main' }) : null;
        const token = (process.env.BOT_TOKEN || (s && s.botToken) || '').trim();
        const miniAppUrl = (process.env.MINI_APP_URL || 'https://m7-com.vercel.app/').trim();
        if (token && msg.chat && msg.chat.id) {
          const fname = (msg.from && msg.from.first_name) || 'User';
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: msg.chat.id,
              text: `👋 Welcome <b>${fname}</b> to <b>M7 Store</b>!`,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: [[{ text: 'Open App', web_app: { url: miniAppUrl } }]]
              }
            })
          });
        }
      }
      return res.status(200).json({ ok: true });
    }

    if (path === '/api/services') {
      const apiKey = (process.env.KD1S_API_KEY || '').trim();
      if (!apiKey) return res.status(200).json({ success: false, error: 'KD1S_API_KEY missing' });

      let profit = 0.40;
      try {
        const db = await connectDB();
        if (db) {
          const s = await db.Settings.findOne({ key: 'main' });
          if (s && typeof s.profitPercentage === 'number') profit = s.profitPercentage / 100;
        }
      } catch (_) {}

      const data = await kd1sPost({ key: apiKey, action: 'services' });
      if (!Array.isArray(data)) return res.status(200).json({ success: false, error: (data && data.error) || 'Invalid Key' });
      const services = data.map(s => ({
        ...s,
        rate: (parseFloat(s.rate || 0) * (1 + profit)).toFixed(4),
        average_time: s.average_time || s.avg_time || '',
        start_time: s.start_time || '',
        desc: s.desc || s.description || ''
      }));
      return res.status(200).json({ success: true, services });
    }

    const db = await connectDB();
    if (!db) return res.status(200).json({ success: false, error: 'DB Error' });

    // ل دەمێ ڤەکرنا ئەپێ ئێکسەر داواکارییان دپشکنیت و ئەگەر کەنسل ببن پارەی دزڤڕینیت
    if (path === '/api/user') {
      const { telegramId, username, firstName } = body;
      if (!telegramId) return res.status(200).json({ success: false });
      let user = await db.User.findOne({ telegramId });
      if (!user) user = await db.User.create({ telegramId, username: username || 'NoUsername', firstName: firstName || 'User', balance: 0 });
      else if (username && user.username !== username) { user.username = username; await user.save(); }

      const syncRes = await syncUserOrders(db, telegramId);
      const finalBalance = syncRes.newBalance !== undefined ? syncRes.newBalance : user.balance;

      let settings = await db.Settings.findOne({ key: 'main' });
      if (!settings) settings = await db.Settings.create({ key: 'main' });
      return res.status(200).json({ success: true, balance: finalBalance, settings });
    }

    if (path === '/api/order') {
      const { telegramId, username, serviceId, link, quantity } = body;
      const user = await db.User.findOne({ telegramId });
      if (!user) return res.status(200).json({ success: false, error: 'User not found' });

      const apiKey = (process.env.KD1S_API_KEY || '').trim();
      const list = await kd1sPost({ key: apiKey, action: 'services' });
      const svc = Array.isArray(list) ? list.find(s => String(s.service || s.id) === String(serviceId)) : null;
      if (!svc) return res.status(200).json({ success: false, error: 'Service not found' });

      const settings = await db.Settings.findOne({ key: 'main' });
      const profit = settings ? (settings.profitPercentage / 100) : 0.40;

      const rawCost = (quantity / 1000) * parseFloat(svc.rate) * (1 + profit);
      const cost = Math.max(0.0001, parseFloat(rawCost.toFixed(4)));

      if (user.balance < cost) return res.status(200).json({ success: false, error: 'Insufficient balance!' });

      const uTag = username ? `@${username}` : 'No Username';
      const uIdStr = telegramId || 'Unknown ID';

      if (((settings && settings.approvalMode) || 'auto') === 'manual') {
        const p = await db.Order.create({ telegramId, username, serviceId, serviceName: svc.name, link, quantity, cost, status: 'Pending Approval' });
        await sendAlert(db, `⏳ <b>داواکارییا په‌ندینگ #${p._id}</b>\n👤 <b>ناڤ:</b> ${uTag}\n🆔 <b>ئایدی:</b> <code>${uIdStr}</code>\n📦 <b>خزمەتگوزاری:</b> #${serviceId} (${svc.name})\n🔗 <b>لینک:</b> ${link}\n🔢 <b>چەنداتی:</b> ${quantity}\n💰 <b>کوژمە:</b> $${cost}`);
        return res.status(200).json({ success: true, pending: true });
      }

      const kd = await kd1sPost({ key: apiKey, action: 'add', service: serviceId, link, quantity });
      if (kd && kd.order) {
        user.balance = Math.max(0, parseFloat((user.balance - cost).toFixed(4)));
        await user.save();

        await db.Order.create({ telegramId, username, orderId: String(kd.order), serviceId, serviceName: svc.name, link, quantity, cost, status: 'In Progress' });
        await sendAlert(db, `✅ <b>داواکارییا سه‌رکه‌فتی #${kd.order}</b>\n👤 <b>ناڤ:</b> ${uTag}\n🆔 <b>ئایدی:</b> <code>${uIdStr}</code>\n📦 <b>خزمەتگوزاری:</b> #${serviceId} (${svc.name})\n🔗 <b>لینک:</b> ${link}\n🔢 <b>چەنداتی:</b> ${quantity}\n💸 <b>کوژمە:</b> $${cost}\n💳 <b>ماوەیا باڵانسی:</b> $${user.balance.toFixed(2)}`);
        return res.status(200).json({ success: true, orderId: kd.order, newBalance: user.balance });
      }
      return res.status(200).json({ success: false, error: (kd && kd.error) || 'Order failed' });
    }

    // پشکنین ل دەمێ ڤەکرنا بەشێ History ژی
    if (path.startsWith('/api/orders/')) {
      const tid = path.split('/').pop();
      const syncRes = await syncUserOrders(db, tid);
      const resp = { success: true, orders: syncRes.orders };
      if (syncRes.newBalance !== undefined) resp.newBalance = syncRes.newBalance;
      return res.status(200).json(resp);
    }

    if (path === '/api/refill-request') {
      const { telegramId, username, method, amount, note } = body;
      const uTag = username ? `@${username}` : 'No Username';
      const uIdStr = telegramId || 'Unknown ID';

      // شەحنکرنا ئۆتۆماتیکی یا USDT: هەر 1 USDT = 1.52$
      if (method === 'USDT' && note) {
        const txMatch = String(note).match(/[a-fA-F0-9]{64}/);
        if (txMatch) {
          const txid = txMatch[0].toLowerCase();
          const existing = await db.Refill.findOne({ txid });
          if (existing) {
            return res.status(200).json({ success: false, error: 'TXID already used!' });
          }
          const settings = await db.Settings.findOne({ key: 'main' });
          const check = await verifyUsdtTrc20(txid, settings && settings.usdt);
          if (check && check.valid) {
            const user = await db.User.findOne({ telegramId });
            if (user) {
              const usdtMultiplier = 1.52;
              const creditedAmount = parseFloat((check.amount * usdtMultiplier).toFixed(4));
              user.balance = parseFloat((user.balance + creditedAmount).toFixed(4));
              await user.save();
              await db.Refill.create({ telegramId, username, method, amount: creditedAmount, note, txid, status: 'Approved' });
              await sendAlert(db, `✅ <b>شەحنکرنا ئۆتۆماتیکی USDT!</b>\n👤 <b>ناڤ:</b> ${uTag}\n🆔 <b>ئایدی:</b> <code>${uIdStr}</code>\n🪙 <b>USDT یێ گەهشتی:</b> ${check.amount} USDT\n💵 <b>باڵانسێ زێدەبوویی (×1.52):</b> $${creditedAmount}\n🔗 <b>TXID:</b> <code>${txid}</code>`);
              return res.status(200).json({ success: true, autoCredited: true, creditedAmount, newBalance: user.balance });
            }
          }
        }
      }

      await db.Refill.create({ telegramId, username, method, amount, note });
      await sendAlert(db, `💳 <b>داواکارییا پڕکرنا باڵانسی!</b>\n👤 <b>ناڤ:</b> ${uTag}\n🆔 <b>ئایدی:</b> <code>${uIdStr}</code>\n💵 <b>بڕ:</b> $${amount}\n🏦 <b>ڕێکا ڤەدانا:</b> ${method}\n📝 <b>تێبینی:</b> ${note || '-'}`);
      return res.status(200).json({ success: true });
    }

    const adminU = process.env.ADMIN_USER || 'admin';
    const adminP = process.env.ADMIN_PASS || 'admin';

    if (path === '/api/admin/login') {
      if (body.username === adminU && body.password === adminP) {
        const settings = await db.Settings.findOne({ key: 'main' });
        return res.status(200).json({ success: true, settings });
      }
      return res.status(200).json({ success: false });
    }

    if (path === '/api/admin/add-balance') {
      if (body.username !== adminU || body.password !== adminP) return res.status(200).json({ success: false });
      let user = await db.User.findOne({ telegramId: body.targetTelegramId });
      if (!user) user = await db.User.create({ telegramId: body.targetTelegramId, balance: 0 });
      user.balance = parseFloat((user.balance + parseFloat(body.amount)).toFixed(4));
      await user.save();
      return res.status(200).json({ success: true, newBalance: user.balance });
    }

    if (path === '/api/admin/settings') {
      if (body.username !== adminU || body.password !== adminP) return res.status(200).json({ success: false });
      let s = await db.Settings.findOne({ key: 'main' });
      if (!s) s = new db.Settings({ key: 'main' });
      Object.assign(s, {
        profitPercentage: body.profitPercentage,
        qicard: body.qicard,
        usdt: body.usdt,
        botToken: body.botToken,
        adminChatId: body.adminChatId,
        approvalMode: body.approvalMode
      });
      await s.save();
      return res.status(200).json({ success: true });
    }

    return res.status(200).json({ success: false, error: 'Route not found' });
  } catch (err) {
    return res.status(200).json({ success: false, error: err.message });
  }
};
