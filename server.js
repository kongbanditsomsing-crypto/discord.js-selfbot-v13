const express = require('express');
const { Client } = require('./src/index.js');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, error: 'กรุณากรอก Token' });
    }

    try {
        const client = new Client({ checkUpdate: false });

        client.once('ready', () => {
            const username = client.user ? client.user.tag : 'Unknown User';
            if (!res.headersSent) {
                res.json({ success: true, username: username });
            }
            client.destroy();
        });

        await client.login(token.trim());
    } catch (error) {
        console.error('Selfbot Login Error:', error);
        if (!res.headersSent) {
            res.status(400).json({ success: false, error: 'Token ไม่ถูกต้อง หรือติดการยืนยันตัวตน (Verify)' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
