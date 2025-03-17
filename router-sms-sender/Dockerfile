FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install --production

# Copy the rest of the application
COPY . .

# Make sure run.sh is executable (just to be safe)
RUN chmod +x run.sh

# Run the script - use the absolute path
CMD ["/app/run.sh"]
