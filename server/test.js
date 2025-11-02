// server.js (ES Modules)
import 'dotenv/config';
import express from 'express';
import twilio from 'twilio';

const app = express();
app.use(express.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/api/send-whatsapp', async (req, res) => {
  try {
    const { to, body, mediaUrl } = req.body; // to can be "+91XXXXXXXXXX" or "whatsapp:+91XXXXXXXXXX"
    
    if (!to || !body) {
      return res.status(400).json({ error: 'Fields "to" and "body" are required' });
    }
    
    const toWhatsApp = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
    
    const msg = await client.messages.create({
      from: fromWhatsApp,
      to: toWhatsApp,
      body,
      ...(mediaUrl ? { mediaUrl } : {})
    });
    
    res.json({ sid: msg.sid, status: msg.status });
  } catch (err) {
    res.status(500).json({ error: err.message, code: err.code });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});