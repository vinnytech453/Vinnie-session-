require('dotenv').config();
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
const port = process.env.PORT || 3000;

let qrCodeData = '';

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one" // A unique ID for the session
    })
});

client.on('qr', qr => {
    qrCodeData = qr;
    console.log('QR Code received, generate it on the web.');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// Serve the QR code as an image
app.get('/qr', (req, res) => {
    if (qrCodeData) {
        qrcode.toDataURL(qrCodeData, (err, src) => {
            if (err) res.send("Error generating QR code");
            res.send(`<img src="${src}" alt="Scan this QR code with WhatsApp">`);
        });
    } else {
        res.send("QR code not available. Please refresh in a moment.");
    }
});

// Start the WhatsApp client
client.initialize();

// Start the Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
