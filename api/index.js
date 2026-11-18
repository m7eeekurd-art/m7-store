const mongoose = require('mongoose');

const MONGO_URI = (process.env.MONGO_URI || '').trim();
const KD1S_API_KEY = (process.env.KD1S_API_KEY || '').trim();
const BOT_TOKEN = (process.env.BOT_TOKEN || '').trim();
const ADMIN_USER = (process.env.ADMIN_USER || 'admin').trim();
const ADMIN_PASS = (process.env.ADMIN_PASS || '123456').trim();
const KD1S_API_URL = 'https://kd1s.com/api/v2';

const DEFAULT_QICARD = '2712238902';
const DEFAULT_USDT = 'TFNmJNgXNy8DUFUTqLGARuJJbA9dUgeyCS';
const DEFAULT_ADMIN_ID = '5341426561';

async function connectDB() {
    if (mongoose.connection.readyState === 1) return;
    if (!MONGO_URI) throw new Error('MONGO_URI is missing in Vercel Environment');
    await mongoose.connect(MONGO_URI);
}

const userSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    username: String,
    firstName: String,
    balance: { type: Number, default: 0 }
});

const orderSchema = new mongoose.Schema({
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
});

const settingsSchema = new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    profitPercentage: { type: Number, default: 40 },
    qicard: { type: String, default: DEFAULT_QICARD },
    usdt: { type: String, default: DEFAULT_USDT },
    adminChatId: { type: String, default: DEFAULT_ADMIN_ID },
    approvalMode: { type: String, default: 'auto' }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

async function callKD1S(paramsObj) {
    const body = new URLSearchParams({ key: KD1S_API_KEY, ...paramsObj });
    const response = await fetch(KD1S_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    });
    return await response.json();
}

async function getSettings() {
    let s = await Settings.findOne({ key: 'main' });
    if (!s) {
        s = await Settings.create({
            key: 'main',
            qicard: DEFAULT_QICARD,
            usdt: DEFAULT_USDT,
            adminChatId: DEFAULT_ADMIN_ID
        });
    }
    return s;
}

async function sendTelegramAlert(chatId, htmlText) {
    const target = (chatId && String(chatId).trim()) || DEFAULT_ADMIN_ID;
    if (!BOT_TOKEN || !target) return;
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: target,
                text: htmlText,
                parse_mode: 'HTML'
            })
        });
    } catch (err) {
        console.error('Telegram Error:', err.message);
    }
}

function checkAdmin(u, p) {
    return String(u || '').trim() === ADMIN_USER && String(p || '').trim() === ADMIN_PASS;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const urlObj = new URL(req.url, `https://${req.headers.host}`);
    const path = urlObj.pathname;
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    try {
        await connectDB();

        // 1. Sync User
        if (path === '/api/user' && req.method === 'POST') {
            const { telegramId, username, firstName } = body;
            if (!telegramId) return res.json({ success: false });

            let user = await User.findOne({ telegramId: String(telegramId) });
            if (!user) {
                user = await User.create({
                    telegramId: String(telegramId),
                    username: username || '',
                    firstName: firstName || '',
                    balance: 0
                });
            } else {
                user.username = username || user.username;
                user.firstName = firstName || user.firstName;
                await user.save();
            }

            const s = await getSettings();
            return res.json({
                success: true,
                balance: user.balance,
                settings: {
                    profitPercentage: s.profitPercentage,
                    qicard: s.qicard || DEFAULT_QICARD,
                    usdt: s.usdt || DEFAULT_USDT,
                    approvalMode: s.approvalMode
                }
            });
        }

        // 2. Get Services
        if (path === '/api/services' && req.method === 'GET') {
            const s = await getSettings();
            const profit = Number(s.profitPercentage) || 0;
            const rawServices = await callKD1S({ action: 'services' });

            if (!Array.isArray(rawServices)) {
                return res.json({ success: false, error: rawServices?.error || 'Failed to load services' });
            }

            const services = rawServices.map(srv => {
                const baseRate = parseFloat(srv.rate) || 0;
                const finalRate = baseRate * (1 + profit / 100);
                return { ...srv, rate: finalRate.toFixed(4) };
            });

            return res.json({ success: true, services });
        }

        // 3. Create Order
        if (path === '/api/order' && req.method === 'POST') {
            const { telegramId, username, serviceId, link, quantity } = body;
            const user = await User.findOne({ telegramId: String(telegramId) });
            if (!user) return res.json({ success: false, error: 'User not found!' });

            const s = await getSettings();
            const profit = Number(s.profitPercentage) || 0;

            const rawServices = await callKD1S({ action: 'services' });
            const targetSrv = Array.isArray(rawServices)
                ? rawServices.find(item => String(item.service) === String(serviceId))
                : null;

            if (!targetSrv) return res.json({ success: false, error: 'Service not found!' });

            const baseRate = parseFloat(targetSrv.rate) || 0;
            const finalRate = baseRate * (1 + profit / 100);
            const cost = parseFloat(((Number(quantity) / 1000) * finalRate).toFixed(4));

            if (user.balance < cost) {
                return res.json({ success: false, error: 'Insufficient balance!' });
            }

            if (s.approvalMode === 'manual') {
                await Order.create({
                    telegramId: String(telegramId),
                    username: username || '',
                    orderId: 'PENDING',
                    serviceId: String(serviceId),
                    serviceName: targetSrv.name || '',
                    link,
                    quantity: Number(quantity),
                    cost,
                    status: 'Pending'
                });

                await sendTelegramAlert(
                    s.adminChatId || DEFAULT_ADMIN_ID,
                    `⏳ <b>طلب جديد بانتظار الموافقة (M7 Store)</b>\n\n` +
                    `👤 <b>المستخدم:</b> ${username || 'User'}\n` +
                    `🆔 <b>ID:</b> <code>${telegramId}</code>\n` +
                    `📦 <b>الخدمة:</b> #${serviceId} - ${targetSrv.name}\n` +
                    `🔢 <b>الكمية:</b> ${quantity}\n` +
                    `💵 <b>التكلفة:</b> $${cost}\n` +
                    `🔗 <b>الرابط:</b> ${link}`
                );

                return res.json({ success: true, pending: true, newBalance: user.balance });
            }

            const kdData = await callKD1S({
                action: 'add',
                service: String(serviceId),
                link: String(link),
                quantity: String(quantity)
            });

            if (!kdData || !kdData.order) {
                return res.json({ success: false, error: kdData?.error || 'Provider order failed!' });
            }

            user.balance = parseFloat((user.balance - cost).toFixed(4));
            await user.save();

            await Order.create({
                telegramId: String(telegramId),
                username: username || '',
                orderId: String(kdData.order),
                serviceId: String(serviceId),
                serviceName: targetSrv.name || '',
                link,
                quantity: Number(quantity),
                cost,
                status: 'In Progress'
            });

            await sendTelegramAlert(
                s.adminChatId || DEFAULT_ADMIN_ID,
                `⚡ <b>طلب خدمة جديد (M7 Store)</b>\n\n` +
                `🆔 <b>رقم الطلب:</b> #${kdData.order}\n` +
                `👤 <b>المستخدم:</b> ${username || 'User'}\n` +
                `🆔 <b>User ID:</b> <code>${telegramId}</code>\n` +
                `📦 <b>الخدمة:</b> ${targetSrv.name}\n` +
                `🔢 <b>الكمية:</b> ${quantity}\n` +
                `💵 <b>المبلغ:</b> $${cost}\n` +
                `🔗 <b>الرابط:</b> ${link}`
            );

            return res.json({ success: true, orderId: kdData.order, newBalance: user.balance });
        }

        // 4. User Order History
        if (path.startsWith('/api/orders') && req.method === 'GET') {
            const tid = urlObj.searchParams.get('telegramId') || path.split('/').pop();
            const orders = await Order.find({ telegramId: String(tid) }).sort({ createdAt: -1 }).limit(30);
            return res.json({ success: true, orders });
        }

        // 5. Refill Request Notification
        if (path === '/api/refill-request' && req.method === 'POST') {
            const { telegramId, username, method, amount, note } = body;
            const s = await getSettings();

            await sendTelegramAlert(
                s.adminChatId || DEFAULT_ADMIN_ID,
                `💳 <b>طلب شحن رصيد جديد (M7 Store)</b>\n\n` +
                `👤 <b>المستخدم:</b> ${username || 'User'}\n` +
                `🆔 <b>ID (اضغط للنسخ):</b> <code>${telegramId}</code>\n` +
                `💰 <b>المبلغ:</b> $${amount}\n` +
                `🏦 <b>الطريقة:</b> ${method}\n` +
                `📝 <b>رقم الحوالة / ملاحظة:</b> ${note || 'لا يوجد'}`
            );

            return res.json({ success: true });
        }

        // 6. Admin Login
        if (path === '/api/admin/login' && req.method === 'POST') {
            if (!checkAdmin(body.username, body.password)) return res.json({ success: false });
            const settings = await getSettings();
            const pendingOrders = await Order.find({ status: 'Pending' }).sort({ createdAt: -1 });
            return res.json({ success: true, settings, pendingOrders });
        }

        // 7. Admin Save Settings
        if (path === '/api/admin/settings' && req.method === 'POST') {
            if (!checkAdmin(body.username, body.password)) return res.json({ success: false });
            const s = await getSettings();
            const p = Number(body.profitPercentage);
            s.profitPercentage = isNaN(p) ? 40 : p;
            s.qicard = body.qicard ? String(body.qicard).trim() : DEFAULT_QICARD;
            s.usdt = body.usdt ? String(body.usdt).trim() : DEFAULT_USDT;
            s.adminChatId = body.adminChatId ? String(body.adminChatId).trim() : DEFAULT_ADMIN_ID;
            s.approvalMode = body.approvalMode || 'auto';
            await s.save();
            return res.json({ success: true, settings: s });
        }

        // 8. Admin Add Balance
        if (path === '/api/admin/add-balance' && req.method === 'POST') {
            if (!checkAdmin(body.username, body.password)) return res.json({ success: false });
            const targetId = String(body.targetTelegramId || '').trim();
            const addVal = parseFloat(body.amount);
            if (!targetId || isNaN(addVal)) return res.json({ success: false, message: 'Invalid ID or amount' });

            let user = await User.findOne({ telegramId: targetId });
            if (!user) user = await User.create({ telegramId: targetId, balance: 0 });
            user.balance = parseFloat((user.balance + addVal).toFixed(4));
            await user.save();

            await sendTelegramAlert(
                targetId,
                `✅ <b>تم شحن رصيدك في M7 Store!</b>\n\n` +
                `💵 <b>المبلغ المضاف:</b> $${addVal}\n` +
                `💰 <b>رصيدك الحالي:</b> $${user.balance.toFixed(2)}`
            );

            return res.json({ success: true, newBalance: user.balance });
        }

        // 9. Admin Approve/Reject Order
        if (path === '/api/admin/order-action' && req.method === 'POST') {
            if (!checkAdmin(body.username, body.password)) return res.json({ success: false });
            const order = await Order.findById(body.orderDbId);
            if (!order || order.status !== 'Pending') return res.json({ success: false, message: 'Order not found' });

            if (body.action === 'reject') {
                order.status = 'Rejected';
                await order.save();
                await sendTelegramAlert(order.telegramId, `❌ تم رفض طلبك للخدمة: ${order.serviceName}`);
                return res.json({ success: true });
            }

            const user = await User.findOne({ telegramId: order.telegramId });
            if (!user || user.balance < order.cost) return res.json({ success: false, message: 'Insufficient user balance' });

            const kdData = await callKD1S({
                action: 'add',
                service: String(order.serviceId),
                link: String(order.link),
                quantity: String(order.quantity)
            });

            if (!kdData || !kdData.order) return res.json({ success: false, message: kdData?.error || 'Provider failed' });

            user.balance = parseFloat((user.balance - order.cost).toFixed(4));
            await user.save();

            order.orderId = String(kdData.order);
            order.status = 'In Progress';
            await order.save();

            await sendTelegramAlert(
                order.telegramId,
                `✅ <b>تمت الموافقة على طلبك وتنفيذه!</b>\n🆔 رقم الطلب: #${kdData.order}`
            );

            return res.json({ success: true, orderId: kdData.order });
        }

        return res.status(404).json({ success: false, error: 'Route not found' });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
        
