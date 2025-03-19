# syntax=docker/dockerfile:1
FROM node:lts-alpine

# Set working directory
WORKDIR /home/node

# Install required utilities
RUN apk --no-cache add curl unzip

# Download and extract the source code
RUN curl -s -L -O "https://github.com/plewin/tp-link-modem-router/archive/master.zip"
RUN unzip master.zip
WORKDIR /home/node/tp-link-modem-router-master

# Install dependencies
RUN yarn install
RUN npm install --production && npm install jsbn js-yaml

# Copy config.json into the container
COPY ./config.json /home/node/tp-link-modem-router-master/config.json

# Set permissions after copying
RUN chmod 644 /home/node/tp-link-modem-router-master/config.json

# Expose port for API
EXPOSE 3000

# Start the application
CMD ["node", "api-bridge.js"]
