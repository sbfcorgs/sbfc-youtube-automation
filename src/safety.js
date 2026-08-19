/**
 * SBFC YouTube Automation - Safety Module
 * 
 * This module ensures:
 * 1. Isolation from sbfcorgs.com
 * 2. Database integrity
 * 3. Upload limits
 * 4. Error handling
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

class SafetyManager {
  constructor(configPath) {
    this.config = this.loadConfig(configPath);
    this.uploadCount = 0;
    this.lastUploadTime = 0;
  }

  /**
   * Load safety configuration
   */
  loadConfig(configPath) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config.safety || {};
    } catch (e) {
      console.warn('Warning: Could not load safety config, using defaults');
      return {
        enabled: true,
        maxUploadsPerDay: 10,
        minTimeBetweenUploadsMs: 60000
      };
    }
  }

  /**
   * Check if upload is allowed
   */
  canUpload() {
    if (!this.config.enabled) {
      return { allowed: true, reason: 'Safety disabled' };
    }

    // Check daily limit
    if (this.uploadCount >= (this.config.maxUploadsPerDay || 10)) {
      return { allowed: false, reason: 'Daily upload limit reached' };
    }

    // Check time between uploads
    const now = Date.now();
    const minInterval = this.config.minTimeBetweenUploadsMs || 60000;
    if (now - this.lastUploadTime < minInterval) {
      return { allowed: false, reason: 'Too soon since last upload' };
    }

    return { allowed: true, reason: 'OK' };
  }

  /**
   * Record upload
   */
  recordUpload() {
    this.uploadCount++;
    this.lastUploadTime = Date.now();
    console.log(`[SAFETY] Upload recorded. Count today: ${this.uploadCount}`);
  }

  /**
   * Create isolated database
   */
  createIsolatedDatabase(dbPath) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Create tables for YouTube automation only
        db.serialize(() => {
          db.run(`CREATE TABLE IF NOT EXISTS youtube_uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            tags TEXT,
            status TEXT DEFAULT 'pending',
            video_file TEXT,
            youtube_video_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`);

          db.run(`CREATE TABLE IF NOT EXISTS content_plan (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            slot_time TEXT,
            video_type TEXT,
            surah_name TEXT,
            ayah_number INTEGER,
            status TEXT DEFAULT 'pending'
          )`);

          db.run(`CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT,
            description TEXT
          )`, [], (err) => {
            if (err) reject(err);
            else resolve(db);
          });
        });
      });
    });
  }

  /**
   * Backup database before write
   */
  async backupDatabase(dbPath) {
    const backupDir = path.join(path.dirname(dbPath), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}.sqlite`);

    try {
      fs.copyFileSync(dbPath, backupPath);
      console.log(`[SAFETY] Database backed up to: ${backupPath}`);
      return backupPath;
    } catch (e) {
      console.warn(`[SAFETY] Backup failed: ${e.message}`);
      return null;
    }
  }

  /**
   * Verify database integrity
   */
  verifyDatabaseIntegrity(dbPath) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        db.run('PRAGMA integrity_check', (err, result) => {
          db.close();
          if (err) {
            reject(err);
          } else if (result && result.integrity_check === 'ok') {
            resolve(true);
          } else {
            reject(new Error('Database integrity check failed'));
          }
        });
      });
    });
  }

  /**
   * Check if URL is safe (not affecting sbfcorgs.com)
   */
  isUrlSafe(url) {
    const blockedDomains = [
      'sbfcorgs.com',
      'www.sbfcorgs.com'
    ];

    try {
      const urlObj = new URL(url);
      for (const domain of blockedDomains) {
        if (urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)) {
          return { safe: false, reason: `Blocked domain: ${domain}` };
        }
      }
      return { safe: true, reason: 'OK' };
    } catch (e) {
      return { safe: false, reason: 'Invalid URL' };
    }
  }

  /**
   * Reset daily counters
   */
  resetDailyCounters() {
    this.uploadCount = 0;
    console.log('[SAFETY] Daily counters reset');
  }
}

module.exports = SafetyManager;
