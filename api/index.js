const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection (Cached for Vercel Serverless)
const MONGO_URI = process.env.MONGO_URI;
async function connectDB() {
    if (!MONGO_URI) return;
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(MONGO_URI);
}

// Schemas & Models
const userSchema = new mongoose.Schema({
    telegramId: { type: String, unique: true },
    username: String,
    firstName: String,
    balance: { type: Number, default: 0 }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const settingsSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    profitPercentage: { type: Number, default: 40 },
    qicard: { type: String, default: '0000000000' },
    usdt: { type: String, default: 'TYourAdminWalletAddressHere...' },
    botToken: { type: String, default: '' },
    adminChatId: { type: String, default: '' },
    approvalMode: { type: String, default: 'auto' }
});
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

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
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

const refillSchema = new mongoose.Schema({
    telegramId: String,
    username: String,
    method: String,
    amount: Number,
    note: String,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});
const Refill = mongoose.models.Refill || mongoose.model('Refill', refillSchema);

// Telegram Notification Helper
async function sendTelegramAlert(text) {
    try {
        const settings = await Settings.findOne({ key: 'main' });
        const token = process.env.BOT_TOKEN || settings?.botToken;
        const chatId = process.env.ADMIN_CHAT_ID || settings?.adminChatId;
        if (!token || !chatId) return;
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text,
            parse_mode: 'HTML'
        });
    } catch (_) {}
}

// Health Check
app.get('/api', (req, res) => {
    res.json({ success: true, message: 'M7 Store API is running!' });
});

// Get Services from KD1S
app.get('/api/services', async (req, res) => {
    try {
        await connectDB();
        const apiKey = process.env.KD1S_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ success: false, error: 'KD1S_API_KEY is not configured' });
        }

        const response = await axios.post('https://kd1s.com/api/v2', {
            key: apiKey,
            action: 'services'
        });

        let profit = 0.40;
        if (MONGO_URI) {
            const settings = await Settings.findOne({ key: 'main' });
            if (settings) profit = settings.profitPercentage / 100;
        }

        let services = response.data;
        if (Array.isArray(services)) {
            services = services.map(s => ({
                ...s,
                rate: (parseFloat(s.rate) * (1 + profit)).toFixed(4)
            }));
        }
        res.json({ success: true, services });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Sync User & Settings
app.post('/api/user', async (req, res) => {
    try {
        await connectDB();
        const { telegramId, username, firstName } = req.body;
        if (!telegramId) return res.status(400).json({ success: false });

        let user = await User.findOne({ telegramId });
        if (!user) {
            user = await User.create({ telegramId, username, firstName, balance: 0 });
        } else if (username && user.username !== username) {
            user.username = username;
            await user.save();
        }

        let settings = await Settings.findOne({ key: 'main' });
        if (!settings) {
            settings = await Settings.create({ key: 'main' });
        }

        res.json({ success: true, balance: user.balance, settings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Place New Order
app.post('/api/order', async (req, res) => {
    try {
        await connectDB();
        const { telegramId, username, serviceId, link, quantity } = req.body;
        const user = await User.findOne({ telegramId });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const apiKey = process.env.KD1S_API_KEY;
        const servicesRes = await axios.post('https://kd1s.com/api/v2', { key: apiKey, action: 'services' });
        const serviceObj = Array.isArray(servicesRes.data)
            ? servicesRes.data.find(s => String(s.service || s.id) === String(serviceId))
            : null;

        if (!serviceObj) return res.status(400).json({ success: false, error: 'Service not found' });

        const settings = await Settings.findOne({ key: 'main' });
        const profit = settings ? (settings.profitPercentage / 100) : 0.40;
        const finalRate = parseFloat(serviceObj.rate) * (1 + profit);
        const cost = parseFloat(((quantity / 1000) * finalRate).toFixed(4));

        if (user.balance < cost) {
            return res.status(400).json({ success: false, error: 'Insufficient balance!' });
        }

        const approvalMode = settings?.approvalMode || 'auto';

        if (approvalMode === 'manual') {
            const pendingOrder = await Order.create({
                telegramId,
                username,
                serviceId,
                serviceName: serviceObj.name,
                link,
                quantity,
                cost,
                status: 'Pending Approval'
            });
            await sendTelegramAlert(`⏳ <b>New Pending Order #${pendingOrder._id}</b>\n👤 User: @${username || telegramId}\n📦 Service: #${serviceId}\n🔗 Link: ${link}\n🔢 Qty: ${quantity}\n💰 Cost: $${cost}`);
            return res.json({ success: true, pending: true, message: 'Submitted for approval' });
        }

        const kdOrder = await axios.post('https://kd1s.com/api/v2', {
            key: apiKey,
            action: 'add',
            service: serviceId,
            link,
            quantity
        });

        if (kdOrder.data && kdOrder.data.order) {
            user.balance -= cost;
            await user.save();

            await Order.create({
                telegramId,
                username,
                orderId: String(kdOrder.data.order),
                serviceId,
                serviceName: serviceObj.name,
                link,
                quantity,
                cost,
                status: 'In Progress'
            });

            await sendTelegramAlert(`✅ <b>New Successful Order #${kdOrder.data.order}</b>\n👤 User: @${username || telegramId}\n📦 Service: #${serviceId}\n🔗 Link: ${link}\n🔢 Qty: ${quantity}\n💸 Cost: $${cost}\n💳 Remaining: $${user.balance.toFixed(2)}`);

            res.json({ success: true, orderId: kdOrder.data.order, newBalance: user.balance });
        } else {
            res.status(400).json({ success: false, error: kdOrder.data?.error || 'Failed to place order' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get User Order History
app.get('/api/orders/:telegramId', async (req, res) => {
    try {
        await connectDB();
        const orders = await Order.find({ telegramId: req.params.telegramId }).sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Refill / Top-Up Request
app.post('/api/refill-request', async (req, res) => {
    try {
        await connectDB();
        const { telegramId, username, method, amount, note } = req.body;
        await Refill.create({ telegramId, username, method, amount, note });
        await sendTelegramAlert(`💳 <b>New Top-Up Request!</b>\n👤 User: @${username || telegramId}\n💵 Amount: $${amount}\n🏦 Method: ${method}\n📝 Note: ${note || 'None'}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    try {
        await connectDB();
        const { username, password } = req.body;
        const adminUser = process.env.ADMIN_USER || 'admin';
        const adminPass = process.env.ADMIN_PASS || 'admin';

        if (username === adminUser && password === adminPass) {
            const settings = await Settings.findOne({ key: 'main' });
            const pendingOrders = await Order.find({ status: 'Pending Approval' }).sort({ createdAt: -1 });
            res.json({ success: true, settings, pendingOrders });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Admin Add Balance
app.post('/api/admin/add-balance', async (req, res) => {
    try {
        await connectDB();
        const { username, password, targetTelegramId, amount } = req.body;
        if (username !== (process.env.ADMIN_USER || 'admin') || password !== (process.env.ADMIN_PASS || 'admin')) {
            return res.status(401).json({ success: false });
        }

        let user = await User.findOne({ telegramId: targetTelegramId });
        if (!user) {
            user = await User.create({ telegramId: targetTelegramId, balance: 0 });
        }
        user.balance += parseFloat(amount);
        await user.save();

        res.json({ success: true, newBalance: user.balance });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Admin Update Settings
app.post('/api/admin/settings', async (req, res) => {
    try {
        await connectDB();
        const { username, password, profitPercentage, qicard, usdt, botToken, adminChatId, approvalMode } = req.body;
        if (username !== (process.env.ADMIN_USER || 'admin') || password !== (process.env.ADMIN_PASS || 'admin')) {
            return res.status(401).json({ success: false });
        }

        let settings = await Settings.findOne({ key: 'main' });
        if (!settings) {
            settings = new Settings({ key: 'main' });
        }
        settings.profitPercentage = profitPercentage;
        settings.qicard = qicard;
        settings.usdt = usdt;
        settings.botToken = botToken;
        settings.adminChatId = adminChatId;
        settings.approvalMode = approvalMode;
        await settings.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Admin Approve or Reject Pending Order
app.post('/api/admin/order-action', async (req, res) => {
    try {
        await connectDB();
        const { username, password, orderDbId, action } = req.body;
        if (username !== (process.env.ADMIN_USER || 'admin') || password !== (process.env.ADMIN_PASS || 'admin')) {
            return res.status(401).json({ success: false });
        }

        const order = await Order.findById(orderDbId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (action === 'reject') {
            order.status = 'Rejected';
            await order.save();
            return res.json({ success: true, message: 'Rejected' });
        }

        if (action === 'approve') {
            const user = await User.findOne({ telegramId: order.telegramId });
            if (!user || user.balance < order.cost) {
                return res.status(400).json({ success: false, message: 'User balance insufficient!' });
            }

            const apiKey = process.env.KD1S_API_KEY;
            const kdOrder = await axios.post('https://kd1s.com/api/v2', {
                key: apiKey,
                action: 'add',
                service: order.serviceId,
                link: order.link,
                quantity: order.quantity
            });

            if (kdOrder.data && kdOrder.data.order) {
                user.balance -= order.cost;
                await user.save();
                order.orderId = String(kdOrder.data.order);
                order.status = 'In Progress';
                await order.save();
                return res.json({ success: true, orderId: kdOrder.data.order });
            } else {
                return res.status(400).json({ success: false, message: kdOrder.data?.error || 'KD1S API Error' });
            }
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`M7 Server running on port ${PORT}`));
}

module.exports = app;
