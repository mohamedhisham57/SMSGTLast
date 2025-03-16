FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Set execute permissions on entry script
RUN chmod +x run.sh

# Command to run when container starts
CMD [ "/app/run.sh" ]
