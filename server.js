const express = require('express');
const { Client } = require('discord.js-selfbot-v13');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', async (req, res) => {
    const { token } = req.body;
    try {
        const client = new Client();
        await client.login(token);
        res.json({ success: true, username: client.user.tag });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Token ไม่ถูกต้อง หรือไม่สามารถเชื่อมต่อได้' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
