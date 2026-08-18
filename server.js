const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist'))); // หรือโฟลเดอร์ build หน้าเว็บของคุณ

app.post('/api/login', async (req, res) => {
    const { token } = req.body;
    try {
        const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
        await client.login(token);
        res.json({ success: true, username: client.user.tag });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Token ไม่ถูกต้อง' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
