# SBFC YouTube Automation

全自动 YouTube 视频生成和上传系统 - 24/7 运行

## 功能特性

- ✅ 每日自动生成 5 个 Shorts + 2 个 Regular 视频
- ✅ 自动上传到 YouTube
- ✅ 阿拉伯语诵读 + 孟加拉语/英语翻译
- ✅ SEO 优化标题和描述
- ✅ 连接 sbfcorgs.com 品牌

## 项目结构

```
sbfc-youtube-automation/
├── src/                    # 源代码
│   ├── uploader.js         # YouTube 上传器
│   ├── renderer.js         # 视频渲染器
│   └── planner.js          # 内容规划器
├── config/                 # 配置文件
│   ├── channels.json       # YouTube 频道配置
│   └── schedule.json       # 定时任务配置
├── workflows/              # n8n 工作流
│   ├── A-planner.json      # 内容规划工作流
│   ├── B-shorts.json       # Shorts 生成工作流
│   └── C-regular.json      # Regular 生成工作流
├── scripts/                # 部署脚本
│   ├── setup.sh            # 初始安装
│   └── deploy.sh           # 部署到服务器
└── docs/                   # 文档
    └── SETUP.md            # 安装指南
```

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/sbfc-youtube-automation.git
cd sbfc-youtube-automation
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置

复制配置文件并填入你的 API 密钥：

```bash
cp config/channels.json.example config/channels.json
# 编辑 config/channels.json
```

### 4. 启动

```bash
npm start
```

## 部署选项

### Option 1: Oracle Cloud (推荐 - 免费)

```bash
# 在 Oracle Cloud VM 上运行
./scripts/setup-oracle.sh
```

### Option 2: 本地 PC (需要保持开机)

```bash
# Windows Task Scheduler 自动启动
./scripts/setup-windows.bat
```

### Option 3: Docker

```bash
docker-compose up -d
```

## 定时任务

| 任务 | 时间 (Dubai) | 说明 |
|------|--------------|------|
| A: 内容规划 | 03:00 | 生成次日计划 |
| B: Shorts | 05:00 | 生成 5 个 Shorts |
| C: Regular | 05:30 | 生成 2 个 Regular |
| D: 报告 | 23:00 | 每日报告 |

## 环境变量

```env
# YouTube API
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REFRESH_TOKEN=your_refresh_token

# 内容源
QURAN_API_BASE=https://api.alquran.cloud/v1
RECITATION_EDITION=ar.alafasy

# 品牌
BRAND_NAME=SBFC Organization
WEBSITE_URL=https://sbfcorgs.com
```

## GitHub Actions (CI/CD)

项目支持自动部署：

1. Push 到 main 分支
2. 自动运行测试
3. 自动部署到服务器

## 许可证

MIT License

## 联系方式

- 网站: https://sbfcorgs.com
- YouTube: https://youtube.com/@sbfcorganization2085
