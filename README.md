# 🎮 YouTube GTA-RP Live Stream Tracker

A complete MVP for tracking YouTube live streams filtered by hashtags (specifically for GTA-RP content). Features a Node.js/Express backend with YouTube Data API v3 integration and a modern, responsive frontend.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Get YouTube API Key](#1-get-youtube-api-key)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
  - [Backend Deployment (Render/Railway)](#backend-deployment-renderrailway)
  - [Frontend Deployment (Netlify/Vercel)](#frontend-deployment-netlifyvercel)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **Real-time Live Stream Tracking**: Fetches live YouTube streams based on configurable hashtags
- **30-Second Server-Side Caching**: Reduces API calls and improves performance
- **Auto-Refresh Frontend**: Updates every 10 seconds without page reload
- **Search & Filter**: Search streams by title or channel name
- **Multiple Sort Options**: Sort by viewers, time, or channel name
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Error Handling**: Graceful error handling with user-friendly messages
- **CORS Enabled**: Ready for cross-origin requests

## 📁 Project Structure

```
project/
├── backend/
│   ├── server.js              # Main Express server
│   ├── routes/
│   │   └── live.js            # API route for live streams
│   ├── utils/
│   │   ├── youtubeApi.js      # YouTube API integration
│   │   └── cache.js           # In-memory caching utility
│   ├── package.json           # Backend dependencies
│   ├── env.example            # Environment variables template
│   └── .env                   # Your actual environment variables (create this)
├── frontend/
│   ├── index.html             # Main HTML file
│   ├── script.js              # Frontend JavaScript
│   ├── styles.css             # Styling
│   └── README.md              # Frontend-specific docs (optional)
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🔧 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **YouTube Data API v3 Key** (free tier available)
- A modern web browser

## 🚀 Getting Started

### 1. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Navigate to **APIs & Services** > **Library**
   - Search for "YouTube Data API v3"
   - Click **Enable**
4. Create credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **API Key**
   - Copy your API key
   - (Optional) Restrict the API key to YouTube Data API v3 for security

**Note**: The free tier provides 10,000 units per day. Each search request costs 100 units, so you can make approximately 100 searches per day.

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp env.example .env
   ```

4. Edit `.env` and add your YouTube API key:
   ```env
   YOUTUBE_API_KEY=your_actual_api_key_here
   PORT=3000
   HASHTAGS=#gtarp,#gta,#roleplay,#rp
   CACHE_DURATION=30000
   ```

5. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

6. Verify the server is running:
   - Open http://localhost:3000/health
   - You should see: `{"status":"ok",...}`

### 3. Frontend Setup

1. Navigate to the frontend directory (or open `frontend/index.html` directly)

2. **Option A: Simple File Server (Recommended for Development)**
   
   If you're running the backend on `localhost:3000`, you can open the HTML file directly or use a simple HTTP server:
   
   ```bash
   # Using Python 3
   cd frontend
   python3 -m http.server 8000
   
   # Or using Node.js http-server
   npx http-server -p 8000
   ```
   
   Then open http://localhost:8000 in your browser.

3. **Option B: Update API URL**
   
   If your backend is running on a different URL, edit `frontend/script.js` and update the `API_URL` constant:
   ```javascript
   const API_URL = 'http://your-backend-url/api/live';
   ```

4. Open the frontend in your browser and you should see live streams!

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `YOUTUBE_API_KEY` | Your YouTube Data API v3 key (required) | - |
| `PORT` | Server port | `3000` |
| `HASHTAGS` | Comma-separated hashtags to search | `#gtarp,#gta,#roleplay,#rp` |
| `CACHE_DURATION` | Cache duration in milliseconds | `30000` (30 seconds) |

### Frontend Configuration

Edit `frontend/script.js`:

- `API_URL`: Backend API endpoint URL
- `REFRESH_INTERVAL`: Auto-refresh interval in milliseconds (default: 10000 = 10 seconds)

## 📖 Usage

1. **Specify Hashtags**: 
   - **Via Frontend**: Enter hashtags in the "Hashtags" input field (comma-separated, e.g., `#gtarp, #gta, #roleplay`)
   - **Via API**: Add `?hashtags=#tag1,#tag2` to the API URL
   - **Via .env**: Set `HASHTAGS` in your backend `.env` file (default if no query parameter)
   - Leave the frontend hashtag field empty to use defaults from `.env`

2. **View Live Streams**: The dashboard automatically displays all live streams matching your specified hashtags.

3. **Search**: Use the search bar to filter streams by title or channel name (filters the displayed results, not the API query).

4. **Sort**: Use the dropdown to sort by:
   - Viewers (High to Low / Low to High)
   - Time (Newest / Oldest)
   - Channel (A-Z / Z-A)

5. **Open Stream**: Click any stream card to open it in YouTube.

6. **Auto-Refresh**: The page automatically refreshes every 10 seconds to show new streams.

## 🚢 Deployment

### Backend Deployment (Render/Railway)

#### Option 1: Render

1. Push your code to GitHub
2. Go to [Render](https://render.com/) and sign up/login
3. Click **New** > **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `youtube-live-tracker-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to `backend` if deploying only backend)
6. Add environment variables:
   - `YOUTUBE_API_KEY`: Your API key
   - `PORT`: `3000` (or leave default)
   - `HASHTAGS`: `#gtarp,#gta,#roleplay,#rp`
   - `CACHE_DURATION`: `30000`
7. Click **Create Web Service**
8. Copy your service URL (e.g., `https://your-app.onrender.com`)

#### Option 2: Railway

1. Push your code to GitHub
2. Go to [Railway](https://railway.app/) and sign up/login
3. Click **New Project** > **Deploy from GitHub repo**
4. Select your repository
5. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
6. Add environment variables in the **Variables** tab:
   - `YOUTUBE_API_KEY`
   - `PORT` (optional, defaults to Railway's port)
   - `HASHTAGS`
   - `CACHE_DURATION`
7. Railway will automatically deploy and provide a URL

### Frontend Deployment (Netlify/Vercel)

#### Option 1: Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://www.netlify.com/) and sign up/login
3. Click **Add new site** > **Import an existing project**
4. Connect your GitHub repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: Leave empty (no build needed)
   - **Publish directory**: `frontend`
6. Before deploying, update `frontend/script.js`:
   ```javascript
   const API_URL = 'https://your-backend-url.onrender.com/api/live';
   ```
7. Click **Deploy site**
8. Your site will be live at `https://your-site.netlify.app`

#### Option 2: Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/) and sign up/login
3. Click **Add New Project**
4. Import your GitHub repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: `frontend`
6. Update `frontend/script.js` with your backend URL
7. Click **Deploy**

#### Option 3: Simple Static Hosting

You can also deploy the frontend to any static hosting service:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Any web server

Just make sure to update the `API_URL` in `script.js` to point to your deployed backend.

## 🔌 API Endpoints

### GET `/api/live`

Fetches live YouTube streams based on configured hashtags.

**Query Parameters:**
- `hashtags` (optional): Comma-separated hashtags to search for (e.g., `?hashtags=#gtarp,#gta`)
  - If not provided, uses `HASHTAGS` from `.env` or defaults to `#gtarp,#gta,#roleplay,#rp`

**Examples:**
```
GET /api/live
GET /api/live?hashtags=#gtarp,#gta
GET /api/live?hashtags=#roleplay,#rp,#fivem
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "videoId": "abc123",
      "title": "Stream Title",
      "channelName": "Channel Name",
      "channelId": "UC...",
      "thumbnail": "https://...",
      "viewerCount": 1234,
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "streamUrl": "https://www.youtube.com/watch?v=abc123",
      "tags": ["tag1", "tag2"],
      "description": "Stream description"
    }
  ],
  "cached": false,
  "count": 1,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "YouTube Live Stream Tracker API"
}
```

## 🐛 Troubleshooting

### Backend Issues

**Error: "YouTube API key not configured"**
- Make sure you created a `.env` file in the `backend` directory
- Verify `YOUTUBE_API_KEY` is set correctly
- Restart the server after changing `.env`

**Error: "API quota exceeded"**
- You've exceeded the free tier limit (10,000 units/day)
- Wait 24 hours or upgrade to a paid plan
- Consider increasing `CACHE_DURATION` to reduce API calls

**Error: "Invalid request"**
- Check that your API key has YouTube Data API v3 enabled
- Verify the API key is not restricted incorrectly

**CORS Errors**
- Make sure `cors` middleware is enabled in `server.js`
- Check that your frontend URL is allowed (if CORS is restricted)

### Frontend Issues

**No streams showing**
- Check browser console for errors
- Verify backend is running and accessible
- Check that `API_URL` in `script.js` matches your backend URL
- Ensure your YouTube API key is valid and has quota remaining

**Streams not updating**
- Check browser console for errors
- Verify the auto-refresh interval is working
- Check network tab to see if API calls are being made

**CORS Errors**
- Make sure backend has CORS enabled
- If deploying, ensure backend URL is correct in `script.js`

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ for the GTA-RP community**

