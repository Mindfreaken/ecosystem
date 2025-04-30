#!/bin/bash

# MediaSoupCalling GCP Setup Script
# This script sets up the MediaSoup server on a GCP instance

# Exit on any error
set -e

echo "Setting up MediaSoupCalling server on GCP..."

# Update system packages
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 16.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

# Install PM2 for process management
echo "Installing PM2..."
sudo npm install -g pm2

# Install ts-node for TypeScript execution
echo "Installing ts-node..."
sudo npm install -g ts-node

# Install dependencies
echo "Installing project dependencies..."
npm install

# Get the VM's external IP address
EXTERNAL_IP=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip)

# Update MediaSoup configuration with the external IP
echo "Updating MediaSoup configuration with external IP: $EXTERNAL_IP"
sed -i "s/announcedIp: null/announcedIp: '$EXTERNAL_IP'/g" src/server/config.ts

# Start the server with PM2
echo "Starting MediaSoup server with PM2..."
pm2 start src/server/mediasoup-server.ts --interpreter ./node_modules/.bin/ts-node --name mediasoupcalling

# Save the PM2 process list
echo "Saving PM2 process list..."
pm2 save

# Make PM2 start on system boot
echo "Setting up PM2 to start on system boot..."
pm2 startup

echo "Setup completed successfully!"
echo "The MediaSoup server is now running at http://$EXTERNAL_IP:3000"
echo "Use the following in your client application:"
echo "REACT_APP_SERVER_URL=http://$EXTERNAL_IP:3000" 