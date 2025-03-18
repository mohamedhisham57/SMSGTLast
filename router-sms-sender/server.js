#!/usr/bin/env node

import fs from 'fs'
import express from 'express'
import nocache from 'nocache'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import expressBasicAuth from 'express-basic-auth'
import axios from 'axios'

import RouterClient from './src/routerClient.mjs'
import logger from './src/logger.mjs'

// Home Assistant add-on configuration
let configFilePath = '/app/config.json';

try {
  const rawConfig = fs.readFileSync(configFilePath);
  const config = JSON.parse(rawConfig);
  
  logger.info('Configuration loaded successfully');
  logger.info(`Router URL: ${config.url}`);
  logger.info(`Router Login: ${config.login}`);
  logger.info('Router Password: [REDACTED]');
  logger.info(`Default Recipient: ${config.default_recipient}`);
  
  // Set up Express app
  const app = express();
  
  // Initialize router client
  const client = new RouterClient(config.url, config.login, config.password);
  
  // Configure Express
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(nocache());
  app.set('router_client', client);
  app.disable('x-powered-by');
  
  // Import routes
  import smsRoutes from './src/controllers/sms.mjs';
  import monitoringRoutes from './src/controllers/monitoring.mjs';
  
  // Basic authentication - use Home Assistant API password if available
  const users = {};
  users[config.api_username || 'admin'] = config.api_password || 'admin';
  
  const authentication = expressBasicAuth({
    users: users,
    challenge: true,
  });
  
  // Set up routes
  app.use('/api/v1/sms', authentication, smsRoutes);
  app.use('/api/v1/monitoring', authentication, monitoringRoutes);
  
  // Set up Swagger documentation
  const options = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Router SMS Bridge API",
        version: "1.0.0",
        description: "Home Assistant Add-on API Bridge for SMS Router",
      },
      servers: [
        {
          url: `/api/v1`
        }
      ]
    },
    apis: ['./src/controllers/*']
  };
  
  const specs = swaggerJsdoc(options);
  
  app.use("/", swaggerUi.serve);
  app.get(
    "/",
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'SMS Router API Bridge',
    })
  );
  
  // Add Home Assistant service for sending SMS
  // This is a simple webhook endpoint that Home Assistant can call
  app.post('/api/service/send_sms', authentication, async (req, res) => {
    try {
      const { recipient, message } = req.body;
      
      if (!recipient || !message) {
        return res.status(400).json({ error: 'Recipient and message are required' });
      }
      
      const phoneNumber = recipient || config.default_recipient;
      
      // Use the router client to send the SMS
      const client = req.app.get('router_client');
      const result = await client.sendSMS(phoneNumber, message);
      
      logger.info(`SMS sent to ${phoneNumber}: ${message}`);
      
      return res.json({ 
        success: true, 
        message: 'SMS sent successfully',
        details: result
      });
    } catch (error) {
      logger.error('Error sending SMS:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  // Start the server
  const host = config.api_listen_host || '0.0.0.0';
  const port = config.api_listen_port || 3000;
  
  app.listen(port, host, () => {
    logger.info(`SMS Router API bridge listening at http://${host}:${port}`);
    logger.info('Add-on started successfully');
  });
  
} catch(exception) {
  logger.error('Error starting add-on:', exception);
  logger.error('Config file ' + configFilePath + ' could not be read, exiting');
  process.exit(1);
}
