const express = require('express');
const { Client } = require('./src/index.js'); // ดึงมาจาก source ภายในโดยตรง
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
        
        // ดักจับเหตุการณ์เมื่อระบบล็อกอินสำเร็จจริงๆ
        client.once('ready', () => {
            const username = client.user ? client.user.tag : 'Unknown User';
            // ส่งค่ากลับไปว่าสำเร็จทันทีที่พร้อมใช้งาน
            if (!res.headersSent) {
                res.json({ success: true, username: username });
            }
            // ปิดการเชื่อมต่อชั่วคราวเพื่อไม่ให้ค้างเบื้องหลัง
            client.destroy();
        });

        // สั่งล็อกอินด้วย Token ที่กรอกมา
        await client.login(token.trim());

    } catch (error) {
        console.error('Login Error:', error);
        if (!res.headersSent) {
            res.status(400).json({ success: false, error: 'Token ไม่ถูกต้อง หรือบัญชีถูกล็อก/ติด Verify' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
