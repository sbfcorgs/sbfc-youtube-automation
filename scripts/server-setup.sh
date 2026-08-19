#!/bin/bash
# SBFC YouTube Automation - Server Setup Script
# Run this on Oracle Cloud server

echo "🚀 Setting up SBFC YouTube Automation..."

# Update system
sudo apt update -y
sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install ffmpeg
sudo apt install -y ffmpeg

# Install git (already installed)
git --version

# Verify installations
echo ""
echo "✅ Installation complete!"
node --version
npm --version
ffmpeg -version 2>&1 | head -1
git --version

# Create project directory
mkdir -p ~/sbfc-youtube
cd ~/sbfc-youtube

# Clone the repository
git clone https://github.com/sbfcorgs/sbfc-youtube-automation.git .

# Install dependencies
npm install

# Create data directory
mkdir -p data

echo ""
echo "✅ SBFC YouTube Automation ready!"
echo "📁 Location: ~/sbfc-youtube"
echo ""
echo "Next steps:"
echo "1. Add YouTube credentials"
echo "2. Start the service"
