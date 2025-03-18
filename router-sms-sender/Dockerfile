# Use Node.js Alpine as base image
FROM node:lts-alpine

# Set working directory inside the container
WORKDIR /home/node/SMSGTLast/router-sms-sender

# Copy the correct folder structure from the repository
COPY SMSGTLast/router-sms-sender /home/node/SMSGTLast/router-sms-sender

# Install dependencies
RUN npm install --production

# Expose API port (if necessary)
EXPOSE 3000

# Run the server
CMD ["node", "server.js"]
