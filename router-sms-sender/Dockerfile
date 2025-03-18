FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy individual files to ensure they're included
COPY package.json ./
COPY run.sh ./
COPY server.js ./
COPY src/ ./src/

# Install dependencies
RUN npm install --production

# Make run.sh executable
RUN chmod +x ./run.sh

# Print directory contents for debugging
RUN ls -la

# Command to run when container starts
CMD [ "sh", "/app/run.sh" ]
