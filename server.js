const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, error: 'กรุณากรอก Bot Token' });
    }

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    // ตั้งเวลา Timeout เผื่อ Token ผิดแล้วมันค้างรอนานเกินไป (10 วินาที)
    const timeout = setTimeout(() => {
        if (!res.headersSent) {
            res.status(400).json({ success: false, error: 'เชื่อมต่อล้มเหลว หรือ Bot Token ไม่ถูกต้อง' });
        }
        try { client.destroy(); } catch (e) {}
    }, 10000);

    client.once('ready', () => {
        clearTimeout(timeout);
        const botName = client.user ? client.user.tag : 'Unknown Bot';
        if (!res.headersSent) {
            res.json({ success: true, username: botName });
        }
        // ปิดการเชื่อมต่อชั่วคราวเพื่อเคลียร์แรมบน Server ของ Render
        client.destroy();
    });

    try {
        await client.login(token.trim());
    } catch (error) {
        clearTimeout(timeout);
        console.error('Bot Login Error:', error);
        if (!res.headersSent) {
            res.status(400).json({ success: false, error: 'Bot Token ไม่ถูกต้อง หรือยังไม่ได้เปิด Message Content Intent ใน Discord Developer Portal' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
