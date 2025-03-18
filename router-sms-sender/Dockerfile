FROM node:18-alpine

# Add labels for Home Assistant
LABEL io.hass.name="SMS Router Bridge" \
      io.hass.description="Send SMS messages through your router" \
      io.hass.version="1.0.0" \
      io.hass.type="addon" \
      io.hass.arch="aarch64,amd64,armhf,armv7,i386"

# Install required packages
RUN apk add --no-cache bash jq curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Make scripts executable
RUN chmod +x run.sh

# Run the script
CMD [ "/bin/bash", "/app/run.sh" ]
