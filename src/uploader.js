/**
 * SBFC YouTube Uploader
 * Handles video uploads to YouTube via OAuth2
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class YouTubeUploader {
  constructor(config) {
    this.config = config;
    this.accessToken = null;
  }

  /**
   * Refresh OAuth2 access token
   */
  async refreshToken() {
    const { clientId, clientSecret, refreshToken } = this.config.oauth;
    
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });

    const response = await this.post('https://oauth2.googleapis.com/token', params.toString());
    
    if (response.status === 200) {
      this.accessToken = JSON.parse(response.body).access_token;
      console.log('✅ Token refreshed');
      return true;
    } else {
      console.error('✗ Token refresh failed:', response.body);
      return false;
    }
  }

  /**
   * Upload video to YouTube
   */
  async uploadVideo(filePath, metadata) {
    if (!this.accessToken) {
      await this.refreshToken();
    }

    const videoSize = fs.statSync(filePath).size;
    
    // Initialize resumable upload
    const initBody = JSON.stringify({
      snippet: {
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
        categoryId: metadata.categoryId || '29'
      },
      status: {
        privacyStatus: metadata.privacy || 'public',
        selfDeclaredMadeForKids: false
      }
    });

    const initResponse = await this.request({
      hostname: 'www.googleapis.com',
      path: '/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': videoSize,
        'X-Upload-Content-Type': 'video/mp4'
      }
    }, initBody);

    if (initResponse.status !== 200) {
      throw new Error('Init failed: ' + initResponse.body);
    }

    const uploadUrl = initResponse.headers.location;

    // Upload the video file
    return new Promise((resolve, reject) => {
      const uploadReq = https.request(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Length': videoSize,
          'Content-Type': 'video/mp4'
        }
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            const result = JSON.parse(data);
            resolve(result.id);
          } else {
            reject(new Error('Upload failed: ' + res.statusCode));
          }
        });
      });

      uploadReq.on('error', reject);
      fs.createReadStream(filePath).pipe(uploadReq);
    });
  }

  /**
   * Helper: POST request
   */
  post(url, body) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const req = https.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  /**
   * Helper: Generic request
   */
  request(options, body) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
      });
      req.on('error', reject);
      if (body) req.write(body);
      req.end();
    });
  }
}

module.exports = YouTubeUploader;
