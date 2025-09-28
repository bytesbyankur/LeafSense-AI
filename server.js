// server.js (Updated)
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { Twilio } = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // Allow requests from other origins
app.use(express.json()); // Parse JSON bodies

// Statically serve the 'public' directory
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Multer setup for file uploads
const upload = multer({ dest: path.join(publicDir, 'uploads/') });
if (!fs.existsSync(path.join(publicDir, 'uploads/'))) {
    fs.mkdirSync(path.join(publicDir, 'uploads/'));
}

// --- Twilio Client ---
// Ensure you have these in your .env file!
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// --- API Route for Sending Report ---
app.post('/send-report', upload.single('file'), async (req, res) => {
    try {
        const phone = req.body.phone;
        if (!phone) return res.status(400).json({ error: 'Missing phone number' });
        if (!req.file) return res.status(400).json({ error: 'Missing file' });

        // The public URL for Twilio to access the file
        // Example: http://your-ngrok-url.io/uploads/167..._report.pdf
        const fileUrl = `${process.env.BASE_PUBLIC_URL}/uploads/${req.file.filename}`;

        const from = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'
        const to = `whatsapp:${phone.replace(/\D/g, '')}`; // Sanitize phone number

        const message = await client.messages.create({
            from,
            to,
            body: `Your Plant Health Report is ready.`,
            mediaUrl: [fileUrl]
        });

        res.json({ message: 'Report sent successfully!', sid: message.sid });

    } catch (err) {
        console.error("Twilio Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));