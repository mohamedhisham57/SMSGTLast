import express from 'express';
import fs from 'fs';
import RouterClient from './src/routerClient.mjs';
import { TP_ACT, TP_CONTROLLERS } from './src/routerProtocol.mjs';

// Read config
let config;
try {
  const rawConfig = fs.readFileSync('config.json');
  config = JSON.parse(rawConfig);
  console.log('Config loaded successfully');
} catch (error) {
  console.error('Error loading config:', error);
  process.exit(1);
}

const app = express();
app.use(express.json());

// Home Assistant API endpoint
app.post('/api/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'Both "to" and "message" are required' 
      });
    }

    console.log(`Sending SMS to ${to}: ${message}`);
    
    const client = new RouterClient(
      config.url,
      config.login,
      config.password
    );

    const payloadSendSms = {
      method: TP_ACT.ACT_SET,
      controller: TP_CONTROLLERS.LTE_SMS_SENDNEWMSG,
      attrs: {
        'index': 1,
        to,
        textContent: message,
      }
    };

    const payloadGetSendSmsResult = {
      method: TP_ACT.ACT_GET,
      controller: TP_CONTROLLERS.LTE_SMS_SENDNEWMSG,
      attrs: [
        'sendResult'
      ]
    };

    await client.connect();
    const submitResult = await client.execute(payloadSendSms);
    
    if (submitResult.error !== 0) {
      await client.disconnect();
      return res.status(500).json({
        success: false,
        error: 'SMS send operation was not accepted'
      });
    }
    
    const sendResult = await client.execute(payloadGetSendSmsResult);
    await client.disconnect();
    
    if (sendResult.error === 0 && sendResult.data[0]['sendResult'] === 1) {
      return res.json({
        success: true,
        message: 'SMS sent successfully'
      });
    } else if (sendResult.error === 0 && sendResult.data[0]['sendResult'] === 3) {
      return res.json({
        success: true,
        message: 'SMS queued for processing'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'SMS could not be sent by router'
      });
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Router SMS Sender addon running on port ${PORT}`);
  console.log(`Router URL: ${config.url}`);
});
