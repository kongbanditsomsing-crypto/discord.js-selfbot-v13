const express = require('express');
const { Client } = require('./src/index.js');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, error: 'กรุณากรอก Token ให้เรียบร้อย' });
    }

    const client = new Client({ checkUpdate: false });

    const timeout = setTimeout(() => {
        if (!res.headersSent) {
            res.status(400).json({ success: false, error: 'Token ไม่ถูกต้อง หรือเชื่อมต่อไม่สําเร็จ' });
        }
        try { client.destroy(); } catch (e) {}
    }, 12000);

    client.once('ready', () => {
        clearTimeout(timeout);
        const username = client.user ? client.user.tag : 'Unknown User';
        if (!res.headersSent) {
            res.json({ success: true, username: username });
        }
        client.destroy();
    });

    try {
        await client.login(token.trim());
    } catch (error) {
        clearTimeout(timeout);
        console.error('Login Error:', error);
        if (!res.headersSent) {
            res.status(400).json({ success: false, error: 'Token ไม่ถูกต้อง หรือบัญชีมีปัญหา' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
