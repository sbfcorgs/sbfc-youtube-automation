#!/bin/bash
# SBFC YouTube Automation - Server Setup (No Sudo)
# Uses nvm for Node.js installation

echo "🚀 Setting up SBFC YouTube Automation (no sudo)..."

# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version
npm --version

echo ""
echo "✅ Node.js installed!"
echo ""
echo "Now install ffmpeg (needs sudo - ask admin):"
echo "  sudo apt install -y ffmpeg"
echo ""
echo "Or skip ffmpeg for now - YouTube upload doesn't need it."
