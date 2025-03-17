#!/bin/bash
set -e
CONFIG_PATH=/data/options.json

echo "Contents of $CONFIG_PATH:"
cat $CONFIG_PATH

# Create config file from Home Assistant options
jq '{
  "url": .router_url,
  "login": .router_login,
  "password": .router_password,
  "default_recipient": .default_recipient
}' $CONFIG_PATH > /app/config.json

echo "Generated config.json:"
cat /app/config.json

# Start the addon service
cd /app
node server.js
