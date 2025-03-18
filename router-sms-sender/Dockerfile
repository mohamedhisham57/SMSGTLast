# syntax=docker/dockerfile:1
FROM node:lts-alpine

# Set working directory
WORKDIR /home/node

# Install dependencies
RUN apk --no-cache add curl
RUN curl -s -L -O "https://github.com/plewin/tp-link-modem-router/archive/master.zip"
RUN unzip master.zip

WORKDIR /home/node/tp-link-modem-router-master
RUN yarn install

# Second stage for building final image
FROM node:lts-alpine
WORKDIR /home/node/tp-link-modem-router-master

# Copy built files from the previous stage
COPY --from=0 /home/node/tp-link-modem-router-master .

# Copy the configuration file
COPY config.json /home/node/tp-link-modem-router-master/config.json

# Expose the port for external access
EXPOSE 3000

# Start the API server
CMD ["node", "server.js"]
