FROM node:18-alpine

# Install jq for JSON processing
RUN apk add --no-cache jq bash

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install --production

# Copy the rest of the application
COPY . .

# Create required directories
RUN mkdir -p /data

# If you have a default config, copy it to the expected location
# (Replace this with your actual default config if available)
RUN echo '{"router_url": "http://default", "router_login": "admin", "router_password": "password", "default_recipient": "12345"}' > /data/options.json

# Make sure run.sh is executable
RUN chmod +x run.sh

# Run the script
CMD ["/bin/bash", "/app/run.sh"]
