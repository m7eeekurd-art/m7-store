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
    if (path === '/api/services') {
      const apiKey = (process.env.KD1S_API_KEY || '').trim();
      if (!apiKey) return res.status(200).json({ success: false, error: 'KD1S_API_KEY missing in Vercel' });

      let profit = 0.40;
      try {
        const db = await connectDB();
        if (db) {
          const s = await db.Settings.findOne({ key: 'main' });
          if (s && typeof s.profitPercentage === 'number') profit = s.profitPercentage / 100;
        }
      } catch (_) {}

      const data = await kd1sPost({ key: apiKey, action: 'services' });
      if (!Array.isArray(data)) {
        return res.status(200).json({ success: false, error: (data && data.error) || 'Invalid KD1S API Key' });
      }
      const services = data.map(s => ({
        ...s,
        rate: (parseFloat(s.rate || 0) * (1 + profit)).toFixed(4)
      }));
      return res.status(200).json({ success: true, services });
    }

    const db = await connectDB();
    if (!db) return res.status(200).json({ success: false, error: 'Database not connected' });

    if (path === '/api/user') {
      const { telegramId, username, firstName } = body;
      if (!telegramId) return res.status(200).json({ success: false });
      let user = await db.User.findOne({ telegramId });
      if (!user) user = await db.User.create({ telegramId, username, firstName, balance: 0 });
      else if (username && user.username !== username) { user.username = username; await user.save(); }
      let settings = await db.Settings.findOne({ key: 'main' });
      if (!settings) settings = await db.Settings.create({ key: 'main' });
      return res.status(200).json({ success: true, balance: user.balance, settings });
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
      const cost = parseFloat(((quantity / 1000) * parseFloat(svc.rate) * (1 + profit)).toFixed(4));
      if (user.balance < cost) return res.status(200).json({ success: false, error: 'Insufficient balance!' });

      if (((settings && settings.approvalMode) || 'auto') === 'manual') {
        const p = await db.Order.create({ telegramId, username, serviceId, serviceName: svc.name, link, quantity, cost, status: 'Pending Approval' });
        await sendAlert(db, `⏳ <b>Pending Order #${p._id}</b>\n👤 @${username || telegramId}\n📦 #${serviceId}\n🔗 ${link}\n🔢 ${quantity}\n💰 $${cost}`);
        return res.status(200).json({ success: true, pending: true });
      }

      const kd = await kd1sPost({ key: apiKey, action: 'add', service: serviceId, link, quantity });
      if (kd && kd.order) {
        user.balance -= cost;
        await user.save();
        await db.Order.create({ telegramId, username, orderId: String(kd.order), serviceId, serviceName: svc.name, link, quantity, cost, status: 'In Progress' });
        await sendAlert(db, `✅ <b>Order #${kd.order}</b>\n👤 @${username || telegramId}\n📦 #${serviceId}\n🔗 ${link}\n🔢 ${quantity}\n💸 $${cost}`);
        return res.status(200).json({ success: true, orderId: kd.order, newBalance: user.balance });
      }
      return res.status(200).json({ success: false, error: (kd && kd.error) || 'Order failed' });
    }

    if (path.startsWith('/api/orders/')) {
      const tid = path.split('/').pop();
      const orders = await db.Order.find({ telegramId: tid }).sort({ createdAt: -1 }).limit(20);
      return res.status(200).json({ success: true, orders });
    }

    if (path === '/api/refill-request') {
      const { telegramId, username, method, amount, note } = body;
      await db.Refill.create({ telegramId, username, method, amount, note });
      await sendAlert(db, `💳 <b>Top-Up Request</b>\n👤 @${username || telegramId}\n💵 $${amount}\n🏦 ${method}\n📝 ${note || '-'}`);
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
      user.balance += parseFloat(body.amount);
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

    return res.status(200).json({ success: false, error: 'Unknown route' });
  } catch (err) {
    return res.status(200).json({ success: false, error: err.message });
  }
};
                    
