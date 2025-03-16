FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (changed from npm ci)
RUN npm install --production

# Copy application code
COPY . .

# Set execute permissions on entry script
RUN chmod +x run.sh

# Command to run when container starts
CMD [ "/app/run.sh" ]
