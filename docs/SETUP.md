# SBFC YouTube Automation - Setup Guide

## Prerequisites

- Node.js 18+ installed
- YouTube API credentials (OAuth2)
- n8n (optional, for workflow management)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/sbfc-youtube-automation.git
cd sbfc-youtube-automation
```

### 2. Run setup script

```bash
npm run setup
```

This will:
- Install dependencies
- Create configuration files
- Set up environment variables

### 3. Configure YouTube API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create OAuth2 credentials
5. Update `config/channels.json` with your credentials

### 4. Start the system

```bash
npm start
```

## Deployment Options

### Option 1: Oracle Cloud (Recommended - Free)

Oracle Cloud offers Always Free tier with 4 ARM CPU and 24GB RAM.

1. Create Oracle Cloud account at https://cloud.oracle.com/free
2. Create Ubuntu VM instance
3. SSH into the server
4. Clone and setup the project

```bash
ssh ubuntu@your-server-ip
git clone https://github.com/YOUR_USERNAME/sbfc-youtube-automation.git
cd sbfc-youtube-automation
./scripts/setup-oracle.sh
```

### Option 2: Local PC (Windows)

1. Install Node.js
2. Clone the repository
3. Run setup
4. Use Task Scheduler for auto-start

```bash
# Create startup script
./scripts/setup-windows.bat
```

### Option 3: Docker

```bash
docker-compose up -d
```

## Configuration

### Environment Variables (.env)

```env
# YouTube API
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REFRESH_TOKEN=your_refresh_token

# Content
QURAN_API_BASE=https://api.alquran.cloud/v1
RECITATION_EDITION=ar.alafasy

# Brand
BRAND_NAME=SBFC Organization
WEBSITE_URL=https://sbfcorgs.com
```

### Config File (config/channels.json)

```json
{
  "youtube": {
    "clientId": "your_client_id",
    "clientSecret": "your_client_secret",
    "refreshToken": "your_refresh_token"
  },
  "brand": {
    "name": "SBFC Organization",
    "website": "https://sbfcorgs.com",
    "quranUrl": "https://sbfcorgs.com/quran"
  }
}
```

## Schedule

| Task | Time (Dubai) | Description |
|------|--------------|-------------|
| Planner | 03:00 | Generate next day's content plan |
| Shorts | 05:00 | Generate 5 shorts videos |
| Regular | 05:30 | Generate 2 regular videos |
| Report | 23:00 | Send daily report |

## GitHub Integration

### Setting up GitHub Actions

1. Push code to GitHub repository
2. Go to Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `SERVER_HOST`: Your server IP
   - `SERVER_USER`: SSH username
   - `SSH_KEY`: SSH private key

### Auto-Deployment

When you push to main branch:
1. Tests run automatically
2. If tests pass, code deploys to server
3. Server restarts the automation service

## Troubleshooting

### Common Issues

1. **Token refresh failed**
   - Check if credentials are correct
   - Re-authenticate with Google

2. **Video render failed**
   - Check ffmpeg is installed
   - Verify audio files exist

3. **Upload failed**
   - Check YouTube API quota
   - Verify OAuth2 scopes

### Logs

Logs are stored in `logs/` directory:
- `combined.log`: All logs
- `error.log`: Error logs only

## Support

- Website: https://sbfcorgs.com
- YouTube: https://youtube.com/@sbfcorganization2085
