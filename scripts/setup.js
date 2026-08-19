/**
 * SBFC YouTube Automation - Setup Script
 * Run this once to initialize the project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║           SBFC YouTube Automation - Setup                  ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');

// Step 1: Check Node.js version
console.log('1️⃣  Checking Node.js version...');
try {
  const version = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`   ✅ Node.js ${version}`);
} catch (e) {
  console.error('   ❌ Node.js not found. Please install Node.js 18+');
  process.exit(1);
}

// Step 2: Install dependencies
console.log('\n2️⃣  Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('   ✅ Dependencies installed');
} catch (e) {
  console.error('   ❌ Failed to install dependencies');
  process.exit(1);
}

// Step 3: Create config file
console.log('\n3️⃣  Creating configuration...');
const configPath = path.join(__dirname, '..', 'config', 'channels.json');
if (!fs.existsSync(configPath)) {
  const config = {
    youtube: {
      clientId: process.env.YOUTUBE_CLIENT_ID || '',
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
      refreshToken: process.env.YOUTUBE_REFRESH_TOKEN || ''
    },
    brand: {
      name: 'SBFC Organization',
      website: 'https://sbfcorgs.com',
      quranUrl: 'https://sbfcorgs.com/quran'
    }
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('   ✅ Config file created at config/channels.json');
  console.log('   ⚠️  Please edit config/channels.json with your YouTube credentials');
} else {
  console.log('   ✅ Config file already exists');
}

// Step 4: Create .env file
console.log('\n4️⃣  Creating environment file...');
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# SBFC YouTube Automation - Environment Variables

# YouTube API Credentials
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REFRESH_TOKEN=your_refresh_token_here

# Content Source
QURAN_API_BASE=https://api.alquran.cloud/v1
RECITATION_EDITION=ar.alafasy

# Brand
BRAND_NAME=SBFC Organization
WEBSITE_URL=https://sbfcorgs.com

# Schedule (Dubai time)
SCHEDULE_TIMEZONE=Asia/Dubai
`;
  fs.writeFileSync(envPath, envContent);
  console.log('   ✅ .env file created');
  console.log('   ⚠️  Please edit .env with your actual values');
} else {
  console.log('   ✅ .env file already exists');
}

// Step 5: Create data directory
console.log('\n5️⃣  Creating data directory...');
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('   ✅ Data directory created');
} else {
  console.log('   ✅ Data directory exists');
}

console.log('');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║                    Setup Complete!                         ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');
console.log('Next steps:');
console.log('1. Edit config/channels.json with your YouTube credentials');
console.log('2. Edit .env with your environment variables');
console.log('3. Run: npm start');
console.log('');
console.log('For more information, see docs/SETUP.md');
