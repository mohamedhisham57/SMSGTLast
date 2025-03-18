FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy application code (make sure this includes run.sh)
COPY . .

# Set execute permissions explicitly
RUN chmod +x /app/run.sh

# Command to run when container starts
CMD [ "/app/run.sh" ]
