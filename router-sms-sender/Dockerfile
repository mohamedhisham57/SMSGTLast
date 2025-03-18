FROM node:18-alpine

# Install bash for better debugging
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Print directory structure for debugging
RUN echo "==== Directory structure after COPY ===="
RUN find . -type f | sort

# Check if run.sh exists and make it executable wherever it is
RUN find . -name "run.sh" -exec chmod +x {} \;
RUN find . -name "run.sh" -exec echo "Found run.sh at: {}" \;

# Create a simple debug script in case run.sh is not found
RUN echo '#!/bin/sh' > debug-entrypoint.sh
RUN echo 'echo "Current directory: $(pwd)"' >> debug-entrypoint.sh
RUN echo 'echo "Directory contents:"' >> debug-entrypoint.sh
RUN echo 'ls -la' >> debug-entrypoint.sh
RUN echo 'echo "Searching for run.sh:"' >> debug-entrypoint.sh
RUN echo 'find / -name "run.sh" 2>/dev/null || echo "No run.sh found"' >> debug-entrypoint.sh
RUN echo 'echo "Environment variables:"' >> debug-entrypoint.sh
RUN echo 'env' >> debug-entrypoint.sh
RUN echo 'echo "Attempting to run node directly..."' >> debug-entrypoint.sh
RUN echo 'if [ -f "index.js" ]; then node index.js; elif [ -d "SMSGTLast/router-sms-sender" ]; then cd SMSGTLast/router-sms-sender && ls -la && ([ -f "index.js" ] && node index.js || echo "No index.js found"); else echo "Cannot find entry point"; fi' >> debug-entrypoint.sh
RUN chmod +x debug-entrypoint.sh

# Try to find the actual entry point
CMD ["./debug-entrypoint.sh"]
