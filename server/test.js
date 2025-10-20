// server.js
import express from 'express';
import mongoose from 'mongoose';
import twilio from 'twilio';
import dotenv from 'dotenv';
import ContactDetails from './models/ContactDetails.js'; // your schema file

dotenv.config();

const app = express();
app.use(express.json());

// Ensure these exist in your .env:
// TWILIO_ACCOUNT_SID=ACxxxx
// TWILIO_AUTH_TOKEN=xxxx
// TWILIO_NUMBER=+1xxx
// MEDIA_WS_URL=wss://your-public-media-endpoint   // tunneled to your Python websocket server
// MONGODB_URI=mongodb://...

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo error', err));

app.post('/api/calls', async (req, res) => {
  try {
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ error: 'customerId required' });
    }

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Invalid customerId' });
    }

    const contact = await ContactDetails.findById(customerId).lean();
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    if (!contact.phone) {
      return res.status(400).json({ error: 'Contact has no phone' });
    }

    // Inline TwiML to connect the call audio to your websocket media server
    const twiml = `
      <Response>
        <Connect>
          <Stream url="${process.env.MEDIA_WS_URL}" />
        </Connect>
      </Response>
    `;

    const call = await client.calls.create({
      to: contact.phone,               // should be in E.164 format
      from: process.env.TWILIO_NUMBER, // your Twilio number
      twiml
    });

    return res.status(201).json({ callSid: call.sid, to: contact.phone });
  } catch (err) {
    console.error('Call error', err);
    return res.status(500).json({ error: 'Failed to initiate call' });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server listening on ${process.env.PORT || 8080}`);
});
