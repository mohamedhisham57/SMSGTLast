#!/bin/bash
set -e

CONFIG_PATH=/data/options.json
echo "Starting SMS Router Bridge add-on..."

# Debug: Show the contents of the config file
echo "Contents of $CONFIG_PATH:"
cat $CONFIG_PATH

# Create config file from Home Assistant options
jq '{
  "url": .router_url,
  "login": .router_login,
  "password": .router_password,
  "default_recipient": .default_recipient,
  "api_listen_host": .api_listen_host,
  "api_listen_port": .api_listen_port,
  "api_username": .api_username,
  "api_password": .api_password
}' $CONFIG_PATH > /app/config.json

echo "Generated config.json:"
cat /app/config.json

# Test connectivity to the router
echo "Testing connectivity to router..."
ROUTER_URL=$(jq -r .url /app/config.json)
curl -s -o /dev/null -w "Router connectivity test: %{http_code}\n" --connect-timeout 5 $ROUTER_URL || echo "Warning: Could not connect to router at $ROUTER_URL"

# Start the addon service
cd /app
echo "Starting Node.js application..."
node server.js
