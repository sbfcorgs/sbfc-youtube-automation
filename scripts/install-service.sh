#!/bin/bash
# Install SBFC YouTube Automation as systemd service

# Create service file
sudo tee /etc/systemd/system/sbfc-youtube.service > /dev/null << EOF
[Unit]
Description=SBFC YouTube Automation
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/sbfc-youtube
ExecStart=/home/ubuntu/.nvm/versions/node/v20.20.2/bin/node src/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable sbfc-youtube.service

# Start service
sudo systemctl start sbfc-youtube.service

echo "✅ Service installed and started!"
echo ""
echo "Commands:"
echo "  sudo systemctl status sbfc-youtube"
echo "  sudo systemctl restart sbfc-youtube"
echo "  sudo systemctl stop sbfc-youtube"
echo "  journalctl -u sbfc-youtube -f"
