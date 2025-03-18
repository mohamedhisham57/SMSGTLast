FROM node:18-alpine

# Set working directory - let's use /app as a standard practice
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy application code (including run.sh)
COPY . .

# Set execute permissions on entry script
RUN chmod +x run.sh

# Command to run when container starts
CMD ["./run.sh"]
