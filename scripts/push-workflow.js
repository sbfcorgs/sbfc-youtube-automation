const https = require('https');
const fs = require('fs');
const path = require('path');

// GitHub token from gh CLI
const { execSync } = require('child_process');
const token = execSync('gh auth token', { encoding: 'utf-8' }).trim();

const owner = 'sbfcorgs';
const repo = 'sbfc-youtube-automation';
const filePath = '.github/workflows/deploy.yml';
const fileContent = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf-8');

// Base64 encode the content
const contentBase64 = Buffer.from(fileContent).toString('base64');

const data = JSON.stringify({
  message: 'ci: add GitHub Actions workflow for deployment',
  content: contentBase64,
  branch: 'master'
});

const options = {
  hostname: 'api.github.com',
  path: `/repos/${owner}/${repo}/contents/${filePath}`,
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'User-Agent': 'sbfc-youtube-automation',
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log('✅ Workflow file pushed to GitHub!');
      console.log(`   https://github.com/${owner}/${repo}/blob/master/${filePath}`);
    } else {
      console.log('❌ Failed:', res.statusCode);
      console.log(body);
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
